// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var LangCode = Ti.App.Properties.getString('languageCode');
var commonFunctions = require('commonFunctions');
var instructionVideoInfo;

/**
 * Open Window.
 */
$.startScreen.addEventListener("open", function(e) {

	if (Ti.App.Properties.hasProperty("instructionVideoInfo") == true) {
		$.instButtonView.height = "40dp";
		$.instButtonView.width = "200dp";
		$.instButtonView.visible = true;
	} else {
		$.instButtonView.height = 0;
		$.instButtonView.width = 0;
		$.instButtonView.visible = false;
	}
	$.instButton.text = commonFunctions.L('instVideo', LangCode);
});

/**
 * on next button click
 */
function onStartClick() {
	Ti.App.Properties.setString('isInstructionShown', "true");
	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('home');
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('startScreen');
}

/**
 * Open video
 */
function openVideo() {
	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('videoScreen');
}

/**
 * function for android back
 */
$.startScreen.addEventListener('android:back', function() {

	return;
}); 