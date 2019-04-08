// Arguments passed into this controller can be accessed via the `$.args` object directly or:
/**
 * Declarations
 */
var args = $.args;
var commonFunctions = require('commonFunctions');
var serviceManager = require('serviceManager');
var commonDB = require('commonDB');
var Picker = require('picker');

/**
 * getLanguage event handler
 */
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
		}];

	} catch(ex) {
		commonFunctions.handleException("signin", "getLanguage", ex);
	}
}

init();
function init() {
	if (OS_IOS) {
		if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
			$.headerContainer.height = "80dp";
			$.bodyOuterContainer2.top = "80dp";
			$.supportLabel.bottom="15dp";
		}

	}
	setLabel();
	setHintTextColor();
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
	$.headerView.setTitle(commonFunctions.L('signInStudentPageTitle', LangCode));
	$.studyCode.hintText = commonFunctions.L('studyCode', LangCode);
	$.studyId.hintText = commonFunctions.L('studyId', LangCode);
	$.password.hintText = commonFunctions.L('createPassword', LangCode);
	$.confirmPassword.hintText = commonFunctions.L('confirmPassword', LangCode);
	$.langHeader.text = commonFunctions.L('languageSelect', LangCode);
	$.signInStudyButton.text = commonFunctions.L('signIn', LangCode);
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
		listPicker.addToWindow($.signinStudy);

		listPicker.show();

		listPicker.addEventListener("done", function(e) {
			Alloy.Globals.IsSelected = 1;
			Ti.API.info('listPicker.selectedValue : ', listPicker.selectedValue);
			Ti.API.info('listPicker.selectedText : ', listPicker.selectedText);
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

/**
 * Set hint text color for lower SDKs
 */
function setHintTextColor() {
	var LangCode = Ti.App.Properties.getString('languageCode');
	if (LangCode == "" || LangCode == null) {
		LangCode = "en";
	}
	commonFunctions.setHintTextColor($.studyCode, commonFunctions.L('studyCode', LangCode), Alloy.Globals.HINTTEXT_COLOR);
	commonFunctions.setHintTextColor($.studyId, commonFunctions.L('studyId', LangCode), Alloy.Globals.HINTTEXT_COLOR);
	commonFunctions.setHintTextColor($.password, commonFunctions.L('createPassword', LangCode), Alloy.Globals.HINTTEXT_COLOR);
	commonFunctions.setHintTextColor($.confirmPassword, commonFunctions.L('confirmPassword', LangCode), Alloy.Globals.HINTTEXT_COLOR);
}

$.signinStudy.addEventListener("open", function(e) {
	setLabel();
	setTimeout(function() {
		enableAllTExtBoxes();
	}, 1000);

});
function enableAllTExtBoxes() {
	$.studyCode.editable = true;
	$.studyId.editable = true;
	$.password.editable = true;
	$.confirmPassword.editable = true;
}

/**
 * Navigate to Gust User Signup page.
 * @param {Object} e
 */
function onSignInClick(e) {
	signInStudySubmit();
}

/**
 * Return Event handlers for text boxes to focus on next.
 */
$.studyCode.addEventListener('return', function() {
	$.studyId.focus();
});

$.studyId.addEventListener('return', function() {
	$.password.focus();
});

$.password.addEventListener('return', function() {
	$.confirmPassword.focus();
});

// Event handler used to hide soft keyboard while taping in screen area
$.bodyOuterContainer.addEventListener("click", hideSoftKeyboard);
$.signinStudyContainer.addEventListener("click", hideSoftKeyboard);

// Function to hide soft key board.
function hideSoftKeyboard(e) {
	// andorid is not currently used.
	if (e.source.id != "studyCode" && e.source.id != "studyId" && e.source.id != "password" && e.source.id != "confirmPassword") {
		if (OS_ANDROID) {
			Ti.UI.Android.hideSoftKeyboard();
		} else {
			$.studyCode.blur();
			$.studyId.blur();
			$.password.blur();
			$.confirmPassword.blur();
		}
	}
}

/**
 * Function submit user information.
 */
function signInStudySubmit() {
	try {
		if (Alloy.Globals.IsSelected == 0) {
			Ti.App.Properties.setString('languageCode', "en");
		}
		var LangCode = Ti.App.Properties.getString('languageCode');
		// Form entry validation
		if (isValid() == false) {
			return;
		} else {
			var signInStudyDetails = [{
				"StudyCode" : $.studyCode.value.trim(),
				"StudyId" : $.studyId.value.trim(),
				"password" : $.password.value.trim(),
				"Language" : LangCode
			}];

			if (Ti.Network.online) {
				commonFunctions.openActivityIndicator(commonFunctions.L('activitySaving', LangCode));
				serviceManager.userSignUp(signInStudyDetails, signInStudySuccess, signInStudyFailure);
			} else {
				commonFunctions.closeActivityIndicator();
				commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));
			}

		}

	} catch(ex) {
		commonFunctions.handleException("signinStudy", "signInStudySubmit", ex);
	}
}

/**
 * Signin API Calling Success
 */
function signInStudySuccess(e) {
	try {

		var response = JSON.parse(e.data);

		Ti.API.info('***SIGN IN STUDY RESPONSE****  ', JSON.stringify(response));

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

			// Set credentials in property, it will be used for auto login.
			Alloy.Globals.setCredentials($.studyId.value.trim(), $.password.value.trim(), settingsData.userId, 0);
			commonDB.insertSettingsData(settingsData);
			setAppSettingsProperty(settingsData);
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow("home");
			setTimeout(function() {
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow("signinStudy");
			}, 1000);
			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && parentWindow.windowName === "home") {
				parentWindow.window.updateTheme();
			}
		} else {
			commonFunctions.closeActivityIndicator();
			commonFunctions.showAlert(response.ErrorMessage);
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
function signInStudyFailure(e) {
	commonFunctions.closeActivityIndicator();

}

/**
 * Function to validate form entries.
 */
function isValid() {
	var LangCode = Ti.App.Properties.getString('languageCode');
	if (LangCode == "" || LangCode == null) {
		LangCode = "en";
	}
	var studyCode = $.studyCode.value.trim();
	var studyId = $.studyId.value.trim();
	var password = $.password.value.trim();
	var confirmPassword = $.confirmPassword.value.trim();

	if (isStudyCodeValid(studyCode) == false) {
		return false;
	}

	if (isStudyIdValid(studyId) == false) {
		return false;
	}

	if (studyId.length > 15) {
		commonFunctions.showAlert("Please enter a valid Study ID", function() {
			if (OS_ANDROID) {
				$.studyId.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
			}
			$.studyId.focus();
		});
		return false;
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
 * Function to validate study code, other logic should be implemented like type checking and online checking.- anish.
 * If no other validation is required it can be withing 'isValid' function.
 * @param {Object} studyCode
 */
function isStudyCodeValid(studyCode) {
	var LangCode = Ti.App.Properties.getString('languageCode');
	if (LangCode == "" || LangCode == null) {
		LangCode = "en";
	}
	if (studyCode == "") {

		commonFunctions.showAlert(commonFunctions.L('specifyStudyCode', LangCode), function() {
			if (OS_ANDROID) {
				$.studyCode.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
			}
			$.studyCode.focus();
		});

		return false;
	}

	return true;
}

/**
 * Function to validate study Id, other logic should be implemented like type checking and online checking.- anish
 * If no other validation is required it can be withing 'isValid' function.
 * @param {Object} studyCode
 */
function isStudyIdValid(studyId) {
	var LangCode = Ti.App.Properties.getString('languageCode');
	if (LangCode == "" || LangCode == null) {
		LangCode = "en";
	}
	if (studyId == "") {

		commonFunctions.showAlert(commonFunctions.L('specifyStudyId', LangCode), function() {
			if (OS_ANDROID) {
				$.studyId.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
			}
			$.studyId.focus();
		});

		return false;
	}

	return true;
}

$.headerView.on('backButtonClick', function(e) {
	goBack();
});

function goBack() {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow("signinStudy");
	var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();

	if (parentWindow != null && parentWindow.windowName === "signin") {
		parentWindow.window.refreshSignIn();
	}

}

/**
 * function for android back
 */
$.signinStudy.addEventListener('android:back', function() {
	goBack();
});

