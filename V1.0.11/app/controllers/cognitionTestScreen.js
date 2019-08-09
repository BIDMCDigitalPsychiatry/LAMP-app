// Arguments passed into this controller can be accessed via the `$.args` object directly or:
/**
 * variable declaration
 */
var args = $.args;
var currentFooterTab = 2;
var gameName;
var nbackLbl;
var commonFunctions = require('commonFunctions');
var commonDB = require('commonDB');
var LangCode = Ti.App.Properties.getString('languageCode');

/**
 * Function for window open
 */
$.cognitionTestScreen.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
				$.supportLabel.bottom = "17dp";
				$.contentInnerView.bottom = "29dp";
			}
		}
		$.headerView.setTitle(commonFunctions.L('cognitionTestTitle', LangCode));
		$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
		$.memoryGameLabel.text = commonFunctions.L('memoryGame', LangCode);
		$.mindGameLabel.text = commonFunctions.L('attentionGame', LangCode);
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

		var memoryGameList = [{
			gameName : commonFunctions.L('nbackTest', LangCode) ,
		}, {
			gameName : commonFunctions.L('spatialFrwd', LangCode),
		}, {
			gameName : commonFunctions.L('spatialBckwrd', LangCode),
		}, {
			gameName : commonFunctions.L('memoryTest', LangCode),
		}, {
			gameName : commonFunctions.L('serial7', LangCode),
		}, {
			gameName : commonFunctions.L('visualGame', LangCode),
		}, {
			gameName : commonFunctions.L('digitFWrd', LangCode),
		}, {
			gameName : commonFunctions.L('digitBckWrd', LangCode),
		}, {
			gameName : commonFunctions.L('catdog', LangCode),
		}, {
			gameName : commonFunctions.L('temporalOrder', LangCode),
		}, {
			gameName : commonFunctions.L('nbackTestNew', LangCode)
		}];

		for (var i = 0; i < memoryGameList.length; i += 2) {

			var boxVisible = true;

			if (i + 1 >= memoryGameList.length) {
				boxVisible = false;
				var rightName = "";

			} else {
				var rightName = memoryGameList[i + 1].gameName;
			}

			surveyArray.push({
				template : "surveyListTemplate",
				gameNameLabel1 : {
					text : memoryGameList[i].gameName
				},
				gameNameLabel2 : {
					text : rightName
				},
				gameNameViewRight : {
					visible : boxVisible
				}

			});
		};

		$.lstSection.setItems(surveyArray);

		var mindGameArray = [];

		var mindGameList = [{
			gameName : commonFunctions.L('trailsBTestNew', LangCode),
		}, {
			gameName : commonFunctions.L('trailsBTouch', LangCode),
		}, {
			gameName : commonFunctions.L('jwelA', LangCode),
		}, {
			gameName : commonFunctions.L('jwelB', LangCode),
		}, {
			gameName : commonFunctions.L('trailsBTest', LangCode),
		}, {
			gameName : commonFunctions.L('figCopy', LangCode)
		}];

		for (var i = 0; i < mindGameList.length; i += 2) {

			var boxVisible = true;

			if (i + 1 >= mindGameList.length) {
				boxVisible = false;
				var rightName = "";

			} else {
				var rightName = mindGameList[i + 1].gameName;
			}

			mindGameArray.push({
				template : "mindGameTemplate",
				mindGameLabel1 : {
					text : mindGameList[i].gameName
				},
				mindGameLabel2 : {
					text : rightName
				},
				mindGameViewRight : {
					visible : boxVisible
				}

			});
		};

		$.mindSelection.setItems(mindGameArray);
	} catch(ex) {
		commonFunctions.handleException("cognitionTestScreen", "loadGame", ex);
	}

}

/**
 * function for start Memory Game
 */
function onStartMemoryGame(e) {
	Ti.API.info('onStartMemoryGame : ', JSON.stringify(e));
	if (e.itemIndex == 0) {
		if (e.bindId == "gameNameViewLeft" || e.bindId == "gameNameLabel1") {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
				'gameID' : 1,
			});

		} else if (e.bindId == "gameNameViewRight" || e.bindId == "gameNameLabel2") {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
				'gameID' : 3,
			});

		}

	} else if (e.itemIndex == 1) {
		if (e.bindId == "gameNameViewLeft" || e.bindId == "gameNameLabel1") {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
				'gameID' : 4,
			});

		} else if (e.bindId == "gameNameViewRight" || e.bindId == "gameNameLabel2") {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
				'gameID' : 5,
			});

		}

	} else if (e.itemIndex == 2) {
		if (e.bindId == "gameNameViewLeft" || e.bindId == "gameNameLabel1") {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
				'gameID' : 6,
			});

		} else if (e.bindId == "gameNameViewRight" || e.bindId == "gameNameLabel2") {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
				'gameID' : 8,
			});

		}

	} else if (e.itemIndex == 3) {
		if (e.bindId == "gameNameViewLeft" || e.bindId == "gameNameLabel1") {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
				'gameID' : 9,
			});

		} else if (e.bindId == "gameNameViewRight" || e.bindId == "gameNameLabel2") {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
				'gameID' : 10,
			});

		}

	} else if (e.itemIndex == 4) {
		if (e.bindId == "gameNameViewLeft" || e.bindId == "gameNameLabel1") {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
				'gameID' : 11,
			});

		} else if (e.bindId == "gameNameViewRight" || e.bindId == "gameNameLabel2") {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
				'gameID' : 12,
			});

		}

	} else if (e.itemIndex == 5) {
		if (e.bindId == "gameNameViewLeft" || e.bindId == "gameNameLabel1") {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
				'gameID' : 14,
			});
		}
	}
}

/**
 * function for start Attention Game
 */
function onStartAttentionGame(e) {
	Ti.API.info('onStartAttentionGame : ', JSON.stringify(e));
	if (e.itemIndex == 0) {
		if (e.bindId == "mindGameViewLeft" || e.bindId == "mindGameLabel1") {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
				'gameID' : 13,
			});

		} else if (e.bindId == "mindGameViewRight" || e.bindId == "mindGameLabel2") {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
				'gameID' : 15,
			});

		}

	} else if (e.itemIndex == 1) {
		if (e.bindId == "mindGameViewLeft" || e.bindId == "mindGameLabel1") {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsIntro');

		} else if (e.bindId == "mindGameViewRight" || e.bindId == "mindGameLabel2") {

			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsIntroB');
		}

	} else if (e.itemIndex == 2) {
		if (e.bindId == "mindGameViewLeft" || e.bindId == "mindGameLabel1") {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
				'gameID' : 2,
			});

		} else if (e.bindId == "mindGameViewRight" || e.bindId == "mindGameLabel2") {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionInstruction', {
				'gameID' : 7,
			});

		}

	}
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

/**
 * goBack function handler
 */

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
