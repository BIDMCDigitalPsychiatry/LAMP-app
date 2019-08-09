// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = $.args;
var serviceManager = require('serviceManager');
var commonFunctions = require('commonFunctions');
var commonDB = require('commonDB');
var credentials = Alloy.Globals.getCredentials();
var LangCode = Ti.App.Properties.getString('languageCode');

/**
 * Window open function
 */
$.averageScore.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.supportLabel.bottom = "17dp";
			}
		}
		$.headerView.setTitle(commonFunctions.L('scoregrapgLbl', LangCode));
		$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);

		if (Ti.Network.online) {
			commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
			serviceManager.getScore(credentials.userId, getScoreSuccess, getScoreFailure);
		} else {
			commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));
		}

	} catch(ex) {
		commonFunctions.handleException("averageScore", "open", ex);
	}
});
/**
 * Gettting game name
 */
function getGameName(GameID) {
	var gameName;
	if (GameID == 'Number Hunt') {
		gameName = commonFunctions.L('nbackTest', LangCode);
	} else if (GameID == "Dot connect") {
		gameName = commonFunctions.L('trailsBTest', LangCode);
	} else if (GameID == "Box Game") {
		gameName = commonFunctions.L('spatialFrwd', LangCode);
	} else if (GameID == "Box Game - Pro") {
		gameName = commonFunctions.L('spatialBckwrd', LangCode);
	} else if (GameID == "Photo Match") {
		gameName = commonFunctions.L('memoryTest', LangCode);
	} else if (GameID == "Math Game") {
		gameName = commonFunctions.L('serial7', LangCode);
	} else if (GameID == "Memory Match") {
		gameName = commonFunctions.L('visualGame', LangCode);
	} else if (GameID == "Crack the Code") {
		gameName = commonFunctions.L('digitFWrd', LangCode);
	} else if (GameID == "Crack the Code - Pro") {
		gameName = commonFunctions.L('digitBckWrd', LangCode);
	} else if (GameID == "Cats and Dogs") {
		gameName = commonFunctions.L('catdog', LangCode);
	} else if (GameID == "Memory Match - Pro") {
		gameName = commonFunctions.L('temporalOrder', LangCode);
	} else if (GameID == "Dot connect (New)") {
		gameName = commonFunctions.L('trailsBTestNew', LangCode);
	} else if (GameID == "Dot touch") {
		gameName = commonFunctions.L('trailsBTouch', LangCode);
	} else if (GameID == "Jewels") {
		gameName = commonFunctions.L('jwelA', LangCode);
	} else if (GameID == "Jewels - Pro") {
		gameName = commonFunctions.L('jwelB', LangCode);
	} else if ( GameID = "Photo Hunt") {
		gameName = commonFunctions.L('nbackTestNew', LangCode);
	}
	return gameName;
}

function getScoreSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		var arrayGames = [];
		var arrayAverage = [];
		var arrayTotalAvg = [];
		if (response.ErrorCode == 0) {
			for (var i = 0; i < response.GameScoreList.length; i++) {
				gameName = getGameName(response.GameScoreList[i].Game);
				arrayGames.push(gameName);
				arrayAverage.push(response.GameScoreList[i].average);
				arrayTotalAvg.push(response.GameScoreList[i].totalAverage);
			};

			$.pie_chart.loadChart('PIE', {
				region : arrayGames,
				s1 : arrayAverage,
				s2 : arrayTotalAvg,
				t1 : commonFunctions.L('youravgLbl', LangCode),
				t2 : commonFunctions.L('totalavgLbl', LangCode),
				t3 : commonFunctions.L('avgScoreLbl', LangCode),
				t4 : commonFunctions.L('scoreLbl', LangCode)
			});
		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}
		if (OS_IOS) {
			commonFunctions.closeActivityIndicator();
		} else {
			setTimeout(function() {
				commonFunctions.closeActivityIndicator();
			}, 1000);
		}

	} catch(ex) {
		commonFunctions.handleException("articles", "getArticleSuccess", ex);
	}
}

function getScoreFailure(e) {
	commonFunctions.closeActivityIndicator();
}

$.averageScore.addEventListener('android:back', function() {
	goBack();
});
$.headerView.on('backButtonClick', function(e) {
	goBack();
});
function goBack(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('averageScore');

}

/***
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
