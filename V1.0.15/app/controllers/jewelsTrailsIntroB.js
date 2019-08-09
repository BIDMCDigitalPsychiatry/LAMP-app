// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = arguments[0] || {};
var commonFunctions = require('commonFunctions');
var commonDB = require('commonDB');
var credentials = Alloy.Globals.getCredentials();
var totalCollectedJewels = 0;
var totalCollectedBonus = 0;
var totalColelctedScore = 0;
var LangCode = Ti.App.Properties.getString('languageCode');
$.jewelsTrailsIntroB.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
			}
		}
		$.headerView.setTitle(commonFunctions.L('jwelB', LangCode));
		$.lbl1.text = commonFunctions.L('jewelsTrail1', LangCode);
		$.lbl2.text = commonFunctions.L('jewelsTrail2', LangCode);
		$.lbl3.text = commonFunctions.L('jewelsTrail3', LangCode);

		$.submitLbl.text = commonFunctions.L('exmLbl', LangCode);
		var jewelInfo = commonDB.getJewelsCount(2);

		if (jewelInfo.length != 0) {
			totalCollectedJewels = jewelInfo[0].totalJewel;
			totalCollectedBonus = jewelInfo[0].totalBonus;
			totalColelctedScore = jewelInfo[0].totalScore;
		}

	} catch(ex) {
		commonFunctions.handleException("nBackTest", "open", ex);
	}
});
Ti.App.addEventListener('getValues', getValues);
Ti.App.addEventListener('ReportClick', ReportClick);
$.jewelsTrailsIntroB.addEventListener('android:back', function() {
	goBack();
});
$.headerView.on('backButtonClick', function(e) {

	goBack();
});

/***
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
function goBack(e) {
	Ti.App.removeEventListener('getValues', getValues);
	Ti.App.removeEventListener('ReportClick', ReportClick);
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntroB');

}

function getValues(e) {

}

function ReportClick(e) {

	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelGraph', {
		'type' : 2
	});

}

function onExampleClick(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jeweltrailsAExample', {
		'type' : 2
	});

}

function onScoreClick(e) {
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

function onStartClick(e) {
	Ti.App.removeEventListener('getValues', getValues);
	Ti.App.removeEventListener('ReportClick', ReportClick);
	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsA', {
		'type' : 2,
		"isBatch" : args.isBatch,
		"testID" : args.testID,
		"fromNotification" : args.fromNotification,
		"createdDate" : args.createdDate,
		"isLocal" : args.isLocal
	});
}

function onDifficultyClick(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsDifficulty', {
		'type' : 2
	});
}

$.addListner = function(e) {
	try {
		Ti.App.addEventListener('getValues', getValues);
		Ti.App.addEventListener('ReportClick', ReportClick);

	} catch(ex) {
		commonFunctions.handleException("jewelsTrailsIntro", "addListner", ex);
	}
};

$.refreshWindow = function(e) {
	try {
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

	} catch(ex) {
		commonFunctions.handleException("jewelsTrailsIntro", "refreshWindow", ex);
	}
};
