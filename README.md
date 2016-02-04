# auto-scaling-demo Overview

The Auto Scaling Demo provides a visual demonstration of the [Auto-Scaling service][auto_scaling_service_url] for Cloud Foundry apps in [IBM Bluemix][bluemix_url]. It helps to demonstrate how policies defined in the Auto-Scaling service can horizontally scale any application based on CPU utilization and memory usage. To showcase these features,
the application contains visual gauges to indicate changing environmental performance metrics.

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy)

![Bluemix Deployments](https://deployment-tracker.mybluemix.net/stats/c0df3b7e4cd10004ed936a2745dedeab/badge.svg)

**Note**: After you deploy the app to Bluemix, proceed to step 9 to complete the auto-scaling setup process.

## Running the app on Bluemix

1. If you do not already have a Bluemix account, [sign up here][bluemix_signup_url]

2. Download and install the [Cloud Foundry CLI][cloud_foundry_url]

3. Clone the app to your local environment from your terminal using the following command

  ```
  git clone https://github.com/IBM-Bluemix/auto-scaling-demo.git
  ```

4. cd into this newly created directory

5. Edit the `manifest.yml` file and change the `<application-host>` parameter to something unique.

  ```
  applications:
  - name: auto-scaling-demo
    host: auto-scaling-demo
    framework: node
    runtime: node12
    memory: 128M
    instances: 1
  ```
  The host you use will determinate your application url (e.g. `<application-host>.mybluemix.net`)

6. Connect to Bluemix using the CF CLI and follow the prompts to log in.

  ```
  $ cf api https://api.ng.bluemix.net
  $ cf login
  ```

7. Create the Auto-Scaling service in Bluemix

  ```
  $ cf create-service Auto-Scaling free app-auto-scaling
  ```

8. Push your app to Bluemix

  ```
  $ cf push
  ```

9. Go to the Bluemix dashboard and enter the Auto-Scaling service console. Create an auto-scaling policy called 'MemoryPolicy' with the following parameters:
	* Metric type: `Memory`
	* If average CPU utilization exceeds `60%`, then increase `1` instance
	* If average CPU utilization is below `40%`, then decrease `1` instance
	* Statistic Window: `30 seconds`
	* Breach Duration: `60 seconds`
	* Cooldown period for scaling out: `600 seconds`
	* Cooldown period for scaling in: `600 seconds`

And voila! You now have your very own instance of Auto Scaling Demo running on Bluemix. To test it out, run a few load tests on your app using a service like [BlazeMeter][blazemeter_url]. If you want a more in depth tutorial on how to use and test auto scaling with this app, check out the [Handle the Unexpected with Bluemix Auto Scaling][auto_scaling_blog] blog post on developerWorks.

## Running the app locally

1. If you have not already, [download node.js][download_node_url] and install it on your local machine.

2. Clone the app to your local environment from your terminal using the following command

  ```
  git clone https://github.com/IBM-Bluemix/auto-scaling-demo.git
  ```

3. cd into this newly created directory

4. Install the required npm and bower packages using the following command

  ```
  npm install
  ```

5. Start your app locally with the following command.

  ```
  npm start
  ```

To access the app, go to `localhost:8000` in your browser. Happy developing!

### Troubleshooting

To troubleshoot your Bluemix app the main useful source of information is the logs. To see them, run:

  ```
  $ cf logs auto-scaling-demo --recent
  ```

### Privacy Notice

The Personality Box sample web application includes code to track deployments to Bluemix and other Cloud Foundry platforms. The following information is sent to a [Deployment Tracker] [deploy_track_url] service on each deployment:

* Application Name (`application_name`)
* Space ID (`space_id`)
* Application Version (`application_version`)
* Application URIs (`application_uris`)

This data is collected from the `VCAP_APPLICATION` environment variable in IBM Bluemix and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of sample applications to IBM Bluemix. Only deployments of sample applications that include code to ping the Deployment Tracker service will be tracked.

### Disabling Deployment Tracking

Deployment tracking can be disabled by removing `require("cf-deployment-tracker-client").track();` from the beginning of the `app.js` main server file.

[bluemix_signup_url]: http://ibm.biz/auto-scaling-signup
[bluemix_url]: http://ibm.biz/auto-scaling-bluemix
[auto_scaling_service_url]: https://console.ng.bluemix.net/catalog/services/auto-scaling/
[blazemeter_url]: https://console.ng.bluemix.net/catalog/services/blazemeter/
[auto_scaling_blog]: https://developer.ibm.com/bluemix/2015/04/03/handle-unexpected-bluemix-auto-scaling/
[cloud_foundry_url]: https://github.com/cloudfoundry/cli
[download_node_url]: https://nodejs.org/download/
[deploy_track_url]: https://github.com/cloudant-labs/deployment-tracker

