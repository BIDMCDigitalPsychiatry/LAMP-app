// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
/**
 * Variable declaration
 */
var memoryTimer = null;
var imageIndexArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
//var boxIndexArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var boxIndexArray = [$.index1, $.index2, $.index3, $.index4, $.index5, $.index6, $.index7, $.index8, $.index9];
var boxIndexArraynotShuffle = [$.index1, $.index2, $.index3, $.index4, $.index5, $.index6, $.index7, $.index8, $.index9];
var currentImageIndex = 0;
var selectedImageArray = [];
var selectedViewArray = [];
var commonFunctions = require('commonFunctions');
var commonDB = require('commonDB');
var correctImagePosition = 0;
var selectedImagePosition = 0;
var correctAnswerCount = 0;
var tapIndex = 0;
var correctAnswerView;
var wrongAnswerView;
var countDownTimer = null;
var serviceManager = require('serviceManager');
var startTime = "";
var endTime = "";
var credentials = Alloy.Globals.getCredentials();
var imageCount = 3;
var wrongAnswercount = 0;
var isWrong = 0;
var attemptCount = 0;
var points = 0;
var gamePoints = 0;
var disableClick = false;
/**
 * function for screen open
 */
$.catAndDogGame.addEventListener("open", function(e) {
	try {
		var gameInfo = commonDB.getGameScore(credentials.userId);
		Ti.API.info('game is' + JSON.stringify(gameInfo));
		for (var i = 0; i < gameInfo.length; i++) {
			if (gameInfo[i].gameID == 7) {
				gamePoints = gameInfo[i].points;
			}
		}
		gameLogic();
		startTimer();

	} catch(ex) {
		commonFunctions.handleException("catAndDogGame", "open", ex);
	}
});
$.catAndDogGame.addEventListener('android:back', function() {
	goBack();
});
/***
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});

function gameLogic() {
	boxIndexArray = [$.index1, $.index2, $.index3, $.index4, $.index5, $.index6, $.index7, $.index8, $.index9];
	boxIndexArraynotShuffle = [$.index1, $.index2, $.index3, $.index4, $.index5, $.index6, $.index7, $.index8, $.index9];
	if (imageCount <= 9) {
		$.messageLabel.text = L('CatandDogMessage1');
		selectedImageArray = [];
		for (var i = 0; i < imageIndexArray.length; i++) {
			selectedImageArray.push({
				imageIndex : imageIndexArray[i],
				index : i + 1
			});
		};
		selectedImageArray = shuffle(selectedImageArray);
		Ti.API.info('selectedImageArray : ', selectedImageArray);
		boxIndexArray = shuffle(boxIndexArray);
		Ti.API.info('currentImageIndex : ', currentImageIndex);
		Ti.API.info('selectedImageArray[currentImageIndex] : ', selectedImageArray[currentImageIndex].imageIndex);
		$.displayImage.image = "/images/catDogs/" + selectedImageArray[currentImageIndex].imageIndex + ".png";
		Ti.API.info('$.displayImage.image : ', $.displayImage.image);
		continueLoop();
	} else {
		endTime = new Date().toUTCString();
		if (countDownTimer != null) {
			clearInterval(countDownTimer);
		}

		var gameScore = Math.round((4 / attemptCount) * 100);
		if (gameScore == 100) {
			points = points + 2;
		} else {
			points = points + 1;
		}
		gamePoints = gamePoints + points;
		commonDB.insertGameScore(7, gameScore, gamePoints, points);

		var timeDiff = commonFunctions.getMinuteSecond(startTime, endTime);
		commonFunctions.getScoreView(gameScore, points, timeDiff);
	}
}

Ti.App.addEventListener('getValues', getValues);
function getValues() {
	if (startTime == null) {
		return;
		if (Ti.Network.online) {
			var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
			var spinRecords = spinInfo.lampRecords;
			var notificationGame;
			var spinWheelScore;
			if(args.fromNotification === true){
				notificationGame = true;
			} else {
				notificationGame = false;
			}
			//	var wrongAnswer = 9 - correctAnswerCount;
			var resultParameter = {
				"UserID" : credentials.userId,
				"TotalQuestions" : 9,
				"CorrectAnswers" : correctAnswerCount,
				"WrongAnswers" : wrongAnswercount,
				"StartTime" : startTime,
				"EndTime" : endTime,
				"Point" : points,
				"IsNotificationGame" : notificationGame,
			};
			Ti.API.info('**** resultParameter **** = '+resultParameter.SpinWheelScore);
			commonFunctions.openActivityIndicator(L('activitySubmitting'));
			serviceManager.saveCatAndDogGame(resultParameter, onSaveCatAndDogGameSuccess, onSaveCatAndDogGameFailure);
		} else {
			commonFunctions.closeActivityIndicator();
			commonFunctions.showAlert(L('noNetwork'), function() {
				onSaveCatAndDogGameFailure();

			});

		}
	}
}

/**
 * function for looping
 */
function continueLoop() {
	memoryTimer = setInterval(function() {
		currentImageIndex += 1;
		Ti.API.info('image cunt is' + imageCount);
		if (currentImageIndex == imageCount) {
			$.messageLabel.text = L('CatandDogMessage2');
			clearInterval(memoryTimer);
			$.largeView.visible = false;
			for (var i = 0; i < imageCount; i++) {

				var imageLoc = "/images/catDogs/" + selectedImageArray[i].imageIndex + ".png";
				Ti.API.info('Add new images : ', imageLoc);
				boxIndexArray[i].backgroundImage = imageLoc;
			};
			$.outerBox.visible = true;
		} else {
			$.displayImage.image = "/images/catDogs/" + selectedImageArray[currentImageIndex].imageIndex + ".png";
		}
	}, 2000);
}

function startTimer() {
	var timer = 240;
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
			$.contentView.touchEnabled = false;
			$.messageLabel.text = L('intructionLabel3');
			$.messageView.visible = true;
			Ti.App.removeEventListener('getValues', getValues);
			setTimeout(function() {
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('catAndDogGame');
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
 * on selecting images
 */
function imageSelectionClick(e) {
	if (disableClick == true) {
		return;
	}
	Ti.API.info('imageSelectionClick : ', JSON.stringify(e));
	if (e.source.index != null) {
		var indexValue = parseInt(e.source.index);
		Ti.API.info('index value is ' + indexValue);
		if (boxIndexArraynotShuffle[indexValue - 1].selected != null && boxIndexArraynotShuffle[indexValue - 1].selected != undefined) {
			Ti.API.info('Box already selected');
			return;
		}
		if (indexValue == boxIndexArray[tapIndex].index) {
			//Ti.API.info('Correct Answer');
			correctAnswerCount += 1;
			var answerView = Ti.UI.createView({
				width : Titanium.UI.FILL,
				height : Titanium.UI.FILL,
				backgroundColor : '#03d981'

			});
			var answerMark = Ti.UI.createImageView({
				width : Titanium.UI.SIZE,
				height : Titanium.UI.SIZE,
				image : "/images/spatialSpan/tick_icon.png"

			});
			selectedViewArray.push({
				mark : answerMark,
				indexValue : indexValue - 1
			});
			answerView.add(answerMark);
			boxIndexArray[tapIndex].add(answerView);
			boxIndexArray[tapIndex].selected = true;
		} else {
			//Ti.API.info('Wrong Answer');
			var answerView = Ti.UI.createView({
				width : Titanium.UI.FILL,
				height : Titanium.UI.FILL,
				backgroundColor : '#fe3556'
			});
			var answerMark = Ti.UI.createImageView({
				width : Titanium.UI.SIZE,
				height : Titanium.UI.SIZE,
				image : "/images/spatialSpan/wrong_icon.png"

			});
			selectedViewArray.push({
				mark : answerMark,
				indexValue : indexValue - 1
			});
			answerView.add(answerMark);
			boxIndexArraynotShuffle[indexValue - 1].add(answerView);
			boxIndexArraynotShuffle[indexValue - 1].selected = true;
			wrongAnswercount = wrongAnswercount + 1;
			isWrong = 1;
		}
		tapIndex += 1;
		if (imageCount == tapIndex) {
			disableClick = true;
			for (var i = 0; i < selectedViewArray.length; i++) {
				Ti.API.info('array is' + JSON.stringify(selectedViewArray[i].mark));
				//boxIndexArraynotShuffle[selectedViewArray[i].indexValue].remove(selectedViewArray[i].mark);
				boxIndexArraynotShuffle[selectedViewArray[i].indexValue].removeAllChildren();
				boxIndexArraynotShuffle[selectedViewArray[i].indexValue].backgroundImage = "";
				boxIndexArraynotShuffle[selectedViewArray[i].indexValue].selected = null;
				var borderView = Ti.UI.createView({
					width : '1dp',
					height : Titanium.UI.FILL,
					right : '0dp',
					backgroundColor : '#dddddd',
					touchEnabled : true
				});
				boxIndexArraynotShuffle[selectedViewArray[i].indexValue].add(borderView);
			};
			Ti.API.info('boxIndexArray.length : ', boxIndexArray.length);
			for (var k = 0; k < boxIndexArray.length; k++) {
				Ti.API.info('boxIndexArray[k].backgroundImage : ', boxIndexArray[k].backgroundImage);
				boxIndexArray[k].backgroundImage = "";
			};
			Ti.API.info('wrongAnswercount : ', wrongAnswercount);
			if (isWrong == 0) {
				imageCount = imageCount + 2;
			}
			currentImageIndex = 0;
			tapIndex = 0;
			$.outerBox.visible = false;
			$.largeView.visible = true;
			disableClick = false;
			boxIndexArraynotShuffle = [];
			boxIndexArray = [];
			isWrong = 0;
			attemptCount += 1;
			//wrongAnswercount=0;
			gameLogic();

		}
	}
}

/**
 * Success api call
 */
function onSaveCatAndDogGameSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		Ti.API.info('***SAVE CAT AND DOG GAME SUCCESS  RESPONSE****  ', JSON.stringify(response));
		if (response.ErrorCode == 0) {
			Ti.App.removeEventListener('getValues', getValues);
			var diff = 0;
			var curTime = new Date().getTime();
			var setTime = Ti.App.Properties.getString('EnvTime', "");
			if (setTime != "") {
				diff = curTime - setTime;
			}
			if (diff == 0 || diff > 3600000) {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spaceBlockScreen', {
					'backDisable' : true,
				});
			}

			setTimeout(function() {
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('catAndDogGame');
				var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
				if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
					parentWindow.window.refreshHomeScreen();
				}

			}, 1000);

		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}
		commonFunctions.closeActivityIndicator();

	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("catsanddogs", "onSaveCatAndDogGameSuccess", ex);
	}
}

/**
 * Failure api call
 */
function onSaveCatAndDogGameFailure(e) {
	commonFunctions.closeActivityIndicator();
	Ti.App.removeEventListener('getValues', getValues);
	setTimeout(function() {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('catAndDogGame');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
			parentWindow.window.refreshHomeScreen();
		}

	}, 1000);
}

/**
 * function for back button click
 */
$.headerView.on('backButtonClick', function(e) {

	goBack();
});
function goBack(e) {
	clearInterval(memoryTimer);
	Ti.App.removeEventListener('getValues', getValues);
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('catAndDogGame');
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