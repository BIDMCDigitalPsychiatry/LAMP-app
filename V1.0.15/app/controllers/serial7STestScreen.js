// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
/**
 * Variable declaration
 */
var commonFunctions = require('commonFunctions');
var commonDB = require('commonDB');
var nexButtonEnable = false;
var enteredAnswers = [];
var startDigitArray = [100, 90, 80, 70, 60, 50];
var labelArray = [$.label1, $.label2, $.label3, $.label4, $.label5, $.label6, $.label7, $.label8];
var correctAnswerCount = 0;
var correctAnswerValue = 0;
var selectedNumbersArray = [];
var shuffledLabels = [$.label1, $.label2, $.label3, $.label4, $.label5, $.label6, $.label7, $.label8];
var viewArray = [$.index1, $.index2, $.index3, $.index4, $.index5, $.index6, $.index7, $.index8];
var levelNumb = 0;
var countDownTimer = null;
var totalAttempt = 0;
var serviceManager = require('serviceManager');
var startTime = "";
var endTime = "";
var points = 0;
var gamePoints = 0;
var flexSpace;
var done;
var LangCode = Ti.App.Properties.getString('languageCode');
var credentials = Alloy.Globals.getCredentials();
var TotalAttempt = 0;
var vNumber = 1;
var StatusType = 1;
/**
 * Function for window open
 */
$.serial7STestScreen.addEventListener("open", function(e) {
	try {

		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
			}
		}
		$.headerView.setTitle(commonFunctions.L('serial7', LangCode));
		$.headerView.setQuitViewVisibility(true);

		$.headerView.setQuitViewPosition();
		$.selectedDigitLabel.text = commonFunctions.L('digitLabel', LangCode);

		$.nextButton.text = commonFunctions.L('nxtLbl', LangCode);
		var gameInfo = commonDB.getGameScore(credentials.userId);

		for (var i = 0; i < gameInfo.length; i++) {
			if (gameInfo[i].gameID == 6) {
				gamePoints = gameInfo[i].points;
			}
		}
		if (args.reminderVersion != null && args.reminderVersion != 0) {
			vNumber = args.reminderVersion;
		} else {
			var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
			vNumber = versionsInfo.Serial7s;
			if (vNumber == "") {
				versionsInfo.Serial7s = 2;

				vNumber = 1;
			} else if (vNumber == 1 || vNumber == "1") {
				versionsInfo.Serial7s = 2;

			} else if (vNumber == 2 || vNumber == "2") {
				versionsInfo.Serial7s = 3;

			} else if (vNumber == 3 || vNumber == "3") {
				versionsInfo.Serial7s = 4;

			} else if (vNumber == 4 || vNumber == "4") {
				versionsInfo.Serial7s = 5;

			} else if (vNumber == 5 || vNumber == "5") {
				versionsInfo.Serial7s = 6;

			} else if (vNumber == 6 || vNumber == "6") {
				versionsInfo.Serial7s = 1;

			}
			Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);
		}

		var selectedArray = startDigitArray[vNumber - 1];
		$.digitLabel.text = selectedArray;
		correctAnswerValue = selectedArray - 7;

		if (OS_IOS) {
			flexSpace = Ti.UI.createButton({
				systemButton : Ti.UI.iOS.SystemButton.FLEXIBLE_SPACE
			});
			done = Ti.UI.createButton({

				title : "Next",
			});
			done.addEventListener('click', function(e) {

				onNextClick();

			});

			$.answerTextArea.keyboardToolbar = [flexSpace, done];
		}

		startTimer();
		setTimeout(function() {
			$.answerTextArea.focus();
		}, 500);

	} catch(ex) {
		commonFunctions.handleException("serial7STestScreen", "open", ex);
	}
});
$.headerView.on('reportButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
function windowClick(e) {
	try {

		if (e.source.id != "answerTextArea" && e.source.id != "hintView" && e.source.id != "digitLabel") {
			$.answerTextArea.blur();
		}

	} catch(ex) {
		commonFunctions.handleException("freeResponseSurvey", "windowClick", ex);
	}

}

$.serial7STestScreen.addEventListener('android:back', function() {
	goBack();
});
$.headerView.on('quitButtonClick', function(e) {

	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}
	endTime = new Date().toUTCString();

	getValues();

});
function gameLogic(startDigit) {
	selectedNumbersArray = getRandomInt(startDigit - 10, startDigit + 10);
	selectedNumbersArray.push(correctAnswerValue);

	shuffledLabels = shuffle(shuffledLabels);
	for (var i = 0; i < selectedNumbersArray.length; i++) {
		shuffledLabels[i].text = selectedNumbersArray[i];
	};
}

function startTimer() {
	var timer = 60;
	var minutes = 0;
	var seconds = 0;
	countDownTimer = setInterval(function() {
		if (timer == 59) {
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
			$.contentView.touchEnabled = false;

			endTime = new Date().toUTCString();
			getValues();

		}

		timer -= 1;
	}, 1000);
}

function answerSelectionclick(e) {
	if (nexButtonEnable == true) {
		return;
	}

	if (e.source.index != null) {
		var indexValue = parseInt(e.source.index);
		if (viewArray[indexValue - 1].selected != null && viewArray[indexValue - 1].selected != undefined && labelArray[indexValue - 1].selected == true) {

			return;
		}

		if (indexValue == shuffledLabels[shuffledLabels.length - 1].index) {

			totalAttempt += 1;
			var answerView = Ti.UI.createView({
				width : Titanium.UI.FILL,
				height : Titanium.UI.FILL,
				backgroundColor : '#03d981',
				customeText : "answerView"

			});
			var answerMark = Ti.UI.createImageView({
				width : Titanium.UI.SIZE,
				height : Titanium.UI.SIZE,
				image : "/images/spatialSpan/tick_icon.png"

			});
			answerView.add(answerMark);
			viewArray[indexValue - 1].add(answerView);
			viewArray[indexValue - 1].selected = true;

			nexButtonEnable = true;

			$.nextButton.visible = true;

		} else {
			totalAttempt += 1;

			var answerView = Ti.UI.createView({
				width : Titanium.UI.FILL,
				height : Titanium.UI.FILL,
				backgroundColor : '#fe3556',
				customeText : "answerView"

			});
			var answerMark = Ti.UI.createImageView({
				width : Titanium.UI.SIZE,
				height : Titanium.UI.SIZE,
				image : "/images/spatialSpan/wrong_icon.png"

			});
			answerView.add(answerMark);
			viewArray[indexValue - 1].add(answerView);
			viewArray[indexValue - 1].selected = true;

		}
	}
}

function goToNext() {

	var startNumb = correctAnswerValue;
	if (correctAnswerValue == $.answerTextArea.value) {

		correctAnswerCount += 1;
	} else {

	}

	correctAnswerValue = parseInt($.answerTextArea.value) - 7;

	if (levelNumb == 5) {

		var gameScore = Math.round((correctAnswerCount / 5) * 100);
		if (gameScore == 100) {
			points = points + 2;
		} else {
			points = points + 1;
		}
		gamePoints = gamePoints + points;
		commonDB.insertGameScore(6, gameScore, gamePoints, points);
		endTime = new Date().toUTCString();
		if (countDownTimer != null) {
			clearInterval(countDownTimer);
		}

		var timeDiff = commonFunctions.getMinuteSecond(startTime, endTime);
		StatusType = 2;

		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scoreScreen', {
			"GameID" : 6,
			"GameScore" : gameScore,
			"GameType" : 1,
			"GameName" : commonFunctions.L('serial7', LangCode)

		});

	} else {
		$.hintView.visible = false;
		$.hintView.height = 0;
		$.digitLabel.visible = false;
		$.digitLabel.height = 0;
		$.selectedDigitLabel.font = Alloy.Globals.HeaderFontLight;
		$.selectedDigitLabel.text = commonFunctions.L('series7inst', LangCode);
		$.selectedDigitLabel.left = "10dp";
		$.selectedDigitLabel.right = "10dp";
		$.selectionView.top = "10dp";

		$.answerTextArea.value = "";

	}

}

var calculateTime;
var playedTime;
Ti.App.addEventListener('getValues', getValues);
function getValues() {
	if (startTime == null || startTime == "") {
		onSaveSerial7GameFailure();
		return;
	}
	if (Ti.Network.online) {
		var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
		var spinRecords = spinInfo.lampRecords;
		var notiGameScore;
		var spinWheelScore;

		var gameScore = Math.round((5 / correctAnswerCount) * 100);
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
		if (args.isBatch == true && Alloy.Globals.BATCH_ARRAY.length != 1) {
			spinWheelScore = 0;
		}

		if (spinWheelScore < 0) {
			spinWheelScore = 0;
		}
		var resultParameter = {
			"UserID" : credentials.userId,
			"TotalQuestions" : 5,
			"TotalAttempts" : TotalAttempt,
			"StartTime" : startTime,
			"EndTime" : endTime,
			"Point" : points,
			"Score" : gameScore,
			"Version" : vNumber,
			"StatusType" : StatusType,
			"IsNotificationGame" : notificationGame,
			"AdminBatchSchID" : args.isBatch == true ? args.testID : 0,
			"SpinWheelScore" : spinWheelScore
		};

		commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
		serviceManager.saveSerial7Game(resultParameter, onSaveSerial7GameSuccess, onSaveSerial7GameFailure);
	} else {
		commonFunctions.closeActivityIndicator();
		commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode), function() {
			onSaveSerial7GameFailure();

		});

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

/**
 * Success api call
 */
function onSaveSerial7GameSuccess(e) {
	try {
		var response = JSON.parse(e.data);

		if (response.ErrorCode == 0) {
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
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('serial7STestScreen');
					commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

					commonFunctions.closeActivityIndicator();

				} else {
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('serial7STestScreen');
					commonFunctions.closeActivityIndicator();
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
				setTimeout(function() {
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('serial7STestScreen');
					commonFunctions.closeActivityIndicator();
					var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
					if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
						parentWindow.window.refreshHomeScreen();
					}
				}, 1000);

			}

		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}

	} catch(ex) {
		commonFunctions.handleException("serial7", "onSaveSerial7GameSuccess", ex);
	}
}

/**
 * Failure api call
 */
function onSaveSerial7GameFailure(e) {
	Ti.App.removeEventListener('getValues', getValues);
	if (args.isBatch == true) {
		var surveyName = "";
		Alloy.Globals.BATCH_ARRAY = Alloy.Globals.BATCH_ARRAY.splice(1, Alloy.Globals.BATCH_ARRAY.length);
		if (Alloy.Globals.BATCH_ARRAY.length != 0) {

			var surveyId = Alloy.Globals.BATCH_ARRAY[0].trim().split(" ");
			if (surveyId[0] == "S") {
				surveyName = commonDB.getSurveyName(surveyId[1]);
			}
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('serial7STestScreen');
			commonFunctions.closeActivityIndicator();
			commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

		} else {

			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('serial7STestScreen');
			commonFunctions.closeActivityIndicator();

			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
				parentWindow.window.refreshHomeScreen();
			}
		}
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('serial7STestScreen');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
			parentWindow.window.refreshHomeScreen();
		}
	}
	commonFunctions.closeActivityIndicator();
}

var wrongCountTemp = 0;
function onNextClick(e) {
	if ($.answerTextArea.value == "") {

		return;
	}

	TotalAttempt += 1;

	levelNumb = levelNumb + 1;
	goToNext();

}

/**
 * on back button click
 */
$.headerView.on('backButtonClick', function(e) {

	goBack();
});
function goBack(e) {

	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}
	endTime = new Date().toUTCString();

	getValues();

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

			result.push(arr[randomnumber]);
			indexValue = indexValue + 1;

		}

		return result;
	} catch(ex) {
		commonFunctions.handleException("trailsB", "getRandomPosition", ex);
	}
}

function getRandomInt(min, max) {
	var arr = [];
	while (arr.length < 7) {
		var randomnumber = Math.floor(Math.random() * (max - min)) + min;
		if (arr.indexOf(randomnumber) > -1 || correctAnswerValue == randomnumber)
			continue;
		arr[arr.length] = randomnumber;
	}
	return arr;

}

function shuffle(array) {
	var currentIndex = array.length,
	    temporaryValue,
	    randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function removeAnswer() {

	for (var i = 0; i < viewArray.length; i++) {
		if (viewArray[i].children && viewArray[i].children.length > 0) {
			// Make a copy of the array
			var children = viewArray[i].children.slice(0);
			var numChildren = children.length;

			for (var j = 0; j < numChildren; j++) {

				if (children[j].customeText != null && children[j].customeText == "answerView")
					viewArray[i].remove(children[j]);
			}
		}
		viewArray[i].selected = false;

	};

}
