// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = $.args;
var commonFunctions = require('commonFunctions');
var commonDB = require('commonDB');
var serviceManager = require('serviceManager');
var credentials = Alloy.Globals.getCredentials();
var LangCode = Ti.App.Properties.getString('languageCode');
var startTime = "";
var endTime = "";
var points = 0;
var gamePoints = 0;
var correctLines = 0;
var lineStartTime = new Date();
var lineEndTime = new Date();
var totalgameAttempt = 0;
var gameStarted = 0;
var targetIndex = 0;
var gameFinishStatus = 0;
var countDownTimer = null;
var lineRoutArrayFull = [];
var lineRoutArray = [];
var lastWrongUndo = null;
var levelNumb = 1;
var StatusType = 1;

$.trailsBNew.addEventListener("open", function(e) {
	if (OS_IOS) {
		if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
			$.headerContainer.height = "80dp";
			$.contentView.top = "80dp";
			$.restartButton.bottom = "25dp";
		}
	}
	var titleText = commonFunctions.L('trailsBTouch', LangCode);
	if (Ti.Platform.osname == "ipad") {
		$.headerView.setTitle(titleText, 12);
	} else {
		$.headerView.setTitle(commonFunctions.trimText(titleText, 12));
	}
	$.restartButton.text = commonFunctions.L('restartGame', LangCode);
	$.messageLabel.text = commonFunctions.L('intructionLabel2', LangCode);
	$.levelLabel.text = commonFunctions.L('levelLbl', LangCode);
	$.headerView.setQuitViewPosition();
	$.headerView.setReportViewVisibility(true);
	$.headerView.setReportImage("/images/common/report_icn.png");
	$.headerView.setNewQuitViewPosition();
	var gameInfo = commonDB.getGameScore(credentials.userId);
	Ti.API.info('gameInfo : ', gameInfo);
	for (var i = 0; i < gameInfo.length; i++) {
		if (gameInfo[i].gameID == 16) {
			gamePoints = gameInfo[i].points;
			Ti.API.info('gamePoints : ', gamePoints);
		}
	}

	createGame();
	startTimer();
});
$.headerView.on('rightButtonClick', function(e) {
	undoClick();
});
$.headerView.on('reportButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
$.headerView.on('quitButtonClick', function(e) {

	clearInterval(countDownTimer);
	endTime = new Date().toUTCString();
	if (lineRoutArray.length != 0) {
		lineRoutArrayFull.push({
			"Routes" : lineRoutArray,

		});
		lineRoutArray = [];
	}
	getValues();
});
function undoClick() {
	if (allowundo == false) {
		return;
	}

	if (lastWrongUndo != null) {
		lastWrongUndo.backgroundColor = "#DDEFFE";
		lastWrongUndo = null;
		allowundo = false;
		$.headerView.setRightImage("/images/common/undo-disabled.png");
	}

}

function setLabel() {
	var LangCode = Ti.App.Properties.getString('languageCode');
	var titleText = commonFunctions.L('trailsBTouch', LangCode);
	if (Ti.Platform.osname == "ipad") {
		$.headerView.setTitle(titleText, 12);
	} else {
		$.headerView.setTitle(commonFunctions.trimText(titleText, 12));
	}
	$.restartButton.text = commonFunctions.L('restartGame', LangCode);
	$.messageLabel.text = commonFunctions.L('intructionLabel2', LangCode);
	$.levelLabel.text = commonFunctions.L('levelLbl', LangCode);
}

function restartClick(e) {
	resetAllvalues();
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}
	setLabel();
	startTimer();
	createGame();

}

$.trailsBNew.addEventListener('android:back', function() {
	goBack();
});
$.headerView.on('backButtonClick', function(e) {

	goBack();
});
function goBack(e) {

	clearInterval(countDownTimer);

	endTime = new Date().toUTCString();
	if (lineRoutArray.length != 0) {
		lineRoutArrayFull.push({
			"Routes" : lineRoutArray,

		});
		lineRoutArray = [];
	}
	getValues();
}

function startTimer() {
	var timer = 30;
	var minutes = 0;
	var seconds = 0;
	countDownTimer = setInterval(function() {
		if (timer == 29) {
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
			$.restartButton.visible = false;
			endTime = new Date().toUTCString();
			if (lineRoutArray.length != 0) {
				lineRoutArrayFull.push({
					"Routes" : lineRoutArray,

				});
				lineRoutArray = [];
			}
			Ti.API.info('totalgameAttempt : ', totalgameAttempt, correctLines);
			if (totalgameAttempt < 30) {
				var gameScore = Math.round((correctLines / 30) * 100);
			} else {
				var gameScore = Math.round((correctLines / totalgameAttempt) * 100);
			}
			Ti.API.info('gamePoints : ', gamePoints);
			if (gameScore == 100) {
				points = points + 2;
			} else {
				points = points + 1;
			}
			gamePoints = gamePoints + points;
			Ti.API.info('gamePoints1 : ', gamePoints);
			commonDB.insertGameScore(16, gameScore, gamePoints, points);

			var timeDiff = commonFunctions.getMinuteSecond(startTime, endTime);

			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scoreScreen', {
				"GameID" : 16,
				"GameScore" : gameScore,
				"GameType" : 1,
				"GameName" : commonFunctions.L('trailsBTouch', LangCode)

			});

		}

		timer -= 1;
	}, 1000);
}

function createGame() {
	try {
		$.levelLabel.text = commonFunctions.L('levelLbl', LangCode) + " " + levelNumb;
		var borderRadiusCircle = 20;
		var circleSize = 40;
		var letterFont = Alloy.Globals.LargeMenuFontBoldTablet;
		var osname = Ti.Platform.osname;

		if (osname == "ipad") {
			borderRadiusCircle = 25;
			circleSize = 50;
			letterFont = Alloy.Globals.HeaderFontBoldTablet;
		}
		var pWidth = Alloy.Globals.DEVICE_WIDTH - 40;
		if (OS_IOS) {
			var pHeight = Alloy.Globals.DEVICE_HEIGHT - 220;
		} else {
			var pHeight = Alloy.Globals.DEVICE_HEIGHT_DPI - 220;
		}

		var fullArrayPositions = generatePositionsArray(pWidth, pHeight, 80, 10);
		if (levelNumb == 1) {
			var selectedAlphabetsArray = ['A', 'B', 'C', 'D'];
			var selectedNumbers = ['1', '2', '3', '4'];
			arrayPositions = getRandomPosition(fullArrayPositions, 8);
		} else if (levelNumb == 2) {
			var selectedAlphabetsArray = ['A', 'B', 'C', 'D', 'E'];
			var selectedNumbers = ['1', '2', '3', '4', '5'];
			arrayPositions = getRandomPosition(fullArrayPositions, 10);
		} else if (levelNumb == 3) {
			var selectedAlphabetsArray = ['A', 'B', 'C', 'D', 'E', 'F'];
			var selectedNumbers = ['1', '2', '3', '4', '5', '6'];
			arrayPositions = getRandomPosition(fullArrayPositions, 12);
		}

		tempArrPositions = arrayPositions.slice();

		var oddIndex = 0;
		var evenIndex = 0;

		for (var i = 0; i < arrayPositions.length; i++) {
			var viewColor = "#DDEFFE";
			var labelColor = "blue";
			if (i == 0) {
				viewColor = "#01E45A";
				labelColor = "#ffffff";
			}

			if (i % 2 == 0) {
				var displayText = selectedNumbers[evenIndex];
				evenIndex += 1;
			} else {
				var displayText = selectedAlphabetsArray[oddIndex];
				oddIndex += 1;
			}
			var AlphabetsView = Titanium.UI.createView({
				borderRadius : borderRadiusCircle,
				backgroundColor : viewColor,
				width : circleSize,
				height : circleSize,
				center : {
					x : arrayPositions[i].x,
					y : arrayPositions[i].y
				},
				customText : displayText,
				bubbleParent : true,
				zIndex : 10,
				indexValue : arrayPositions[i].index,
				borderColor : '#DDEFFE'

			});
			AlphabetsView.addEventListener("click", function(e) {
				totalgameAttempt += 1;
				if (e.source.indexValue == 0) {
					if ($.messageLabel.text != "") {
						correctLines += 1;
						$.messageLabel.text = commonFunctions.L('pickMatchingalphabet', LangCode);
						$.messageView.visible = true;
						$.restartButton.visible = false;
						lineStartTime = new Date();
						if (gameStarted == 0) {
							targetIndex += 1;
							var displayText = checkAlphabet(e.source.indexValue);
							lineRoutArray.push({
								"Alphabet" : displayText,
								"Status" : 0,
								"TimeTaken" : 0

							});
						} else {
							lineEndTime = new Date();
							var timeDiff = Math.abs(lineEndTime.getTime() - lineStartTime.getTime());
							lineStartTime = new Date();
							var timeTaken = (timeDiff / 1000);
							timeTaken = timeTaken.toFixed(2);
							var displayText = checkAlphabet(e.source.indexValue);
							lineRoutArray.push({
								"Alphabet" : displayText,
								"Status" : 0,
								"TimeTaken" : timeTaken

							});
						}
						gameStarted = 1;
					}

				} else {
					if (gameStarted == 1) {
						$.messageLabel.text = "";
						$.messageView.visible = false;
						$.restartButton.visible = true;
						Ti.API.info('e.source.indexValue : ', e.source.indexValue, targetIndex);
						if (e.source.indexValue == targetIndex) {
							Ti.API.info('Correct answer');
							correctLines += 1;
							targetIndex += 1;
							e.source.backgroundColor = "#01E45A";
							lineEndTime = new Date();
							var timeDiff = Math.abs(lineEndTime.getTime() - lineStartTime.getTime());
							lineStartTime = new Date();
							var timeTaken = (timeDiff / 1000);
							timeTaken = timeTaken.toFixed(2);
							var displayText = checkAlphabet(e.source.indexValue);
							lineRoutArray.push({
								"Alphabet" : displayText,
								"Status" : 1,
								"TimeTaken" : timeTaken

							});
							lastWrongUndo = null;
							allowundo = false;
							$.headerView.setRightImage("/images/common/undo-disabled.png");

						} else {
							Ti.API.info('Wrong answer');
							if (e.source.backgroundColor != "#01E45A") {
								e.source.backgroundColor = "red";
							}
							lineEndTime = new Date();
							var timeDiff = Math.abs(lineEndTime.getTime() - lineStartTime.getTime());
							lineStartTime = new Date();
							var timeTaken = (timeDiff / 1000);
							timeTaken = timeTaken.toFixed(2);
							var displayText = checkAlphabet(e.source.indexValue);
							lineRoutArray.push({
								"Alphabet" : displayText,
								"Status" : 0,
								"TimeTaken" : timeTaken

							});
							lastWrongUndo = e.source;
							allowundo = true;
							$.headerView.setRightImage("/images/common/undo.png");

						}
						Ti.API.info('targetIndex : ', targetIndex);
						var tempIndex = 8;
						if (levelNumb == 1) {
							tempIndex = 8;
						} else if (levelNumb == 2) {
							tempIndex = 10;
						} else if (levelNumb == 3) {
							tempIndex = 12;
						}

						if (targetIndex == tempIndex) {
							if (lineRoutArray.length != 0) {
								lineRoutArrayFull.push({
									"Routes" : lineRoutArray,

								});
								lineRoutArray = [];
							}
							if (levelNumb == 3) {

								Ti.API.info('lineRoutArrayFull : ', lineRoutArrayFull);
								gameFinishStatus = 1;
								$.messageLabel.text = commonFunctions.L('intructionLabel1', LangCode);
								$.messageView.visible = true;
								$.restartButton.visible = false;
								endTime = new Date().toUTCString();
								if (countDownTimer != null) {
									clearInterval(countDownTimer);
								}
								Ti.API.info('totalgameAttempt : ', totalgameAttempt, correctLines);
								if (totalgameAttempt < 30) {
									var gameScore = Math.round((correctLines / 30) * 100);
								} else {
									var gameScore = Math.round((correctLines / totalgameAttempt) * 100);
								}
								Ti.API.info('gameScore : ', gameScore);
								Ti.API.info('gamePoints : ', gamePoints);
								if (gameScore == 100) {
									points = points + 2;
								} else {
									points = points + 1;
								}
								gamePoints = gamePoints + points;
								Ti.API.info('gamePoints1 : ', gamePoints);
								commonDB.insertGameScore(16, gameScore, gamePoints, points);

								var timeDiff = commonFunctions.getMinuteSecond(startTime, endTime);
								StatusType = 2;

								Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scoreScreen', {
									"GameID" : 16,
									"GameScore" : gameScore,
									"GameType" : 1,
									"GameName" : commonFunctions.L('trailsBTouch', LangCode)

								});
							} else {
								levelNumb += 1;
								resetvalues();

								if (countDownTimer != null) {
									clearInterval(countDownTimer);
								}
								startTimer();
								createGame();

							}

						}

					}
				}
			});
			var lbl = Titanium.UI.createLabel({
				height : Titanium.UI.SIZE,
				width : Titanium.UI.SIZE,
				text : displayText,
				touchEnabled : false,
				font : letterFont,
				color : labelColor

			});
			AlphabetsView.add(lbl);

			$.contentView.add(AlphabetsView);

		};

	} catch(ex) {
		commonFunctions.handleException("trailsBNew", "createGame", ex);
	}

}

function pointInCircle(x, y, cx, cy, radius) {
	var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
	return distancesquared <= radius * radius;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
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
				x : arr[randomnumber].x,
				y : arr[randomnumber].y,
				index : indexValue
			});
			indexValue = indexValue + 1;

		}

		return result;
	} catch(ex) {
		commonFunctions.handleException("trailsB", "getRandomPosition", ex);
	}
}

function generatePositionsArray(maxX, maxY, safeRadius, irregularity) {
	try {
		var positionsArray = [];
		var r,
		    c;
		var rows;
		var columns;
		rows = Math.floor(maxY / safeRadius);
		columns = Math.floor(maxX / safeRadius);
		for ( r = 1; r <= rows; r += 1) {
			for ( c = 1; c <= columns; c += 1) {
				positionsArray.push({
					x : Math.round(maxX * c / columns) + getRandomInt(irregularity * -1, irregularity),
					y : Math.round(maxY * r / rows) + getRandomInt(irregularity * -1, irregularity),

				});

			}
		}
		return positionsArray;
	} catch(ex) {
		commonFunctions.handleException("trailsB", "generatePositionsArray", ex);
	}
}

var calculateTime;
var playedTime;
Ti.App.addEventListener('getValues', getValues);
function getValues() {
	if (startTime == null || startTime == "") {
		onSaveTrailsBGameFailure();
		return;
	}
	if (Ti.Network.online) {
		var attempt = 0;
		if (totalgameAttempt != 0) {
			attempt = totalgameAttempt - 1;
		}

		if (totalgameAttempt < 30) {
			var gameScore = Math.round((correctLines / 30) * 100);
		} else {
			var gameScore = Math.round((correctLines / totalgameAttempt) * 100);
		}

		var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
		var spinRecords = spinInfo.lampRecords;
		var notiGameScore;
		var spinWheelScore;

		var notificationGame;
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
			"TotalAttempts" : totalgameAttempt,
			"StartTime" : startTime,
			"EndTime" : endTime,
			"Point" : points,
			"Score" : gameScore,
			"RoutesList" : lineRoutArrayFull,
			"StatusType" : StatusType,
			"IsNotificationGame" : notificationGame,
			"AdminBatchSchID" : args.isBatch == true ? args.testID : 0,
			"SpinWheelScore" : spinWheelScore
		};
		Ti.API.info('**** resultParameter SpinWheelScore **** = ' + resultParameter.SpinWheelScore);
		Ti.API.info('getValues resultParameter : ', resultParameter);
		commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
		serviceManager.saveTrailsBGameTouch(resultParameter, onSaveTrailsBGameSuccess, onSaveTrailsBGameFailure);
	} else {
		commonFunctions.closeActivityIndicator();
		commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode), function() {
			onSaveTrailsBGameFailure();

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

function checkAlphabet(indexValue) {
	var displyText = "";
	if (indexValue == 0) {
		displyText = "1";
	} else if (indexValue == 1) {
		displyText = "A";
	} else if (indexValue == 2) {
		displyText = "2";

	} else if (indexValue == 3) {
		displyText = "B";

	} else if (indexValue == 4) {
		displyText = "3";

	} else if (indexValue == 5) {
		displyText = "C";

	} else if (indexValue == 6) {
		displyText = "4";

	} else if (indexValue == 7) {
		displyText = "D";

	} else if (indexValue == 8) {
		displyText = "5";

	} else if (indexValue == 9) {
		displyText = "E";

	} else if (indexValue == 10) {
		displyText = "6";

	} else if (indexValue == 11) {
		displyText = "F";

	} else if (indexValue == 12) {
		displyText = "7";

	} else if (indexValue == 13) {
		displyText = "G";

	} else if (indexValue == 14) {
		displyText = "8";

	} else if (indexValue == 15) {
		displyText = "H";

	}
	return displyText;

}

function onSaveTrailsBGameSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		Ti.API.info('***SAVE TRAILS-B GAME SUCCESS  RESPONSE****  ', JSON.stringify(response));
		if (response.ErrorCode == 0) {
			setTimeout(function() {
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

				commonFunctions.closeActivityIndicator();
			}, 3000);

			if (args.isBatch == true) {
				var surveyName = "";
				Alloy.Globals.BATCH_ARRAY = Alloy.Globals.BATCH_ARRAY.splice(1, Alloy.Globals.BATCH_ARRAY.length);
				if (Alloy.Globals.BATCH_ARRAY.length != 0) {

					Ti.API.info('Alloy.Globals.BATCH_ARRAY in nback', Alloy.Globals.BATCH_ARRAY);
					var surveyId = Alloy.Globals.BATCH_ARRAY[0].trim().split(" ");
					if (surveyId[0] == "S") {
						surveyName = commonDB.getSurveyName(surveyId[1]);
					}
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('trailsBNew');
					commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

				} else {
					var diff = 0;
					var curTime = new Date().getTime();
					var setTime = Ti.App.Properties.getString('EnvTime', "");
					if (setTime != "") {
						diff = curTime - setTime;
					}
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('trailsBNew');
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
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('trailsBNew');
				var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
				if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
					parentWindow.window.refreshHomeScreen();
				}
			}

		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}

	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("trails-B", "onSaveTrailsBGameSuccess", ex);
	}
}

/**
 * Failure api call
 */
function onSaveTrailsBGameFailure(e) {
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
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('trailsBNew');
			commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

		} else {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('trailsBNew');
			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
				parentWindow.window.refreshHomeScreen();
			}
		}
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('trailsBNew');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
			parentWindow.window.refreshHomeScreen();
		}
	}
	commonFunctions.closeActivityIndicator();
}

function resetAllvalues() {
	var startTime = "";
	endTime = "";
	points = 0;
	correctLines = 0;
	lineStartTime = new Date();
	lineEndTime = new Date();
	totalgameAttempt = 0;
	gameStarted = 0;
	targetIndex = 0;
	gameFinishStatus = 0;
	if (lineRoutArray.length != 0) {
		lineRoutArrayFull.push({
			"Routes" : lineRoutArray,

		});
		lineRoutArray = [];
	}
	levelNumb = 1;

	if ($.contentView.children && $.contentView.children.length > 0) {
		// Make a copy of the array
		var children = $.contentView.children.slice(0);
		var numChildren = children.length;
		for ( m = 0; m < numChildren; m++) {
			if (children[m].id != "messageView" && children[m].id != "undoview" && children[m].id != "countTimer" && children[m].id != "restartButton" && children[m].id != "levelLabel") {
				$.contentView.remove(children[m]);
			}

		}
	}

	$.messageLabel.text = commonFunctions.L('oneBiginLbl', LangCode);
	$.messageLabel.visible = true;
	$.messageView.visible = true;
	$.restartButton.visible = false;

}

function resetvalues() {
	lineStartTime = new Date();
	lineEndTime = new Date();

	gameStarted = 0;
	targetIndex = 0;
	gameFinishStatus = 0;

	if ($.contentView.children && $.contentView.children.length > 0) {
		// Make a copy of the array
		var children = $.contentView.children.slice(0);
		var numChildren = children.length;
		for ( m = 0; m < numChildren; m++) {
			if (children[m].id != "messageView" && children[m].id != "undoview" && children[m].id != "countTimer" && children[m].id != "restartButton" && children[m].id != "levelLabel") {
				$.contentView.remove(children[m]);
			}

		}
	}

	$.messageLabel.text = commonFunctions.L('oneBiginLbl', LangCode);
	$.messageLabel.visible = true;
	$.messageView.visible = true;
	$.restartButton.visible = false;

}