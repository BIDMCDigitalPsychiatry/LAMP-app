// Arguments passed into this controller can be accessed via the `$.args` object directly or:
/**
 * Variable declaration
 */
var args = arguments[0] || {};
var commonFunctions = require('commonFunctions');
var commonDB = require('commonDB');
var countDownTimer = null;
var serviceManager = require('serviceManager');
var startTime = "";
var endTime = "";
var stage = 1;
var i = 0;
var gameTimer = null;
var countDownTimer = null;
var numberOfWrongAttempt = 0;
if (args.isForward === true) {
	var fileCount = 3;
} else {
	var fileCount = 2;
}
var points = 0;
var gamePoints = 0;
var tapIndex = 0;
var totalAttempt = 0;
var credentials = Alloy.Globals.getCredentials();
var soundArray = null;
var soundObject = null;
var player = null;
var playTimer = null;
var isCompleted = false;
var selectedSoundValue = "";
var correctAnswerCount = 0;
var wrongAnswerCount = 0;
var StatusType = 1;
var LangCode = Ti.App.Properties.getString('languageCode');
if (OS_IOS) {
	Titanium.Media.audioSessionCategory = Titanium.Media.AUDIO_SESSION_CATEGORY_PLAYBACK;
}

/**
 * Function for window open
 */
$.digitSpanTest.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
			}
		}
		$.levelLabel.text = commonFunctions.L('levelLbl', LangCode) + " " + '1';
		$.headerView.setQuitViewVisibility(true);
		$.headerView.setReportViewVisibility(true);
		$.headerView.setReportImage("/images/common/report_icn.png");
		$.headerView.setQuitViewPosition();
		if (args.isForward === true) {
			var titleText = commonFunctions.L('digitFWrd', LangCode);
			if (Ti.Platform.osname == "ipad") {
				$.headerView.setTitle(titleText);
			} else {
				$.headerView.setTitle(commonFunctions.trimText(titleText, 14));
			}
		} else {
			var titleText = commonFunctions.L('digitBckWrd', LangCode);
			if (Ti.Platform.osname == "ipad") {
				$.headerView.setTitle(titleText);
			} else {
				$.headerView.setTitle(commonFunctions.trimText(titleText, 15));
			}
		}
		$.messageLabel.text = commonFunctions.L('audioalert', LangCode);
		soundArray = ["0.wav", "1.wav", "2.wav", "3.wav", "4.wav", "5.wav", "6.wav", "7.wav", "8.wav", "9.wav"];
		var gameInfo = commonDB.getGameScore(credentials.userId);
		Ti.API.info('game is' + JSON.stringify(gameInfo));
		for (var i = 0; i < gameInfo.length; i++) {

			if (args.isForward === true) {
				if (gameInfo[i].gameID == 10) {
					gamePoints = gameInfo[i].points;
				}
			} else {
				if (gameInfo[i].gameID == 13) {
					gamePoints = gameInfo[i].points;
				}
			}

		}

		commonFunctions.showAlert(commonFunctions.L('soundalert', LangCode), function() {
			getsoundArray();
			startTimer();

		});

	} catch(ex) {
		commonFunctions.handleException("digitSpanTest", "open", ex);
	}
});

/**
 * Function to handle game restart
 */
function restartGame() {
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}
	if (playTimer != null) {
		clearTimeout(playTimer);
	}
	if (player != null) {
		player.stop();
		player.release();
		player = null;
	}
	startTime = "";
	endTime = "";
	stage = 1;
	i = 0;

	numberOfWrongAttempt = 0;
	if (args.isForward === true) {
		fileCount = 3;
	} else {
		fileCount = 2;
	}
	points = 0;
	gamePoints = 0;
	tapIndex = 0;
	totalAttempt = 0;

	soundArray = null;
	soundObject = null;
	player = null;
	playTimer = null;
	isCompleted = false;
	selectedSoundValue = "";
	correctAnswerCount = 0;
	wrongAnswerCount = 0;
	StatusType = 1;
	$.levelLabel.text = commonFunctions.L('levelLbl', LangCode) + " " + '1';
	if (args.isForward === true) {
		var titleText = commonFunctions.L('digitFWrd', LangCode);
		if (Ti.Platform.osname == "ipad") {
			$.headerView.setTitle(titleText);
		} else {
			$.headerView.setTitle(commonFunctions.trimText(titleText, 12));
		}
	} else {
		var titleText = commonFunctions.L('digitBckWrd', LangCode);
		if (Ti.Platform.osname == "ipad") {
			$.headerView.setTitle(titleText);
		} else {
			$.headerView.setTitle(commonFunctions.trimText(titleText, 12));
		}
	}
	Ti.App.addEventListener('getValues', getValues);
	$.messageLabel.text = commonFunctions.L('audioalert', LangCode);
	soundArray = ["0.wav", "1.wav", "2.wav", "3.wav", "4.wav", "5.wav", "6.wav", "7.wav", "8.wav", "9.wav"];
	var gameInfo = commonDB.getGameScore(credentials.userId);
	Ti.API.info('game is' + JSON.stringify(gameInfo));
	for (var i = 0; i < gameInfo.length; i++) {

		if (args.isForward === true) {
			if (gameInfo[i].gameID == 10) {
				gamePoints = gameInfo[i].points;
			}
		} else {
			if (gameInfo[i].gameID == 13) {
				gamePoints = gameInfo[i].points;
			}
		}

	}
	getsoundArray();
	startTimer();

}

/**
 * Android back button handler
 */
$.digitSpanTest.addEventListener('android:back', function() {
	goBack();
});

/**
 * Handles report image click
 */
$.headerView.on('reportButtonClick', function(e) {

	commonFunctions.sendScreenshot();
});

/**
 * Header quit button click
 */
$.headerView.on('quitButtonClick', function(e) {

	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}
	if (playTimer != null) {
		clearTimeout(playTimer);
	}
	if (player != null) {
		player.stop();
		player.release();
		player = null;
	}
	endTime = new Date().toUTCString();
	getValues();
});

/**
 * function for timer
 */
function startTimer() {
	var timer = 180;
	var minutes = 0;
	var seconds = 0;
	countDownTimer = setInterval(function() {
		if (timer == 179) {
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

			$.contentView.touchEnabled = false;
			$.messageLabel.text = commonFunctions.L('intructionLabel3', LangCode);
			$.messageView.visible = true;
			if (countDownTimer != null) {
				clearInterval(countDownTimer);
			}
			if (playTimer != null) {
				clearTimeout(playTimer);
			}
			if (player != null) {
				player.stop();
				player.release();
				player = null;
			}
			endTime = new Date().toUTCString();
			getValues();
		}
		timer -= 1;
	}, 1000);
}

/**
 * function for call
 */
function getsoundArray() {
	selectedSoundValue = "";
	$.numberView.visible = false;
	soundObject = getRandomPosition(soundArray, fileCount);
	tapIndex = 0;
	Ti.API.info('randomarray is ' + JSON.stringify(soundObject));
	Ti.API.info('fileCount : ', fileCount);
	if (fileCount <= 7) {
		$.levelLabel.text = commonFunctions.L('levelLbl', LangCode) + " " + stage;
		i = 0;
		gameLogic();
	} else {
		endTime = new Date().toUTCString();
		if (countDownTimer != null) {
			clearInterval(countDownTimer);
		}
		if (playTimer != null) {
			clearTimeout(playTimer);
		}
		if (args.isForward === true) {
			var gameScore = Math.round((5 / totalAttempt) * 100);
		} else {
			var gameScore = Math.round((6 / totalAttempt) * 100);
		}

		if (gameScore == 100) {
			points = points + 2;
		} else {
			points = points + 1;
		}
		gamePoints = gamePoints + points;
		if (args.isForward === true) {
			commonDB.insertGameScore(10, gameScore, gamePoints, points);
		} else {
			commonDB.insertGameScore(13, gameScore, gamePoints, points);
		}

		var timeDiff = commonFunctions.getMinuteSecond(startTime, endTime);
		StatusType = 2;

		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scoreScreen', {
			"GameID" : args.isForward === true ? 10 : 13,
			"GameScore" : gameScore,
			"GameType" : 1,
			"GameName" : args.isForward === true ? commonFunctions.L('digitFWrd', LangCode) : commonFunctions.L('digitBckWrd', LangCode)

		});

	}
}

/**
 * Declaration
 */
var calculateTime;
var playedTime;

/**
 * getValues event handler
 */
Ti.App.addEventListener('getValues', getValues);
function getValues() {
	Ti.API.info('getValues : ', startTime, args.isBatch, args.testID);
	if (startTime == "" || startTime == null) {
		onSaveDigitSpanGameFailure();
		return;
	}
	if (Ti.Network.online) {

		if (args.isForward === true) {
			var gameScore = Math.round((5 / totalAttempt) * 100);
		} else {
			var gameScore = Math.round((6 / totalAttempt) * 100);
		}
		if (args.isForward === true) {
			var SpanType = 1;
		} else {
			var SpanType = 2;
		}

		var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
		var spinRecords = spinInfo.lampRecords;
		var notiGameScore;
		var spinWheelScore;

		var notificationGame;
		if (args.fromNotification === true && args.isLocal != 1) {
			notificationGame = true;
			Ti.API.info('******* args.createdDate ******* = ' + args.createdDate);
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
			"Type" : SpanType,
			"CorrectAnswers" : correctAnswerCount,
			"WrongAnswers" : wrongAnswerCount,
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
		serviceManager.saveDigitSpanGame(resultParameter, onSaveDigitSpanGameSuccess, onSaveDigitSpanGameFailure);
	} else {
		commonFunctions.closeActivityIndicator();
		commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode), function() {
			onSaveDigitSpanGameFailure();

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
function onSaveDigitSpanGameSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		Ti.API.info('***SAVE DIGIT SPAN GAME SUCCESS  RESPONSE****  ', JSON.stringify(response));
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

					if (Alloy.Globals.BATCH_ARRAY[0].trim() != "C 10" && Alloy.Globals.BATCH_ARRAY[0].trim() != "C 13") {
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('digitSpanTest');
						commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

						commonFunctions.closeActivityIndicator();

					} else {
						if (Alloy.Globals.BATCH_ARRAY[0].trim() == "C 10") {
							args.isForward = true;
						} else {
							args.isForward = false;
						}
						Ti.API.info('restartGame');
						restartGame();

						commonFunctions.closeActivityIndicator();
					}

				} else {
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('digitSpanTest');
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
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('digitSpanTest');
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
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("catsanddogs", "onSaveCatAndDogGameSuccess", ex);
	}
}

/**
 * Failure api call
 */
function onSaveDigitSpanGameFailure(e) {
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

			if (Alloy.Globals.BATCH_ARRAY[0].trim() != "C 10" && Alloy.Globals.BATCH_ARRAY[0].trim() != "C 13") {
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('digitSpanTest');
				commonFunctions.closeActivityIndicator();
				commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

			} else {
				if (Alloy.Globals.BATCH_ARRAY[0].trim() == "C 10") {
					args.isForward = true;
				} else {
					args.isForward = false;
				}
				Ti.API.info('restartGame');
				restartGame();

				commonFunctions.closeActivityIndicator();
			}

		} else {
			setTimeout(function() {
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('digitSpanTest');
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
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('digitSpanTest');
			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
				parentWindow.window.refreshHomeScreen();
			}
			if (parentWindow != null && parentWindow.windowName === "preventIntroScreen") {
				parentWindow.window.refreshPreventScreen();
			}
		}, 1000);
	}
	commonFunctions.closeActivityIndicator();
}

/**
 * function for game logic
 */
function gameLogic() {
	if (i < fileCount) {
		$.boxView.touchEnabled = false;
		$.boxView.visible = false;
		$.messageLabel.text = commonFunctions.L('audioalert', LangCode);
		if (playTimer != null) {
			clearTimeout(playTimer);
		}
		playTimer = setTimeout(function() {
			loop(soundObject);
		}, 2000);
	} else {
		$.boxView.touchEnabled = true;
		$.boxView.visible = true;
		$.selectedDigitImage.image = '/images/digitSpan/speaker-disable.png';
		if (args.isForward === true) {
			$.messageLabel.text = commonFunctions.L('digitalert', LangCode);
		} else {
			$.messageLabel.text = commonFunctions.L('digitReversealert', LangCode);
		}

	}
};

/**
 * Loop handler
 */
function loop(soundObject) {
	var audioUrl = "/general/audio/" + soundObject[i].sound;
	Ti.API.info('url is  is' + audioUrl);

	player = Ti.Media.createSound({
		url : audioUrl,
		preload : true,
		volume : 1.0
	});

	player.play();
	i++;
	player.addEventListener('complete', function() {
		setTimeout(function() {
			player.stop();
			player.release();
			player = null;
			Ti.API.info('complete Audio');
			gameLogic();
		}, 500);

	});
}

/**
 * function to randomely select the sound file
 */
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
				sound : arr[randomnumber],
				index : randomnumber
			});
			indexValue = indexValue + 1;
		}
		return result;
	} catch(ex) {
		commonFunctions.handleException("trailsB", "getRandomPosition", ex);
	}
}

/**
 * on box selection click
 */
function boxSelectionClick(e) {
	if ($.boxView.touchEnabled == false) {
		Ti.API.info('boxSelectionClick return');
		return;
	}
	Ti.API.info('boxSelectionClick : ', JSON.stringify(e));
	var indexValue = parseInt(e.source.index);
	e.source.backgroundColor = "#ffffff";
	e.source.opacity = "0.2";
	var sound = soundObject[tapIndex].sound.split('.');
	if (args.isForward === true) {
		selectedSoundValue = selectedSoundValue + sound[0];
	} else {
		selectedSoundValue = sound[0] + selectedSoundValue;
	}

	$.numberView.visible = true;
	$.numberLabel.text = $.numberLabel.text + indexValue.toString();
	tapIndex = tapIndex + 1;
	if (soundObject.length == tapIndex) {
		i = 0;
		Ti.API.info('label value' + $.numberLabel.text);
		Ti.API.info('soundvalue' + selectedSoundValue);
		$.boxView.touchEnabled == false;
		$.boxView.visible = false;
		if ($.numberLabel.text == selectedSoundValue) {
			numberOfWrongAttempt = 0;
			Ti.API.info('correct');
			totalAttempt += 1;
			fileCount = fileCount + 1;
			$.selectedDigitImage.image = '/images/digitSpan/speaker-enable.png';
			$.numberLabel.text = "";
			stage = stage + 1;
			correctAnswerCount = correctAnswerCount + 1;
			getsoundArray();
		} else {
			numberOfWrongAttempt = numberOfWrongAttempt + 1;
			if (numberOfWrongAttempt == 2) {
				goBack();
				return;
			}
			Ti.API.info('Incorrect');
			totalAttempt += 1;
			$.selectedDigitImage.image = '/images/digitSpan/speaker-enable.png';
			$.numberLabel.text = "";
			wrongAnswerCount = wrongAnswerCount + 1;
			getsoundArray();
		}
	}
	setTimeout(function() {
		e.source.backgroundColor = "transparent";
		e.source.opacity = "1";
	}, 1000);

}

/**
 * on back button click
 */
$.headerView.on('backButtonClick', function(e) {

	goBack();
});

/**
 * goBack function handler
 */
function goBack(e) {
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}
	if (playTimer != null) {
		clearTimeout(playTimer);
	}
	if (player != null) {
		player.stop();
		player.release();
		player = null;
	}

	endTime = new Date().toUTCString();
	getValues();

}
