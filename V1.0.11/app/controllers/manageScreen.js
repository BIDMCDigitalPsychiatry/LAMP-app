// Arguments passed into this controller can be accessed via the `$.args` object directly or:
/**
 * variable declaration
 */
var args = $.args;
var commonDB = require('commonDB');
var commonFunctions = require('commonFunctions');
var credentials = Alloy.Globals.getCredentials();
var LangCode = Ti.App.Properties.getString('languageCode');

/**
 * function for screen open
 */
$.manageScreen.addEventListener("open", function(e) {
	try {
		$.headerLabel.text = commonFunctions.L('manageLbl', LangCode);
		$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
		$.contentLabel.text = commonFunctions.L('manageContent', LangCode);
		var BlogsUpdate = Ti.App.Properties.getString("BlogsUpdate", "");
		var TipsUpdate = Ti.App.Properties.getString("TipsUpdate", "");
		if (BlogsUpdate == true || BlogsUpdate == "true" || TipsUpdate == true || TipsUpdate == "true") {
			$.footerView.setInfoIndicatorON();
		} else {
			$.footerView.setInfoIndicatorOFF();
		}
		$.footerView.setSelectedLabel(3);

	} catch(ex) {
		commonFunctions.handleException("manage", "open", ex);
	}

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

			$.catDogLbl.value = gameInfo[i].points;

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
		} else if (gameInfo[i].gameID == 15) {
			$.surveyLbl.value = gameInfo[i].points;
		}
	}
}

/**
 * on home button click
 */
function onHomeClick(e) {
	try {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('manageScreen');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && parentWindow.windowName === "newHomeScreen") {
			parentWindow.window.refreshHomeScreen();
		}

	} catch(ex) {
		commonFunctions.handleException("manageScreen", "homeClick", ex);
	}
}

/**
 * Android back button handler
 */
$.manageScreen.addEventListener('android:back', function() {
	onHomeClick();
});

/**
 * Footer Tab selection click
 */
$.footerView.on('clickLearn', function(e) {

	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('homeStaticPages');
	if (OS_IOS) {
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('manageScreen');
		}, 1000);
	} else {
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('manageScreen');
		}, 500);
	}

});

/**
 * Footer Tab selection click
 */
$.footerView.on('clickAssess', function(e) {

	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('manageScreen');
	var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	if (parentWindow != null && parentWindow.windowName === "home") {
		parentWindow.window.refreshHomeScreen();
	}

});

/**
 * Footer Tab selection click
 */
$.footerView.on('clickManage', function(e) {

	return;

});

/**
 * Footer Tab selection click
 */
$.footerView.on('clickPrevent', function(e) {

	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('preventScreen');
	if (OS_IOS) {
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('manageScreen');
		}, 1000);
	} else {
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('manageScreen');
		}, 500);
	}

});

/**
 * Trigger onReportClick click event
 */
function onReportClick() {
	commonFunctions.sendScreenshot();
}

