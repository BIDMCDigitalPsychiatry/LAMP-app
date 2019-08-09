// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var commonFunctions = require('commonFunctions');
var memoryGameList = [];
var LangCode = Ti.App.Properties.getString('languageCode');
var gameList = [];
var welcomeGame;
/**
 * Open Window.
 */
$.welcomeContentScreen.addEventListener("open", function(e) {
	welcomeGame = Ti.App.Properties.getObject("welcomeGameInfo");
	gameList = welcomeGame.CognitionSettings;
	Ti.API.info('gameList', gameList);

	if (gameList != null || gameList != "") {
		$.contentView1.visible = false;
		$.gameList.visible = true;
		loadGame();

	} else {
		$.contentView1.visible = true;
		$.gameList.visible = false;
	}

});

/**
 * Function for loading games
 */
function loadGame() {
	try {
		var gameArray = [];
		

		for (var i = 0; i < gameList.length; i++) {
			if (gameList[i].Notification == 1) {

				//Ti.API.info('gameIcons', "/images/gameIcons/" + "C" + gameList[i].CTestID + ".png");

				gameArray.push({
					template : "gameListTemplate",

					gameNameLabel : {
						text : gameList[i].CTestName
					},
					iconImage : {
						image : "/images/gameIcons/" + "C" + gameList[i].CTestID + ".png"
					}

				});
			}
		}
		$.lstSection.setItems(gameArray);

	} catch(ex) {
		commonFunctions.handleException("welcomeContentScreen", "loadGame", ex);
	}
}

/**
 * function for android back
 */
$.welcomeContentScreen.addEventListener('android:back', function() {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('welcomeContentScreen');
});

/**
 * on back button click
 */

function onBackClick() {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('welcomeContentScreen');
}

/**
 * on next button click
 */
function onNextClick() {

	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('startScreen');
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('welcomeScreen');
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('welcomeContentScreen');
}