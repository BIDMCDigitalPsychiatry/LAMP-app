// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = $.args;
var commonFunctions = require('commonFunctions');
var commonDB = require('commonDB');
var LangCode = Ti.App.Properties.getString('languageCode');

$.nBackLevelNew.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
			}
		}
		$.headerView.setTitle(commonFunctions.L('nbackNewLvl', LangCode));
		loadLevel();
	} catch(ex) {
		commonFunctions.handleException("cognitionTestScreen", "open", ex);
	}
});
$.nBackLevelNew.addEventListener('android:back', function() {
	goBack();
});
/**
 * on back button click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
function loadLevel() {
	try {
		var gameResults = commonDB.getGameScore();
		var surveyArray = [];

		var gameList = [{
			gameName : commonFunctions.L('oneBackTest', LangCode),
			score : 0,
			visible : true
		}, {
			gameName : commonFunctions.L('twoBackTest', LangCode),
			score : 0,
			visible : true
		}, {
			gameName : commonFunctions.L('treeBackTest', LangCode),
			score : 0,
			visible : true
		}];
		for (var i = 0; i < gameResults.length; i++) {
			if (gameResults[i].gameID == 15) {
				gameList[0].score = gameResults[i].score;
			}

		};

		for (var i = 0; i < gameList.length; i++) {

			surveyArray.push({
				template : "surveyListTemplate",
				gameNameLabel : {
					text : gameList[i].gameName
				},
				startLabel : {
					text : commonFunctions.L('startGameLabel', LangCode)
				},
			});
		};
		$.lstSection.setItems(surveyArray);
	} catch(ex) {
		commonFunctions.handleException("cognitionTestScreen", "loadGame", ex);
	}

}

/**
 * on back button click
 */
$.headerView.on('backButtonClick', function(e) {
	goBack();
});
function goBack(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('nBackLevelNew');
	var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
		parentWindow.window.refreshHomeScreen();
	}
}

/**
 * function for start game
 */
function onStartGame(e) {
	if (e.itemIndex == 0) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTestNew', {
			"Level" : 1,
			"isBatch" : args.isBatch,
			"testID" : args.testID,
			"fromNotification" : args.fromNotification,
			"createdDate" : args.createdDate,
			"isLocal" : args.isLocal
		});
	} else if (e.itemIndex == 1) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTestNew', {
			"Level" : 2,
			"isBatch" : args.isBatch,
			"testID" : args.testID,
			"fromNotification" : args.fromNotification,
			"createdDate" : args.createdDate,
			"isLocal" : args.isLocal
		});
	} else if (e.itemIndex == 2) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTestNew', {
			"Level" : 3,
			"isBatch" : args.isBatch,
			"testID" : args.testID,
			"fromNotification" : args.fromNotification,
			"createdDate" : args.createdDate,
			"isLocal" : args.isLocal
		});
	}

}
