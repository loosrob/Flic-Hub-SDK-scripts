// main.js

// This script will send a message via UDP so further automation can be done in other home automation systems

var buttonManager = require("buttons");
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const PORT = 9999; //replace with correct port
const IP_ADDR = '0.0.0.0'; //replace with correct IP address

server.on('message', function(msg, rinfo) {
  console.log('@ server.on.message');
  console.log('# msg: ', msg);
  console.log('# rinfo: ', JSON.stringify(rinfo,null,2));
});

server.bind({
  port: PORT
},function(){
  server.setBroadcast(true);
});

buttonManager.on("buttonSingleOrDoubleClickOrHold", function(obj) {
	var button = buttonManager.getButton(obj.bdaddr);
	var buttonName = button.name;
	var clickType = obj.isSingleClick ? "click" : obj.isDoubleClick ? "double_click" : "hold";

	//set message based on button & clicktype
	if (buttonName == "Button1" && clickType == "hold") { //replace with correct button & clicktype
		var actionId = 1;
		var message = 'MessageToSend'; //replace with message to send to UDP server
	} else { 
		var actionId = 0; //don't send anything
	};
	
	//send message if one was created
	if (actionId > 0) {	
		server.send(message, 0, message.length, PORT, IP_ADDR, 'OK', function(err){
			console.log('@ server.send callback');
			console.log('# err: ', err);
			console.log('# server.address: ', JSON.stringify(server.address(),null,2));
		});
	}
});