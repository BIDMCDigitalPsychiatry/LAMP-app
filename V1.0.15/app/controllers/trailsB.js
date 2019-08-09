/**
 * Declarations
 */
{
	var args = $.args;
	var commonFunctions = require('commonFunctions');
	var commonDB = require('commonDB');
	var serviceManager = require('serviceManager');
	var selectedImageType = 0;
	var selectedText = "";
	var selectedItemCount = 0;
	var selectedItem = null;
	var Line = require('line');
	var TestLine = null;
	var arrayPositions = [];
	var targetIndex = 1;
	var isBegin = 0;
	var previousX = 0;
	var previousY = 0;
	var lastFinishedIndex = 0;
	var touchEnd = false;
	var isEnd = false;
	var xValue = 0;
	var yValue = 0;
	var gameFinishStatus = 0;
	var totalgameAttempt = 0;
	var countDownTimer = null;
	var undoIndex = 0;
	var undoX = 0;
	var undoY = 0;
	var allowundo = false;
	var startTime = "";
	var endTime = "";
	var credentials = Alloy.Globals.getCredentials();
	var previousCorrectCircleIndex = 0;
	var lineStartIndex = 0;
	var lastCorrectCircleX = 0;
	var lastCorrectCircleY = 0;
	var points = 0;
	var gamePoints = 0;
	if (OS_ANDROID)
		var Canvas = require('com.wwl.canvas');

	var canvas = null;
	var connectedLines1 = [];
	var connectedLines2 = [];
	var testX = 0;
	var testY = 0;
	var firstpointX = 0;
	var firstpointY = 0;
	var lineRoutArrayFull = [];
	var lineRoutArray = [];
	var lineStartTime = new Date();
	var lineEndTime = new Date();
	var correctLines = 0;
	var prevSetTime = "";
	var StatusType = 1;
	var LangCode = Ti.App.Properties.getString('languageCode');
	var titleText = commonFunctions.L('trailsBTest', LangCode);
}
$.trailsB.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
				$.restartButton.bottom = "25dp";
			}
		}
		//if (Ti.Platform.osname == "ipad") {
		$.headerView.setTitle(titleText);
		//} else {
		//$.headerView.setTitle(commonFunctions.trimText(titleText, 12));
		//}
		$.restartButton.text = commonFunctions.L('restartGame', LangCode);
		$.messageLabel.text = commonFunctions.L('intructionLabel2', LangCode);
		$.headerView.setQuitViewPosition();
		//$.headerView.setReportViewVisibility(true);
		//$.headerView.setReportImage("/images/common/report_icn.png");
		$.headerView.setNewQuitViewPosition();
		var gameInfo = commonDB.getGameScore(credentials.userId);
		//Ti.API.info('game is' + JSON.stringify(gameInfo));
		for (var i = 0; i < gameInfo.length; i++) {
			if (gameInfo[i].gameID == 2) {
				gamePoints = gameInfo[i].points;
			}
		}

		createGame();
		startTimer();
		//startTime = new Date().toUTCString();
	} catch(ex) {
		commonFunctions.handleException("trailsB", "open", ex);
	}
});
function setLabel() {
	var LangCode = Ti.App.Properties.getString('languageCode');
	var titleText = commonFunctions.L('trailsBTest', LangCode);
	$.headerView.setTitle(titleText);
	$.restartButton.text = commonFunctions.L('restartGame', LangCode);
	$.messageLabel.text = commonFunctions.L('intructionLabel2', LangCode);
}

$.trailsB.addEventListener('android:back', function() {
	goBack();
});
$.headerView.on('reportButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
$.headerView.on('quitButtonClick', function(e) {
	//StatusType = 1;
	//Ti.App.removeEventListener('getValues', getValues);
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}
	endTime = new Date().toUTCString();
	if (lineRoutArray.length != 0) {
		lineRoutArrayFull.push({
			"Routes" : lineRoutArray,

		});
		lineRoutArray = [];
	}
	getValues();
	// Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('trailsB');
	// var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	// if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
	// parentWindow.window.refreshHomeScreen();
	// }
});
function createGame() {
	try {
		var borderRadiusCircle = 20;
		var circleSize = 40;
		var letterFont = Alloy.Globals.LargeMenuFontBoldTablet;
		var osname = Ti.Platform.osname;

		if (OS_ANDROID) {
			canvas = Canvas.createCanvasView({
				backgroundColor : "transparent",
				right : 0,
				bottom : 0,
				top : 0,
				left : 0,
				zIndex : 1,
				touchEnabled : false,
			});
			canvas.addEventListener('load', function() {
				//	Ti.API.info('load canvas');

				// canvas.beginPath();
				// canvas.lineWidth = 7;
				// canvas.strokeStyle = 'blue';
				// canvas.drawLine(0, 0, 400, 400);

			});
			$.contentView.add(canvas);

		}

		if (osname == "ipad") {
			borderRadiusCircle = 25;
			circleSize = 50;
			letterFont = Alloy.Globals.HeaderFontBoldTablet;
		}
		var pWidth = Alloy.Globals.DEVICE_WIDTH - 40;
		if (OS_IOS) {
			var pHeight = Alloy.Globals.DEVICE_HEIGHT - 220;
		} else {
			var widthValue = Ti.Platform.displayCaps.platformWidth / (Ti.Platform.displayCaps.dpi / 160);
			pWidth = widthValue - 40;
			var pHeight = Alloy.Globals.DEVICE_HEIGHT_DPI - 220;
		}

		var fullArrayPositions = generatePositionsArray(pWidth, pHeight, 80, 10);
		var selectedAlphabetsArray = ['A', 'B', 'C', 'D'];
		var selectedNumbers = ['1', '2', '3', '4'];
		arrayPositions = getRandomPosition(fullArrayPositions, 8);
		tempArrPositions = arrayPositions.slice();
		Ti.API.info('arrayPositions : ', arrayPositions);
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
				if (e.source.indexValue == 0) {
					if ($.messageLabel.text != "") {
						$.messageLabel.text = commonFunctions.L('intructionLabel', LangCode);
						$.messageView.visible = true;
						$.restartButton.visible = false;
						lineStartTime = new Date();
					}

				}
			});
			var lbl = Titanium.UI.createLabel({
				height : Titanium.UI.SIZE,
				width : Titanium.UI.SIZE,
				//text : selectedAlphabetsArray[i],
				text : displayText,
				touchEnabled : false,
				font : letterFont,
				color : labelColor

			});
			AlphabetsView.add(lbl);

			$.contentView.add(AlphabetsView);

		};

		// var TLine = Line.createLine({
		// x1 : 15,
		// y1 : 60,
		// x2 : 95,
		// y2 : 140,
		// color : 'yellow',
		// width : 2,
		// });
		//
		// $.contentView.add(TLine);
		//
		// var TLine1 = Line.createLine({
		// x1 : 195,
		// y1 : 240,
		// x2 : 275,
		// y2 : 320,
		// color : 'yellow',
		// width : 2,
		// });
		//
		// $.contentView.add(TLine1);

	} catch(ex) {
		commonFunctions.handleException("trailsB", "createGame", ex);
	}

}

function resetAllvalues() {
	selectedImageType = 0;
	selectedText = "";
	selectedItemCount = 0;
	selectedItem = null;
	TestLine = null;
	arrayPositions = [];
	targetIndex = 1;
	isBegin = 0;
	previousX = 0;
	previousY = 0;
	lastFinishedIndex = 0;
	touchEnd = false;
	isEnd = false;
	xValue = 0;
	yValue = 0;
	totalgameAttempt = 0;
	undoIndex = 0;
	undoX = 0;
	undoY = 0;
	allowundo = false;
	startTime = "";
	endTime = "";
	previousCorrectCircleIndex = 0;
	lineStartIndex = 0;
	lastCorrectCircleX = 0;
	lastCorrectCircleY = 0;
	gameFinishStatus = 0;
	correctLines = 0;
	if (OS_ANDROID) {
		canvas.clear();
		$.contentView.remove(canvas);
	}

	if ($.contentView.children && $.contentView.children.length > 0) {
		// Make a copy of the array
		var children = $.contentView.children.slice(0);
		var numChildren = children.length;
		for ( m = 0; m < numChildren; m++) {
			if (children[m].id != "messageView" && children[m].id != "undoview" && children[m].id != "countTimer" && children[m].id != "restartButton") {
				$.contentView.remove(children[m]);
			}

		}
	}
	canvas = null;
	$.messageLabel.text = commonFunctions.L('oneBiginLbl', LangCode);
	$.messageLabel.visible = true;
	$.messageView.visible = true;
	$.restartButton.visible = false;
	connectedLines1 = [];
	connectedLines2 = [];
	firstpointX = 0;
	firstpointY = 0;
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

$.headerView.on('rightButtonClick', function(e) {
	if (allowundo == false) {
		return;
	}
	if (OS_IOS) {
		if ($.contentView.children && $.contentView.children.length > 0) {

			// Make a copy of the array
			var children = $.contentView.children.slice(0);
			var removeIndex = null;
			var undoSet = false;
			var numChildren = children.length;

			for (var i = children.length - 1; i >= 0; i--) {

				if (children[i].backgroundColor == "red") {
					if (removeIndex == null || children[i].index == removeIndex) {
						removeIndex = children[i].index;
						$.contentView.remove(children[i]);
						undoSet = true;
					} else {

						break;

					}

				}
			};
			if (undoSet == true) {

				lastFinishedIndex = undoIndex;

				previousX = undoX;
				previousY = undoY;
				allowundo = false;

				$.headerView.setRightImage("/images/common/undo-disabled.png");
			}

		}
	} else {
		var removeIndex = null;
		var undoSet = false;

		for (var i = connectedLines1.length - 1; i >= 0; i--) {
			if (connectedLines1[i].strokeStyle == "red") {
				if (removeIndex == null || connectedLines1[i].index == removeIndex) {
					removeIndex = connectedLines1[i].index;
					connectedLines1.splice(i, 1);
					connectedLines2.splice(i, 1);
					undoSet = true;
				} else {

					break;

				}

			}
		}

		if (undoSet == true) {
			canvas.clear();
			canvas.beginPath();
			canvas.lineWidth = 5;
			for (var p = 0; p < connectedLines1.length; p++) {
				canvas.strokeStyle = connectedLines1[p].strokeStyle;
				canvas.drawLine(connectedLines1[p].pointX, connectedLines1[p].pointY, connectedLines2[p].pointX, connectedLines2[p].pointY);

			};
			lastFinishedIndex = connectedLines1[connectedLines1.length - 1].index;
			previousX = undoX;
			previousY = undoY;
			allowundo = false;
		}

		$.headerView.setRightImage("/images/common/undo-disabled.png");

	}

});
/**
 * on back button click
 */
$.headerView.on('backButtonClick', function(e) {
	goBack();
});
function goBack(e) {
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}
	//StatusType = 1;
	endTime = new Date().toUTCString();
	if (lineRoutArray.length != 0) {
		lineRoutArrayFull.push({
			"Routes" : lineRoutArray,

		});
		lineRoutArray = [];
	}
	getValues();
	// Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
	// Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('trailsB');
	// var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	// if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
	// parentWindow.window.refreshHomeScreen();
	// }
}

$.contentView.addEventListener("touchmove", function(e) {
	try {

		if (gameFinishStatus == 1) {
			return;
		}

		if (e.source.customText != null && xValue == 0 && yValue == 0) {
			if (isBegin == 0 && e.source.customText != "1") {
				return;
			}

			if (touchEnd == true) {

				if (e.source.indexValue != lastFinishedIndex && e.source.indexValue != previousCorrectCircleIndex) {

					return;
				}

				//touchEnd = false;
				if (isEnd == true) {
					lineStartIndex = e.source.indexValue;
				}

				isEnd = false;
			} else {
				return;

			}
			if (isBegin == 0) {
				$.messageLabel.text = commonFunctions.L('intructionLabel', LangCode);
				$.messageView.visible = true;
				$.restartButton.visible = false;
				previousX = tempArrPositions[0].x;
				previousY = tempArrPositions[0].y;

				lastCorrectCircleX = previousX;
				lastCorrectCircleY = previousY;

			} else {
				$.messageLabel.text = "";
				$.messageView.visible = false;
				$.restartButton.visible = true;
			}

			isBegin = 1;
			var innerViewPoint = {
				x : e.x,
				y : e.y
			};
			var outerViewPoint = e.source.convertPointToView(innerViewPoint, $.contentView);

			xValue = outerViewPoint.x;
			yValue = outerViewPoint.y;
			testX = xValue;
			testY = yValue;

			if (OS_IOS) {
				TestLine = Line.createLine({
					x1 : outerViewPoint.x,
					y1 : outerViewPoint.y,
					x2 : xValue + 2,
					y2 : yValue + 2,
					color : '#ffffff',
					width : 2,
					index : e.source.indexValue
				});
				$.contentView.add(TestLine);
			} else {

				// TestLine = Line.createLine({
				// x1 : outerViewPoint.x / Alloy.Globals.DPIFactor,
				// y1 : outerViewPoint.y / Alloy.Globals.DPIFactor,
				// x2 : (xValue / Alloy.Globals.DPIFactor) + 2,
				// y2 : (yValue / Alloy.Globals.DPIFactor) + 2,
				// color : '#ffffff',
				// width : 5,
				// index : e.source.indexValue
				// });
				// $.contentView.add(TestLine);

				TestLine = "Line";
				canvas.beginPath();
				canvas.lineWidth = 4;
				canvas.strokeStyle = '#ffffff';
				canvas.drawLine(outerViewPoint.x, outerViewPoint.y, outerViewPoint.x + 2, outerViewPoint.y + 2);
				firstpointX = outerViewPoint.x;
				firstpointY = outerViewPoint.y;

			}

		}

		if (TestLine != null && xValue != 0 && yValue != 0) {
			var osname = Ti.Platform.osname;
			var pointRadius = 16;
			if (osname == "ipad") {
				pointRadius = 20;
			}

			if (e.source.customText != null) {

				var innerViewPoint = {
					x : e.x,
					y : e.y
				};
				var outerViewPoint = e.source.convertPointToView(innerViewPoint, $.contentView);
				if (OS_ANDROID) {

					if (pointInCircle(outerViewPoint.x / Alloy.Globals.DPIFactor, outerViewPoint.y / Alloy.Globals.DPIFactor, testX / Alloy.Globals.DPIFactor, testY / Alloy.Globals.DPIFactor, 100) == false) {

						return;
					}

					// TestLine = Line.createLine({
					// x1 : testX / Alloy.Globals.DPIFactor,
					// y1 : testY / Alloy.Globals.DPIFactor,
					// x2 : outerViewPoint.x / Alloy.Globals.DPIFactor,
					// y2 : outerViewPoint.y / Alloy.Globals.DPIFactor,
					// color : '#ffffff',
					// width : 5,
					// index : e.source.indexValue
					// });
					// $.contentView.add(TestLine);

					canvas.beginPath();
					canvas.lineWidth = 4;
					canvas.strokeStyle = '#ffffff';
					canvas.drawLine(testX, testY, outerViewPoint.x, outerViewPoint.y);

				} else {
					TestLine = Line.createLine({
						x1 : testX,
						y1 : testY,
						x2 : outerViewPoint.x,
						y2 : outerViewPoint.y,
						color : '#ffffff',
						width : 2,
						index : e.source.indexValue
					});
					$.contentView.add(TestLine);

				}

				// TestLine.update({
				// x1 : testX,
				// y1 : testY,
				// x2 : outerViewPoint.x,
				// y2 : outerViewPoint.y,
				// duration : 0
				// });
				testX = outerViewPoint.x;
				testY = outerViewPoint.y;
				var devFactor = 1;
				if (OS_ANDROID) {
					devFactor = Alloy.Globals.DPIFactor;
				}
				for (var i = 0; i < tempArrPositions.length; i++) {

					if (pointInCircle(outerViewPoint.x / devFactor, outerViewPoint.y / devFactor, tempArrPositions[i].x, tempArrPositions[i].y, pointRadius) && tempArrPositions[i].index != 0) {

						if (tempArrPositions[i].index == targetIndex && lineStartIndex == previousCorrectCircleIndex) {
							//lineStartTime = new Date();
							lineEndTime = new Date();
							var timeDiff = Math.abs(lineEndTime.getTime() - lineStartTime.getTime());
							lineStartTime = new Date();
							var timeTaken = (timeDiff / 1000);
							timeTaken = timeTaken.toFixed(2);
							if (lineStartIndex == lastFinishedIndex && lineStartIndex != 0) {
								var displayText = checkAlphabet(tempArrPositions[i].index);
								lineRoutArray.push({
									"Alphabet" : displayText,
									"Status" : 1,
									"TimeTaken" : timeTaken

								});

							} else {

								if (lineRoutArray.length != 0) {
									//lineRoutArrayFull.push(lineRoutArray);
									lineRoutArrayFull.push({
										"Routes" : lineRoutArray,

									});
									lineRoutArray = [];
								}
								var displayText = checkAlphabet(lineStartIndex);
								lineRoutArray.push({
									"Alphabet" : displayText,
									"Status" : 1,
									"TimeTaken" : timeTaken

								});
								var displayText = checkAlphabet(tempArrPositions[i].index);
								lineRoutArray.push({
									"Alphabet" : displayText,
									"Status" : 1,
									"TimeTaken" : timeTaken

								});

							}
							//Ti.API.info('lineRoutArrayFull : ', lineRoutArrayFull);
							//Ti.API.info('Green 1 : ', lastCorrectCircleX, lastCorrectCircleY);
							if (OS_IOS) {
								TestLine = Line.createLine({
									x1 : lastCorrectCircleX,
									y1 : lastCorrectCircleY,
									x2 : tempArrPositions[i].x,
									y2 : tempArrPositions[i].y,
									color : 'green',
									width : 2,
									index : e.source.indexValue
								});
								$.contentView.add(TestLine);
							} else {
								// TestLine = Line.createLine({
								// x1 : lastCorrectCircleX,
								// y1 : lastCorrectCircleY,
								// x2 : tempArrPositions[i].x,
								// y2 : tempArrPositions[i].y,
								// color : 'green',
								// width : 2,
								// index : e.source.indexValue
								// });

								// var TestLine1 = Line.createLine({
								// x1 : lastCorrectCircleX,
								// y1 : lastCorrectCircleY,
								// x2 : tempArrPositions[i].x,
								// y2 : tempArrPositions[i].y,
								// color : 'green',
								// width : 2,
								// index : e.source.indexValue
								// });
								connectedLines1.push({
									"pointX" : firstpointX,
									"pointY" : firstpointY,
									"strokeStyle" : "green",
									"index" : tempArrPositions[i].index

								});

								connectedLines2.push({
									"pointX" : testX,
									"pointY" : testY,
									"index" : tempArrPositions[i].index

								});

								// canvas.clear();
								// canvas.beginPath();
								// canvas.lineWidth = 5;
								// //canvas.strokeStyle = 'green';
								// for (var p = 0; p < connectedLines1.length; p++) {
								// canvas.strokeStyle = connectedLines1[p].strokeStyle;
								// canvas.drawLine(connectedLines1[p].pointX, connectedLines1[p].pointY, connectedLines2[p].pointX, connectedLines2[p].pointY);
								//
								// };

							}
							correctLines = correctLines + 1;
							removeAllWhiteLines();
							allowundo = false;
							$.headerView.setRightImage("/images/common/undo-disabled.png");

							previousX = tempArrPositions[i].x;
							previousY = tempArrPositions[i].y;
							lastCorrectCircleX = previousX;
							lastCorrectCircleY = previousY;
							lastFinishedIndex = tempArrPositions[i].index;
							previousCorrectCircleIndex = tempArrPositions[i].index;
							var diff = 0;
							var curTime = new Date().getTime();

							if (prevSetTime != "") {
								diff = curTime - prevSetTime;
							}
							Ti.API.info('diff : ', diff);
							if (diff == 0 || diff > 500) {
								Ti.API.info('INCREASE TOTAL ATTEMPT');
								totalgameAttempt = totalgameAttempt + 1;
								prevSetTime = curTime;

							}

							targetIndex = targetIndex + 1;
							tempArrPositions.splice(i, 1);
							if (targetIndex == 8) {
								gameFinishStatus = 1;
								$.messageLabel.text = commonFunctions.L('intructionLabel1', LangCode);
								$.messageView.visible = true;
								$.restartButton.visible = false;
								endTime = new Date().toUTCString();
								if (countDownTimer != null) {
									clearInterval(countDownTimer);
								}
								if (lineRoutArray.length != 0) {
									lineRoutArrayFull.push({
										"Routes" : lineRoutArray,
									});
									//	lineRoutArrayFull.push(lineRoutArray);
									lineRoutArray = [];
								}
								Ti.API.info('lineRoutArrayFull Final : ', lineRoutArrayFull);
								Ti.API.info('totalgameAttempt : ', totalgameAttempt, " correctLines : ", correctLines);
								if (totalgameAttempt < 7) {
									var gameScore = Math.round((correctLines / 7) * 100);
								} else {
									var gameScore = Math.round((correctLines / totalgameAttempt) * 100);
								}

								if (gameScore == 100) {
									points = points + 2;
								} else {
									points = points + 1;
								}
								gamePoints = gamePoints + points;
								commonDB.insertGameScore(2, gameScore, gamePoints, points);

								var timeDiff = commonFunctions.getMinuteSecond(startTime, endTime);
								StatusType = 2;

								//commonFunctions.getScoreView(gameScore, points, timeDiff);
								Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scoreScreen', {
									"GameID" : 2,
									"GameScore" : gameScore,
									"GameType" : 1,
									"GameName" : commonFunctions.L('trailsBTest', LangCode)

								});

							} else {
								$.messageLabel.text = "";
								$.messageView.visible = false;
								$.restartButton.visible = true;
							}

						} else {

							var tempx = previousX;
							var tempy = previousY;
							lineEndTime = new Date();
							var timeDiff = Math.abs(lineEndTime.getTime() - lineStartTime.getTime());
							lineStartTime = new Date();
							var timeTaken = (timeDiff / 1000);
							timeTaken = timeTaken.toFixed(2);
							if (lineStartIndex == lastFinishedIndex && lineStartIndex != 0 && lineStartIndex != tempArrPositions[i].index) {

								var displayText = checkAlphabet(tempArrPositions[i].index);
								lineRoutArray.push({
									"Alphabet" : displayText,
									"Status" : 0,
									"TimeTaken" : timeTaken

								});

							} else {
								if (lineStartIndex != tempArrPositions[i].index) {
									if (lineRoutArray.length != 0) {
										lineRoutArrayFull.push({
											"Routes" : lineRoutArray,

										});
										//lineRoutArrayFull.push(lineRoutArray);
										lineRoutArray = [];
									}
									var displayText = checkAlphabet(lineStartIndex);
									lineRoutArray.push({
										"Alphabet" : displayText,
										"Status" : 0,
										"TimeTaken" : timeTaken

									});
									var displayText = checkAlphabet(tempArrPositions[i].index);
									lineRoutArray.push({
										"Alphabet" : displayText,
										"Status" : 0,
										"TimeTaken" : timeTaken

									});

								}

							}

							for (var k = 0; k < arrayPositions.length; k++) {
								if (arrayPositions[k].index == lineStartIndex) {

									tempx = arrayPositions[k].x;
									tempy = arrayPositions[k].y;
								}
							};
							lineStartIndex = tempArrPositions[i].index;
							if (OS_IOS) {
								TestLine = Line.createLine({
									x1 : tempx,
									y1 : tempy,
									x2 : tempArrPositions[i].x,
									y2 : tempArrPositions[i].y,
									color : 'red',
									width : 2,
									index : e.source.indexValue
								});
								$.contentView.add(TestLine);
							} else {

								connectedLines1.push({
									"pointX" : firstpointX,
									"pointY" : firstpointY,
									"strokeStyle" : "red",
									"index" : tempArrPositions[i].index

								});

								connectedLines2.push({
									"pointX" : testX,
									"pointY" : testY,
									"index" : tempArrPositions[i].index

								});

								//canvas.strokeStyle = 'red';
								//canvas.drawLine(firstpointX, firstpointY, testX, testY);
							}

							removeAllWhiteLines();
							// TestLine.update({
							// x1 : tempx,
							// y1 : tempy,
							// x2 : tempArrPositions[i].x,
							// y2 : tempArrPositions[i].y,
							// duration : 0,
							// color : 'red',
							// index : e.source.indexValue
							// });

							allowundo = true;
							$.headerView.setRightImage("/images/common/undo.png");

							undoIndex = lastFinishedIndex;
							undoX = previousX;
							undoY = previousY;
							lastFinishedIndex = tempArrPositions[i].index;

							var diff = 0;
							var curTime = new Date().getTime();

							if (prevSetTime != "") {
								diff = curTime - prevSetTime;
							}
							Ti.API.info('diff : ', diff);
							if (diff == 0 || diff > 500) {
								Ti.API.info('INCREASE TOTAL ATTEMPT');
								totalgameAttempt = totalgameAttempt + 1;
								prevSetTime = curTime;

							}

							previousX = tempArrPositions[i].x;
							previousY = tempArrPositions[i].y;

							$.messageLabel.text = "";
							$.messageView.visible = false;
							$.restartButton.visible = true;

							//targetIndex = targetIndex + 1;
						}

						xValue = 0;
						yValue = 0;
						TestLine = null;
						break;

					}

				};

			} else {

				var tempX = e.x;
				var tempY = e.y;

				if (OS_ANDROID) {
					tempX = tempX / Alloy.Globals.DPIFactor;
					tempY = tempY / Alloy.Globals.DPIFactor;
				}
				TestLine = Line.createLine({
					x1 : testX,
					y1 : testY,
					x2 : tempX,
					y2 : tempY,
					color : '#ffffff',
					width : 2,
					index : e.source.indexValue
				});
				$.contentView.add(TestLine);
				testX = tempX;
				testY = tempY;
				// TestLine.update({
				// x1 : xValue,
				// y1 : yValue,
				// x2 : tempX,
				// y2 : tempY,
				// duration : 0
				// });

				for (var i = 0; i < tempArrPositions.length; i++) {
					var tempX = e.x;
					var tempY = e.y;

					if (OS_ANDROID) {
						tempX = tempX / Alloy.Globals.DPIFactor;
						tempY = tempY / Alloy.Globals.DPIFactor;
					}
					if (pointInCircle(tempX, tempY, tempArrPositions[i].x, tempArrPositions[i].y, pointRadius) && tempArrPositions[i].index != 0) {
						if (tempArrPositions[i].index == targetIndex && lineStartIndex == previousCorrectCircleIndex) {

							TestLine = Line.createLine({
								x1 : lastCorrectCircleX,
								y1 : lastCorrectCircleY,
								x2 : tempArrPositions[i].x,
								y2 : tempArrPositions[i].y,
								color : 'green',
								width : 2,
								index : e.source.indexValue
							});
							$.contentView.add(TestLine);

							removeAllWhiteLines();

							// TestLine.update({
							// x1 : lastCorrectCircleX,
							// y1 : lastCorrectCircleY,
							// x2 : tempArrPositions[i].x,
							// y2 : tempArrPositions[i].y,
							// duration : 0,
							// color : 'green',
							// });

							allowundo = false;
							$.headerView.setRightImage("/images/common/undo-disabled.png");
							correctLines = correctLines + 1;
							lastFinishedIndex = tempArrPositions[i].index;
							previousCorrectCircleIndex = tempArrPositions[i].index;

							var diff = 0;
							var curTime = new Date().getTime();

							if (prevSetTime != "") {
								diff = curTime - prevSetTime;
							}
							Ti.API.info('diff : ', diff);
							if (diff == 0 || diff > 500) {
								Ti.API.info('INCREASE TOTAL ATTEMPT');
								totalgameAttempt = totalgameAttempt + 1;
								prevSetTime = curTime;

							}
							previousX = tempArrPositions[i].x;
							previousY = tempArrPositions[i].y;
							lastCorrectCircleX = previousX;
							lastCorrectCircleY = previousY;
							targetIndex = targetIndex + 1;
							tempArrPositions.splice(i, 1);
							if (targetIndex == 8) {
								gameFinishStatus = 1;
								$.messageLabel.text = commonFunctions.L('intructionLabel1', LangCode);
								$.messageView.visible = true;
								$.restartButton.visible = false;
								// setTimeout(function() {
								// //resetAllvalues();
								// //createGame();
								// }, 3000);

							} else {
								$.messageLabel.text = "";
								$.messageView.visible = false;
								$.restartButton.visible = true;
							}

						} else {

							var tempx = previousX;
							var tempy = previousY;
							for (var k = 0; k < arrayPositions.length; i++) {
								if (arrayPositions[k].index == lineStartIndex) {
									tempx = arrayPositions[k].x;
									tempy = arrayPositions[k].y;
								}
							};

							TestLine = Line.createLine({
								x1 : tempx,
								y1 : tempy,
								x2 : tempArrPositions[i].x,
								y2 : tempArrPositions[i].y,
								color : 'red',
								width : 2,
								index : e.source.indexValue
							});
							$.contentView.add(TestLine);
							removeAllWhiteLines();

							// TestLine.update({
							// x1 : tempx,
							// y1 : tempy,
							// x2 : tempArrPositions[i].x,
							// y2 : tempArrPositions[i].y,
							// duration : 0,
							// color : 'red',
							// index : e.source.indexValue
							// });

							allowundo = true;
							$.headerView.setRightImage("/images/common/undo.png");

							undoIndex = lastFinishedIndex;
							undoX = previousX;
							undoY = previousY;
							lastFinishedIndex = tempArrPositions[i].index;

							var diff = 0;
							var curTime = new Date().getTime();

							if (prevSetTime != "") {
								diff = curTime - prevSetTime;
							}
							Ti.API.info('diff : ', diff);
							if (diff == 0 || diff > 500) {
								Ti.API.info('INCREASE TOTAL ATTEMPT');
								totalgameAttempt = totalgameAttempt + 1;
								prevSetTime = curTime;

							}
							previousX = tempArrPositions[i].x;
							previousY = tempArrPositions[i].y;
							lineStartIndex = tempArrPositions[i].index;
							$.messageLabel.text = "";
							$.messageView.visible = false;
							$.restartButton.visible = true;
							//targetIndex = targetIndex + 1;
						}

						xValue = 0;
						yValue = 0;
						TestLine = null;
						break;

					}

				};

			}

		}
	} catch(ex) {
		commonFunctions.handleException("trailsB", "touchmove", ex);
	}
});

var calculateTime;
var playedTime;
Ti.App.addEventListener('getValues', getValues);
function getValues() {
	if (startTime == null || startTime == "") {
		onSaveTrailsBGameFailure();
		return;
	}
	if (Ti.Network.online) {
		var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
		var spinRecords = spinInfo.lampRecords;
		var notiGameScore;
		var spinWheelScore;

		if (totalgameAttempt < 7) {
			var gameScore = Math.round((correctLines / 7) * 100);
		} else {
			var gameScore = Math.round((correctLines / totalgameAttempt) * 100);
		}

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
		Ti.API.info('isBatch', args.isBatch);
		Ti.API.info('args.testID', args.testID);
		commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
		serviceManager.saveTrailsBGame(resultParameter, onSaveTrailsBGameSuccess, onSaveTrailsBGameFailure);
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

/**
 * Success api call
 */
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
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('trailsB');
					commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

				} else {
					var diff = 0;
					var curTime = new Date().getTime();
					var setTime = Ti.App.Properties.getString('EnvTime', "");
					if (setTime != "") {
						diff = curTime - setTime;
					}
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('trailsB');
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
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('trailsB');
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
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('trailsB');
			commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

		} else {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('trailsB');
			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
				parentWindow.window.refreshHomeScreen();
			}
		}
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('trailsB');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
			parentWindow.window.refreshHomeScreen();
		}
	}
	commonFunctions.closeActivityIndicator();
}

function pointInCircle(x, y, cx, cy, radius) {
	var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
	return distancesquared <= radius * radius;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

// generate random positions
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
		Ti.API.info('positionsArray : ', positionsArray);
		return positionsArray;
	} catch(ex) {
		commonFunctions.handleException("trailsB", "generatePositionsArray", ex);
	}
}

$.contentView.addEventListener("touchend", function(e) {
	try {
		isEnd = true;
		touchEnd = true;
		if (lastFinishedIndex == 0)
			isBegin = 0;
		removeAllWhiteLines();
		// if (TestLine != null)
		// $.contentView.remove(TestLine);
		TestLine = null;
		xValue = 0;
		yValue = 0;
	} catch(ex) {
		commonFunctions.handleException("trailsB", "touchend", ex);
	}

});
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
		//display.textContent = minutes + ":" + seconds;
		if (timer == 0) {
			if (countDownTimer != null) {
				clearInterval(countDownTimer);
			}
			if (lineRoutArray.length != 0) {
				lineRoutArrayFull.push({
					"Routes" : lineRoutArray,

				});
				lineRoutArray = [];
			}
			$.contentView.touchEnabled = false;
			$.messageLabel.text = commonFunctions.L('intructionLabel3', LangCode);
			$.messageView.visible = true;
			$.restartButton.visible = false;
			endTime = new Date().toUTCString();
			Ti.API.info('totalgameAttempt : ', totalgameAttempt, " correctLines : ", correctLines);
			if (totalgameAttempt < 7) {
				var gameScore = Math.round((correctLines / 7) * 100);
			} else {
				var gameScore = Math.round((correctLines / totalgameAttempt) * 100);
			}
			if (gameScore == 100) {
				points = points + 2;
			} else {
				points = points + 1;
			}
			gamePoints = gamePoints + points;
			commonDB.insertGameScore(2, gameScore, gamePoints, points);

			var timeDiff = commonFunctions.getMinuteSecond(startTime, endTime);

			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scoreScreen', {
				"GameID" : 2,
				"GameScore" : gameScore,
				"GameType" : 1,
				"GameName" : commonFunctions.L('trailsBTest', LangCode)
			});

			//commonFunctions.getScoreView(gameScore, points, timeDiff);

		}

		timer -= 1;
	}, 1000);
}

function undoClick(e) {
	//Ti.API.info('undoClick');
	if ($.contentView.children && $.contentView.children.length > 0) {
		// Make a copy of the array
		var children = $.contentView.children.slice(0);
		var numChildren = children.length;
		//Ti.API.info('numChildren : ', numChildren);
		if (children[numChildren - 1].id != "messageView" && children[numChildren - 1].customText == null) {
			$.contentView.remove(children[numChildren - 1]);
			lastFinishedIndex = undoIndex;
			previousX = undoX;
			previousY = undoY;

		}

	}
}

function removeAllWhiteLines() {

	if (OS_IOS) {

		if ($.contentView.children && $.contentView.children.length > 0) {
			// Make a copy of the array
			var children = $.contentView.children.slice(0);
			var numChildren = children.length;
			for ( m = 0; m < numChildren; m++) {
				if (children[m].id != "messageView" && children[m].backgroundColor == "#ffffff") {
					//children[m].backgroundColor = "green";
					$.contentView.remove(children[m]);
				}

			}
		}
	} else {
		canvas.clear();
		canvas.beginPath();
		canvas.lineWidth = 5;
		for (var p = 0; p < connectedLines1.length; p++) {
			canvas.strokeStyle = connectedLines1[p].strokeStyle;
			canvas.drawLine(connectedLines1[p].pointX, connectedLines1[p].pointY, connectedLines2[p].pointX, connectedLines2[p].pointY);

		};

	}

}

function restartClick(e) {
	try {
		resetAllvalues();
		if (countDownTimer != null) {
			clearInterval(countDownTimer);
		}
		setLabel();
		startTimer();
		createGame();
		//startTime = new Date().toUTCString();

	} catch(ex) {
		commonFunctions.handleException("trailsB", "restartClick", ex);
	}
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

	}
	return displyText;

}