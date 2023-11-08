// main.js

var buttonManager = require("buttons");

buttonManager.on("buttonSingleOrDoubleClickOrHold", function(obj) {
	var button = buttonManager.getButton(obj.bdaddr);
	var buttonName = button.name;
	var clickType = obj.isSingleClick ? "click" : obj.isDoubleClick ? "double_click" : "hold";
	// name of button that will be used:
	var actionButton = "Flic2"
	
	// desired behaviour of actionButton:
	// click: device on
	// double_click: device off
	// hold: device off
	
	console.log("Button:", buttonName)
	console.log("ClickType:", clickType)

	// homebridge data
	var hb_url = "192.186.0.10:8581"; // format xxx.xxx.xxx.xxx:xxxx
	var username = "admin";
	var password = "password";
	var deviceId = "verylongstring"; // you can get the device ID via the Homebride rest API examples at http://hb_url:8581/swagger/static/index.html
	
	// check if correct button was clicked
	if (buttonName == actionButton) {
			
		// set device parameters based on click_type
		if (clickType == "click") {
			var power = "1";
			var powerTxt = "On"
		} else {
			var power = "0";
			var powerTxt = "Off"
		}
		var powerparams = "{\"characteristicType\":\"Active\",\"value\":\"" + power + "\"}"; // if you want to change other characteristics, these can also be obtained via the rest API examples
		// login to Homebridge
		var url = "http://" + hb_url + "/api/auth/login";
		var url2 = "http://" + hb_url + "/api/accessories/" + deviceId;
		var params = "{\"username\":\"" + username + "\",\"password\":\"" + password + "\",\"otp\":\"string\"}";
		var headers = {"Content-type": "application/json"};
		http.makeRequest({
			url: url, method: "POST", headers: headers, content: params,
		}, function(err, res) {
			console.log("Homebridge login, request status: " + res.statusCode);
			if (res.statusCode == 201) { // login OK, send device parameters
				var reply = res.content; // content contains the token to send to Homebridge with the request
				var replyjson = JSON.parse(reply);
				var accesstoken = replyjson.access_token;
        		var tokentype = replyjson.token_type;
				var authheader = tokentype + " " + accesstoken;
				var headers2 = {"Content-type": "application/json", "accept": "*/*", "Authorization": authheader};
				var http2 = require("http");
				http2.makeRequest({
					url: url2, method: "PUT", headers: headers2, content: powerparams,
				}, function(err, res) {
					console.log("Device power " + powerTxt + ", request status: " + res.statusCode);
				});
			}
		});	
	}
});

