// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var commonFunctions = require('commonFunctions');
/**
 * Event handler for Disagree button
 * @param {Object} e
 */
init();

function init() {
	if (OS_IOS) {
		if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
			$.headerContainer.height = "80dp";
			$.bodyOuterContainer.top = "80dp";
			$.consentButtonContainer.bottom = "13dp";
			$.supportLabel.bottom = "12dp";
		}

	}
	var LangCode = Ti.App.Properties.getString('languageCode');
	if (LangCode == "" || LangCode == null) {
		LangCode = "en";
	}
	Ti.API.info('terms page', LangCode);
	if (LangCode == "en") {
		$.consentDescriptionLabel.url = "/htmlPages/en_html/user-consent.html";
	} else if (LangCode == "es") {
		$.consentDescriptionLabel.url = "/htmlPages/es_html/user-consent.html";
	} else if (LangCode == "pt-br") {
		$.consentDescriptionLabel.url = "/htmlPages/pt-br_html/user-consent.html";
	} else if (LangCode == "cmn") {
		$.consentDescriptionLabel.url = "/htmlPages/cmn_html/user-consent.html";
	} else if (LangCode == "twi") {
		$.consentDescriptionLabel.url = "/htmlPages/twi_html/user-consent.html";
	} else if (LangCode == "dut") {
		$.consentDescriptionLabel.url = "/htmlPages/dut_html/user-consent.html";
	}
	var titleText = commonFunctions.L('signInUserSignUp', LangCode);
	if (Alloy.Globals.iPhone5) {
		Ti.API.info('enter here in user');
		if (LangCode == "pt-br") {
			$.headerView.setTitle(commonFunctions.trimText(titleText, 12));
		} else {
			$.headerView.setTitle(commonFunctions.L('signInUserSignUp', LangCode));
		}

	} else {
		Ti.API.info('enter not here in user');
		$.headerView.setTitle(commonFunctions.L('signInUserSignUp', LangCode));
	}

	$.signUpDisagreeButton.text = commonFunctions.L('disagree', LangCode);
	$.signUpAgreeButton.text = commonFunctions.L('agree', LangCode);
	$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
	$.consentHeadLabel.text = commonFunctions.L('consentLbl', LangCode);
	$.consentNoteLabel.text = commonFunctions.L('consentNote', LangCode);
}

function signUpDisagreeClick(e) {

	if (OS_ANDROID) {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('signupUserConsent');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('signupUser');
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('signupUser');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('signupUserConsent');
	}

}

/**
 * Event handler for Agree button
 * @param {Object} e
 */
function signUpAgreeClick(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('signupUserRegister');
}

/**
 * Event handler for Menu back arrow click
 */
$.headerView.on('backButtonClick', function(e) {

	goBack();
});
/**
 * Function to go back to the previous window.
 */
function goBack() {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow("signupUserConsent");
}

/**
 * function for android back
 */
$.signupUserConsent.addEventListener('android:back', function() {
	goBack();
});
