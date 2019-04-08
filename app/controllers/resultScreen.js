// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
/**
 * Declarations
 */
var args = $.args;
var commonFunctions = require('commonFunctions');
var LangCode = Ti.App.Properties.getString('languageCode');

/**
 * Function for screen open
 */
$.resultScreen.addEventListener("open", function(e) {
	if (OS_IOS) {
		if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
			$.headerContainer.height = "80dp";
			$.contentView.top = "80dp";
			$.supportLabel.bottom = "17dp";
			$.surveyList.bottom = "29dp";
		}
	}
	$.headerView.setTitle(commonFunctions.L('resultLbL', LangCode));

	var menuArray = [];
	var points = commonFunctions.L('pointLbl', LangCode);
	var pointText = points + " (" + Ti.App.Properties.getString("currentLevel") + ")";
	var menuList = [pointText, commonFunctions.L('cogscore', LangCode), commonFunctions.L('envLbl', LangCode), commonFunctions.L('scoregrapgLbl', LangCode)];
	for (var i = 0; i < menuList.length; i++) {

		menuArray.push({
			template : "surveyListTemplate",
			gameNameLabel : {
				text : menuList[i]
			},
		});
	};
	$.lstSection.setItems(menuArray);

});

/***
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});

/**
 * Android back button handler
 */
$.resultScreen.addEventListener('android:back', function() {
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
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('resultScreen');
	var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	if (parentWindow != null && parentWindow.windowName === "home") {
		parentWindow.window.refreshHomeScreen();
	}

}

/**
 * onMenuClick event handler
 */
function onMenuClick(e) {
	if (e.itemIndex == 0) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('pointTable');
	} else if (e.itemIndex == 1) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scoreTable');
	} else if (e.itemIndex == 2) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('activityScreen');
	} else if (e.itemIndex == 3) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('averageScore');
	}
}