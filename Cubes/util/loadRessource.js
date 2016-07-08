// Load a text resource from a file over the network
var loadTextResource = function (url, callback) {
	var request = new XMLHttpRequest();
	request.open('GET', url , true);
	request.onload = function () {
		if (request.status < 200 || request.status > 299) {
			callback('Error: HTTP Status ' + request.status + ' on resource ' + url);
		} else {
			callback(null, request.responseText);
		}
	};
	request.send();
};


function getPoseMatrix (out, pose) {
    orientation = pose.orientation;
    position = pose.position;
    if (!orientation) { orientation = [0, 0, 0, 1]; }
    if (!position) { position = [0, 0, 0]; }

    if (vrDisplay.stageParameters) {
      mat4.fromRotationTranslation(out, orientation, position);
      mat4.multiply(out, vrDisplay.stageParameters.sittingToStandingTransform, out);
    } else {
      vec3.add(standingPosition, position, [0, PLAYER_HEIGHT, 0]);
      mat4.fromRotationTranslation(out, orientation, standingPosition);
    }
}
/*
var loadImage = function (url, callback) {
	var image = new Image();
	image.onload = function () {
		callback(null, image);
	};
	image.src = url;
};

var loadJSONResource = function (url, callback) {
	loadTextResource(url, function (err, result) {
		if (err) {
			callback(err);
		} else {
			try {
				callback(null, JSON.parse(result));
			} catch (e) {
				callback(e);
			}
		}
	});
};
*/