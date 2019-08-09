// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var imageIndexArray = [1, 11, 12, 13];
var selectedImageArray = [];
var currentImageIndex = 0;
var Paint = require('ti.paint');
var paintView = null;
var countDownTimer = null;
var commonDB = require('commonDB');
var serviceManager = require('serviceManager');
var startTime = "";
var endTime = "";
var credentials = Alloy.Globals.getCredentials();
var imageFile;
var fileName;
var points = 0;
var gamePoints = 0;
var gameId = "";
var startTimeSingle = "";
var memoryTimer = null;
var LangCode = Ti.App.Properties.getString('languageCode');
/**
 * variable declaration
 */
var commonFunctions = require('commonFunctions');
/***
 * Open window
 */
$.figureCopyScreen.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
			}
		}
		$.headerView.setTitle(commonFunctions.L('figCopy', LangCode));
		$.nextButton.text = commonFunctions.L('next', LangCode);
		$.drawLabel.text = commonFunctions.L('drawfigLbl', LangCode);
		$.answerlabel.text = commonFunctions.L('answeredLbl', LangCode);
		$.headerView.setQuitViewVisibility(true);
		$.headerView.setQuitViewPosition();
		gameId = commonFunctions.ceateGUID();
		var gameInfo = commonDB.getGameScore(credentials.userId);
		for (var i = 0; i < gameInfo.length; i++) {
			if (gameInfo[i].gameID == 8) {
				gamePoints = gameInfo[i].points;
			}
		}
		selectedImageArray = getRandomPosition(imageIndexArray, 4);
		gameLogic();
		startTimer();
	} catch(ex) {
		commonFunctions.handleException("figureCopyScreen", "open", ex);
	}
});
$.headerView.on('reportButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
$.figureCopyScreen.addEventListener('android:back', function() {
	goBack();
});
$.headerView.on('quitButtonClick', function(e) {
	Ti.App.removeEventListener('getValues', getValues);
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}
	if (memoryTimer != null) {
		clearInterval(memoryTimer);
	}

	if (args.isBatch == true) {
		var surveyName = "";
		Alloy.Globals.BATCH_ARRAY = Alloy.Globals.BATCH_ARRAY.splice(1, Alloy.Globals.BATCH_ARRAY.length);
		if (Alloy.Globals.BATCH_ARRAY.length != 0) {
			var surveyId = Alloy.Globals.BATCH_ARRAY[0].trim().split(" ");
			if (surveyId[0] == "S") {
				surveyName = commonDB.getSurveyName(surveyId[1]);
			}
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('figureCopyScreen');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
			commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

		} else {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('figureCopyScreen');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
				parentWindow.window.refreshHomeScreen();
			}
			if (diff == 0 || diff > 900000) {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spaceBlockScreen', {
					'backDisable' : true,
				});
			}

		}
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('figureCopyScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
			parentWindow.window.refreshHomeScreen();
		}
	}

});
function gameLogic() {
	$.objectsImage.image = "/images/figureCopyTest/" + selectedImageArray[currentImageIndex].imageIndex + ".png";
	fileName = selectedImageArray[currentImageIndex].imageIndex + ".png";
	startTimeSingle = new Date().toUTCString();
	var startTime = 5;
	paintView = Paint.createPaintView({
		top : 0,
		right : 0,
		bottom : 0,
		left : 0,
		strokeColor : 'black',
		strokeAlpha : 255,
		strokeWidth : 3,
		eraseMode : false,
	});
	$.canvasView.add(paintView);
	memoryTimer = setInterval(function() {
		startTime = startTime - 1;
		if (startTime == 0) {
			$.numberLabel.text = currentImageIndex + 1 + "/" + selectedImageArray.length;
			var progressValue = (100 / selectedImageArray.length) * (currentImageIndex + 1);
			if (currentImageIndex + 1 == selectedImageArray.length) {
				if (commonFunctions.getIsTablet() == true) {
					progressValue = 97;
				} else {
					progressValue = 98;
				}
			}
			$.progressBarLine.width = progressValue + "%";
			if (currentImageIndex + 1 == selectedImageArray.length) {
				$.nextButton.text = commonFunctions.L('finishLbl', LangCode);
			}
			clearInterval(memoryTimer);
			$.userViewing.visible = false;
			$.userDrawingView.visible = true;
		}

		$.timeLabel.text = startTime + " " + commonFunctions.L('secLbl', LangCode);

	}, 1000);

}

function startTimer() {
	var timer = 90;
	var minutes = 0;
	var seconds = 0;
	countDownTimer = setInterval(function() {
		if (timer == 89) {
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
			if (memoryTimer != null) {
				clearInterval(memoryTimer);
			}

			$.contentView.touchEnabled = false;
			Ti.App.removeEventListener('getValues', getValues);
			setTimeout(function() {
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('figureCopyScreen');
				var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
				if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
					parentWindow.window.refreshHomeScreen();
				}
			}, 2000);
		}
		timer -= 1;
	}, 1000);
}

/**
 * onnext button click
 */
var calculateTime;
var playedTime;
function onNextButtonClick() {
	$.timeLabel.text = "5" + " " + commonFunctions.L('secLbl', LangCode);
	currentImageIndex += 1;
	var image = $.canvasView.toImage(null, true);
	var encodedFileObject = Ti.Utils.base64encode(image).toString();
	$.pencilImage.image = "/images/figureCopyTest/icn_pencil_active.png";
	$.brushImage.image = "/images/figureCopyTest/icn_clear_active.png";
	$.brushImage.index = 0;
	var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
	var spinRecords = spinInfo.lampRecords;
	var notiGameScore;
	var spinWheelScore;

	var notificationGame;
	if (args.fromNotification === true && args.isLocal != 1) {
		notificationGame = true;
		dateTimeFormat(args.createdDate);
		if (spinRecords != 0) {
			notiGameScore = Math.trunc(100 / spinRecords);
			if (playedTime >= 5) {
				calculateTime = Math.trunc(parseInt(playedTime) / 5);
				spinWheelScore = notiGameScore - calculateTime;
			} else {
				spinWheelScore = notiGameScore;
			}
		}
	} else {
		notificationGame = false;
		spinWheelScore = 5;
	}
	if (currentImageIndex != selectedImageArray.length) {
		if (Ti.Network.online) {
			endTime = new Date().toUTCString();
			var resultParameter = {
				"UserID" : credentials.userId,
				"C3DFigureID" : selectedImageArray[currentImageIndex - 1].imageIndex,
				"DrawnFig" : encodedFileObject,
				"DrawnFigFileName" : fileName,
				"StartTime" : startTimeSingle,
				"EndTime" : endTime,
				"Point" : points,
				"GameName" : gameId,
				"IsNotificationGame" : notificationGame,
				"AdminBatchSchID" : args.isBatch == true ? args.testID : 0,
				"SpinWheelScore" : 0
			};
			commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
			serviceManager.save3DFigureGame(resultParameter, onSave3DFigureGameSuccess, onSave3DFigureGameFailure);
		} else {
			commonFunctions.closeActivityIndicator();
			commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));
		}
	} else {
		endTime = new Date().toUTCString();
		if (countDownTimer != null) {
			clearInterval(countDownTimer);
		}
		if (memoryTimer != null) {
			clearInterval(memoryTimer);
		}
		points = points + 1;
		gamePoints = gamePoints + points;
		if (Ti.Network.online) {
			if (args.isBatch == true && Alloy.Globals.BATCH_ARRAY.length != 1) {
				spinWheelScore = 0;
			}
			if (spinWheelScore < 0) {
				spinWheelScore = 0;
			}
			var resultParameter = {
				"UserID" : credentials.userId,
				"C3DFigureID" : selectedImageArray[currentImageIndex - 1].imageIndex,
				"DrawnFig" : encodedFileObject,
				"DrawnFigFileName" : fileName,
				"StartTime" : startTimeSingle,
				"EndTime" : endTime,
				"Point" : points,
				"GameName" : gameId,
				"IsNotificationGame" : notificationGame,
				"AdminBatchSchID" : args.isBatch == true ? args.testID : 0,
				"SpinWheelScore" : spinWheelScore
			};
			commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
			serviceManager.save3DFigureGame(resultParameter, onSave3DFigureGameFinalSuccess, onSave3DFigureGameFinalFailure);
		} else {
			commonFunctions.closeActivityIndicator();
			commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));
			return;
		}

		commonDB.insertGameScore(8, 0, gamePoints, points);
		var timeDiff = commonFunctions.getMinuteSecond(startTime, endTime);
	}
}

/**
 * Date Time Format
 */
function dateTimeFormat(createdDate) {
	var createdDateTime = createdDate.split(" ");
	var datePart = createdDateTime[0].split("-");
	var day = datePart[1];
	var month = datePart[2];
	var year = datePart[0];
	var myCreatedDate = day + "/" + month + "/" + year;

	var timePart = createdDateTime[1].split(":");
	var hour = timePart[0];
	var min = timePart[1];
	var second = timePart[2];
	var myCreatedTime = hour + ":" + min + ":" + second;
	var resultDate = myCreatedDate + " " + myCreatedTime;
	var myDate = new Date(resultDate).getTime();
	var curDate = new Date().getTime();
	var timeDifference = curDate - myDate;
	playedTime = parseInt(timeDifference) / 60000;
}

Ti.App.addEventListener('getValues', getValues);
function getValues() {
	Ti.App.removeEventListener('getValues', getValues);
	var diff = 0;
	var curTime = new Date().getTime();
	var setTime = Ti.App.Properties.getString('EnvTime', "");
	if (setTime != "") {
		diff = curTime - setTime;
	}

	if (args.isBatch != true) {
		if (diff == 0 || diff > 3600000) {

			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spaceBlockScreen', {
				'backDisable' : true,
			});
		}
	}

	if (args.isBatch == true) {
		var surveyName = "";
		Alloy.Globals.BATCH_ARRAY = Alloy.Globals.BATCH_ARRAY.splice(1, Alloy.Globals.BATCH_ARRAY.length);
		if (Alloy.Globals.BATCH_ARRAY.length != 0) {
			var surveyId = Alloy.Globals.BATCH_ARRAY[0].trim().split(" ");
			if (surveyId[0] == "S") {
				surveyName = commonDB.getSurveyName(surveyId[1]);
			}
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('figureCopyScreen');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
			commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

		} else {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('figureCopyScreen');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
				parentWindow.window.refreshHomeScreen();
			}
		}
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('figureCopyScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
			parentWindow.window.refreshHomeScreen();
		}
	}

	Ti.App.removeEventListener('getValues', getValues);

}

/**
 * Success api call
 */
function onSave3DFigureGameFinalSuccess(e) {
	try {
		commonFunctions.closeActivityIndicator();
		var response = JSON.parse(e.data);
		if (response.ErrorCode == 0) {

			if (Alloy.Globals.IsTablet) {
				Ti.App.fireEvent("getValues");
			} else {
				commonFunctions.showAlert("You have completed this game successfully.", okClick);
			}

		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}

	} catch(ex) {
		commonFunctions.handleException("simplememorygame", "onSaveSimpleMemoryGameSuccess", ex);
	}
}

var okClick = function(e) {
	Ti.App.fireEvent("getValues");

};

/**
 * Failure api call
 */
function onSave3DFigureGameFinalFailure(e) {
	commonFunctions.closeActivityIndicator();
}

/**
 * Success api call
 */
function onSave3DFigureGameSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		if (response.ErrorCode == 0) {
			$.canvasView.remove(paintView);
			$.userViewing.visible = true;
			$.userDrawingView.visible = false;
			gameLogic();
		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}
		commonFunctions.closeActivityIndicator();

	} catch(ex) {
		commonFunctions.handleException("simplememorygame", "onSaveSimpleMemoryGameSuccess", ex);
	}
}

/**
 * Failure api call
 */
function onSave3DFigureGameFailure(e) {
	commonFunctions.closeActivityIndicator();
}

/***
 * Handles Header back
 */
$.headerView.on('backButtonClick', function(e) {

	goBack();
});
function goBack(e) {
	Ti.App.removeEventListener('getValues', getValues);
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}
	if (memoryTimer != null) {
		clearInterval(memoryTimer);
	}
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('figureCopyScreen');
	var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
		parentWindow.window.refreshHomeScreen();
	}
}

function getRandomPosition(arr, n) {
	try {
		var tempArray = [];
		var result = [];
		var len = arr.length;
		var indexValue = 0;
		while (tempArray.length < n) {
			var randomnumber = Math.floor(Math.random() * len);
			if (tempArray.indexOf(randomnumber) > -1)
				continue;
			tempArray[tempArray.length] = randomnumber;

			result.push({
				imageIndex : arr[randomnumber],
				index : randomnumber + 1
			});
			indexValue = indexValue + 1;

		}

		return result;
	} catch(ex) {
		commonFunctions.handleException("trailsB", "getRandomPosition", ex);
	}
}

/**
 * function for pencil click
 */
function onPencilClick() {

}

function onClearClick() {
	paintView.clear();
}
