// Gauge variables
var cpuGauge,
	memoryGauge,
	CPU_THRESHOLD = 50,
	MEM_THRESHOLD = 80,
	MAX_CPU_UTILIZATION = 100;

// Initializes the gauge meter
function initGauge(gauge, initialVal, maxVal, gaugeElement, gaugeTextElement)
{
	var initialOptions = {
		lines: 20, // The number of lines to draw
		angle: 0, // The length of each line
		lineWidth: 0.45, // The line thickness
		pointer: {
			length: .85, // The radius of the inner circle
			strokeWidth: 0.025, // The rotation offset
			color: '#000000' // Fill color
		},
		limitMax: 'true',   // If true, the pointer will not go past the end of the gauge
		colorStart: '#12E84E',   // Colors
		colorStop: '#12E84E',    // just experiment with them
		strokeColor: '#E0E0E0',   // to see which ones work best for you
		generateGradient: true
	}
	gauge = new Gauge(document.getElementById(gaugeElement)).setOptions(initialOptions);
	gauge.setTextField(document.getElementById(gaugeTextElement));
	gauge.maxValue = maxVal;
	gauge.animationSpeed = 32;
	gauge.set(initialVal);
	return gauge;
};

// Update gauge values
function updateGauge(checkMem, gauge, curVal)
{
	gauge.set(curVal);

	var newColor;
	// If memory gauge
	if (checkMem)
	{
		// If value is under threshold, set gauge color to green. Otherwise, set to red
		if (curVal < MEM_THRESHOLD)
			newColor = '#12E84E';
		else
			newColor = '#FF0000';
	}
		// If CPU gauge
	else
	{
		// If value is under threshold, set gauge color to green. Otherwise, set to red
		if (curVal < CPU_THRESHOLD)
			newColor = '#12E84E';
		else
			newColor = '#FF0000';
	}

	// Set updated options for gauge
	var updatedOptions = {
		lines: 20,
		angle: 0,
		lineWidth: 0.45,
		pointer: {
			length: .85,
			strokeWidth: 0.025,
			color: '#000000'
		},
		limitMax: 'true',
		colorStart: newColor,
		colorStop: newColor,
		strokeColor: '#E0E0E0',
		generateGradient: true
	}

	gauge.setOptions(updatedOptions);

	return gauge;
}

// Defines the prototype for the gauge options
var optionsPrototype = {
	lines: 20, // The number of lines to draw
	angle: 0, // The length of each line
	lineWidth: 0.45, // The line thickness
	pointer: {
		length: .85, // The radius of the inner circle
		strokeWidth: 0.025, // The rotation offset
		color: '#000000' // Fill color
	},
	limitMax: 'true',   // If true, the pointer will not go past the end of the gauge
	colorStart: '#12E84E',   // Colors
	colorStop: '#12E84E',    // just experiment with them
	strokeColor: '#E0E0E0',   // to see which ones work best for you
	generateGradient: true
}

// Options object constructor
function Options ()
{

}
Options.prototype = optionsPrototype;

// Runs at the start of the webpage
$(function()
{
	// Set the initial CPU gauge parameters
	cpuGauge = initGauge(cpuGauge, initialCpuUsage, MAX_CPU_UTILIZATION, "canvas-gauge-1", "gauge-1-textfield");

	// Set the initial memory gauge parameters
	memoryGauge = initGauge(memoryGauge, initialUsedMem, totalMem, "canvas-gauge-2", "gauge-2-textfield");
});
