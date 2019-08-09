/**
 * Declarations
 */
{
	var args = $.args;
	var selectedAppColor = 1;
	var commonFunctions = require('commonFunctions');
	var commonLanguage;
	var LangCode = Ti.App.Properties.getString('languageCode');
	var notificationManager = require('notificationManager');
	var commonDB = require('commonDB');
	var validation = require('validation');
	var serviceManager = require('serviceManager');
	if (OS_IOS)
		var notify = require('zco.alarmmanager');
	var Picker = require('picker');
	var currentSymptomtime = "";
	var currentCoginitiontime = "";
	var selectedAppColorCode = "";
	var phoneLink = /^[\(\)\s\-\+\d]{10,17}$/;
	var previousAppColorCode = "";
	var userSettingsID;
	var settingsInfo;
	var arrayItems = [];
	var selectedSlot = "";
	var selectedSurvey = [];
	var selectedSurveyText = [];
	var selectedCognition = [];
	var selectedCognitionText = [];
	var selectedSurveyOrg = [];
	var selectedSurveyTextOrg = [];
	var selectedCognitionOrg = [];
	var selectedCognitionTextOrg = [];
	var isSurveyPopUp = false;
	var selectedCode;

	var cognitionTestArray = [{
		"id" : 1,
		"name" : commonFunctions.L('nbackTest', LangCode) ,
	}, {
		"id" : 2,
		"name" : commonFunctions.L('trailsBTest', LangCode),
	}, {
		"id" : 3,
		"name" : commonFunctions.L('spatialFrwd', LangCode),
	}, {
		"id" : 4,
		"name" : commonFunctions.L('spatialBckwrd', LangCode),
	}, {
		"id" : 5,
		"name" : commonFunctions.L('memoryTest', LangCode),
	}, {
		"id" : 6,
		"name" : commonFunctions.L('serial7', LangCode),
	}, {
		"id" : 8,
		"name" : commonFunctions.L('figCopy', LangCode),
	}, {
		"id" : 9,
		"name" : commonFunctions.L('visualGame', LangCode),
	}, {
		"id" : 10,
		"name" : commonFunctions.L('digitFWrd', LangCode),
	}, {
		"id" : 13,
		"name" : commonFunctions.L('digitBckWrd', LangCode),
	}, {
		"id" : 11,
		"name" : commonFunctions.L('catdog', LangCode),
	}, {
		"id" : 12,
		"name" : commonFunctions.L('temporalOrder', LangCode),
	}, {
		"id" : 15,
		"name" : commonFunctions.L('trailsBTestNew', LangCode),
	}, {
		"id" : 14,
		"name" : commonFunctions.L('nbackTestNew', LangCode),
	}, {
		"id" : 16,
		"name" : commonFunctions.L('trailsBTouch', LangCode),
	}, {
		"id" : 17,
		"name" : commonFunctions.L('jwelA', LangCode),
	}, {
		"id" : 18,
		"name" : commonFunctions.L('jwelB', LangCode),
	}];
	var isGuest = Ti.App.Properties.getString("isGuest", "");
	var surveyArray = [];
	var protoIsEnabled = 0;
	var previousProto = 0;
}
var credentials = Alloy.Globals.getCredentials();
Ti.API.info('credential in settings  is' + credentials.userId);

/**
 * getSlot event handler
 */
function getSlot() {
	try {
		var LangCode = Ti.App.Properties.getString('languageCode');
		return [{
			value : 1,
			title : commonFunctions.L('morningLbl', LangCode)
		}, {
			value : 2,
			title : commonFunctions.L('noonLbl', LangCode)
		}, {
			value : 3,
			title : commonFunctions.L('eveningLbl', LangCode)
		}];

	} catch(ex) {
		commonFunctions.handleException("settings", "getSlot", ex);
	}
}

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
		commonFunctions.handleException("settings", "getLanguage", ex);
	}
}

/**
 * getTimeSlot event handler
 */
function getTimeSlot() {
	try {
		var LangCode = Ti.App.Properties.getString('languageCode');
		return [{
			value : 2,
			title : commonFunctions.L('threeHrLbl', LangCode)
		}, {
			value : 3,
			title : commonFunctions.L('sixHrLbl', LangCode)
		}, {
			value : 4,
			title : commonFunctions.L('twelveLbl', LangCode)
		}, {
			value : 5,
			title : commonFunctions.L('dailLbl', LangCode)
		}, {
			value : 6,
			title : commonFunctions.L('biweekLbl', LangCode)
		}, {
			value : 7,
			title : commonFunctions.L('triWeekLbl', LangCode)
		}, {
			value : 8,
			title : commonFunctions.L('weeklyLbl', LangCode)
		}, {
			value : 9,
			title : commonFunctions.L('bimonthlyLbl', LangCode)
		}, {
			value : 10,
			title : commonFunctions.L('monthlyLbl', LangCode)
		}];

	} catch(ex) {
		commonFunctions.handleException("settings", "getTimeSlot", ex);
	}
}

/***
 * Handles Header back
 */
$.headerView.on('backButtonClick', function(e) {
	goBack();
});

/**
 * goBack event handler
 */
function goBack(e) {
	Alloy.Globals.HEADER_COLOR = previousAppColorCode;
	Ti.App.Properties.setString('languageCode', commonLanguage);
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('settings');
	var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	if (parentWindow != null && parentWindow.windowName === "newHomeScreen") {
		parentWindow.window.refreshHomeScreen();
	} else if (parentWindow != null && parentWindow.windowName === "home") {
		parentWindow.window.refreshLabelsHomeScreen();
	}

}

/***
 * slot click event
 */
function onGetLanguage(e) {
	try {
		var LangCode = Ti.App.Properties.getString('languageCode');
		var selectedText = "";
		if (e.source.id == "languageSlot") {
			selectedText = $.languageSlotLabel.text;
		}
		ShowLanguagePicker(getLanguage(), selectedText, commonFunctions.L('languageCapsSelect', LangCode), function(val, index, code) {
			if (e.source.id == "languageSlot") {
				$.languageSlotLabel.text = val;
				$.languageSlotLabel.index = index;
				Ti.App.Properties.setString('languageCode', code);
				setLabel();
				getTimeSlot();
				getSlot();
			}

		});
	} catch(ex) {
		commonFunctions.handleException("setings", "onGetLanguage", ex);
	}

}

/**
 * Shows the picker
 */
function ShowLanguagePicker(options, defaultText, headerText, doneCallBack, itemChangeCallback) {
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
		listPicker.addToWindow($.settings);

		listPicker.show();

		listPicker.addEventListener("done", function(e) {
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

/***
 * Handles report image click
 */
$.headerView.on('reportButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});

/**
 * function for android back
 */
$.settings.addEventListener('android:back', function() {
	goBack();
});

/***
 * Save settings
 */
$.headerView.on('rightButtonClick', function(e) {
	try {
		var LangCode = Ti.App.Properties.getString('languageCode');
		Alloy.Globals.HEADER_COLOR = selectedAppColorCode;
		Alloy.Globals.BACKGROUND_IMAGE = selectedAppBackground;
		if ($.contactNumber.value.trim().length > 0 && !$.contactNumber.value.match(phoneLink)) {
			commonFunctions.showAlert(commonFunctions.L('validContactNumb', LangCode), function() {
				$.contactNumber.focus();
			});
		} else if ($.emergencyNumber.value.trim().length > 0 && !$.emergencyNumber.value.match(phoneLink)) {
			commonFunctions.showAlert(commonFunctions.L('validPersonalNumb', LangCode), function() {
				$.emergencyNumber.focus();
			});
		} else {
			if (validateTime()) {

				var surveyIdString = "";
				Ti.API.info('selectedSurvey.length : ', selectedSurvey.length);
				for (var i = 0; i < selectedSurvey.length; i++) {
					if (i == 0) {
						surveyIdString = selectedSurvey[i];
					} else {
						surveyIdString = surveyIdString + "," + selectedSurvey[i];
					}
				}

				var cogIdString = "";
				for (var i = 0; i < selectedCognition.length; i++) {
					if (i == 0) {
						cogIdString = selectedCognition[i];
					} else {
						cogIdString = cogIdString + "," + selectedCognition[i];
					}
				}

				settingsInfo = {
					userSettingsId : userSettingsID,
					userId : credentials.userId,
					appColor : selectedAppColorCode,
					appBackground : selectedAppBackground,
					sympSurveySlotID : $.symptomSlotLabel.index + 1,
					sympSurveySlotTime : currentSymptomtime,
					sympSurveyRepeatID : $.symptomRepeatLabel.index + 1,
					cognTestSlotID : $.cognitionSlotLabel.index + 1,
					cognTestSlotTime : currentCoginitiontime,
					cognTestRepeatID : $.cognitionRepeatLabel.index + 1,
					contactNo : $.contactNumber.value,
					personalHelpline : $.emergencyNumber.value,
					PrefferedSurveys : surveyIdString,
					PrefferedCognitions : cogIdString,
					Protocol : protoIsEnabled,
					Language : LangCode
				};

				if (selectedAppColorCode == "#359FFE") {
					Alloy.Globals.SYMPTOM_ACTIVE = "/images/surveys/icn-symptom-survey-active.png";
					Alloy.Globals.COGINITION_ACTIVE = "/images/surveys/icn-cognition-test-active.png";
					Alloy.Globals.ENVIRONMENT_ACTIVE = "/images/surveys/icn-environment-active.png";
					Alloy.Globals.HELP_ACTIVE = "/images/surveys/icn-help-active.png";

				} else if (selectedAppColorCode == "#FF9500") {
					Alloy.Globals.SYMPTOM_ACTIVE = "/images/surveys/icn-orange-symptom-survey-active.png";
					Alloy.Globals.COGINITION_ACTIVE = "/images/surveys/icn-orange-cognition-test-active.png";
					Alloy.Globals.ENVIRONMENT_ACTIVE = "/images/surveys/icn-orange-environment-active.png";
					Alloy.Globals.HELP_ACTIVE = "/images/surveys/icn-orange-help-active.png";
				} else if (selectedAppColorCode == "#4CD964") {
					Alloy.Globals.SYMPTOM_ACTIVE = "/images/surveys/icn-green-symptom-survey-active.png";
					Alloy.Globals.COGINITION_ACTIVE = "/images/surveys/icn-green-cognition-test-active.png";
					Alloy.Globals.ENVIRONMENT_ACTIVE = "/images/surveys/icn-green-environment-active.png";
					Alloy.Globals.HELP_ACTIVE = "/images/surveys/icn-green-help-active.png";
				} else if (selectedAppColorCode == "#5756D6") {
					Alloy.Globals.SYMPTOM_ACTIVE = "/images/surveys/icn-violet-symptom-survey-active.png";
					Alloy.Globals.COGINITION_ACTIVE = "/images/surveys/icn-violet-cognition-test-active.png";
					Alloy.Globals.ENVIRONMENT_ACTIVE = "/images/surveys/icn-violet-environment-active.png";
					Alloy.Globals.HELP_ACTIVE = "/images/surveys/icn-violet-help-active.png";
				} else if (selectedAppColorCode == "#02C1AC") {
					Alloy.Globals.SYMPTOM_ACTIVE = "/images/surveys/icn-turquoise-symptom-survey-active.png";
					Alloy.Globals.COGINITION_ACTIVE = "/images/surveys/icn-turquoise-cognition-test-active.png";
					Alloy.Globals.ENVIRONMENT_ACTIVE = "/images/surveys/icn-turquoise-environment-active.png";
					Alloy.Globals.HELP_ACTIVE = "/images/surveys/icn-turquoise-help-active.png";
				} else if (selectedAppColorCode == "#313C4A") {
					Alloy.Globals.SYMPTOM_ACTIVE = "/images/surveys/icn-black-symptom-survey-active.png";
					Alloy.Globals.COGINITION_ACTIVE = "/images/surveys/icn-black-cognition-test-active.png";
					Alloy.Globals.ENVIRONMENT_ACTIVE = "/images/surveys/icn-black-environment-active.png";
					Alloy.Globals.HELP_ACTIVE = "/images/surveys/icn-black-help-active.png";
				}

				if (Ti.Network.online) {
					commonFunctions.openActivityIndicator(commonFunctions.L('activitySaving', LangCode));
					serviceManager.saveUserSettings(settingsInfo, saveUserSettingsSuccess, saveUserSettingsFailure);

				} else {
					commonFunctions.closeActivityIndicator();
					commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));
				}
			}

		}

	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("settings", "rightButtonClick", ex);
	}
});
/**
 * Signin API Calling Success
 */
function saveUserSettingsSuccess(e) {
	try {
		commonFunctions.closeActivityIndicator();
		var response = JSON.parse(e.data);

		Ti.API.info('***SAVE SETTINGS  RESPONSE****  ', JSON.stringify(response));

		if (response.ErrorCode == 0) {
			settingsInfo.sympSurveySlotTime = new Date(currentSymptomtime).toString();
			settingsInfo.cognTestSlotTime = new Date(currentCoginitiontime).toString();
			Ti.App.Properties.setObject("SettingsInfo", settingsInfo);

			commonDB.insertSettingsData(settingsInfo);
			if (protoIsEnabled == 1) {
				Ti.App.Properties.setString('isProtocolActivated', 1);
			} else {
				Ti.App.Properties.setString('isProtocolActivated', 0);
			}

			var surveyReminder = Ti.App.Properties.getObject("surveyReminder");
			if (Ti.App.Properties.hasProperty("surveyReminder") && selectedSurvey.length != 0) {
				surveyReminder.surveyId = selectedSurvey;
				surveyReminder.surveyText = selectedSurveyText;
				surveyReminder.currentSurvey = 0;
				Ti.App.Properties.setObject("surveyReminder", surveyReminder);

			}
			var coginitionReminder = Ti.App.Properties.getObject("coginitionReminder");
			if (Ti.App.Properties.hasProperty("coginitionReminder") && selectedCognition.length != 0) {
				coginitionReminder.coginitionId = selectedCognition;
				coginitionReminder.coginitionText = selectedCognitionText;
				coginitionReminder.currentCoginition = 0;
				Ti.App.Properties.setObject("coginitionReminder", coginitionReminder);

			}

			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('settings');
			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && parentWindow.windowName === "home") {
				parentWindow.window.updateTheme();
				parentWindow.window.refreshLabelsHomeScreen();
			}

			if ($.symptomRepeatLabel.index >= 0 && selectedSurveyText != "") {
				if (Ti.App.Properties.hasProperty("surveyReminder")) {
					var resltValue = {
						"userID" : credentials.userId,
						"repeateID" : parseInt($.symptomRepeatLabel.index) + 1,
						"isSurvey" : 1,
						"setDate" : $.symptomTimeLabel.text
					};
					console.log("resltValue");
					console.log(resltValue);
					commonDB.insertLocalShedule(resltValue);
				}

			}
			if ($.cognitionRepeatLabel.index >= 0 && selectedCognitionText != "") {
				if (Ti.App.Properties.hasProperty("coginitionReminder")) {
					var resltValue = {
						"userID" : credentials.userId,
						"repeateID" : parseInt($.cognitionRepeatLabel.index) + 1,
						"isSurvey" : 0,
						"setDate" : $.coginitionTimeLabel.text
					};
					console.log("resltValue");
					console.log(resltValue);
					commonDB.insertLocalShedule(resltValue);
					arrayItems = [];
				}

			}
			Ti.App.fireEvent("resetAllNotifications");

		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}

	} catch(ex) {
		commonFunctions.handleException("Settings", "saveUserSettingsSuccess", ex);
	}
}

/**
 * Signin API Calling Failure
 */
function saveUserSettingsFailure(e) {
	commonFunctions.closeActivityIndicator();
	Ti.API.info('saveUserSettingsFailure : ', JSON.stringify(e));
}

/***
 * Open window
 */
$.settings.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.MainView.top = "80dp";
				$.logOutAccountView.bottom = "20dp";
			}
		}
		commonLanguage = LangCode;
		$.headerView.setTitle(commonFunctions.L('settingsHeader', LangCode));
		$.appColorHeader.text = commonFunctions.L('appColor', LangCode);
		$.surveyHeader.text = commonFunctions.L('symptomSurveyHeader', LangCode);
		$.symptomSlotLbl.text = commonFunctions.L('selectSlot', LangCode);
		$.slotLbl.text = commonFunctions.L('selectSlot', LangCode);
		$.emergencyHeader.text = commonFunctions.L('emergencyContact', LangCode);
		$.emergencyLbl.text = commonFunctions.L('contactnumberLbl', LangCode);
		$.personalHelpineLbl.text = commonFunctions.L('personalHelpLine', LangCode);
		$.protocolTextLbl.text = commonFunctions.L('protocolLbl', LangCode);
		$.cogLbl.text = commonFunctions.L('cognitionTestHeader', LangCode);
		$.logoutAccountLabel.text = commonFunctions.L('signoutLbl', LangCode);
		$.langLbl.text = commonFunctions.L('languageCapsSelect', LangCode);
		$.langTitle.text = commonFunctions.L('languageCapsSelect', LangCode);
		$.slotSurveytimeLbl.text = commonFunctions.L('slottinmeLbl', LangCode);
		$.slotTimeLbl.text = commonFunctions.L('slottinmeLbl', LangCode);
		$.repeatLbl.text = commonFunctions.L('repeatLbl', LangCode);
		$.selectCogLbl.text = commonFunctions.L('selectcognitionLbl', LangCode);
		$.surveyRepeatLbl.text = commonFunctions.L('repeatLbl', LangCode);
		$.selectSurveyLbl.text = commonFunctions.L('selectSurveyLbl', LangCode);
		var languageValue = commonFunctions.getLanguage(LangCode);
		$.languageSlotLabel.text = languageValue.language;
		$.headerView.setRightViewPosition();
		surveyArray = commonDB.getSurveyTypes();
		if (Ti.Network.online) {
			commonFunctions.openActivityIndicator(commonFunctions.L('activityLoading', LangCode));
			var LastUpdatedDate = Ti.App.Properties.getString("surveyLastUpdatedDate", "");
			serviceManager.getSurveyList(credentials.userId, LastUpdatedDate, getSurveyListSuccess, getSurveyListFailure);
		} else {
			openWindow();
		}

	} catch(ex) {
		commonFunctions.handleException("settings", "open", ex);
	}
});

/**
 * Set label
 */
function setLabel() {
	var LangCode = Ti.App.Properties.getString('languageCode');
	$.headerView.setTitle(commonFunctions.L('settingsHeader', LangCode));
	$.appColorHeader.text = commonFunctions.L('appColor', LangCode);
	$.surveyHeader.text = commonFunctions.L('symptomSurveyHeader', LangCode);
	$.symptomSlotLbl.text = commonFunctions.L('selectSlot', LangCode);
	$.slotLbl.text = commonFunctions.L('selectSlot', LangCode);
	$.emergencyHeader.text = commonFunctions.L('emergencyContact', LangCode);
	$.emergencyLbl.text = commonFunctions.L('contactnumberLbl', LangCode);
	$.personalHelpineLbl.text = commonFunctions.L('personalHelpLine', LangCode);
	$.protocolTextLbl.text = commonFunctions.L('protocolLbl', LangCode);
	$.cogLbl.text = commonFunctions.L('cognitionTestHeader', LangCode);
	$.selectCogLbl.text = commonFunctions.L('selectcognitionLbl', LangCode);
	$.logoutAccountLabel.text = commonFunctions.L('signoutLbl', LangCode);
	$.langLbl.text = commonFunctions.L('languageCapsSelect', LangCode);
	$.langTitle.text = commonFunctions.L('languageCapsSelect', LangCode);
	$.slotSurveytimeLbl.text = commonFunctions.L('slottinmeLbl', LangCode);
	$.slotTimeLbl.text = commonFunctions.L('slottinmeLbl', LangCode);
	$.repeatLbl.text = commonFunctions.L('repeatLbl', LangCode);
	$.surveyRepeatLbl.text = commonFunctions.L('repeatLbl', LangCode);
	$.selectSurveyLbl.text = commonFunctions.L('selectSurveyLbl', LangCode);
	var settingsInfo = commonDB.getSettingsData(credentials.userId);
	var surveySlot = getSlot();
	var timeSlot = getTimeSlot();
	$.symptomSlotLabel.text = surveySlot[settingsInfo.sympSurveySlotID - 1].title;
	$.symptomRepeatLabel.text = timeSlot[settingsInfo.sympSurveyRepeatID - 1].title;
	$.cognitionSlotLabel.text = surveySlot[settingsInfo.cognTestSlotID - 1].title;
	$.cognitionRepeatLabel.text = timeSlot[settingsInfo.cognTestRepeatID - 1].title;

	$.symptomSlotLabel.index = settingsInfo.sympSurveySlotID - 1;
	$.symptomRepeatLabel.index = settingsInfo.sympSurveyRepeatID - 1;
	$.cognitionSlotLabel.index = settingsInfo.cognTestSlotID - 1;
	$.cognitionRepeatLabel.index = settingsInfo.cognTestRepeatID - 1;

	var returnSysValues = commonFunctions.setDayTime($.symptomTimeLabel.text);
	returnSysValues = returnSysValues.split("/");
	$.symptomSlotLabel.text = returnSysValues[0];
	$.symptomSlotLabel.index = parseInt(returnSysValues[1]);
	var returnCogValues = commonFunctions.setDayTime($.coginitionTimeLabel.text);
	returnCogValues = returnCogValues.split("/");
	$.cognitionSlotLabel.text = returnCogValues[0];
	$.cognitionSlotLabel.index = parseInt(returnCogValues[1]);

	var coginitionReminder = Ti.App.Properties.getObject("coginitionReminder");

	if (Ti.App.Properties.hasProperty("coginitionReminder")) {
		var displayText = "";
		selectedCognition = coginitionReminder.coginitionId;
		selectedCognitionText = [];

		var LangCode = Ti.App.Properties.getString('languageCode');
		var cognitionTestArray = [{
			"id" : 1,
			"name" : commonFunctions.L('nbackTest', LangCode) ,
		}, {
			"id" : 2,
			"name" : commonFunctions.L('trailsBTest', LangCode),
		}, {
			"id" : 3,
			"name" : commonFunctions.L('spatialFrwd', LangCode),
		}, {
			"id" : 4,
			"name" : commonFunctions.L('spatialBckwrd', LangCode),
		}, {
			"id" : 5,
			"name" : commonFunctions.L('memoryTest', LangCode),
		}, {
			"id" : 6,
			"name" : commonFunctions.L('serial7', LangCode),
		}, {
			"id" : 8,
			"name" : commonFunctions.L('figCopy', LangCode),
		}, {
			"id" : 9,
			"name" : commonFunctions.L('visualGame', LangCode),
		}, {
			"id" : 10,
			"name" : commonFunctions.L('digitFWrd', LangCode),
		}, {
			"id" : 13,
			"name" : commonFunctions.L('digitBckWrd', LangCode),
		}, {
			"id" : 11,
			"name" : commonFunctions.L('catdog', LangCode),
		}, {
			"id" : 12,
			"name" : commonFunctions.L('temporalOrder', LangCode),
		}, {
			"id" : 15,
			"name" : commonFunctions.L('trailsBTestNew', LangCode),
		}, {
			"id" : 14,
			"name" : commonFunctions.L('nbackTestNew', LangCode),
		}, {
			"id" : 16,
			"name" : commonFunctions.L('trailsBTouch', LangCode),
		}, {
			"id" : 17,
			"name" : commonFunctions.L('jwelA', LangCode),
		}, {
			"id" : 18,
			"name" : commonFunctions.L('jwelB', LangCode),
		}];
		for (var i = 0; i < cognitionTestArray.length; i++) {
			for (var j = 0; j < selectedCognition.length; j++) {
				if (cognitionTestArray[i].id == selectedCognition[j]) {
					selectedCognitionText.push(cognitionTestArray[i].name);
				};
			};
		}
		for (var i = 0; i < selectedCognitionText.length; i++) {
			if (displayText == "") {
				displayText = selectedCognitionText[i];
			} else {
				displayText = displayText + ", " + selectedCognitionText[i];
			}
		}
		if (displayText != "") {
			if (commonFunctions.getIsTablet()) {
				displayText = commonFunctions.trimText(displayText, 80);
			} else {
				displayText = commonFunctions.trimText(displayText, 35);
			}
			$.cognitionTestLabel.text = displayText;
		}

	}

}

/**
 * getSheduleSettingsSuccess event
 */
function getSheduleSettingsSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		Ti.API.info('***getSheduleSettingsSuccess****  ', JSON.stringify(response));

		if (response.ErrorCode == 0) {
			if (Ti.Network.online) {
				var LastUpdatedDate = Ti.App.Properties.getString("surveyLastUpdatedDate", "");
				serviceManager.getSurveyList(credentials.userId, LastUpdatedDate, getSurveyListSuccess, getSurveyListFailure);
			}
			if (response.Data.SympSurveySlotTime != null) {
				var surveyTime = new Date(response.Data.SympSurveySlotTime).toString();

			}
			if (response.Data.CognTestSlotTime != null) {
				var cognitionTime = new Date(response.Data.CognTestSlotTime).toString();

			}

			var settingsData = {
				userId : response.Data.UserID,
				userSettingsId : response.Data.UserSettingID,
				sympSurveySlotID : response.Data.SympSurveySlotID,
				sympSurveySlotTime : surveyTime,
				sympSurveyRepeatID : response.Data.SympSurveyRepeatID,
				cognTestSlotID : response.Data.CognTestSlotID,
				cognTestSlotTime : cognitionTime,
				cognTestRepeatID : response.Data.CognTestRepeatID,

			};
			commonDB.updateShedules(settingsData);
			var surveyReminder = Ti.App.Properties.getObject("surveyReminder");
			if (Ti.App.Properties.hasProperty("surveyReminder")) {
				var prfSurvey = response.Data.PrefferedSurveys;
				if (prfSurvey != "") {
					var preSurveyArray = prfSurvey.split(",");
					var preSurveyTextArray = [];
					var tempPrevSurveyId = [];
					for (var i = 0; i < preSurveyArray.length; i++) {
						if (preSurveyArray[i] != 0) {
							var tempText = commonDB.getSurveyName(preSurveyArray[i]);
							if (tempText != "") {
								tempPrevSurveyId.push(preSurveyArray[i]);
								preSurveyTextArray.push(tempText);
							}

						}
					};
					surveyReminder.surveyId = tempPrevSurveyId;
					surveyReminder.surveyText = preSurveyTextArray;
					surveyReminder.currentSurvey = 0;
					Ti.App.Properties.setObject("surveyReminder", surveyReminder);

				}

			}
			var coginitionReminder = Ti.App.Properties.getObject("coginitionReminder");
			if (Ti.App.Properties.hasProperty("coginitionReminder")) {
				var prfCog = response.Data.PrefferedCognitions;
				if (prfCog != "") {
					var preCogArray = prfCog.split(",");
					var preCogTextArray = [];
					coginitionReminder.coginitionId = preCogArray;
					for (var i = 0; i < preCogArray.length; i++) {

						for (var j = 0; j < cognitionTestArray.length; j++) {
							if (cognitionTestArray[j].id == preCogArray[i]) {
								preCogTextArray.push(cognitionTestArray[j].name);
							}
						};

					};
					coginitionReminder.coginitionText = preCogTextArray;
					coginitionReminder.currentCoginition = 0;
					Ti.App.Properties.setObject("coginitionReminder", coginitionReminder);

				}

			}
			if (OS_IOS) {
				Ti.App.iOS.cancelAllLocalNotifications();
				notify.cancelAllNotification();
			} else {
				Ti.API.info('ARRAY:: ', Ti.App.Properties.getObject('requestCode'));
				Alloy.Globals.REQUEST_CODE_ARRAY = [];
				if (Ti.App.Properties.getObject('requestCode') != null) {
					cancelMultipleAlarm(Ti.App.Properties.getObject('requestCode'));
					Ti.App.Properties.setObject('requestCode', null);
					Alloy.Globals.REQUEST_CODE = 0;
				}
			}
			if (response.Data.SympSurveyRepeatID >= 0 && response.Data.PrefferedSurveys != "") {
				var formateTime = commonFunctions.getTwelveHrFormatTime(surveyTime);
			}
			if (response.Data.CognTestRepeatID >= 0 && response.Data.PrefferedCognitions != "") {
				var formateTime = commonFunctions.getTwelveHrFormatTime(cognitionTime);
				arrayItems = [];

			}

		}
		openWindow();
		commonFunctions.closeActivityIndicator();

	} catch(ex) {
		commonFunctions.handleException("settings", "getSheduleSettingsSuccess", ex);
	}

}

/**
 * getSurveyListSuccess event
 */
function getSurveyListSuccess(e) {

	try {
		var response = JSON.parse(e.data);
		Ti.API.info('***getSurveyListSuccess****  ', JSON.stringify(response));

		if (response.ErrorCode == 0) {
			Ti.App.Properties.setString('surveyLastUpdatedDate', response.LastUpdatedDate);
			var resultArrayList = response.Survey;
			for (var i = 0; i < resultArrayList.length; i++) {
				var surveyID = resultArrayList[i].SurveyID;
				var surveyName = resultArrayList[i].SurveyName;
				if (surveyName != null && surveyName != "") {
					commonDB.insertSurveyTypes(surveyID, surveyName, credentials.userId, resultArrayList[i].IsDeleted);
					commonDB.insertSurveyQuestions(resultArrayList[i].Questions, credentials.userId, surveyID, resultArrayList[i].LanguageCode);
				}

			};

		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}
		surveyArray = commonDB.getSurveyTypes();
		openWindow();
		commonFunctions.closeActivityIndicator();

	} catch(ex) {
		commonFunctions.handleException("surveyList", "getSurveyListSuccess", ex);
	}
}

/**
 * Failure api call
 */
function getSurveyListFailure(e) {
	Ti.API.info('***getSurveyListFailure****  ', JSON.stringify(e));
	openWindow();
	commonFunctions.closeActivityIndicator();

}

function getSheduleSettingsFailure(e) {
	Ti.API.info('***getSheduleSettingsFailure****  ', JSON.stringify(e));
	commonFunctions.closeActivityIndicator();
	openWindow();
}

function openWindow() {
	setLabel();

	if (OS_ANDROID)
		$.contactNumber.blur();
	var settingsInfo = commonDB.getSettingsData(credentials.userId);
	Ti.API.info('settingsInfo : ', JSON.stringify(settingsInfo));
	Ti.API.info('settings info from DB is' + JSON.stringify(settingsInfo));

	var coginitionReminder = Ti.App.Properties.getObject("coginitionReminder");
	if (Ti.App.Properties.hasProperty("coginitionReminder")) {
		var displayText = "";
		selectedCognition = coginitionReminder.coginitionId;
		selectedCognitionText = coginitionReminder.coginitionText;
		for (var i = 0; i < selectedCognitionText.length; i++) {
			if (displayText == "") {
				displayText = selectedCognitionText[i];
			} else {
				displayText = displayText + ", " + selectedCognitionText[i];
			}
		}
		if (displayText != "") {
			if (commonFunctions.getIsTablet()) {
				displayText = commonFunctions.trimText(displayText, 80);
			} else {
				displayText = commonFunctions.trimText(displayText, 35);
			}
			$.cognitionTestLabel.text = displayText;
		}

	}
	var surveyReminder = Ti.App.Properties.getObject("surveyReminder");
	Ti.API.info('surveyReminder : ', surveyReminder);
	if (Ti.App.Properties.hasProperty("surveyReminder")) {
		var displayText = "";
		selectedSurvey = surveyReminder.surveyId;
		selectedSurveyText = surveyReminder.surveyText;
		for (var i = 0; i < selectedSurveyText.length; i++) {
			if (displayText == "") {
				displayText = selectedSurveyText[i];
			} else {
				displayText = displayText + ", " + selectedSurveyText[i];
			}
		}
		Ti.API.info('displayText : ', displayText);
		if (displayText != "") {
			if (commonFunctions.getIsTablet()) {
				displayText = commonFunctions.trimText(displayText, 80);
			} else {
				displayText = commonFunctions.trimText(displayText, 35);
			}
			$.surveyLabel.text = displayText;
		}

	}

	if (settingsInfo != null && settingsInfo != undefined) {
		previousAppColorCode = settingsInfo.appColor;
		getAppColor(settingsInfo.appColor);
		userSettingsID = settingsInfo.userSettingID;

		if (settingsInfo.sympSurveySlotTime != null) {

			if (settingsInfo.sympSurveyRepeatID == 1 || settingsInfo.sympSurveyRepeatID == 2 || settingsInfo.sympSurveyRepeatID == 3) {
				currentSymptomtime = new Date();
				$.symptomTimeLabel.text = commonFunctions.getTwelveHrFormatTime(new Date());
			} else {
				currentSymptomtime = new Date(settingsInfo.sympSurveySlotTime);
				$.symptomTimeLabel.text = commonFunctions.getTwelveHrFormatTime(settingsInfo.sympSurveySlotTime);
			}

		} else {
			currentSymptomtime = new Date();
			$.symptomTimeLabel.text = commonFunctions.getTwelveHrFormatTime(new Date());
		}
		if (settingsInfo.cognTestSlotTime != null) {
			if (settingsInfo.cognTestRepeatID == 1 || settingsInfo.cognTestRepeatID == 2 || settingsInfo.cognTestRepeatID == 3) {
				currentCoginitiontime = new Date();
				$.coginitionTimeLabel.text = commonFunctions.getTwelveHrFormatTime(new Date());
			} else {
				currentCoginitiontime = new Date(settingsInfo.cognTestSlotTime);
				$.coginitionTimeLabel.text = commonFunctions.getTwelveHrFormatTime(settingsInfo.cognTestSlotTime);
			}

		} else {
			currentCoginitiontime = new Date();
			$.coginitionTimeLabel.text = commonFunctions.getTwelveHrFormatTime(new Date());
		}
		Ti.API.info('settingsInfo.Protocol: ', settingsInfo.Protocol);
		previousProto = settingsInfo.Protocol;
		if (settingsInfo.Protocol == 1 || settingsInfo.Protocol == true || settingsInfo.Protocol == "true") {
			Ti.API.info('Proto Enabled');
			protoIsEnabled = 1;
			$.protoSwitch.image = "/images/settings/switch_active.png";
		} else {
			Ti.API.info('Proto Diable');
			protoIsEnabled = 0;
			$.protoSwitch.image = "/images/settings/switch_deactive.png";
		}
		var surveySlot = getSlot();
		var timeSlot = getTimeSlot();
		Ti.API.info('survey slot', surveySlot);
		$.symptomSlotLabel.text = surveySlot[settingsInfo.sympSurveySlotID - 1].title;
		$.symptomRepeatLabel.text = timeSlot[settingsInfo.sympSurveyRepeatID - 1].title;
		$.cognitionSlotLabel.text = surveySlot[settingsInfo.cognTestSlotID - 1].title;
		$.cognitionRepeatLabel.text = timeSlot[settingsInfo.cognTestRepeatID - 1].title;

		$.symptomSlotLabel.index = settingsInfo.sympSurveySlotID - 1;
		$.symptomRepeatLabel.index = settingsInfo.sympSurveyRepeatID - 1;
		$.cognitionSlotLabel.index = settingsInfo.cognTestSlotID - 1;
		$.cognitionRepeatLabel.index = settingsInfo.cognTestRepeatID - 1;

		$.contactNumber.value = settingsInfo.contactNo;
		$.emergencyNumber.value = settingsInfo.personalHelpline;

		var returnSysValues = commonFunctions.setDayTime($.symptomTimeLabel.text);
		returnSysValues = returnSysValues.split("/");
		$.symptomSlotLabel.text = returnSysValues[0];
		$.symptomSlotLabel.index = parseInt(returnSysValues[1]);
		var returnCogValues = commonFunctions.setDayTime($.coginitionTimeLabel.text);
		returnCogValues = returnCogValues.split("/");
		$.cognitionSlotLabel.text = returnCogValues[0];
		$.cognitionSlotLabel.index = parseInt(returnCogValues[1]);
		if (settingsInfo.sympSurveyRepeatID == 1 || settingsInfo.sympSurveyRepeatID == 2 || settingsInfo.sympSurveyRepeatID == 3) {
			$.symptomTimeClickOuter.touchEnabled = false;
			$.symptomSlotviewOuter.touchEnabled = false;
		}
		if (settingsInfo.cognTestRepeatID == 1 || settingsInfo.cognTestRepeatID == 2 || settingsInfo.cognTestRepeatID == 3) {
			$.coginitionTimeClickOuter.touchEnabled = false;
			$.cognitionSlotviewOuter.touchEnabled = false;
		}
	} else {
		previousAppColorCode = "#359FFE";
		getAppColor();
		currentSymptomtime = new Date();
		currentCoginitiontime = new Date();
		$.symptomTimeLabel.text = commonFunctions.getTwelveHrFormatTime(currentSymptomtime);
		$.coginitionTimeLabel.text = commonFunctions.getTwelveHrFormatTime(currentCoginitiontime);
	}
	setTimeout(function() {
		$.MainView.visible = true;
	}, 100);

}

function switchChange() {
	if ($.protoSwitch.image == "/images/settings/switch_active.png") {
		protoIsEnabled = 0;
		$.protoSwitch.image = "/images/settings/switch_deactive.png";
	} else {
		protoIsEnabled = 1;
		$.protoSwitch.image = "/images/settings/switch_active.png";
	}
}

/***
 *Get current theme color
 */
function getAppColor(appColor) {
	try {
		var settingsInfo = Ti.App.Properties.getObject("SettingsInfo");
		if (appColor != null && appColor != undefined) {
			selectedAppColorCode = appColor;
			selectedAppBackground = settingsInfo.appBackground;
		} else {
			selectedAppColorCode = "#359FFE";
			selectedAppBackground = "/images/common/blue-bg.png";
		}
		if (selectedAppColorCode == "#359FFE") {
			selectedAppColor = 1;

		} else if (selectedAppColorCode == "#FF9500") {
			selectedAppColor = 2;

		} else if (selectedAppColorCode == "#4CD964") {
			selectedAppColor = 3;

		} else if (selectedAppColorCode == "#5756D6") {
			selectedAppColor = 4;

		} else if (selectedAppColorCode == "#02C1AC") {
			selectedAppColor = 5;

		} else if (selectedAppColorCode == "#313C4A") {
			selectedAppColor = 6;

		}
		setAppColor(selectedAppColor);
	} catch(ex) {
		commonFunctions.handleException("settings", "getAppColor", ex);
	}
}

/***
 *Theme click
 */
function appColorClick(e) {
	try {
		if (e.source.id == "colorView1" && selectedAppColor != 1) {
			selectedAppColorCode = "#359FFE";
			selectedAppBackground = "/images/common/blue-bg.png";
			selectedAppColor = 1;
		} else if (e.source.id == "colorView2" && selectedAppColor != 2) {
			selectedAppColorCode = "#FF9500";
			selectedAppBackground = "/images/common/orange-bg.png";
			selectedAppColor = 2;
		} else if (e.source.id == "colorView3" && selectedAppColor != 3) {
			selectedAppColorCode = "#4CD964";
			selectedAppBackground = "/images/common/green-bg.png";
			selectedAppColor = 3;
		} else if (e.source.id == "colorView4" && selectedAppColor != 4) {
			selectedAppColorCode = "#5756D6";
			selectedAppBackground = "/images/common/violet-bg.png";
			selectedAppColor = 4;
		} else if (e.source.id == "colorView5" && selectedAppColor != 5) {
			selectedAppColorCode = "#02C1AC";
			selectedAppBackground = "/images/common/turquoise-bg.png";
			selectedAppColor = 5;
		} else if (e.source.id == "colorView6" && selectedAppColor != 6) {
			selectedAppColorCode = "#313C4A";
			selectedAppBackground = "/images/common/black-bg.png";
			selectedAppColor = 6;
		}
		setAppColor(selectedAppColor);
		$.headerView.setHeaderColor(selectedAppColorCode);
		Alloy.Globals.HEADER_COLOR = selectedAppColorCode;

	} catch(ex) {
		commonFunctions.handleException("settings", "appColorClick", ex);
	}
}

/***
 *Set app theme color
 */
function setAppColor(colorType) {
	try {
		$.colorImage1.visible = false;
		$.colorImage2.visible = false;
		$.colorImage3.visible = false;
		$.colorImage4.visible = false;
		$.colorImage5.visible = false;
		$.colorImage6.visible = false;

		if (colorType == 1) {
			$.colorImage1.visible = true;
		} else if (colorType == 2) {
			$.colorImage2.visible = true;

		} else if (colorType == 3) {
			$.colorImage3.visible = true;

		} else if (colorType == 4) {
			$.colorImage4.visible = true;

		} else if (colorType == 5) {
			$.colorImage5.visible = true;

		} else if (colorType == 6) {
			$.colorImage6.visible = true;

		}
	} catch(ex) {
		commonFunctions.handleException("settings", "setAppColor", ex);
	}

}

/***
 * slot click event
 */
function slotClick(e) {
	try {
		var LangCode = Ti.App.Properties.getString('languageCode');
		var selectedText = "";
		if (e.source.id == "cognitionSlotviewOuter") {
			selectedText = $.cognitionSlotLabel.text;
			selectedSlot = $.cognitionSlotLabel.text;
		} else if (e.source.id == "symptomSlotviewOuter") {
			selectedText = $.symptomSlotLabel.text;
			selectedSlot = $.symptomSlotLabel.text;
		}

		ShowPicker(getSlot(), selectedText, commonFunctions.L('selectSlot', LangCode), function(val, index) {
			if (e.source.id == "cognitionSlotviewOuter") {
				$.cognitionSlotLabel.text = val;
				$.cognitionSlotLabel.index = index;
				selectedSlot = $.cognitionSlotLabel.text;
			} else if (e.source.id == "symptomSlotviewOuter") {
				$.symptomSlotLabel.text = val;
				$.symptomSlotLabel.index = index;
				selectedSlot = $.symptomSlotLabel.text;
			}

		});
	} catch(ex) {
		commonFunctions.handleException("settings", "slotClick", ex);
	}

}

/***
 *Reminder repeat click event
 */
function repeatClick(e) {
	try {
		var LangCode = Ti.App.Properties.getString('languageCode');
		var selectedText = "";
		if (e.source.id == "coginitionRepeateViewOuter") {
			selectedText = $.cognitionRepeatLabel.text;
		} else if (e.source.id == "symptomRepeateViewOuter") {
			selectedText = $.symptomRepeatLabel.text;
		}

		ShowPicker(getTimeSlot(), selectedText, commonFunctions.L('selectRepeat', LangCode), function(val, index) {
			Ti.API.info('repeatClick : ', val, index);
			if (e.source.id == "coginitionRepeateViewOuter") {
				$.cognitionRepeatLabel.text = val;
				$.cognitionRepeatLabel.index = index;
				if (index == 0 || index == 1 || index == 2) {
					$.coginitionTimeClickOuter.touchEnabled = false;
					$.cognitionSlotviewOuter.touchEnabled = false;
					var surveySlot = getSlot();
					currentCoginitiontime = new Date();
					var returnSysValues1 = commonFunctions.getTwelveHrFormatTime();
					var returnSysValues = returnSysValues1.split(" ");
					Ti.API.info('returnSysValues : ', returnSysValues);
					if (returnSysValues[1] === "AM") {
						$.cognitionSlotLabel.text = surveySlot[0].title;
						$.cognitionSlotLabel.index = 0;
						$.coginitionTimeLabel.text = returnSysValues1;
					} else if (returnSysValues[1] === "PM" && parseInt(returnSysValues[0]) >= 5 && parseInt(returnSysValues[0]) <= 11) {
						$.cognitionSlotLabel.text = surveySlot[2].title;
						$.cognitionSlotLabel.index = 2;
						$.coginitionTimeLabel.text = returnSysValues1;
					} else {
						$.cognitionSlotLabel.text = surveySlot[1].title;
						$.cognitionSlotLabel.index = 1;
						$.coginitionTimeLabel.text = returnSysValues1;
					}
				} else {
					$.coginitionTimeClickOuter.touchEnabled = true;
					$.cognitionSlotviewOuter.touchEnabled = true;
				}

			} else if (e.source.id == "symptomRepeateViewOuter") {
				$.symptomRepeatLabel.text = val;
				$.symptomRepeatLabel.index = index;
				if (index == 0 || index == 1 || index == 2) {
					$.symptomTimeClickOuter.touchEnabled = false;
					$.symptomSlotviewOuter.touchEnabled = false;
					var surveySlot = getSlot();
					currentSymptomtime = new Date();
					var returnSysValues1 = commonFunctions.getTwelveHrFormatTime();
					var returnSysValues = returnSysValues1.split(" ");
					Ti.API.info('returnSysValues : ', returnSysValues);
					if (returnSysValues[1] === "AM") {
						$.symptomSlotLabel.text = surveySlot[0].title;
						$.symptomSlotLabel.index = 0;
						$.symptomTimeLabel.text = returnSysValues1;
					} else if (returnSysValues[1] === "PM" && parseInt(returnSysValues[0]) >= 5 && parseInt(returnSysValues[0]) <= 11) {
						$.symptomSlotLabel.text = surveySlot[2].title;
						$.symptomSlotLabel.index = 2;
						$.symptomTimeLabel.text = returnSysValues1;
					} else {
						$.symptomSlotLabel.text = surveySlot[1].title;
						$.symptomSlotLabel.index = 1;
						$.symptomTimeLabel.text = returnSysValues1;
					}
				} else {
					$.symptomTimeClickOuter.touchEnabled = true;
					$.symptomSlotviewOuter.touchEnabled = true;

				}
			}

		});
	} catch(ex) {
		commonFunctions.handleException("settings", "repeatClick", ex);
	}

}

/***
 *Time slot click event
 */
function timeSlotClick(e) {
	try {
		var returnValues = "";
		var selectedText = "";
		var curTime = new Date();
		if (e.source.id == "symptomTimeClickOuter") {
			selectedText = $.symptomTimeLabel.text;
			selectedSlot = $.symptomSlotLabel.text;
			if (currentSymptomtime != "") {
				curTime = currentSymptomtime;
			}
		} else if (e.source.id == "coginitionTimeClickOuter") {
			selectedText = $.coginitionTimeLabel.text;
			selectedSlot = $.cognitionSlotLabel.text;
			if (currentCoginitiontime != "") {
				curTime = currentCoginitiontime;
			}
		}
		Ti.API.info('curTime : ', curTime);
		ShowTimePicker(curTime, function(val, index) {
			var timePart = commonFunctions.getTwelveHrFormatTime(val);
			if (e.source.id == "symptomTimeClickOuter") {
				currentSymptomtime = val;
				$.symptomTimeLabel.text = timePart;
			} else if (e.source.id == "coginitionTimeClickOuter") {
				currentCoginitiontime = val;
				$.coginitionTimeLabel.text = timePart;
			}

		});
	} catch(ex) {
		commonFunctions.handleException("settings", "timeSlotClick", ex);
	}
}

/**
 * Shows the picker
 */
function ShowPicker(options, defaultText, headerText, doneCallBack, itemChangeCallback) {
	try {
		var listPicker = null;
		var defaultVal = 0;
		Ti.API.info('options are:', options);
		for ( index = 0; index < options.length; index++) {
			if (options[index].title == defaultText) {
				defaultVal = index;
				break;
			}
		}

		listPicker = new Picker(options, defaultVal, headerText, 'plain', null);
		listPicker.addToWindow($.settings);

		listPicker.show();

		listPicker.addEventListener("done", function(e) {
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
				doneCallBack(listPicker.selectedText, listPicker.selectedValue);
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
 * Shows the picker
 */
function ShowTimePicker(defaultValue, doneCallBack) {
	try {
		var LangCode = Ti.App.Properties.getString('languageCode');
		var listPickerTime = null;
		Ti.API.info('selectedSlot*****', selectedSlot);
		listPickerTime = new Picker(null, defaultValue, commonFunctions.L('selectTimeLbl', LangCode), 'time', selectedSlot);

		listPickerTime.addToWindow($.settings);
		listPickerTime.show();

		listPickerTime.addEventListener("done", function(e) {
			Ti.API.info('done : ', listPickerTime.selectedText);
			Ti.API.info('done e : ', JSON.stringify(e));

			if (listPickerTime.selectedValue == null || listPickerTime.selectedValue < 0) {
				return;
			}
			if (listPickerTime != null)
				listPickerTime.hide();

			if (listPickerTime.selectedText) {
				Ti.API.info('selected text:: ', listPickerTime.selectedText);
				doneCallBack(listPickerTime.selectedText);

			} else {

				var defTime = new Date();
				if (selectedSlot === commonFunctions.L('morningLbl', LangCode)) {
					defTime.setHours(0, 0, 0, 0);

				} else if (selectedSlot === commonFunctions.L('noonLbl', LangCode)) {
					defTime.setHours(12, 0, 0, 0);

				} else if (selectedSlot === commonFunctions.L('eveningLbl', LangCode)) {
					defTime.setHours(17, 0, 0, 0);
				}
				Ti.API.info('defTime : ', defTime);
				doneCallBack(defTime);
			}

			listPickerTime = null;
		});

		listPickerTime.addEventListener("cancel", function(e) {
			if (listPickerTime != null)
				listPickerTime.hide();
			listPickerTime = null;
		});

	} catch(ex) {
		commonFunctions.handleException("settings", "ShowTimePicker", ex);
	}
}

/**
 * Event handler for logout click
 * @param {Object} e
 */
function onLogoutClick(e) {
	try {
		var LangCode = Ti.App.Properties.getString('languageCode');
		commonFunctions.showConfirmation(commonFunctions.L('sureSignout', LangCode), [commonFunctions.L('no', LangCode), commonFunctions.L('yes', LangCode)], function() {
			Alloy.Globals.logout();
			Alloy.Globals.HEADER_COLOR = "#359ffe";
			Alloy.Globals.BACKGROUND_IMAGE = "/images/common/blue-bg.png";
			Alloy.Globals.SYMPTOM_ACTIVE = "/images/surveys/icn-symptom-survey-active.png";
			Alloy.Globals.COGINITION_ACTIVE = "/images/surveys/icn-cognition-test-active.png";
			Alloy.Globals.ENVIRONMENT_ACTIVE = "/images/surveys/icn-environment-active.png";
			Alloy.Globals.HELP_ACTIVE = "/images/surveys/icn-help-active.png";
			Ti.App.Properties.setObject("SettingsInfo", null);
			Ti.App.Properties.setObject("SESSION_TOKEN", null);
			Alloy.Globals.removeCredentials();
			Ti.App.Properties.setObject("coginitionReminder", null);
			Ti.App.Properties.setObject("surveyReminder", null);

			if (Ti.App.Properties.hasProperty("coginitionReminder") == true) {
				Ti.App.Properties.removeProperty("coginitionReminder");
			}
			if (Ti.App.Properties.hasProperty("surveyReminder") == true) {
				Ti.App.Properties.removeProperty("surveyReminder");
			}
			if (Ti.App.Properties.hasProperty("memoryTime") == true) {
				Ti.App.Properties.removeProperty("memoryTime");
			}
			if (Ti.App.Properties.hasProperty("initialTime") == true) {
				Ti.App.Properties.removeProperty("initialTime");
			}
			Ti.App.Properties.setInt('difficultyTypeA', 0);
			Ti.App.Properties.setInt('difficultyTypeB', 0);
			Ti.App.Properties.setInt("ReminderClearInterval", 0);
			Ti.App.Properties.setString('languageCode', "en");
			var reminderValues = {
				hourlySurvey : "",
				threeHourSurvey : "",
				sixHourSurvey : "",
				twelveHourSurvey : "",
				hourlyCog : "",
				threeHourCog : "",
				sixHourCog : "",
				twelveHourCog : "",

			};
			Ti.App.Properties.setObject('lastAdminReminderTime', reminderValues);
			Ti.App.Properties.setObject('lastLocalReminderTime', reminderValues);

			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('signin');
			setTimeout(function() {
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('settings');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('home');
				if (OS_IOS) {
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('newHomeScreen');
				}

			}, 1000);
			if (OS_IOS) {
				Ti.App.iOS.cancelAllLocalNotifications();
				notify.cancelAllNotification();
			} else {
				Alloy.Globals.REQUEST_CODE_ARRAY = [];
				if (Ti.App.Properties.getObject('requestCode') != null) {
					cancelMultipleAlarm(Ti.App.Properties.getObject('requestCode'));
					Ti.App.Properties.setObject('requestCode', null);
				}
			}
			Ti.App.Properties.setObject('sendTime', null);
		});

	} catch(ex) {
		commonFunctions.handleException("settings", "onLogoutClick", ex);
	}
}

/**
 * windowClick event
 */
function windowClick(e) {
	try {
		if (e.source.id != "emergencyNumber" && e.source.id != "headerContainer" && e.source.id != "contactNumber") {
			$.contactNumber.blur();
			$.emergencyNumber.blur();

		}
	} catch(ex) {
		commonFunctions.handleException("comments", "windowClick", ex);
	}

}

/**
 * Function for sending the local notification..
 */
function sendLocalNotification(index, time, alertBody, type, seconds) {
	try {
		var repeatMode = "";
		var sendDateTime = "";
		var notificationArray = [];
		var userInfo = {
			"type" : type
		};
		var timeForLocal = commonFunctions.ConvertTwentyFourHourForLocal(time);
		Ti.API.info('TIME FOR LOCAL:: ', timeForLocal);

		if (index === 0) {

			Ti.App.Properties.setString('lastReminderTimeSurvey', "");
			Ti.App.Properties.setString('lastReminderTimeCog', "");
			if (OS_IOS) {

				var userInfo1 = {
					"isTextMessage" : false,
					"type" : type
				};
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				notify.sheduleNotification(60, alertBody, "default", userInfo1);
			} else {
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				var setTime = commonFunctions.formatTimeForAndroidHours(new Date(), seconds, 1);

				notificationManager.scheduleAndroidNotification(alertBody, setTime, "3600000", type);
			}
			setProperties(type, alertBody, sendDateTime, 0);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index == 1) {
			Ti.App.Properties.setString('lastReminderTimeSurvey', "");
			Ti.App.Properties.setString('lastReminderTimeCog', "");
			if (OS_IOS) {

				var userInfo1 = {
					"isTextMessage" : false,
					"type" : type
				};

				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);

				Ti.API.info('sendDateTime : ' + sendDateTime);
				notify.createAlarm(180, 8, alertBody, 'minute', "default", userInfo1);
			} else {
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				var setTime = commonFunctions.formatTimeForAndroidHours(new Date(), seconds, 3);
				notificationManager.scheduleAndroidNotification(alertBody, setTime, "10800000", type);
			}
			setProperties(type, alertBody, sendDateTime, 1);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index == 2) {
			Ti.App.Properties.setString('lastReminderTimeSurvey', "");
			Ti.App.Properties.setString('lastReminderTimeCog', "");
			if (OS_IOS) {

				var userInfo1 = {
					"isTextMessage" : false,
					"type" : type
				};
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				notify.createAlarm(360, 8, alertBody, 'minute', "default", userInfo1);
			} else {
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				var setTime = commonFunctions.formatTimeForAndroidHours(new Date(), seconds, 6);
				notificationManager.scheduleAndroidNotification(alertBody, setTime, "21600000", type);
			}
			setProperties(type, alertBody, sendDateTime, 2);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index == 3) {
			Ti.App.Properties.setString('lastReminderTimeSurvey', "");
			Ti.App.Properties.setString('lastReminderTimeCog', "");
			if (OS_IOS) {

				var userInfo1 = {
					"isTextMessage" : false,
					"type" : type
				};
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);

				notify.createAlarm(720, 8, alertBody, 'minute', "default", userInfo1);
			} else {
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				var setTime = commonFunctions.formatTimeForAndroidHours(new Date(), seconds, 12);
				notificationManager.scheduleAndroidNotification(alertBody, setTime, "43200000", type);
			}
			setProperties(type, alertBody, sendDateTime, 3);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 4) {
			if (OS_IOS) {
				repeatMode = "daily";
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				Ti.API.info('sendDateTime:: ', sendDateTime);
				notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
			} else {
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				var setTime = commonFunctions.formatTimeForAndroidNot(time, new Date(), seconds);
				notificationManager.scheduleAndroidNotification(alertBody, setTime, "86400000", type);
			}
			setProperties(type, alertBody, sendDateTime, 4);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 5) {
			var weekDay = commonFunctions.getDayName(new Date());
			Ti.API.info('weekDay:: ', weekDay);
			var getFormattedDay = commonFunctions.getBiWeekDays(weekDay);
			Ti.API.info('getFormattedDay:: ', getFormattedDay);
			var result = getFormattedDay.split('/');
			if (result.length > 0) {
				for (var i = 0; i < result.length; i++) {
					if (result[i] != "") {
						var notificationDate = result[i];
						if (OS_IOS) {
							repeatMode = "weekly";
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
						} else {
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							var setTime = commonFunctions.formatTimeForAndroidNot(time, notificationDate, seconds);
							notificationManager.scheduleAndroidNotification(alertBody, setTime, "604800000", type);
						}
						setProperties(type, alertBody, sendDateTime, 5);
					}
				}
				Ti.App.Properties.setObject('sendTime', arrayItems);
			}
		} else if (index === 6) {
			repeatMode = "weekly";
			var weekDay = commonFunctions.getDayName(new Date());
			Ti.API.info('weekDayTRI:: ', weekDay);
			var getFormattedDay = commonFunctions.getTriWeekDays(weekDay);
			Ti.API.info('getFormattedTRiDay:: ', getFormattedDay);
			var result = getFormattedDay.split('/');
			if (result.length > 0) {
				for (var i = 0; i < result.length; i++) {
					if (result[i] != "") {
						var notificationDate = result[i];
						if (OS_IOS) {
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
						} else {
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							var setTime = commonFunctions.formatTimeForAndroidNot(time, notificationDate, seconds);
							notificationManager.scheduleAndroidNotification(alertBody, setTime, "604800000", type);
						}
						setProperties(type, alertBody, sendDateTime, 6);
					}
				}
				Ti.App.Properties.setObject('sendTime', arrayItems);
			}
		} else if (index === 7) {
			if (OS_IOS) {
				repeatMode = "weekly";
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
			} else {
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				var setTime = commonFunctions.formatTimeForAndroidNot(time, new Date(), seconds);
				notificationManager.scheduleAndroidNotification(alertBody, setTime, "604800000", type);
			}
			setProperties(type, alertBody, sendDateTime, 7);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 8) {
			repeatMode = "monthly";
			var monthDays = commonFunctions.getBiMonthDays();
			Ti.API.info('monthDays:: ', monthDays);
			var resultDays = monthDays.split('/');
			if (resultDays.length > 0) {
				for (var i = 0; i < resultDays.length; i++) {
					if (resultDays[i] != "") {
						var notificationDate = resultDays[i];
						if (OS_IOS) {
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
						} else {
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							var setTime = commonFunctions.formatTimeForAndroidNot(time, notificationDate, seconds);
							notificationManager.scheduleAndroidNotification(alertBody, setTime, "2592000000", type);
						}
					}
				}
				setProperties(type, alertBody, sendDateTime, 8);
				Ti.App.Properties.setObject('sendTime', arrayItems);
			}
		} else if (index === 9) {

			if (OS_IOS) {
				repeatMode = "monthly";
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
			} else {
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				var setTime = commonFunctions.formatTimeForAndroidNot(time, new Date(), seconds);
				notificationManager.scheduleAndroidNotification(alertBody, setTime, "2592000000", type);
			}
			setProperties(type, alertBody, sendDateTime, 9);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		}
	} catch(ex) {
		commonFunctions.handleException("settings", "sendLocalNotification", ex);
	}
}

/**
 * Function for setting the notification values to titanium properties.
 */
function setProperties(type, alertBody, sendDateTime, index) {
	try {
		var Items = {
			type : type,
			alertBody : alertBody,
			sendDateTime : sendDateTime,
			index : index
		};
		arrayItems.push(Items);
	} catch(ex) {
		commonFunctions.handleException("settings", "setProperties", ex);
	}
}

/**
 * Validate time and slots.
 */
function validateTime() {
	try {
		var LangCode = Ti.App.Properties.getString('languageCode');
		var isValidationSuccess = false;
		var returnSysValues = commonFunctions.getSeparatedValues($.symptomTimeLabel.text);
		returnSysValues = returnSysValues.split(",");
		var returnCogValues = commonFunctions.getSeparatedValues($.coginitionTimeLabel.text);
		returnCogValues = returnCogValues.split(",");
		if (returnSysValues[1] === "PM" && $.symptomSlotLabel.text === commonFunctions.L('morningLbl', LangCode)) {
			commonFunctions.showAlert(commonFunctions.L('validSymptomTime', LangCode));
		} else if (returnSysValues[1] === "PM" && parseInt(returnSysValues[0]) >= 5 && parseInt(returnSysValues[0]) <= 11 && $.symptomSlotLabel.text === commonFunctions.L('noonLbl', LangCode)) {
			commonFunctions.showAlert(commonFunctions.L('validSymptomTime', LangCode));
		} else if (returnSysValues[1] === "PM" && (parseInt(returnSysValues[0]) < 5 || parseInt(returnSysValues[0]) === 12) && $.symptomSlotLabel.text === commonFunctions.L('eveningLbl', LangCode)) {
			commonFunctions.showAlert(commonFunctions.L('validSymptomTime', LangCode));
		} else if (returnCogValues[1] === "PM" && $.cognitionSlotLabel.text === commonFunctions.L('morningLbl', LangCode)) {
			commonFunctions.showAlert(commonFunctions.L('validCognitionTime', LangCode));
		} else if (returnCogValues[1] === "PM" && parseInt(returnCogValues[0]) >= 5 && parseInt(returnCogValues[0]) <= 11 && $.cognitionSlotLabel.text === commonFunctions.L('noonLbl', LangCode)) {
			commonFunctions.showAlert(commonFunctions.L('validCognitionTime', LangCode));
		} else if (returnCogValues[1] === "PM" && (parseInt(returnCogValues[0]) < 5 || parseInt(returnCogValues[0]) === 12) && $.cognitionSlotLabel.text === commonFunctions.L('eveningLbl', LangCode)) {
			commonFunctions.showAlert(commonFunctions.L('validCognitionTime', LangCode));
		} else if (returnSysValues[1] === "AM" && $.symptomSlotLabel.text != commonFunctions.L('morningLbl', LangCode)) {
			commonFunctions.showAlert(commonFunctions.L('validSymptomTime', LangCode));
		} else if (returnSysValues[1] === "AM" && parseInt(returnSysValues[0]) >= 12 && $.symptomSlotLabel.text === commonFunctions.L('noonLbl', LangCode)) {
			commonFunctions.showAlert(commonFunctions.L('validSymptomTime', LangCode));
		} else if (returnSysValues[1] === "AM" && parseInt(returnSysValues[0]) >= 5 && $.symptomSlotLabel.text === commonFunctions.L('eveningLbl', LangCode)) {
			commonFunctions.showAlert(commonFunctions.L('validSymptomTime', LangCode));
		} else if (returnCogValues[1] === "AM" && $.cognitionSlotLabel.text != commonFunctions.L('morningLbl', LangCode)) {
			commonFunctions.showAlert(commonFunctions.L('validCognitionTime', LangCode));
		} else if (returnCogValues[1] === "AM" && parseInt(returnCogValues[0]) >= 12 && $.cognitionSlotLabel.text === commonFunctions.L('noonLbl', LangCode)) {
			commonFunctions.showAlert(commonFunctions.L('validCognitionTime', LangCode));
		} else if (returnCogValues[1] === "AM" && parseInt(returnCogValues[0]) >= 5 && $.cognitionSlotLabel.text === commonFunctions.L('eveningLbl', LangCode)) {
			commonFunctions.showAlert(commonFunctions.L('validCognitionTime', LangCode));
		} else {
			Ti.API.info('validation sucess...');
			isValidationSuccess = true;
		}
		return isValidationSuccess;
	} catch(ex) {
		commonFunctions.handleException("settings", "validateTime", ex);
	}
}

/**
 * Function for cancelling the notification.
 */
function cancelMultipleAlarm(requestcodeArray) {
	notificationManager.cancelAllAlarm();
}

/**
 * Cancel popup event
 */
function popUpCancel(e) {
	try {
		if (isSurveyPopUp == true) {
			Ti.API.info('selectedSurveyOrg : ', selectedSurveyOrg);
			selectedSurvey = selectedSurveyOrg;
			selectedSurveyText = selectedSurveyTextOrg;
		} else {
			selectedCognition = selectedCognitionOrg;
			selectedCognitionText = selectedCognitionTextOrg;
		}
		$.PopupView.visible = false;
	} catch(ex) {
		commonFunctions.handleException("settings", "popUpCancel", ex);
	}

}

/**
 * popUpDone event handler
 */
function popUpDone(e) {
	try {
		var LangCode = Ti.App.Properties.getString('languageCode');
		Ti.API.info('popUpDone');

		if (isSurveyPopUp == true) {
			Ti.API.info('selectedSurvey : ', selectedSurvey);
			Ti.API.info('selectedSurvey.length : ', selectedSurvey.length);
			if (selectedSurvey.length == 0) {
				commonFunctions.showAlert(commonFunctions.L('slectSurveyType', LangCode));
				return;
			} else if (selectedSurvey[0] == 0) {
				commonFunctions.showAlert(commonFunctions.L('slectSurveyType', LangCode));
				return;
			}
		} else {
			Ti.API.info('selectedCognition : ', selectedCognition);
			if (selectedCognition.length == 0) {
				commonFunctions.showAlert(commonFunctions.L('selectCognitionLblAlert', LangCode));
				return;
			}
		}
		$.PopupView.visible = false;
		var displayText = "";

		if (isSurveyPopUp == true) {

			for (var i = 0; i < selectedSurveyText.length; i++) {
				if (displayText == "") {
					displayText = selectedSurveyText[i];
				} else {
					displayText = displayText + ", " + selectedSurveyText[i];
				}
			}
			if (displayText != "") {

				if (commonFunctions.getIsTablet()) {
					displayText = commonFunctions.trimText(displayText, 80);
				} else {
					displayText = commonFunctions.trimText(displayText, 35);
				}

				$.surveyLabel.text = displayText;
			}
		} else {
			for (var i = 0; i < selectedCognitionText.length; i++) {
				if (displayText == "") {
					displayText = selectedCognitionText[i];
				} else {
					displayText = displayText + ", " + selectedCognitionText[i];
				}
			}
			if (displayText != "") {
				if (commonFunctions.getIsTablet()) {
					displayText = commonFunctions.trimText(displayText, 80);
				} else {
					displayText = commonFunctions.trimText(displayText, 35);
				}
				$.cognitionTestLabel.text = displayText;
			}

		}

	} catch(ex) {
		commonFunctions.handleException("settings", "popUpDone", ex);
	}

}

/**
 * selectTest event handler
 */
function selectTest(e) {
	try {
		var item = $.listSection.getItemAt(e.itemIndex);
		if (item.checkBoxImageView.image == "/images/surveyTypes/check-box.png") {

			item.checkBoxImageView.image = "/images/surveyTypes/check-box-active.png";
			if (isSurveyPopUp == true) {
				Ti.API.info('selectedSurveyText', selectedSurveyText.length);
				if (selectedSurvey.length == 1 && selectedSurvey[0] == 0) {
					selectedSurvey[0] = item.id;
				} else {
					selectedSurvey.push(item.id);
				}

				selectedSurveyText.push(item.rowLabel.text);
			} else {
				selectedCognition.push(item.id);
				selectedCognitionText.push(item.rowLabel.text);

			}

			$.listSection.updateItemAt(e.itemIndex, item);

		} else {
			item.checkBoxImageView.image = "/images/surveyTypes/check-box.png";
			if (isSurveyPopUp == true) {
				for (var i = 0; i < selectedSurvey.length; i++) {
					if (selectedSurvey[i] == item.id) {
						selectedSurvey.splice(i, 1);
						selectedSurveyText.splice(i, 1);
					}
				}
			} else {
				for (var i = 0; i < selectedCognition.length; i++) {
					if (selectedCognition[i] == item.id) {
						selectedCognition.splice(i, 1);
						selectedCognitionText.splice(i, 1);
					}
				}

			}
			$.listSection.updateItemAt(e.itemIndex, item);
		}

	} catch(ex) {
		commonFunctions.handleException("settings", "selectTest", ex);
	}

}

/**
 * populateSurvey event handler
 */
function populateSurvey() {
	var LangCode = Ti.App.Properties.getString('languageCode');
	var itemsArray = [];
	$.listSection.setItems(itemsArray);
	for (var i = 0; i < surveyArray.length; i++) {
		var checkboxImage = "/images/surveyTypes/check-box.png";
		for (var j = 0; j < selectedSurvey.length; j++) {
			Ti.API.info('selectedSurvey[j] : ', selectedSurvey[j], surveyArray[i].surveyID);
			if (surveyArray[i].surveyID == selectedSurvey[j]) {
				checkboxImage = "/images/surveyTypes/check-box-active.png";
			}
		};
		itemsArray.push({
			rowLabel : {
				text : surveyArray[i].questions
			},
			id : surveyArray[i].surveyID,
			checkBoxImageView : {
				image : checkboxImage
			},
			template : "listItemTemplate"
		});
	}
	if (itemsArray.length != 0) {
		$.listSection.setItems(itemsArray);
		$.testListView.visible = true;
	} else {
		$.testListView.visible = false;
	}
	$.popupTitle.text = commonFunctions.L('selectsurveytitle', LangCode);
	$.PopupView.visible = true;
}

/**
 * populateCognition event handler
 */
function populateCognition() {
	var itemsArray = [];
	$.listSection.setItems(itemsArray);
	Ti.API.info('populateCognition : ', selectedCognition);
	var LangCode = Ti.App.Properties.getString('languageCode');
	var cognitionTestArray = [{
		"id" : 1,
		"name" : commonFunctions.L('nbackTest', LangCode) ,
	}, {
		"id" : 2,
		"name" : commonFunctions.L('trailsBTest', LangCode),
	}, {
		"id" : 3,
		"name" : commonFunctions.L('spatialFrwd', LangCode),
	}, {
		"id" : 4,
		"name" : commonFunctions.L('spatialBckwrd', LangCode),
	}, {
		"id" : 5,
		"name" : commonFunctions.L('memoryTest', LangCode),
	}, {
		"id" : 6,
		"name" : commonFunctions.L('serial7', LangCode),
	}, {
		"id" : 8,
		"name" : commonFunctions.L('figCopy', LangCode),
	}, {
		"id" : 9,
		"name" : commonFunctions.L('visualGame', LangCode),
	}, {
		"id" : 10,
		"name" : commonFunctions.L('digitFWrd', LangCode),
	}, {
		"id" : 13,
		"name" : commonFunctions.L('digitBckWrd', LangCode),
	}, {
		"id" : 11,
		"name" : commonFunctions.L('catdog', LangCode),
	}, {
		"id" : 12,
		"name" : commonFunctions.L('temporalOrder', LangCode),
	}, {
		"id" : 15,
		"name" : commonFunctions.L('trailsBTestNew', LangCode),
	}, {
		"id" : 14,
		"name" : commonFunctions.L('nbackTestNew', LangCode),
	}, {
		"id" : 16,
		"name" : commonFunctions.L('trailsBTouch', LangCode),
	}, {
		"id" : 17,
		"name" : commonFunctions.L('jwelA', LangCode),
	}, {
		"id" : 18,
		"name" : commonFunctions.L('jwelB', LangCode),
	}];
	for (var i = 0; i < cognitionTestArray.length; i++) {
		var checkboxImage = "/images/surveyTypes/check-box.png";
		Ti.API.info('selectedCognition.length : ', selectedCognition.length);
		for (var j = 0; j < selectedCognition.length; j++) {
			if (cognitionTestArray[i].id == selectedCognition[j]) {
				checkboxImage = "/images/surveyTypes/check-box-active.png";
			};
		};
		itemsArray.push({
			rowLabel : {
				text : cognitionTestArray[i].name
			},
			id : cognitionTestArray[i].id,
			checkBoxImageView : {
				image : checkboxImage
			},
			template : "listItemTemplate"
		});
	}
	if (itemsArray.length != 0) {
		$.listSection.setItems(itemsArray);
		$.testListView.visible = true;
	} else {
		$.testListView.visible = false;
	}
	$.popupTitle.text = commonFunctions.L('selectcognitionLbl', LangCode);
	$.PopupView.visible = true;
}

/**
 * surveyClick event handler
 */
function surveyClick(e) {
	try {
		isSurveyPopUp = true;
		$.buttonBar.backgroundColor = Alloy.Globals.HEADER_COLOR;
		selectedSurveyOrg = selectedSurvey.slice();
		selectedSurveyTextOrg = selectedSurveyText.slice();
		populateSurvey();
	} catch(ex) {
		commonFunctions.handleException("settings", "surveyClick", ex);
	}
}

/**
 * cognitionClick event handler
 */
function cognitionClick(e) {
	try {
		isSurveyPopUp = false;
		$.buttonBar.backgroundColor = Alloy.Globals.HEADER_COLOR;
		selectedCognitionOrg = selectedCognition.slice();
		selectedCognitionTextOrg = selectedCognitionText.slice();
		populateCognition();
	} catch(ex) {
		commonFunctions.handleException("settings", "surveyClick", ex);
	}

}
