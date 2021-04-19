// main.js

// this script sets a playlist in Kodi and starts playing it
// a playlist (in this case a random album) has to be created with Kodi first, f.i. profile/playlists/music/RandomAlbum.xsp which is used below
// more info on smart xsp playlists: https://kodi.wiki/view/Smart_playlists/XSP_Method

var buttonManager = require("buttons");

buttonManager.on("buttonSingleOrDoubleClickOrHold", function(obj) {
	var button = buttonManager.getButton(obj.bdaddr);
	var buttonName = button.name;
	var clickType = obj.isSingleClick ? "click" : obj.isDoubleClick ? "double_click" : "hold";

	// create an array with button names and an array with corresponding clicktypes
	var actionButtons = ["Keuken Wit 2", "Bureau", "Badkamer 2"];
	var actionClicks = ["click", "hold", "double_click"];
	var n = actionButtons.indexOf(buttonName);
	if (n > -1) {
		// button is part of actionButtons array
        if (actionClicks[n] == clickType) {
			// clicktype is correct clicktype (equal to actionClicks entry with same index as clicked button)
            var actionId = 1;
		} else { 
  		    var actionId = 0;
		};
	};
	
	// execute action based on actionId
	if (actionId == 1) {
		// set Kodi commands
		var params = "{\"jsonrpc\":\"2.0\",\"id\":0,\"method\":\"Playlist.Clear\",\"params\":{\"playlistid\": 0}}";
		var params2 = "{\"jsonrpc\":\"2.0\",\"id\":0,\"method\":\"Playlist.Add\",\"params\":{\"playlistid\":0,\"item\":{\"recursive\":true, \"directory\":\"special://profile/playlists/music/RandomAlbum.xsp\"}}}";
		var params3 = "{\"jsonrpc\":\"2.0\",\"id\":0,\"method\":\"Player.Open\",\"params\":{\"item\":{\"playlistid\":0,\"position\":0}}}";
		
		// send Kodi commands
		var url = "http://url:8080/jsonrpc"; // insert Kodi IP address and change port number if required
		var authheader = "Basic base64encodedlogininfo"; // insert the base64 encoded version of username:password
		var headers = {"Content-type": "application/json", "Authorization": authheader};
		var http = require("http");
		http.makeRequest({
			url: url, method: "POST", headers: headers, content: params,
		}, function(err, res) {
			console.log("Kodi playlist cleared, status: " + res.statusCode);
			if (res.statusCode == 200) {
				var http2 = require("http");
				http2.makeRequest({
					url: url, method: "POST", headers: headers, content: params2,
				}, function(err, res) {
					console.log("Kodi random playlist selected, status: " + res.statusCode);
					if (res.statusCode == 200) {
						var http3 = require("http");
						http3.makeRequest({
							url: url, method: "POST", headers: headers, content: params3,
						}, function(err, res) {
							console.log("Kodi playlist playing, status: " + res.statusCode);
						});
					}
				});
			}
		});
	}
});


