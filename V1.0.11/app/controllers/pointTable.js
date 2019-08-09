// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
/**
 * Declarations
 */
var args = $.args;
var commonDB = require('commonDB');
var credentials = Alloy.Globals.getCredentials();
var commonFunctions = require('commonFunctions');
var LangCode = Ti.App.Properties.getString('languageCode');

/**
 * function for screen open
 */
$.pointTable.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.outerView.top = "80dp";
				$.supportLabel.bottom = "17dp";
				$.contentView.bottom = "29dp";
			}
		}
		$.headerView.setTitle(commonFunctions.L('pointLbl', LangCode));
		$.gameTitle.text = commonFunctions.L('gameNameLbl', LangCode);
		$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
		$.pointTitle.text = commonFunctions.L('pointLbl', LangCode);
		$.figLbl.text = commonFunctions.L('figCopy', LangCode);
		$.nBackLbltitle.text = commonFunctions.L('nbackTest', LangCode);
		$.trailBLbl.text = commonFunctions.L('trailsBTest', LangCode);
		$.spanFrwdLbl.text = commonFunctions.L('spatialFrwd', LangCode);
		$.spanBackLbl.text = commonFunctions.L('spatialBckwrd', LangCode);
		$.memoryLbl.text = commonFunctions.L('memoryTest', LangCode);
		$.serialLbl.text = commonFunctions.L('serial7', LangCode);
		$.visualLblTitle.text = commonFunctions.L('visualGame', LangCode);
		$.digitFrwdLbl.text = commonFunctions.L('digitFWrd', LangCode);
		$.catDogLbl.text = commonFunctions.L('catdog', LangCode);
		$.tempOrderLbl.text = commonFunctions.L('temporalOrder', LangCode);
		$.digitBackLbl.text = commonFunctions.L('digitBckWrd', LangCode);
		$.nBackNewLbltitle.text = commonFunctions.L('nbackTestNew', LangCode);
		$.trailBNewLbl.text = commonFunctions.L('trailsBTestNew', LangCode);
		$.traildotLbl.text = commonFunctions.L('trailsBTouch', LangCode);
		$.jwelALbl.text = commonFunctions.L('jwelA', LangCode);
		$.jwelBLbl.text = commonFunctions.L('jwelB', LangCode);
		$.scartchLabl.text = commonFunctions.L('scratchCard', LangCode);
		$.surveyLblTitle.text = commonFunctions.L('surveyPointLbl', LangCode);
		var curLevel = Ti.App.Properties.getString("currentLevel");
		var totalPoint = Ti.App.Properties.getString("totalPoints");
		if (curLevel == "Level 1") {
			var remainPoint = 10 - parseInt(totalPoint);

		} else if (curLevel == "Level 2") {
			var remainPoint = 50 - parseInt(totalPoint);

		} else if (curLevel == "Level 3") {
			var remainPoint = 100 - parseInt(totalPoint);

		} else if (curLevel == "Level 4") {
			var remainPoint = 500 - parseInt(totalPoint);

		} else if (curLevel == "Level 5") {
			var remainPoint = 0;

		}
		if (remainPoint != 0) {
			$.remainPointLabel.text = commonFunctions.L('pointnextLvl', LangCode) + " " + remainPoint;
		} else {
			$.remainPointLabel.text = commonFunctions.L('maxLbl', LangCode);
		}

		var gameInfo = commonDB.getGameScore(credentials.userId);
		Ti.API.info('game info from DB is' + JSON.stringify(gameInfo));
		loadData(gameInfo);
	} catch(ex) {
		commonFunctions.handleException("manage", "open", ex);
	}

});

/***
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});

/**
 * function for loading data
 */
function loadData(gameInfo) {
	for (var i = 0; i < gameInfo.length; i++) {
		Ti.API.info('game is' + gameInfo[i].gameID);
		if (gameInfo[i].gameID == 1) {
			$.nBackLbl.value = gameInfo[i].points;
		} else if (gameInfo[i].gameID == 2) {
			$.trailsLbl.value = gameInfo[i].points;
		} else if (gameInfo[i].gameID == 3) {
			$.spatialFrwdLbl.value = gameInfo[i].points;
		} else if (gameInfo[i].gameID == 4) {
			$.spatialBackLbl.value = gameInfo[i].points;
		} else if (gameInfo[i].gameID == 5) {
			$.simpleMemoryLbl.value = gameInfo[i].points;
		} else if (gameInfo[i].gameID == 6) {
			$.serail7Lbl.value = gameInfo[i].points;
		} else if (gameInfo[i].gameID == 7) {
			//$.catDogLbl.value = gameInfo[i].points;
		} else if (gameInfo[i].gameID == 8) {
			$.FigLbl.value = gameInfo[i].points;
		} else if (gameInfo[i].gameID == 9) {
			$.visualLbl.value = gameInfo[i].points;
		} else if (gameInfo[i].gameID == 10) {
			$.digitSpanLbl.value = gameInfo[i].points;
		} else if (gameInfo[i].gameID == 11) {
			$.catdogNewLbl.value = gameInfo[i].points;
		} else if (gameInfo[i].gameID == 12) {
			$.TemporalLbl.value = gameInfo[i].points;
		} else if (gameInfo[i].gameID == 19) {
			$.surveyLbl.value = gameInfo[i].points;
		} else if (gameInfo[i].gameID == 13) {
			$.digitSpanBackLbl.value = gameInfo[i].points;
		} else if (gameInfo[i].gameID == 14) {
			$.nBackNewLbl.value = gameInfo[i].points;
		} else if (gameInfo[i].gameID == 15) {
			$.TrailsbNewLbl.value = gameInfo[i].points;
		} else if (gameInfo[i].gameID == 16) {
			$.trialsBDotLbl.value = gameInfo[i].points;
		} else if (gameInfo[i].gameID == 17) {
			$.jewelTrailsA.value = gameInfo[i].points;
		} else if (gameInfo[i].gameID == 18) {
			$.jewelTrailsB.value = gameInfo[i].points;
		} else if (gameInfo[i].gameID == 20) {
			$.scratchImage.value = gameInfo[i].points;
		}
	}
}

/**
 * Android back button handler
 */
$.pointTable.addEventListener('android:back', function() {
	goBack();
});

/**
 * Header back button click handler
 */
$.headerView.on('backButtonClick', function(e) {
	goBack();
});

/**
 * goBack function handler
 */

function goBack(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('pointTable');

}
