// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var commonFunctions = require('commonFunctions');
var LangCode = Ti.App.Properties.getString('languageCode');
/**
 * variable declaration
 */
/**
 * function for screen open
 */
$.preventScreen.addEventListener("open", function(e) {
	if (OS_IOS) {
		if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
			$.headerView.height = "80dp";
			$.headerLabel.bottom = "0dp";
			$.contentView.top = "120dp";
			$.titleview.top = "20dp";

		}

	}
	$.headerLabel.text = commonFunctions.L('prevntLbl', LangCode);
	$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
	var BlogsUpdate = Ti.App.Properties.getString("BlogsUpdate", "");
	var TipsUpdate = Ti.App.Properties.getString("TipsUpdate", "");
	if (BlogsUpdate == true || BlogsUpdate == "true" || TipsUpdate == true || TipsUpdate == "true") {
		$.footerView.setInfoIndicatorON();
	} else {
		$.footerView.setInfoIndicatorOFF();
	}
	$.footerView.setSelectedLabel(4);
	$.contentText.text = commonFunctions.L('preventcontent', LangCode);

});

/**
 * on home button click
 */
function onHomeClick(e) {
	try {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('preventScreen');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && parentWindow.windowName === "home") {
			parentWindow.window.refreshHomeScreen();
		}

	} catch(ex) {
		commonFunctions.handleException("prevent", "homeClick", ex);
	}
}

$.preventScreen.addEventListener('android:back', function() {
	onHomeClick();
});
$.footerView.on('clickLearn', function(e) {

	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('homeStaticPages');
	if (OS_IOS) {
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('preventScreen');
		}, 1000);
	} else {
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('preventScreen');
		}, 500);

	}

});

$.footerView.on('clickAssess', function(e) {

	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('preventScreen');
	var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	if (parentWindow != null && parentWindow.windowName === "home") {
		parentWindow.window.refreshHomeScreen();
	}

});

$.footerView.on('clickManage', function(e) {

	if (OS_IOS) {

		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scratchImageScreen');
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('preventScreen');
		}, 1000);
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scratchTestScreen');
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scratchImageScreen');
		}, 5);
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('preventScreen');
		}, 500);

	}

});

$.footerView.on('clickPrevent', function(e) {

	return;

});

/**
 * Trigger onReportClick click event
 */
function onReportClick() {
	commonFunctions.sendScreenshot();
}
