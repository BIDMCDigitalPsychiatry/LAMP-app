// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = $.args;
var currentSequence = 0;
var imageArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var boxIndexArray = [$.index1, $.index2, $.index3, $.index4, $.index5, $.index6, $.index7, $.index8, $.index9];
var thumbImageArray = [$.image1, $.image2, $.image3, $.image4, $.image5, $.image6, $.image7, $.image8, $.image9];
var shuffledBoxArray = [$.index1, $.index2, $.index3, $.index4, $.index5, $.index6, $.index7, $.index8, $.index9];
var shuffledImageArray = [];
var gameTimer = null;
var completeTimer = null;
var thumbClcikedImageIndex = -1;
var imagePlcedCount = 0;
var selectedViewArray = [];
var countDownTimer = null;
var stage = 1;
var labalTimer = null;
var commonFunctions = require('commonFunctions');
var commonDB = require('commonDB');
var serviceManager = require('serviceManager');
var startTime = "";
var endTime = "";
var credentials = Alloy.Globals.getCredentials();
var correctAnswerCount = 0;
var wrongAnswerCount = 0;
var points = 0;
var gamePoints = 0;
var counterTime = 240;
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
$.temporalOrder.addEventListener("open", function(e) {
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
		$.headerView.setTitle(commonFunctions.L('temporalOrder', LangCode));
		$.messageLabelWatch.text = commonFunctions.L('tempAlert5', LangCode);
		$.headerView.setQuitViewVisibility(true);
		
		$.headerView.setQuitViewPosition();
		if (args.reminderVersion != null && args.reminderVersion != 0) {
			currentSequence = args.reminderVersion;
		} else {
			
			var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
			currentSequence = versionsInfo.TemporalOrder;
			if (currentSequence == "") {
				versionsInfo.TemporalOrder = 2;
				
				currentSequence = 1;
			} else if (currentSequence == 1 || currentSequence == "1") {
				versionsInfo.TemporalOrder = 2;
				
			} else if (currentSequence == 2 || currentSequence == "2") {
				versionsInfo.TemporalOrder = 3;
				
			} else if (currentSequence == 3 || currentSequence == "3") {
				versionsInfo.TemporalOrder = 4;
				
			} else if (currentSequence == 4 || currentSequence == "4") {
				versionsInfo.TemporalOrder = 1;
				
			} else {
				currentSequence = 1;
				versionsInfo.TemporalOrder = 1;
				
			}
			Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);
		}
		
		var gameInfo = commonDB.getGameScore(credentials.userId);
		Ti.API.info('game is' + JSON.stringify(gameInfo));
		if (Ti.Network.online) {
			var resultParameter = {
				"UserId" : credentials.userId,
				"CTestId" : 12,
			};
			serviceManager.getDistractionSurvey(resultParameter, onDistractionSurveySuccess, onDistractionSurveyFailure);
		}
		
		for (var i = 0; i < gameInfo.length; i++) {
			if (gameInfo[i].gameID == 12) {
				gamePoints = gameInfo[i].points;
			}
		}
		gameLogic();
		startTimer();
	} catch(ex) {
		commonFunctions.handleException("temporalOrder", "open", ex);
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
		Alloy.Globals.temporalOrderSurveyArray = [];
		for (var i = 0; i < response.Surveys.length; i++) {

			if (response.Surveys[i].SurveyId != null) {
				var surveyId = response.Surveys[i].SurveyId;
				var surveyName = commonDB.getSurveyName(surveyId);

				Alloy.Globals.temporalOrderSurveyArray.push({
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
	Ti.API.info('***getSurveyListFailure****  ', JSON.stringify(e));
	commonFunctions.closeActivityIndicator();

}

function onDistractionSurveyFailure(e) {
	Ti.API.info('onDistractionSurveyFailure : ', JSON.stringify(e));

}

$.temporalOrder.addEventListener('android:back', function() {
	goBack();
});
$.headerView.on('quitButtonClick', function(e) {

	
	clearTimeout(gameTimer);
	clearTimeout(completeTimer);
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}
	if (labalTimer != null) {
		clearInterval(labalTimer);
	}
	//StatusType = 1;
	endTime = new Date().toUTCString();
	getValues();
	
});
/**
 * function for timer
 */
function startTimer() {
	var timer = counterTime;
	var minutes = 0;
	var seconds = 0;
	countDownTimer = setInterval(function() {
		if (timer == 239) {
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
			if (labalTimer != null) {
				clearInterval(labalTimer);
			}
			$.contentView.touchEnabled = false;
			endTime = new Date().toUTCString();
			getValues();
			
		}
		timer -= 1;
		counterTime = timer;
	}, 1000);
}

/**
 * Game logic
 */
function gameLogic() {
	shuffledBoxArray = shuffle(shuffledBoxArray);
	shuffledImageArray = shuffle(imageArray);
	var i = 0;

	function myLoop() {

		if (i == 0) {
			$.messageLabelWatch.text = commonFunctions.L('tempAlert5', LangCode);
			$.messageViewWatch.visible = true;
		} else {
			$.messageViewWatch.visible = false;
		}

		gameTimer = setTimeout(function() {
			Ti.API.info('i : ', i);
			if (i != 0) {
				shuffledBoxArray[i - 1].backgroundImage = "";
			}
			shuffledBoxArray[i].backgroundImage = "/images/temporalOrder/" + currentSequence + "/" + shuffledImageArray[i] + ".png";
			i++;
			if (i < 3) {
				myLoop();
			} else {
				setTimeout(function() {
					shuffledBoxArray[i - 1].backgroundImage = "";
					
					Ti.API.info('Alloy.Globals.temporalOrderSurveyArray : ', Alloy.Globals.temporalOrderSurveyArray);
					var distractionNumber = Ti.App.Properties.getString("distractionSurveyTemporal", 0);
					Ti.API.info('distractionNumber : ', distractionNumber);
					if (distractionNumber == 0) {
						if (Alloy.Globals.temporalOrderSurveyArray.length != 1) {
							Ti.App.Properties.setString('distractionSurveyTemporal', 1);
						}

					} else if (distractionNumber == Alloy.Globals.temporalOrderSurveyArray.length - 1) {
						Ti.App.Properties.setString('distractionSurveyTemporal', 0);

					} else {
						if (distractionNumber > Alloy.Globals.temporalOrderSurveyArray.length - 1) {
							Ti.App.Properties.setString('distractionSurveyTemporal', 0);
							distractionNumber = 0;
						} else {
							var numb = parseInt(distractionNumber) + 1;
							Ti.App.Properties.setString('distractionSurveyTemporal', numb);

						}

					}
					var surveyListing = Alloy.Globals.temporalOrderSurveyArray;

					

					clearInterval(countDownTimer);
					clearInterval(labalTimer);

					


					if (surveyListing.length != 0) {
						Ti.API.info('surveyListing[distractionNumber].surveyID : ', surveyListing[distractionNumber].surveyID);
						Ti.API.info('surveyListing[distractionNumber].questions : ', surveyListing[distractionNumber].questions);
						Alloy.Globals.NAVIGATION_CONTROLLER.openFullScreenWindow('syptomSurveyNew', {
							isFrom : "memoryTest",
							surveyID : surveyListing[distractionNumber].surveyID,
							surveyName : surveyListing[distractionNumber].questions
						});
					} else {
						restartGame1();
					}
					
				}, 2000);

				

			}
		}, 3000);
	};
	myLoop();

}

function restartGame1() {
	Ti.API.info('restartGame');
	startTimer();

	$.messageLabelWatch.text = commonFunctions.L('tapfirstImg', LangCode);
	$.messageViewWatch.visible = true;
	for (var j = 0; j < thumbImageArray.length; j++) {
		var imageName = j + 1;
		thumbImageArray[j].image = "/images/temporalOrder/" + currentSequence + "/thumb/" + imageName + ".png";
	};
	$.imageThumbOuter.visible = true;
}

$.restartGame = function(surveyParam) {
	try {
		Ti.API.info('restartGame');
		Ti.API.info(surveyParam);
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

		$.messageLabelWatch.text = commonFunctions.L('tapfirstImg', LangCode);
		$.messageViewWatch.visible = true;
		for (var j = 0; j < thumbImageArray.length; j++) {
			var imageName = j + 1;
			thumbImageArray[j].image = "/images/temporalOrder/" + currentSequence + "/thumb/" + imageName + ".png";
		};
		$.imageThumbOuter.visible = true;

	} catch(ex) {
		commonFunctions.handleException("simpleMemoryTask", "restartGame", ex);
	}
};
/**
 * function for back button click
 */
$.headerView.on('backButtonClick', function(e) {

	goBack();
});
function goBack(e) {
	//Ti.App.removeEventListener('getValues', getValues);
	clearTimeout(gameTimer);
	clearTimeout(completeTimer);
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}
	if (labalTimer != null) {
		clearInterval(labalTimer);
	}
	//StatusType = 1;
	endTime = new Date().toUTCString();
	getValues();
	
}

function getRandomInt(min, max) {
	try {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} catch(ex) {
		commonFunctions.handleException("nBackTest", "getRandomInt", ex);
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

function imageSelectionClick(e) {
	if (thumbClcikedImageIndex == -1) {
		return;
	}
	if (e.source.index != null) {
		//if ($.messageViewWatch.visible == true) {
		if (labalTimer != null) {
			clearInterval(labalTimer);
		}
		$.messageLabelWatch.text = commonFunctions.L('tapNxtImg', LangCode);
		$.messageViewWatch.visible = true;
		labalTimer = setTimeout(function() {
			$.messageViewWatch.visible = false;
		}, 3000);
		//}

		var indexValue = parseInt(e.source.index);
		e.source.backgroundImage = "/images/temporalOrder/" + currentSequence + "/" + thumbClcikedImageIndex + ".png";
		for (var i = 0; i < 3; i++) {
			if (e.source.index == shuffledBoxArray[i].index) {

				var selectedImage = shuffledImageArray[i];
				Ti.API.info('selectedImage : ', selectedImage);
				if (thumbClcikedImageIndex == selectedImage) {
					Ti.API.info('Write click');
					correctAnswerCount += 1;
					
				} else {
					Ti.API.info('Wrong click');
					wrongAnswerCount += 1;

					

				}

				break;
			} else {
				if (i == 2) {
					Ti.API.info('Wrong click');
					wrongAnswerCount += 1;
					
				}

			}

		};
		imagePlcedCount += 1;

		thumbClcikedImageIndex = -1;
		if (imagePlcedCount == 3) {
			if (currentSequence == 5) {
				currentSequence = currentSequence - 1;
			} else {
				currentSequence = currentSequence + 1;
			}
			imagePlcedCount = 0;
			for (var i = 0; i < boxIndexArray.length; i++) {
				boxIndexArray[i].backgroundImage = "";
			};

			

			$.imageThumbOuter.visible = false;
			stage += 1;
			
			endTime = new Date().toUTCString();
			clearTimeout(gameTimer);
			clearTimeout(completeTimer);
			if (countDownTimer != null) {
				clearInterval(countDownTimer);
			}
			if (labalTimer != null) {
				clearInterval(labalTimer);
			}
			var gameScore = Math.round((correctAnswerCount / 3) * 100);
			if (gameScore == 100) {
				points = points + 2;
			} else {
				points = points + 1;
			}
			gamePoints = gamePoints + points;
			commonDB.insertGameScore(12, gameScore, gamePoints, points);

			Ti.API.info('startTime : ', startTime, " endTime: ", endTime);
			var timeDiff = commonFunctions.getMinuteSecond(startTime, endTime);
			StatusType = 2;
			//commonFunctions.getScoreView(gameScore, points, timeDiff);

			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scoreScreen', {
				"GameID" : 12,
				"GameScore" : gameScore,
				"GameType" : 1,
				"GameName" : commonFunctions.L('temporalOrder', LangCode)

			});

		}

	}

}

Ti.App.addEventListener('getValues', getValues);
function getValues() {
	if (startTime == null || startTime == "") {
		onSaveTemporalOrderGameFailure();
		return;
	}
	if (Ti.Network.online) {
		var gameScore = Math.round((correctAnswerCount / 3) * 100);
		if (args.isBatch == true && Alloy.Globals.BATCH_ARRAY.length != 1) {
			spinWheelScore = 0;
		}
		if (spinWheelScore < 0) {
			spinWheelScore = 0;
		}
		var resultParameter = {
			"UserID" : credentials.userId,
			"CorrectAnswers" : correctAnswerCount,
			"WrongAnswers" : wrongAnswerCount,
			"StartTime" : startTime,
			"EndTime" : endTime,
			"Point" : points,
			"Score" : gameScore,
			"Version" : currentSequence,
			"StatusType" : StatusType,
			"IsNotificationGame" : notificationGame,
			"AdminBatchSchID" : args.isBatch == true ? args.testID : 0,
			"SpinWheelScore" : spinWheelScore
		};
		Ti.API.info('**** resultParameter SpinWheelScore **** = ' + resultParameter.SpinWheelScore);
		commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
		serviceManager.saveTemporalOrderGame(resultParameter, onSaveTemporalOrderGameSuccess, onSaveTemporalOrderGameFailure);
	} else {
		commonFunctions.closeActivityIndicator();
		commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode), function() {
			onSaveTemporalOrderGameFailure();

		});
		//commonFunctions.showAlert(L('noNetwork'));

	}
}

/**
 * Success api call
 */
function onSaveTemporalOrderGameSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		Ti.API.info('***SAVE CAT AND DOG NEW GAME SUCCESS  RESPONSE****  ', JSON.stringify(response));
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
				Ti.API.info('*** Destraction Survey Save Params : ' + JSON.stringify(destractSurveyParam));
				serviceManager.saveUserSurvey(destractSurveyParam, saveUserSurveySuccess, saveUserSurveyFailure);
				distructionSurveyReplay = false;
			}
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
				setTimeout(function() {
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('temporalOrder');
					var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
					if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
						parentWindow.window.refreshHomeScreen();
					}
					commonFunctions.closeActivityIndicator();
				}, 1000);
			}

			// else {
			// Ti.App.removeEventListener('getValues', getValues);
			// var diff = 0;
			// var curTime = new Date().getTime();
			// var setTime = Ti.App.Properties.getString('EnvTime', "");
			// if (setTime != "") {
			// diff = curTime - setTime;
			// }
			// if (diff == 0 || diff > 3600000) {
			// Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spaceBlockScreen', {
			// 'backDisable' : true,
			// });
			// }
			// setTimeout(function() {
			// Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
			// Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('temporalOrder');
			// var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			// if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
			// parentWindow.window.refreshHomeScreen();
			// }
			// commonFunctions.closeActivityIndicator();
			// }, 1000);
			// }

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
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('temporalOrder');
					commonFunctions.closeActivityIndicator();
					commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);
					//setTimeout(function() {

					//}, 1000);
				} else {
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('temporalOrder');
					var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
					if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
						parentWindow.window.refreshHomeScreen();
					}
					commonFunctions.closeActivityIndicator();
					if (diff == 0 || diff > 900000) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spaceBlockScreen', {
							'backDisable' : true,
						});
					}
					//setTimeout(function() {

					//}, 1000);

				}
			} else {
				setTimeout(function() {
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('temporalOrder');
					var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
					Ti.API.info('parentWindow.windowName  : ', parentWindow.windowName);
					if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
						parentWindow.window.refreshHomeScreen();
					}
					commonFunctions.closeActivityIndicator();
				}, 1000);

			}

		} else {
			setTimeout(function() {
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('temporalOrder');
				var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
				if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
					parentWindow.window.refreshHomeScreen();
				}
				commonFunctions.closeActivityIndicator();

			}, 1000);
			commonFunctions.showAlert(response.ErrorMessage);
		}

	} catch(ex) {
		commonFunctions.handleException("catanddognew", "onSaveCatAndDogNewGameSuccess", ex);
	}
}

/**
 * Failure api call
 */
function onSaveTemporalOrderGameFailure(e) {

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
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('temporalOrder');
			commonFunctions.closeActivityIndicator();
			commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);
			//setTimeout(function() {

			//}, 1000);
		} else {
			//setTimeout(function() {
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('temporalOrder');
				commonFunctions.closeActivityIndicator();
				var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
				if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
					parentWindow.window.refreshHomeScreen();
				}
			//}, 1000);

		}
	} else {

		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('temporalOrder');
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
		Ti.API.info('saveUserSurveySuccess');
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

function thumbImageClick(e) {
	if (e.source.index != null) {
		Ti.API.info('Thumb image Clicked Index : ', e.source.index);
		//if ($.messageViewWatch.visible == true) {
		if (labalTimer != null) {
			clearInterval(labalTimer);
		}
		$.messageLabelWatch.text = commonFunctions.L('tapREsBox', LangCode);
		$.messageViewWatch.visible = true;
		labalTimer = setTimeout(function() {
			$.messageViewWatch.visible = false;
		}, 3000);
		//}

		thumbClcikedImageIndex = e.source.index;

	}

}