// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = $.args;
var memoryTimer = null;
var imageIndexArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
var currentImageIndex = 0;
var surveyListingArray = [1, 2, 3, 4];
var selectedImageArray = [];
var enableNext = false;
var commonFunctions = require('commonFunctions');
var commonDB = require('commonDB');
var serviceManager = require('serviceManager');
var correctImagePosition = 0;
var selectedImagePosition = 0;
var correctAnswerCount = 0;
var currentProgress = 1;
var countDownTimer = null;
var startTime = "";
var endTime = "";
var points = 0;
var gamePoints = 0;
var count = 0;
var credentials = Alloy.Globals.getCredentials();
var counterTime = 60;
var srartIndex = 1;
var isOdd = 0;
var vNumber = 1;
var distractionSurveyID = 0;
var c = 1;
var StatusType = 1;
var LangCode = Ti.App.Properties.getString('languageCode');
var distSurveySavedParams;
var distructionSurveyReplay;
var notificationGame;
var calculateTime;
var playedTime;
var spinWheelScore;

/**
 * Open Window.
 */
$.simpleMemoryTask.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
			}
		}
		var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
		var spinRecords = spinInfo.lampRecords;
		var notiGameScore;

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

		$.headerView.setTitle(commonFunctions.L('memoryTest', LangCode));
		$.messageLabel.text = commonFunctions.L('SimpleMemoryMessage1', LangCode);
		$.nextButton.text = commonFunctions.L('next', LangCode);
		$.answerlabel.text = commonFunctions.L('answeredLbl', LangCode);
		$.headerView.setQuitViewVisibility(true);

		$.headerView.setQuitViewPosition();
		if (args.reminderVersion != null && args.reminderVersion != 0) {
			vNumber = args.reminderVersion;
		} else {
			var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
			vNumber = versionsInfo.SimpleMemory;
			if (vNumber == "") {
				versionsInfo.SimpleMemory = 2;

				vNumber = 1;
			} else if (vNumber == 1 || vNumber == "1") {
				versionsInfo.SimpleMemory = 2;

			} else if (vNumber == 2 || vNumber == "2") {
				versionsInfo.SimpleMemory = 3;

			} else if (vNumber == 3 || vNumber == "3") {
				versionsInfo.SimpleMemory = 4;

			} else if (vNumber == 4 || vNumber == "4") {
				versionsInfo.SimpleMemory = 1;

			} else {
				vNumber = 1;
				versionsInfo.SimpleMemory = 1;
			}
			Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);
		}

		if (Ti.Network.online) {
			var resultParameter = {
				"UserId" : credentials.userId,
				"CTestId" : 5,
			};
			serviceManager.getDistractionSurvey(resultParameter, onDistractionSurveySuccess, onDistractionSurveyFailure);
		}

		selectedImageArray = getRandomPosition(imageIndexArray, 10);
		srartIndex = getRandomInt(1, 2);
		if (srartIndex == 1) {
			isOdd = true;
		} else {
			isOdd = false;
		}

		var gameInfo = commonDB.getGameScore(credentials.userId);
		for (var i = 0; i < gameInfo.length; i++) {
			if (gameInfo[i].gameID == 5) {
				gamePoints = gameInfo[i].points;
			}
		}
		gameLogic();
		startTimer();

	} catch(ex) {
		commonFunctions.handleException("simpleMemoryTask", "open", ex);
	}
});

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

$.headerView.on('reportButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
function onDistractionSurveySuccess(e) {

	var response = JSON.parse(e.data);
	if (response.ErrorCode == 0) {
		Alloy.Globals.simpleMemorySurveyArray = [];
		for (var i = 0; i < response.Surveys.length; i++) {

			if (response.Surveys[i].SurveyId != null) {
				var surveyId = response.Surveys[i].SurveyId;
				var surveyName = commonDB.getSurveyName(surveyId);

				Alloy.Globals.simpleMemorySurveyArray.push({
					"surveyID" : surveyId,
					"questions" : surveyName
				});
				if (Ti.Network.online) {
					var LastUpdatedDate = Ti.App.Properties.getString("surveyLastUpdatedDate", "");
					serviceManager.getSurveyList(credentials.userId, LastUpdatedDate, getSurveyListSuccess, getSurveyListFailure);
				}
			}
		};

	} else {
		commonFunctions.showAlert(response.ErrorMessage);
	}

}

function getSurveyListSuccess(e) {

	try {
		var response = JSON.parse(e.data);

		if (response.ErrorCode == 0) {
			Ti.App.Properties.setString('surveyLastUpdatedDate', response.LastUpdatedDate);
			var resultArrayList = response.Survey;
			for (var i = 0; i < resultArrayList.length; i++) {
				var surveyID = resultArrayList[i].SurveyID;
				var surveyName = resultArrayList[i].SurveyName;
				// credentials.userId
				if (surveyName != null && surveyName != "") {
					commonDB.insertSurveyTypes(surveyID, surveyName, credentials.userId, resultArrayList[i].IsDeleted);
					commonDB.insertSurveyQuestions(resultArrayList[i].Questions, credentials.userId, surveyID, resultArrayList[i].LanguageCode);
				}

			};

		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}
		commonFunctions.closeActivityIndicator();

	} catch(ex) {
		commonFunctions.handleException("surveyList", "getSurveyListSuccess", ex);
	}
}

/**
 * Failure api call
 */
function getSurveyListFailure(e) {

	commonFunctions.closeActivityIndicator();

}

function onDistractionSurveyFailure(e) {

}

$.simpleMemoryTask.addEventListener('android:back', function() {
	goBack();
});
$.headerView.on('quitButtonClick', function(e) {

	clearInterval(memoryTimer);
	clearInterval(countDownTimer);
	endTime = new Date().toUTCString();

	getGameValues();

});
/**
 * function for game Logic
 */
function gameLogic() {
	if (count == 1) {

		currentImageIndex = 0;
		viewImages();
	} else {

		var imgPathSample = "/images/simpleMemory/" + vNumber + "/" + srartIndex + ".png";

		$.displayImage.image = imgPathSample;
		memoryTimer = setInterval(function() {
			srartIndex += 2;
			currentImageIndex += 1;
			if (currentImageIndex == 5) {

				count = 1;

				var distractionNumber = Ti.App.Properties.getString("distractionSurveySimpleMemory", 0);
				Ti.API.info('distractionNumber : ', distractionNumber);
				if (distractionNumber == 0) {
					Ti.API.info('Alloy.Globals.simpleMemorySurveyArray.length : ', Alloy.Globals.simpleMemorySurveyArray.length);
					if (Alloy.Globals.simpleMemorySurveyArray.length != 1) {
						Ti.App.Properties.setString('distractionSurveySimpleMemory', 1);
					}

				} else if (distractionNumber == Alloy.Globals.simpleMemorySurveyArray.length - 1) {
					Ti.App.Properties.setString('distractionSurveySimpleMemory', 0);

				} else {
					if (distractionNumber > Alloy.Globals.simpleMemorySurveyArray.length - 1) {
						Ti.App.Properties.setString('distractionSurveySimpleMemory', 0);
						distractionNumber = 0;
					} else {
						var numb = parseInt(distractionNumber) + 1;
						Ti.App.Properties.setString('distractionSurveySimpleMemory', numb);

					}

				}

				var surveyListing = Alloy.Globals.simpleMemorySurveyArray;
				Ti.API.info('surveyListing : ', surveyListing);

				currentImageIndex = 0;
				clearInterval(memoryTimer);
				clearInterval(countDownTimer);
				if (surveyListing.length != 0) {
					Alloy.Globals.NAVIGATION_CONTROLLER.openFullScreenWindow('syptomSurveyNew', {
						isFrom : "memoryTest",
						surveyID : surveyListing[distractionNumber].surveyID,
						surveyName : surveyListing[distractionNumber].questions
					});
					$.largeView.visible = false;
				} else {
					$.largeView.visible = false;
					restartGame1();
				}

			} else {
				count = 0;
				$.displayImage.image = "/images/simpleMemory/" + vNumber + "/" + srartIndex + ".png";
			}
		}, 3000);
	}
}

function restartGame1() {
	Ti.API.info('restartGame');
	startTimer();
	srartIndex = 2;
	if (isOdd == true) {
		srartIndex = 1;
	}

	viewImages();
}

$.restartGame = function(surveyParam) {
	try {
		Ti.API.info('restartGame');
		distructionSurveyReplay = true;
		distSurveySavedParams = {
			"distUserID" : surveyParam.UserID,
			"distSurveyType" : surveyParam.SurveyType,
			"distSurveyName" : surveyParam.SurveyName,
			"distStartTime" : surveyParam.StartTime,
			"distEndTime" : surveyParam.EndTime,
			"distRating" : surveyParam.Rating,
			"distPoint" : surveyParam.Point,
			"distQuestAndAnsList" : surveyParam.QuestAndAnsList,
			"distStatusType" : surveyParam.StatusType
		};
		startTimer();
		srartIndex = 2;
		if (isOdd == true) {
			srartIndex = 1;
		}

		viewImages();
	} catch(ex) {
		commonFunctions.handleException("simpleMemoryTask", "restartGame", ex);
	}
};
function viewImages() {
	if (currentProgress == 5) {
		$.nextButton.text = commonFunctions.L('finishLbl', LangCode);
	}
	$.numberLabel.text = currentProgress + "/5";
	var progressValue = (100 / 5) * (currentProgress);
	if (currentProgress == 5) {
		if (commonFunctions.getIsTablet() == true) {
			progressValue = 97;
		} else {
			progressValue = 98;
		}

	}
	$.progressBarLine.width = progressValue + "%";
	currentProgress += 1;
	correctImagePosition = getRandomInt(1, 2);

	if (correctImagePosition == 1) {
		$.compareImage1.image = "/images/simpleMemory/" + vNumber + "/" + srartIndex + ".png";
		var nextIndex = srartIndex - 1;
		if (isOdd == true) {
			nextIndex = srartIndex + 1;
		}

		$.compareImage2.image = "/images/simpleMemory/" + vNumber + "/" + nextIndex + ".png";
	} else if (correctImagePosition == 2) {
		$.compareImage2.image = "/images/simpleMemory/" + vNumber + "/" + srartIndex + ".png";
		var nextIndex = srartIndex - 1;
		if (isOdd == true) {
			nextIndex = srartIndex + 1;
		}
		$.compareImage1.image = "/images/simpleMemory/" + vNumber + "/" + nextIndex + ".png";
	}
	$.smallView.visible = true;
	if (currentImageIndex == 0) {
		$.messageLabel.text = commonFunctions.L('SimpleMemoryMessage2', LangCode);
	}
}

function startTimer() {
	Ti.API.info('startTimer : ', counterTime);
	var timer = counterTime;
	var minutes = 0;
	var seconds = 0;
	countDownTimer = setInterval(function() {
		Ti.API.info('setInterval');
		if (startTime == "") {
			startTime = new Date().toUTCString();
		}
		minutes = parseInt(timer / 60, 10);
		seconds = parseInt(timer % 60, 10);

		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;
		$.countTimer.text = minutes + ":" + seconds;
		Ti.API.info('$.countTimer.text : ', $.countTimer.text);
		if (timer == 0) {
			clearInterval(memoryTimer);

			clearInterval(countDownTimer);

			$.contentView.touchEnabled = false;
			$.messageLabel.text = commonFunctions.L('intructionLabel3', LangCode);
			$.messageView.visible = true;
			endTime = new Date().toUTCString();
			getGameValues();

		}
		timer -= 1;
		counterTime = timer;
	}, 1000);
}

$.headerView.on('backButtonClick', function(e) {

	goBack();
});
function goBack(e) {
	clearInterval(memoryTimer);
	clearInterval(countDownTimer);

	endTime = new Date().toUTCString();

	getGameValues();
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

function getRandomInt(min, max) {
	try {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} catch(ex) {
		commonFunctions.handleException("nBackTest", "getRandomInt", ex);
	}

}

function doneClick(e) {
	Ti.API.info('enter done');
	if (enableNext == false) {
		commonFunctions.showAlert(commonFunctions.L('slectAnswerType', LangCode));
		return;
	}
	if (selectedImagePosition == correctImagePosition) {
		correctAnswerCount += 1;
	}
	enableNext = false;

	currentImageIndex = currentImageIndex + 1;

	if (currentImageIndex != 5) {
		srartIndex += 2;
		selectedImagePosition = 0;
		$.timerLabel.text = 5 + " Sec";
		$.smallView.visible = false;
		$.compareImage1.opacity = "1";
		$.compareImage2.opacity = "1";
		viewImages();
	} else {
		Ti.App.removeEventListener('viewImages', viewImages);
		var gameScore = (correctAnswerCount / 5) * 100;
		if (gameScore == 100) {
			points = points + 2;
		} else {
			points = points + 1;
		}
		gamePoints = gamePoints + points;
		commonDB.insertGameScore(5, gameScore, gamePoints, points);
		endTime = new Date().toUTCString();
		clearInterval(memoryTimer);

		clearInterval(countDownTimer);

		count = 0;
		var timeDiff = commonFunctions.getMinuteSecond(startTime, endTime);
		StatusType = 2;

		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scoreScreen', {
			"GameID" : 5,
			"GameScore" : gameScore,
			"GameType" : 2,
			"GameName" : commonFunctions.L('memoryTest', LangCode)

		});
	}
}

Ti.App.addEventListener('getValues', getGameValues);
function getGameValues() {
	Ti.API.info('strt tiem', startTime);
	if (startTime == null || startTime == "") {
		onSaveSimpleMemoryGameFailure();
		return;
	}

	if (Ti.Network.online) {
		var gameScore = (correctAnswerCount / 5) * 100;
		var wrongAnswers = 5 - correctAnswerCount;
		if (args.isBatch == true && Alloy.Globals.BATCH_ARRAY.length != 1) {
			spinWheelScore = 0;
		}
		if (spinWheelScore < 0) {
			spinWheelScore = 0;
		}
		var resultParameter = {
			"UserID" : credentials.userId,
			"TotalQuestions" : 5,
			"CorrectAnswers" : correctAnswerCount,
			"WrongAnswers" : wrongAnswers,
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
		serviceManager.saveSimpleMemoryGame(resultParameter, onSaveSimpleMemoryGameSuccess, onSaveSimpleMemoryGameFailure);
	} else {
		commonFunctions.closeActivityIndicator();
		commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode), function() {
			onSaveSimpleMemoryGameFailure();

		});

	}

}

/**
 * Success api call
 */
function onSaveSimpleMemoryGameSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		Ti.API.info('***SAVE MEMORY GAME SUCCESS  RESPONSE****  ', JSON.stringify(response));
		if (response.ErrorCode == 0) {
			if (distructionSurveyReplay == true) {
				var destractSurveyParam = {
					"UserID" : distSurveySavedParams.distUserID,
					"SurveyType" : distSurveySavedParams.distSurveyType,
					"SurveyName" : distSurveySavedParams.distSurveyName,
					"StartTime" : distSurveySavedParams.distStartTime,
					"EndTime" : distSurveySavedParams.distEndTime,
					"Rating" : "",
					"Point" : distSurveySavedParams.distPoint,
					"QuestAndAnsList" : distSurveySavedParams.distQuestAndAnsList,
					"StatusType" : distSurveySavedParams.distStatusType,
					"IsDistraction" : true,
					"IsNotificationGame" : notificationGame,
					"SpinWheelScore" : 0
				};

				serviceManager.saveUserSurvey(destractSurveyParam, saveUserSurveySuccess, saveUserSurveyFailure);
				distructionSurveyReplay = false;
				Ti.App.removeEventListener('getValues', getGameValues);
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
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('simpleMemoryTask');
						commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

						commonFunctions.closeActivityIndicator();

					} else {
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('simpleMemoryTask');
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
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('simpleMemoryTask');
						var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
						if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
							parentWindow.window.refreshHomeScreen();
						}
						commonFunctions.closeActivityIndicator();

					}, 1000);
				}
			} else {
				Ti.App.removeEventListener('getValues', getGameValues);
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
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('simpleMemoryTask');
						commonFunctions.closeActivityIndicator();
						commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

					} else {

						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('simpleMemoryTask');
						commonFunctions.closeActivityIndicator();

						var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
						if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
							parentWindow.window.refreshHomeScreen();
						}
					}
				} else {

					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('simpleMemoryTask');
					commonFunctions.closeActivityIndicator();

					var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
					if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
						parentWindow.window.refreshHomeScreen();
					}
				}

			}

		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}

	} catch(ex) {
		commonFunctions.handleException("simplememorygame", "onSaveSimpleMemoryGameSuccess", ex);
	}
}

/**
 * Failure api call
 */
function onSaveSimpleMemoryGameFailure(e) {
	Ti.App.removeEventListener('getValues', getGameValues);
	if (args.isBatch == true) {
		var surveyName = "";
		Alloy.Globals.BATCH_ARRAY = Alloy.Globals.BATCH_ARRAY.splice(1, Alloy.Globals.BATCH_ARRAY.length);
		if (Alloy.Globals.BATCH_ARRAY.length != 0) {

			var surveyId = Alloy.Globals.BATCH_ARRAY[0].trim().split(" ");
			if (surveyId[0] == "S") {
				surveyName = commonDB.getSurveyName(surveyId[1]);
			}
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('simpleMemoryTask');
			commonFunctions.closeActivityIndicator();
			commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

		} else {

			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('simpleMemoryTask');
			commonFunctions.closeActivityIndicator();

			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
				parentWindow.window.refreshHomeScreen();
			}
		}
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('simpleMemoryTask');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
			parentWindow.window.refreshHomeScreen();
		}
	}
	commonFunctions.closeActivityIndicator();
}

/**
 * Signin API Calling Success
 */
function saveUserSurveySuccess() {
	try {
		commonFunctions.closeActivityIndicator();

	} catch(ex) {
		commonFunctions.handleException("comment", "saveUserSurveySuccess", ex);
	}
}

/**
 * Signin API Calling Failure
 */
function saveUserSurveyFailure() {
	commonFunctions.closeActivityIndicator();
}

function image1Click(e) {
	$.messageView.visible = false;
	enableNext = true;
	$.compareImage1.opacity = "0.5";
	$.compareImage2.opacity = "1";

	selectedImagePosition = 1;
}

function image2Click(e) {
	$.messageView.visible = false;
	enableNext = true;
	$.compareImage1.opacity = "1";
	$.compareImage2.opacity = "0.5";
	selectedImagePosition = 2;
}