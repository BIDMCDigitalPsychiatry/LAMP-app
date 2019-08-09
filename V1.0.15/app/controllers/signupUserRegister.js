// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var commonFunctions = require('commonFunctions');
var validationFunctions = require('validation');
var serviceManager = require('serviceManager');
var commonDB = require('commonDB');
var Picker = require('picker');
var welcomeInfo;
var welcomeGameInfo;
function getLanguage() {
	try {
		return [{
			value : 1,
			title : "English",
			code : "en"
		}, {
			value : 2,
			title : "Spanish",
			code : "es"
		}, {
			value : 3,
			title : "Brazilian Portuguese",
			code : "pt-br"
		}, {
			value : 4,
			title : "Chinese (Mandarin)",
			code : "cmn"
		}, {
			value : 5,
			title : "Twi(Ghanaian)",
			code : "twi"
		}, {
			value : 6,
			title : "Dutch",
			code : "dut"
		}];

	} catch(ex) {
		commonFunctions.handleException("signin", "getLanguage", ex);
	}
}

/**
 * function to set label language
 */
function setLabel() {
	var LangCode = Ti.App.Properties.getString('languageCode');
	Ti.API.info('lang code is', LangCode);
	if (LangCode == "" || LangCode == null) {
		LangCode = "en";
	}
	var obj = commonFunctions.getLanguage(LangCode);
	$.languageSlotLabel.text = obj.language;
	var titleText = commonFunctions.L('signInUserSignUp', LangCode);
	if (Alloy.Globals.iPhone5) {
		if (LangCode == "es" || LangCode == "pt-br") {
			$.headerView.setTitle(commonFunctions.trimText(titleText, 12));
		} else {
			$.headerView.setTitle(commonFunctions.L('signInUserSignUp', LangCode));
		}

	} else {
		$.headerView.setTitle(commonFunctions.L('signInUserSignUp', LangCode));
	}

	$.firstName.hintText = commonFunctions.L('firstName', LangCode);
	$.lastName.hintText = commonFunctions.L('lastName', LangCode);
	$.emailId.hintText = commonFunctions.L('emailId', LangCode);
	$.password.hintText = commonFunctions.L('password', LangCode);
	$.confirmPassword.hintText = commonFunctions.L('confirmPassword', LangCode);
	$.langHeader.text = commonFunctions.L('languageSelect', LangCode);
	$.signInCreateAndContinueButton.text = commonFunctions.L('createAndContinue', LangCode);
	$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
}

/***
 * slot click event
 */
function onGetLanguage(e) {
	try {
		var LangCode = Ti.App.Properties.getString('languageCode');
		if (LangCode == "" || LangCode == null) {
			LangCode = "en";
		}
		var selectedText = "";
		if (e.source.id == "languageSlot") {
			selectedText = $.languageSlotLabel.text;
		}
		ShowPicker(getLanguage(), selectedText, commonFunctions.L('languageSelect', LangCode), function(val, index, code) {
			if (e.source.id == "languageSlot") {
				$.languageSlotLabel.text = val;
				$.languageSlotLabel.index = index;
				Ti.App.Properties.setString('languageCode', code);
				setLabel();
			}

		});
	} catch(ex) {
		commonFunctions.handleException("signIn", "onGetLanguage", ex);
	}

}

/**
 * Shows the picker
 */
function ShowPicker(options, defaultText, headerText, doneCallBack, itemChangeCallback) {
	try {
		var listPicker = null;
		var defaultVal = 0;
		for ( index = 0; index < options.length; index++) {
			if (options[index].title == defaultText) {
				defaultVal = index;
				break;
			}
		}

		listPicker = new Picker(options, defaultVal, headerText, 'plain', null);
		listPicker.addToWindow($.signupUserRegister);

		listPicker.show();

		listPicker.addEventListener("done", function(e) {
			Alloy.Globals.IsSelected = 1;

			if (listPicker.selectedValue == null || listPicker.selectedValue < 0) {
				if (OS_ANDROID) {
					if (listPicker != null)
						listPicker.hide();

				}
				return;
			}
			if (listPicker != null)
				listPicker.hide();

			if (listPicker.selectedText) {
				doneCallBack(listPicker.selectedText, listPicker.selectedValue, listPicker.selectedLanguageCode);
			}
			listPicker = null;

		});

		listPicker.addEventListener("cancel", function(e) {

			if (listPicker != null)
				listPicker.hide();
			listPicker = null;
		});

		listPicker.addEventListener("change", function(e) {
			if (itemChangeCallback != null || itemChangeCallback != undefined)
				itemChangeCallback(listPicker.selectedText);
		});
	} catch(ex) {
		commonFunctions.handleException("settings", "ShowPicker", ex);
	}
}

function init() {

	setHintTextColor();
}

$.signupUserRegister.addEventListener("open", function(e) {
	if (OS_IOS) {
		if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
			$.headerContainer.height = "80dp";
			$.bodyOuterContainer2.top = "80dp";
			$.supportLabel.bottom = "15dp";
		}

	}
	setLabel();
	if (OS_ANDROID)
		$.firstName.blur();
});
/**
 * Set hint text color for lower SDKs
 */
function setHintTextColor() {
	var LangCode = Ti.App.Properties.getString('languageCode');
	if (LangCode == "" || LangCode == null) {
		LangCode = "en";
	}
	commonFunctions.setHintTextColor($.firstName, commonFunctions.L('firstName', LangCode), Alloy.Globals.HINTTEXT_COLOR);
	commonFunctions.setHintTextColor($.lastName, commonFunctions.L('lastName', LangCode), Alloy.Globals.HINTTEXT_COLOR);
	commonFunctions.setHintTextColor($.emailId, commonFunctions.L('emailId', LangCode), Alloy.Globals.HINTTEXT_COLOR);
	commonFunctions.setHintTextColor($.password, commonFunctions.L('password', LangCode), Alloy.Globals.HINTTEXT_COLOR);
	commonFunctions.setHintTextColor($.confirmPassword, commonFunctions.L('confirmPassword', LangCode), Alloy.Globals.HINTTEXT_COLOR);
}

/**
 * Event handler for Create And Continue button
 * @param {Object} e
 */
function onSignInCreateAndContinueClick(e) {
	if (Alloy.Globals.IsSelected == 0) {
		Ti.App.Properties.setString('languageCode', "en");
	}
	var LangCode = Ti.App.Properties.getString('languageCode');
	if (isValid() == true) {

		var signUpDetails = [{
			"firstName" : $.firstName.value.trim(),
			"lastName" : $.lastName.value.trim(),
			"email" : $.emailId.value.trim(),
			"password" : $.password.value.trim(),
			"Language" : LangCode
		}];

		if (Ti.Network.online) {
			commonFunctions.openActivityIndicator(commonFunctions.L('activitySaving', LangCode));
			serviceManager.guestUserSignUp(signUpDetails, signUpSuccess, signUpFailure);
		} else {
			commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));
		}

	}
}

/**
 * SignUp API Calling Success
 */
function signUpSuccess(e) {
	try {

		var response = JSON.parse(e.data);

		if (response.ErrorCode == 0) {
			specificationArray = response.Data;
			Ti.App.Properties.setString('SESSION_TOKEN', response.SessionToken);
			if (specificationArray.Language != null && specificationArray.Language != "") {
				Ti.App.Properties.setString('languageCode', specificationArray.Language);
			} else {
				Ti.App.Properties.setString('languageCode', 'en');
			}
			var settingsData = {
				userId : specificationArray.UserID,
				userSettingsId : specificationArray.UserSettingID,
				appColor : specificationArray.AppColor,
				sympSurveySlotID : specificationArray.SympSurveySlotID,
				sympSurveySlotTime : specificationArray.SympSurveySlotTime,
				sympSurveyRepeatID : specificationArray.SympSurveyRepeatID,
				cognTestSlotID : specificationArray.CognTestSlotID,
				cognTestSlotTime : specificationArray.CognTestSlotTime,
				cognTestRepeatID : specificationArray.CognTestRepeatID,
				contactNo : specificationArray.ContactNo,
				personalHelpline : specificationArray.PersonalHelpline,
				Protocol : 0
			};
			Ti.App.Properties.setString('isProtocolActivated', 0);

			commonDB.insertSettingsData(settingsData);
			setAppSettingsProperty(settingsData);
			// Set credentials in property, it will be used for auto login.
			Alloy.Globals.setCredentials($.emailId.value.trim(), $.password.value.trim(), settingsData.userId, 1);

			welcomeInfo = {
				welcomeContent : response.WelcomeText,
			};

			Ti.App.Properties.setObject("welcomeInfo", welcomeInfo);

			welcomeGameInfo = {
				CognitionSettings : response.CognitionSettings,
			};
			Ti.App.Properties.setObject("welcomeGameInfo", welcomeGameInfo);

			if (response.InstructionVideoLink != null && response.InstructionVideoLink != "") {
				instructionVideoInfo = {
					instructionVideo : response.InstructionVideoLink
				};
				Ti.App.Properties.setObject("instructionVideoInfo", instructionVideoInfo);
			} else {
				if (Ti.App.Properties.hasProperty("instructionVideoInfo") == true) {
					Ti.App.Properties.removeProperty("instructionVideoInfo");
				}
			}

			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('welcomeScreen', {
				welcomeContent : response.WelcomeText,
				CognitionSettings : response.CognitionSettings,
				isFrom : "signUpUser"

			});
			setTimeout(function() {
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow("signupUserRegister");
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow("signupUserConsent");
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow("signupUser");
			}, 1000);

		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && parentWindow.windowName === "home") {
			parentWindow.window.updateTheme();
		}
		commonFunctions.closeActivityIndicator();

	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("signinStudy", "signUpAPISuccess", ex);
	}
}

function setAppSettingsProperty(settingsData) {

	if (settingsData.appColor == null || settingsData.appColor == "") {
		settingsData.appColor = "#359FFE";
	}
	var selectedAppBackground = "/images/common/blue-bg.png";
	if (settingsData.appColor == "#359FFE") {
		selectedAppBackground = "/images/common/blue-bg.png";
	} else if (settingsData.appColor == "#FF9500") {
		selectedAppBackground = "/images/common/orange-bg.png";
	} else if (settingsData.appColor == "#4CD964") {
		selectedAppBackground = "/images/common/green-bg.png";
	} else if (settingsData.appColor == "#5756D6") {
		selectedAppBackground = "/images/common/violet-bg.png";
	} else if (settingsData.appColor == "#02C1AC") {
		selectedAppBackground = "/images/common/turquoise-bg.png";
	} else if (settingsData.appColor == "#313C4A") {
		selectedAppBackground = "/images/common/black-bg.png";
	}
	var settingsInfo = {
		userSettingsId : settingsData.userSettingsId,
		userId : settingsData.userId,
		appColor : settingsData.appColor,
		appBackground : selectedAppBackground,
		sympSurveySlotID : settingsData.sympSurveySlotID,
		sympSurveySlotTime : settingsData.sympSurveySlotTime,
		sympSurveyRepeatID : settingsData.sympSurveyRepeatID,
		cognTestSlotID : settingsData.cognTestSlotID,
		cognTestSlotTime : settingsData.cognTestSlotTime,
		cognTestRepeatID : settingsData.cognTestRepeatID,
		contactNo : settingsData.contactNo,
		personalHelpline : settingsData.personalHelpline,
		Protocol : settingsData.Protocol
	};
	Alloy.Globals.HEADER_COLOR = settingsInfo.appColor;
	Alloy.Globals.BACKGROUND_IMAGE = settingsInfo.appBackground;
	Ti.App.Properties.setObject("SettingsInfo", settingsInfo);
}

/**
 * Signin API Calling Failure
 */
function signUpFailure(e) {
	commonFunctions.closeActivityIndicator();
}

/**
 * Return Event handlers for text boxes to focus on next.
 */
$.firstName.addEventListener('return', function() {
	$.lastName.focus();
});

$.lastName.addEventListener('return', function() {
	$.emailId.focus();
});

$.emailId.addEventListener('return', function() {
	$.password.focus();
});

$.password.addEventListener('return', function() {
	$.confirmPassword.focus();
});

/**
 * Event handler used to hide soft keyboard while taping in screen area
 */

$.bodyOuterContainer.addEventListener("click", hideSoftKeyboard);

// Function to hide soft key board.
function hideSoftKeyboard(e) {
	// andorid is not currently used.
	if (e.source.id != "firstName" && e.source.id != "lastName" && e.source.id != "emailId" && e.source.id != "password" && e.source.id != "confirmPassword") {
		if (OS_ANDROID) {
			Ti.UI.Android.hideSoftKeyboard();
		} else {
			$.firstName.blur();
			$.lastName.blur();
			$.emailId.blur();
			$.password.blur();
			$.confirmPassword.blur();
		}
	}
}

/**
 * Function for validation.
 */
function isValid() {
	var LangCode = Ti.App.Properties.getString('languageCode');
	if (LangCode == "" || LangCode == null) {
		LangCode = "en";
	}
	var firstName = $.firstName.value.trim();
	var lastName = $.lastName.value.trim();
	var email = $.emailId.value.trim();
	var password = $.password.value.trim();
	var confirmPassword = $.confirmPassword.value.trim();

	if (firstName == "") {
		commonFunctions.showAlert(commonFunctions.L('specifyfirstName', LangCode), function() {
			if (OS_ANDROID) {
				$.firstName.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
			}
			$.firstName.focus();
		});
		return false;
	}

	if (lastName == "") {
		commonFunctions.showAlert(commonFunctions.L('specifyLastName', LangCode), function() {
			if (OS_ANDROID) {
				$.lastName.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
			}
			$.lastName.focus();
		});
		return false;
	}

	if (email == "") {
		commonFunctions.showAlert(commonFunctions.L('specifyEmail', LangCode), function() {

			if (OS_ANDROID) {
				$.emailId.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
			}

			$.emailId.focus();
		});
		return false;
	} else {
		// Check for invalid email
		if (validationFunctions.isValidEmail(email) == false) {
			commonFunctions.showAlert(commonFunctions.L('specifyValidEmail', LangCode), function() {
				if (OS_ANDROID) {
					$.emailId.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
				}
				$.emailId.focus();
			});
			return false;
		}
	}

	if (password == "") {
		commonFunctions.showAlert(commonFunctions.L('specifyPassword', LangCode), function() {
			if (OS_ANDROID) {
				$.password.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
			}
			$.password.focus();
		});
		return false;
	}

	if (confirmPassword == "") {
		commonFunctions.showAlert(commonFunctions.L('specifyConfirmPassword', LangCode), function() {
			if (OS_ANDROID) {
				$.confirmPassword.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
			}
			$.confirmPassword.focus();
		});
		return false;
	}

	if (password != confirmPassword) {
		commonFunctions.showAlert(commonFunctions.L('specifySameConfirmPassword', LangCode), function() {
			if (OS_ANDROID) {
				$.password.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
			}
			$.password.focus();
		});
		return false;
	}

	return true;
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
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow("signupUserRegister");
}

/**
 * function for android back
 */
$.signupUserRegister.addEventListener('android:back', function() {
	goBack();
});

init();
