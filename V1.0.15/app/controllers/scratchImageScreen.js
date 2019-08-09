// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var commonFunctions = require('commonFunctions');
var Paint = require('ti.paint');
var paintView = null;
var countDownTimer = null;
var commonDB = require('commonDB');
var serviceManager = require('serviceManager');
var credentials = Alloy.Globals.getCredentials();
var LangCode = Ti.App.Properties.getString('languageCode');
var startTime = "";
var endTime = "";
var startButtonClicked = 0;
var restartTimer = 0;
var startTimeSingle = "";
var points = 1;
var vNumber = 1;
var fileName;
var gamePoints = 0;
var notificationGame;
var exitButtonClicked = 0;
var completeTimer = null;
var newBlob;
var calculateTime;
var playedTime;
var spinWheelScore;

/**
 * function for screen open
 */
function init() {
	if (OS_IOS) {
		if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
			$.headerView.height = "80dp";
			$.contentView.top = "80dp";
			$.contentView.bottom = "88dp";
		}

	}
	startButtonClicked = 0;

	$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
	$.headerLabel.text = commonFunctions.L('scratchCard', LangCode);
	$.startButton.text = commonFunctions.L('instructionsubmit', LangCode);
	$.quitLabel.text = commonFunctions.L('exitLbl', LangCode);
	if (Alloy.Globals.iPhone5) {
		$.canvasView.height = "300dp";
		$.commentLabel.top = "8dp";
	} else {
		$.canvasView.height = "350dp";
		$.commentLabel.top = "10dp";
	}
	$.commentLabel.text = commonFunctions.L('scratchLbl', LangCode);
	$.commentLabel2.text = commonFunctions.L('scratchLbl2', LangCode);
	$.canvasView.touchEnabled = false;
	gameId = commonFunctions.ceateGUID();

	var gameInfo = commonDB.getGameScore(credentials.userId);

	for (var i = 0; i < gameInfo.length; i++) {
		if (gameInfo[i].gameID == 20) {
			gamePoints = gameInfo[i].points;
		}
	}

	startGame();
}

/**
 * function for screen open
 */
$.scratchImageScreen.addEventListener("open", function(e) {
	try {
		init();
		var BlogsUpdate = Ti.App.Properties.getString("BlogsUpdate", "");
		var TipsUpdate = Ti.App.Properties.getString("TipsUpdate", "");
		if (BlogsUpdate == true || BlogsUpdate == "true" || TipsUpdate == true || TipsUpdate == "true") {
			$.footerView.setInfoIndicatorON();
		} else {
			$.footerView.setInfoIndicatorOFF();
		}
		$.footerView.setSelectedLabel(3);
	} catch(ex) {
		commonFunctions.handleException("scratchImageScreen", "open", ex);
	}

});

/**
 * Start Game
 */
function startGame() {

	var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
	vNumber = versionsInfo.ScratchImage;
	if (vNumber == "") {
		versionsInfo.ScratchImage = 2;
		vNumber = 1;
	} else if (vNumber == 1 || vNumber == "1") {
		versionsInfo.ScratchImage = 2;
	} else if (vNumber == 2 || vNumber == "2") {
		versionsInfo.ScratchImage = 3;
	} else if (vNumber == 3 || vNumber == "3") {
		versionsInfo.ScratchImage = 4;
	} else if (vNumber == 4 || vNumber == "4") {
		versionsInfo.ScratchImage = 5;
	} else if (vNumber == 5 || vNumber == "5") {
		versionsInfo.ScratchImage = 6;
	} else if (vNumber == 6 || vNumber == "6") {
		versionsInfo.ScratchImage = 1;
	} else {
		vNumber = 1;
		versionsInfo.ScratchImage = 1;
	}
	Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);

	$.canvasView.backgroundImage = "/images/scratchImage/" + vNumber + ".png";

	fileName = vNumber + ".png";

	var strokeSize;
	if (OS_IOS) {
		strokeSize = 10;
	} else {
		strokeSize = 30;
	}

	var scratchDefaultImage;
	if (LangCode == "cmn") {
		scratchDefaultImage = "/images/scratchImage/scratch_card_ch.png";
	} else {
		scratchDefaultImage = "/images/scratchImage/scratch_card.png";
	}

	paintView = Paint.createPaintView({
		top : 0,
		right : 0,
		bottom : 0,
		left : 0,
		strokeColor : 'white',
		strokeAlpha : 255,
		strokeWidth : strokeSize,
		eraseMode : true,
		image : scratchDefaultImage
	});
	$.canvasView.add(paintView);

}

/**
 * Timer
 */
function startTimer() {
	startTimeSingle = new Date().toUTCString();
	var timer = 120;
	var minutes = 0;
	var seconds = 0;
	countDownTimer = setInterval(function() {

		if (timer == 119) {
			if (startTime == "") {
				startTime = new Date().toUTCString();
			}
		}
		minutes = parseInt(timer / 60, 10);
		seconds = parseInt(timer % 60, 10);

		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;
		$.countTimer.text = minutes + ":" + seconds;

		if (timer == 0) {
			if (countDownTimer != null) {
				clearInterval(countDownTimer);
			}

			setTimeout(function() {
				endTime = new Date().toUTCString();

				var image = $.canvasView.toImage(null, true);
				var encodedFileObject = Ti.Utils.base64encode(image).toString();
				gamePoints = gamePoints + points;

				if (Ti.Network.online) {
					var resultParameter = {
						"UserID" : credentials.userId,
						"ScratchImageID" : vNumber,
						"DrawnImage" : encodedFileObject,
						"DrawnImageName" : fileName,
						"StartTime" : startTimeSingle,
						"EndTime" : endTime,
						"Point" : points,
						"GameName" : gameId,
						"IsNotificationGame" : false,
						"AdminBatchSchID" : 0,
						"SpinWheelScore" : 0
					};

					commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
					serviceManager.saveScartchImageGame(resultParameter, onSaveScartchImageSuccess, onSaveScartchImageFailure);
				} else {
					commonFunctions.closeActivityIndicator();
					commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));
					onSaveScartchImageFailure();
					return;
				}

				commonDB.insertGameScore(20, 0, gamePoints, points);

			}, 1000);
		}
		timer -= 1;
	}, 1000);
}

var okClick = function(e) {
	Ti.App.fireEvent("getValues");

};

/**
 * Start Button Click
 */
function onStartButtonClick() {
	if (startButtonClicked == 0) {
		if (!OS_IOS) {
			$.outerView.visible = false;
			$.outerView.height = 0;
			$.outerView.width = 0;
		}
		startTimer();

		$.canvasView.touchEnabled = true;
		paintView.eraseMode = true;
		paintView.strokeAlpha = 255;
		paintView.strokeColor = "black";
		$.startButton.text = commonFunctions.L('submitLbl', LangCode);
		startButtonClicked = 1;
	} else if (startButtonClicked == 1) {

		paintView.eraseMode = false;
		$.canvasView.touchEnabled = false;

		if (countDownTimer != null) {
			clearInterval(countDownTimer);
		}
		endTime = new Date().toUTCString();

		var encodedFileObject;

		var image = $.canvasView.toImage(null, true);
		encodedFileObject = Ti.Utils.base64encode(image).toString();

		gamePoints = gamePoints + points;

		if (Ti.Network.online) {
			var resultParameter = {
				"UserID" : credentials.userId,
				"ScratchImageID" : vNumber,
				"DrawnImage" : encodedFileObject,
				"DrawnImageName" : fileName,
				"StartTime" : startTimeSingle,
				"EndTime" : endTime,
				"Point" : points,
				"GameName" : gameId,
				"IsNotificationGame" : false,
				"AdminBatchSchID" : 0,
				"SpinWheelScore" : 0
			};

			commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
			serviceManager.saveScartchImageGame(resultParameter, onSaveScartchImageSuccess, onSaveScartchImageFailure);
		} else {
			commonFunctions.closeActivityIndicator();
			commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));
			onSaveScartchImageFailure();
			return;
		}

		commonDB.insertGameScore(20, 0, gamePoints, points);

	}

}

Ti.App.addEventListener('getValues', getValues);
function getValues() {
	$.canvasView.remove(paintView);
	if (!OS_IOS) {
		$.outerView.visible = true;
		$.outerView.height = $.canvasView.height;
		$.outerView.width = Ti.UI.FILL;
	}
	$.canvasView.touchEnabled = false;
	$.countTimer.text = "02:00";

	$.startButton.text = commonFunctions.L('instructionsubmit', LangCode);

	gameId = commonFunctions.ceateGUID();
	startTime = "";
	Ti.App.fireEvent("RefreshImage");
	startGame();
	startButtonClicked = 0;
}

/**
 * Success api call
 */
function onSaveScartchImageSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		commonFunctions.closeActivityIndicator();

		if (response.ErrorCode == 0) {
			commonFunctions.showAlert(commonFunctions.L('gameSuccess', LangCode), okClick);
		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}
		commonFunctions.closeActivityIndicator();

	} catch(ex) {
		commonFunctions.handleException("scratchImageScreen", "onSaveScartchImageSuccess", ex);
	}
}

/**
 * Failure api call
 */
function onSaveScartchImageFailure(e) {
	$.canvasView.remove(paintView);
	if (!OS_IOS) {
		$.outerView.visible = true;
		$.outerView.height = $.canvasView.height;
		$.outerView.width = Ti.UI.FILL;
	}
	$.canvasView.touchEnabled = false;
	$.countTimer.text = "02:00";
	$.startButton.text = commonFunctions.L('instructionsubmit', LangCode);
	gameId = commonFunctions.ceateGUID();
	startTime = "";
	Ti.App.fireEvent("RefreshImage");
	startGame();
	startButtonClicked = 0;
	commonFunctions.closeActivityIndicator();
}

/**
 * on home button click
 */
function onHomeClick(e) {
	try {
		Ti.App.removeEventListener('getValues', getValues);
		if (countDownTimer != null) {
			clearInterval(countDownTimer);
		}
		if (OS_IOS) {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('scratchImageScreen');
		} else {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('scratchImageScreen');
			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && parentWindow.windowName === "scratchTestScreen") {
				parentWindow.window.closeWindowEvent();
			}

			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('scratchTestScreen');
		}

		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && parentWindow.windowName === "home") {
			parentWindow.window.refreshHomeScreen();
		}

	} catch(ex) {
		commonFunctions.handleException("scratchImageScreen", "homeClick", ex);
	}
}

$.scratchImageScreen.addEventListener('android:back', function() {
	onHomeClick();
});

$.footerView.on('clickLearn', function(e) {
	Ti.App.removeEventListener('getValues', getValues);
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}
	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('homeStaticPages');
	if (OS_IOS) {
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('scratchImageScreen');
		}, 1000);
	} else {

		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && parentWindow.windowName === "scratchTestScreen") {
			parentWindow.window.closeWindowEvent();
		}

		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('scratchTestScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('scratchImageScreen');

	}

});

$.footerView.on('clickAssess', function(e) {
	Ti.App.removeEventListener('getValues', getValues);
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}

	if (OS_IOS) {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('scratchImageScreen');
	} else {

		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && parentWindow.windowName === "scratchTestScreen") {
			parentWindow.window.closeWindowEvent();
		}

		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('scratchTestScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('scratchImageScreen');
	}

	var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	if (parentWindow != null && parentWindow.windowName === "home") {
		parentWindow.window.refreshHomeScreen();
	}

});

$.footerView.on('clickManage', function(e) {

	return;

});

$.footerView.on('clickPrevent', function(e) {
	Ti.App.removeEventListener('getValues', getValues);
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}

	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('preventIntroScreen');
	if (OS_IOS) {

		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('scratchImageScreen');

	} else {

		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && parentWindow.windowName === "scratchTestScreen") {
			parentWindow.window.closeWindowEvent();
		}

		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('scratchTestScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('scratchImageScreen');

	}

});

/**
 * Trigger onReportClick click event
 */
function onReportClick() {

	commonFunctions.sendScreenshot();
}

/**
 * Exit
 */
function onQuitClick() {

	Ti.App.removeEventListener('getValues', getValues);
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}

	if (OS_IOS) {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('scratchImageScreen');
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('scratchImageScreen');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && parentWindow.windowName === "scratchTestScreen") {
			parentWindow.window.closeWindowEvent();
		}

		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('scratchTestScreen');
	}

	var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	if (parentWindow != null && parentWindow.windowName === "home") {
		parentWindow.window.refreshHomeScreen();
	}

}