// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var commonFunctions = require('commonFunctions');
var serviceManager = require('serviceManager');
var notificationManager = require('notificationManager');
var commonDB = require('commonDB');
var arrayItems = [];
var resultValue = 0;
var Picker = require('picker');
Alloy.Globals.IsSelected = 0;
var favoriteArray = [];
var welcomeInfo;
var welcomeGameInfo;
var instructionVideoInfo;

function getLanguage() {
	try {
		return [{
			value : 1,
			title : "English",
			code : "en",
		}, {
			value : 2,
			title : "Spanish",
			code : "es",

		}, {
			value : 3,
			title : "Brazilian Portuguese",
			code : "pt-br",

		}, {
			value : 4,
			title : "Chinese (Mandarin)",
			code : "cmn",

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

function init() {

	setHintTextColor();
	setLabel();

	if (Alloy.Globals.iPhone5) {
		$.signInStudent.font = Alloy.Globals.LargeMenuFontBold;
		$.signInUserSignUp.font = Alloy.Globals.LargeMenuFontBold;
		$.forgetPassword.top = "14dp";
		$.signInButton.top = "30dp";
		$.buttonContainerView.bottom = "16dp";
	}

	// Not need to go back fromt this page.
	$.headerView.setLeftViewVisibility(false);
}

/**
 * function to set label language
 */
function setLabel() {
	var LangCode = Ti.App.Properties.getString('languageCode');
	
	if (LangCode == "" || LangCode == null) {
		LangCode = "en";
	}

	$.userName.hintText = commonFunctions.L('userNameEmailOrStudyId', LangCode);
	$.password.hintText = commonFunctions.L('password', LangCode);
	$.signInButton.text = commonFunctions.L('signIn', LangCode);
	$.langHeader.text = commonFunctions.L('languageSelect', LangCode);
	$.signInStudent.text = commonFunctions.L('signInStudent', LangCode);
	$.signInUserSignUp.text = commonFunctions.L('signInUserSignUp', LangCode);
	$.forgetPassword.text = commonFunctions.L('forgotPasswordTitle', LangCode);
	$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
}

/**
 * Set hint text color for lower SDKs
 */
function setHintTextColor() {

	commonFunctions.setHintTextColor($.userName, L('userNameEmailOrStudyId'), Alloy.Globals.HINTTEXT_COLOR);
	commonFunctions.setHintTextColor($.password, L('password'), Alloy.Globals.HINTTEXT_COLOR);
}

/**
 * Return Event handlers for text boxes to focus on next.
 */
$.userName.addEventListener('return', function() {
	$.password.focus();
});

/**
 * Reinitialize the username ( if available ), no passowrd.
 * This happens when a loggined user loggs out.
 */
$.signin.addEventListener("open", function(e) {
	
	if (OS_IOS) {
		if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
			$.buttonContainerView.bottom = "25dp";
			$.supportLabel.bottom = "15dp";
		}

	}

	var LangCode = Ti.App.Properties.getString('languageCode');
	if (LangCode == null || LangCode == "") {
		LangCode = "en";
	}
	var obj = commonFunctions.getLanguage(LangCode);
	
	$.languageSlotLabel.text = obj.language;
	$.languageSlotLabel.index = obj.value;
	repopulateUserName();
	setLabel();

});

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
		listPicker.addToWindow($.signin);

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


$.signin.addEventListener('android:back', function() {
	try {
		var LangCode = Ti.App.Properties.getString('languageCode');
		if (LangCode == "" || LangCode == null) {
			LangCode = "en";
		}
		
		commonFunctions.showConfirmation(L('exitApp'), ['Yes', 'No'], function() {
			try {
				Ti.App.fireEvent("app:exitApp");
			} catch(e) {
				commonFunctions.handleException("signin", "android:back", e);
			}
		});
	} catch(ex) {
		commonFunctions.handleException("signin", "android-back", ex);
	}

});

// Event handler used to hide soft keyboard while taping in screen area

$.bodyOuterContainer.addEventListener("click", hideSoftKeyboard);
$.signincontainer.addEventListener("click", hideSoftKeyboard);

$.logoView.addEventListener("click", hideSoftKeyboard);

// Function to hide soft key board.
function hideSoftKeyboard(e) {
	// andorid is not currently used.
	if (e.source.id != "userName" && e.source.id != "password") {

		if (OS_ANDROID) {
			Ti.UI.Android.hideSoftKeyboard();
		} else {
			$.userName.blur();
			$.password.blur();
		}
	}
}

/**
 * Event handler for sign in button
 */
function onSignInClick(e) {
	try {

		if (Alloy.Globals.IsSelected == 0) {
			Ti.App.Properties.setString('languageCode', "");
		}
		var LangCode = Ti.App.Properties.getString('languageCode');
		// Form entry validation
		if (isValid() == true) {

			var signInCredentials = [{
				"userName" : $.userName.value.trim(),
				"password" : $.password.value.trim(),
				"Language" : LangCode
			}];

			if (Ti.Network.online) {
				commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
				serviceManager.userLogin(signInCredentials, signInAPISuccess, signInAPIFailure);
			} else {
				if (LangCode == "") {
					LangCode = "en";
				}
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
function signInAPISuccess(e) {
	try {
		var response = JSON.parse(e.data);
		

		if (response.ErrorCode == 0) {
			specificationArray = response.Data;
			var pointArray = response.ActivityPoints;
			// Set credentials in property, it will be used for auto login.
			Alloy.Globals.setCredentials($.userName.value.trim(), $.password.value.trim(), specificationArray.UserID, response.Type);
			Ti.App.Properties.setString('SESSION_TOKEN', response.SessionToken);
			
			if (specificationArray.Language != null && specificationArray.Language != "") {
				Ti.App.Properties.setString('languageCode', specificationArray.Language);
			} else {
				Ti.App.Properties.setString('languageCode', 'en');
			}

			if (response.CTestsFavouriteList != null && response.CTestsFavouriteList.length != 0) {

				for (var i = 0; i < response.CTestsFavouriteList.length; i++) {
					if (response.CTestsFavouriteList[i].FavType == 1) {
						Ti.App.Properties.setString('firstFavouriteId', response.CTestsFavouriteList[i].CTestID);
					} else if (response.CTestsFavouriteList[i].FavType == 2) {
						Ti.App.Properties.setString('secondFavouriteId', response.CTestsFavouriteList[i].CTestID);
					}
				}
			}

			if (response.SurveyFavouriteList != null && response.SurveyFavouriteList.length != 0) {

				for (var i = 0; i < response.SurveyFavouriteList.length; i++) {
					if (response.SurveyFavouriteList[i].FavType == 1) {

						Ti.App.Properties.setString('firstSurveyFavouriteId', response.SurveyFavouriteList[i].SurveyID);
					} else if (response.SurveyFavouriteList[i].FavType == 2) {

						Ti.App.Properties.setString('secondSurveyFavouriteId', response.SurveyFavouriteList[i].SurveyID);

					}

				}

			}

			$.userName.value = "";
			$.password.value = "";
			var surveyTime = null;
			var cognitionTime = null;
			var notificationFormatTime = null;
			
			if (pointArray != null) {
				commonDB.insertPoint(19, pointArray.SurveyPoint != null ? pointArray.SurveyPoint : 0, 0);
				commonDB.insertPoint(8, pointArray._3DFigurePoint != null ? pointArray._3DFigurePoint : 0, 0);
				commonDB.insertPoint(7, pointArray.CatAndDogPoint != null ? pointArray.CatAndDogPoint : 0, 0);
				commonDB.insertPoint(11, pointArray.CatAndDogNewPoint != null ? pointArray.CatAndDogNewPoint : 0, 0);
				commonDB.insertPoint(10, pointArray.DigitSpanForwardPoint != null ? pointArray.DigitSpanForwardPoint : 0, 0);
				commonDB.insertPoint(1, pointArray.NBackPoint != null ? pointArray.NBackPoint : 0, 0);
				commonDB.insertPoint(6, pointArray.Serial7Point != null ? pointArray.Serial7Point : 0, 0);
				commonDB.insertPoint(5, pointArray.SimpleMemoryPoint != null ? pointArray.SimpleMemoryPoint : 0, 0);
				commonDB.insertPoint(3, pointArray.SpatialForwardPoint != null ? pointArray.SpatialForwardPoint : 0, 0);
				commonDB.insertPoint(4, pointArray.SpatialBackwardPoint != null ? pointArray.SpatialBackwardPoint : 0, 0);
				commonDB.insertPoint(2, pointArray.TrailsBPoint != null ? pointArray.TrailsBPoint : 0, 0);
				commonDB.insertPoint(9, pointArray.VisualAssociationPoint != null ? pointArray.VisualAssociationPoint : 0, 0);
				commonDB.insertPoint(12, pointArray.TemporalOrderPoint != null ? pointArray.TemporalOrderPoint : 0, 0);
				commonDB.insertPoint(13, pointArray.DigitSpanBackwardPoint != null ? pointArray.DigitSpanBackwardPoint : 0, 0);
				commonDB.insertPoint(14, pointArray.NBackNewPoint != null ? pointArray.NBackNewPoint : 0, 0);
				commonDB.insertPoint(15, pointArray.TrailsBNewPoint != null ? pointArray.TrailsBNewPoint : 0, 0);
				commonDB.insertPoint(16, pointArray.TrailsBDotTouchPoint != null ? pointArray.TrailsBDotTouchPoint : 0, 0);
				commonDB.insertPoint(17, pointArray.JewelsTrailsAPoint != null ? pointArray.JewelsTrailsAPoint : 0, 0);
				commonDB.insertPoint(18, pointArray.JewelsTrailsBPoint != null ? pointArray.JewelsTrailsBPoint : 0, 0);

				var key;
				var totalPoint = 0;
				for (key in pointArray) {
					if (pointArray.hasOwnProperty(key)) {
						var curPoint = pointArray[key] != null ? parseInt(pointArray[key]) : 0;
						totalPoint = totalPoint + curPoint;

					}
				}
				Ti.API.info('totalPoint : ', totalPoint);
				if (totalPoint < 10) {
					Ti.App.Properties.setString('currentLevel', "Level 1");
				} else if (totalPoint < 50) {
					Ti.App.Properties.setString('currentLevel', "Level 2");

				} else if (totalPoint < 100) {
					Ti.App.Properties.setString('currentLevel', "Level 3");

				} else if (totalPoint < 500) {
					Ti.App.Properties.setString('currentLevel', "Level 4");

				} else if (totalPoint > 500) {
					Ti.App.Properties.setString('currentLevel', "Level 5");

				}
				Ti.App.Properties.setString('totalPoints', totalPoint);

				

			}
			var jewelArray = response.JewelsPoints;
			Ti.API.info('jewelArray : ', jewelArray);
			if (jewelArray != null) {
				commonDB.insertJewelCounts(jewelArray.JewelsTrailsATotalJewels, jewelArray.JewelsTrailsATotalBonus, 0, 1);
				commonDB.insertJewelCounts(jewelArray.JewelsTrailsBTotalJewels, jewelArray.JewelsTrailsBTotalBonus, 0, 2);
			}

			if (specificationArray.SympSurveySlotTime != null) {
				surveyTime = new Date(specificationArray.SympSurveySlotTime).toString();
				getIndex(specificationArray.SympSurveyRepeatID);
				notificationFormatTime = new Date(specificationArray.SympSurveySlotTime);
				
				notificationFormatTime.setHours(notificationFormatTime.getHours());
				notificationFormatTime.setMinutes(notificationFormatTime.getMinutes());
				notificationFormatTime.setSeconds(1);
				Ti.API.info('Survey notificationFormatTime 1: ', notificationFormatTime);
				notificationFormatTime = commonFunctions.getTwelveHrFormatTime(notificationFormatTime);
				Ti.API.info('Survey notificationFormatTime : ', notificationFormatTime);
				var resltValue = {
					"userID" : specificationArray.UserID,
					"repeateID" : specificationArray.SympSurveyRepeatID,
					"isSurvey" : 1,
					"setDate" : notificationFormatTime
				};
				commonDB.insertLocalShedule(resltValue);
				
			}
			if (specificationArray.CognTestSlotTime != null) {
				cognitionTime = new Date(specificationArray.CognTestSlotTime).toString();
				getIndex(specificationArray.CognTestRepeatID);
				notificationFormatTime = new Date(specificationArray.CognTestSlotTime);
				
				notificationFormatTime.setHours(notificationFormatTime.getHours());
				notificationFormatTime.setMinutes(notificationFormatTime.getMinutes());
				notificationFormatTime.setSeconds(2);

				
				notificationFormatTime = commonFunctions.getTwelveHrFormatTime(notificationFormatTime);
				
				var resltValue = {
					"userID" : specificationArray.UserID,
					"repeateID" : specificationArray.CognTestRepeatID,
					"isSurvey" : 0,
					"setDate" : notificationFormatTime
				};
				commonDB.insertLocalShedule(resltValue);
				
				arrayItems = [];
			

			}
			

			var protoDate = new Date(specificationArray.ProtocolDate).toString();
			Ti.App.Properties.setString('memoryTime', protoDate);
			Ti.App.Properties.setString('initialTime', protoDate);
			Ti.App.Properties.setString('versionCount', 1);

			if (specificationArray.Protocol == 1 || specificationArray.Protocol == true || specificationArray.Protocol == "true") {

				Ti.App.Properties.setString('isProtocolActivated', 1);

			} else {
				Ti.App.Properties.setString('isProtocolActivated', 0);

			}

			var settingsData = {
				userId : specificationArray.UserID,
				userSettingsId : specificationArray.UserSettingID,
				appColor : specificationArray.AppColor,
				sympSurveySlotID : specificationArray.SympSurveySlotID,
				sympSurveySlotTime : surveyTime,
				sympSurveyRepeatID : specificationArray.SympSurveyRepeatID,
				cognTestSlotID : specificationArray.CognTestSlotID,
				cognTestSlotTime : cognitionTime,
				cognTestRepeatID : specificationArray.CognTestRepeatID,
				contactNo : specificationArray.ContactNo,
				personalHelpline : specificationArray.PersonalHelpline,
				Protocol : specificationArray.Protocol
			};
			commonDB.insertSettingsData(settingsData);
			setAppSettingsProperty(settingsData);
			
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
				isFrom : "signIn"

			});
			
			Ti.API.info('specificationArray.PrefferedSurveys : ', specificationArray.PrefferedSurveys);
			var isGuest = Ti.App.Properties.getString("isGuest", "");
			Ti.App.Properties.setString("PrefferedSurveys", specificationArray.PrefferedSurveys);
			if (specificationArray.PrefferedSurveys == null || specificationArray.PrefferedSurveys == "") {
				var allSurvey = commonDB.getSurveyTypes();

				if (allSurvey.length != 0) {
					var surveyIds = [allSurvey[0].surveyID];
					var surveyTexts = [allSurvey[0].questions];
					var surveyReminder = {
						surveyId : surveyIds,
						surveyText : surveyTexts,
						currentSurvey : 0
					};

				} else {
					var surveyIds = [0];

					var surveyTexts = [];
					var surveyReminder = {
						surveyId : surveyIds,
						surveyText : surveyTexts,
						currentSurvey : 0
					};

				}

				Ti.API.info(' set surveyReminder');
				Ti.App.Properties.setObject("surveyReminder", surveyReminder);
			} else {
				
				var surveyIds = specificationArray.PrefferedSurveys.split(",");
				Ti.API.info('Login surveyIds : ', surveyIds);
				var surveyTexts = [];
				var tempPrevSurveyId = [];
				for (var i = 0; i < surveyIds.length; i++) {

					var tempText = commonDB.getSurveyName(surveyIds[i]);
					if (tempText != "") {
						tempPrevSurveyId.push(surveyIds[i]);
						surveyTexts.push(tempText);
					}


				};
				var surveyReminder = {
					surveyId : tempPrevSurveyId,
					surveyText : surveyTexts,
					currentSurvey : 0
				};
				Ti.App.Properties.setObject("surveyReminder", surveyReminder);

			}
			Ti.API.info('specificationArray.PrefferedCognitions : ', specificationArray.PrefferedCognitions);
			var LangCode = Ti.App.Properties.getString('languageCode');
			if (specificationArray.PrefferedCognitions == null || specificationArray.PrefferedCognitions == "") {
				var coginitionIds = [1];
				var coginitionTexts = [commonFunctions.L('nbackTest', LangCode)];
				var coginitionReminder = {
					coginitionId : coginitionIds,
					coginitionText : coginitionTexts,
					currentCoginition : 0
				};
				Ti.API.info('set coginitionReminder');
				Ti.App.Properties.setObject("coginitionReminder", coginitionReminder);
			} else {

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
				var coginitionIds = specificationArray.PrefferedCognitions.split(",");
				var coginitionTexts = [];
				for (var i = 0; i < coginitionIds.length; i++) {
					coginitionIds[i] = parseInt(coginitionIds[i]);
					for (var j = 0; j < cognitionTestArray.length; j++) {
						if (cognitionTestArray[j].id == coginitionIds[i]) {
							coginitionTexts.push(cognitionTestArray[j].name);
						}
					};

				};
				var coginitionReminder = {
					coginitionId : coginitionIds,
					coginitionText : coginitionTexts,
					currentCoginition : 0
				};
				Ti.API.info('set coginitionReminder');
				Ti.App.Properties.setObject("coginitionReminder", coginitionReminder);
			}

			setTimeout(function() {
				
			}, 1000);
		} else {
			commonFunctions.closeActivityIndicator();
			commonFunctions.showAlert(response.ErrorMessage, function() {
				if (OS_ANDROID) {
					$.userName.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
				}
				$.userName.focus();

			});

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
function signInAPIFailure(e) {
	commonFunctions.closeActivityIndicator();
	commonFunctions.showAlert(L('errorSignInWithSudyId'));
}

/**
 * Navigate to Sign In With Study Page
 * @param {Object} e
 */
function onSignInStudentClick(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('signinStudy', {
		isFrom : "signin"
	});

	

}

/**
 * Navigate to Gust User Signup page.
 * @param {Object} e
 */
function onSignInUserSignUpClick(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('signupUser');
}

/**
 * Change status for auto login.
 * @param {Object} e
 */
function onAutoLoginSwitchChange(e) {

}

/**
 * Navigate to forgot password.
 * @param {Object} e
 */
function onForgotPasswordClick(e) {

}

/**
 * Function to validate form entries.
 */
function isValid() {
	var LangCode = Ti.App.Properties.getString('languageCode');
	if (LangCode == "" || LangCode == null) {
		LangCode = "en";
	}
	var userName = $.userName.value.trim();
	var password = $.password.value.trim();

	if (userName == "") {
		commonFunctions.showAlert(commonFunctions.L('specifyUsername', LangCode), function() {

			if (OS_ANDROID) {
				$.userName.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
			}
			$.userName.focus();

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

	return true;
}

function onForgetPasswordClick(e) {

	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('forgetPassword');
}

/**
 * Used to call from Navigation controller, "open" event doesn't fire when we open this window again on logout
 */
exports.initWindow = function() {
	Ti.API.info('enter initwindow');
	setLabel();
	Alloy.Globals.IsSelected = 0;
	$.languageSlotLabel.text = "English";
	$.languageSlotLabel.index = 1;
	repopulateUserName();
};
/**
 * Function to refresh signin on back button click
 */
$.refreshSignIn = function(e) {
	Ti.API.info('enter sign in refresh');
	setLabel();
	var LangCode = Ti.App.Properties.getString('languageCode');
	if (LangCode == null || LangCode == "") {
		LangCode = "en";
	}
	var obj = commonFunctions.getLanguage(LangCode);
	Ti.API.info('obj is', obj);
	$.languageSlotLabel.text = obj.language;
	$.languageSlotLabel.index = obj.value;
	repopulateUserName();
};

/**
 * Repopulate username (no password) if user has already logged out.
 */
function repopulateUserName() {
	var credentials = Alloy.Globals.getCredentials();

	Ti.API.info('credentials : ', credentials);

	// Without timeout it may not get initialized.
	setTimeout(function() {
		$.userName.value = credentials.userName;
		
	}, 50);
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

		if (index === 0) {
			sendDateTime = time;
			if (OS_IOS) {
				var notify = require('zco.alarmmanager');

				var userInfo1 = {
					'isTextMessage' : false,
					"type" : type
				};

				notify.sheduleNotification(60, alertBody, "default", userInfo1);
			} else {
				Ti.API.info('time : ', time);
				
				var setTime = commonFunctions.formatTimeForAndroidHours(new Date(), seconds, 1);
				notificationManager.scheduleAndroidNotification(alertBody, setTime, "3600000", type);
			}
			setProperties(type, alertBody, sendDateTime, 0);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 1) {
			sendDateTime = time;
			if (OS_IOS) {
				var notify = require('zco.alarmmanager');

				var userInfo1 = {
					'isTextMessage' : false,
					"type" : type
				};

				notify.sheduleNotification(180, alertBody, "default", userInfo1);
			} else {
				Ti.API.info('time : ', time);
				
				var setTime = commonFunctions.formatTimeForAndroidHours(new Date(), seconds, 3);
				notificationManager.scheduleAndroidNotification(alertBody, setTime, "10800000", type);
			}
			setProperties(type, alertBody, sendDateTime, 1);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 2) {
			sendDateTime = time;
			if (OS_IOS) {
				var notify = require('zco.alarmmanager');

				var userInfo1 = {
					'isTextMessage' : false,
					"type" : type
				};

				notify.sheduleNotification(360, alertBody, "default", userInfo1);
			} else {
				Ti.API.info('time : ', time);
				
				var setTime = commonFunctions.formatTimeForAndroidHours(new Date(), seconds, 6);
				notificationManager.scheduleAndroidNotification(alertBody, setTime, "21600000", type);
			}
			setProperties(type, alertBody, sendDateTime, 2);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 3) {
			sendDateTime = time;
			if (OS_IOS) {
				var notify = require('zco.alarmmanager');

				var userInfo1 = {
					'isTextMessage' : false,
					"type" : type
				};

				notify.sheduleNotification(720, alertBody, "default", userInfo1);
			} else {
				Ti.API.info('time : ', time);
				
				var setTime = commonFunctions.formatTimeForAndroidHours(new Date(), seconds, 12);
				notificationManager.scheduleAndroidNotification(alertBody, setTime, "43200000", type);
			}
			setProperties(type, alertBody, sendDateTime, 3);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 4) {
			repeatMode = "daily";
			sendDateTime = time;
			Ti.API.info('sendDateTime:: ', sendDateTime);
			if (OS_IOS) {
				
				notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
			} else {

				var setTime = commonFunctions.formatTimeForAndroidSignIn(sendDateTime);
				
				notificationManager.scheduleAndroidNotification(alertBody, setTime, "43200000", type);
			}
			setProperties(type, alertBody, sendDateTime, 4);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 5) {
			var weekDay = commonFunctions.getDayName(new Date());
			
			var getFormattedDay = commonFunctions.getBiWeekDays(weekDay);
			
			var result = getFormattedDay.split('/');
			if (result.length > 0) {
				for (var i = 0; i < result.length; i++) {
					if (result[i] != "") {
						var notificationDate = result[i];
						repeatMode = "weekly";
						sendDateTime = time;
						if (OS_IOS) {
							notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
						} else {
							var setTime = commonFunctions.formatTimeForAndroidSignIn(sendDateTime);
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
			
			var getFormattedDay = commonFunctions.getTriWeekDays(weekDay);
			
			var result = getFormattedDay.split('/');
			if (result.length > 0) {
				for (var i = 0; i < result.length; i++) {
					if (result[i] != "") {
						var notificationDate = result[i];
						sendDateTime = time;
						if (OS_IOS) {
							notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
						} else {
							var setTime = commonFunctions.formatTimeForAndroidSignIn(sendDateTime);
							notificationManager.scheduleAndroidNotification(alertBody, setTime, "604800000", type);
						}
						setProperties(type, alertBody, sendDateTime, 6);
					}
				}
				Ti.App.Properties.setObject('sendTime', arrayItems);
			}
		} else if (index === 7) {
			repeatMode = "weekly";
			sendDateTime = time;
			if (OS_IOS) {
				notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
			} else {
				var setTime = commonFunctions.formatTimeForAndroidSignIn(sendDateTime);
				notificationManager.scheduleAndroidNotification(alertBody, setTime, "604800000", type);
			}
			setProperties(type, alertBody, sendDateTime, 7);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 8) {
			repeatMode = "monthly";
			var monthDays = commonFunctions.getBiMonthDays();
			
			var resultDays = monthDays.split('/');
			if (resultDays.length > 0) {
				for (var i = 0; i < resultDays.length; i++) {
					if (resultDays[i] != "") {
						var notificationDate = resultDays[i];
						sendDateTime = time;
						if (OS_IOS) {
							notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
						} else {
							var setTime = commonFunctions.formatTimeForAndroidSignIn(sendDateTime);
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
		commonFunctions.handleException("signin", "sendLocalNotification", ex);
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
		commonFunctions.handleException("signin", "setProperties", ex);
	}
}

function getIndex(value) {
	if (value === 1)
		resultValue = 0;
	else if (value === 2)
		resultValue = 1;
	else if (value === 3)
		resultValue = 2;
	else if (value === 4)
		resultValue = 3;
	else if (value === 5)
		resultValue = 4;
	else if (value === 6)
		resultValue = 5;
	else if (value === 7)
		resultValue = 6;
	else if (value === 8)
		resultValue = 7;
	else if (value === 9)
		resultValue = 8;
	else if (value === 10)
		resultValue = 9;
}

init();
