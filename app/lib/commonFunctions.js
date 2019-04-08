var validation = require('validation');
var adminReminderValues = Ti.App.Properties.getObject('lastAdminReminderTime');
var localReminderValues = Ti.App.Properties.getObject('lastLocalReminderTime');

/***
 * Handle Exception and show the error message
 */
exports.handleException = function(view, functionName, exception, customMsg) {
	try {
		var commonFunctions = require('commonFunctions');
		var LangCode = Ti.App.Properties.getString('languageCode');
		var message = view + ":.." + functionName + ":.." + exception;
		Ti.API.info("handleException : " + message);
		var ErrorMessage = message;
		var customMsg = (customMsg == null || customMsg == "" ) ? ErrorMessage : customMsg;

		if (OS_IOS) {
			// Alert dailog for ios
			Ti.UI.createAlertDialog({
				title : Ti.App.name,
				message : customMsg,
				persistent : true
			}).show();
		} else {
			// Alert dailog for android
			var alertDialog = Titanium.UI.createAlertDialog({
				title : Ti.App.name,
				message : customMsg,
				buttonNames : commonFunctions.L('okLbl', LangCode)
			});
			alertDialog.show();
		}
	} catch(ex) {

	}

};

/***
 * Function for showing alert
 */
exports.showAlert = function(message, callback) {
	var LangCode = Ti.App.Properties.getString('languageCode', "");
	if (LangCode == "") {
		LangCode = "en";
	}
	var commonFunctions = require('commonFunctions');
	var alertDialog = Ti.UI.createAlertDialog({
		title : Alloy.Globals.APP_NAME,
		message : message,
		ok : commonFunctions.L('okLbl', LangCode),
		persistent : true
	});
	alertDialog.show();
	alertDialog.addEventListener('click', function(e) {
		if (callback != null)
			setTimeout(function() {
				callback();
			}, 50);
		// Added 50 msec delay to fix non focusing issue
	});
	return alertDialog;
};

/***
 * Function for showing confirmation
 */
exports.showConfirmation = function(message, buttonNames, okCallback, cancelCallback) {
	var commonFunctions = require('commonFunctions');
	var LangCode = Ti.App.Properties.getString('languageCode');
	if (OS_IOS) {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : buttonNames,
			message : message,
			title : Alloy.Globals.APP_NAME,
			persistent : true
		});

		dialog.addEventListener('click', function(e) {
			Ti.API.info('e.index : ', e.index);
			if (e.index === 1) {
				if (okCallback != null)
					okCallback();
			} else {
				if (cancelCallback != null)
					cancelCallback();
			}
		});
	} else {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : [commonFunctions.L('yes', LangCode), commonFunctions.L('no', LangCode)],
			message : message,
			title : Alloy.Globals.APP_NAME,
			persistent : true
		});
		dialog.addEventListener('click', function(e) {
			Ti.API.info('e.index : ', e.index);
			if (e.index === 1) {
				if (cancelCallback != null)
					cancelCallback();
			} else {
				if (okCallback != null)
					okCallback();
			}
		});
	}
	dialog.show();

	return dialog;
};

/***
 * Function for showing confirmation
 */
exports.showConfirmationCancelRetry = function(message, okCallback, cancelCallback) {
	var LangCode = Ti.App.Properties.getString('languageCode');
	var dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Cancel', 'Retry'],
		message : message,
		title : Alloy.Globals.APP_NAME,
		persistent : true
	});
	dialog.addEventListener('click', function(e) {
		if (e.index === 0) {
			if (cancelCallback != null)
				cancelCallback();
		} else {
			if (okCallback != null)
				okCallback();
		}
	});
	dialog.show();

	return dialog;
};

var activityIndicatorWindow;
/***
 * Function for initializing activity indicator
 */
exports.initActivityIndicator = function(message) {
	var text = message;
	// 'Loading ...';
	var windowTop = 0;
	var isFullScreen = false;
	if (OS_IOS) {
		if (parseInt(Ti.Platform.version) >= 7) {
			windowTop = "20";
		}
	}

	var isOpen = false;

	// Creating activity indicator window
	if (OS_IOS) {
		activityIndicatorWindow = Titanium.UI.createWindow({
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,
			backgroundColor : 'transparent',
			opacity : "1",
			translucent : true,
			orientationModes : [Titanium.UI.PORTRAIT],
			navBarHidden : true,
			top : windowTop,
			fullscreen : false
		});
	} else {
		activityIndicatorWindow = Titanium.UI.createWindow({
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,
			backgroundColor : 'transparent',
			opacity : "1",
			translucent : true,
			orientationModes : [Titanium.UI.PORTRAIT],
			navBarHidden : true,
			theme : "Theme.noTitle",
			top : windowTop,
			fullscreen : false
		});
	}

	var indicatorWidth = "85%";
	if (Alloy.Globals.IsTablet) {
		indicatorWidth = "60%";
	}

	// Creating activity indicator container view
	var activityIndicatorContainerView = Titanium.UI.createView({
		height : "20%",
		width : indicatorWidth,
		touchEnabled : false,
		backgroundColor : '#ffffff',
		opacity : 0.9,
		borderRadius : 10,
		borderColor : '#14B9D6',
		zIndex : 99999
	});

	// Creating activity indicator view
	var activityIndicatorView = Ti.UI.createView({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		layout : 'vertical',
		zIndex : 99999
	});

	// Function for setting activity indicator style
	function osIndicatorStyle() {
		if (OS_IOS) {
			style = Titanium.UI.ActivityIndicatorStyle.PLAIN;
		} else {
			style = Ti.UI.ActivityIndicatorStyle.DARK;

		}

		return style;
	}

	// Creating activity indicator
	var activityIndicator = Ti.UI.createActivityIndicator({
		style : osIndicatorStyle(),
		height : Ti.UI.SIZE,
		width : '30dp'
	});

	// Creating activity indicator loading text label
	loadingTextLabel = Titanium.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		text : text,
		color : '#000',
		font : Alloy.Globals.MediumMenuFontBold
	});

	activityIndicatorView.add(activityIndicator);
	// Adding  activity indicator to activity indicator view
	activityIndicatorView.add(loadingTextLabel);
	// Adding  activity indicator loading text label to activity indicator view

	activityIndicatorWindow.add(activityIndicatorContainerView);

	activityIndicatorWindow.add(activityIndicatorView);
	// Adding  activity indicator view to activity indicator container view

	// Activity indicator show function
	activityIndicatorWindow.ShowIndicator = function(msg) {
		// //Ti.API.info('msg=== ' + msg);
		loadingTextLabel.text = (msg == null || msg == "" ) ? 'Loading...' : msg;
		if (isOpen == false) {
			if (OS_IOS)
				activityIndicatorWindow.open();
			else
				activityIndicatorWindow.open({
					activityEnterAnimation : Ti.Android.R.anim.fade_in,
					activityExitAnimation : Ti.Android.R.anim.fade_out
				});

		}
		activityIndicator.show();
		isOpen = true;
	};

	// Activity indicator hide function
	activityIndicatorWindow.HideIndicator = function() {
		activityIndicator.hide();
		activityIndicatorWindow.close();
		isOpen = false;
	};

	// Handles activity indicator focus event
	activityIndicatorWindow.addEventListener('focus', function() {
		if (!isOpen) {
			activityIndicator.hide();
			activityIndicatorWindow.close();
		}
	});

	activityIndicatorWindow.addEventListener('android:back', function() {
		return false;
	});
};
/***
 * Function to open activity indicator
 */
exports.openActivityIndicator = function(msg) {
	Ti.API.info('entered open indicator');
	activityIndicatorWindow.ShowIndicator(msg);
};

/***
 * Function to close activity indicator
 */
exports.closeActivityIndicator = function() {
	Ti.API.info('entered close indicator');
	activityIndicatorWindow.HideIndicator();
};

var navController;

/***
 * Function to set navigation Controller
 */
exports.setNavController = function(nav) {
	navController = nav;
};
/***
 * Function to set navigation Controller
 */
exports.getNavController = function() {
	return navController;
};

exports.getNavWindowObj = function(windId) {
	var win = null;
	// Find chatGroupInfo window, for refresh UI
	for (var i = 0; i < navController.windowStack.length; i++) {
		if (navController.windowStack[i].id == windId) {
			win = navController.windowStack[i];
			break;
		}
	}
	return win;
};

/***
 * Function to get Current Window
 */
exports.getCurrentWindow = function() {
	return navController.current();
};
/***
 * Function for opening navigation Window
 */
exports.openNavWindow = function(opts, otherOpts) {
	//var newWin;
	var controller;
	var currentWindow;
	if (opts["window"])
		currentWindow = opts["window"];
	else {
		controller = Alloy.createController(opts, otherOpts);
		currentWindow = controller.getView();
	}
	navController.open(currentWindow);
	return currentWindow;
};

/***
 * Function for closing navigation Window
 */
exports.closeNavWindow = function(win) {
	navController.close(win);
};

/***
 * Function for closing All navigation Windows
 */
exports.closeAllNavWindow = function() {
	if (navController)
		navController.closeAll();
};

/***
 * Function for goin to Home Page
 */
exports.gotoHomeWindow = function() {
	if (navController)
		navController.home();
};
/***
 * Function for close multiple windows
 */
exports.closeMultiWindow = function(count) {
	if (navController) {
		navController.closeMultiWindow(count);
	}

};

//**************** Login Nav Controller ***************
var loginNavController;

/***
 * Function to set navigation Controller
 */
exports.setLoginNavController = function(nav) {
	loginNavController = nav;
};

/***
 * Function for opening navigation Window
 */
exports.openLoginNavWindow = function(opts, otherOpts) {
	var newWin;
	var controller;
	if (opts["window"])
		newWin = opts["window"];
	else {
		controller = Alloy.createController(opts, otherOpts);
		newWin = controller.getView();
	}
	loginNavController.open(newWin);
	return newWin;
};

/***
 * Function for closing navigation Window
 */
exports.closeLoginNavWindow = function(win) {
	loginNavController.close(win);
};

/***
 * Function for closing All navigation Windows
 */
exports.closeAllLoginNavWindow = function() {
	if (loginNavController)
		loginNavController.closeAll();
};

//**************** Login Nav Controller ***************

/***
 * Function for setting Window height
 */
exports.setWindowHeight = function(objwindow) {

	if ((Ti.Platform.osname == "iphone") || (Ti.Platform.osname == "ipad")) {
		if (parseInt(Ti.Platform.version) >= 7) {

			objwindow.top = "20";
			Ti.UI.setBackgroundColor("#0C7740");

		}
	}
};

/***
 * Function for setting Window height
 */
exports.setWindowHeightLogin = function(objwindow) {

	if ((Ti.Platform.osname == "iphone") || (Ti.Platform.osname == "ipad")) {
		if (parseInt(Ti.Platform.version) >= 7) {
			objwindow.top = "20";
			Ti.UI.setBackgroundColor("#0C7740");

		}
	}
};

/***
 * Function for setting original window height
 */
exports.setWindowHeightOriginal = function(objwindow) {

	if (Ti.Platform.osname == "iphone") {
		if (parseInt(Ti.Platform.version) >= 7) {
			objwindow.top = 0;

		}
	}
};

/**
 * Returns the time in 12 hour format (am/pm)
 */
exports.getTwelveHrFormatTime = function(date) {
	var strTime;
	if (date == "00:00:00") {
		strTime = '00:00 AM';
	} else {
		if (!date) {
			var date = new Date();
		} else {
			var date = new Date(date);
		}
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12;
		// the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		strTime = hours + ':' + minutes + ' ' + ampm;
	}
	return strTime;
};

exports.getFormattedTime = function(date) {
	var output;
	var timeFromStatus = date.toString();
	var timeSplitedWithSpace = timeFromStatus.split(" ");
	var splitedTime = timeSplitedWithSpace[4];
	var atoms = splitedTime.split(":");

	var hours = atoms[0] % 12;
	hours = hours > 0 ? hours : 12;
	hours = hours < 10 ? "0" + hours : hours;
	try {
		output = hours + ":" + atoms[1] + (atoms[0] < 13 ? " a.m" : " p.m");

	} catch(e) {
		output = "00:00 a.m";
	}

	return output;
};

/**
 * Formats the date in MDY
 */
exports.getFormattedDate = function(date) {
	Ti.API.info('getFormattedDate : ', date);
	if (date == "0001-01-01T00:00:00") {
		returnDate = '01/01/0001';
	} else {
		var d = new Date(date);
		Ti.API.info('getFormattedDate1 : ', d);
		year = d.getFullYear();
		Ti.API.info('getFormattedDate2 : ', year);
		month = d.getMonth() + 1;
		day = d.getDate();

		if (month.toString().length == 1) {
			month = "0" + month;
		}
		if (day.toString().length == 1) {
			day = "0" + day;
		}
		returnDate = month + '/' + day + '/' + year;
	}
	return returnDate;

};

/**
 * Formats the date in MDY
 */
exports.getFormattedDateTime = function(date) {
	var returnDate;
	if (date == "0001-01-01T00:00:00") {
		returnDate = '01/01/0001 00:00 a.m';
	} else {

		var d = new Date(date);
		var year = d.getFullYear();
		var month = d.getMonth() + 1;
		var day = d.getDate();

		if (month.toString().length == 1) {
			month = "0" + month;
		}
		if (day.toString().length == 1) {
			day = "0" + day;
		}
		returnDate = month + '/' + day + '/' + year;

		var hours = d.getHours();
		var minutes = d.getMinutes();
		var ampm = hours >= 12 ? 'p.m' : 'a.m';
		hours = hours % 12;
		hours = hours ? hours : 12;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;

		returnDate = returnDate + ' ' + strTime;
	}
	return returnDate;
};

/***
 * Gets the current date with month name in string
 */
exports.getDateByMonthName = function(date) {
	if (!date) {
		var date = new Date();
	} else {
		var date = new Date(date);
	}
	var currentTime = date;
	var monthCount = currentTime.getMonth();
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	var month = new Array();
	month[0] = "January";
	month[1] = "February";
	month[2] = "March";
	month[3] = "April";
	month[4] = "May";
	month[5] = "June";
	month[6] = "July";
	month[7] = "August";
	month[8] = "September";
	month[9] = "October";
	month[10] = "November";
	month[11] = "December";
	var monthName = month[monthCount];
	return day + " " + monthName + " " + year;
};
/**
 *
 */
exports.getDate = function(currentTime) {
	if (!currentTime) {
		var currentTime = new Date();
	} else {
		var currentTime = new Date(currentTime);
	}

	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();

	return month + "/" + day + "/" + year;
};
exports.getDateTime = function() {
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();

	return month + "/" + day + "/" + year + " - " + hours + ":" + minutes;
};

exports.getTomorrow = function(date) {
	if (!date) {
		var date = new Date();
	}
	var currentDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	return month + "/" + day + "/" + year;

};

exports.getCurrentDateTime = function(currentTime) {
	if (!currentTime) {
		var currentTime = new Date();
	} else {
		var currentTime = new Date(currentTime);
	}
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();

	return month + "/" + day + "/" + year + " " + hours + ":" + minutes;
};
exports.ConvertTwentyfourHour = function(time) {
	var hours = Number(time.match(/^(\d+)/)[1]);
	var minutes = Number(time.match(/:(\d+)/)[1]);
	var AMPM = time.match(/\s(.*)$/)[1];
	if (AMPM == "p.m" && hours < 12)
		hours = hours + 12;
	if (AMPM == "a.m" && hours == 12)
		hours = hours - 12;
	var sHours = hours.toString();
	var sMinutes = minutes.toString();
	if (hours < 10)
		sHours = "0" + sHours;
	if (minutes < 10)
		sMinutes = "0" + sMinutes;
	return sHours + ":" + sMinutes;
};
exports.ConvertDayToMilliSeconds = function(day) {
	return day * 86400000;
};
exports.ConvertSecondsToMilliSeconds = function(minute) {
	return minute * 1000;
};

exports.secondstoHHMMSS = function(sec) {
	var sec = parseInt(sec, 10);
	// don't forget the second param

	var hours = Math.floor(sec / 3600);
	var minutes = Math.floor((sec - (hours * 3600)) / 60);
	var seconds = sec - (hours * 3600) - (minutes * 60);

	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	var time = hours + ':' + minutes + ':' + seconds;

	return time;
};

exports.ConvertTwelveHrFormatTime = function(date) {
	var strTime;
	if (date == "00:00:00") {
		strTime = '00:00 a.m';
	} else if (date.indexOf('a.m') >= 0 || date.indexOf('p.m') >= 0) {
		strTime = date;
	} else {
		var res = date.split(":");
		var hours = res[0];
		var minutes = res[1];
		var ampm = hours >= 12 ? 'p.m' : 'a.m';
		hours = hours % 12;
		hours = hours ? hours : 12;
		// the hour '0' should be '12'
		strTime = hours + ':' + minutes + ' ' + ampm;
	}
	return strTime;
};
exports.ceateGUID = function() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}

	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

exports.formatDateTime = function(UTCdatetime) {
	try {
		var currentTime = new Date(UTCdatetime);
		var hours = currentTime.getHours();
		var ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12;
		var minutes = currentTime.getMinutes();
		var seconds = currentTime.getSeconds();
		var milliSeconds = currentTime.getMilliseconds();
		var month = currentTime.getMonth() + 1;
		var day = currentTime.getDate();
		var year = currentTime.getFullYear();

		if (month.toString().length == 1) {
			month = "0" + month;
		}

		if (day.toString().length == 1) {
			day = "0" + day;
		}

		hours = hours < 10 ? '0' + hours : hours;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		seconds = seconds < 10 ? '0' + seconds : seconds;
		milliSeconds = milliSeconds < 10 ? '0' + milliSeconds : milliSeconds;

		var formatedDate = month + "/" + day + "/" + year + " " + hours + ":" + minutes + " " + ampm;
		return formatedDate;
	} catch(e) {
		throw (e);
	}

};

exports.getIsTablet = function() {
	var osname = Ti.Platform.osname;
	switch(osname) {
	case 'ipad':
		return true;
		break;
	case 'iphone':
		return false;
		break;
	case 'android':
		var screenWidthInInches = Titanium.Platform.displayCaps.platformWidth / Titanium.Platform.displayCaps.dpi;
		var screenHeightInInches = Titanium.Platform.displayCaps.platformHeight / Titanium.Platform.displayCaps.dpi;
		var maxInches = (screenWidthInInches >= screenHeightInInches) ? screenWidthInInches : screenHeightInInches;
		Ti.API.info('maxInches : ', maxInches);
		return (maxInches >= 7) ? true : false;
		break;
	default:
		return false;
		break;
	}
};
exports.getIsTabletMini = function() {
	var osname = Ti.Platform.osname;
	switch(osname) {
	case 'ipad':
		return true;
		break;
	case 'iphone':
		return false;
		break;
	case 'android':
		var screenWidthInInches = Titanium.Platform.displayCaps.platformWidth / Titanium.Platform.displayCaps.dpi;
		var screenHeightInInches = Titanium.Platform.displayCaps.platformHeight / Titanium.Platform.displayCaps.dpi;
		var maxInches = (screenWidthInInches >= screenHeightInInches) ? screenWidthInInches : screenHeightInInches;
		Ti.API.info('maxInches : ', maxInches);
		return (maxInches >= 5.7) ? true : false;
		break;
	default:
		return false;
		break;
	}
};
/**
 * Trim Text after specified length
 * @param {Object} text
 * @param {Object} textLength
 */
exports.trimText = function(text, textLength) {
	if (textLength == undefined)
		textLength = 15;

	if (text.length > textLength) {
		text = text.substr(0, textLength) + '...';
	}
	return text;
};

exports.commonTrimText = function(text) {

	var osname = Ti.Platform.osname;
	var textLength = 20;

	text = text.trim();

	switch(osname) {
	case 'ipad':
		textLength = 41;
		break;
	case 'iphone':
		if (Alloy.Globals.iPhoneSixPlus) {
			textLength = 30;
		} else if (Alloy.Globals.iPhoneSix) {
			textLength = 25;
		} else if (Alloy.Globals.iPhone5) {
			textLength = 18;
		} else {
			textLength = 18;
		}
		break;
	case 'android':

		var dpi = Ti.Platform.displayCaps.dpi;
		var w = Ti.Platform.displayCaps.platformWidth / dpi;
		var h = Ti.Platform.displayCaps.platformHeight / dpi;
		var diagonalSize = Math.sqrt(w * w + h * h);

		diagonalSize >= 6 ? textLength = 41 : textLength = 17;
		if (Titanium.Platform.model.indexOf('Nexus 6') > -1) {
			textLength = 25;
		}
		if (Titanium.Platform.model.indexOf('Nexus 5x') > -1) {
			textLength = 22;
		}
		break;
	default:
		textLength = 17;
		break;
	}

	if (text.indexOf('-') > 0) {
		textLength = parseInt(textLength) + 2;
	}
	if (text.indexOf('i') > 0) {
		textLength = parseInt(textLength) + 1;
	}
	if (text.indexOf('l') > 0) {
		textLength = parseInt(textLength) + 1;
	}
	if (text.indexOf('j') > 0) {
		textLength = parseInt(textLength) + 1;
	}
	if (text.indexOf('t') > 0) {
		textLength = parseInt(textLength) + 1;
	}

	if (text.length > textLength) {
		text = text.substr(0, textLength) + '...';
	}
	return text;

};

//Number testing function
exports.isNumber = function(number) {
	return !isNaN(parseFloat(number)) && isFinite(number);
};

/**
 * Function to convert first letter Capital for each word in string
 */
exports.titleCase = function(str) {
	var splitStr = str.toLowerCase().split(' ');
	for (var i = 0; i < splitStr.length; i++) {
		// You do not need to check if i is larger than splitStr length, as your for does that for you
		// Assign it back to the array
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	// Directly return the joined string
	return splitStr.join(' ');
};

exports.removeUnwanntedDecimals = function(val) {
	try {

		if (val != null && val != "") {

			var numStr = val.toString();

			var isInt = [];
			isInt = numStr.split('.');

			if (isInt.length > 1) {
				if (isInt[1] == '00' || isInt[1] == '0') {
					return parseInt(val);
				}
			}
		}

		return val;

	} catch(e) {
		throw (e);
	}
};

exports.setHintTextColor = function(uiControl, hintText, color) {
	var attributedHintText = Titanium.UI.createAttributedString({
		text : hintText,
		attributes : [{
			type : Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
			range : [0, hintText.length],
			value : color,
		}]
	});

	uiControl.setAttributedHintText(attributedHintText);
};
/**
 * Function for getting the day name.
 */
exports.getDayName = function(date) {
	if (!OS_IOS)
		date = new Date(date);
	var weekday = new Array(7);
	weekday[0] = "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";
	var n = weekday[date.getDay()];
	return n;
};
/**
 * Function for getting the bi week days.
 */
exports.getBiWeekDays = function(day, sheduleDate, isAdmin) {
	Ti.API.info('getBiWeekDays 1 : ', sheduleDate);

	var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
	var currentDate = new Date(sheduleDate);
	Ti.API.info('getBiWeekDays 2 : ', currentDate);
	var newDay1 = "";
	var newDay2 = "";
	switch(day) {
	case "Monday":
		currentDate.setDate(currentDate.getDate() + 1);
		newDay1 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate() + 3);
		newDay2 = currentDate;
		break;
	case "Tuesday":
		currentDate.setDate(currentDate.getDate());
		if (isAdmin == true) {
			spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
		}
		newDay1 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate() + 2);
		newDay2 = currentDate;
		break;
	case "Wednesday":
		currentDate.setDate(currentDate.getDate() + 1);
		newDay1 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate() + 6);
		newDay2 = currentDate;
		Ti.API.info('newDay2:: ', currentDate);
		break;
	case "Thursday":
		currentDate.setDate(currentDate.getDate());
		Ti.API.info('getBiWeekDays 3 : ', currentDate);
		if (isAdmin == true) {
			spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
		}
		newDay1 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate() + 5);
		newDay2 = currentDate;
		break;
	case "Friday":
		currentDate.setDate(currentDate.getDate() + 4);
		newDay1 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate() + 6);
		newDay2 = currentDate;
		break;
	case "Saturday":
		currentDate.setDate(currentDate.getDate() + 3);
		newDay1 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate() + 5);
		newDay2 = currentDate;
		break;
	case "Sunday":
		currentDate.setDate(currentDate.getDate() + 2);
		newDay1 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate() + 4);
		newDay2 = currentDate;
		break;
	}
	Ti.API.info('getBiWeekDays 4 : ', newDay1);
	return newDay1 + "/" + newDay2;
};

/**
 * Function for getting the tri week days.
 */
exports.getTriWeekDays = function(day, sheduleDate, isAdmin) {
	var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
	var currentDate = new Date(sheduleDate);
	var newDay1 = "";
	var newDay2 = "";
	var newDay3 = "";
	switch(day) {
	case "Monday":
		currentDate.setDate(currentDate.getDate());
		if (isAdmin == true) {
			spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
		}
		newDay1 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate() + 2);
		newDay2 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate() + 4);
		newDay3 = currentDate;
		break;
	case "Tuesday":
		currentDate.setDate(currentDate.getDate() + 6);
		newDay1 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate() + 1);
		newDay2 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate() + 3);
		newDay3 = currentDate;
		break;
	case "Wednesday":
		currentDate.setDate(currentDate.getDate());
		if (isAdmin == true) {
			spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
		}
		newDay1 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate() + 2);
		newDay2 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate() + 5);
		newDay3 = currentDate;
		Ti.API.info('newDay2:: ', currentDate);
		break;
	case "Thursday":
		currentDate.setDate(currentDate.getDate() + 4);
		newDay1 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate() + 6);
		newDay2 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate() + 1);
		newDay3 = currentDate;
		break;
	case "Friday":
		currentDate.setDate(currentDate.getDate() + 3);
		if (isAdmin == true) {
			spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
		}
		newDay1 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate() + 5);
		newDay2 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate());
		newDay3 = currentDate;
		break;
	case "Saturday":
		currentDate.setDate(currentDate.getDate() + 2);
		newDay1 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate() + 4);
		newDay2 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate() + 6);
		newDay3 = currentDate;
		break;
	case "Sunday":
		currentDate.setDate(currentDate.getDate() + 1);
		newDay1 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate() + 3);
		newDay2 = currentDate;
		currentDate = new Date(sheduleDate);
		currentDate.setDate(currentDate.getDate() + 5);
		newDay3 = currentDate;
		break;
	}
	return newDay1 + "/" + newDay2 + "/" + newDay3;
};

/**
 * Function for setting the time to date.
 */
exports.formatTimeToDate = function(time, date, second) {
	Ti.API.info('datecommon: ', date);
	Ti.API.info('timecommon: ', time);

	var actualDate = new Date(date);
	var actualTime = time.split(':');
	actualDate.setHours(actualTime[0], actualTime[1], second);
	Ti.API.info('actualDate: ', actualDate);
	var myDate = new Date(date);
	Ti.API.info('myDate : ', myDate);
	Ti.API.info('myDate get Date : ', myDate.getDate(), myDate.getUTCDate());
	actualDate.setUTCDate(myDate.getUTCDate());
	actualDate.setUTCMonth(myDate.getUTCMonth());
	actualDate.setUTCFullYear(myDate.getUTCFullYear());
	Ti.API.info('ACTUAL DATE****** ', actualDate);
	return actualDate;
};
/**
 * Function for set time for android notification
 */
exports.formatTimeForAndroidNot = function(time, date, second) {
	Ti.API.info('dateAndroid: ', date);
	Ti.API.info('timecommonAndroid: ', time);
	var AMPM = time.match(/\s(.*)$/)[1];
	var hours = Number(time.match(/^(\d+)/)[1]);
	var minutes = Number(time.match(/:(\d+)/)[1]);
	var actualDate = new Date(date);
	Ti.API.info('ACTUAL DATE:: ', actualDate);
	var day = actualDate.getDate();
	var month = parseInt(actualDate.getMonth() + 1);
	if (day < 10)
		day = "0" + day;
	if (month < 10)
		month = "0" + month;

	var setTime = day + "-" + month + "-" + actualDate.getFullYear() + " " + hours + ":" + minutes + ":" + "0" + second + " " + AMPM;
	Ti.API.info('SET TIME ANDROID:: ', setTime);
	return setTime;
};
exports.formatTimeForAndroidNotForNewModule = function(time, date, second) {
	Ti.API.info('dateAndroid: ', date);
	Ti.API.info('timecommonAndroid: ', time);
	var AMPM = time.match(/\s(.*)$/)[1];
	var hours = Number(time.match(/^(\d+)/)[1]);
	var minutes = Number(time.match(/:(\d+)/)[1]);
	var actualDate = new Date(date);
	Ti.API.info('ACTUAL DATE:: ', actualDate);
	var day = actualDate.getDate();
	var month = parseInt(actualDate.getMonth() + 1);
	if (day < 10)
		day = "0" + day;
	if (month < 10)
		month = "0" + month;

	var setTime = month + "-" + day + "-" + actualDate.getFullYear() + " " + hours + ":" + minutes + ":" + "0" + second + " " + AMPM;
	Ti.API.info('SET TIME ANDROID:: ', setTime);
	return setTime;
};
exports.formatTimeForAndroidNotNew = function(time, date, second) {
	Ti.API.info('dateAndroid: ', date);
	Ti.API.info('timecommonAndroid: ', time);
	var res = time.split(":");
	var hours = res[0];
	var minutes = res[1];
	var AMPM = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12;
	hours = parseInt(hours, 10);

	second = parseInt(second, 10);

	minutes = parseInt(minutes, 10);

	if (second < 10) {
		second = "0" + second;
	}
	if (hours < 10)
		hours = "0" + hours;
	if (minutes < 10)
		minutes = "0" + minutes;

	var actualDate = new Date(date);
	Ti.API.info('ACTUAL DATE:: ', actualDate);
	var day = actualDate.getDate();
	var month = parseInt(actualDate.getMonth() + 1);
	if (day < 10)
		day = "0" + day;
	if (month < 10)
		month = "0" + month;

	var setTime = day + "-" + month + "-" + actualDate.getFullYear() + " " + hours + ":" + minutes + ":" + second + " " + AMPM;

	Ti.API.info('SET TIME ANDROID:: ', setTime);
	return setTime;
};
exports.formatTimeForAndroidNotNewChanged = function(time, date, second) {
	Ti.API.info('dateAndroid: ', date);
	Ti.API.info('timecommonAndroid: ', time);
	var res = time.split(":");
	var hours = res[0];
	var minutes = res[1];
	var AMPM = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12;
	hours = parseInt(hours, 10);

	second = parseInt(second, 10);

	minutes = parseInt(minutes, 10);

	if (second < 10) {
		second = "0" + second;
	}
	if (hours < 10)
		hours = "0" + hours;
	if (minutes < 10)
		minutes = "0" + minutes;

	var actualDate = new Date(date);
	Ti.API.info('ACTUAL DATE:: ', actualDate);
	var day = actualDate.getDate();
	var month = parseInt(actualDate.getMonth() + 1);
	if (day < 10)
		day = "0" + day;
	if (month < 10)
		month = "0" + month;

	var setTime = month + "-" + day + "-" + actualDate.getFullYear() + " " + hours + ":" + minutes + ":" + second + " " + AMPM;

	Ti.API.info('SET TIME ANDROID:: ', setTime);
	return setTime;
};
exports.formatTimeForAndroidHours = function(date, second, hoursAdded) {
	Date.prototype.addHours = function(h) {
		this.setTime(this.getTime() + (h * 60 * 60 * 1000));
		return this;
	};

	var actualDate = new Date(date);
	actualDate.addHours(hoursAdded);
	Ti.API.info('ACTUAL DATE:: ', actualDate);
	var day = actualDate.getDate();
	var month = parseInt(actualDate.getMonth() + 1);
	var hours = actualDate.getHours();
	var minutes = actualDate.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12;
	// the hour '0' should be '12'
	minutes = minutes < 10 ? '0' + minutes : minutes;

	if (day < 10)
		day = "0" + day;
	if (month < 10)
		month = "0" + month;

	var setTime = day + "-" + month + "-" + actualDate.getFullYear() + " " + hours + ":" + minutes + ":" + second + " " + ampm;
	Ti.API.info('SET TIME ANDROID:: ', setTime);
	return setTime;
};
/**
 * Function for set time for android notification when login..
 */
exports.formatTimeForAndroidSignIn = function(dateTime) {
	var actualDate = new Date(dateTime);
	Ti.API.info('ACTUAL DATE:: ', actualDate);
	var day = actualDate.getDate();
	var month = parseInt(actualDate.getMonth() + 1);
	if (day < 10)
		day = "0" + day;
	if (month < 10)
		month = "0" + month;
	Ti.API.info('CURRENT HOUR:: ', actualDate.getHours());
	var AMPM = actualDate.getHours() > 12 ? 'pm' : 'am';
	var hours = actualDate.getHours() > 12 ? (actualDate.getHours() - 12) : actualDate.getHours();
	var setTime = day + "-" + month + "-" + actualDate.getFullYear() + " " + hours + ":" + actualDate.getMinutes() + ":" + "0" + actualDate.getSeconds() + " " + AMPM;
	Ti.API.info('SET TIME ANDROID LOGIN:: ', setTime);
	return setTime;
};

/**
 * Function for formating the time.
 */
exports.ConvertTwentyFourHourForLocal = function(time) {

	var hours = Number(time.match(/^(\d+)/)[1]);
	var minutes = Number(time.match(/:(\d+)/)[1]);
	var AMPM = time.match(/\s(.*)$/)[1];
	if (AMPM == "PM" && hours < 12)
		hours = hours + 12;
	if (AMPM == "AM" && hours == 12)
		hours = hours - 12;
	var sHours = hours.toString();
	var sMinutes = minutes.toString();
	if (hours < 10)
		sHours = "0" + sHours;
	if (minutes < 10)
		sMinutes = "0" + sMinutes;
	return sHours + ":" + sMinutes;
};

/**
 * Function for getting the bi monthly days.(10,20)
 */
exports.getBiMonthDays = function(sheduleDate, isAdmin) {
	var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
	var newDay1 = "";
	var newDay2 = "";
	var monthDate = new Date(sheduleDate);
	var monthDay = monthDate.getDate();
	Ti.API.info('DAY:: ', monthDay);
	if (monthDay == 10) {
		monthDate.setDate(monthDate.getDate());
		if (isAdmin == true) {
			spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
		}
		newDay1 = monthDate;
		monthDate = new Date(sheduleDate);
		monthDate.setDate(monthDate.getDate() + 10);
		newDay2 = monthDate;
	} else if (monthDay < 10) {
		var day10Left = 10 - parseInt(monthDay);
		var day20Left = 20 - parseInt(monthDay);
		Ti.API.info('day10Left:: ', day10Left);
		Ti.API.info('day20Left:: ', day20Left);
		monthDate.setDate(monthDate.getDate() + day10Left);
		newDay1 = monthDate;
		monthDate = new Date(sheduleDate);
		monthDate.setDate(monthDate.getDate() + day20Left);
		newDay2 = monthDate;
	} else if (monthDay > 10 && monthDay < 20) {
		var month = monthDate.getMonth();
		Ti.API.info('currentMonth:: ', month);
		monthDate.setDate(10);
		monthDate.setMonth(month + 1);
		newDay1 = monthDate;
		monthDate = new Date(sheduleDate);
		var day20Left = 20 - parseInt(monthDay);
		monthDate.setDate(monthDate.getDate() + day20Left);
		newDay2 = monthDate;
	} else if (monthDay == 20) {
		monthDate.setDate(monthDate.getDate());
		if (isAdmin == true) {
			spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
		}
		newDay1 = monthDate;
		monthDate = new Date(sheduleDate);
		var month = monthDate.getMonth();
		monthDate.setDate(10);
		monthDate.setMonth(month + 1);
		newDay2 = monthDate;
	} else if (monthDay > 20) {
		var month = monthDate.getMonth();
		Ti.API.info('month1::', month);
		monthDate.setDate(10);
		monthDate.setMonth(month + 1);
		newDay1 = monthDate;
		monthDate = new Date(sheduleDate);
		monthDate.setDate(20);
		monthDate.setMonth(month + 1);
		newDay2 = monthDate;
	}
	return newDay1 + "/" + newDay2;
};

/**
 * Function to get the week days for notifiactions.
 */
exports.getWeekDays = function(pause, resume, dayName, setTime) {
	var from = new Date(pause);
	var to = new Date(resume);
	var notTime = new Date(setTime);
	var dayCount = 0;
	var d = from;
	if (from.getTime() < notTime.getTime())
		d = notTime;
	var dayType;
	if (dayName == "Sunday")
		dayType = 0;
	else if (dayName == "Monday")
		dayType = 1;
	else if (dayName == "Tuesday")
		dayType = 2;
	else if (dayName == "Wednesday")
		dayType = 3;
	else if (dayName == "Thursday")
		dayType = 4;
	else if (dayName == "Friday")
		dayType = 5;
	else if (dayName == "Saturday")
		dayType = 6;
	Ti.API.info('SET TIME :: ', notTime);
	Ti.API.info('TO DATE TIME:: ', to);
	//alert("dayType : " + dayType);
	while (d <= to) {

		var resumeTime = to;

		if (d.getDay() == dayType && resumeTime.getTime() > d.getTime() && from.getTime() < d.getTime()) {
			//alert("Increase Count : " + d);
			dayCount++;
		}

		if (d.getTime() == to.getTime())
			break;

		d = new Date(d.getTime() + (24 * 60 * 60 * 1000));
		if (d.getTime() > to.getTime()) {
			var cur = new Date(d);
			cur.setHours(notTime.getHours(), notTime.getMinutes(), notTime.getSeconds(), notTime.getMilliseconds());
			d = cur;
		}

	}

	return dayCount;
};
/**
 * Function to get the days(10,20) for bi monthly notifications.
 */
exports.getMonthDays = function(pause, resume, setTime) {
	var from = new Date(pause);
	var to = new Date(resume);
	var notTime = new Date(setTime);
	var dayCount = 0;
	var d = from;
	if (from.getTime() < notTime.getTime())
		d = notTime;
	while (d <= to) {

		var resumeTime = to;

		if ((d.getDate() == 10 || d.getDate() == 20) && resumeTime.getTime() > d.getTime() && from.getTime() < d.getTime()) {
			//alert("Increase Count : " + d);
			dayCount++;
		}

		if (d.getTime() == to.getTime())
			break;

		d = new Date(d.getTime() + (24 * 60 * 60 * 1000));
		if (d.getTime() > to.getTime()) {
			var cur = new Date(d);
			cur.setHours(notTime.getHours(), notTime.getMinutes(), notTime.getSeconds(), notTime.getMilliseconds());
			d = cur;
		}

	}
	return dayCount;
};
exports.getMonthDaysNew = function(pause, resume, setTime) {
	var from = new Date(pause);
	var to = new Date(resume);
	var notTime = new Date(setTime);

	var dayCount = 0;
	var d = from;
	if (from.getTime() < notTime.getTime())
		d = notTime;
	while (d <= to) {

		var resumeTime = to;

		if (d.getDate() == notTime.getDate() && resumeTime.getTime() > d.getTime() && from.getTime() < d.getTime()) {

			dayCount++;
		}

		if (d.getTime() == to.getTime())
			break;

		d = new Date(d.getTime() + (24 * 60 * 60 * 1000));
		if (d.getTime() > to.getTime()) {
			var cur = new Date(d);
			cur.setHours(notTime.getHours(), notTime.getMinutes(), notTime.getSeconds(), notTime.getMilliseconds());
			d = cur;
		}

	}
	return dayCount;
};

/**
 * Function to get the daily days for notifications.
 */
exports.getDailyDays = function(pause, resume, dayName, setTime) {

	var from = new Date(pause);
	Ti.API.info('from1 :: ', from);
	var to = new Date(resume);
	var notTime = new Date(setTime);
	var dayCount = 0;
	var d = new Date(from.getTime());
	d.setHours(notTime.getHours(), notTime.getMinutes(), notTime.getSeconds(), notTime.getMilliseconds());
	Ti.API.info('from 2:: ', from);
	if (from.getTime() < notTime.getTime())
		d = notTime;
	var dayType;
	if (dayName == "Sunday")
		dayType = 0;
	else if (dayName == "Monday")
		dayType = 1;
	else if (dayName == "Tuesday")
		dayType = 2;
	else if (dayName == "Wednesday")
		dayType = 3;
	else if (dayName == "Thursday")
		dayType = 4;
	else if (dayName == "Friday")
		dayType = 5;
	else if (dayName == "Saturday")
		dayType = 6;
	Ti.API.info('SET TIME :: ', notTime);
	Ti.API.info('TO DATE TIME:: ', to);
	Ti.API.info('Initial d :: ', d);
	Ti.API.info('from3 :: ', from);

	while (d <= to) {

		var resumeTime = to;

		if (resumeTime.getTime() > d.getTime() && from.getTime() < d.getTime()) {

			Ti.API.info('Increase count');
			dayCount++;
		}

		if (d.getTime() == to.getTime())
			break;

		d = new Date(d.getTime() + (24 * 60 * 60 * 1000));
		Ti.API.info('New d : ', d);
		if (d.getTime() > to.getTime()) {
			var cur = new Date(d);
			cur.setHours(notTime.getHours(), notTime.getMinutes(), notTime.getSeconds(), notTime.getMilliseconds());
			d = cur;
			Ti.API.info('Restting d : ', d);
		}

	}

	return dayCount;
};
/**
 * Function to get last remainder time to properties object
 */
exports.getLastReminderTime = function() {
	adminReminderValues = Ti.App.Properties.getObject('lastAdminReminderTime');
	localReminderValues = Ti.App.Properties.getObject('lastLocalReminderTime');
};
/**
 * Function to set last remainder time to properties object
 */
exports.setLastReminderTime = function() {
	Ti.App.Properties.setObject('lastAdminReminderTime', adminReminderValues);
	console.log("localReminderValues");
	console.log(localReminderValues);
	Ti.App.Properties.setObject('lastLocalReminderTime', localReminderValues);
};

/**
 * Function to get the daily days for notifications.
 */
exports.getHoursNumber = function(pause, resume, setTime, index, type, isAdmin) {
	var from = new Date(pause);
	var to = new Date(resume);
	var notTime = new Date(setTime);
	var hourCount = 0;
	var diff = (to.getTime() - notTime.getTime()) / 1000;
	Ti.API.info('diff seconds: ', diff);
	if (index == 0) {
		var tempTest = diff / 3600;
		var arrTemp = tempTest.toString().split(".");
		var no0fHours = parseInt(arrTemp[0]);
	} else if (index == 1) {
		var tempTest = diff / 10800;
		var arrTemp = tempTest.toString().split(".");
		var no0fHours = parseInt(arrTemp[0]);

	} else if (index == 2) {
		var tempTest = diff / 21600;
		var arrTemp = tempTest.toString().split(".");

		var no0fHours = parseInt(arrTemp[0]);
	} else if (index == 3) {
		var tempTest = diff / 43200;
		var arrTemp = tempTest.toString().split(".");

		var no0fHours = parseInt(arrTemp[0]);
	}

	Ti.API.info('no0fHours : ', no0fHours);

	Ti.API.info('SET TIME :: ', setTime);
	Ti.API.info('TO DATE TIME:: ', to);
	var lastD = notTime;
	var lastDate = "";
	Date.prototype.addHours = function(h) {
		this.setTime(this.getTime() + (h * 60 * 60 * 1000));
		return this;
	};
	if (no0fHours > 0) {
		while (lastD.getTime() <= to.getTime()) {
			lastDate = new Date(lastD.getTime());
			if (index == 0) {
				lastD = lastD.addHours(1);
			} else if (index == 1) {
				lastD = lastD.addHours(3);
			} else if (index == 2) {
				lastD = lastD.addHours(6);
			} else if (index == 3) {
				lastD = lastD.addHours(12);
			}

		}
	}
	if (lastDate != "") {

		if (isAdmin == 1) {

			if (index == 0) {
				if (type == "survey") {
					adminReminderValues.hourlySurvey = lastDate.toUTCString();
				} else {
					adminReminderValues.hourlyCog = lastDate.toUTCString();
				}
			} else if (index == 1) {
				if (type == "survey") {
					adminReminderValues.threeHourSurvey = lastDate.toUTCString();
				} else {
					adminReminderValues.threeHourCog = lastDate.toUTCString();
				}
			} else if (index == 2) {
				if (type == "survey") {
					adminReminderValues.sixHourSurvey = lastDate.toUTCString();

				} else {
					adminReminderValues.sixHourSurvey = lastDate.toUTCString();

				}
			} else if (index == 3) {
				if (type == "survey") {
					adminReminderValues.twelveHourSurvey = lastDate.toUTCString();

				} else {
					adminReminderValues.twelveHourCog = lastDate.toUTCString();

				}
			}

		} else {
			if (index == 0) {
				if (type == "survey") {
					localReminderValues.hourlySurvey = lastDate.toUTCString();
				} else {
					localReminderValues.hourlyCog = lastDate.toUTCString();
				}
			} else if (index == 1) {
				if (type == "survey") {
					localReminderValues.threeHourSurvey = lastDate.toUTCString();
				} else {
					localReminderValues.threeHourCog = lastDate.toUTCString();
				}
			} else if (index == 2) {
				if (type == "survey") {
					localReminderValues.sixHourSurvey = lastDate.toUTCString();

				} else {
					localReminderValues.sixHourSurvey = lastDate.toUTCString();

				}
			} else if (index == 3) {
				if (type == "survey") {
					localReminderValues.twelveHourSurvey = lastDate.toUTCString();

				} else {
					localReminderValues.twelveHourCog = lastDate.toUTCString();

				}
			}

		}

	}

	return no0fHours;
};

/**
 * Function to get the sleep analysis value in Healthkit.
 */
exports.sleepAnalysisNameForValue = function(value) {
	switch (value) {
	case 0:
		return 'In Bed';
	case 1:
		return 'Asleep';
	}
};

/**
 * Converting kilogram to pound.
 */
exports.convertKiloGmToPound = function(kilogm) {
	var nearExact = kilogm / 0.45359237;
	var lbs = Math.floor(nearExact);
	return lbs;
};
/**
 * Converting to feet/inches fromat
 */
exports.getFeetInchesFormat = function(value) {
	Ti.API.info('getFeetInchesFormat : ', value);
	var feet = Math.floor(value);
	Ti.API.info('getFeetInchesFormat feet : ', feet);
	var inches = Math.round((value - feet) * 12);
	Ti.API.info('getFeetInchesFormat inches : ', inches);
	var feetInches = feet + "'" + inches + '"';
	Ti.API.info('getFeetInchesFormat feetInches : ', feetInches);
	return feetInches;
};

/***
 * Gets the current date with month name in string
 */
exports.getMonthNameFormat = function(date) {
	if (!date) {
		var date = new Date();
	} else {
		var date = new Date(date);
	}
	var currentTime = date;
	var monthCount = currentTime.getMonth();
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	var month = new Array();
	month[0] = "Jan";
	month[1] = "Feb";
	month[2] = "Mar";
	month[3] = "Apr";
	month[4] = "May";
	month[5] = "June";
	month[6] = "July";
	month[7] = "Aug";
	month[8] = "Sep";
	month[9] = "Oct";
	month[10] = "Nov";
	month[11] = "Dec";
	if (day.toString().length == 1) {
		day = "0" + day;
	}
	var monthName = month[monthCount];
	return monthName + " " + day + ", " + year;
};

/**
 * Function used to get the average.
 */
exports.getAverage = function(count, value) {
	var result = value / count;
	result = Math.round(result);
	return result;
};

/**
 * Function to get day and month from a date.
 */
exports.getDayMonth = function(date) {
	var dates = new Date(date);
	var day = dates.getUTCDate();
	var month = dates.getMonth() + 1;
	return day + "/" + month;
};

/**
 * Function used to get the hour and min between 2 dates.
 */
exports.getHourMinute = function(startDate, endDate) {
	var one_day = 60 * 1000;
	var Date1 = new Date(startDate);
	var Date2 = new Date(endDate);
	var date1_ms = Date1.getTime();
	var date2_ms = Date2.getTime();
	var difference_ms = date2_ms - date1_ms;
	var time = new Date(difference_ms / one_day);
	var hour = Math.floor(time / 60);
	var m = time % 60;
	return hour + "/" + m;
};
/**
 * function for  get the minute and second between 2 dates.
 */
exports.getMinuteSecond = function(startDate, endDate) {
	var Date1 = new Date(startDate);
	var Date2 = new Date(endDate);
	var date1_ms = Date1.getTime();
	var date2_ms = Date2.getTime();
	var difference_ms = date2_ms - date1_ms;
	Ti.API.info('time diffrnce is' + Math.floor(difference_ms));
	var seconds = Math.floor((difference_ms / 1000) % 60);
	var minutes = Math.floor((difference_ms / (1000 * 60)) % 60);
	if (seconds < 10)
		seconds = "0" + seconds;
	if (minutes < 10)
		minutes = "0" + minutes;
	Ti.API.info('sec is ' + seconds);
	Ti.API.info('min is ' + minutes);
	return minutes + ":" + seconds;
};

/**
 * Function for converting seconds to HH:MM format.
 */
exports.getHourMinuteFormat = function(hrs, count) {
	Ti.API.info('HRS:: ', hrs);
	var splitHours = hrs.split(":");
	var totalSecs = splitHours[0] * 60 * 60;
	totalSecs += splitHours[1] * 60;
	var seconds = Math.floor(totalSecs / count);
	var result;
	var hours = Math.floor(seconds / 3600);
	var minutes = Math.floor((seconds - (hours * 3600)) / 60);
	if (hours > 0 && minutes > 0)
		result = hours + " hr " + minutes + " min";
	else if (hours > 0 && minutes <= 0) {
		result = hours + " hr ";
	} else if (hours <= 0 && minutes > 0)
		result = minutes + " min";
	return result;
};
/**
 * Function to set morning afternoon and evening according to the time
 */
exports.setDayTime = function(time) {
	var commonFunctions = require('commonFunctions');
	var LangCode = Ti.App.Properties.getString('languageCode');
	var finalResult = "";
	var index = 0;
	var splitTime = time.split(":");
	var amPm = time.split(" ");
	var splitResult = splitTime[0];
	var amPmResult = amPm[1];
	if (amPmResult == "PM") {
		if (parseInt(splitResult) >= 5 && parseInt(splitResult) < 12) {
			finalResult = commonFunctions.L('eveningLbl', LangCode);
			index = 2;
		} else if (parseInt(splitResult) == 12 || parseInt(splitResult) < 5) {
			finalResult = commonFunctions.L('noonLbl', LangCode);
			index = 1;
		}
	} else {
		if (parseInt(splitResult) == 12 || parseInt(splitResult) >= 1) {
			finalResult = commonFunctions.L('morningLbl', LangCode);
			index = 0;
		}
	}
	Ti.API.info('****FINAL RESULL***** ', finalResult);
	return finalResult + "/" + index;
};

/**
 * Function to get the separated time values.
 */
exports.getSeparatedValues = function(time) {
	var splitTime = time.split(":");
	var amPm = time.split(" ");
	var splitResult = splitTime[0];
	var amPmResult = amPm[1];
	return splitResult + "," + amPmResult;
};

/**
 * function for creating score popup
 */
exports.getScoreView = function(gameScore, points, timeTaken) {
	var commonFunctions = require('commonFunctions');
	var LangCode = Ti.App.Properties.getString('languageCode');
	var win = Ti.UI.createWindow({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		backgroundColor : 'transparent'
	});
	var outerView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		backgroundColor : '#000000',
		opacity : 0.6,
		zIndex : 200
	});
	var innerView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : "63%",
		backgroundColor : '#ffffff',
		left : "20dp",
		right : "20dp",
		borderRadius : 5,
		zIndex : 300,
		top : "27%",
	});
	if (Ti.Platform.osname == "ipad") {
		innerView.height = "40%";
		innerView.left = "50dp";
		innerView.right = "50dp";
	} else {
		if (OS_ANDROID) {
			var screenWidthInInches = Titanium.Platform.displayCaps.platformWidth / Titanium.Platform.displayCaps.dpi;
			var screenHeightInInches = Titanium.Platform.displayCaps.platformHeight / Titanium.Platform.displayCaps.dpi;
			var maxInches = (screenWidthInInches >= screenHeightInInches) ? screenWidthInInches : screenHeightInInches;
			Ti.API.info('maxInches : ', maxInches);
			if (maxInches >= 5.7) {
				innerView.height = "40%";
				innerView.left = "50dp";
				innerView.right = "50dp";
			}
		}

	}
	win.add(outerView);
	win.add(innerView);
	//outerView.add(innerView);
	var headerView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : '50dp',
		backgroundColor : Alloy.Globals.HEADER_COLOR,
		top : "0dp"
	});
	var headerTitle = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#ffffff',
		font : Alloy.Globals.LargeSemiBold,
		text : commonFunctions.L('scoreCardLbl', LangCode),
		touchEnabled : false
	});
	headerView.add(headerTitle);
	var ContentView = Ti.UI.createView({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		layout : "vertical",
	});
	var scoreTitle = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#546e7a',
		font : Alloy.Globals.HeaderFontLight,
		text : commonFunctions.L('totalScoreLbl', LangCode),
		top : "15dp"
	});
	var scoreValue = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#03d981',
		font : Alloy.Globals.mediumLargeSemiBold,
		text : gameScore,
		top : "8dp"
	});
	var timeTitle = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#546e7a',
		font : Alloy.Globals.HeaderFontLight,
		text : commonFunctions.L('timetakenLbl', LangCode),
		top : "20dp"
	});
	var timeValue = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#03d981',
		font : Alloy.Globals.mediumLargeSemiBold,
		text : timeTaken,
		top : "8dp"
	});
	var pointTitle = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#546e7a',
		font : Alloy.Globals.HeaderFontLight,
		text : commonFunctions.L('pointEarnedLbl', LangCode),
		top : "20dp"
	});
	var pointValue = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : ' #03d981',
		font : Alloy.Globals.mediumLargeSemiBold,
		text : points,
		top : "8dp"
	});
	var seperator = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : "1dp",
		backgroundColor : '#ddd',
		top : "0dp"
	});
	var cancelView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : '50dp',
		color : 'transparent',
		bottom : "0dp"
	});
	var cancelTitle = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#ff6060',
		font : Alloy.Globals.LargeSemiBold,
		text : commonFunctions.L('closeLbl', LangCode),
		touchEnabled : false
	});
	cancelView.add(seperator);
	cancelView.add(cancelTitle);
	cancelView.addEventListener('click', function() {
		win.close();
		win = null;
		Ti.App.fireEvent("getValues");
	});

	innerView.add(headerView);
	innerView.add(cancelView);
	innerView.add(ContentView);
	ContentView.add(scoreTitle);
	ContentView.add(scoreValue);
	ContentView.add(timeTitle);
	ContentView.add(timeValue);
	ContentView.add(pointTitle);
	ContentView.add(pointValue);

	win.open();
	return win;
};
exports.getScoreViewJewel = function(gameScore, points, timeTaken) {
	var LangCode = Ti.App.Properties.getString('languageCode');
	var commonFunctions = require('commonFunctions');
	var win = Ti.UI.createWindow({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		backgroundColor : 'transparent'
	});
	var outerView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		backgroundColor : '#000000',
		opacity : 0.6,
		zIndex : 200
	});
	var innerView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : "73%",
		//height : "65%",
		backgroundColor : '#ffffff',
		left : "20dp",
		right : "20dp",
		borderRadius : 5,
		zIndex : 300,
		top : "15%",
	});
	if (Ti.Platform.osname == "ipad") {
		innerView.height = "40%";
		innerView.top = "30%";
		innerView.left = "50dp";
		innerView.right = "50dp";
	} else {
		if (OS_ANDROID) {
			var screenWidthInInches = Titanium.Platform.displayCaps.platformWidth / Titanium.Platform.displayCaps.dpi;
			var screenHeightInInches = Titanium.Platform.displayCaps.platformHeight / Titanium.Platform.displayCaps.dpi;
			var maxInches = (screenWidthInInches >= screenHeightInInches) ? screenWidthInInches : screenHeightInInches;
			Ti.API.info('maxInches : ', maxInches);
			if (maxInches >= 5.7) {
				innerView.height = "38%";
				innerView.top = "30%";
				innerView.left = "50dp";
				innerView.right = "50dp";
			}
		}

	}
	win.add(outerView);
	win.add(innerView);

	var headerView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : '50dp',
		backgroundColor : Alloy.Globals.HEADER_COLOR,
		top : "0dp"
	});
	var headerTitle = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#ffffff',
		font : Alloy.Globals.LargeSemiBold,
		text : commonFunctions.L('scoreCardLbl', LangCode),
		touchEnabled : false
	});
	headerView.add(headerTitle);
	var ContentViewMain = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		top : '50dp'
	});
	var ContentView = Ti.UI.createView({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		layout : "vertical",
	});
	var scoreTitle = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#546e7a',
		font : Alloy.Globals.HeaderFontLight,
		text : commonFunctions.L('scoreLbl', LangCode),
		top : "15dp"
	});
	var scoreValue = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#03d981',
		font : Alloy.Globals.mediumLargeSemiBold,
		text : gameScore,
		top : "8dp"
	});
	var timeTitle = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#546e7a',
		font : Alloy.Globals.HeaderFontLight,
		text : commonFunctions.L('jwelcollectedLbl', LangCode),
		top : "15dp"
	});
	var timeValue = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#03d981',
		font : Alloy.Globals.mediumLargeSemiBold,
		text : timeTaken,
		top : "8dp"
	});
	var pointTitle = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#546e7a',
		font : Alloy.Globals.HeaderFontLight,
		text : commonFunctions.L('bonusLbl', LangCode),
		top : "15dp"
	});
	var pointValue = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : ' #03d981',
		font : Alloy.Globals.mediumLargeSemiBold,
		text : points,
		top : "8dp"
	});
	var buttonOuter = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : '50dp',
		layout : "horizontal",
		top : '15dp'
	});
	var buttonInner1 = Ti.UI.createView({
		width : '50%',
		height : '50dp',
		left : '0dp'
	});
	var buttonInner2 = Ti.UI.createView({
		width : '49.5%',
		height : '50dp',
		left : '0dp'
	});

	var button1 = Ti.UI.createView({
		width : '120dp',
		height : '40dp',
		borderRadius : '20dp',
		borderColor : Alloy.Globals.HEADER_COLOR,
		borderWidth : '1dp'
	});
	var button2 = Ti.UI.createView({
		width : '120dp',
		height : '40dp',
		borderRadius : '20dp',
		borderColor : Alloy.Globals.HEADER_COLOR,
		borderWidth : '1dp'
	});
	var button3 = Ti.UI.createView({
		width : '120dp',
		height : '40dp',
		borderRadius : '20dp',
		borderColor : Alloy.Globals.HEADER_COLOR,
		borderWidth : '1dp',
		top : '15dp'
	});
	if (Ti.Platform.osname == "ipad") {
		button1 = Ti.UI.createView({
			width : '160dp',
			height : '50dp',
			borderRadius : '25dp',
			borderColor : Alloy.Globals.HEADER_COLOR,
			borderWidth : '1dp'
		});
		button2 = Ti.UI.createView({
			width : '160dp',
			height : '50dp',
			borderRadius : '25dp',
			borderColor : Alloy.Globals.HEADER_COLOR,
			borderWidth : '1dp'
		});
		button3 = Ti.UI.createView({
			width : '160dp',
			height : '50dp',
			borderRadius : '25dp',
			borderColor : Alloy.Globals.HEADER_COLOR,
			borderWidth : '1dp'
		});

	} else {
		if (OS_ANDROID) {
			var screenWidthInInches = Titanium.Platform.displayCaps.platformWidth / Titanium.Platform.displayCaps.dpi;
			var screenHeightInInches = Titanium.Platform.displayCaps.platformHeight / Titanium.Platform.displayCaps.dpi;
			var maxInches = (screenWidthInInches >= screenHeightInInches) ? screenWidthInInches : screenHeightInInches;
			Ti.API.info('maxInches : ', maxInches);
			if (maxInches >= 5.7) {
				button1 = Ti.UI.createView({
					width : '160dp',
					height : '50dp',
					borderRadius : '25dp',
					borderColor : Alloy.Globals.HEADER_COLOR,
					borderWidth : '1dp'
				});
				button2 = Ti.UI.createView({
					width : '160dp',
					height : '50dp',
					borderRadius : '25dp',
					borderColor : Alloy.Globals.HEADER_COLOR,
					borderWidth : '1dp'
				});
				button3 = Ti.UI.createView({
					width : '160dp',
					height : '50dp',
					borderRadius : '25dp',
					borderColor : Alloy.Globals.HEADER_COLOR,
					borderWidth : '1dp'
				});

			}
		}

	}

	if (LangCode == "pt-br" || LangCode == 'es') {
		var score = commonFunctions.L('totalScoreLbl', LangCode);
		var scoreLbl = commonFunctions.trimText(score, 12);
	} else {
		var scoreLbl = commonFunctions.L('totalScoreLbl', LangCode);
	}
	var button1Label = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : Alloy.Globals.HEADER_COLOR,
		font : Alloy.Globals.MediumSemiBoldTablet,
		text : commonFunctions.L('continueLbl', LangCode),
		touchEnabled : false
	});
	var button2Label = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : Alloy.Globals.HEADER_COLOR,
		font : Alloy.Globals.MediumSemiBoldTablet,
		text : scoreLbl,
		touchEnabled : false
	});
	var button3Label = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : Alloy.Globals.HEADER_COLOR,
		font : Alloy.Globals.MediumSemiBoldTablet,
		text : commonFunctions.L('exitLbl', LangCode),
		touchEnabled : false
	});
	button1.add(button1Label);
	button2.add(button2Label);
	button3.add(button3Label);
	buttonInner1.add(button1);
	buttonInner2.add(button2);
	buttonOuter.add(buttonInner1);
	buttonOuter.add(buttonInner2);
	button1.addEventListener('click', function() {
		win.close();
		win = null;
		Ti.App.fireEvent("getValues");
	});
	button2.addEventListener('click', function() {
		Ti.App.fireEvent("totalScoreClick");
		win.close();
		win = null;

	});

	button3.addEventListener('click', function() {
		win.close();
		win = null;
		Ti.App.fireEvent("exitScoreView");

	});

	innerView.add(headerView);
	ContentViewMain.add(ContentView);
	innerView.add(ContentViewMain);
	ContentView.add(scoreTitle);
	ContentView.add(scoreValue);
	ContentView.add(timeTitle);
	ContentView.add(timeValue);
	ContentView.add(pointTitle);
	ContentView.add(pointValue);
	ContentView.add(buttonOuter);
	ContentView.add(button3);

	win.open();
	return win;
};
exports.getScoreViewJewelTotal = function(gameScore, points, timeTaken) {
	var commonFunctions = require('commonFunctions');
	var LangCode = Ti.App.Properties.getString('languageCode');
	var win = Ti.UI.createWindow({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		backgroundColor : 'transparent'
	});
	var outerView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		backgroundColor : '#000000',
		opacity : 0.6,
		zIndex : 200
	});
	var innerView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : "65%",
		backgroundColor : '#ffffff',
		left : "20dp",
		right : "20dp",
		borderRadius : 5,
		zIndex : 300,

		top : "15%",
	});
	if (Ti.Platform.osname == "ipad") {
		innerView.height = "38%";
		innerView.top = "30%";
		innerView.left = "50dp";
		innerView.right = "50dp";
	} else {
		if (OS_ANDROID) {
			var screenWidthInInches = Titanium.Platform.displayCaps.platformWidth / Titanium.Platform.displayCaps.dpi;
			var screenHeightInInches = Titanium.Platform.displayCaps.platformHeight / Titanium.Platform.displayCaps.dpi;
			var maxInches = (screenWidthInInches >= screenHeightInInches) ? screenWidthInInches : screenHeightInInches;
			Ti.API.info('maxInches : ', maxInches);
			if (maxInches >= 5.7) {
				innerView.height = "38%";
				innerView.top = "30%";
				innerView.left = "50dp";
				innerView.right = "50dp";
			}
		}

	}
	win.add(outerView);
	win.add(innerView);
	var headerView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : '50dp',
		backgroundColor : Alloy.Globals.HEADER_COLOR,
		top : "0dp"
	});
	var headerTitle = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#ffffff',
		font : Alloy.Globals.LargeSemiBold,
		text : commonFunctions.L('totalScoreCapsLbl', LangCode),
		touchEnabled : false
	});
	headerView.add(headerTitle);
	var ContentViewMain = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		top : '50dp'
	});
	var ContentView = Ti.UI.createView({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		layout : "vertical",
	});

	var scoreTitle = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#546e7a',
		font : Alloy.Globals.HeaderFontLight,
		text : commonFunctions.L('totalScoreLbl', LangCode),
		top : "15dp"
	});
	var scoreValue = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#03d981',
		font : Alloy.Globals.mediumLargeSemiBold,
		text : gameScore,
		top : "8dp"
	});
	var timeTitle = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#546e7a',
		font : Alloy.Globals.HeaderFontLight,
		text : commonFunctions.L('jwelcollectedLbl', LangCode),
		top : "15dp"
	});
	var timeValue = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#03d981',
		font : Alloy.Globals.mediumLargeSemiBold,
		text : timeTaken,
		top : "8dp"
	});
	var pointTitle = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#546e7a',
		font : Alloy.Globals.HeaderFontLight,
		text : commonFunctions.L('totalbonusLbl', LangCode),
		top : "15dp"
	});
	var pointValue = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : ' #03d981',
		font : Alloy.Globals.mediumLargeSemiBold,
		text : points,
		top : "8dp"
	});
	var buttonOuter = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : '50dp',
		layout : "horizontal",
		top : '15dp'
	});
	var buttonInner1 = Ti.UI.createView({
		width : '50%',
		height : '50dp',
		left : '0dp'
	});
	var buttonInner2 = Ti.UI.createView({
		width : '49.5%',
		height : '50dp',
		left : '0dp'
	});
	var button1 = Ti.UI.createView({
		width : '120dp',
		height : '40dp',
		borderRadius : '20dp',
		borderColor : Alloy.Globals.HEADER_COLOR,
		borderWidth : '1dp'
	});
	var button2 = Ti.UI.createView({
		width : '120dp',
		height : '40dp',
		borderRadius : '20dp',
		borderColor : Alloy.Globals.HEADER_COLOR,
		borderWidth : '1dp'
	});
	if (Ti.Platform.osname == "ipad") {
		button1 = Ti.UI.createView({
			width : '160dp',
			height : '50dp',
			borderRadius : '25dp',
			borderColor : Alloy.Globals.HEADER_COLOR,
			borderWidth : '1dp'
		});
		button2 = Ti.UI.createView({
			width : '160dp',
			height : '50dp',
			borderRadius : '25dp',
			borderColor : Alloy.Globals.HEADER_COLOR,
			borderWidth : '1dp'
		});

	} else {
		if (OS_ANDROID) {
			var screenWidthInInches = Titanium.Platform.displayCaps.platformWidth / Titanium.Platform.displayCaps.dpi;
			var screenHeightInInches = Titanium.Platform.displayCaps.platformHeight / Titanium.Platform.displayCaps.dpi;
			var maxInches = (screenWidthInInches >= screenHeightInInches) ? screenWidthInInches : screenHeightInInches;
			Ti.API.info('maxInches : ', maxInches);
			if (maxInches >= 5.7) {
				button1 = Ti.UI.createView({
					width : '160dp',
					height : '50dp',
					borderRadius : '25dp',
					borderColor : Alloy.Globals.HEADER_COLOR,
					borderWidth : '1dp'
				});
				button2 = Ti.UI.createView({
					width : '160dp',
					height : '50dp',
					borderRadius : '25dp',
					borderColor : Alloy.Globals.HEADER_COLOR,
					borderWidth : '1dp'
				});

			}
		}

	}

	var button1Label = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : Alloy.Globals.HEADER_COLOR,
		font : Alloy.Globals.MediumSemiBoldTablet,
		text : commonFunctions.L('continueLbl', LangCode),
		touchEnabled : false
	});
	var button2Label = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : Alloy.Globals.HEADER_COLOR,
		font : Alloy.Globals.MediumSemiBoldTablet,
		text : commonFunctions.L('reprtLbl', LangCode),
		touchEnabled : false
	});
	button1.addEventListener('click', function() {

		win.close();
		win = null;

		Ti.App.fireEvent("getValues");
	});
	button2.addEventListener('click', function() {

		win.close();
		win = null;

		Ti.App.fireEvent("ReportClick");
	});
	button1.add(button1Label);
	button2.add(button2Label);
	buttonInner1.add(button1);
	buttonInner2.add(button2);
	buttonOuter.add(buttonInner1);
	buttonOuter.add(buttonInner2);

	innerView.add(headerView);
	ContentViewMain.add(ContentView);
	innerView.add(ContentViewMain);
	ContentView.add(scoreTitle);
	ContentView.add(scoreValue);
	ContentView.add(timeTitle);
	ContentView.add(timeValue);
	ContentView.add(pointTitle);
	ContentView.add(pointValue);
	ContentView.add(buttonOuter);

	win.open();
	return win;
};
/**
 * function for Monthly PopUp
 */
exports.getMonthlyPopUp = function() {
	Ti.App.Properties.setString('monthlyPopUp', new Date().toUTCString());
	var win = Ti.UI.createWindow({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		backgroundColor : 'transparent'
	});
	var outerView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		backgroundColor : '#000000',
		opacity : 0.6,
		zIndex : 200
	});
	var innerView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
		backgroundColor : '#ffffff',
		left : "20dp",
		right : "20dp",
		borderRadius : 5,
		zIndex : 300,

		top : "27%",
	});
	if (Ti.Platform.osname == "ipad") {
		innerView.left = "50dp";
		innerView.right = "50dp";
	} else {
		if (OS_ANDROID) {
			var screenWidthInInches = Titanium.Platform.displayCaps.platformWidth / Titanium.Platform.displayCaps.dpi;
			var screenHeightInInches = Titanium.Platform.displayCaps.platformHeight / Titanium.Platform.displayCaps.dpi;
			var maxInches = (screenWidthInInches >= screenHeightInInches) ? screenWidthInInches : screenHeightInInches;
			Ti.API.info('maxInches : ', maxInches);
			if (maxInches >= 5.7) {
				innerView.left = "50dp";
				innerView.right = "50dp";
			}
		}

	}
	win.add(outerView);
	win.add(innerView);
	var headerView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : '50dp',
		backgroundColor : Alloy.Globals.HEADER_COLOR,
		top : "0dp"
	});
	var headerTitle = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#ffffff',
		font : Alloy.Globals.LargeSemiBold,
		text : 'Reminder',
		touchEnabled : false
	});
	headerView.add(headerTitle);
	var ContentView = Ti.UI.createView({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		top : '50dp',
		bottom : '50dp'
	});
	var scoreTitle = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#546e7a',
		font : Alloy.Globals.HeaderFontLight,
		text : 'This is a reminder that you are participating in a research study, SMART-A, which is collecting passive data from your smartphone to better understand cognitive impairment.',
		left : '10dp',
		right : '10dp',
		top : '30dp',
		bottom : '30dp'
	});

	var seperator = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : "1dp",
		backgroundColor : '#ddd',
		top : "0dp"
	});
	var cancelView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : '50dp',
		color : 'transparent',
		bottom : "0dp"
	});
	var cancelTitle = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#ff6060',
		font : Alloy.Globals.LargeSemiBold,
		text : 'Press to continue',
		touchEnabled : false
	});
	cancelView.add(seperator);
	cancelView.add(cancelTitle);
	cancelView.addEventListener('click', function() {
		win.close();
		win = null;
	});

	innerView.add(headerView);
	innerView.add(cancelView);
	innerView.add(ContentView);
	ContentView.add(scoreTitle);
	win.open();
	return win;
};
exports.protoTypeReminder = function() {

	var initialTime = Ti.App.Properties.getString("initialTime", "");

	var memoryTime = Ti.App.Properties.getString("memoryTime", "");
	Ti.API.info('initialTime : ', initialTime, " memoryTime: ", memoryTime);
	if (memoryTime != "") {
		var timeDiff = Math.abs(new Date().getTime() - new Date(memoryTime).getTime());
		Ti.API.info('memoryTime timeDiff : ', timeDiff);

		var diffDays = parseInt(timeDiff / (1000 * 3600 * 24));
		Ti.API.info('memoryTime diffDays : ', diffDays);

		var lastPopUp = Ti.App.Properties.getString("lastPopUp", "");

		if (diffDays == 6) {
			if (lastPopUp != 1 && lastPopUp != "1") {
				shedulePopup(1);
			}

		} else if (diffDays == 7) {
			if (lastPopUp != 2 && lastPopUp != "2") {
				shedulePopup(2);
			}

		} else if (diffDays == 8) {
			if (lastPopUp != 3 && lastPopUp != "3") {
				var d = new Date();

				Ti.App.Properties.setString('memoryTime', d.toString());
				shedulePopup(3);
			}

		} else if (diffDays > 8) {

			var noOfDiffDays = parseInt(diffDays / 8);
			var totalNoOfDays = noOfDiffDays * 8;
			var newMemoryTime = new Date(memoryTime);
			newMemoryTime.setDate(newMemoryTime.getDate() + totalNoOfDays);
			var memoryTime = Ti.App.Properties.getString("memoryTime", newMemoryTime);

		}
	}
	if (initialTime != "") {
		var timeDiff = Math.abs(new Date().getTime() - new Date(initialTime).getTime());
		Ti.API.info('initialTime timeDiff : ', timeDiff);
		var diffDays = parseInt(timeDiff / (1000 * 3600 * 24));
		Ti.API.info('initialTime diffDays : ', diffDays);
		if (diffDays == 11) {
			if (lastPopUp != 4 && lastPopUp != "4") {
				shedulePopup(4);
			}

		} else if (diffDays == 25) {
			if (lastPopUp != 5 && lastPopUp != "5") {
				shedulePopup(5);
			}

		} else if (diffDays == 39) {
			if (lastPopUp != 6 && lastPopUp != "6") {
				var d = new Date();
				Ti.App.Properties.setString('initialTime', d.toString());
				shedulePopup(6);
			}

		} else if (diffDays > 39) {
			var noOfDiffDays = parseInt(diffDays / 39);
			var totalNoOfDays = noOfDiffDays * 39;
			var newMemoryTime = new Date(initialTime);
			newMemoryTime.setDate(newMemoryTime.getDate() + totalNoOfDays);
			var memoryTime = Ti.App.Properties.getString("initialTime", newMemoryTime);

		}
	}

};
function shedulePopup(type, diffDays) {
	var commonFunctions = require('commonFunctions');
	var LangCode = Ti.App.Properties.getString('languageCode');
	Ti.App.Properties.setString('lastPopUp', type);
	if (Alloy.Globals.POPUPWINDOW_STACK != null) {
		Alloy.Globals.POPUPWINDOW_STACK.close();
		Alloy.Globals.POPUPWINDOW_STACK = null;

	}
	var win = Ti.UI.createWindow({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		backgroundColor : 'transparent'
	});
	var outerView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		backgroundColor : '#000000',
		opacity : 0.6,
		zIndex : 200
	});
	var innerView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : "60%",
		backgroundColor : '#ffffff',
		left : "20dp",
		right : "20dp",
		borderRadius : 5,
		zIndex : 300,

		top : "27%",
	});
	if (Ti.Platform.osname == "ipad") {
		innerView.height = "40%";
		innerView.left = "50dp";
		innerView.right = "50dp";
	} else {
		if (OS_ANDROID) {
			var screenWidthInInches = Titanium.Platform.displayCaps.platformWidth / Titanium.Platform.displayCaps.dpi;
			var screenHeightInInches = Titanium.Platform.displayCaps.platformHeight / Titanium.Platform.displayCaps.dpi;
			var maxInches = (screenWidthInInches >= screenHeightInInches) ? screenWidthInInches : screenHeightInInches;
			Ti.API.info('maxInches : ', maxInches);
			if (maxInches >= 5.7) {
				innerView.height = "40%";
				innerView.left = "50dp";
				innerView.right = "50dp";
			}
		}

	}
	win.add(outerView);
	win.add(innerView);
	var headerView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : '50dp',
		backgroundColor : Alloy.Globals.HEADER_COLOR,
		top : "0dp"
	});
	var headerTitle = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#ffffff',
		font : Alloy.Globals.LargeSemiBold,
		text : commonFunctions.L('reminderLbl', LangCode),
		touchEnabled : false
	});
	headerView.add(headerTitle);
	var ContentView = Ti.UI.createView({
		top : '50dp',
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		layout : "vertical",
	});
	var textTitle = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#546e7a',
		font : Alloy.Globals.LargeSemiBoldQuest,
		text : commonFunctions.L('suggestionLbl', LangCode),
		top : "20dp"
	});
	ContentView.add(textTitle);
	var initialTime = Ti.App.Properties.getString("initialTime", "");
	var timeDiff = Math.abs(new Date().getTime() - new Date(initialTime).getTime());
	Ti.API.info('initialTime timeDiff : ', timeDiff);
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
	if (type == 1) {
		var suggetionArray = [commonFunctions.L('nbackTest', LangCode), commonFunctions.L('spatialFrwd', LangCode), commonFunctions.L('spatialBckwrd', LangCode)];
		if (diffDays == 6) {
			var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
			versionsInfo.nBack = 1;
			Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);

		} else if (diffDays == 13) {
			var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
			versionsInfo.nBack = 2;
			Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);

		} else if (diffDays == 20) {
			var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
			versionsInfo.nBack = 3;
			Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);

		} else if (diffDays == 27) {
			var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
			versionsInfo.nBack = 4;
			Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);

		} else if (diffDays == 34) {
			var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
			versionsInfo.nBack = 5;
			Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);

		}
	} else if (type == 2) {
		var suggetionArray = [commonFunctions.L('trailsBTestNew', LangCode), commonFunctions.L('serial7', LangCode), commonFunctions.L('figCopy', LangCode)];
		if (diffDays == 7) {
			Ti.App.Properties.setString('trailsbSequence', 1);
			var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
			versionsInfo.Serial7s = 1;
			Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);

		} else if (diffDays == 14) {
			Ti.App.Properties.setString('trailsbSequence', 2);
			var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
			versionsInfo.Serial7s = 2;
			Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);

		} else if (diffDays == 21) {
			Ti.App.Properties.setString('trailsbSequence', 3);
			var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
			versionsInfo.Serial7s = 3;
			Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);

		} else if (diffDays == 28) {
			Ti.App.Properties.setString('trailsbSequence', 4);
			var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
			versionsInfo.Serial7s = 4;
			Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);

		} else if (diffDays == 35) {
			Ti.App.Properties.setString('trailsbSequence', 5);
			var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
			versionsInfo.Serial7s = 5;
			Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);

		}
	} else if (type == 3) {
		var suggetionArray = [commonFunctions.L('digitFWrd', LangCode), commonFunctions.L('digitBckWrd', LangCode)];
	} else if (type == 4) {
		var suggetionArray = [commonFunctions.L('memoryTest', LangCode)];
		var versionCount = Ti.App.Properties.getString("versionCount", "");
		if (versionCount == 4) {
			versionCount = 1;
			Ti.App.Properties.setString('versionCount', versionCount);

		} else {
			versionCount = parseInt(versionCount) + 1;
			Ti.App.Properties.setString('versionCount', versionCount);

		}
		var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
		versionsInfo.SimpleMemory = versionCount;
		Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);
	} else if (type == 5) {
		var suggetionArray = [commonFunctions.L('visualGame', LangCode)];
		var versionCount = Ti.App.Properties.getString("versionCount", "");
		if (versionCount == 4) {
			versionCount = 1;
			Ti.App.Properties.setString('versionCount', versionCount);

		} else {
			versionCount = parseInt(versionCount) + 1;
			Ti.App.Properties.setString('versionCount', versionCount);

		}
		var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
		versionsInfo.VisualAssociation = versionCount;
		Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);
	} else if (type == 6) {
		var suggetionArray = [commonFunctions.L('temporalOrder', LangCode)];
		var versionCount = Ti.App.Properties.getString("versionCount", "");
		if (versionCount == 4) {
			versionCount = 1;
			Ti.App.Properties.setString('versionCount', versionCount);

		} else {
			versionCount = parseInt(versionCount) + 1;
			Ti.App.Properties.setString('versionCount', versionCount);

		}
		var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
		versionsInfo.TemporalOrder = versionCount;
		Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);
	}

	for (var i = 0; i < suggetionArray.length; i++) {
		var textSuggestion = Ti.UI.createLabel({
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			color : '#03d981',
			font : Alloy.Globals.LargeSemiBoldQuest,
			text : suggetionArray[i],
			textAlign : "center",
			top : "8dp"
		});
		var seperatorSuggestion = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : "1dp",
			backgroundColor : '#ddd',
			top : "10dp",
			left : '10dp',
			right : '10dp'
		});
		ContentView.add(textSuggestion);
		if (i != suggetionArray.length - 1) {
			ContentView.add(seperatorSuggestion);
		}

	};

	var seperator = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : "1dp",
		backgroundColor : '#ddd',
		top : "0dp"
	});
	var cancelView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : '50dp',
		color : 'transparent',
		bottom : "0dp"
	});
	var cancelTitle = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#ff6060',
		font : Alloy.Globals.LargeSemiBold,
		text : commonFunctions.L('closeLbl', LangCode),
		touchEnabled : false
	});
	cancelView.add(seperator);
	cancelView.add(cancelTitle);
	cancelView.addEventListener('click', function() {
		Alloy.Globals.POPUPWINDOW_STACK = null;
		win.close();
		win = null;
	});

	innerView.add(headerView);
	innerView.add(cancelView);
	innerView.add(ContentView);
	Alloy.Globals.POPUPWINDOW_STACK = win;
	win.open();
	return win;

}

/***
 * Jewel Trail A Game - Check total bonus point and increase the level based on it
 */
exports.checkTotalEarnedBonusAndUpdateJewelTrailALevel = function(earnedBonus, userID) {
	try {
		var retrievedJSONStr = Ti.App.Properties.getString('JewelsTrailsASettings', 'JewelsTrailsASettings not found');
		var jewelTrailsASettingsJSON = JSON.parse(retrievedJSONStr);

		var jewelTrailAInfo = Ti.App.Properties.getObject(userID.toString());
		var currentLevel = jewelTrailAInfo.jewelsTrailACurrentLevel;
		console.log("----checkBonusAndChangeJewelTrailALevel----");
		console.log(jewelTrailsASettingsJSON);
		console.log("earnedBonus : " + earnedBonus);
		console.log("NoOfBonusPoints Required : " + jewelTrailsASettingsJSON["NoOfBonusPoints"]);
		if (earnedBonus > jewelTrailsASettingsJSON["NoOfBonusPoints"]) {
			console.log("level change");
			console.log("current level : " + currentLevel);
			currentLevel = currentLevel + 1;
			console.log("new level : " + currentLevel);
			jewelTrailAInfo.jewelsTrailACurrentLevel = currentLevel;

			if (currentLevel % jewelTrailsASettingsJSON["X_NoOfChangesInLevel"] == 0) {
				console.log("need to add diamonds");
				console.log("current diamond old : " + jewelTrailsASettingsJSON["NoOfDiamonds"]);
				var diamondsToAdd = jewelTrailAInfo.jewelsTrailATotalDiamonds + jewelTrailsASettingsJSON["X_NoOfDiamonds"];
				jewelTrailAInfo.jewelsTrailATotalDiamonds = diamondsToAdd;
			}

			Ti.App.Properties.setObject(userID.toString(), jewelTrailAInfo);
			console.log("updated level : " + jewelTrailAInfo.jewelsTrailACurrentLevel);
		} else {
			console.log("no level change");
		}

	} catch(ex) {

	}

};

/***
 * Get number of required diamonds for Jewels Trail A Game
 */
exports.getJewelsTrailAGameDiamondsToDisplay = function(userID) {
	try {
		console.log("----getJewelsTrailAGameDiamondsToDisplay----");
		var retrievedJSONStr = Ti.App.Properties.getString('JewelsTrailsASettings', 'JewelsTrailsASettings not found');
		var jewelTrailsASettingsJSON = JSON.parse(retrievedJSONStr);
		var jewelTrailAInfo = Ti.App.Properties.getObject(userID.toString());
		console.log(jewelTrailAInfo);
		if (jewelTrailAInfo.jewelsTrailATotalDiamonds == 0) {
			jewelTrailAInfo.jewelsTrailATotalDiamonds = jewelTrailsASettingsJSON["NoOfDiamonds"];
			Ti.App.Properties.setObject(userID.toString(), jewelTrailAInfo);
		}
		var diamondsToDisplay = jewelTrailAInfo.jewelsTrailATotalDiamonds;
		console.log("diamondsToDisplay : " + diamondsToDisplay);

		if (diamondsToDisplay > Alloy.Globals.jewelsTrailAMaxDiamonds)
			diamondsToDisplay = Alloy.Globals.jewelsTrailAMaxDiamonds;
		console.log("final diamondsToDisplay : " + diamondsToDisplay);
		return diamondsToDisplay;
	} catch(ex) {

	}

};

/***
 * Jewel Trail B Game - Check total bonus point and increase the level based on it
 */
exports.checkTotalEarnedBonusAndUpdateJewelTrailBLevel = function(earnedBonus, userID) {
	try {
		var retrievedJSONStr = Ti.App.Properties.getString('JewelsTrailsBSettings', 'JewelsTrailsBSettings not found');
		var jewelTrailsBSettingsJSON = JSON.parse(retrievedJSONStr);

		var jewelTrailBInfo = Ti.App.Properties.getObject(userID.toString());
		var currentLevel = jewelTrailBInfo.jewelsTrailBCurrentLevel;

		Ti.API.info("----checkTotalEarnedBonusAndUpdateJewelTrailBLevel----");
		Ti.API.info(jewelTrailsBSettingsJSON);
		Ti.API.info("earnedBonus : " + earnedBonus);
		Ti.API.info("NoOfBonusPoints Required : " + jewelTrailsBSettingsJSON["NoOfBonusPoints"]);
		if (earnedBonus > jewelTrailsBSettingsJSON["NoOfBonusPoints"]) {
			Ti.API.info("level change");
			Ti.API.info("current level : " + currentLevel);
			currentLevel = currentLevel + 1;
			Ti.API.info("new level : " + currentLevel);
			jewelTrailBInfo.jewelsTrailBCurrentLevel = currentLevel;

			if (currentLevel % jewelTrailsBSettingsJSON["X_NoOfChangesInLevel"] == 0) {
				Ti.API.info("need to increase diamond");
				Ti.API.info("current diamond old : " + jewelTrailsBSettingsJSON["NoOfDiamonds"]);
				var diamondsToAdd = jewelTrailBInfo.jewelsTrailBTotalDiamonds + jewelTrailsBSettingsJSON["X_NoOfDiamonds"];
				jewelTrailBInfo.jewelsTrailBTotalDiamonds = diamondsToAdd;
				Ti.API.info("updated diamonds : " + jewelTrailBInfo.jewelsTrailBTotalDiamonds);
			}

			if (currentLevel % jewelTrailsBSettingsJSON["Y_NoOfChangesInLevel"] == 0) {
				Ti.API.info("need to increase diamond shape");
				Ti.API.info("current diamond  shape old : " + jewelTrailsBSettingsJSON["NoOfShapes"]);
				var diamondShapeToAdd = jewelTrailBInfo.jewelsTrailBTotalShapes + jewelTrailsBSettingsJSON["Y_NoOfShapes"];
				jewelTrailBInfo.jewelsTrailBTotalShapes = diamondShapeToAdd;
				Ti.API.info("updated diamond shape : " + jewelTrailBInfo.jewelsTrailBTotalShapes);
			}

			Ti.App.Properties.setObject(userID.toString(), jewelTrailBInfo);
			Ti.API.info("updated level : " + jewelTrailBInfo.jewelsTrailBCurrentLevel);

		} else {
			Ti.API.info("no level change");
		}

	} catch(ex) {

	}

};

/***
 * Get number of required diamonds for Jewels Trail B Game
 */
exports.getJewelsTrailBGameDiamondsToDisplay = function(userID) {
	try {
		console.log("----getJewelsTrailBGameDiamondsToDisplay----");
		var retrievedJSONStr = Ti.App.Properties.getString('JewelsTrailsBSettings', 'JewelsTrailsBSettings not found');
		var jewelTrailsBSettingsJSON = JSON.parse(retrievedJSONStr);
		var jewelTrailBInfo = Ti.App.Properties.getObject(userID.toString());
		console.log(jewelTrailBInfo);
		if (jewelTrailBInfo.jewelsTrailBTotalDiamonds == 0) {
			jewelTrailBInfo.jewelsTrailBTotalDiamonds = jewelTrailsBSettingsJSON["NoOfDiamonds"];
			Ti.App.Properties.setObject(userID.toString(), jewelTrailBInfo);
		}
		var diamondsToDisplay = jewelTrailBInfo.jewelsTrailBTotalDiamonds;
		console.log("diamondsToDisplay : " + diamondsToDisplay);

		if (diamondsToDisplay > Alloy.Globals.jewelsTrailBMaxDiamonds)
			diamondsToDisplay = Alloy.Globals.jewelsTrailBMaxDiamonds;
		console.log("final diamondsToDisplay : " + diamondsToDisplay);
		return diamondsToDisplay;
	} catch(ex) {

	}

};

/***
 * Get number of diamond shapes for Jewels Trail B Game
 */
exports.getJewelsTrailBGameDiamondsShapesToDisplay = function(userID) {
	try {
		console.log("----getJewelsTrailBGameDiamondsShapesToDisplay----");
		var retrievedJSONStr = Ti.App.Properties.getString('JewelsTrailsBSettings', 'JewelsTrailsBSettings not found');
		var jewelTrailsBSettingsJSON = JSON.parse(retrievedJSONStr);
		var jewelTrailBInfo = Ti.App.Properties.getObject(userID.toString());
		console.log(jewelTrailBInfo);
		if (jewelTrailBInfo.jewelsTrailBTotalShapes == 0) {
			jewelTrailBInfo.jewelsTrailBTotalShapes = jewelTrailsBSettingsJSON["NoOfShapes"];
			Ti.App.Properties.setObject(userID.toString(), jewelTrailBInfo);
		}
		var diamondShapeToDisplay = jewelTrailBInfo.jewelsTrailBTotalShapes;
		console.log("diamondShapeToDisplay : " + diamondShapeToDisplay);

		if (diamondShapeToDisplay > Alloy.Globals.jewelsTrailBMaxShapes)
			diamondShapeToDisplay = Alloy.Globals.jewelsTrailBMaxShapes;
		console.log("final diamondShapeToDisplay : " + diamondShapeToDisplay);
		return diamondShapeToDisplay;
	} catch(ex) {

	}

};

/**
 *
 * Function for sending screenshot as email
 */
exports.sendScreenshot = function(e) {
	Ti.API.info('Ti.Platform.version : ', Ti.Platform.version);
	var LangCode = Ti.App.Properties.getString('languageCode');
	Ti.Media.takeScreenshot(function(e) {
		Ti.API.info('ScreenShot : ', JSON.stringify(e));

		var emailDialog = Ti.UI.createEmailDialog();
		emailDialog.subject = "Error Report from Lamp";
		emailDialog.toRecipients = ['jtorous@gmail.com'];

		emailDialog.addAttachment(e.media);
		emailDialog.open();
		emailDialog.addEventListener('complete', function(e) {
			Ti.API.info('email sent id', JSON.stringify(e.result));
			if (e.result == 3) {
				var commonFunctions = require('commonFunctions');
				commonFunctions.showAlert(commonFunctions.L('emailNotconfigred', LangCode));
			}
		});
	});
};

/**
 * Function for language translation
 */
exports.L = function(str, value) {
	try {
		if (OS_IOS) {
			var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, '/language/' + value + '.xml');
			if (file.exists()) {
				var xmltext = file.read().text;
				var xmldata = Ti.XML.parseString(xmltext);
				var data = xmldata.documentElement.getElementsByTagName(str);
				return data.item(0).text;
			}
		} else {
			var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, '/LanguageAndroid/' + value + '.xml');
			if (file.exists()) {
				var xmltext = file.read().text;
				var xmldata = Ti.XML.parseString(xmltext);

				Ti.App.languageXML = xmldata;
				var xpath = "/resources/string[@name='" + str + "']/text()";
				var result = Ti.App.languageXML.evaluate(xpath).item(0);

				return result.textContent;
			}

		}
	} catch(ex) {

	}

};

/*
 * function to get language name
 */

exports.getLanguage = function(value) {
	var languageObject = [];
	var language;
	var value;
	switch(value) {
	case "es": {
		language = "Spanish";
		value = 2;
		break;
	}
	case "pt-br": {
		language = "Brazilian Portuguese";
		value = 3;
		break;
	}
	case "cmn": {
		language = "Chinese (Mandarin)";
		value = 4;
		break;
	}
	case "en": {
		language = "English";
		value = 1;
		break;
	}
	}
	languageObject = {
		"language" : language,
		"value" : value
	};
	return languageObject;
};

/**
 * Get utc datetitme
 */
exports.getUTCDateTimeFormat = function(currentDateTime) {
	var d = currentDateTime.getUTCDate();
	var month = currentDateTime.getUTCMonth() + 1;
	var y = currentDateTime.getUTCFullYear();
	var h = currentDateTime.getUTCHours();
	if (h < 10) {
		h = "0" + h;
	}
	var s = currentDateTime.getUTCSeconds();
	if (s < 10) {
		s = "0" + s;
	}
	var m = currentDateTime.getUTCMinutes();
	if (m < 10) {
		m = "0" + m;
	}
	var utcTime = y + "-" + month + "-" + d + "T" + h + ":" + m + ":" + s + ".0000Z";
	return utcTime;
};
/**
 * Function for navigating to corresponing screen on batch click
 */
exports.navigateToWindow = function(batchID, version, surveyName, surveyID, testID, createdDate) {
	Ti.API.info('navigateToWindow', batchID, version, surveyName, surveyID, testID);
	if (batchID.trim() == "C 1") {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackLevel', {
			"reminderVersion" : version,
			"isBatch" : true,
			"testID" : testID,
			'fromNotification' : true,
			"createdDate" : createdDate
		});
	} else if (batchID.trim() == "C 2") {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsB', {
			"isBatch" : true,
			"testID" : testID,
			'fromNotification' : true,
			"createdDate" : createdDate
		});
	} else if (batchID.trim() == "C 3") {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
			"isForward" : true,
			"isBatch" : true,
			"testID" : testID,
			'fromNotification' : true,
			"createdDate" : createdDate
		});
	} else if (batchID.trim() == "C 4") {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
			"isForward" : false,
			"isBatch" : true,
			"testID" : testID,
			'fromNotification' : true,
			"createdDate" : createdDate
		});
	} else if (batchID.trim() == "C 5") {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('simpleMemoryTask', {
			"reminderVersion" : version,
			"isBatch" : true,
			"testID" : testID,
			'fromNotification' : true,
			"createdDate" : createdDate
		});
	} else if (batchID.trim() == "C 6") {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('serial7STestScreen', {
			"reminderVersion" : version,
			"isBatch" : true,
			"testID" : testID,
			'fromNotification' : true,
			"createdDate" : createdDate
		});
	} else if (batchID.trim() == "C 7") {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('catAndDogGame', {
			"isBatch" : true,
			"testID" : testID,
			'fromNotification' : true,
			"createdDate" : createdDate
		});
	} else if (batchID.trim() == "C 8") {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('figureCopyScreen', {
			"isBatch" : true,
			"testID" : testID,
			'fromNotification' : true,
			"createdDate" : createdDate
		});
	} else if (batchID.trim() == "C 9") {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('visualAssociation', {
			"reminderVersion" : version,
			"isBatch" : true,
			"testID" : testID,
			'fromNotification' : true,
			"createdDate" : createdDate
		});
	} else if (batchID.trim() == "C 10") {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
			"isForward" : true,
			"isBatch" : true,
			"testID" : testID,
			'fromNotification' : true,
			"createdDate" : createdDate
		});
	} else if (batchID.trim() == "C 11") {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('catAndDogGameNew', {
			"isBatch" : true,
			"testID" : testID,
			'fromNotification' : true,
			"createdDate" : createdDate
		});
	} else if (batchID.trim() == "C 12") {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('temporalOrder', {
			"reminderVersion" : version,
			"isBatch" : true,
			"testID" : testID,
			'fromNotification' : true,
			"createdDate" : createdDate
		});
	} else if (batchID.trim() == "C 13") {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
			"isForward" : false,
			"isBatch" : true,
			"testID" : testID,
			'fromNotification' : true,
			"createdDate" : createdDate
		});
	} else if (batchID.trim() == "C 14") {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackLevelNew', {
			"isBatch" : true,
			"testID" : testID,
			'fromNotification' : true,
			"createdDate" : createdDate
		});
	} else if (batchID.trim() == "C 15") {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsbNonOverlap', {
			"reminderVersion" : version,
			"isBatch" : true,
			"testID" : testID,
			'fromNotification' : true,
			"createdDate" : createdDate
		});
	} else if (batchID.trim() == "C 16") {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsBNew', {
			"isBatch" : true,
			"testID" : testID,
			'fromNotification' : true,
			"createdDate" : createdDate
		});
	} else if (batchID.trim() == "C 17") {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsIntro', {
			"isBatch" : true,
			"testID" : testID,
			'fromNotification' : true,
			"createdDate" : createdDate
		});
	} else if (batchID.trim() == "C 18") {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsIntroB', {
			"isBatch" : true,
			"testID" : testID,
			'fromNotification' : true,
			"createdDate" : createdDate
		});
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.openFullScreenWindow('syptomSurveyNew', {
			'surveyID' : surveyID,
			'surveyName' : surveyName.toUpperCase(),
			"isBatch" : true,
			"testID" : testID,
			'fromNotification' : true,
			"createdDate" : createdDate
		});
	}
};
exports.getWeekName = function(GameID) {
	var gameName;
	var commonFunctions = require('commonFunctions');
	var LangCode = Ti.App.Properties.getString('languageCode');
	if (GameID == 'Monday') {
		gameName = commonFunctions.L('monLbl', LangCode);
	} else if (GameID == 'Tuesday') {
		gameName = commonFunctions.L('tueLbl', LangCode);
	} else if (GameID == 'Wednesday') {
		gameName = commonFunctions.L('wedLbl', LangCode);
	} else if (GameID == 'Thursday') {
		gameName = commonFunctions.L('thuLbl', LangCode);
	} else if (GameID == 'Friday') {
		gameName = commonFunctions.L('friLbl', LangCode);
	} else if (GameID == 'Saturday') {
		gameName = commonFunctions.L('satLbl', LangCode);
	} else if (GameID == 'Sunday') {
		gameName = commonFunctions.L('sundayLbl', LangCode);
	}
	return gameName;

};

exports.getGameName = function(GameID) {
	var gameName;
	var commonFunctions = require('commonFunctions');
	var LangCode = Ti.App.Properties.getString('languageCode');
	if (GameID == 'n-back') {
		gameName = commonFunctions.L('nbackTest', LangCode);
	} else if (GameID == "trails-b") {
		gameName = commonFunctions.L('trailsBTest', LangCode);
	} else if (GameID == "Spatial Span") {
		gameName = commonFunctions.L('spatialFrwd', LangCode);
	} else if (GameID == "Spatial Span Backward") {
		gameName = commonFunctions.L('spatialBckwrd', LangCode);
	} else if (GameID == "Simple Memory") {
		gameName = commonFunctions.L('memoryTest', LangCode);
	} else if (GameID == "Serial 7s") {
		gameName = commonFunctions.L('serial7', LangCode);
	} else if (GameID == "Visual Association") {
		gameName = commonFunctions.L('visualGame', LangCode);
	} else if (GameID == "Digit Span") {
		gameName = commonFunctions.L('digitFWrd', LangCode);
	} else if (GameID == "Digit Span Backward") {
		gameName = commonFunctions.L('digitBckWrd', LangCode);
	} else if (GameID == "Cat and Dogs(New)") {
		gameName = commonFunctions.L('catdog', LangCode);
	} else if (GameID == "Temporal Order") {
		gameName = commonFunctions.L('temporalOrder', LangCode);
	} else if (GameID == "trails-b(New)") {
		gameName = commonFunctions.L('trailsBTestNew', LangCode);
	} else if (GameID == "trails-b(Dot Touch)") {
		gameName = commonFunctions.L('trailsBTouch', LangCode);
	} else if (GameID == "Jewels Trails A") {
		gameName = commonFunctions.L('jwelA', LangCode);
	} else if (GameID == "Jewels Trails B") {
		gameName = commonFunctions.L('jwelB', LangCode);
	} else if ( GameID = "n-back(New)") {
		gameName = commonFunctions.L('nbackTestNew', LangCode);
	}

	return gameName;
}; 