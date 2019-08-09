// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = $.args;

/**
 * variable declaration
 */
var commonFunctions = require('commonFunctions');
var serviceManager = require('serviceManager');
var validationFunctions = require('validation');
var LangCode = Ti.App.Properties.getString('languageCode');

/**
 * Function for window open
 */
$.forgetPassword.addEventListener("open", function(e) {
	try {

		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.outerScrollView.top = "80dp";
				$.supportLabel.bottom = "17dp";
			}
		}
		if (LangCode == "" || LangCode == null) {
			LangCode = "en";
		}
		$.headerView.setTitle(commonFunctions.L('forgotPasswordTitle', LangCode));
		$.titleLabel.text = commonFunctions.L('forgotYourPasswordLabel', LangCode);
		$.questionLabel.text = commonFunctions.L('questionLabel', LangCode);
		$.signInButton.text = commonFunctions.L('submitLbl', LangCode);
		$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
		setHintTextColor();
		setTimeout(function() {
			$.emailLabel.editable = true;
		}, 1000);
	} catch(ex) {
		commonFunctions.handleException("forgetPassword", "open", ex);
	}
});
/**
 * Set hint text color for lower SDKs
 */
function setHintTextColor() {
	commonFunctions.setHintTextColor($.emailLabel, commonFunctions.L('emailLabel', LangCode), Alloy.Globals.HINTTEXT_COLOR);
}

/***
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
/**
 * on back button click
 */
$.headerView.on('backButtonClick', function(e) {
	goBack();
});
function goBack(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('forgetPassword');
}

/**
 * function for android back
 */
$.forgetPassword.addEventListener('android:back', function() {
	goBack();
});

/**
 * Function for keypad dismiss
 */
function windowClick(e) {
	try {
		$.emailLabel.blur();

	} catch(ex) {
		commonFunctions.handleException("Forgot Password", "windowClick", ex);
	}

}

/**
 * Function for send click
 */
function onSendClick() {
	try {
		if ($.emailLabel.value == "") {
			commonFunctions.showAlert(commonFunctions.L('specifyEmail', LangCode), function() {
				if (OS_ANDROID) {
					$.emailLabel.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
				}
				$.emailLabel.focus();
			});
			return false;
		} else if (validationFunctions.isValidEmail($.emailLabel.value) == false) {
			commonFunctions.showAlert(commonFunctions.L('specifyValidEmail', LangCode), function() {
				if (OS_ANDROID) {
					$.emailLabel.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
				}
				$.emailLabel.focus();
			});
			return false;
		} else {
			if (Ti.Network.online) {
				commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
				serviceManager.forgotPassword($.emailLabel.value, forgotPasswordSuccess, forgotPasswordFailure);

			} else {
				commonFunctions.closeActivityIndicator();
				commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));
			}
		}
	} catch(ex) {
		commonFunctions.handleException("forgotpassword", "onSendClick", ex);
	}

}

/**
 * Signin API Calling Success
 */
function forgotPasswordSuccess(e) {
	try {
		commonFunctions.closeActivityIndicator();
		var response = JSON.parse(e.data);

		if (response.ErrorCode == 0) {
			commonFunctions.showAlert(commonFunctions.L('alertLabel', LangCode), function(e) {
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('forgetPassword');
			});

		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}

	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("forgot password", "forgotPasswordSuccess", ex);
	}
}

/**
 * Signin API Calling Failure
 */
function forgotPasswordFailure(e) {
	commonFunctions.closeActivityIndicator();
}
