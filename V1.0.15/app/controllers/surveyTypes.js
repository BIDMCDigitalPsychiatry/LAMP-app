/**
 * Declarations
 */
{
	var args = $.args;
	var commonFunctions = require('commonFunctions');
	var currentSurveyType = 0;
	var LangCode = Ti.App.Properties.getString('languageCode');
}
$.surveyTypes.addEventListener("open", function(e) {
	try {

	} catch(ex) {
		commonFunctions.handleException("surveyTypes", "open", ex);
	}
});
$.surveyTypes.addEventListener('android:back', function() {
	goBack();
});
function submitButtonClick(e) {
	try {
		if (currentSurveyType == 0) {
			commonFunctions.showAlert(commonFunctions.L('slectSurveyType', LangCode));
			return;
		}
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('surveysList', {
			'currentSurveyType' : currentSurveyType
		});
	} catch(ex) {
		commonFunctions.handleException("surveyTypes", "submitButtonClick", ex);
	}
}

/***
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});

$.headerView.on('backButtonClick', function(e) {
	goBack();
});
function goBack(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('surveyTypes');
	var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	if (parentWindow != null && parentWindow.windowName === "home") {
		parentWindow.window.refreshHomeScreen();
	}
}

function surveyTypeClick(e) {
	try {
		if (e.source.id == "radioButtonSurvey" && currentSurveyType != 1) {
			currentSurveyType = 1;
			$.radioOverlay.visible = true;
			$.freeResponseOverlay.visible = false;
			$.likertResponseOverlay.visible = false;
		} else if (e.source.id == "freeResponseSurvey" && currentSurveyType != 2) {
			$.radioOverlay.visible = false;
			$.freeResponseOverlay.visible = true;
			$.likertResponseOverlay.visible = false;
			currentSurveyType = 2;
		} else if (e.source.id == "likertResponseSurvey" && currentSurveyType != 3) {
			$.radioOverlay.visible = false;
			$.freeResponseOverlay.visible = false;
			$.likertResponseOverlay.visible = true;
			currentSurveyType = 3;
		}
	} catch(ex) {
		commonFunctions.handleException("surveyTypes", "surveyTypeClick", ex);
	}

}