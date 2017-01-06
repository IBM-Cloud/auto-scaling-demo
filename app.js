var express = require('express'),
  bodyParser     = require("body-parser"),
  methodOverride = require("method-override"),
  app = express(),
  http = require("http"),
  io = require("socket.io"),
  dust = require("dustjs-linkedin"),
  consolidate = require("consolidate"),
  os = require("os"),
  util = require("util"),
  usage = require("usage"),
  CronJob = require("cron").CronJob;

//---Deployment Tracker---------------------------------------------------------
require("cf-deployment-tracker-client").track();

//---Set Constant Vars----------------------------------------------------------
var ZERO = 0,
  ONE_TENTH = .1,
  ONE = 1,
  ONE_HUNDRED = 100,
  FIVE_THOUSAND = 5000,
  ONE_MILLION = 1E6;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(methodOverride());

app.engine("dust", consolidate.dust);
app.set("template_engine", "dust");
app.set("views", __dirname + '/views');
app.set("view engine", "dust");

// Variables used to detect change in values
var prevTotalOsMem, prevFreeOsMem, prevOsMemUsed,
  prevHeapUsed, prevTotalHeap, prevResidentSetSize;

// Determines if the app is running locally and sets port, memory total, & instance index
var port, memLimit, instance, application;
if (process.env.VCAP_APPLICATION === undefined) {
  port = 8000;
  memLimit = 64;
  instance = -1;
}
else {
  port = process.env.PORT;
  application = process.env.VCAP_APPLICATION;
  memLimit = JSON.parse(process.env.VCAP_APPLICATION)['limits']['mem'];
  instance = JSON.parse(process.env.VCAP_APPLICATION)['instance_index'];
}

// Converts input bytes number to megabytes
function getMegaBytes(bytes) {
  return Math.round(bytes/ONE_MILLION);
}

// Gets the total memory of the OS in MB
function getTotalOSMem(setPrev) {
  //console.log("Total OS memory (B): ", getMegaBytes(os.totalmem()));
  if (setPrev)
    return prevTotalOsMem = getMegaBytes(os.totalmem());
  else
    return getMegaBytes(os.totalmem());
}

// Gets the free memory of the OS in MB
function getFreeOSMem(setPrev) {
  //console.log("Free OS mem (B): ", getMegaBytes(os.freemem()));
  if (setPrev)
    return prevFreeOsMem = getMegaBytes(os.freemem());
  else
    return getMegaBytes(os.freemem());
}

// Gets the used memory of the OS in MB
function getOSMemUsed(setPrev) {
  //console.log("OS memory being used (B): ", (getMegaBytes(os.totalmem()) - getMegaBytes(os.freemem())));
  if (setPrev)
    return prevOsMemUsed = getMegaBytes(os.totalmem()) - getMegaBytes(os.freemem());
  else
    return getMegaBytes(os.totalmem()) - getMegaBytes(os.freemem());
}

// Gets the heap usage in MB
function getHeapUsed(setPrev) {
  var memUsed = util.inspect(process.memoryUsage()).split(" ");
  //console.log("Heap used: ", getMegaBytes(memUsed[6]));

  if (setPrev)
    return prevHeapUsed = getMegaBytes(memUsed[6]);
  else
    return getMegaBytes(memUsed[6]);
}

// Gets the total heap size in MB
function getTotalHeapSize(setPrev) {
  var memUsed = util.inspect(process.memoryUsage()).split(" ");
  //console.log("Heap total:", getMegaBytes(memUsed[4].substr(0,memUsed[4].length-1)));
  if (setPrev)
    return prevTotalHeap = getMegaBytes(memUsed[4].substr(0,memUsed[4].length-1));
  else
    return getMegaBytes(memUsed[4].substr(0,memUsed[4].length-1));
}

// Gets the resident set size in MB
function getResidentSetSize(setPrev) {
  var memUsed = util.inspect(process.memoryUsage()).split(" ");
  //console.log("RSS:", getMegaBytes(memUsed[2].substr(0,memUsed[2].length-1)));
  if (setPrev)
    return prevResidentSetSize = getMegaBytes(memUsed[2].substr(0,memUsed[2].length-1));
  else
    return getMegaBytes(memUsed[2].substr(0,memUsed[2].length-1));
}

// Gets the CPU usage and emits an event with the utilization percentage
function getUsage() {
  var pid = process.pid;
  var options = { keepHistory: true };

  // Looks up CPU usage data and compares it against last retrieved value
  usage.lookup(pid, options, function(err, result) {
    var newAvgCpuUsage = Math.round(result.cpu);
    // If average CPU usage has changed, emit a cpuChange event
    if (newAvgCpuUsage > ONE_HUNDRED)
      newAvgCpuUsage = ONE_HUNDRED;
    else if (newAvgCpuUsage < ONE)
      newAvgCpuUsage = ONE;

    sio.emit("cpuUsage", { newCpuAvg: newAvgCpuUsage });
    //console.log("emitted CPU usage event ~ ", newAvgCpuUsage.toString() + "%");
  });
}

// Start the socket io server mounted on node
var server = http.Server(app),
    sio = io(server);

// Callback function for socket io connections
sio.on('connection', function(socket) {
    console.log('User connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

// Handles requests for the main page
app.get("/", function (request, response) {
    response.render('index', {
        instanceIndex : instance,
        memLimit : memLimit,
        memInUse : (getResidentSetSize(false) > memLimit) ? memLimit : getResidentSetSize(false),
        cpuUsage : ONE
    });
});

// Start the node server
server.listen(port, function() {
  console.log("server started on port " + port);
});


// Check for memory changes every second
var oldMem = getResidentSetSize(true),
  newMem,
  memCount = ZERO;
new CronJob('* * * * * *', function() {
  //console.log("Mem usage " + oldMem.toString() + " ~ " + memCount++);

  // Get previous and current memory values
  oldMem = prevResidentSetSize;
  newMem = getResidentSetSize(true);

  // If memory has changed, emit a memoryChange event
  if (oldMem !== newMem) {
    if (newMem > memLimit)
      newMem = memLimit;

    sio.emit("memoryChange", { newMem: newMem });
    //console.log("emitted " + memoryEventName + " event ~ " + newMem.toString() + "MB");
  }
}, null, true, "America/Los_Angeles");

// Check for average CPU usage changes every 5 seconds
new CronJob('*/5 * * * * *', function() {
    getUsage();
}, null, true, "America/Los_Angeles");
