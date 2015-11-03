# Overview

AutoScalingDemo is an app built on Node.js to demonstrate the ability
of the Auto-Scaling service in IBM Bluemix. It helps to demonstrate how policies
defined in the Auto-Scaling service can horizontally scale any application
based on CPU utilization and memory usage. To showcase these features,
the application contains visual gauges to indicate changing environmental
performance metrics.

## Running the app on Bluemix

You can deploy your own instance of this app to Bluemix. To do this, you can either use the _Deploy to Bluemix_ button for an automated deployment or follow the steps below to create and deploy your app manually.
  
[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy)  


## Files

The Node.js application has files as below:

*   `app.js`

	This file contains the server side JavaScript code for the application written using the Node.js API

*   `package.json`

	This file is required by the Node.js environment. It specifies the Node.js project name, dependencies, and other configurations of your Node.js application.

*   `node_modules/`

	This directory contains the modules used and referenced in the application. It is required by the express framework in this sample application.

*   `public/`

	This directory contains public resources of the application. It contains the images, CSS, and JS resources. It is required by the express framework in this sample application.

*   `views/`

	This directory contains the .dust files used to display the content to the client accessing the application.# auto-scaling-demo
