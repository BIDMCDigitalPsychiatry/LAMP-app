// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = arguments[0] || {};
var storeSqueBoxes = null;
var storeOuterBoxes = null;
var stage = 1;
var level = 1;
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
var type;
var points = 0;
var gamePoints = 0;
var imageNumber = 0;
var isCat = false;
var nextClickTimout = null;
var isBackPress = false;
var StatusType = 1;
var LangCode = Ti.App.Properties.getString('languageCode');
var gameResultArray = [];
var startTimeDiffrnce = "";
var endTimeDiffrnce = "";
var correctCount = 0;
var wrongCount = 0;

var animateTop = Ti.UI.createAnimation({
	top : 10,
	curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
	duration : 250
});
var animateBottom = Ti.UI.createAnimation({
	top : 80,
	curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
	duration : 250
});

var animateBottomTab = Ti.UI.createAnimation({
	top : 80,
	curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
	duration : 250
});

/**
 * Screen open fucntion
 */
$.catAndDogGameNew.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
			}
		}
		$.headerView.setTitle(commonFunctions.L('catdog', LangCode));
		$.headerView.setQuitViewVisibility(true);
		$.headerView.setQuitViewPosition();
		storeOuterBoxes = [$.index1, $.index2, $.index3, $.index4, $.index5, $.index6, $.index7, $.index8, $.index9, $.index10];
		storeSqueBoxes = [$.box1, $.box2, $.box3, $.box4, $.box5, $.box6, $.box7, $.box8, $.box9, $.box10];
		var gameInfo = commonDB.getGameScore(credentials.userId);
		for (var i = 0; i < gameInfo.length; i++) {
			if (gameInfo[i].gameID == 11) {
				gamePoints = gameInfo[i].points;
			}
		}
		commonFunctions.showAlert(commonFunctions.L('dogBox', LangCode), function() {
			gameLogic();
			startTimer();
		});

	} catch(ex) {
		commonFunctions.handleException("catAndDogGameNew", "open", ex);
	}
});

/**
 * Android back buton click
 */
$.catAndDogGameNew.addEventListener('android:back', function() {
	goBack();
});
$.headerView.on('backButtonClick', function(e) {

	goBack();
});
$.headerView.on('reportButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
function goBack(e) {
	isBackPress = true;

	clearTimeout(gameTimer);
	clearTimeout(completeTimer);
	clearTimeout(nextClickTimout);
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}
	endTime = new Date().toUTCString();
	getValues();
}

/**
 * Timer start function
 */
function startTimer() {
	var timer = 360;
	var minutes = 0;
	var seconds = 0;
	countDownTimer = setInterval(function() {
		if (timer == 359) {
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

/**
 * Game logic
 */
function gameLogic() {
	clearTimeout(nextClickTimout);
	arrayBoxes = [];
	selectedViewArray = [];
	tapIndex = 0;
	var totImageNumb = imageNumber + 1;
	if (level == 2 || level == 3) {
		totImageNumb = imageNumber + 3;
	}

	arrayBoxes = getRandomPosition(storeOuterBoxes, totImageNumb);
	imageNumber += 1;

	var i = 0;
	gameTimer = setTimeout(function() {
		$.boxOuter.animate(animateTop);
	}, 800);
	nextLevelEnable = false;
	userActionEnable = false;
	if (level == 1) {
		var numberOfCorrectImage = arrayBoxes.length;
	} else if (level == 2) {
		var numberOfCorrectImage = arrayBoxes.length - 3;
	} else if (level == 3) {
		var numberOfCorrectImage = arrayBoxes.length - 3;
	}

	for (var i = 0; i < arrayBoxes.length; i++) {
		if (isCat == true) {
			if (i < numberOfCorrectImage) {
				arrayBoxes[i].box.image = "/images/catDogs/cat.png";
			} else {
				arrayBoxes[i].box.image = "/images/catDogs/dog.png";
			}

		} else {

			if (i < numberOfCorrectImage) {
				arrayBoxes[i].box.image = "/images/catDogs/dog.png";
			} else {
				arrayBoxes[i].box.image = "/images/catDogs/cat.png";
			}

		}
		arrayBoxes[i].box.visible = true;

	};

	completeTimer = setTimeout(function() {
		var osname = Ti.Platform.osname;

		if (commonFunctions.getIsTablet()) {
			$.boxOuter.animate(animateBottomTab);
		} else {

			$.boxOuter.animate(animateBottom);
		}

		for (var i = 0; i < arrayBoxes.length; i++) {
			arrayBoxes[i].box.visible = false;
		};
		nextClickTimout = setTimeout(function() {
			onNextClick(true);
		}, 6000);

		userActionEnable = true;
	}, 1800);

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
		commonFunctions.handleException("catAndDogGameNew", "getRandomPosition", ex);
	}
}

/**
 * Box selection clcik
 */
function boxSelectionClick(e) {
	startTimeDiffrnce = new Date().getTime();
	if (userActionEnable == false) {
		return;
	}

	if (e.source.index != null) {

		clearTimeout(nextClickTimout);
		nextClickTimout = setTimeout(function() {
			onNextClick(true);
		}, 6000);

		var indexValue = parseInt(e.source.index);
		if (storeOuterBoxes[indexValue - 1].backgroundColor == "#fe3556" || storeOuterBoxes[indexValue - 1].backgroundColor == "#03d981") {
			return;
		}
		if (level == 1) {
			var numberOfCorrectImage = arrayBoxes.length;
		} else if (level == 2) {
			var numberOfCorrectImage = arrayBoxes.length - 3;
		} else if (level == 3) {
			var numberOfCorrectImage = arrayBoxes.length - 3;
		}
		var isCorrect = false;
		for (var i = 0; i < numberOfCorrectImage; i++) {
			if (indexValue == arrayBoxes[i].index) {
				isCorrect = true;
				break;
			}
		};

		if (isCorrect == true) {
			storeSqueBoxes[indexValue - 1].backgroundColor = "#03d981";
			correctAnswerCount += 1;
			correctCount += 1;
			var answerMark = Ti.UI.createImageView({
				width : Titanium.UI.SIZE,
				height : Titanium.UI.SIZE,
				image : "/images/spatialSpan/tick_icon.png"

			});
			selectedViewArray.push({
				mark : answerMark,
				indexValue : indexValue - 1
			});
			storeSqueBoxes[indexValue - 1].add(answerMark);

		} else {
			storeSqueBoxes[indexValue - 1].backgroundColor = "#fe3556";
			wrongAnswerCount += 1;
			wrongCount += 1;
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

		}

		tapIndex += 1;
		if (numberOfCorrectImage == tapIndex) {
			userActionEnable = false;
			nextLevelEnable = true;
			clearTimeout(nextClickTimout);
			nextClickTimout = setTimeout(function() {
				onNextClick(false);
			}, 1000);

		}

	}

}

function onNextClick(isAutomatic) {
	if (isBackPress == true) {
		clearTimeout(gameTimer);
		clearTimeout(completeTimer);
		clearTimeout(nextClickTimout);
		if (countDownTimer != null) {
			clearInterval(countDownTimer);
		}
		return;

	}
	if (isAutomatic != true) {
		if (nextLevelEnable == false) {
			if (userActionEnable == true) {
				if (level == 1) {
					var numberOfCorrectImage = arrayBoxes.length;
				} else if (level == 2) {
					var numberOfCorrectImage = arrayBoxes.length - 3;
				} else if (level == 3) {
					var numberOfCorrectImage = arrayBoxes.length - 3;
				}

				if (isCat == true) {
					commonFunctions.showAlert(commonFunctions.L('selectThe', LangCode) + numberOfCorrectImage + commonFunctions.L('imgCatBox', LangCode));
				} else {
					commonFunctions.showAlert(commonFunctions.L('selectThe', LangCode) + numberOfCorrectImage + commonFunctions.L('imgDogBox', LangCode));
				}
			}

			return;
		}
	}
	clearTimeout(nextClickTimout);
	for (var i = 0; i < selectedViewArray.length; i++) {
		storeSqueBoxes[selectedViewArray[i].indexValue].remove(selectedViewArray[i].mark);
		storeSqueBoxes[selectedViewArray[i].indexValue].backgroundColor = "#ffffff";

	};
	var compareStage = 7;
	if (level == 2 || level == 3) {
		compareStage = 4;
	}
	stage += 1;
	if (stage != compareStage) {
		gameLogic();
	} else {
		endTimeDiffrnce = new Date().getTime();
		var TimeTaken = (endTimeDiffrnce - startTimeDiffrnce) / 1000;
		gameResultArray.push({
			"CorrectAnswer" : correctCount,
			"WrongAnswer" : wrongCount,
			"TimeTaken" : TimeTaken
		});
		if (level < 3) {
			correctCount = 0;
			wrongCount = 0;
			endTimeDiffrnce = "";
			startTimeDiffrnce = "";
			level += 1;
			stage = 1;
			if (level == 2) {
				imageNumber = 3;
			} else if (level == 3) {
				isCat = true;
				imageNumber = 3;
			}

			if (level == 2) {
				commonFunctions.showAlert(commonFunctions.L('continueDogBox', LangCode), function() {
					gameLogic();
				});
			} else if (level == 3) {
				commonFunctions.showAlert(commonFunctions.L('continueCatBox', LangCode), function() {
					gameLogic();
				});
			}

			return;

		}
		clearTimeout(gameTimer);
		clearTimeout(completeTimer);
		clearTimeout(nextClickTimout);

		endTime = new Date().toUTCString();
		if (countDownTimer != null) {
			clearInterval(countDownTimer);
		}

		var gameScore = Math.round((correctAnswerCount / 45) * 100);
		if (gameScore == 100) {
			points = points + 2;
		} else {
			points = points + 1;
		}
		gamePoints = gamePoints + points;
		commonDB.insertGameScore(11, gameScore, gamePoints, points);

		var timeDiff = commonFunctions.getMinuteSecond(startTime, endTime);
		StatusType = 2;

		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scoreScreen', {
			"GameID" : 11,
			"GameScore" : gameScore,
			"GameType" : 2,
			"GameName" : commonFunctions.L('catdog', LangCode)

		});

	}
}

var calculateTime;
var playedTime;
Ti.App.addEventListener('getValues', getValues);
function getValues() {
	if (startTime == null || startTime == "") {
		onSaveCatAndDogNewGameFailure();
		return;
	}
	if (Ti.Network.online) {
		var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
		var spinRecords = spinInfo.lampRecords;
		var notiGameScore;
		var spinWheelScore;

		var gameScore = Math.round((correctAnswerCount / 45) * 100);
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
			"CorrectAnswers" : correctAnswerCount,
			"WrongAnswers" : wrongAnswerCount,
			"StartTime" : startTime,
			"EndTime" : endTime,
			"Point" : points,
			"Score" : gameScore,
			"StatusType" : StatusType,
			"IsNotificationGame" : notificationGame,
			"AdminBatchSchID" : args.isBatch == true ? args.testID : 0,
			"SpinWheelScore" : spinWheelScore,
			"GameLevelDetailList" : gameResultArray
		};
		commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
		serviceManager.saveCatAndDogNewGame(resultParameter, onSaveCatAndDogNewGameSuccess, onSaveCatAndDogNewGameFailure);
	} else {
		commonFunctions.closeActivityIndicator();
		commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode), function() {
			onSaveCatAndDogNewGameFailure();

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
function onSaveCatAndDogNewGameSuccess(e) {
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
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('catAndDogGameNew');
					commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

					commonFunctions.closeActivityIndicator();

				} else {
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('catAndDogGameNew');
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
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('catAndDogGameNew');
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
		commonFunctions.handleException("catanddognew", "onSaveCatAndDogNewGameSuccess", ex);
	}
}

/**
 * Failure api call
 */
function onSaveCatAndDogNewGameFailure(e) {
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
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('catAndDogGameNew');
			commonFunctions.closeActivityIndicator();
			commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);
		} else {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('catAndDogGameNew');
			commonFunctions.closeActivityIndicator();
			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
				parentWindow.window.refreshHomeScreen();
			}
		}
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('catAndDogGameNew');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
			parentWindow.window.refreshHomeScreen();
		}
	}
	commonFunctions.closeActivityIndicator();
}

$.headerView.on('quitButtonClick', function(e) {
	isBackPress = true;
	clearTimeout(gameTimer);
	clearTimeout(completeTimer);
	clearTimeout(nextClickTimout);
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}
	endTime = new Date().toUTCString();
	getValues();

});
