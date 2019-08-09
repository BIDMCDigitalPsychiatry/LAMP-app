// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
/**
 * variable declaration
 */
var credentials = Alloy.Globals.getCredentials();
var currentFooterTab = 2;
var gameName;
var gameStatus;
var nbackLbl;
var commonFunctions = require('commonFunctions');
var commonDB = require('commonDB');
var LangCode = Ti.App.Properties.getString('languageCode');
var mindGameList = [];
var memoryGameList = [];
var arrayOfRemovedGames = [];
var arrayOfRemovedMindGames = [];
var gameIcon;
var gameID;
var clickedIndex = 0;

/**
 * Function for window open
 */
$.cognitionTestScreen.addEventListener("open", function(e) {
	try {

		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
				$.supportLabel.bottom = "30dp";
				$.contentView.bottom = "55dp";
			}
		}
		$.headerView.setTitle(commonFunctions.L('cognitionTestTitle', LangCode));
		$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
		$.instLabel.text = commonFunctions.L('instructionLbl', LangCode);
		$.jewelScoreLabel.text = commonFunctions.L('totalScoreLbl', LangCode);
		$.difficultyLabel.text = commonFunctions.L('difficultyLbl', LangCode);
		$.popupstartLabel.text = commonFunctions.L('instructionsubmit', LangCode);
		loadGame();
	} catch(ex) {
		commonFunctions.handleException("cognitionTestScreen", "open", ex);
	}
});

/**
 * Function for loading games
 */
function loadGame() {
	try {

		var surveyArray = [];
		var gameResults = commonDB.getGameScore();
		$.headerView.setTitle(commonFunctions.L('cognitionTestTitle', LangCode));

		var toggleMemoryGames = Ti.App.Properties.getObject('toggleCognitionGames');
		arrayOfRemovedGames = toggleMemoryGames.gameArray;

		memoryGameList = [{
			gameName : commonFunctions.L('nbackTest', LangCode),
			gameIcon : "/images/gameIcons/C1.png",
			gameID : 1
		}, {
			gameName : commonFunctions.L('spatialFrwd', LangCode),
			gameIcon : "/images/gameIcons/C3.png",
			gameID : 3
		}, {
			gameName : commonFunctions.L('spatialBckwrd', LangCode),
			gameIcon : "/images/gameIcons/C4.png",
			gameID : 4
		}, {
			gameName : commonFunctions.L('memoryTest', LangCode),
			gameIcon : "/images/gameIcons/C5.png",
			gameID : 5
		}, {
			gameName : commonFunctions.L('serial7', LangCode),
			gameIcon : "/images/gameIcons/C6.png",
			gameID : 6
		}, {
			gameName : commonFunctions.L('visualGame', LangCode),
			gameIcon : "/images/gameIcons/C9.png",
			gameID : 9
		}, {
			gameName : commonFunctions.L('temporalOrder', LangCode),
			gameIcon : "/images/gameIcons/C12.png",
			gameID : 12
		}, {
			gameName : commonFunctions.L('digitFWrd', LangCode),
			gameIcon : "/images/gameIcons/C10.png",
			gameID : 10
		}, {
			gameName : commonFunctions.L('digitBckWrd', LangCode),
			gameIcon : "/images/gameIcons/C13.png",
			gameID : 13
		}, {
			gameName : commonFunctions.L('catdog', LangCode),
			gameIcon : "/images/gameIcons/C11.png",
			gameID : 11
		}, {
			gameName : commonFunctions.L('nbackTestNew', LangCode),
			gameIcon : "/images/gameIcons/C14.png",
			gameID : 14
		}, {
			gameName : commonFunctions.L('trailsBTestNew', LangCode),
			gameIcon : "/images/gameIcons/C15.png",
			gameID : 15
		}, {
			gameName : commonFunctions.L('trailsBTouch', LangCode),
			gameIcon : "/images/gameIcons/C16.png",
			gameID : 16
		}, {
			gameName : commonFunctions.L('jwelA', LangCode),
			gameIcon : "/images/gameIcons/C17.png",
			gameID : 17
		}, {
			gameName : commonFunctions.L('jwelB', LangCode),
			gameIcon : "/images/gameIcons/C18.png",
			gameID : 18
		}, {
			gameName : commonFunctions.L('trailsBTest', LangCode),
			gameIcon : "/images/gameIcons/C2.png",
			gameID : 2
		}, {
			gameName : commonFunctions.L('figCopy', LangCode),
			gameIcon : "/images/gameIcons/C8.png",
			gameID : 8
		}];

		for (var i = 0; i < arrayOfRemovedGames.length; i++) {
			for (var j = 0; j < memoryGameList.length; j++) {
				if (memoryGameList[j].gameID == arrayOfRemovedGames[i]) {
					memoryGameList.splice(j, 1);
				}
			};

		};
		for (var i = 0; i < memoryGameList.length; i++) {
			var fileName = "C" + memoryGameList[i].gameID + ".png";
			var cogGameIcon = memoryGameList[i].gameIcon;

			var file = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
			if (file.exists() == true) {
				cogGameIcon = Ti.Filesystem.applicationDataDirectory + fileName;
			}
			var boxVisible = true;

			surveyArray.push({
				template : "surveyListTemplate",

				gameNameLabel : {
					text : memoryGameList[i].gameName
				},
				iconImage : {
					image : cogGameIcon
				}

			});
		};

		$.lstSection.setItems(surveyArray);
	} catch(ex) {
		commonFunctions.handleException("cognitionTestScreen", "loadGame", ex);
	}

}

function commentLabelDisplay() {
	$.contentLabel2.top = 0;
	$.contentLabel3.top = 0;
	$.contentLabel2.height = 0;
	$.contentLabel3.height = 0;
	$.contentLabel2.width = 0;
	$.contentLabel3.width = 0;
	$.contentLabel2.visible = false;
	$.contentLabel3.visible = false;
}

/**
 * function for start game
 */
function onStartMemoryGame(e) {
	clickedIndex = e.itemIndex;

	$.gameName.text = memoryGameList[e.itemIndex].gameName;
	var fileName = "C" + memoryGameList[e.itemIndex].gameID + ".png";
	var cognitionIcon = memoryGameList[e.itemIndex].gameIcon;

	var file = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
	if (file.exists() == true) {
		cognitionIcon = Ti.Filesystem.applicationDataDirectory + fileName;
	}
	$.gameIcon.image = cognitionIcon;

	if (memoryGameList[e.itemIndex].gameName == commonFunctions.L('nbackTest', LangCode)) {
		$.contentLabel2.top = "10dp";
		$.contentLabel3.top = "10dp";
		$.contentLabel2.visible = true;
		$.contentLabel3.visible = true;
		$.contentLabel2.height = Ti.UI.SIZE;
		$.contentLabel3.height = Ti.UI.SIZE;
		$.contentLabel2.width = Ti.UI.FILL;
		$.contentLabel3.width = Ti.UI.FILL;
		$.contentLabel.text = commonFunctions.L('nbackShortInst1', LangCode);
		$.contentLabel2.text = commonFunctions.L('nbackShortInst2', LangCode);
		$.contentLabel3.text = commonFunctions.L('nbackShortInst3', LangCode);
	} else if (memoryGameList[e.itemIndex].gameName == commonFunctions.L('spatialFrwd', LangCode)) {
		commentLabelDisplay();
		$.contentLabel.text = commonFunctions.L('SPFShortInst', LangCode);
	} else if (memoryGameList[e.itemIndex].gameName == commonFunctions.L('spatialBckwrd', LangCode)) {
		commentLabelDisplay();
		$.contentLabel.text = commonFunctions.L('SPBShortInst', LangCode);
	} else if (memoryGameList[e.itemIndex].gameName == commonFunctions.L('memoryTest', LangCode)) {
		commentLabelDisplay();
		$.contentLabel.text = commonFunctions.L('SimpleMemShortInst', LangCode);
	} else if (memoryGameList[e.itemIndex].gameName == commonFunctions.L('serial7', LangCode)) {
		commentLabelDisplay();
		$.contentLabel.text = commonFunctions.L('serial7ShortInst', LangCode);
	} else if (memoryGameList[e.itemIndex].gameName == commonFunctions.L('visualGame', LangCode)) {
		commentLabelDisplay();
		$.contentLabel.text = commonFunctions.L('visualShortInst', LangCode);
	} else if (memoryGameList[e.itemIndex].gameName == commonFunctions.L('digitFWrd', LangCode)) {
		commentLabelDisplay();
		$.contentLabel.text = commonFunctions.L('DSFShortInst', LangCode);
	} else if (memoryGameList[e.itemIndex].gameName == commonFunctions.L('digitBckWrd', LangCode)) {
		commentLabelDisplay();
		$.contentLabel.text = commonFunctions.L('DSBShortInst', LangCode);
	} else if (memoryGameList[e.itemIndex].gameName == commonFunctions.L('catdog', LangCode)) {
		commentLabelDisplay();
		$.contentLabel.text = commonFunctions.L('catsnDogsShortInst', LangCode);
	} else if (memoryGameList[e.itemIndex].gameName == commonFunctions.L('temporalOrder', LangCode)) {
		commentLabelDisplay();
		$.contentLabel.text = commonFunctions.L('tempShortInst', LangCode);
	} else if (memoryGameList[e.itemIndex].gameName == commonFunctions.L('nbackTestNew', LangCode)) {
		$.contentLabel2.top = "10dp";
		$.contentLabel3.top = "10dp";
		$.contentLabel2.height = Ti.UI.SIZE;
		$.contentLabel3.height = Ti.UI.SIZE;
		$.contentLabel2.width = Ti.UI.FILL;
		$.contentLabel3.width = Ti.UI.FILL;
		$.contentLabel2.visible = true;
		$.contentLabel3.visible = true;
		$.contentLabel.text = commonFunctions.L('nbackNewShortInst1', LangCode);
		$.contentLabel2.text = commonFunctions.L('nbackNewShortInst2', LangCode);
		$.contentLabel3.text = commonFunctions.L('nbackNewShortInst3', LangCode);
	} else if (memoryGameList[e.itemIndex].gameName == commonFunctions.L('trailsBTestNew', LangCode)) {
		commentLabelDisplay();
		$.contentLabel.text = commonFunctions.L('trialsbNewShortInst', LangCode);
	} else if (memoryGameList[e.itemIndex].gameName == commonFunctions.L('trailsBTouch', LangCode)) {
		commentLabelDisplay();
		$.contentLabel.text = commonFunctions.L('trialsBTouchShortInst', LangCode);
	} else if (memoryGameList[e.itemIndex].gameName == commonFunctions.L('jwelA', LangCode)) {
		commentLabelDisplay();
		$.contentLabel.text = commonFunctions.L('jewelsAShortInst', LangCode);
	} else if (memoryGameList[e.itemIndex].gameName == commonFunctions.L('jwelB', LangCode)) {
		commentLabelDisplay();
		$.contentLabel.text = commonFunctions.L('jewelsBShortInst', LangCode);
	} else if (memoryGameList[e.itemIndex].gameName == commonFunctions.L('trailsBTest', LangCode)) {
		commentLabelDisplay();
		$.contentLabel.text = commonFunctions.L('trialsBTestShortInst', LangCode);
	} else if (memoryGameList[e.itemIndex].gameName == commonFunctions.L('figCopy', LangCode)) {
		commentLabelDisplay();
		$.contentLabel.text = commonFunctions.L('figCopyShortInst', LangCode);
	}

	if (memoryGameList[e.itemIndex].gameName == commonFunctions.L('jwelA', LangCode) || memoryGameList[e.itemIndex].gameName == commonFunctions.L('jwelB', LangCode)) {
		if (commonFunctions.getIsTablet()) {
			$.difficultyButton.visible = true;
			$.scoreButton.visible = true;
			$.difficultyButton.height = "50dp";
			$.scoreButton.height = "50dp";
			$.difficultyButton.width = Ti.UI.FILL;
			$.scoreButton.width = Ti.UI.FILL;
			$.difficultyButton.top = "20dp";
			$.scoreButton.top = "20dp";
		} else {
			$.difficultyButton.visible = true;
			$.scoreButton.visible = true;
			$.difficultyButton.height = "40dp";
			$.scoreButton.height = "40dp";
			$.difficultyButton.width = Ti.UI.FILL;
			$.scoreButton.width = Ti.UI.FILL;
			$.difficultyButton.top = "10dp";
			$.scoreButton.top = "10dp";
		}

	} else {
		$.difficultyButton.visible = false;
		$.scoreButton.visible = false;
		$.difficultyButton.height = 0;
		$.scoreButton.height = 0;
		$.difficultyButton.width = 0;
		$.scoreButton.width = 0;
		$.difficultyButton.top = 0;
		$.scoreButton.top = 0;
	}

	$.overLayer.visible = true;
	$.popupView.visible = true;
}

/**
 * on back button click
 */
$.headerView.on('backButtonClick', function(e) {
	goBack();
});

/**
 * on right button click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});

function goBack(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
	var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
		parentWindow.window.refreshHomeScreen();
	}
}

/**
 * function for android back
 */
$.cognitionTestScreen.addEventListener('android:back', function() {
	goBack();
});

/**
 * Popup close click
 */
function overLayerClick() {
	$.overLayer.visible = false;
	$.popupView.visible = false;
}

/**
 * Open game instruction
 */
function openGameInstruction() {
	if (memoryGameList[clickedIndex].gameName == commonFunctions.L('nbackTest', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
			'gameID' : 1,
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('spatialFrwd', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
			'gameID' : 3,
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('spatialBckwrd', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
			'gameID' : 4,
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('memoryTest', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
			'gameID' : 5,
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('serial7', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
			'gameID' : 6,
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('visualGame', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
			'gameID' : 8,
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('digitFWrd', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
			'gameID' : 9,
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('digitBckWrd', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
			'gameID' : 10,
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('catdog', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
			'gameID' : 11,
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('temporalOrder', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
			'gameID' : 12,
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('nbackTestNew', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
			'gameID' : 14,
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('trailsBTestNew', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
			'gameID' : 13,
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('trailsBTouch', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
			'gameID' : 15,
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('jwelA', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
			'gameID' : 17,
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('jwelB', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
			'gameID' : 18,
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('trailsBTest', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
			'gameID' : 2,
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('figCopy', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
			'gameID' : 7,
		});
	}
}

/**
 * Open Games
 */

function startGameClick() {
	$.overLayer.visible = false;
	$.popupView.visible = false;
	if (memoryGameList[clickedIndex].gameName == commonFunctions.L('nbackTest', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackLevel');
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('spatialFrwd', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
			"isForward" : true
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('spatialBckwrd', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
			"isForward" : false
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('memoryTest', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('simpleMemoryTask');
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('serial7', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('serial7STestScreen');
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('visualGame', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('visualAssociation');
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('digitFWrd', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
			"isForward" : true
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('digitBckWrd', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
			"isForward" : false
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('catdog', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('catAndDogGameNew');
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('temporalOrder', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('temporalOrder');
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('nbackTestNew', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackLevelNew');
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('trailsBTestNew', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsbNonOverlap');
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('trailsBTouch', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsBNew');
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('jwelA', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsA', {
			'type' : 1,
			"isBatch" : "",
			"testID" : "",
			"fromNotification" : "",
			"createdDate" : "",
			"isLocal" : ""
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('jwelB', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsA', {
			'type' : 2,
			"isBatch" : "",
			"testID" : "",
			"fromNotification" : "",
			"createdDate" : "",
			"isLocal" : ""
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('trailsBTest', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsB');
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('figCopy', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('figureCopyScreen');
	}
}

/**
 * Select Difficult level in Jewels
 */
function onDifficultyClick(e) {
	if (memoryGameList[clickedIndex].gameName == commonFunctions.L('jwelA', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsDifficulty', {
			'type' : 1
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('jwelB', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsDifficulty', {
			'type' : 2
		});
	}

}

Ti.App.addEventListener('ReportClick', ReportClick);

function ReportClick(e) {
	if (memoryGameList[clickedIndex].gameName == commonFunctions.L('jwelA', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelGraph', {
			'type' : 1
		});
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('jwelB', LangCode)) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelGraph', {
			'type' : 2
		});
	}

}

/**
 * Jewels Score
 */
function onScoreClick(e) {
	if (memoryGameList[clickedIndex].gameName == commonFunctions.L('jwelA', LangCode)) {
		var totalCollectedJewels = 0;
		var totalCollectedBonus = 0;
		var totalColelctedScore = 0;
		var jewelInfo = commonDB.getJewelsCount(1);

		if (jewelInfo.length != 0) {
			totalCollectedJewels = jewelInfo[0].totalJewel;
			totalCollectedBonus = jewelInfo[0].totalBonus;
			totalColelctedScore = jewelInfo[0].totalScore;
		}
		if (totalCollectedBonus > Alloy.Globals.jewelsTrailMaxTotalScore) {
			totalCollectedBonus = Alloy.Globals.jewelsTrailMaxTotalScore;
		}
		if (totalCollectedJewels > Alloy.Globals.jewelsTrailMaxTotalScore) {
			totalCollectedJewels = Alloy.Globals.jewelsTrailMaxTotalScore;
		}

		var jewelInfo = Ti.App.Properties.getObject(credentials.userId.toString());
		var numberOfGames = jewelInfo.totalgamesTrailsA;
		if (totalColelctedScore != 0 && numberOfGames != 0) {
			var tempvalue = (totalColelctedScore / numberOfGames).toFixed(1);
		} else {
			var tempvalue = 0;
		}

		var totalScoreStr = "/" + Alloy.Globals.jewelsTrailMaxTotalScore;
		commonFunctions.getScoreViewJewelTotal(tempvalue + "%", totalCollectedBonus + totalScoreStr, totalCollectedJewels + totalScoreStr);
	} else if (memoryGameList[clickedIndex].gameName == commonFunctions.L('jwelB', LangCode)) {
		var totalCollectedJewels = 0;
		var totalCollectedBonus = 0;
		var totalColelctedScore = 0;
		if (totalCollectedBonus > Alloy.Globals.jewelsTrailMaxTotalScore) {
			totalCollectedBonus = Alloy.Globals.jewelsTrailMaxTotalScore;
		}
		if (totalCollectedJewels > Alloy.Globals.jewelsTrailMaxTotalScore) {
			totalCollectedJewels = Alloy.Globals.jewelsTrailMaxTotalScore;
		}
		var jewelInfo = Ti.App.Properties.getObject(credentials.userId.toString());
		var numberOfGames = jewelInfo.totalgamesTrailsB;
		if (totalColelctedScore != 0 && numberOfGames != 0) {
			var tempvalue = (totalColelctedScore / numberOfGames).toFixed(1);
		} else {
			var tempvalue = 0;
		}
		var totalScoreStr = "/" + Alloy.Globals.jewelsTrailMaxTotalScore;
		commonFunctions.getScoreViewJewelTotal(tempvalue + "%", totalCollectedBonus + totalScoreStr, totalCollectedJewels + totalScoreStr);
	}
}