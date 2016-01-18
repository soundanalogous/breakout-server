# Using breakout-server

breakout-server is provided as an alternative to the [Breakout Server GUI application](https://github.com/soundanalogous/BreakoutServer). It is a node.js-based server for [Breakout.js](https://github.com/soundanalogous/Breakout), bridging serial data from an Arduino board to and from a web browser using websockets. It also provides a simple webserver for hosting static content.

If you're looking for a pure node.js implementation for Arduino, please see [johnny-five](https://github.com/rwldrn/johnny-five) and [firmata](https://github.com/jgautier/firmata).

## To Install

```bash
$ npm install breakout-server
```

This will only install the server. You will need to clone or download [Breakout.js](https://github.com/soundanalogous/Breakout) separately. Minimally all you need from Breakout.js is the files in `Breakout/dist/` and the firmware in `Breakout/firmware/`.

*Windows users, refer to the [readme](https://github.com/voodootikigod/node-serialport/blob/master/README.md) for node-serialport before attempting to install breakout-server.*

## To Run

#### Install required Arduino libraries

1. Install [ConfigurableFirmata](https://github.com/firmata/ConfigurableFirmata) to your Arduino sketchbook library. The easiest way to get it if you are using Arduino 1.6.4 or higher is using the Arduino Library Manager. In the Arduino IDE, go to `Sketch > Include Library > Manage Libraries` then search for "ConfigurableFirmata" and click Install after tapping on the ConfigurableFirmata item in the filtered results. Otherwise, following the instructions in the ConfigurableFirmata readme.
2. Download or clone [Breakout.js](https://github.com/soundanalogous/Breakout) and navigate to `Breakout/firmata/BreakoutFirmata` and open `BreakoutFirmata.ino` in the Arduino IDE. Compile and upload the sketch to your board.

#### Running breakout-server

Run `node server.js --help` to view the command line options.

##### -p

You will need to provide the name of the serial port you are connecting to. You can get the name
by connecting a board to your computer, and running `ls /dev/tty.*` in the terminal in OS X, `ls /dev/ttyACM*` in the terminal in Linux, or get it from the Arduino IDE under `Tools -> Serial Port`. When running the server, specify the port using the `-p` command as follows (substituting in the serial port name for your attached board):

```bash
$ node breakout-server/server.js -p /dev/cu.usbmodem14241
```

You can alternatively change the default serial port name by updating the following line in server.js:

```javascript
  .option('-p, --port <device>', 'Specify the serial port [/dev/cu.usbmodemfd121]', '/dev/cu.usbmodemfd121')
```

##### -d

It is important to understand the relative path from where you run breakout-server to the root of the website. You may need to supply the path using the `-d` option depending on the location of your index.html file relative to where you run the server from. For example, if you created a project directory and installed breakout-server into that directory using npm and you also created another folder named 'public' that contains your static files, then you would run the server from the root of the project directory as follows:

```bash
$ node breakout-server/server.js -p /dev/cu.usbmodem14241 -d public
```
And then in your browser navigate to: `http://localhost:88887/`

To run the examples included with breakout-server, navigate to the breakout-server directory and run server.js:

```bash
$ cd breakout-server
$ node server.js -p YOUR_SERIAL_PORT
```
Then navigate to `http://localhost:8887/examples/simple_led.html` in your browser.

To run the examples included with Breakout (`Breakout/examples/`) you will need to
install breakout-server within the Breakout directory. This is due to the relative paths set to
the socket.io.js file ([see more about this below](https://github.com/soundanalogous/breakout-server#including-socketio-client-in-your-indexhtml-file)).

```bash
$ cd Breakout
$ npm install breakout-server
$ node breakout-server/server.js -p YOUR_SERIAL_PORT
```
And then in your browser navigate to: `http://localhost:8887/examples`

**Schematics for the examples can be found here:** http://breakoutjs.com/examples/schematics.pdf

##### Additional command line options

There are 2 additional command line options:

- `-s` is used to change the server port (default = 8887)
- `-m` is used to put Breakout into a state where multiple web applications can connect to the same
board. To enable it, pass `-m true`. However, understand that this is not practical in many situations (since 2 or more web applications could try to access the same pin on a board for example.) it's perhaps provided more of an experiment than anything else.

#### Including socket.io client in your index.html file

When creating your index.html file, include `socket.io.js` before the `Breakout.min.js` script. This is included in all of the files in `Breakout/examples/` so use those as a reference.

There are two ways to include `socket.io.js`:

1. Allow the socket.io server (`breakout-server/server.js`) to provide it. If you take this route, you will need to ensure that the path to `socket.io.js` is relative to where you are running the server from. For example, if your project directory has `breakout-server` and `public` folders at the top level and your run the server from the top level of the directory (`node breakout-server/server.js -p YOUR_SERIAL_PORT`) then you would use the following path when including socket.io.js in your index.html file because the project root (where you are running the server from) is one level above the `public` folder.

  ```html
  <script src="../socket.io/socket.io.js"></script>
  ```

2. Get `socket.io.js` from a cdn ([for example](https://cdnjs.com/libraries/socket.io#)). This is the most flexible since you don't need to worry about the path to the server, but you'll need to be sure the version is compatible. See `breakout-server/node-modules/socket.io/package.json` for the current version of the socket.io server. Also if you get `socket.io.js` this way then you can use a separate webserver for your project and simply use breakout-server as a serial to websocket bridge.

