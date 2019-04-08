/**
 * Declarations
 */
{
	var args = arguments[0] || {};
	var commonFunctions = require('commonFunctions');
	var serviceManager = require('serviceManager');
	var stage = args.Level;
	var alphabetsArray = new Array(21);
	var resultPosition = 0;
	var progress = 0;
	var gameTimer = null;
	var completeTimer = null;
	var alphabetIndex = -1;
	var answerClicked = false;
	var rightAnswerCount = 0;
	var commonDB = require('commonDB');
	var startTime = "";
	var endTime = "";
	var points = 0;
	var gamePoints = 0;
	var credentials = Alloy.Globals.getCredentials();
	var countDownTimer = null;
	var StatusType = 1;
	var LangCode = Ti.App.Properties.getString('languageCode');
}

/**
 * Open Window.
 */
$.nBackTest.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
			}
		}
		$.headerView.setQuitViewVisibility(true);
		$.headerView.setReportViewVisibility(true);
		$.headerView.setReportImage("/images/common/report_icn.png");
		$.headerView.setQuitViewPosition();
		var gameInfo = commonDB.getGameScore(credentials.userId);
		Ti.API.info('game is' + JSON.stringify(gameInfo));
		for (var i = 0; i < gameInfo.length; i++) {
			if (gameInfo[i].gameID == 1) {
				gamePoints = gameInfo[i].points;
			}
		}
		startGame();
		startTimer();
	} catch(ex) {
		commonFunctions.handleException("nBackTest", "open", ex);
	}
});

/**
 * Android back button handler
 */
$.nBackTest.addEventListener('android:back', function() {
	goBack();
});

/**
 * Report click
 */
$.headerView.on('reportButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});

/**
 * Game Login function
 */
function startGame() {
	try {
		progress = 0;
		$.gameLabel.text = stage + " BACK";
		if (args.reminderVersion != null && args.reminderVersion != 0) {
			resultPosition = args.reminderVersion;
		} else {
			var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
			resultPosition = versionsInfo.nBack;

			if (resultPosition == "") {
				versionsInfo.nBack = 5;
				resultPosition = 4;
			} else if (resultPosition == 4 || resultPosition == "4") {
				versionsInfo.nBack = 5;
			} else if (resultPosition == 5 || resultPosition == "5") {
				versionsInfo.nBack = 6;
			} else if (resultPosition == 6 || resultPosition == "6") {
				versionsInfo.nBack = 7;
			} else if (resultPosition == 7 || resultPosition == "7") {
				versionsInfo.nBack = 8;
			} else if (resultPosition == 8 || resultPosition == "8") {
				versionsInfo.nBack = 9;
			} else if (resultPosition == 9 || resultPosition == "9") {
				versionsInfo.nBack = 10;
			} else if (resultPosition == 10 || resultPosition == "10") {
				versionsInfo.nBack = 11;
			} else if (resultPosition == 11 || resultPosition == "11") {
				versionsInfo.nBack = 12;
			} else if (resultPosition == 12 || resultPosition == "12") {
				versionsInfo.nBack = 13;
			} else if (resultPosition == 13 || resultPosition == "13") {
				versionsInfo.nBack = 14;
			} else if (resultPosition == 14 || resultPosition == "14") {
				versionsInfo.nBack = 15;
			} else if (resultPosition == 15 || resultPosition == "15") {
				versionsInfo.nBack = 16;
			} else if (resultPosition == 16 || resultPosition == "16") {
				versionsInfo.nBack = 17;
			} else if (resultPosition == 17 || resultPosition == "17") {
				versionsInfo.nBack = 18;
			} else if (resultPosition == 18 || resultPosition == "18") {
				versionsInfo.nBack = 4;
			}
			Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);

		}

		Ti.API.info('Game Level : ', resultPosition);
		var tempAlphabetsArray = getRandomAlphabets();
		Ti.API.info('tempAlphabetsArray : ', tempAlphabetsArray);

		var j = 1;
		var alphabetsOnlyArray = new Array(19);
		alphabetsOnlyArray[resultPosition] = tempAlphabetsArray[0];
		alphabetsOnlyArray[resultPosition - stage] = tempAlphabetsArray[0];
		for (var i = 0; i < 19; i++) {
			if (i == resultPosition || i == resultPosition - stage) {
				continue;
			}
			alphabetsOnlyArray[i] = tempAlphabetsArray[j];
			j = j + 1;
		};
		Ti.API.info('alphabetsOnlyArray : ', alphabetsOnlyArray, alphabetsArray.length);
		var p = 0;
		var isResult = false;
		for (var t = 0; t < 19; t++) {
			alphabetsArray[p] = alphabetsOnlyArray[t];
			if (t == resultPosition && isResult == false) {
				Ti.API.info('Result alphabet');
				resultPosition = p;
				isResult = true;
			}
			if (t != 18) {
				alphabetsArray[p + 1] = "+";
			}
			p = p + 2;
		};
		var i = 0;
		function isOdd(n) {
			return Math.abs(n % 2) == 1;
		}


		Ti.API.info('alphabetsArray : ', alphabetsArray);
		function myLoop() {
			gameTimer = setTimeout(function() {
				answerClicked = false;
				$.box1.backgroundColor = "#ffffff";
				$.yesImage.image = "/images/nBack/yes.png";
				$.noImage.image = "/images/nBack/no.png";
				if (isOdd(i) == 1) {
					$.yesImage.visible = false;
					$.noImage.visible = false;
					$.yesImage.touchEnabled = false;
					$.noImage.touchEnabled = false;

				} else {
					$.yesImage.visible = true;
					$.noImage.visible = true;
					$.yesImage.touchEnabled = true;
					$.noImage.touchEnabled = true;

				}
				alphabetIndex = alphabetIndex + 1;
				$.letter1.text = alphabetsArray[i];
				i++;
				if (i < alphabetsArray.length) {
					myLoop();
				} else {

				}
			}, 2000);
		};

		myLoop();

	} catch(ex) {
		commonFunctions.handleException("nBackTest", "startGame", ex);
	}
}

var calculateTime;
var playedTime;

/**
 * getValues event handler
 */
Ti.App.addEventListener('getValues', getValues);
function getValues() {
	if (startTime == null || startTime == "") {
		onSaveNBackGameFailure();
		return;
	}
	if (Ti.Network.online) {
		var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
		var spinRecords = spinInfo.lampRecords;
		var notiGameScore;
		var spinWheelScore;

		var gameScore = Math.round((rightAnswerCount / 19) * 100);
		var wrongAnswers = 19 - rightAnswerCount;

		var notificationGame;
		Ti.API.info(' ***** args.fromNotification ***** ' + args.fromNotification);
		if (args.fromNotification === true && args.isLocal != 1) {
			notificationGame = true;
			dateTimeFormat(args.createdDate);
			if (spinRecords != 0) {
				notiGameScore = Math.trunc(100 / spinRecords);
				Ti.API.info(' ***** notiGameScore ***** ' + notiGameScore);
				if (playedTime >= 5) {
					calculateTime = Math.trunc(parseInt(playedTime) / 5);
					Ti.API.info(' ***** calculateTime ***** ' + calculateTime);
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
			"TotalQuestions" : 19,
			"CorrectAnswers" : rightAnswerCount,
			"WrongAnswers" : wrongAnswers,
			"StartTime" : startTime,
			"EndTime" : endTime,
			"Point" : points,
			"Score" : gameScore,
			"Version" : resultPosition,
			"StatusType" : StatusType,
			"IsNotificationGame" : notificationGame,
			"AdminBatchSchID" : args.isBatch == true ? args.testID : 0,
			"SpinWheelScore" : spinWheelScore
		};
		Ti.API.info('**** resultParameter SpinWheelScore **** = ' + resultParameter.SpinWheelScore);
		Ti.API.info('isBatch', args.isBatch);
		Ti.API.info('args.testID', args.testID);
		commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
		serviceManager.saveNBackGame(resultParameter, onSaveNBackGameSuccess, onSaveNBackGameFailure);
	} else {
		commonFunctions.closeActivityIndicator();
		commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode), function() {
			onSaveNBackGameFailure();

		});

	}
}

/**
 * Date Time Format
 */
function dateTimeFormat(createdDate) {
	Ti.API.info('args.createdDate : ', createdDate);
	var createdDateTime = createdDate.split(" ");
	Ti.API.info(' ***** createdDateTime ***** ' + createdDateTime);
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

	Ti.API.info('*** resultDate **** ' + resultDate);

	var myDate = new Date(resultDate).getTime();
	var curDate = new Date().getTime();
	Ti.API.info(' ***** myDate ***** ' + myDate);
	Ti.API.info(' ***** curDate ***** ' + curDate);
	var timeDifference = curDate - myDate;
	Ti.API.info(' ***** timeDifference ***** ' + timeDifference);

	playedTime = parseInt(timeDifference) / 60000;
	Ti.API.info(' ***** playedTime ***** ' + playedTime);
}

/**
 * Success api call
 */
function onSaveNBackGameSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		Ti.API.info('***SAVE N-BACK GAME SUCCESS  RESPONSE****  ', JSON.stringify(response));
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
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackLevel');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackTest');
					commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

				} else {
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackLevel');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackTest');
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
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackLevel');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackTest');
				var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
				if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
					parentWindow.window.refreshHomeScreen();
				}
			}

		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}
		commonFunctions.closeActivityIndicator();

	} catch(ex) {
		commonFunctions.handleException("nback", "onSaveNBackGameSuccess", ex);
	}
}

/**
 * Failure api call
 */
function onSaveNBackGameFailure(e) {
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
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackLevel');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackTest');
			commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

		} else {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackLevel');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackTest');
			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
				parentWindow.window.refreshHomeScreen();
			}
		}
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackLevel');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackTest');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
			parentWindow.window.refreshHomeScreen();
		}
	}
	commonFunctions.closeActivityIndicator();
}

/**
 * on back button click
 */
$.headerView.on('backButtonClick', function(e) {

	goBack();
});

/**
 * Header quit button click
 */
$.headerView.on('quitButtonClick', function(e) {
	clearTimeout(gameTimer);
	clearTimeout(completeTimer);

	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}

	endTime = new Date().toUTCString();
	getValues();
});

/**
 * goBack function handler
 */
function goBack(e) {
	clearTimeout(gameTimer);
	clearTimeout(completeTimer);
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}

	endTime = new Date().toUTCString();
	getValues();
}

/**
 * Function to get random integer
 */
function getRandomInt(min, max) {
	try {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} catch(ex) {
		commonFunctions.handleException("nBackTest", "getRandomInt", ex);
	}

}

/**
 * Generate random alphabets.
 */
function getRandomAlphabets() {
	try {
		var tempArray = [];
		var result = [];
		var possible = "ANWHJPDSEYBGKMQUTC";
		while (tempArray.length < 18) {
			var randomText = possible.charAt(Math.floor(Math.random() * possible.length));
			if (tempArray.indexOf(randomText) > -1)
				continue;
			tempArray[tempArray.length] = randomText;
			result.push(randomText);

		}
		return result;
	} catch(ex) {
		commonFunctions.handleException("nBackTest", "getRandomAlphabets", ex);
	}
}

/**
 * Reset all fields.
 */
function resetAllFields() {
	try {
		$.letter1.text = "";
		$.box1.backgroundColor = "#ffffff";
		$.yesImage.image = "/images/nBack/yes.png";
		$.noImage.image = "/images/nBack/no.png";
		answerClicked = false;

	} catch(ex) {
		commonFunctions.handleException("nBackTest", "resetAllFields", ex);
	}
}

/**
 * Answer click type YES
 */
function yesClick(e) {
	try {

		if (answerClicked == true || alphabetIndex == -1) {
			return;
		}
		answerClicked = true;
		Ti.API.info(' alphabetsArray.yes', alphabetsArray.length, alphabetIndex);
		if (alphabetIndex == resultPosition) {
			$.box1.backgroundColor = "#01E45A";
			rightAnswerCount = rightAnswerCount + 1;
		} else {
			$.box1.backgroundColor = "gray";
		}
		$.yesImage.image = "/images/nBack/yes-active.png";

		if (alphabetsArray.length - 1 == alphabetIndex) {
			endTime = new Date().toUTCString();
			if (countDownTimer != null) {
				clearInterval(countDownTimer);
			}
			clearTimeout(gameTimer);
			clearTimeout(completeTimer);
			Ti.API.info('rightAnswerCount : ', rightAnswerCount);
			var gameScore = Math.round((rightAnswerCount / 19) * 100);
			if (gameScore == 100) {
				points = points + 2;
			} else {
				points = points + 1;
			}
			gamePoints = gamePoints + points;
			if (args.Level == 1) {
				commonDB.insertGameScore(1, gameScore, gamePoints, points);
			} else if (args.Level == 2) {
				commonDB.insertGameScore(1, gameScore, gamePoints, points);
			} else if (args.Level == 3) {
				commonDB.insertGameScore(1, gameScore, gamePoints, points);
			}

			var timeDiff = commonFunctions.getMinuteSecond(startTime, endTime);
			StatusType = 2;
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scoreScreen', {
				"GameID" : 1,
				"GameScore" : gameScore,
				"GameType" : 1,
				"GameName" : commonFunctions.L('nbackTest', LangCode)

			});

		}

	} catch(ex) {
		commonFunctions.handleException("nBackTest", "yesClick", ex);
	}

}

/**
 * Answer click type NO
 */
function noClick(e) {
	try {
		if (answerClicked == true || alphabetIndex == -1) {
			return;
		}
		answerClicked = true;
		Ti.API.info(' alphabetsArray.NO', alphabetsArray.length, alphabetIndex);
		if (alphabetIndex == resultPosition) {
			$.box1.backgroundColor = "gray";
		} else {
			$.box1.backgroundColor = "#01E45A";
			rightAnswerCount = rightAnswerCount + 1;
		}
		$.noImage.image = "/images/nBack/no-active.png";

		if (alphabetsArray.length - 1 == alphabetIndex) {
			endTime = new Date().toUTCString();
			if (countDownTimer != null) {
				clearInterval(countDownTimer);
			}
			clearTimeout(gameTimer);
			clearTimeout(completeTimer);
			Ti.API.info('rightAnswerCount : ', rightAnswerCount);
			var gameScore = Math.round((rightAnswerCount / 19) * 100);
			if (gameScore == 100) {
				points = points + 2;
			} else {
				points = points + 1;
			}
			gamePoints = gamePoints + points;
			if (args.Level == 1) {
				commonDB.insertGameScore(1, gameScore, gamePoints, points);
			} else if (args.Level == 2) {
				commonDB.insertGameScore(1, gameScore, gamePoints, points);
			} else if (args.Level == 3) {
				commonDB.insertGameScore(1, gameScore, gamePoints, points);
			}

			var timeDiff = commonFunctions.getMinuteSecond(startTime, endTime);
			StatusType = 2;
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scoreScreen', {
				"GameID" : 1,
				"GameScore" : gameScore,
				"GameType" : 1,
				"GameName" : commonFunctions.L('nbackTest', LangCode)

			});
		}

	} catch(ex) {
		commonFunctions.handleException("nBackTest", "noClick", ex);
	}

}

/**
 * Function to handle Timer
 */
function startTimer() {
	var timer = 75;
	var minutes = 0;
	var seconds = 0;
	countDownTimer = setInterval(function() {
		if (timer == 73) {
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
			clearTimeout(gameTimer);

			$.contentView.touchEnabled = false;
			endTime = new Date().toUTCString();
			getValues();
		}
		timer -= 1;

	}, 1000);
}
