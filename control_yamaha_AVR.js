// main.js

var buttonManager = require("buttons");

buttonManager.on("buttonSingleOrDoubleClickOrHold", function(obj) {
	var button = buttonManager.getButton(obj.bdaddr);
	var buttonName = button.name;
	var clickType = obj.isSingleClick ? "click" : obj.isDoubleClick ? "double_click" : "hold";
	var actionButton = "Flic2"
	
	// desired behaviour of actionButton:
	// click: AVR on, mode music: input HDMI2, surround 7ch Stereo, volume -50
	// double_click: AVR on, mode tv: input HDMI2, surround Standard, volume -45
	// hold: AVR off
	
	var actionButtons = ["Flic2", "Other Button"];
	var actionId = 0;
	var n = actionButtons.indexOf(buttonName);
	if (n > -1) {
		actionId = 1;
	};
	
	//check if correct button was clicked
	if (actionId == 1) {
		// set AVR parameters
		if (clickType == "hold") {
			var avrpower = "Standby"
		} else {
			var avrpower = "On"
		}
		var input = "HDMI2";
		if (clickType == "click") {
			var prog = "7ch Stereo"
		} else {
			var prog = "Standard"
		}
		if (clickType == "click") {
			var vol = "-500"
		} else {
			var vol = "-450"
		}
		var powerparams = "<YAMAHA_AV cmd=\"PUT\"><Main_Zone><Power_Control><Power>" + avrpower + "</Power></Power_Control></Main_Zone></YAMAHA_AV>";
		var inputparams = "<YAMAHA_AV cmd=\"PUT\"><Main_Zone><Input><Input_Sel>" + input + "</Input_Sel></Input></Main_Zone></YAMAHA_AV>";
		var progparams = "<YAMAHA_AV cmd=\"PUT\"><Main_Zone><Surround><Program_Sel><Current><Sound_Program>" + prog + "</Sound_Program></Current></Program_Sel></Surround></Main_Zone></YAMAHA_AV>";
		var volparams = "<YAMAHA_AV cmd=\"PUT\"><Main_Zone><Volume><Lvl><Val>" + vol + "</Val><Exp>1</Exp><Unit>dB</Unit></Lvl></Volume></Main_Zone></YAMAHA_AV>";
		// send AVR parameters
		var url = "http://url/YamahaRemoteControl/ctrl"; // insert correct IP address
		var headers = {"Content-type": "text/xml"};
		var http = require("http");
		http.makeRequest({
			url: url, method: "POST", headers: headers, content: powerparams,
		}, function(err, res) {
			console.log("AVR power " + avrpower + ", request status: " + res.statusCode);
		});
		// change settings when power is set to on
		if (avrpower = "On") {
			http.makeRequest({
				url: url, method: "POST", headers: headers, content: inputparams,
			}, function(err, res) {
				console.log("AVR input " + input + ", request status: " + res.statusCode);
			});
			http.makeRequest({
				url: url, method: "POST", headers: headers, content: progparams,
			}, function(err, res) {
				console.log("AVR surround program " + prog + ", request status: " + res.statusCode);
			});
			http.makeRequest({
				url: url, method: "POST", headers: headers, content: volparams,
			}, function(err, res) {
				console.log("AVR volume " + vol + ", request status: " + res.statusCode);
			});
		}
	}
});

