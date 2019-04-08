/**
 * Declarations
 */
{
	var args = arguments[0] || {};
	var commonFunctions = require('commonFunctions');
	var serviceManager = require('serviceManager');
	var stage = args.Level;
	var alphabetsArray = new Array(11);
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
	var StatusType = 1;
	var LangCode = Ti.App.Properties.getString('languageCode');
	var titleText = commonFunctions.L('nbackTestNew', LangCode);
}

/**
 * Open Window.
 */
$.nBackTestNew.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
			}
		}
		if (Ti.Platform.osname == "ipad") {
			$.headerView.setTitle(titleText, 12);
		} else {
			$.headerView.setTitle(commonFunctions.trimText(titleText, 12));
		}
		$.headerView.setQuitViewVisibility(true);
		$.headerView.setReportViewVisibility(true);
		$.headerView.setReportImage("/images/common/report_icn.png");
		$.headerView.setQuitViewPosition();
		var gameInfo = commonDB.getGameScore(credentials.userId);
		Ti.API.info('game is' + JSON.stringify(gameInfo));
		for (var i = 0; i < gameInfo.length; i++) {
			if (gameInfo[i].gameID == 14) {
				gamePoints = gameInfo[i].points;
			}
		}
		startGame();
		startTimer();
	} catch(ex) {
		commonFunctions.handleException("nBackTestNew", "open", ex);
	}
});

/**
 * Android back button handler
 */
$.nBackTestNew.addEventListener('android:back', function() {
	goBack();
});

/**
 * Handles report image click
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
		resultPosition = getRandomInt(stage, 10);
		var TempAr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

		var tempAlphabetsArray = shuffle(TempAr);
		alphabetsArray[resultPosition] = tempAlphabetsArray[0];
		alphabetsArray[resultPosition - stage] = tempAlphabetsArray[0];
		var j = 1;
		for (var i = 0; i < alphabetsArray.length; i++) {
			if (i == resultPosition || i == resultPosition - stage) {
				continue;
			}
			alphabetsArray[i] = tempAlphabetsArray[j];
			j = j + 1;
		};
		var i = 0;
		Ti.API.info('alphabetsArray : ', alphabetsArray);

		function myLoop() {
			gameTimer = setTimeout(function() {
				answerClicked = false;
				$.yesImage.image = "/images/nBack/yes.png";
				$.noImage.image = "/images/nBack/no.png";
				alphabetIndex = alphabetIndex + 1;
				$.outerBox1.backgroundColor = "#ffffff";
				$.box1.backgroundImage = "/images/nBack/1/" + alphabetsArray[i] + ".png";
				i++;
				if (i < alphabetsArray.length) {
					myLoop();
				} else {

				}
			}, 2000);
		};

		myLoop();

	} catch(ex) {
		commonFunctions.handleException("nBackTestNew", "startGame", ex);
	}
}

var calculateTime;
var playedTime;

/**
 * getValues event handler
 */
Ti.App.addEventListener('getValues', getValues);
function getValues() {
	Ti.API.info('Nback New getValues : ', startTime, args.testID, args.isBatch);
	if (startTime == null || startTime == "") {
		onSaveNBackGameFailure();
		return;
	}
	if (Ti.Network.online) {
		var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
		var spinRecords = spinInfo.lampRecords;
		var notiGameScore;
		var spinWheelScore;

		var gameScore = Math.round((rightAnswerCount / 11) * 100);
		var wrongAnswers = 11 - rightAnswerCount;

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
			"TotalQuestions" : 11,
			"CorrectAnswers" : rightAnswerCount,
			"WrongAnswers" : wrongAnswers,
			"StartTime" : startTime,
			"EndTime" : endTime,
			"Point" : points,
			"Score" : gameScore,
			"StatusType" : StatusType,
			"IsNotificationGame" : notificationGame,
			"AdminBatchSchID" : args.isBatch == true ? args.testID : 0,
			"SpinWheelScore" : spinWheelScore
		};
		Ti.API.info('**** resultParameter SpinWheelScore **** = ' + resultParameter.SpinWheelScore);
		commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
		serviceManager.saveNBackGameImages(resultParameter, onSaveNBackGameSuccess, onSaveNBackGameFailure);
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

					Ti.API.info('Alloy.Globals.BATCH_ARRAY in nback', Alloy.Globals.BATCH_ARRAY);
					var surveyId = Alloy.Globals.BATCH_ARRAY[0].trim().split(" ");
					if (surveyId[0] == "S") {
						surveyName = commonDB.getSurveyName(surveyId[1]);
					}
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackLevelNew');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackTestNew');
					commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

				} else {
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackLevelNew');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackTestNew');
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
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackLevelNew');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackTestNew');
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

			Ti.API.info('Alloy.Globals.BATCH_ARRAY in nback', Alloy.Globals.BATCH_ARRAY);
			var surveyId = Alloy.Globals.BATCH_ARRAY[0].trim().split(" ");
			if (surveyId[0] == "S") {
				surveyName = commonDB.getSurveyName(surveyId[1]);
			}
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackLevelNew');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackTestNew');
			commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

		} else {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackLevelNew');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackTestNew');
			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
				parentWindow.window.refreshHomeScreen();
			}
		}
	} else {

		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackLevelNew');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackTestNew');
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
		commonFunctions.handleException("nBackTestNew", "getRandomInt", ex);
	}

}

/**
 * Generate random alphabets.
 */
function getRandomAlphabets() {
	try {
		var tempArray = [];
		var result = [];
		var possible = "ANWHJPDSEY";
		while (tempArray.length < 10) {
			var randomText = possible.charAt(Math.floor(Math.random() * possible.length));
			if (tempArray.indexOf(randomText) > -1)
				continue;
			tempArray[tempArray.length] = randomText;
			result.push(randomText);

		}
		return result;
	} catch(ex) {
		commonFunctions.handleException("nBackTestNew", "getRandomAlphabets", ex);
	}
}

/**
 * Function to shuffle array
 */
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

/**
 * Reset all fields.
 */
function resetAllFields() {
	try {
		$.letter1.text = "";
		$.yesImage.image = "/images/nBack/yes.png";
		$.noImage.image = "/images/nBack/no.png";
		answerClicked = false;

	} catch(ex) {
		commonFunctions.handleException("nBackTestNew", "resetAllFields", ex);
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
		if (alphabetIndex == resultPosition) {
			$.outerBox1.backgroundColor = "#01E45A";
			rightAnswerCount = rightAnswerCount + 1;
		} else {
			$.outerBox1.backgroundColor = "gray";
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
			var gameScore = Math.round((rightAnswerCount / 11) * 100);
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
				"GameID" : 14,
				"GameScore" : gameScore,
				"GameType" : 1,
				"GameName" : commonFunctions.L('nbackTestNew', LangCode)

			});
		}

	} catch(ex) {
		commonFunctions.handleException("nBackTestNew", "yesClick", ex);
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
		if (alphabetIndex == resultPosition) {
			$.outerBox1.backgroundColor = "gray";
		} else {
			$.outerBox1.backgroundColor = "#01E45A";
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
			var gameScore = Math.round((rightAnswerCount / 11) * 100);
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
				"GameID" : 14,
				"GameScore" : gameScore,
				"GameType" : 1,
				"GameName" : commonFunctions.L('nbackTestNew', LangCode)

			});
		}

	} catch(ex) {
		commonFunctions.handleException("nBackTestNew", "noClick", ex);
	}

}

/**
 * Function to handle Timer
 */
function startTimer() {
	var timer = 24;
	var minutes = 0;
	var seconds = 0;
	countDownTimer = setInterval(function() {
		if (timer == 23) {
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
			$.messageLabel.text = commonFunctions.L('intructionLabel3', LangCode);
			$.messageView.visible = true;
			endTime = new Date().toUTCString();
			getValues();
		}
		timer -= 1;
	}, 1000);
}
