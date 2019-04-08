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
	var sNumber = Ti.App.Properties.getString("trailsbSequence", "");
	var prevSetTime = "";
	var StatusType = 1;
	var LangCode = Ti.App.Properties.getString('languageCode');
	var titleText = commonFunctions.L('trailsBTestNew', LangCode);
}
$.trailsbNonOverlap.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
				$.restartButton.bottom = "25dp";
			}
		}
		if (Ti.Platform.osname == "ipad") {
			$.headerView.setTitle(titleText, 12);
		} else {
			$.headerView.setTitle(commonFunctions.trimText(titleText, 12));
		}

		$.restartButton.text = commonFunctions.L('restartGame', LangCode);
		$.messageLabel.text = commonFunctions.L('intructionLabel2', LangCode);
		$.headerView.setReportViewVisibility(true);
		$.headerView.setReportImage("/images/common/report_icn.png");
		$.headerView.setNewQuitViewPosition();
		if (args.reminderVersion != null && args.reminderVersion != 0) {
			sNumber = args.reminderVersion;
		} else {
			if (sNumber == "") {
				Ti.App.Properties.setString('trailsbSequence', 2);
				sNumber = 1;
			} else if (sNumber == 1 || sNumber == "1") {
				Ti.App.Properties.setString('trailsbSequence', 2);
			} else if (sNumber == 2 || sNumber == "2") {
				Ti.App.Properties.setString('trailsbSequence', 3);
			} else if (sNumber == 3 || sNumber == "3") {
				Ti.App.Properties.setString('trailsbSequence', 4);
			} else if (sNumber == 4 || sNumber == "4") {
				Ti.App.Properties.setString('trailsbSequence', 5);
			} else if (sNumber == 5 || sNumber == "5") {
				Ti.App.Properties.setString('trailsbSequence', 6);
			} else if (sNumber == 6 || sNumber == "6") {
				Ti.App.Properties.setString('trailsbSequence', 7);
			} else if (sNumber == 7 || sNumber == "7") {
				Ti.App.Properties.setString('trailsbSequence', 8);
			} else if (sNumber == 8 || sNumber == "8") {
				Ti.App.Properties.setString('trailsbSequence', 9);
			} else if (sNumber == 9 || sNumber == "9") {
				Ti.App.Properties.setString('trailsbSequence', 10);
			} else if (sNumber == 10 || sNumber == "10") {
				Ti.App.Properties.setString('trailsbSequence', 11);
			} else if (sNumber == 11 || sNumber == "11") {
				Ti.App.Properties.setString('trailsbSequence', 12);
			} else if (sNumber == 12 || sNumber == "12") {
				Ti.App.Properties.setString('trailsbSequence', 13);
			} else if (sNumber == 13 || sNumber == "13") {
				Ti.App.Properties.setString('trailsbSequence', 14);
			} else if (sNumber == 14 || sNumber == "14") {
				Ti.App.Properties.setString('trailsbSequence', 15);
			} else if (sNumber == 15 || sNumber == "15") {
				Ti.App.Properties.setString('trailsbSequence', 1);
			}

		}
		var gameInfo = commonDB.getGameScore(credentials.userId);

		for (var i = 0; i < gameInfo.length; i++) {
			if (gameInfo[i].gameID == 15) {
				gamePoints = gameInfo[i].points;
			}
		}

		createGame();
		startTimer();

	} catch(ex) {
		commonFunctions.handleException("trailsbNonOverlap", "open", ex);
	}
});
function setLabel() {
	var LangCode = Ti.App.Properties.getString('languageCode');
	var titleText = commonFunctions.L('trailsBTestNew', LangCode);
	if (Ti.Platform.osname == "ipad") {
		$.headerView.setTitle(titleText, 12);
	} else {
		$.headerView.setTitle(commonFunctions.trimText(titleText, 12));
	}
	$.headerView.setTitle(commonFunctions.trimText(titleText, 12));
	$.restartButton.text = commonFunctions.L('restartGame', LangCode);
	$.messageLabel.text = commonFunctions.L('intructionLabel2', LangCode);
}

$.trailsbNonOverlap.addEventListener('android:back', function() {
	goBack();
});
$.headerView.on('quitButtonClick', function(e) {

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

});
$.headerView.on('reportButtonClick', function(e) {
	commonFunctions.sendScreenshot();
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
			var pHeight = Alloy.Globals.DEVICE_HEIGHT_DPI - 220;
		}

		var selectedAlphabetsArray = ['A', 'B', 'C', 'D'];
		var selectedNumbers = ['1', '2', '3', '4'];

		arrayPositions = getRandomPosition(sNumber);
		//sNumber
		Ti.API.info('arrayPositions : ', arrayPositions);
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

				text : displayText,
				touchEnabled : false,
				font : letterFont,
				color : labelColor

			});
			AlphabetsView.add(lbl);

			$.contentView.add(AlphabetsView);

		};

	} catch(ex) {
		commonFunctions.handleException("trailsbNonOverlap", "createGame", ex);
	}

}

/**
 * Function to reset all values
 */
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

function getRandomPosition(sequence) {
	try {

		if (commonFunctions.getIsTabletMini() == true) {
			if (sequence == 1) {
				var result = [{
					x : 478,
					y : 181,
					index : 0
				}, {
					x : 384,
					y : 190,
					index : 1
				}, {
					x : 196,
					y : 184,
					index : 2
				}, {
					x : 395,
					y : 369,
					index : 3
				}, {
					x : 472,
					y : 380,
					index : 4
				}, {
					x : 197,
					y : 653,
					index : 5
				}, {
					x : 388,
					y : 639,
					index : 6
				}, {
					x : 485,
					y : 647,
					index : 7
				}];
			} else if (sequence == 2) {
				var result = [{
					x : 194,
					y : 646,
					index : 0
				}, {
					x : 479,
					y : 646,
					index : 1
				}, {
					x : 550,
					y : 638,
					index : 2
				}, {
					x : 530,
					y : 559,
					index : 3
				}, {
					x : 395,
					y : 375,
					index : 4
				}, {
					x : 495,
					y : 371,
					index : 5
				}, {
					x : 389,
					y : 180,
					index : 6
				}, {
					x : 487,
					y : 192,
					index : 7
				}];
			} else if (sequence == 3) {
				var result = [{
					x : 472,
					y : 453,
					index : 0
				}, {
					x : 481,
					y : 647,
					index : 1
				}, {
					x : 100,
					y : 638,
					index : 2
				}, {
					x : 196,
					y : 454,
					index : 3
				}, {
					x : 479,
					y : 265,
					index : 4
				}, {
					x : 96,
					y : 196,
					index : 5
				}, {
					x : 389,
					y : 188,
					index : 6
				}, {
					x : 471,
					y : 185,
					index : 7
				}];
			} else if (sequence == 4) {
				var result = [{
					x : 475,
					y : 552,
					index : 0
				}, {
					x : 292,
					y : 641,
					index : 1
				}, {
					x : 296,
					y : 557,
					index : 2
				}, {
					x : 92,
					y : 568,
					index : 3
				}, {
					x : 102,
					y : 196,
					index : 4
				}, {
					x : 372,
					y : 365,
					index : 5
				}, {
					x : 489,
					y : 183,
					index : 6
				}, {
					x : 480,
					y : 294,
					index : 7
				}];
			} else if (sequence == 5) {
				var result = [{
					x : 385,
					y : 375,
					index : 0
				}, {
					x : 483,
					y : 381,
					index : 1
				}, {
					x : 390,
					y : 467,
					index : 2
				}, {
					x : 472,
					y : 554,
					index : 3
				}, {
					x : 188,
					y : 547,
					index : 4
				}, {
					x : 195,
					y : 454,
					index : 5
				}, {
					x : 100,
					y : 377,
					index : 6
				}, {
					x : 384,
					y : 194,
					index : 7
				}];
			} else if (sequence == 6) {
				var result = [{
					x : 482,
					y : 546,
					index : 0
				}, {
					x : 388,
					y : 460,
					index : 1
				}, {
					x : 482,
					y : 273,
					index : 2
				}, {
					x : 286,
					y : 269,
					index : 3
				}, {
					x : 93,
					y : 188,
					index : 4
				}, {
					x : 93,
					y : 280,
					index : 5
				}, {
					x : 102,
					y : 360,
					index : 6
				}, {
					x : 280,
					y : 457,
					index : 7
				}];
			} else if (sequence == 7) {
				var result = [{
					x : 489,
					y : 178,
					index : 0
				}, {
					x : 483,
					y : 470,
					index : 1
				}, {
					x : 391,
					y : 554,
					index : 2
				}, {
					x : 388,
					y : 462,
					index : 3
				}, {
					x : 90,
					y : 553,
					index : 4
				}, {
					x : 91,
					y : 453,
					index : 5
				}, {
					x : 85,
					y : 264,
					index : 6
				}, {
					x : 180,
					y : 291,
					index : 7
				}];
			} else if (sequence == 8) {
				var result = [{
					x : 293,
					y : 177,
					index : 0
				}, {
					x : 470,
					y : 194,
					index : 1
				}, {
					x : 286,
					y : 273,
					index : 2
				}, {
					x : 481,
					y : 361,
					index : 3
				}, {
					x : 472,
					y : 442,
					index : 4
				}, {
					x : 384,
					y : 359,
					index : 5
				}, {
					x : 394,
					y : 450,
					index : 6
				}, {
					x : 100,
					y : 442,
					index : 7
				}];
			} else if (sequence == 9) {
				var result = [{
					x : 288,
					y : 185,
					index : 0
				}, {
					x : 472,
					y : 180,
					index : 1
				}, {
					x : 478,
					y : 365,
					index : 2
				}, {
					x : 479,
					y : 441,
					index : 3
				}, {
					x : 277,
					y : 445,
					index : 4
				}, {
					x : 97,
					y : 444,
					index : 5
				}, {
					x : 90,
					y : 370,
					index : 6
				}, {
					x : 294,
					y : 358,
					index : 7
				}];
			} else if (sequence == 10) {
				var result = [{
					x : 92,
					y : 364,
					index : 0
				}, {
					x : 88,
					y : 449,
					index : 1
				}, {
					x : 289,
					y : 444,
					index : 2
				}, {
					x : 483,
					y : 457,
					index : 3
				}, {
					x : 96,
					y : 270,
					index : 4
				}, {
					x : 295,
					y : 268,
					index : 5
				}, {
					x : 474,
					y : 277,
					index : 6
				}, {
					x : 393,
					y : 180,
					index : 7
				}];
			} else if (sequence == 11) {
				var result = [{
					x : 575,
					y : 448,
					index : 0
				}, {
					x : 396,
					y : 451,
					index : 1
				}, {
					x : 293,
					y : 452,
					index : 2
				}, {
					x : 382,
					y : 359,
					index : 3
				}, {
					x : 296,
					y : 269,
					index : 4
				}, {
					x : 292,
					y : 184,
					index : 5
				}, {
					x : 392,
					y : 194,
					index : 6
				}, {
					x : 487,
					y : 193,
					index : 7
				}];
			} else if (sequence == 12) {
				var result = [{
					x : 552,
					y : 284,
					index : 0
				}, {
					x : 299,
					y : 293,
					index : 1
				}, {
					x : 288,
					y : 372,
					index : 2
				}, {
					x : 477,
					y : 380,
					index : 3
				}, {
					x : 560,
					y : 374,
					index : 4
				}, {
					x : 577,
					y : 480,
					index : 5
				}, {
					x : 283,
					y : 447,
					index : 6
				}, {
					x : 377,
					y : 653,
					index : 7
				}];
			} else if (sequence == 13) {
				var result = [{
					x : 183,
					y : 557,
					index : 0
				}, {
					x : 479,
					y : 546,
					index : 1
				}, {
					x : 278,
					y : 463,
					index : 2
				}, {
					x : 83,
					y : 363,
					index : 3
				}, {
					x : 422,
					y : 348,

					index : 4
				}, {
					x : 375,
					y : 186,
					index : 5
				}, {
					x : 279,
					y : 187,
					index : 6
				}, {
					x : 198,
					y : 179,
					index : 7
				}];

			} else if (sequence == 14) {
				var result = [{
					x : 278,
					y : 639,
					index : 0
				}, {
					x : 387,
					y : 641,
					index : 1
				}, {
					x : 372,
					y : 468,
					index : 2
				}, {
					x : 293,
					y : 483,
					index : 3
				}, {
					x : 187,
					y : 469,
					index : 4
				}, {
					x : 191,
					y : 183,
					index : 5
				}, {
					x : 295,
					y : 183,
					index : 6
				}, {
					x : 477,
					y : 177,
					index : 7
				}];
			} else if (sequence == 15) {
				var result = [{
					x : 373,
					y : 177,
					index : 0
				}, {
					x : 475,
					y : 268,
					index : 1
				}, {
					x : 289,
					y : 270,
					index : 2
				}, {
					x : 99,
					y : 274,
					index : 3
				}, {
					x : 186,
					y : 465,
					index : 4
				}, {
					x : 279,
					y : 458,
					index : 5
				}, {
					x : 296,
					y : 544,
					index : 6
				}, {
					x : 193,
					y : 553,
					index : 7
				}];
			}

		} else {
			if (sequence == 1) {
				var result = [{
					x : 278,
					y : 81,
					index : 0
				}, {
					x : 184,
					y : 90,
					index : 1
				}, {
					x : 96,
					y : 84,
					index : 2
				}, {
					x : 195,
					y : 169,
					index : 3
				}, {
					x : 272,
					y : 180,
					index : 4
				}, {
					x : 97,
					y : 353,
					index : 5
				}, {
					x : 188,
					y : 339,
					index : 6
				}, {
					x : 285,
					y : 347,
					index : 7
				}];
			} else if (sequence == 2) {
				var result = [{
					x : 94,
					y : 346,
					index : 0
				}, {
					x : 179,
					y : 346,
					index : 1
				}, {
					x : 270,
					y : 338,
					index : 2
				}, {
					x : 270,
					y : 259,
					index : 3
				}, {
					x : 95,
					y : 175,
					index : 4
				}, {
					x : 195,
					y : 171,
					index : 5
				}, {
					x : 189,
					y : 80,
					index : 6
				}, {
					x : 287,
					y : 92,
					index : 7
				}];
			} else if (sequence == 3) {
				var result = [{
					x : 272,
					y : 253,
					index : 0
				}, {
					x : 281,
					y : 347,
					index : 1
				}, {
					x : 100,
					y : 338,
					index : 2
				}, {
					x : 96,
					y : 254,
					index : 3
				}, {
					x : 279,
					y : 165,
					index : 4
				}, {
					x : 96,
					y : 96,
					index : 5
				}, {
					x : 189,
					y : 88,
					index : 6
				}, {
					x : 271,
					y : 85,
					index : 7
				}];
			} else if (sequence == 4) {
				var result = [{
					x : 275,
					y : 252,
					index : 0
				}, {
					x : 192,
					y : 341,
					index : 1
				}, {
					x : 196,
					y : 257,
					index : 2
				}, {
					x : 92,
					y : 268,
					index : 3
				}, {
					x : 102,
					y : 96,
					index : 4
				}, {
					x : 272,
					y : 165,
					index : 5
				}, {
					x : 189,
					y : 83,
					index : 6
				}, {
					x : 280,
					y : 94,
					index : 7
				}];
			} else if (sequence == 5) {
				var result = [{
					x : 185,
					y : 175,
					index : 0
				}, {
					x : 283,
					y : 181,
					index : 1
				}, {
					x : 190,
					y : 267,
					index : 2
				}, {
					x : 272,
					y : 354,
					index : 3
				}, {
					x : 88,
					y : 347,
					index : 4
				}, {
					x : 95,
					y : 254,
					index : 5
				}, {
					x : 100,
					y : 177,
					index : 6
				}, {
					x : 184,
					y : 94,
					index : 7
				}];
			} else if (sequence == 6) {
				var result = [{
					x : 282,
					y : 346,
					index : 0
				}, {
					x : 188,
					y : 260,
					index : 1
				}, {
					x : 282,
					y : 173,
					index : 2
				}, {
					x : 186,
					y : 169,
					index : 3
				}, {
					x : 93,
					y : 88,
					index : 4
				}, {
					x : 93,
					y : 180,
					index : 5
				}, {
					x : 102,
					y : 260,
					index : 6
				}, {
					x : 180,
					y : 357,
					index : 7
				}];
			} else if (sequence == 7) {
				var result = [{
					x : 289,
					y : 78,
					index : 0
				}, {
					x : 283,
					y : 270,
					index : 1
				}, {
					x : 191,
					y : 354,
					index : 2
				}, {
					x : 188,
					y : 262,
					index : 3
				}, {
					x : 90,
					y : 353,
					index : 4
				}, {
					x : 91,
					y : 253,
					index : 5
				}, {
					x : 85,
					y : 164,
					index : 6
				}, {
					x : 180,
					y : 91,
					index : 7
				}];
			} else if (sequence == 8) {
				var result = [{
					x : 193,
					y : 77,
					index : 0
				}, {
					x : 270,
					y : 94,
					index : 1
				}, {
					x : 186,
					y : 173,
					index : 2
				}, {
					x : 281,
					y : 261,
					index : 3
				}, {
					x : 272,
					y : 342,
					index : 4
				}, {
					x : 184,
					y : 259,
					index : 5
				}, {
					x : 194,
					y : 350,
					index : 6
				}, {
					x : 100,
					y : 342,
					index : 7
				}];
			} else if (sequence == 9) {
				var result = [{
					x : 188,
					y : 85,
					index : 0
				}, {
					x : 272,
					y : 80,
					index : 1
				}, {
					x : 278,
					y : 265,
					index : 2
				}, {
					x : 279,
					y : 341,
					index : 3
				}, {
					x : 177,
					y : 345,
					index : 4
				}, {
					x : 97,
					y : 344,
					index : 5
				}, {
					x : 90,
					y : 270,
					index : 6
				}, {
					x : 194,
					y : 258,
					index : 7
				}];
			} else if (sequence == 10) {
				var result = [{
					x : 92,
					y : 264,
					index : 0
				}, {
					x : 88,
					y : 349,
					index : 1
				}, {
					x : 189,
					y : 344,
					index : 2
				}, {
					x : 283,
					y : 357,
					index : 3
				}, {
					x : 96,
					y : 170,
					index : 4
				}, {
					x : 195,
					y : 168,
					index : 5
				}, {
					x : 274,
					y : 177,
					index : 6
				}, {
					x : 193,
					y : 80,
					index : 7
				}];
			} else if (sequence == 11) {
				var result = [{
					x : 275,
					y : 348,
					index : 0
				}, {
					x : 196,
					y : 351,
					index : 1
				}, {
					x : 193,
					y : 252,
					index : 2
				}, {
					x : 182,
					y : 179,
					index : 3
				}, {
					x : 96,
					y : 169,
					index : 4
				}, {
					x : 92,
					y : 84,
					index : 5
				}, {
					x : 192,
					y : 94,
					index : 6
				}, {
					x : 287,
					y : 93,
					index : 7
				}];
			} else if (sequence == 12) {
				var result = [{
					x : 282,
					y : 84,
					index : 0
				}, {
					x : 99,
					y : 93,
					index : 1
				}, {
					x : 88,
					y : 172,
					index : 2
				}, {
					x : 191,
					y : 174,
					index : 3
				}, {
					x : 277,
					y : 180,

					index : 4
				}, {
					x : 285,
					y : 258,
					index : 5
				}, {
					x : 83,
					y : 347,
					index : 6
				}, {
					x : 177,
					y : 253,
					index : 7
				}];
			} else if (sequence == 13) {
				var result = [{
					x : 83,
					y : 357,
					index : 0
				}, {
					x : 179,
					y : 346,
					index : 1
				}, {
					x : 178,
					y : 263,
					index : 2
				}, {
					x : 83,
					y : 263,
					index : 3
				}, {
					x : 272,
					y : 168,

					index : 4
				}, {
					x : 275,
					y : 86,
					index : 5
				}, {
					x : 179,
					y : 87,
					index : 6
				}, {
					x : 98,
					y : 79,
					index : 7
				}];

			} else if (sequence == 14) {
				var result = [{
					x : 178,
					y : 339,
					index : 0
				}, {
					x : 287,
					y : 341,
					index : 1
				}, {
					x : 272,
					y : 168,
					index : 2
				}, {
					x : 193,
					y : 183,
					index : 3
				}, {
					x : 87,
					y : 169,
					index : 4
				}, {
					x : 91,
					y : 83,
					index : 5
				}, {
					x : 195,
					y : 83,
					index : 6
				}, {
					x : 277,
					y : 77,
					index : 7
				}];
			} else if (sequence == 15) {
				var result = [{
					x : 273,
					y : 77,
					index : 0
				}, {
					x : 275,
					y : 168,
					index : 1
				}, {
					x : 189,
					y : 170,
					index : 2
				}, {
					x : 99,
					y : 174,
					index : 3
				}, {
					x : 86,
					y : 265,
					index : 4
				}, {
					x : 179,
					y : 258,
					index : 5
				}, {
					x : 196,
					y : 344,
					index : 6
				}, {
					x : 93,
					y : 353,
					index : 7
				}];
			}

		}

		return result;
	} catch(ex) {
		commonFunctions.handleException("trailsbNonOverlap", "getRandomPosition", ex);
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

	endTime = new Date().toUTCString();
	if (lineRoutArray.length != 0) {
		lineRoutArrayFull.push({
			"Routes" : lineRoutArray,

		});
		lineRoutArray = [];
	}
	getValues();
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

				testX = outerViewPoint.x;
				testY = outerViewPoint.y;
				var devFactor = 1;
				if (OS_ANDROID) {
					devFactor = Alloy.Globals.DPIFactor;
				}
				for (var i = 0; i < tempArrPositions.length; i++) {

					if (pointInCircle(outerViewPoint.x / devFactor, outerViewPoint.y / devFactor, tempArrPositions[i].x, tempArrPositions[i].y, pointRadius) && tempArrPositions[i].index != 0) {

						if (tempArrPositions[i].index == targetIndex && lineStartIndex == previousCorrectCircleIndex) {

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

									lineRoutArray = [];
								}
								Ti.API.info('lineRoutArrayFull Final : ', lineRoutArrayFull);
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
								commonDB.insertGameScore(15, gameScore, gamePoints, points);

								var timeDiff = commonFunctions.getMinuteSecond(startTime, endTime);
								StatusType = 2;

								Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scoreScreen', {
									"GameID" : 15,
									"GameScore" : gameScore,
									"GameType" : 1,
									"GameName" : commonFunctions.L('trailsBTestNew', LangCode)

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

							}

							removeAllWhiteLines();

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
		commonFunctions.handleException("trailsbNonOverlap", "touchmove", ex);
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

		if (totalgameAttempt < 7) {
			var gameScore = Math.round((correctLines / 7) * 100);
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
			"Version" : sNumber,
			"StatusType" : StatusType,
			"IsNotificationGame" : notificationGame,
			"AdminBatchSchID" : args.isBatch == true ? args.testID : 0,
			"SpinWheelScore" : spinWheelScore
		};
		Ti.API.info('**** resultParameter SpinWheelScore **** = ' + resultParameter.SpinWheelScore);
		commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
		serviceManager.saveTrailsBGameNew(resultParameter, onSaveTrailsBGameSuccess, onSaveTrailsBGameFailure);
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
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('trailsbNonOverlap');
					commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

				} else {
					var diff = 0;
					var curTime = new Date().getTime();
					var setTime = Ti.App.Properties.getString('EnvTime', "");
					if (setTime != "") {
						diff = curTime - setTime;
					}
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('trailsbNonOverlap');
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
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('trailsbNonOverlap');
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
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('trailsbNonOverlap');
			commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

		} else {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('trailsbNonOverlap');
			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
				parentWindow.window.refreshHomeScreen();
			}
		}
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('trailsbNonOverlap');
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

		return positionsArray;
	} catch(ex) {
		commonFunctions.handleException("trailsbNonOverlap", "generatePositionsArray", ex);
	}
}

$.contentView.addEventListener("touchend", function(e) {
	try {
		isEnd = true;
		touchEnd = true;
		if (lastFinishedIndex == 0)
			isBegin = 0;
		removeAllWhiteLines();

		TestLine = null;
		xValue = 0;
		yValue = 0;
	} catch(ex) {
		commonFunctions.handleException("trailsbNonOverlap", "touchend", ex);
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
			commonDB.insertGameScore(15, gameScore, gamePoints, points);

			var timeDiff = commonFunctions.getMinuteSecond(startTime, endTime);

			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scoreScreen', {
				"GameID" : 15,
				"GameScore" : gameScore,
				"GameType" : 1,
				"GameName" : commonFunctions.L('trailsBTestNew', LangCode)

			});
		}

		timer -= 1;

	}, 1000);
}

function undoClick(e) {

	if ($.contentView.children && $.contentView.children.length > 0) {
		// Make a copy of the array
		var children = $.contentView.children.slice(0);
		var numChildren = children.length;

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
		setLabel();
		if (countDownTimer != null) {
			clearInterval(countDownTimer);
		}
		sNumber = Ti.App.Properties.getString("trailsbSequence", "");
		if (sNumber == "") {
			Ti.App.Properties.setString('trailsbSequence', 2);
			sNumber = 1;
		} else if (sNumber == 1 || sNumber == "1") {
			Ti.App.Properties.setString('trailsbSequence', 2);
		} else if (sNumber == 2 || sNumber == "2") {
			Ti.App.Properties.setString('trailsbSequence', 3);
		} else if (sNumber == 3 || sNumber == "3") {
			Ti.App.Properties.setString('trailsbSequence', 4);
		} else if (sNumber == 4 || sNumber == "4") {
			Ti.App.Properties.setString('trailsbSequence', 5);
		} else if (sNumber == 5 || sNumber == "5") {
			Ti.App.Properties.setString('trailsbSequence', 6);
		} else if (sNumber == 6 || sNumber == "6") {
			Ti.App.Properties.setString('trailsbSequence', 7);
		} else if (sNumber == 7 || sNumber == "7") {
			Ti.App.Properties.setString('trailsbSequence', 8);
		} else if (sNumber == 8 || sNumber == "8") {
			Ti.App.Properties.setString('trailsbSequence', 9);
		} else if (sNumber == 9 || sNumber == "9") {
			Ti.App.Properties.setString('trailsbSequence', 10);
		} else if (sNumber == 10 || sNumber == "10") {
			Ti.App.Properties.setString('trailsbSequence', 11);
		} else if (sNumber == 11 || sNumber == "11") {
			Ti.App.Properties.setString('trailsbSequence', 12);
		} else if (sNumber == 12 || sNumber == "12") {
			Ti.App.Properties.setString('trailsbSequence', 13);
		} else if (sNumber == 13 || sNumber == "13") {
			Ti.App.Properties.setString('trailsbSequence', 14);
		} else if (sNumber == 14 || sNumber == "14") {
			Ti.App.Properties.setString('trailsbSequence', 15);
		} else if (sNumber == 15 || sNumber == "15") {
			Ti.App.Properties.setString('trailsbSequence', 1);
		}

		startTimer();
		createGame();

	} catch(ex) {
		commonFunctions.handleException("trailsbNonOverlap", "restartClick", ex);
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