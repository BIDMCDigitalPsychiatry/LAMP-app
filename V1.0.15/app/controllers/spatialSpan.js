// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = arguments[0] || {};
var storeSqueBoxes = null;
var stage = 1;
var gameTimer = null;
var completeTimer = null;
var arrayBoxes = [];
var userActionEnable = false;
var tapIndex = 0;
var nextLevelEnable = false;
var selectedViewArray = [];
var commonFunctions = require('commonFunctions');
var commonDB = require('commonDB');
var serviceManager = require('serviceManager');
var startTime = "";
var endTime = "";
var credentials = Alloy.Globals.getCredentials();
var correctAnswerCount = 0;
var wrongAnswerCount = 0;
var countDownTimer = null;
var labalTimer = null;
var type;
var points = 0;
var gamePoints = 0;
var numberOfwrongStanges = 0;
var isAnyWrong = false;
var TotalStages = 0;
var StatusType = 1;
var boxesArray = [];
var startTimeDiffrnce = "";
var endTimeDiffrnce = "";
var LangCode = Ti.App.Properties.getString('languageCode');
var boxesArrayComplete = [];
if (args.isForward === true) {
	type = 1;
} else {
	type = 2;
}
/**
 * Open Window.
 */
$.spatialSpan.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
			}
		}
		$.spatialMsgLbl.text = commonFunctions.L('tempAlert7', LangCode);
		$.headerView.setQuitViewVisibility(true);

		$.headerView.setQuitViewPosition();
		$.levelLabel.text = commonFunctions.L('levelLbl', LangCode) + " " + "1";
		if (args.isForward === true) {
			var titleText = commonFunctions.L('spatialFrwd', LangCode);

			$.headerView.setTitle(titleText);

		} else {
			var titleText = commonFunctions.L('spatialBckwrd', LangCode);

			$.headerView.setTitle(titleText);

		}
		$.nextButton.text = commonFunctions.L('nxtLbl', LangCode);
		$.messageLabel.text = commonFunctions.L('SpatialSpanMessage1', LangCode);
		storeSqueBoxes = [$.index1, $.index2, $.index3, $.index4, $.index5, $.index6, $.index7, $.index8, $.index9, $.index10, $.index11, $.index12, $.index13, $.index14, $.index15, $.index16];
		var gameInfo = commonDB.getGameScore(credentials.userId);
		Ti.API.info('game is' + JSON.stringify(gameInfo));
		for (var i = 0; i < gameInfo.length; i++) {
			if (args.isForward == false) {
				if (gameInfo[i].gameID == 4) {
					gamePoints = gameInfo[i].points;
				}
			} else {
				if (gameInfo[i].gameID == 3) {
					gamePoints = gameInfo[i].points;
				}
			}

		}
		gameLogic();
		startTimer();
		startTimeDiffrnce = new Date().getTime();
	} catch(ex) {
		commonFunctions.handleException("spatialSpan", "open", ex);
	}
});
function restartGame() {
	correctAnswerCount = 0;
	wrongAnswerCount = 0; type;
	points = 0;
	gamePoints = 0;
	numberOfwrongStanges = 0;
	isAnyWrong = false;
	TotalStages = 0;
	StatusType = 1;
	boxesArray = [];
	stage = 1;
	selectedViewArray = [];
	storeSqueBoxes = null;
	startTime = "";
	endTime = "";
	userActionEnable = false;
	tapIndex = 0;
	nextLevelEnable = false;
	startTimeDiffrnce = "";
	endTimeDiffrnce = "";
	boxesArrayComplete = [];
	Ti.App.addEventListener('getValues', getValues);
	if (args.isForward === true) {
		type = 1;
	} else {
		type = 2;
	}
	clearTimeout(gameTimer);
	clearTimeout(completeTimer);

	if (countDownTimer != null) {
		clearInterval(countDownTimer);
		clearInterval(labalTimer);

	}
	$.levelLabel.text = commonFunctions.L('levelLbl', LangCode) + " " + "1";
	$.messageLabel.text = commonFunctions.L('SpatialSpanMessage1', LangCode);
	storeSqueBoxes = [$.index1, $.index2, $.index3, $.index4, $.index5, $.index6, $.index7, $.index8, $.index9, $.index10, $.index11, $.index12, $.index13, $.index14, $.index15, $.index16];
	var gameInfo = commonDB.getGameScore(credentials.userId);
	Ti.API.info('game is' + JSON.stringify(gameInfo));
	for (var i = 0; i < gameInfo.length; i++) {
		if (args.isForward == false) {
			if (gameInfo[i].gameID == 4) {
				gamePoints = gameInfo[i].points;
			}
		} else {
			if (gameInfo[i].gameID == 3) {
				gamePoints = gameInfo[i].points;
			}
		}

	}
	gameLogic();
	startTimer();
	startTimeDiffrnce = new Date().getTime();
}

$.spatialSpan.addEventListener('android:back', function() {
	goBack();
});
$.headerView.on('backButtonClick', function(e) {

	goBack();
});
$.headerView.on('reportButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
$.headerView.on('quitButtonClick', function(e) {

	clearTimeout(completeTimer);

	if (countDownTimer != null) {
		clearInterval(countDownTimer);
		clearInterval(labalTimer);

	}
	endTime = new Date().toUTCString();

	getValues();

});
function goBack(e) {
	clearTimeout(gameTimer);
	clearTimeout(completeTimer);

	if (countDownTimer != null) {
		clearInterval(countDownTimer);
		clearInterval(labalTimer);

	}
	endTime = new Date().toUTCString();

	getValues();

}

function startTimer() {
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
			$.contentView.touchEnabled = false;
			$.messageLabel.text = commonFunctions.L('intructionLabel3', LangCode);
			$.messageView.visible = true;
			endTime = new Date().toUTCString();
			getValues();

		}
		timer -= 1;
	}, 1000);
}

function gameLogic() {
	$.levelLabel.text = commonFunctions.L('levelLbl', LangCode) + " " + stage;
	arrayBoxes = [];
	selectedViewArray = [];
	$.nextButton.visible = false;

	tapIndex = 0;
	arrayBoxes = getRandomPosition(storeSqueBoxes, stage + 1);
	if (args.isForward == false) {
		tapIndex = stage;
	}
	var i = 0;
	nextLevelEnable = false;

	if (arrayBoxes.length != 0) {
		function myLoop() {
			userActionEnable = false;
			if (i == 0) {
				$.messageLabelWatch.text = commonFunctions.L('tempAlert6', LangCode);
				$.messageViewWatch.visible = true;
				$.spatialMessage.visible = true;
				$.spatialMsgLbl.text = commonFunctions.L('tempAlert7', LangCode);
			} else {
				$.messageViewWatch.visible = false;
			}

			gameTimer = setTimeout(function() {
				if (i != 0) {
					arrayBoxes[i - 1].box.backgroundColor = "#ffffff";
				}
				arrayBoxes[i].box.backgroundColor = "#03d981";
				i++;
				if (i < arrayBoxes.length) {
					myLoop();
				} else {
					completeTimer = setTimeout(function() {
						arrayBoxes[i - 1].box.backgroundColor = "#ffffff";
						userActionEnable = true;
						$.messageLabelWatch.text = commonFunctions.L('goLbl', LangCode);
						$.spatialMessage.visible = false;
						$.messageViewWatch.visible = true;
						labalTimer = setTimeout(function() {
							$.messageViewWatch.visible = false;
						}, 1500);

						if (stage == 1) {
							if (args.isForward == false) {
								$.messageLabel.text = commonFunctions.L('SpatialSpanMessage3', LangCode);
							} else {
								$.messageLabel.text = commonFunctions.L('SpatialSpanMessage2', LangCode);
							}
						}

					}, 2000);
				}
			}, 2000);
		};
		myLoop();

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
				box : arr[randomnumber],
				index : randomnumber + 1
			});
			indexValue = indexValue + 1;

		}

		return result;
	} catch(ex) {
		commonFunctions.handleException("trailsB", "getRandomPosition", ex);
	}
}

function boxSelectionClick(e) {

	if (userActionEnable == false) {
		return;
	}

	$.messageView.visible = false;
	if (e.source.index != null) {
		var indexValue = parseInt(e.source.index);
		if (storeSqueBoxes[indexValue - 1].backgroundColor == "#fe3556" || storeSqueBoxes[indexValue - 1].backgroundColor == "#03d981") {

			return;
		}
		Ti.API.info('indexValue : ', indexValue, arrayBoxes[tapIndex].indexValue);
		if (indexValue == arrayBoxes[tapIndex].index) {
			var touchStatus = true;
			arrayBoxes[tapIndex].box.backgroundColor = "#03d981";
			correctAnswerCount += 1;
			var answerMark = Ti.UI.createImageView({
				width : Titanium.UI.SIZE,
				height : Titanium.UI.SIZE,
				image : "/images/spatialSpan/tick_icon.png"

			});
			selectedViewArray.push({
				mark : answerMark,
				indexValue : indexValue - 1
			});
			arrayBoxes[tapIndex].box.add(answerMark);
			endTimeDiffrnce = new Date().getTime();
		} else {
			var touchStatus = false;
			storeSqueBoxes[indexValue - 1].backgroundColor = "#fe3556";
			wrongAnswerCount += 1;
			var answerMark = Ti.UI.createImageView({
				width : Titanium.UI.SIZE,
				height : Titanium.UI.SIZE,
				image : "/images/spatialSpan/wrong_icon.png"

			});
			selectedViewArray.push({
				mark : answerMark,
				indexValue : indexValue - 1
			});
			storeSqueBoxes[indexValue - 1].add(answerMark);
			isAnyWrong = true;
			endTimeDiffrnce = new Date().getTime();
		}
		var TimeTaken = (endTimeDiffrnce - startTimeDiffrnce) / 1000;

		boxesArray.push({
			"GameIndex" : indexValue,
			"TimeTaken" : TimeTaken,
			"Status" : touchStatus,
			"Level" : stage
		});
	}
	if (args.isForward == false) {
		if (tapIndex == 0) {
			$.nextButton.visible = true;

			userActionEnable = false;
			nextLevelEnable = true;
		}
		tapIndex -= 1;
	} else {
		tapIndex += 1;
		if (arrayBoxes.length == tapIndex) {
			$.nextButton.visible = true;

			userActionEnable = false;
			nextLevelEnable = true;
		}
	}
	startTimeDiffrnce = endTimeDiffrnce;

}

function onNextClick(e) {

	if (nextLevelEnable == false) {
		return;
	}
	for (var i = 0; i < selectedViewArray.length; i++) {
		storeSqueBoxes[selectedViewArray[i].indexValue].remove(selectedViewArray[i].mark);
		storeSqueBoxes[selectedViewArray[i].indexValue].backgroundColor = "#ffffff";

	};

	TotalStages = TotalStages + 1;
	if (isAnyWrong == false) {
		numberOfwrongStanges = 0;
		stage += 1;

	} else {
		isAnyWrong = false;
		numberOfwrongStanges = numberOfwrongStanges + 1;

	}
	if (numberOfwrongStanges >= 2) {
		goBack();
		return;
	}

	if (stage < 6) {
		if (boxesArray.length != 0) {
			boxesArrayComplete.push({
				"Boxes" : boxesArray
			});
			boxesArray = [];
		}
		gameLogic();
	} else {
		if (boxesArray.length != 0) {
			boxesArrayComplete.push({
				"Boxes" : boxesArray
			});
			boxesArray = [];
		}
		endTime = new Date().toUTCString();
		clearTimeout(gameTimer);
		clearTimeout(completeTimer);

		if (countDownTimer != null) {
			clearInterval(countDownTimer);
			clearInterval(labalTimer);
		}
		var gameScore = Math.round((5 / TotalStages) * 100);
		if (gameScore == 100) {
			points = points + 2;
		} else {
			points = points + 1;
		}
		gamePoints = gamePoints + points;
		if (args.isForward == false) {
			commonDB.insertGameScore(4, gameScore, gamePoints, points);
		} else {
			commonDB.insertGameScore(3, gameScore, gamePoints, points);
		}

		var timeDiff = commonFunctions.getMinuteSecond(startTime, endTime);
		StatusType = 2;
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scoreScreen', {
			"GameID" : args.isForward == false ? 4 : 3,
			"GameScore" : gameScore,
			"GameType" : 1,
			"GameName" : args.isForward == false ? commonFunctions.L('spatialBckwrd', LangCode) : commonFunctions.L('spatialFrwd', LangCode)

		});

	}
}

var calculateTime;
var playedTime;
Ti.App.addEventListener('getValues', getValues);
function getValues() {

	if (startTime == null || startTime == "") {
		onSaveSpatialSpanGameFailure();
		return;
	}
	if (Ti.Network.online) {
		var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
		var spinRecords = spinInfo.lampRecords;
		var notiGameScore;
		var spinWheelScore;

		var gameScore = Math.round((5 / TotalStages) * 100);
		var wrongAnswer = 5 - correctAnswerCount;

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
			"Type" : type,
			"CorrectAnswers" : correctAnswerCount,
			"WrongAnswers" : wrongAnswerCount,
			"StartTime" : startTime,
			"EndTime" : endTime,
			"Point" : points,
			"Score" : gameScore,
			"StatusType" : StatusType,
			"BoxList" : boxesArrayComplete,
			"IsNotificationGame" : notificationGame,
			"AdminBatchSchID" : args.isBatch == true ? args.testID : 0,
			"SpinWheelScore" : spinWheelScore
		};

		commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
		serviceManager.saveSpatialSpanGame(resultParameter, onSaveSpatialSpanGameSuccess, onSaveSpatialSpanGameFailure);
	} else {
		commonFunctions.closeActivityIndicator();
		commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode), function() {
			onSaveSpatialSpanGameFailure();

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
function onSaveSpatialSpanGameSuccess(e) {
	try {
		var response = JSON.parse(e.data);

		if (response.ErrorCode == 0) {
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
				var surveyName = "";
				Alloy.Globals.BATCH_ARRAY = Alloy.Globals.BATCH_ARRAY.splice(1, Alloy.Globals.BATCH_ARRAY.length);
				if (Alloy.Globals.BATCH_ARRAY.length != 0) {

					Ti.API.info('Alloy.Globals.BATCH_ARRAY in nback', Alloy.Globals.BATCH_ARRAY);
					var surveyId = Alloy.Globals.BATCH_ARRAY[0].trim().split(" ");
					if (surveyId[0] == "S") {
						surveyName = commonDB.getSurveyName(surveyId[1]);
					}

					if (Alloy.Globals.BATCH_ARRAY[0].trim() != "C 3" && Alloy.Globals.BATCH_ARRAY[0].trim() != "C 4") {
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('spatialSpan');
						commonFunctions.closeActivityIndicator();
						commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

					} else {
						if (Alloy.Globals.BATCH_ARRAY[0].trim() == "C 3") {
							args.isForward = true;
						} else {
							args.isForward = false;
						}

						restartGame();

						commonFunctions.closeActivityIndicator();
					}

				} else {
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('spatialSpan');

					commonFunctions.closeActivityIndicator();
					var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
					if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
						parentWindow.window.refreshHomeScreen();
					}

					if (parentWindow != null && parentWindow.windowName === "preventIntroScreen") {
						parentWindow.window.refreshPreventScreen();
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
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('spatialSpan');

					commonFunctions.closeActivityIndicator();
					var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
					if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
						parentWindow.window.refreshHomeScreen();
					}

					if (parentWindow != null && parentWindow.windowName === "preventIntroScreen") {
						parentWindow.window.refreshPreventScreen();
					}

				}, 1000);

			}
		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}

	} catch(ex) {
		commonFunctions.handleException("SPATIALSPAN", "onSaveSpatialSpanGameSuccess", ex);
	}
}

/**
 * Failure api call
 */
function onSaveSpatialSpanGameFailure(e) {
	Ti.App.removeEventListener('getValues', getValues);
	if (args.isBatch == true) {
		var surveyName = "";
		Alloy.Globals.BATCH_ARRAY = Alloy.Globals.BATCH_ARRAY.splice(1, Alloy.Globals.BATCH_ARRAY.length);
		if (Alloy.Globals.BATCH_ARRAY.length != 0) {

			var surveyId = Alloy.Globals.BATCH_ARRAY[0].trim().split(" ");
			if (surveyId[0] == "S") {
				surveyName = commonDB.getSurveyName(surveyId[1]);
			}

			if (Alloy.Globals.BATCH_ARRAY[0].trim() != "C 3" && Alloy.Globals.BATCH_ARRAY[0].trim() != "C 4") {
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('spatialSpan');
				commonFunctions.closeActivityIndicator();
				commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

			} else {
				if (Alloy.Globals.BATCH_ARRAY[0].trim() == "C 3") {
					args.isForward = true;
				} else {
					args.isForward = false;
				}

				restartGame();

				commonFunctions.closeActivityIndicator();
			}

		} else {
			setTimeout(function() {
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('spatialSpan');
				var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
				if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
					parentWindow.window.refreshHomeScreen();
				}

				if (parentWindow != null && parentWindow.windowName === "preventIntroScreen") {
					parentWindow.window.refreshPreventScreen();
				}

				commonFunctions.closeActivityIndicator();
			}, 1000);

		}
	} else {

		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('spatialSpan');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
			parentWindow.window.refreshHomeScreen();
		}

		if (parentWindow != null && parentWindow.windowName === "preventIntroScreen") {
			parentWindow.window.refreshPreventScreen();
		}
	}
	commonFunctions.closeActivityIndicator();
}
