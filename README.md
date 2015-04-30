# nback

### An implementation of the memory training game Dual N Back built using:

 * AngularJS
 * Firebase
 * c3js

### Known bugs:

1. Occasionally when the route/location changes, it seems as though the controller doesn't reload properly, therefore resulting in stale data.

2. Couldn't find a way to easily "pause" Javascript timeouts/intervals, and so I had to comment the pausing feature out.

3. c3js doesn't do a great job displaying data points when the time scale is highly variable (i.e. two data points 1 minute apart, another two data points 1 day apart).

### To run:

`npm install`

`bower install`

`npm start`