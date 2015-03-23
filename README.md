# Overview

AutoScalingDemo is an app built on Node.js to demonstrate the ability
of the Auto-Scaling service in Bluemix. It will demonstrate how policies
defined in the Auto-Scaling service can horizontally scale any application
based on CPU utilization and memory usage. To showcase these features,
the application will contain visual gauges to indicate changing metrics in
the environment.


## Files

The Node.js application has files as below:

*   app.js

	This file contains the server side JavaScript code for the application written using the Node.js API

*   package.json

	This file is required by the Node.js environment. It specifies the Node.js project name, dependencies, and other configurations of your Node.js application.

*   node_modules/

	This directory contains the modules used and referenced in the application. It is required by the express framework in this sample application.

*   public/

	This directory contains public resources of the application. It contains the images, CSS, and JS resources. It is required by the express framework in this sample application.

*   views/

	This directory contains the .dust files used to display the content to the client accessing the application.# auto-scaling-demo
