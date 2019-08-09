/**
 * Declarations
 */
{
	var args = $.args;
	var commonFunctions = require('commonFunctions');
	var commonDB = require('commonDB');
	var dismissItemIndex = -1;
	var settingsInfo = Ti.App.Properties.getObject("SettingsInfo");
	var menuLabel;
	var serviceManager = require('serviceManager');
	if (OS_IOS) {
		var locationupdatemodule = require('com.zco.location');
	}
	var menueClicked = false;
	var openFromNotificationClick = false;
	var LangCode = Ti.App.Properties.getString('languageCode');
}
if (settingsInfo != null && settingsInfo != undefined) {
	Alloy.Globals.HEADER_COLOR = settingsInfo.appColor;
	Alloy.Globals.BACKGROUND_IMAGE = settingsInfo.appBackground;
	$.menuSectionview.backgroundImage = Alloy.Globals.BACKGROUND_IMAGE;
}
/**
 * Trigger onReportClick click event
 */
function onReportClick() {
	$.trigger("reportButtonClick");
}

/**
 * Open Window.
 */
$.newHomeScreen.addEventListener("open", function(e) {
	try {
		Ti.API.info('newHomeScreen Open');
		initDB();
		if (OS_ANDROID) {
			var hasLocationPermissions = Ti.Geolocation.hasLocationPermissions();
			Ti.API.info('Ti.Geolocation.hasLocationPermissions', hasLocationPermissions);

			if (hasLocationPermissions == false) {
				Ti.API.info('requestLocationPermissions');
				Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS, function(e) {
					if (e.success) {
						Ti.App.fireEvent("getCurrentLocation");
					}
				});
			} else {
				Ti.App.fireEvent("getCurrentLocation");
			}
		} else {
			Ti.App.fireEvent("getCurrentLocation");
		}

		var surveyReminder = Ti.App.Properties.getObject("surveyReminder");
		Ti.API.info('surveyReminder : ', surveyReminder);
		if (surveyReminder == null || surveyReminder == undefined) {
			var surveyIds = [0];
			var surveyTexts = ["Mood"];
			var surveyReminder = {
				surveyId : surveyIds,
				surveyText : surveyTexts,
				currentSurvey : 0
			};
			Ti.API.info(' set surveyReminder');
			Ti.App.Properties.setObject("surveyReminder", surveyReminder);
		}

		var coginitionReminder = Ti.App.Properties.getObject("coginitionReminder");
		Ti.API.info('coginitionReminder : ', coginitionReminder);
		if (coginitionReminder == null || coginitionReminder == undefined) {
			var coginitionIds = [1];
			var coginitionTexts = ["n-back Test"];
			var coginitionReminder = {
				coginitionId : coginitionIds,
				coginitionText : coginitionTexts,
				currentCoginition : 0
			};
			Ti.API.info('set coginitionReminder');
			Ti.App.Properties.setObject("coginitionReminder", coginitionReminder);
		}

		var settingsInfo = Ti.App.Properties.getObject("SettingsInfo");
		if (settingsInfo != null && settingsInfo != undefined) {
			if (Alloy.Globals.HEADER_COLOR == "#359FFE") {
				Alloy.Globals.SYMPTOM_ACTIVE = "/images/surveys/icn-symptom-survey-active.png";
				Alloy.Globals.COGINITION_ACTIVE = "/images/surveys/icn-cognition-test-active.png";
				Alloy.Globals.ENVIRONMENT_ACTIVE = "/images/surveys/icn-environment-active.png";
				Alloy.Globals.HELP_ACTIVE = "/images/surveys/icn-help-active.png";

			} else if (Alloy.Globals.HEADER_COLOR == "#FF9500") {
				Alloy.Globals.SYMPTOM_ACTIVE = "/images/surveys/icn-orange-symptom-survey-active.png";
				Alloy.Globals.COGINITION_ACTIVE = "/images/surveys/icn-orange-cognition-test-active.png";
				Alloy.Globals.ENVIRONMENT_ACTIVE = "/images/surveys/icn-orange-environment-active.png";
				Alloy.Globals.HELP_ACTIVE = "/images/surveys/icn-orange-help-active.png";
			} else if (Alloy.Globals.HEADER_COLOR == "#4CD964") {
				Alloy.Globals.SYMPTOM_ACTIVE = "/images/surveys/icn-green-symptom-survey-active.png";
				Alloy.Globals.COGINITION_ACTIVE = "/images/surveys/icn-green-cognition-test-active.png";
				Alloy.Globals.ENVIRONMENT_ACTIVE = "/images/surveys/icn-green-environment-active.png";
				Alloy.Globals.HELP_ACTIVE = "/images/surveys/icn-green-help-active.png";
			} else if (Alloy.Globals.HEADER_COLOR == "#5756D6") {
				Alloy.Globals.SYMPTOM_ACTIVE = "/images/surveys/icn-violet-symptom-survey-active.png";
				Alloy.Globals.COGINITION_ACTIVE = "/images/surveys/icn-violet-cognition-test-active.png";
				Alloy.Globals.ENVIRONMENT_ACTIVE = "/images/surveys/icn-violet-environment-active.png";
				Alloy.Globals.HELP_ACTIVE = "/images/surveys/icn-violet-help-active.png";
			} else if (Alloy.Globals.HEADER_COLOR == "#02C1AC") {
				Alloy.Globals.SYMPTOM_ACTIVE = "/images/surveys/icn-turquoise-symptom-survey-active.png";
				Alloy.Globals.COGINITION_ACTIVE = "/images/surveys/icn-turquoise-cognition-test-active.png";
				Alloy.Globals.ENVIRONMENT_ACTIVE = "/images/surveys/icn-turquoise-environment-active.png";
				Alloy.Globals.HELP_ACTIVE = "/images/surveys/icn-turquoise-help-active.png";
			} else if (Alloy.Globals.HEADER_COLOR == "#313C4A") {
				Alloy.Globals.SYMPTOM_ACTIVE = "/images/surveys/icn-black-symptom-survey-active.png";
				Alloy.Globals.COGINITION_ACTIVE = "/images/surveys/icn-black-cognition-test-active.png";
				Alloy.Globals.ENVIRONMENT_ACTIVE = "/images/surveys/icn-black-environment-active.png";
				Alloy.Globals.HELP_ACTIVE = "/images/surveys/icn-black-help-active.png";
			}
		}
		insertReminderToDB();

	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "open", ex);
	}
});

/**
 * DB initialization
 */
function initDB() {
	try {
		Alloy.createCollection("Settings");
		if (OS_IOS) {
			var db = Ti.Database.open(Alloy.Globals.DATABASE);
			db.remoteBackup = false;
			db.close();
		}

	} catch(ex) {
		ui.handleException("Index", "initDb", ex);
	}
}

/**
 * Loading all remider alerts.
 */
function loadingAlerts(notificationArray) {
	try {
		var alertsArray = [];
		if (notificationArray.length > 0) {
			$.noDataLabel.visible = false;
			for (var i = 0; i < notificationArray.length; i++) {

				var rowColor = "transparent";
				if (notificationArray[i].read == 0) {
					rowColor = "#ebebeb";
				}

				alertsArray.push({
					template : "notificationListTemplate",
					notificationLabel : {
						text : notificationArray[i].alertBody
					},
					dismissView : {
						visible : false,
						ID : notificationArray[i].ID
					},
					listOuterView : {
						left : '0dp',
						right : '0dp',
						backgroundColor : rowColor

					},
					testID : notificationArray[i].testID,
					testName : notificationArray[i].testName,
					type : notificationArray[i].type

				});
			}
		} else {
			$.noDataLabel.visible = true;
		}

		$.lstSection.setItems(alertsArray);
	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "loadingAlerts", ex);
	}
}

/**
 * Handle remider swiping for dismiss
 */
function listViewSwipe(e) {
	try {
		if (e.direction == "left") {
			var item = $.notificationList.sections[0].getItemAt(e.itemIndex);
			if (item != null && item.listOuterView.left != "-100dp") {
				if (dismissItemIndex != e.itemIndex && dismissItemIndex != -1) {
					var item1 = $.notificationList.sections[0].getItemAt(dismissItemIndex);
					item1.listOuterView.left = '0dp';
					item1.listOuterView.right = '0dp';
					item1.dismissView.visible = false;
					$.notificationList.sections[0].updateItemAt(dismissItemIndex, item1);
					dismissItemIndex = -1;
				}
				item.listOuterView.left = '-80dp';
				item.listOuterView.right = '80dp';
				item.dismissView.visible = true;
				$.notificationList.sections[0].updateItemAt(e.itemIndex, item);
				dismissItemIndex = e.itemIndex;
			}
		} else if (e.direction == "right") {
			var item = $.notificationList.sections[0].getItemAt(e.itemIndex);
			if (item != null) {
				if (dismissItemIndex != -1 && dismissItemIndex == e.itemIndex) {
					item.listOuterView.left = '0dp';
					item.listOuterView.right = '0dp';
					item.dismissView.visible = false;
					$.notificationList.sections[0].updateItemAt(e.itemIndex, item);
					dismissItemIndex = -1;
				}

			}
		}

	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "listViewSwipe", ex);
	}
}

/**
 * Delete Alert messages
 */
function deleteAlerts(e) {
	try {
		dismissItemIndex = -1;
		var Id;
		if (OS_IOS) {
			Id = e.source.ID;
		} else {
			var item = e.section.getItemAt(e.itemIndex);
			Id = item.dismissView.ID;
		}
		commonDB.deleteAlerts(Id);
		reminderAlerts();

	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "deleteAlerts", ex);
	}

}

/**
 * Settings menu click
 */
function settingsClick(e) {
	try {
		Ti.API.info('Settings click');
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('settings');

	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "settingsClick", ex);
	}
}

/**
 * Help menu click
 */
function helpClick(e) {
	try {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('helpScreen');

	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "helpClick", ex);
	}
}

/**
 * on Assess click
 */
function onAssessClick(e) {
	try {
		if (menueClicked == false) {
			menueClicked = true;
			var credentials = Alloy.Globals.getCredentials();
			serviceManager.getUserProfile(credentials.userId, getUserProfileSuccess, getUserProfileFailure);
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('home');
			setTimeout(function() {
				menueClicked = false;
			}, 1000);

		}
	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "onAssessClick", ex);
	}
}

/**
 * on Learn click
 */
function onLearnClick(e) {
	try {
		if (menueClicked == false) {
			menueClicked = true;
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('homeStaticPages');
			setTimeout(function() {
				menueClicked = false;
			}, 1000);

		}
	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "onLearnClick", ex);
	}
}

/**
 * on Manage click
 */
function onManageClick(e) {
	try {
		if (menueClicked == false) {
			menueClicked = true;
			if (OS_IOS) {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scratchImageScreen');
			} else {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scratchTestScreen');
				setTimeout(function() {
					Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scratchImageScreen');
				}, 5);
			}
			setTimeout(function() {
				menueClicked = false;
			}, 1000);

		}
	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "onManageClick", ex);
	}
}

/**
 * on Prevent click
 */
function onPreventClick(e) {
	try {
		if (menueClicked == false) {
			menueClicked = true;
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('preventIntroScreen');
			setTimeout(function() {
				menueClicked = false;
			}, 1000);

		}
	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "onPreventClick", ex);
	}
}

/**
 * Function to update theme in Home.
 */
$.updateTheme = function(e) {
	try {
		$.menuSectionview.backgroundImage = Alloy.Globals.BACKGROUND_IMAGE;
		reminderAlerts();
	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "updateTheme", ex);
	}
};
/**
 * Funstion to Refresh in Home.
 */
$.refreshHomeScreen = function(e) {
	try {
		menueClicked = false;
		reminderAlerts();
	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "refreshHomeScreen", ex);
	}
};
function listViewClick(e) {
	try {
		var item = $.lstSection.getItemAt(e.itemIndex);
		var itemID = item.dismissView.ID;
		commonDB.updateAlerts(itemID);
		Ti.API.info('list item:: ', item.type);

		if (item.type === "survey") {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('symptomSurvey', {
				'surveyID' : item.testID + 1,
				'surveyName' : item.testName
			});
		} else {
			if (item.testID == 0) {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackLevel');
			} else if (item.testID == 1) {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsB');
			} else if (item.testID == 2) {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
					"isForward" : true
				});
			} else if (item.testID == 3) {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
					"isForward" : false
				});
			} else if (item.testID == 4) {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('simpleMemoryTask');
			} else if (item.testID == 5) {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('serial7STestScreen');
			} else if (item.testID == 6) {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('catAndDogGame');
			} else if (item.testID == 7) {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('figureCopyScreen');
			} else if (item.testID == 8) {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('visualAssociation');
			} else if (item.testID == 9) {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest');
			} else if (item.testID == 10) {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('catAndDogGameNew');
			} else if (item.testID == 11) {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('temporalOrder');
			}
		}

	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "listViewClick", ex);
	}
}

/**
 * Function to list the value set in the properties.
 */
function reminderAlerts() {
	try {
		var arrayToList = commonDB.getNotificationAlerts();
		loadingAlerts(arrayToList);
	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "reminderAlerts", ex);
	}
}

if (!OS_IOS) {
	Ti.App.addEventListener('app:android_resume', onResume);
}

/**
 * Function to handle on resuming the app.
 */
function onResume() {
	try {
		Ti.API.info('resumed');
		Alloy.Globals.ISPAUSED = false;
		var credentials = Alloy.Globals.getCredentials();
		if (credentials.userId == null || credentials.userId == "" || credentials.userId == 0) {
			return;
		}
		if (OS_IOS)
			locationupdatemodule.stopUpdatingLocation();
		Ti.API.info('credentials : ', credentials);
		serviceManager.getUserProfile(credentials.userId, getUserProfileSuccess, getUserProfileFailure);
		insertReminderToDB();
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow.windowName == "healthDataScreen") {
			Ti.App.fireEvent("healthDataRefresh");
		} else if (parentWindow.windowName == "home") {
			Ti.App.fireEvent("notificationRefresh");
		}

		openFromNotificationClick = false;
	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "onResume", ex);
	}
}

function getUserProfileSuccess(e) {

}

function getUserProfileFailure(e) {

}

function insertReminderToDB() {
	var resumeDateTime = new Date();
	var pauseTime = Ti.App.Properties.getObject('pausedTime');
	var sendTimeList = Ti.App.Properties.getObject('sendTime');
	Ti.API.info('pause time:: ', pauseTime);
	Ti.API.info('resumed time:: ', resumeDateTime);
	if (pauseTime != null && openFromNotificationClick == false) {

		var credentials = Alloy.Globals.getCredentials();
		if (sendTimeList != null && sendTimeList.length > 0) {
			for (var i = 0; i < sendTimeList.length; i++) {
				var time = sendTimeList[i].sendDateTime;

				if (sendTimeList[i].index === 0) {
					var setTime = sendTimeList[i].sendDateTime;
					var dayName = commonFunctions.getDayName(setTime);
					var numdays = commonFunctions.getDailyDays(pauseTime, resumeDateTime, dayName, setTime);
					Ti.API.info('DAILY:: ', numdays);
					if (numdays > 0) {
						for (var j = 0; j < numdays; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type);
						}
					}
				} else if (sendTimeList[i].index === 1) {
					var setTime = sendTimeList[i].sendDateTime;
					var dayName = commonFunctions.getDayName(setTime);
					var biWeekCount = commonFunctions.getWeekDays(pauseTime, resumeDateTime, dayName, setTime);
					Ti.API.info('count:: ', biWeekCount);
					if (biWeekCount > 0) {
						for (var j = 0; j < biWeekCount; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type);
						}

					}
				} else if (sendTimeList[i].index === 2) {
					var setTime = sendTimeList[i].sendDateTime;
					var dayName = commonFunctions.getDayName(setTime);
					var triWeekCount = commonFunctions.getWeekDays(pauseTime, resumeDateTime, dayName, setTime);
					Ti.API.info('tricount:: ', triWeekCount);
					if (triWeekCount > 0) {
						for (var j = 0; j < triWeekCount; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type);
						}

					}
				} else if (sendTimeList[i].index === 3) {
					var setTime = sendTimeList[i].sendDateTime;
					var dayName = commonFunctions.getDayName(setTime);
					var WeekCount = commonFunctions.getWeekDays(pauseTime, resumeDateTime, dayName, setTime);
					Ti.API.info('weekcount:: ', WeekCount);
					if (WeekCount > 0) {
						for (var j = 0; j < WeekCount; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type);
						}

					}
				} else if (sendTimeList[i].index === 4) {
					var setTime = sendTimeList[i].sendDateTime;
					var monthDayCount = commonFunctions.getMonthDays(pauseTime, resumeDateTime, setTime);
					Ti.API.info('monthDayCount:: ', monthDayCount);
					if (monthDayCount > 0) {
						for (var j = 0; j < monthDayCount; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type);
						}

					}
				}
			}
			reminderAlerts();
		}
	}
}

if (OS_IOS) {
	/**
	 * Listener for handling the incoming local notification when app is in foreground.
	 */
	Ti.App.iOS.addEventListener('notification', function(e) {
		try {
			openFromNotificationClick = true;
			Ti.API.info('notification :: ', JSON.stringify(e));
			Ti.API.info('***Alloy.Globals.ISPAUSED****', Alloy.Globals.ISPAUSED);
			if (!Alloy.Globals.ISPAUSED) {
				Ti.API.info('***IS PAUSED****');
				var credentials = Alloy.Globals.getCredentials();
				commonDB.insertAlerts(credentials.userId, e.alertBody, e.userInfo.type);
				reminderAlerts();
				Ti.App.fireEvent("notificationRefresh");
			} else {
				var testID = 0;
				var testName = "";
				if (e.userInfo.type === "survey") {

					var surveyReminder = Ti.App.Properties.getObject("surveyReminder");
					if (Ti.App.Properties.hasProperty("surveyReminder")) {
						var arrSurveyIDs = surveyReminder.surveyId;
						var arrSurveyTexts = surveyReminder.surveyText;
						if (arrSurveyIDs.length != 0) {
							if (arrSurveyIDs.length == 1) {
								testID = arrSurveyIDs[0];
								surveyReminder.currentSurvey = 0;
								testName = arrSurveyTexts[0];
							} else {
								if (surveyReminder.currentSurvey + 1 == arrSurveyIDs.length) {
									testID = arrSurveyIDs[0];
									surveyReminder.currentSurvey = 0;
									testName = arrSurveyTexts[0];
								} else {

									testID = arrSurveyIDs[surveyReminder.currentSurvey];
									testName = arrSurveyTexts[surveyReminder.currentSurvey];
									surveyReminder.currentSurvey = surveyReminder.currentSurvey + 1;
								}

							}
							Ti.App.Properties.setObject("surveyReminder", surveyReminder);
						}
					}
					Ti.API.info('notification click : ', testID, testName);
					Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('symptomSurvey', {
						'surveyID' : testID + 1,
						'surveyName' : testName
					});

				} else {

					var coginitionReminder = Ti.App.Properties.getObject("coginitionReminder");
					if (Ti.App.Properties.hasProperty("coginitionReminder")) {
						var arrCogIDs = coginitionReminder.coginitionId;
						var arrCogTexts = coginitionReminder.coginitionText;
						if (arrCogIDs.length != 0) {
							if (arrCogIDs.length == 1) {
								testID = arrCogIDs[0];
								coginitionReminder.currentCoginition = 0;
								testName = arrCogTexts[0];
							} else {
								if (coginitionReminder.currentCoginition + 1 == arrCogIDs.length) {
									testID = arrCogIDs[0];
									coginitionReminder.currentCoginition = 0;
									testName = arrCogTexts[0];
								} else {

									testID = arrCogIDs[coginitionReminder.currentCoginition];
									testName = arrCogTexts[coginitionReminder.currentCoginition];
									coginitionReminder.currentCoginition = coginitionReminder.currentCoginition + 1;
								}

							}
							Ti.App.Properties.setObject("coginitionReminder", coginitionReminder);
						}
					}
					Ti.API.info('notification click : ', testID, testName);
					if (testID == 0) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackLevel');
					} else if (testID == 1) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsB');
					} else if (testID == 2) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
							"isForward" : true
						});
					} else if (testID == 3) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
							"isForward" : false
						});
					} else if (testID == 4) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('simpleMemoryTask');
					} else if (testID == 5) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('serial7STestScreen');
					} else if (testID == 6) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('catAndDogGame');
					} else if (testID == 7) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('figureCopyScreen');
					} else if (testID == 8) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('visualAssociation');
					} else if (testID == 9) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest');
					} else if (testID == 10) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('catAndDogGameNew');
					} else if (testID == 11) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('temporalOrder');
					}

				}

			}
		} catch(ex) {
			commonFunctions.handleException("newHomeScreen", "notification", ex);
		}
	});
}

/**
 * function for handling session expire
 */

Ti.App.addEventListener('sessionTokenExpired', onSessionExpire);
Ti.App.addEventListener('notificationHomeRefresh', notificationHomeRefresh);

function onSessionExpire() {
	try {
		Ti.API.info('onSessionExpire function');
		commonFunctions.closeActivityIndicator();
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
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('signin');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('newHomeScreen');
		if (OS_IOS) {
			Ti.App.iOS.cancelAllLocalNotifications();
		} else {
			Alloy.Globals.REQUEST_CODE_ARRAY = [];
			if (Ti.App.Properties.getObject('requestCode') != null) {
				cancelMultipleAlarm(Ti.App.Properties.getObject('requestCode'));
				Ti.App.Properties.setObject('requestCode', null);
			}
		}
		Ti.App.Properties.setObject('sendTime', null);
		Ti.API.info('openWindow Signin');
	} catch(ex) {
		commonFunctions.handleException("newhomescreen", "onSessionExpire", ex);
	}
}

/**
 * Function to refresh the alert wheen tapping on Home button in home page.
 */
function notificationHomeRefresh() {
	try {
		reminderAlerts();
	} catch(ex) {
		commonFunctions.handleException("newhomescreen", "notificationHomeRefresh", ex);
	}
}

/**
 * While tapping the back button in android the app will exit from home screen
 */
$.newHomeScreen.addEventListener('android:back', function() {
	try {
		Ti.API.info('android:back newHomeScreen');
		commonFunctions.showConfirmation(L('exitApp'), ['Yes', 'No'], function() {
			try {
				Ti.App.fireEvent("app:exitApp");

			} catch(e) {
				commonFunctions.handleException("newhomescreen", "android:back", e);
			}
		});
	} catch(ex) {
		commonFunctions.handleException("newhomescreen", "android-back", ex);
	}

});

/**
 * Function for cancelling the notification.
 */
function cancelMultipleAlarm(requestcodeArray) {

}

