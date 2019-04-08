// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
/**
 * Declarations
 */
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
	//Ti.API.info('GameID', GameID);
	if (GameID == 'n-back') {
		gameName = commonFunctions.L('nbackTest', LangCode);
	} else if (GameID == "trails-b") {
		gameName = commonFunctions.L('trailsBTest', LangCode);
	} else if (GameID == "Spatial Span") {
		gameName = commonFunctions.L('spatialSpan', LangCode);
	} else if (GameID == "Spatial Span Backward") {
		gameName = commonFunctions.L('spatialBckwrd', LangCode);
	} else if (GameID == "Simple Memory") {
		gameName = commonFunctions.L('memoryTest', LangCode);
	} else if (GameID == "Serial 7s") {
		gameName = commonFunctions.L('serial7', LangCode);
	} else if (GameID == "Visual Association") {
		gameName = commonFunctions.L('visualGame', LangCode);
	} else if (GameID == "Digit Span") {
		gameName = commonFunctions.L('digitFWrdGame', LangCode);
	} else if (GameID == "Digit Span Backward") {
		gameName = commonFunctions.L('digitBckWrd', LangCode);
	} else if (GameID == "Cat and Dogs(New)") {
		gameName = commonFunctions.L('catdog', LangCode);
	} else if (GameID == "Temporal Order") {
		gameName = commonFunctions.L('temporalOrder', LangCode);
	} else if (GameID == "trails-b(New)") {
		gameName = commonFunctions.L('trailsBTestNew', LangCode);
	} else if (GameID == "trails-b(Dot Touch)") {
		gameName = commonFunctions.L('trailsBTouch', LangCode);
	} else if (GameID == "Jewels Trails A") {
		gameName = commonFunctions.L('jwelA', LangCode);
	} else if (GameID == "Jewels Trails B") {
		gameName = commonFunctions.L('jwelB', LangCode);
	} else if ( GameID = "n-back(New)") {
		gameName = commonFunctions.L('nbackTestNew', LangCode);
	}
	//Ti.API.info('gameName', gameName);
	return gameName;
}

/**
 * getScore service success
 */
function getScoreSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		Ti.API.info('getScoreSuccess :  ', JSON.stringify(response));
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

/**
 * getScore service failure
 */
function getScoreFailure(e) {
	Ti.API.info('getScoreFailure :  ', JSON.stringify(e));
	commonFunctions.closeActivityIndicator();

}

/**
 * Android back button handler
 */
$.averageScore.addEventListener('android:back', function() {
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
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('averageScore');

}

/**
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
