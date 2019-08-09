// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var commonFunctions = require('commonFunctions');
var LangCode = Ti.App.Properties.getString('languageCode');

/**
 * Open window
 */
$.surveyInstructionScreen.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.MainView.top = "80dp";
				$.MainView.bottom = "70dp";
				$.submitView.bottom = "20dp";
			}
		}
		$.headerView.setTitle(commonFunctions.L('instructionLbl', LangCode));
		$.submitLabel.text = commonFunctions.L('continueCapsLbl', LangCode);
		$.instructionText.text = args.surveyInst;
	} catch(ex) {
		commonFunctions.handleException("surveyInstructionScreen", "open", ex);
	}
});

/**
 * Header back button click handler
 */
$.headerView.on('backButtonClick', function(e) {
	goBack();
});

/**
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});

/**
 * goBack event handler
 */
function goBack(e) {
	try {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('surveyInstructionScreen');

	} catch(ex) {
		commonFunctions.handleException("surveyInstructionScreen", "goBack", ex);
	}

}

/**
 * function for android back
 */
$.surveyInstructionScreen.addEventListener('android:back', function() {
	goBack();
});

/**
 * Continue click event handler
 */
function onSubmitClick(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.openFullScreenWindow('syptomSurveyNew', {
		'surveyID' : args.surveyID,
		'surveyName' : args.surveyName
	});
	setTimeout(function() {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('surveyInstructionScreen');
	}, 1000);

}	