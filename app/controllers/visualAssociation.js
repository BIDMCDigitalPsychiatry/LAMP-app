// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = $.args;
var commonFunctions = require('commonFunctions');
var commonDB = require('commonDB');
var imageIndexArray = [1, 2, 3, 4, 5, 6];
var thumbImageArrayOrg = [$.img1, $.img2, $.img3, $.img4, $.img5, $.img6];
var thumbImageArrayShuffle = [$.img1, $.img2, $.img3, $.img4, $.img5, $.img6];
var thumbViewArrayOrg = [$.imgV1, $.imgV2, $.imgV3, $.imgV4, $.imgV5, $.imgV6];
var imageRandomIndexArray = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
var currentImageIndex = 0;
var countDownTimer = null;
var memoryTimer = null;
var selectedImageArray = [];
var totalAttempt = 0;
var serviceManager = require('serviceManager');
var startTime = "";
var endTime = "";
var points = 0;
var gamePoints = 0;
var credentials = Alloy.Globals.getCredentials();
var counterTime = 60;
Ti.API.info('Visual Init');
var vNumber = 1;
var distractionSurveyID = 0;
var StatusType = 1;
var LangCode = Ti.App.Properties.getString('languageCode');
var distSurveySavedParams;
var distructionSurveyReplay;
var notificationGame;
var calculateTime;
var playedTime;
var spinWheelScore;

/**
 * function for screen open
 */
$.visualAssociation.addEventListener("open", function(e) {
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
		$.headerView.setTitle(commonFunctions.L('visualGame', LangCode));
		$.messageLabel.text = commonFunctions.L('tempAlert3', LangCode);
		$.instructionLabel.text = commonFunctions.L('tempAlert1', LangCode);
		$.headerView.setQuitViewVisibility(true);
		$.headerView.setReportViewVisibility(true);
		$.headerView.setReportImage("/images/common/report_icn.png");
		$.headerView.setQuitViewPosition();
		if (args.reminderVersion != null && args.reminderVersion != 0) {
			vNumber = args.reminderVersion;
		} else {
			var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
			vNumber = versionsInfo.VisualAssociation;
			if (vNumber == "") {
				versionsInfo.VisualAssociation = 2;

				vNumber = 1;
			} else if (vNumber == 1 || vNumber == "1") {
				versionsInfo.VisualAssociation = 2;

			} else if (vNumber == 2 || vNumber == "2") {
				versionsInfo.VisualAssociation = 3;

			} else if (vNumber == 3 || vNumber == "3") {
				versionsInfo.VisualAssociation = 4;

			} else if (vNumber == 4 || vNumber == "4") {
				versionsInfo.VisualAssociation = 1;

			} else {
				vNumber = 1;
				versionsInfo.VisualAssociation = 1;

			}
			Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);
		}

		if (Ti.Network.online) {
			var resultParameter = {
				"UserId" : credentials.userId,
				"CTestId" : 9,
			};
			serviceManager.getDistractionSurvey(resultParameter, onDistractionSurveySuccess, onDistractionSurveyFailure);
		}

		var gameInfo = commonDB.getGameScore(credentials.userId);
		Ti.API.info('game is' + JSON.stringify(gameInfo));
		for (var i = 0; i < gameInfo.length; i++) {
			if (gameInfo[i].gameID == 9) {
				gamePoints = gameInfo[i].points;
			}
		}
		selectedImageArray = getRandomPosition(imageIndexArray, 5);
		Ti.API.info('selectedImageArray : ', selectedImageArray);
		startTimer();
		gameLogic();

	} catch(ex) {
		commonFunctions.handleException("catAndDogGame", "open", ex);
	}
});

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

$.headerView.on('reportButtonClick', function(e) {

	commonFunctions.sendScreenshot();
});
function onDistractionSurveySuccess(e) {
	Ti.API.info('onDistractionSurveySuccess : ', JSON.stringify(e));
	var response = JSON.parse(e.data);
	if (response.ErrorCode == 0) {
		Ti.API.info('response.Surveys.length : ', response.Surveys.length);
		Alloy.Globals.visualAssociationSurveyArray = [];
		for (var i = 0; i < response.Surveys.length; i++) {

			if (response.Surveys[i].SurveyId != null) {
				var surveyId = response.Surveys[i].SurveyId;
				var surveyName = commonDB.getSurveyName(surveyId);

				Alloy.Globals.visualAssociationSurveyArray.push({
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
		Ti.API.info('***getSurveyListSuccess****  ', JSON.stringify(response));

		if (response.ErrorCode == 0) {
			Ti.App.Properties.setString('surveyLastUpdatedDate', response.LastUpdatedDate);
			var resultArrayList = response.Survey;
			for (var i = 0; i < resultArrayList.length; i++) {
				var surveyID = resultArrayList[i].SurveyID;
				var surveyName = resultArrayList[i].SurveyName;

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
	Ti.API.info('***getSurveyListFailure****  ', JSON.stringify(e));
	commonFunctions.closeActivityIndicator();

}

function onDistractionSurveyFailure(e) {

}

/**
 * game logic function
 */
function gameLogic() {
	Ti.API.info('selectedImageArray[currentImageIndex] : ', selectedImageArray[currentImageIndex].imageIndex);
	$.displayImage.image = "/images/visualAssociation/initialImages/" + vNumber + "/" + selectedImageArray[currentImageIndex].imageIndex + ".png";
	Ti.API.info('$.displayImage.image : ', $.displayImage.image);
	memoryTimer = setInterval(function() {
		currentImageIndex += 1;
		if (currentImageIndex == 5) {
			clearInterval(memoryTimer);
			clearInterval(countDownTimer);
			Ti.API.info('Completed');
			$.messageView.visible = false;

			var distractionNumber = Ti.App.Properties.getString("distractionSurveyVisualAssociation", 0);
			Ti.API.info('distractionNumber : ', distractionNumber, " Alloy.Globals.visualAssociationSurveyArray.length : ", Alloy.Globals.visualAssociationSurveyArray.length);
			if (distractionNumber == 0) {
				Ti.API.info('Alloy.Globals.visualAssociationSurveyArray : ', Alloy.Globals.visualAssociationSurveyArray);
				if (Alloy.Globals.visualAssociationSurveyArray.length != 1) {
					Ti.API.info('Set distraction to 1');
					Ti.App.Properties.setString('distractionSurveyVisualAssociation', 1);
				}

			} else if (distractionNumber == Alloy.Globals.visualAssociationSurveyArray.length - 1) {
				Ti.API.info('Set distraction to 0..');
				Ti.App.Properties.setString('distractionSurveyVisualAssociation', 0);

			} else {
				if (distractionNumber > Alloy.Globals.visualAssociationSurveyArray.length - 1) {
					Ti.API.info('Set distraction to 0');
					Ti.App.Properties.setString('distractionSurveyVisualAssociation', 0);
					distractionNumber = 0;
				} else {
					var numb = parseInt(distractionNumber) + 1;
					Ti.API.info('Set distraction to numb ', numb);
					Ti.App.Properties.setString('distractionSurveyVisualAssociation', numb);

				}

			}

			var surveyListing = Alloy.Globals.visualAssociationSurveyArray;
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
			$.displayImage.image = "/images/visualAssociation/initialImages/" + vNumber + "/" + selectedImageArray[currentImageIndex].imageIndex + ".png";

		}

	}, 3000);

}

$.visualAssociation.addEventListener('android:back', function() {
	goBack();
});
/**
 * function for back button click
 */
$.headerView.on('backButtonClick', function(e) {

	goBack();
});
$.headerView.on('quitButtonClick', function(e) {

	if (memoryTimer != null) {
		clearInterval(memoryTimer);
	}
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}

	endTime = new Date().toUTCString();
	getValues();

});
function goBack(e) {

	if (memoryTimer != null) {
		clearInterval(memoryTimer);
	}
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}

	endTime = new Date().toUTCString();
	getValues();

}

/**
 * timer function
 */
function startTimer() {
	var timer = counterTime;
	var minutes = 0;
	var seconds = 0;
	countDownTimer = setInterval(function() {
		timer -= 1;
		if (timer == 58) {
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
			$.messageLabel.text = commonFunctions.L('intructionLabel3', LangCode);
			$.messageView.visible = true;
			endTime = new Date().toUTCString();
			getValues();

		}

		counterTime = timer;
	}, 1000);
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
		commonFunctions.handleException("visualAssociation", "getRandomPosition", ex);
	}
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

function resultOnclick(e) {
	try {
		Ti.API.info('resultOnclick : ', JSON.stringify(e));
		if (e.source.index != null) {
			var indexValue = parseInt(e.source.index);
			if (thumbViewArrayOrg[indexValue - 1].selected != null && thumbViewArrayOrg[indexValue - 1].selected != undefined && thumbViewArrayOrg[indexValue - 1].selected == true) {
				Ti.API.info('Box already selected');
				return;
			}
			var answerViewHeight = "60dp";
			var answerViewWidth = "120dp";
			if (Ti.Platform.osname == "ipad") {
				answerViewHeight = "120dp";
				answerViewWidth = "150dp";
			}

			Ti.API.info('indexValue : ', indexValue);
			Ti.API.info('thumbImageArrayShuffle : ', thumbImageArrayShuffle[indexValue - 1].index, thumbImageArrayShuffle[indexValue - 1].imageIndex);
			Ti.API.info('selectedImageArray : ', selectedImageArray[currentImageIndex].imageIndex);
			Ti.API.info('*** : ', thumbImageArrayShuffle[selectedImageArray[currentImageIndex].imageIndex - 1].index, e.source.imageIndex, indexValue);

			if (selectedImageArray[currentImageIndex].imageIndex == e.source.imageIndex) {
				Ti.API.info('Correct Answer');
				totalAttempt += 1;
				var answerView = Ti.UI.createView({
					width : answerViewWidth,
					height : answerViewHeight,
					backgroundColor : '#03d981',
					customeText : "answerView",
					left : '10%',

				});
				if (commonFunctions.getIsTablet() == true) {
					answerView.left = "25%";
				}
				var answerMark = Ti.UI.createImageView({
					width : Titanium.UI.SIZE,
					height : Titanium.UI.SIZE,
					image : "/images/spatialSpan/tick_icon.png"

				});
				answerView.add(answerMark);
				thumbViewArrayOrg[indexValue - 1].add(answerView);
				thumbViewArrayOrg[indexValue - 1].selected = true;
				nextLevel();

			} else {
				Ti.API.info('Wrong Answer');
				totalAttempt += 1;
				var answerView = Ti.UI.createView({
					width : answerViewWidth,
					height : answerViewHeight,
					backgroundColor : '#fe3556',
					customeText : "answerView",
					left : '10%',

				});
				if (commonFunctions.getIsTablet() == true) {
					answerView.left = "25%";
				}
				var answerMark = Ti.UI.createImageView({
					width : Titanium.UI.SIZE,
					height : Titanium.UI.SIZE,
					image : "/images/spatialSpan/wrong_icon.png"

				});
				answerView.add(answerMark);
				thumbViewArrayOrg[indexValue - 1].add(answerView);
				thumbViewArrayOrg[indexValue - 1].selected = true;
			}
		}

	} catch(ex) {
		commonFunctions.handleException("visualAssociation", "resultOnclick", ex);
	}

}

function nextLevel() {
	removeAnswer();
	currentImageIndex += 1;
	if (selectedImageArray.length == currentImageIndex) {
		endTime = new Date().toUTCString();
		if (countDownTimer != null) {
			clearInterval(countDownTimer);
		}

		var gameScore = Math.round((5 / totalAttempt) * 100);
		if (gameScore == 100) {
			points = points + 2;
		} else {
			points = points + 1;
		}
		gamePoints = gamePoints + points;
		commonDB.insertGameScore(9, gameScore, gamePoints, points);

		var timeDiff = commonFunctions.getMinuteSecond(startTime, endTime);
		StatusType = 2;

		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scoreScreen', {
			"GameID" : 9,
			"GameScore" : gameScore,
			"GameType" : 2,
			"GameName" : commonFunctions.L('visualGame', LangCode)

		});

	} else {
		viewImages();

	}
}

Ti.App.addEventListener('getValues', getValues);
function getValues() {
	if (startTime == null || startTime == "") {
		onSaveVisualAssociationGameFailure();
		return;
	}
	if (Ti.Network.online) {
		var gameScore = Math.round((5 / totalAttempt) * 100);
		if (args.isBatch == true && Alloy.Globals.BATCH_ARRAY.length != 1) {
			spinWheelScore = 0;
		}
		if (spinWheelScore < 0) {
			spinWheelScore = 0;
		}
		var resultParameter = {
			"UserID" : credentials.userId,
			"TotalQuestions" : 5,
			"TotalAttempts" : totalAttempt,
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
		Ti.API.info('**** resultParameter SpinWheelScore **** = ' + resultParameter.SpinWheelScore);
		commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
		serviceManager.saveVisualAssociationGame(resultParameter, onSaveVisualAssociationGameSuccess, onSaveVisualAssociationGameFailure);
	} else {

		commonFunctions.closeActivityIndicator();
		commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode), function() {
			onSaveVisualAssociationGameFailure();

		});

	}
}

/**
 * Success api call
 */
function onSaveVisualAssociationGameSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		Ti.API.info('***SAVE VISUAL ASSOCIATION GAME SUCCESS  RESPONSE****  ', JSON.stringify(response));
		if (response.ErrorCode == 0) {

			clearInterval(memoryTimer);
			clearInterval(countDownTimer);

			var diff = 0;
			Ti.App.removeEventListener('getValues', getValues);
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
					Ti.API.info('*** Destraction Survey Save Params : ' + JSON.stringify(destractSurveyParam));
					serviceManager.saveUserSurvey(destractSurveyParam, saveUserSurveySuccess, saveUserSurveyFailure);
					distructionSurveyReplay = false;
				}
				var surveyName = "";
				Alloy.Globals.BATCH_ARRAY = Alloy.Globals.BATCH_ARRAY.splice(1, Alloy.Globals.BATCH_ARRAY.length);
				if (Alloy.Globals.BATCH_ARRAY.length != 0) {

					Ti.API.info('Alloy.Globals.BATCH_ARRAY in nback', Alloy.Globals.BATCH_ARRAY);
					var surveyId = Alloy.Globals.BATCH_ARRAY[0].trim().split(" ");
					if (surveyId[0] == "S") {
						surveyName = commonDB.getSurveyName(surveyId[1]);
					}
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('visualAssociation');
					commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

					commonFunctions.closeActivityIndicator();

				} else {
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('visualAssociation');
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
					Ti.API.info('*** Destraction Survey Save Params : ' + JSON.stringify(destractSurveyParam));
					serviceManager.saveUserSurvey(destractSurveyParam, saveUserSurveySuccess, saveUserSurveyFailure);
					distructionSurveyReplay = false;

					setTimeout(function() {
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('visualAssociation');
						commonFunctions.closeActivityIndicator();
						var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
						if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
							parentWindow.window.refreshHomeScreen();
						}
					}, 1000);

				} else {
					setTimeout(function() {
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('visualAssociation');
						commonFunctions.closeActivityIndicator();
						var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
						if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
							parentWindow.window.refreshHomeScreen();
						}
					}, 1000);
				}
				commonFunctions.closeActivityIndicator();
			}

		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}

	} catch(ex) {
		commonFunctions.handleException("visualassociationgame", "onSaveVisualAssociationGameSuccess", ex);
	}
}

/**
 * Failure api call
 */
function onSaveVisualAssociationGameFailure(e) {
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
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('visualAssociation');
			commonFunctions.closeActivityIndicator();
			commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

		} else {

			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('visualAssociation');
			commonFunctions.closeActivityIndicator();

			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
				parentWindow.window.refreshHomeScreen();
			}
		}
	} else {
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('visualAssociation');
			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
				parentWindow.window.refreshHomeScreen();
			}

		}, 1000);
	}
	commonFunctions.closeActivityIndicator();
}

/**
 * Signin API Calling Success
 */
function saveUserSurveySuccess() {
	try {
		commonFunctions.closeActivityIndicator();
		Ti.API.info('*** VisualAssociation saveUserSurveySuccess');
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

function removeAnswer() {
	Ti.API.info('thumbViewArrayOrg.length : ', thumbViewArrayOrg.length);
	for (var i = 0; i < thumbViewArrayOrg.length; i++) {
		if (thumbViewArrayOrg[i].children && thumbViewArrayOrg[i].children.length > 0) {
			// Make a copy of the array
			var children = thumbViewArrayOrg[i].children.slice(0);
			var numChildren = children.length;
			Ti.API.info('numChildren : ', numChildren);
			for (var j = 0; j < numChildren; j++) {
				Ti.API.info('children[i] : ', JSON.stringify(children[j]));
				if (children[j].customeText != null && children[j].customeText == "answerView")
					thumbViewArrayOrg[i].remove(children[j]);
			}
		}
		thumbViewArrayOrg[i].selected = false;

	};

}

function restartGame1() {
	try {
		Ti.API.info('restartGame1');
		currentImageIndex = 0;
		startTimer();
		viewImages();
	} catch(ex) {
		commonFunctions.handleException("simpleMemoryTask", "restartGame1", ex);
	}

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
		currentImageIndex = 0;
		startTimer();
		viewImages();
	} catch(ex) {
		commonFunctions.handleException("simpleMemoryTask", "restartGame", ex);
	}
};
function viewImages() {

	$.singleImage.image = "/images/visualAssociation/questionImages/" + vNumber + "/" + selectedImageArray[currentImageIndex].imageIndex + ".png";
	thumbImageArrayShuffle = shuffle(thumbImageArrayShuffle);
	var tempRandom = getRandomPosition(imageRandomIndexArray, 5);
	for (var i = 0; i < 6; i++) {
		thumbImageArrayShuffle[i].height = '60dp';
		if (Ti.Platform.osname == "ipad") {
			thumbImageArrayShuffle[i].height = '120dp';
		}
		thumbImageArrayShuffle[i].width = Titanium.UI.SIZE;
		thumbImageArrayShuffle[i].left = "10%";
		thumbImageArrayShuffle[i].right = "10%";
		if (commonFunctions.getIsTablet() == true) {
			thumbImageArrayShuffle[i].left = "25%";
			thumbImageArrayShuffle[i].right = "25%";
		}

		if (i == 0) {
			thumbImageArrayShuffle[i].image = "/images/visualAssociation/resultImages/" + vNumber + "/" + selectedImageArray[currentImageIndex].imageIndex + ".png";
			thumbImageArrayShuffle[i].imageIndex = selectedImageArray[currentImageIndex].imageIndex;
			Ti.API.info('Correct Answer Index : ', thumbImageArrayShuffle[i].imageIndex);

		} else {
			var imageName = tempRandom[i - 1].imageIndex;
			thumbImageArrayShuffle[i].image = "/images/visualAssociation/resultImages/" + vNumber + "/" + imageName + ".png";
			thumbImageArrayShuffle[i].imageIndex = imageName;
			Ti.API.info('Wrong Answer Index : ', thumbImageArrayShuffle[i].imageIndex);

		}

	};
	$.resultView.visible = true;
}