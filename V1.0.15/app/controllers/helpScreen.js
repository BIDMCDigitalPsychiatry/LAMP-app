// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = arguments[0] || {};
/**
 * Variable declaration
 */
var commonFunctions = require('commonFunctions');
var serviceManager = require('serviceManager');
var LangCode = Ti.App.Properties.getString('languageCode');
var credentials = Alloy.Globals.getCredentials();
/**
 * Function for window open
 */

$.helpScreen.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.MainView.top = "80dp";
				$.outerView.bottom = "70dp";
			}
		}
		if (LangCode == "dut") {
			$.deleteAccountLabel.font = Alloy.Globals.MediumMenuFontBold;
		} else {
			$.deleteAccountLabel.font = Alloy.Globals.LargeFontBold;
		}
		$.headerView.setTitle(commonFunctions.L('helpTitle', LangCode));
		$.emergencycontactTitle.text = commonFunctions.L('emergencycontactTitle', LangCode);
		$.helpLineTitle.text = commonFunctions.L('helpLineTitle', LangCode);
		$.policyLabel.text = commonFunctions.L('policyTitle', LangCode);
		$.deleteAccountLabel.text = commonFunctions.L('deleteAccountTitle', LangCode);
		if (LangCode == "en") {
			$.policyView.url = "/htmlPages/en_html/privacy-policy.html";
		} else if (LangCode == "es") {
			$.policyView.url = "/htmlPages/es_html/privacy-policy.html";
		} else if (LangCode == "pt-br") {
			$.policyView.url = "/htmlPages/pt-br_html/privacy-policy.html";
		} else if (LangCode == "cmn") {
			$.policyView.url = "/htmlPages/cmn_html/privacy-policy.html";
		} else if (LangCode == "twi") {
			$.policyView.url = "/htmlPages/en_html/privacy-policy.html";
		} else if (LangCode == "dut") {
			$.policyView.url = "/htmlPages/en_html/privacy-policy.html";
		}

		var settingsInfo = Ti.App.Properties.getObject("SettingsInfo");
		if (settingsInfo != null && settingsInfo != undefined) {
			if (settingsInfo.contactNo != "") {
				$.emergencycontactLabel.value = settingsInfo.contactNo;
			} else {
				$.emergencycontactLabel.value = commonFunctions.L('notAvailableLbl', LangCode);
			}
			if (settingsInfo.personalHelpline != "") {
				$.helpLineLabel.value = settingsInfo.personalHelpline;
			} else {
				$.helpLineLabel.value = commonFunctions.L('notAvailableLbl', LangCode);
			}
		}
		setTimeout(function() {
			$.MainView.visible = true;
		}, 100);

	} catch(ex) {
		commonFunctions.handleException("helpScreen", "open", ex);
	}
});

/**
 * Delete account functionality
 */
function onDeleteAccountClick() {
	try {
		commonFunctions.showConfirmation(commonFunctions.L('deleteConfirmation', LangCode), [commonFunctions.L('cancelLbl', LangCode), commonFunctions.L('deleteLbl', LangCode)], function() {

			if (Ti.Network.online) {
				commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
				serviceManager.deleteAccount(credentials.userId, deleteAccountSuccess, deleteAccountFailure);

			} else {
				commonFunctions.closeActivityIndicator();
				commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));
			}

		});

	} catch(ex) {
		commonFunctions.handleException("Help", "deleteAccount", ex);
	}
}

/**
 * success api call
 */
function deleteAccountSuccess(e) {
	try {

		var response = JSON.parse(e.data);

		if (response.ErrorCode == 0) {
			Alloy.Globals.logout();
			if (Ti.App.Properties.hasProperty("userName") == true) {
				Ti.App.Properties.removeProperty("userName");
			}
			Alloy.Globals.HEADER_COLOR = "#359ffe";
			Alloy.Globals.BACKGROUND_IMAGE = "/images/common/blue-bg.png";
			Alloy.Globals.SYMPTOM_ACTIVE = "/images/surveys/icn-symptom-survey-active.png";
			Alloy.Globals.COGINITION_ACTIVE = "/images/surveys/icn-cognition-test-active.png";
			Alloy.Globals.ENVIRONMENT_ACTIVE = "/images/surveys/icn-environment-active.png";
			Alloy.Globals.HELP_ACTIVE = "/images/surveys/icn-help-active.png";
			Ti.App.Properties.setObject("SettingsInfo", null);
			Ti.App.Properties.setObject("coginitionReminder", null);
			Ti.App.Properties.setObject("surveyReminder", null);
			commonFunctions.closeActivityIndicator();
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('signin');
			setTimeout(function() {
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('settings');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('home');
			}, 1000);
		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}

	} catch(ex) {
		commonFunctions.handleException("Help", "deleteAccount", ex);
	}
};
/**
 * error api call
 */
function deleteAccountFailure(e) {
	commonFunctions.closeActivityIndicator();
};

/**
 * on Back button click
 */
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
	try {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('helpScreen');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && parentWindow.windowName === "home") {
			parentWindow.window.refreshHomeScreen();
		}

	} catch(ex) {
		commonFunctions.handleException("helpScreen", "goBack", ex);
	}

}

/**
 * function for android back
 */
$.helpScreen.addEventListener('android:back', function() {
	goBack();
});

function emergencyCallClick(e) {
	var telNumber = $.emergencycontactLabel.value;
	Alloy.Globals.PHONE_NUMBER = telNumber;
	Alloy.Globals.CALL_TYPE = 1;
	Alloy.Globals.CALL_START_TIME = new Date().getTime();
	Alloy.Globals.CALL_START_DATE = new Date().toUTCString();
	Titanium.Platform.openURL('tel:' + telNumber);

}

function helpLineCallClick(e) {
	var telNumber = $.helpLineLabel.value;
	Alloy.Globals.PHONE_NUMBER = telNumber;
	Alloy.Globals.CALL_TYPE = 2;
	Alloy.Globals.CALL_START_TIME = new Date().getTime();
	Alloy.Globals.CALL_START_DATE = new Date().toUTCString();
	Titanium.Platform.openURL('tel:' + telNumber);

}