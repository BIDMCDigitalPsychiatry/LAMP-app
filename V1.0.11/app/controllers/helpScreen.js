// Arguments passed into this controller can be accessed via the `$.args` object directly or:
/**
 * Variable declaration
 */
var args = arguments[0] || {};
var commonFunctions = require('commonFunctions');
var serviceManager = require('serviceManager');
var LangCode = Ti.App.Properties.getString('languageCode');
var credentials = Alloy.Globals.getCredentials();
Ti.API.info('credential in settings  is' + credentials.userId);

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
		}

		var settingsInfo = Ti.App.Properties.getObject("SettingsInfo");
		Ti.API.info('settingsInfo : ', settingsInfo);
		if (settingsInfo != null && settingsInfo != undefined) {
			Ti.API.info('settingsInfo.contactNo : ', settingsInfo.contactNo);
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

		Ti.API.info('***DELETE USER ACOUNT SUCCESS  RESPONSE****  ', JSON.stringify(response));

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

/**
 * goBack function handler
 */
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

/**
 *Emergency call event handler
 */
function emergencyCallClick(e) {
	Ti.API.info('Number : ' + $.emergencycontactLabel.value);
	var telNumber = $.emergencycontactLabel.value;
	Alloy.Globals.PHONE_NUMBER = telNumber;
	Alloy.Globals.CALL_TYPE = 1;
	Alloy.Globals.CALL_START_TIME = new Date().getTime();
	Alloy.Globals.CALL_START_DATE = new Date().toUTCString();
	Titanium.Platform.openURL('tel:' + telNumber);
}

/**
 *Help line call event handler
 */
function helpLineCallClick(e) {
	Ti.API.info('Number : ' + $.helpLineLabel.value);
	var telNumber = $.helpLineLabel.value;
	Alloy.Globals.PHONE_NUMBER = telNumber;
	Alloy.Globals.CALL_TYPE = 2;
	Alloy.Globals.CALL_START_TIME = new Date().getTime();
	Alloy.Globals.CALL_START_DATE = new Date().toUTCString();
	Titanium.Platform.openURL('tel:' + telNumber);
}