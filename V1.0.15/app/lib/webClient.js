WebClient = function() {
};
var connectivityNotAvalable = "Unable to connect to the network.";
var commonFunctions = require('commonFunctions');
// Public functions
// ================

// GET
// @url (string) URL to fetch
// @onSuccess (function) success callback
// @onError (function) error callback
// @extraParams (object)
WebClient.prototype.get = function(url, onSuccess, onError, extraParams) {
	// Check internet
	if (Titanium.Network.online === true) {
		// Create some default params
		var onSuccess = onSuccess ||
		function() {
		};
		var onError = onError ||
		function() {
		};
		var extraParams = extraParams || {};
		extraParams.async = (extraParams.hasOwnProperty('async')) ? extraParams.async : true;
		extraParams.ttl = extraParams.ttl || false;
		extraParams.shouldAuthenticate = extraParams.shouldAuthenticate || false;
		// if you set this to true, pass "username" and "password" as well
		extraParams.contentType = extraParams.contentType || "application/json";

		//extraParams.API_KEY = extraParams.API_KEY || null;
		extraParams.SESSION_TOKEN = extraParams.SESSION_TOKEN || null;

		// If there is nothing cached, send the request
		if (!extraParams.ttl) {

			// Create the HTTP connection
			var xhr = Titanium.Network.createHTTPClient({
				enableKeepAlive : false,
				timeout : Alloy.Globals.NETWORK_ACCESS_TIMEOUT // Currently set to 30 sec
			});
			// Create the result object
			var result = {};

			// Open the HTTP connection
			xhr.open("GET", url, extraParams.async);
			xhr.setRequestHeader('Content-Type', extraParams.contentType);

			/** API KEY and SESSION KEY setting **/
			xhr.setRequestHeader('Apikey', Alloy.Globals.APIKEY);

			if (extraParams.SESSION_TOKEN != null) {
				xhr.setRequestHeader('Sessionkey', extraParams.SESSION_TOKEN);
			}

			// If we need to authenticate
			if (extraParams.shouldAuthenticate) {
				var authstr = 'Basic ' + Titanium.Utils.base64encode(extraParams.username + ':' + extraParams.password);
				xhr.setRequestHeader('Authorization', authstr);
			}

			// When the connection was successful
			xhr.onload = function() {
				// Check the status of this
				result.status = xhr.status == 200 ? "ok" : xhr.status;

				// Check the type of content we should serve back to the user
				if (extraParams.contentType.indexOf("application/json") != -1) {
					result.data = xhr.responseText;
				} else if (extraParams.contentType.indexOf("text/xml") != -1) {
					result.data = xhr.responseXML;
				} else {
					result.data = xhr.responseData;
				}

				var response = JSON.parse(result.data);
				if (response.ErrorCode == 4100 || response.ErrorCode == '4100') {
					// Invalid Session
					Ti.App.fireEvent('sessionTockenExpired', e);
				} else {
					onSuccess(result);
				}

			};

			// When there was an error
			xhr.onerror = function(e) {
				result = getErrorResponse(e, null, null);
				onError(result);
			};

			xhr.send();

		} else {
			var result = {};
			result.status = "cache";
			result.data = cache;
			onSuccess(result);
		}

	} else {
		var result = {};
		var data = {};

		result.status = "error";
		result.message = connectivityNotAvalable;
		data.error = connectivityNotAvalable;
		result.data = data;
		result.ErrorCode = 3009;
		onError(result);
	}
};

// POST requests
// @url (string) URL to fetch
// @data (object)
// @onSuccess (function) success callback
// @onError (function) error callback
// @extraParams (object)
WebClient.prototype.post = function(url, data, onSuccess, onError, extraParams) {
	var LangCode = Ti.App.Properties.getString('languageCode');
	// Check internet
	if (Titanium.Network.online === true) {
		try {
			// Create some default params
			var onSuccess = onSuccess ||
			function() {
			};
			var onError = onError ||
			function() {
			};
			var extraParams = extraParams || {};
			extraParams.async = (extraParams.hasOwnProperty('async')) ? extraParams.async : true;
			extraParams.shouldAuthenticate = extraParams.shouldAuthenticate || false;
			// if you set this to true, pass "username" and "password" as well
			extraParams.contentType = extraParams.contentType || "application/json";
			extraParams.enctype = extraParams.enctype || "application/x-www-form-urlencoded";
			extraParams.file = extraParams.file || null;

			// Create the HTTP connection
			var xhr = Titanium.Network.createHTTPClient({
				enableKeepAlive : false,
				timeout : Alloy.Globals.NETWORK_ACCESS_TIMEOUT // currently set it as 30 sec
			});
			// Create the result object
			var result = {};

			// Open the HTTP connection
			xhr.open("POST", url, extraParams.async);
			xhr.setRequestHeader('Content-Type', extraParams.contentType);

			// If we need to authenticate
			if (extraParams.shouldAuthenticate) {
				var authstr = "Bearer " + extraParams.SessionToken;
				Ti.API.info('authr is' + authstr);
				//'Basic ' + Titanium.Utils.base64encode(extraParams.username + ':' + extraParams.password);
				xhr.setRequestHeader('Authorization', authstr);
			}

			// When the connection was successful
			xhr.onload = function() {
				// Check the status of this
				//Ti.API.info('CONNECTION SUCCESS');
				result.status = xhr.status == 200 ? "ok" : xhr.status;
				// Get the data
				result.data = xhr.responseText;

				var response = JSON.parse(result.data);
				//Ti.API.info('CONNECTION SUCCESS1' + JSON.stringify(response));
				if (response.ErrorCode === 2037 || response.ErrorCode === '2037') {
					if (Ti.App.Properties.hasProperty('SESSION_TOKEN')) {
						Ti.App.Properties.removeProperty("SESSION_TOKEN");
						commonFunctions.showAlert(commonFunctions.L('sessionExpired', LangCode), function(e) {
							Ti.API.info('alert1');
							Ti.App.fireEvent('sessionTokenExpired');
						});
					}

				} else {
					onSuccess(result);
				}
			};

			// When there was an error
			xhr.onerror = function(e) {
				Ti.API.info('CONNECTION failure', +e);
				result = getErrorResponse(e, null, null);
				onError(result);

			};

			// Send HTTP request
			xhr.send(JSON.stringify(data));
		} catch(e) {
			Ti.API.info("Exception while Webclinet.post()" + e.message);
		}
	} else {// The device is not onlie,call the call back method with message
		var result = {};
		var data = {};

		result.status = "error";
		result.Message = connectivityNotAvalable;
		data.error = connectivityNotAvalable;
		result.data = data;
		result.ErrorCode = 3009;

		onError(result);
	}
};

function getErrorResponse(errorObject, errorCode, message) {

	var result = {};
	var data = {};
	var message = "An unexpected error occurred while accessing network.";

	result.status = "error";

	if (errorObject !== null && errorObject.error != null && errorObject.error !== "") {

		// File not found
		if (errorObject.error.indexOf("HTTP error", 0) !== -1) {

			result.ErrorCode = errorObject.code;
			result.Message = "An unexpected error occurred while accessing network.";
			data.error = "An unexpected error occurred while accessing network.";
			result.data = data;
		} else if (errorObject.error.indexOf("The request timed out", 0) !== -1) {
			result.ErrorCode = errorObject.code;
			result.Message = "The request has timed out.";
			data.error = "An unexpected error occurred while accessing network.";
			result.data = data;
		}

	} else if (errorCode != null) {

		if (errorCode === 3009) {

			result.ErrorCode = errorCode;

			if (message != null && message !== "") {
				result.Message = message;
			} else {
				result.Message = connectivityNotAvalable;
			}
			data.error = connectivityNotAvalable;
			result.data = data;
		} else {

			result.ErrorCode = errorCode;
			data.error = message;
			result.data = data;
			result.Message = message;
		}
	}

	return result;
}

/*// Public functions
// ================

// GET
// @url (string) URL to fetch
// @onSuccess (function) success callback
// @onError (function) error callback
// @extraParams (object)
WebClient.prototype.get = function(Url, onSuccess, onError, extraParams) {
// Debug
var result = {};
if (Titanium.Network.online === true) {
url = Url;

// Create some default params
var onSuccess = onSuccess ||
function() {
};
var onError = onError ||
function() {
};
try {
var xhr = Ti.Network.createHTTPClient();
xhr.clearCookies(url);

// Create the result object
xhr.autoEncodeUrl = false;
xhr.timeout = 30000;

url = url.replace('\\', '');
url = url.replace(/\\/g, '');
url = url.replace(/"/g, '');
// Open the HTTP connection

xhr.open("GET", url);

// When the connection was successful
xhr.onload = function() {

// Check the status of this
result.status = xhr.status == 200 ? "ok" : xhr.status;

result.data = xhr.responseData;

onSuccess(result.data);
};

// When there was an error
xhr.onerror = function(e) {
// Check the status of this
result.status = "error";
result.data = e;
result.code = xhr.status;
onError(result);
};
xhr.ondatastream = function(e) {

};

xhr.send();

} catch(e) {
throw (e);
}
} else {
// Check the status of this
result.status = "error";
result.data = L('notOnlineMessage');
result.code = Alloy.Globals.NETWORK_ERROR_CODE;
onError(result);
}

};

// POST requests
// @url (string) URL to fetch
// @data (object)
// @onSuccess (function) success callback
// @onError (function) error callback
// @extraParams (object)
WebClient.prototype.post = function(url, data, onSuccess, onError, extraParams) {
// Create the result object
var result = {};
// Check internet
if (Titanium.Network.online === true) {
// Debug
// Create some default params
var onSuccess = onSuccess ||
function() {
};
var onError = onError ||
function() {
};
try {
var extraParams = extraParams || {};
extraParams.async = (extraParams.hasOwnProperty('async')) ? extraParams.async : true;
//extraParams.shouldAuthenticate = extraParams.shouldAuthenticate || false;
// if you set this to true, pass "username" and "password" as well
extraParams.contentType = extraParams.contentType || "application/json";

// Create the HTTP connection
var xhr = Titanium.Network.createHTTPClient({
enableKeepAlive : false,
timeout : 30000
});

// Open the HTTP connection
xhr.open("POST", url, extraParams.async);
xhr.setRequestHeader('Content-Type', extraParams.contentType);

// If we need to authenticate
if (extraParams.shouldAuthenticate) {
var authstr = 'Bearer ' + extraParams.token;

xhr.setRequestHeader('Authorization', authstr);
}

// When the connection was successful
xhr.onload = function() {

// Check the status of this
result.status = xhr.status == 200 ? "ok" : xhr.status;
result.data = xhr.responseText;

onSuccess(result);
};

// When there was an error
xhr.onerror = function(e) {
// Check the status of this
if (e != null) {
result.status = "error";
result.data = e.error;
result.code = xhr.status;

if (result.data.toUpperCase() == "HTTP ERROR") {
result.data = L('notOnlineMessage');
}

if (OS_IOS) {
//alert("Error Code : " + e.code);
switch(e.code) {

case 401:
result.data = L("notOnlineMessage");
onError(result);
break;
case 404:
result.data = L('notOnlineMessage');
result.code = Alloy.Globals.NETWORK_ERROR_CODE;
onError(result);
break;
case 408:
result.data = L('notOnlineMessage');
onError(result);
break;
case 2:
result.data = L('notOnlineMessage');
result.code = Alloy.Globals.NETWORK_ERROR_CODE;
onError(result);
break;
default:
onError(result);
break;
}
} else {
switch(e.source.status) {
case 401:
result.data = L("notOnlineMessage");
onError(result);
break;
case 404:
result.data = L('notOnlineMessage');
result.code = Alloy.Globals.NETWORK_ERROR_CODE;
onError(result);
break;
case 408:
result.data = L('notOnlineMessage');
onError(result);
break;
case 0:
result.data = L('notOnlineMessage');
result.code = Alloy.Globals.NETWORK_ERROR_CODE;
onError(result);
break;
default:
onError(result);
break;
}
}
} else {
onError("");
}

};
Ti.API.info('xmh send : ', JSON.stringify(data));
xhr.send(JSON.stringify(data));
} catch(e) {
throw (e);
}

} else {
result.status = "error";
result.data = L('notOnlineMessage');
;
result.code = Alloy.Globals.NETWORK_ERROR_CODE;
onError(result);
}
};*/

// GET
// @url (string) URL to fetch
// @onSuccess (function) success callback
// @onError (function) error callback
// @extraParams (object)
WebClient.prototype.getFile = function(Url, onSuccess, onError, onProgress, extraParams) {
	// Debug
	var result = {};
	if (Titanium.Network.online === true) {
		url = Url;

		// Create some default params
		var onSuccess = onSuccess ||
		function() {
		};
		var onError = onError ||
		function() {
		};
		var onProgress = onProgress ||
		function() {
		};
		try {
			var xhr = Ti.Network.createHTTPClient();
			xhr.clearCookies(url);

			// Create the result object
			xhr.autoEncodeUrl = false;
			xhr.timeout = 30000;

			url = url.replace('\\', '');
			url = url.replace(/\\/g, '');
			url = url.replace(/"/g, '');

			var currentProgress = 0.1;

			xhr.ondatastream = function(e) {
				try {

					var progressValue = e.progress;

					onProgress(progressValue);
				} catch(e) {
					throw (e);
				}
			};

			// When the connection was successful
			xhr.onload = function(e) {

				// Check the status of this
				result.status = xhr.status == 200 ? "ok" : xhr.status;
				result.data = xhr.responseData;

				onSuccess(result.data);
			};

			// When there was an error
			xhr.onerror = function(e) {
				// Check the status of this
				result.status = "error";
				result.data = e;
				result.code = xhr.status;
				onError(result);
			};

			// Open the HTTP connection

			xhr.open("GET", url);

			xhr.send();

		} catch(e) {

			throw (e);
		}
	} else {
		// Check the status of this
		result.status = "error";
		result.data = L('notOnlineMessage');
		result.code = Alloy.Globals.NETWORK_ERROR_CODE;
		onError(result);
	}

};

// POST requests
// @url (string) URL to fetch
// @data (object)
// @onSuccess (function) success callback
// @onError (function) error callback
// @extraParams (object)
WebClient.prototype.postFile = function(url, fileName, onSuccess, onError, onProgress, extraParams, fileType) {
	// Create the result object
	var result = {};
	// Check internet

	if (Titanium.Network.online === true) {
		// Debug

		// Create some default params
		var onSuccess = onSuccess ||
		function() {
		};
		var onError = onError ||
		function() {
		};
		try {
			var extraParams = extraParams || {};
			extraParams.async = (extraParams.hasOwnProperty('async')) ? extraParams.async : true;
			//extraParams.shouldAuthenticate = extraParams.shouldAuthenticate || false;
			// if you set this to true, pass "username" and "password" as well
			extraParams.contentType = extraParams.contentType || "multipart/form-data";
			// Create the HTTP connection
			var xhr = Titanium.Network.createHTTPClient({
				enableKeepAlive : true,
				timeout : 60000
			});

			if (OS_IOS) {
				var file = Titanium.Filesystem.getFile(Alloy.Globals.ATTACHMENT_FILE_PATH, fileName);
				var blob = file.read();
			} else {
				var _storage = Alloy.Globals.ATTACHMENT_FILE_PATH;
				var imageDir = Ti.Filesystem.getFile(_storage);
				imageDir.exists() || imageDir.createDirectory();
				var file = Ti.Filesystem.getFile(imageDir.resolve(), fileName);
				var blob = file.read();
			}

			xhr.onsendstream = function(e) {
				var onProgressValue = e.progress;

				if (OS_ANDROID) {

					var progressValue = parseFloat(Math.round(e.progress * 100) / 100).toFixed(2);
					var percentageIncrement = parseFloat((progressValue / 1) * 100).toFixed(0);
					if (percentageIncrement >= 98) {
						onProgressValue = 0.9825216534412116;
					}
				}
				onProgress(onProgressValue);

			};

			// When the connection was successful
			xhr.onload = function() {
				// Check the status of this

				result.status = xhr.status == 200 ? "ok" : xhr.status;
				result.data = xhr.responseText;

				onSuccess(result);
			};

			// When there was an error
			xhr.onerror = function(e) {
				// Check the status of this

				result.status = "error";
				result.data = e.error;
				result.code = xhr.status;

				if (result.data.toUpperCase() == "HTTP ERROR") {
					result.data = L('notOnlineMessage');
				}
				if (OS_IOS) {
					switch(e.code) {
					case 401:
						result.data = L("notOnlineMessage");
						onError(result);
						break;
					case 404:
						result.data = L('notOnlineMessage');
						;
						result.code = Alloy.Globals.NETWORK_ERROR_CODE;
						onError(result);
						break;
					case 2:
						result.data = L('notOnlineMessage');
						result.code = Alloy.Globals.NETWORK_ERROR_CODE;
						onError(result);
						break;
					default:
						onError(result);
						break;
					}
				} else {
					switch(e.source.status) {
					case 401:
						result.data = L("notOnlineMessage");
						onError(result);
						break;
					case 404:
						result.data = L('notOnlineMessage');
						;
						result.code = Alloy.Globals.NETWORK_ERROR_CODE;
						onError(result);
						break;
					case 0:
						result.data = L('notOnlineMessage');
						;
						result.code = Alloy.Globals.NETWORK_ERROR_CODE;
						onError(result);
						break;
					default:
						onError(result);
						break;
					}
				}

			};

			var args = {
				file : blob
			};

			// Open the HTTP connection
			xhr.open('POST', url);
			xhr.setRequestHeader('contentType', 'multipart/form-data');

			xhr.send(args);

		} catch(e) {
			throw (e);
		}

	} else {
		result.status = "error";
		result.data = L('notOnlineMessage');
		;
		result.code = Alloy.Globals.NETWORK_ERROR_CODE;
		onError(result);
	}
};

// Return everything
module.exports = WebClient;
