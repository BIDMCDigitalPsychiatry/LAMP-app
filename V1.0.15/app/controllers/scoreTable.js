// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = $.args;
var commonDB = require('commonDB');
var credentials = Alloy.Globals.getCredentials();
var commonFunctions = require('commonFunctions');
var LangCode = Ti.App.Properties.getString('languageCode');
/**
 * function for screen open
 */
$.scoreTable.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.outerView.top = "80dp";
			}
		}

		var surveyArray = [];
		var titleText = commonFunctions.L('cogscore', LangCode);
		if (Alloy.Globals.iPhone5) {
			$.headerView.setTitle(commonFunctions.trimText(titleText, 12));
		} else {
			$.headerView.setTitle(titleText);
		}

		$.gameTitle1.text = commonFunctions.L('memoryGame', LangCode);
		$.gameTitle2.text = commonFunctions.L('attentionGame', LangCode);
		$.pointTitle1.text = commonFunctions.L('scoreLbl', LangCode);
		$.pointTitle2.text = commonFunctions.L('scoreLbl', LangCode);
		$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
		$.nBackLblTitle.text = commonFunctions.L('nbackTest', LangCode);
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

		var gameResults = commonDB.getGameScore();

		var gameList = [{
			gameName : commonFunctions.L('nbackTest', LangCode),
			gameID : 1,
			score : 0,

		}, {
			gameName : commonFunctions.L('trailsBTest', LangCode),
			gameID : 2,
			score : 0,

		}, {
			gameName : commonFunctions.L('spatialFrwd', LangCode),
			gameID : 3,
			score : 0,

		}, {
			gameName : commonFunctions.L('spatialBckwrd', LangCode),
			gameID : 4,
			score : 0,

		}, {
			gameName : commonFunctions.L('memoryTest', LangCode),
			gameID : 5,
			score : 0,

		}, {
			gameName : commonFunctions.L('serial7', LangCode),
			score : 0,
			gameID : 6,

		}, {
			gameName : "",
			score : 0,
			gameID : 7,

		}, {
			gameName : "",
			score : 0,
			gameID : 8,

		}, {
			gameName : commonFunctions.L('visualLbl', LangCode),
			gameID : 9,
			score : 0,

		}, {
			gameName : commonFunctions.L('digitFWrd', LangCode),
			gameID : 10,
			score : 0,

		}, {
			gameName : commonFunctions.L('catdog', LangCode),
			gameID : 11,
			score : 0,

		}, {
			gameName : commonFunctions.L('temporalOrder', LangCode),
			gameID : 12,
			score : 0,

		}, {
			gameName : commonFunctions.L('digitBckWrd', LangCode),
			gameID : 13,
			score : 0,

		}, {
			gameName : commonFunctions.L('nbackTestNew', LangCode),
			gameID : 14,
			score : 0,

		}, {
			gameName : commonFunctions.L('trailsBTestNew', LangCode),
			gameID : 15,
			score : 0,

		}, {
			gameName : commonFunctions.L('trailsBTouch', LangCode),
			gameID : 16,
			score : 0,

		}, {
			gameName : commonFunctions.L('jwelA', LangCode),
			gameID : 17,
			score : 0,

		}, {
			gameName : commonFunctions.L('jwelB', LangCode),
			gameID : 18,
			score : 0,

		}];
		for (var i = 0; i < gameResults.length; i++) {

			if (gameList.length >= gameResults[i].gameID) {
				gameList[gameResults[i].gameID - 1].score = gameResults[i].score;
			}

		};

		loadData(gameList);
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

		if (gameInfo[i].gameID == 1) {
			$.nBackLbl.value = gameInfo[i].score;
		} else if (gameInfo[i].gameID == 2) {
			$.trailsLbl.value = gameInfo[i].score;

		} else if (gameInfo[i].gameID == 3) {

			$.spatialFrwdLbl.value = gameInfo[i].score;

		} else if (gameInfo[i].gameID == 4) {

			$.spatialBackLbl.value = gameInfo[i].score;

		} else if (gameInfo[i].gameID == 5) {

			$.simpleMemoryLbl.value = gameInfo[i].score;

		} else if (gameInfo[i].gameID == 6) {

			$.serail7Lbl.value = gameInfo[i].score;

		} else if (gameInfo[i].gameID == 7) {

		} else if (gameInfo[i].gameID == 9) {

			$.visualLbl.value = gameInfo[i].score;

		} else if (gameInfo[i].gameID == 10) {
			$.digitSpanLbl.value = gameInfo[i].score;
		} else if (gameInfo[i].gameID == 11) {
			$.catdogNewLbl.value = gameInfo[i].score;
		} else if (gameInfo[i].gameID == 12) {
			$.TemporalLbl.value = gameInfo[i].score;
		} else if (gameInfo[i].gameID == 13) {
			$.digitSpanBackLbl.value = gameInfo[i].score;
		} else if (gameInfo[i].gameID == 14) {
			$.nBackTestNewLbl.value = gameInfo[i].score;
		} else if (gameInfo[i].gameID == 15) {
			$.trailsBNewLbl.value = gameInfo[i].score;
		} else if (gameInfo[i].gameID == 16) {
			$.trailsBDotLbl.value = gameInfo[i].score;
		} else if (gameInfo[i].gameID == 17) {
			$.jewelTrailsALbl.value = Math.round(gameInfo[i].score);
		} else if (gameInfo[i].gameID == 18) {
			$.jewelTrailsBLbl.value = Math.round(gameInfo[i].score);
		}
	}
}

$.scoreTable.addEventListener('android:back', function() {
	goBack();
});
$.headerView.on('backButtonClick', function(e) {
	goBack();
});
function goBack(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('scoreTable');

}
