/**
 * Declarations
 */
{
	var args = $.args;
	var commonFunctions = require('commonFunctions');
	var commonDB = require('commonDB');
	var LangCode=Ti.App.Properties.getString('languageCode');
	var dismissItemIndex = -1;
	var settingsInfo = Ti.App.Properties.getObject("SettingsInfo");
	var menueClicked = false;
	var serviceManager = require('serviceManager');
	var notificationManager = require('notificationManager');
	var arrayItems = [];
	if (OS_IOS) {
		var locationupdatemodule = require('com.zco.location');
		var notify = require('zco.alarmmanager');
	}
	var openFromNotificationClick = false;
	var cognitionTestArray = [{
		"id" : 1,
		"name" : "n-back Test",
	}, {
		"id" : 2,
		"name" : "trails-b Test"
	}, {
		"id" : 3,
		"name" : "Spatial Span Forward",
	}, {
		"id" : 4,
		"name" : "Spatial Span Backward"
	}, {
		"id" : 5,
		"name" : "Simple Memory",
	}, {
		"id" : 6,
		"name" : "Serial 7s"
	}, {
		"id" : 8,
		"name" : "3D Figure Copy"
	}, {
		"id" : 9,
		"name" : "Visual Association"
	}, {
		"id" : 10,
		"name" : "Digit Span Forward"
	}, {
		"id" : 13,
		"name" : "Digit Span Backward"
	}, {
		"id" : 11,
		"name" : "Cats and Dogs(New)"
	}, {
		"id" : 12,
		"name" : "Temporal Order"
	}, {
		"id" : 15,
		"name" : "trails-b Test(New)"
	}, {
		"id" : 14,
		"name" : "n-back Test(New)"
	}, {
		"id" : 16,
		"name" : "trails-b(Touch)"
	}, {
		"id" : 17,
		"name" : "Jewels Trail - A"
	}, {
		"id" : 18,
		"name" : "Jewels Trail - B"
	}];
}

if (settingsInfo != null && settingsInfo != undefined) {
	Alloy.Globals.HEADER_COLOR = settingsInfo.appColor;
	Alloy.Globals.BACKGROUND_IMAGE = settingsInfo.appBackground;
	$.menuSectionview.backgroundImage = Alloy.Globals.BACKGROUND_IMAGE;
}

/**
 * Open Window.
 */
$.home.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerView.height = "80dp";
				$.notificationSectionview.bottom = "82dp";
			}
		}
		Ti.API.info('app version', Titanium.App.version);
		if (Ti.App.Properties.hasProperty("appVersion")) {
			
		if (Ti.App.Properties.getString("appVersion") != Titanium.App.version && Titanium.App.version=="1.0.7.0") {
			if(!Ti.App.Properties.hasProperty('languageCode')){
				Ti.App.Properties.setString('languageCode', "en");
			}
			
		}
	}
	var LangCode=Ti.App.Properties.getString('languageCode');
		Ti.API.info('Home Open********************',LangCode);
		$.headerLabel.text=commonFunctions.L('accessLbl', LangCode);
		$.menuLbl.text = commonFunctions.L('surveyMenu',LangCode);
		$.cognitionLbl.text = commonFunctions.L('cognitionMenu',LangCode);
		$.envLbl.text = commonFunctions.L('environmentMenu',LangCode);
		$.noDataLabel.text=commonFunctions.L('noDataLabel',LangCode);
		$.supportLabel.text=commonFunctions.L('copyrightLbl',LangCode);
		$.resultText.text =commonFunctions.L('healthDataTitle',LangCode);
		initDB();

		var BlogsUpdate = Ti.App.Properties.getString("BlogsUpdate", "");
		var TipsUpdate = Ti.App.Properties.getString("TipsUpdate", "");
		if (BlogsUpdate == true || BlogsUpdate == "true" || TipsUpdate == true || TipsUpdate == "true") {
			$.footerView.setInfoIndicatorON();
		} else {
			$.footerView.setInfoIndicatorOFF();
		}
		
		var surveyReminder = Ti.App.Properties.getObject("surveyReminder");
		Ti.API.info('surveyReminder : ', surveyReminder);
		var isGuest = Ti.App.Properties.getString("isGuest", "");
		if (surveyReminder == null || surveyReminder == undefined) {

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
		checkUpdate();
		$.footerView.setSelectedLabel(2);
		$.menuSectionview.backgroundImage = Alloy.Globals.BACKGROUND_IMAGE;
		
		insertReminderToDB();
		var showPopUp = false;
		var MonthlyAlertTime = Ti.App.Properties.getString("monthlyPopUp", "");
		Ti.API.info('MonthlyAlertTime : ', MonthlyAlertTime);
		if (MonthlyAlertTime != "") {
			var curTime = new Date().toUTCString();
			var timeDiff = Math.abs(new Date(curTime).getTime() - new Date(MonthlyAlertTime).getTime());
			Ti.API.info('timeDiff : ', timeDiff);
			var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
			Ti.API.info('diffDays : ', diffDays);
			if (diffDays >= 30) {
				showPopUp = true;
			}

		} else {
			showPopUp = true;
		}
		if (showPopUp == true) {
			
		}
		var proto=	Ti.App.Properties.getString('isProtocolActivated');
		if(proto==1 || proto=="1"){
			commonFunctions.protoTypeReminder();
		}
		
		if (Ti.Network.online) {
			var LastUpdatedDate = "";
			var credentials = Alloy.Globals.getCredentials();
			serviceManager.getSurveyList(credentials.userId, LastUpdatedDate, getSurveyListSuccess, getSurveyListFailure);
		}
		if (OS_ANDROID) {
			var hasLocationPermissions = Ti.Geolocation.hasLocationPermissions();
			Ti.API.info('Ti.Geolocation.hasLocationPermissions', hasLocationPermissions);

			if (hasLocationPermissions == false) {
				Ti.API.info('OS version : ' ,parseInt(Ti.Platform.version));
				Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS, function(e) {
					if (e.success) {
						if(parseInt(Ti.Platform.version)>=6){
						        var permissionsToRequest = ["android.permission.WRITE_EXTERNAL_STORAGE"];
						Ti.API.info('permissionsToRequest : ',permissionsToRequest.length);
						        if (permissionsToRequest.length > 0) {
							Ti.API.info('requestPermissions');
						            Ti.Android.requestPermissions(permissionsToRequest, function(e) {
						                if (e.success) {
						                    Ti.API.info("SUCCESS");
						                } else {
						                    Ti.API.info("ERROR: " + e.error);
						                }
						            });
						        }
						}

						Ti.App.fireEvent("getCurrentLocation");
					}else{
						if(parseInt(Ti.Platform.version)>=6){
						    var permissionsToRequest = ["android.permission.WRITE_EXTERNAL_STORAGE"];
								Ti.API.info('permissionsToRequest : ',permissionsToRequest.length);
					        if (permissionsToRequest.length > 0) {
						Ti.API.info('requestPermissions');
					            Ti.Android.requestPermissions(permissionsToRequest, function(e) {
					                if (e.success) {
					                    Ti.API.info("SUCCESS");
					                } else {
					                    Ti.API.info("ERROR: " + e.error);
					                }
					            });
					        }
					}

					}
				});
			} else {
				if(parseInt(Ti.Platform.version)>=6){
				        var permissionsToRequest = ["android.permission.WRITE_EXTERNAL_STORAGE"];
				Ti.API.info('permissionsToRequest : ',permissionsToRequest.length);
				        if (permissionsToRequest.length > 0) {
					Ti.API.info('requestPermissions');
				            Ti.Android.requestPermissions(permissionsToRequest, function(e) {
				                if (e.success) {
				                    Ti.API.info("SUCCESS");
				                } else {
				                    Ti.API.info("ERROR: " + e.error);
				                }
				            });
				        }
				}

				Ti.App.fireEvent("getCurrentLocation");
			}
			
			

//         var permissionsToRequest = ["android.permission.WRITE_EXTERNAL_STORAGE"];
// Ti.API.info('permissionsToRequest : ',permissionsToRequest.length);
//         if (permissionsToRequest.length > 0) {
	// Ti.API.info('requestPermissions');
//             Ti.Android.requestPermissions(permissionsToRequest, function(e) {
//                 if (e.success) {
//                     Ti.API.info("SUCCESS");
//                 } else {
//                     Ti.API.info("ERROR: " + e.error);
//                 }
//             });
//         }			
			
			
		} else {
			Ti.App.fireEvent("getCurrentLocation");
		}
		
		resetAllNotifications();
		Ti.App.fireEvent("updateHealthData");
		
		var currentDay = new Date().getDate();
		var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
	 	if(spinInfo.spinDate != currentDay){
	 		var dayDiff = parseInt(currentDay) - parseInt(spinInfo.spinDate);
	 		if(dayDiff > 1) {
	 			spinInfo.dayStreaks = 0;
	 		}
	 		spinInfo.noOFSpins = 0;
	 		Ti.App.Properties.setObject('spinnerInfo', spinInfo);
	 	}

	} catch(ex) {
		commonFunctions.handleException("home", "open", ex);
	}
});

/**
 * getSurveyListSuccess handler
 */
function getSurveyListSuccess(e) {

	try {
		var response = JSON.parse(e.data);
		Ti.API.info('***getSurveyListSuccess****  ', JSON.stringify(response));
		var credentials = Alloy.Globals.getCredentials();
		if (response.ErrorCode == 0) {
			var resultArrayList = response.Survey;
			Ti.App.Properties.setString('surveyLastUpdatedDate', response.LastUpdatedDate);
			for (var i = 0; i < resultArrayList.length; i++) {
				var surveyID = resultArrayList[i].SurveyID;
				var surveyName = resultArrayList[i].SurveyName;
				
				if (surveyName != null && surveyName != "") {
					Ti.API.info('languageArray in survey',surveyID ,resultArrayList[i]);
					commonDB.insertSurveyTypes(surveyID, surveyName, credentials.userId, resultArrayList[i].IsDeleted);
					commonDB.insertSurveyQuestions(resultArrayList[i].Questions, credentials.userId, surveyID,resultArrayList[i].LanguageCode);
				}

			};

			var surveyReminder = Ti.App.Properties.getObject("surveyReminder");
			Ti.API.info('surveyReminder :  ', surveyReminder);
			if (Ti.App.Properties.hasProperty("surveyReminder")) {

				var prfSurvey = Ti.App.Properties.getString("PrefferedSurveys", "");
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
					Ti.API.info('Save surveyReminder : ', surveyReminder);
					Ti.App.Properties.setObject("surveyReminder", surveyReminder);

				}

			}

		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}
		checkAdminNotification();


	} catch(ex) {
		commonFunctions.handleException("surveyList", "getSurveyListSuccess", ex);
	}
}

/**
 * Failure api call
 */
function getSurveyListFailure(e) {
	Ti.API.info('***getSurveyListFailure****  ', JSON.stringify(e));

}

/**
 * initDB handler
 */
function initDB() {
	try {
		Alloy.createCollection("Settings");
		Alloy.createCollection("Articles");

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
		Ti.API.info('notificationArray',JSON.stringify(notificationArray));
		var alertsArray = [];
		if (notificationArray.length > 0) {
			$.noDataLabel.visible = false;
			for (var i = 0; i < notificationArray.length; i++) {
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
						left : '4dp',
						right : '4dp'
					},
					testID : notificationArray[i].testID,
					testName : notificationArray[i].testName,
					type : notificationArray[i].type,
					version : notificationArray[i].version,
					batchID:notificationArray[i].batchID,
					createdDate : notificationArray[i].createdDate,
					isLocal : notificationArray[i].isLocal
				});
			}
		} else {
			$.noDataLabel.visible = true;
		}

		$.lstSection.setItems(alertsArray);
	} catch(ex) {
		commonFunctions.handleException("home", "loadingAlerts", ex);
	}

}

/**
 * Handle remider swiping for dismiss
 */
function listViewSwipe(e) {
	try {
		Ti.API.info('listViewSwipe : ', JSON.stringify(e));
		Ti.API.info('listViewSwipe 1 : ', JSON.stringify(e));
		if (e.direction == "left") {
			var item = $.notificationList.sections[0].getItemAt(e.itemIndex);
			if (item != null && item.listOuterView.left != "-100dp") {
				if (dismissItemIndex != e.itemIndex && dismissItemIndex != -1) {
					var item1 = $.notificationList.sections[0].getItemAt(dismissItemIndex);
					item1.listOuterView.left = '4dp';
					item1.listOuterView.right = '4dp';
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
					item.listOuterView.left = '4dp';
					item.listOuterView.right = '4dp';
					item.dismissView.visible = false;
					$.notificationList.sections[0].updateItemAt(e.itemIndex, item);
					dismissItemIndex = -1;
				}

			}
		}

	} catch(ex) {
		commonFunctions.handleException("home", "listViewSwipe", ex);
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
		commonFunctions.handleException("home", "deleteAlerts", ex);
	}

}

/**
 * Survey menu click
 */
function surveyClick(e) {
	try {
		if (menueClicked == false) {
			menueClicked = true;

			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('surveysList');
			setTimeout(function() {
				menueClicked = false;
			}, 1000);

		}

	} catch(ex) {
		commonFunctions.handleException("home", "surveyClick", ex);
	}
}

/**
 * Settings menu click
 */
function settingsClick(e) {
	try {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('settings');

	} catch(ex) {
		commonFunctions.handleException("home", "settingsClick", ex);
	}
}

/**
 * Function for report click
 */
function onReportClick(e) {
	commonFunctions.sendScreenshot();
}

/**
 * Help menu click
 */
function helpClick(e) {
	try {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('userProfileScreen');

	} catch(ex) {
		commonFunctions.handleException("home", "helpClick", ex);
	}
}

/**
 * on home button click
 */
function onHomeClick(e) {
	try {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('healthDataScreen');

	} catch(ex) {
		commonFunctions.handleException("home", "homeClick", ex);
	}
}

/**
 * function for android back
 */
$.home.addEventListener('android:back', function() {
	
	commonFunctions.showConfirmation(L('exitApp'), ['Yes', 'No'], function() {
		try {
			Ti.App.fireEvent("app:exitApp");

		} catch(e) {
			commonFunctions.handleException("newhomescreen", "android:back", e);
		}
	});
});

/**
 * Activity menu click
 */
function activityClick(e) {
	try {
		
		if (menueClicked == false) {
			menueClicked = true;
			//Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('resultScreen');
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('newHeathScreen');
			setTimeout(function() {
				menueClicked = false;
			}, 1000);

		}
	} catch(ex) {
		commonFunctions.handleException("home", "activityClick", ex);
	}
}

/**
 * Environment menu click
 */
function environmentClick(e) {
	try {
		if (menueClicked == false) {
			menueClicked = true;
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spaceBlockScreen');
			setTimeout(function() {
				menueClicked = false;
			}, 1000);

		}

	} catch(ex) {
		commonFunctions.handleException("home", "environmentClick", ex);
	}
}

/**
 * Coginition test menu click
 */
function cognitionClick(e) {
	try {
		if (menueClicked == false) {
			menueClicked = true;
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionTestScreen');
			setTimeout(function() {
				menueClicked = false;
			}, 1000);

		}

	} catch(ex) {
		commonFunctions.handleException("home", "environmentClick", ex);
	}
}

/**
 * Funstion to update theme in Home.
 */
$.updateTheme = function(e) {
	try {
		$.footerView.setSelectedLabel(2);
		$.menuSectionview.backgroundImage = Alloy.Globals.BACKGROUND_IMAGE;
		
		setLabel();
		reminderAlerts();
	} catch(ex) {
		commonFunctions.handleException("surveyList", "showCompletedList", ex);
	}
};
/**
 * Funstion to Refresh in Home.
 */
$.refreshHomeScreen = function(e) {
	try {
		var LangCode = Ti.App.Properties.getString('languageCode');
		checkUpdate();
		setLabel();	
		Ti.App.fireEvent("getCurrentLocation");
		Ti.App.fireEvent("updateHealthData");
		menueClicked = false;
		
		reminderAlerts();
		Ti.API.info('enter home......$..........');
	} catch(ex) {
		commonFunctions.handleException("surveyList", "showCompletedList", ex);
	}
};
function setLabel() {
		var LangCode = Ti.App.Properties.getString('languageCode');
		Ti.API.info('lang code is*************',LangCode);
  		$.headerLabel.text=commonFunctions.L('accessLbl', LangCode);
		$.menuLbl.text = commonFunctions.L('surveyMenu',LangCode);
		$.cognitionLbl.text = commonFunctions.L('cognitionMenu',LangCode);
		$.envLbl.text = commonFunctions.L('environmentMenu',LangCode);
		$.noDataLabel.text=commonFunctions.L('noDataLabel',LangCode);
		$.supportLabel.text=commonFunctions.L('copyrightLbl',LangCode);
		$.resultText.text =commonFunctions.L('healthDataTitle',LangCode);
}

/**
 * refreshLabelsHomeScreen function
 */
$.refreshLabelsHomeScreen = function(e) {
	setLabel();
}

/**
 *List view item click
 */
function listViewClick(e) {
	Ti.API.info('listViewClick');
	var item = $.lstSection.getItemAt(e.itemIndex);
	var itemID = item.dismissView.ID;
	
	Ti.API.info('list item:: ', item.type);
	Ti.API.info('list testID:: ', item.testID, item.testName);
	Ti.API.info('list batch testID:: ', item);
	Ti.API.info('list batch testID:: ', item.batchID);
	if (item.type === "survey") {
		commonDB.updateAlerts(itemID);
		var isGuest = Ti.App.Properties.getString("isGuest", "");
		if (isGuest == 1 || isGuest == "1") {
			Alloy.Globals.NAVIGATION_CONTROLLER.openFullScreenWindow('syptomSurveyNew', {
				'surveyID' : item.testID,
				'surveyName' : item.testName.toUpperCase(),
				'fromNotification' : true,
				"createdDate" : item.createdDate,
				"isLocal" : item.isLocal
			});
		} else {
			Alloy.Globals.NAVIGATION_CONTROLLER.openFullScreenWindow('syptomSurveyNew', {
				'surveyID' : item.testID,
				'surveyName' : item.testName.toUpperCase(),
				'fromNotification' : true,
				"createdDate" : item.createdDate,
				"isLocal" : item.isLocal
			});

		}

		//Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('surveysList');
	} else if(item.type === "Batch"){
		Ti.API.info('item.testID : ',item.testID);
		Ti.API.info('item.dismissView.testID : ',item.dismissView.ID);
		commonDB.updateBatchAlerts(item.testID);
		var surveyName="";
		var batchId=item.batchID;
		batchId=batchId.split(",");
		Ti.API.info('enter here in batch',batchId);
		var surveyId = batchId[0].trim().split(" ");
		if (surveyId[0] == "S") {
			surveyName = commonDB.getSurveyName(surveyId[1]);
		}
		
		
		commonFunctions.navigateToWindow(batchId[0],item.version,surveyName,surveyId[1],item.testID,item.createdDate);
		Alloy.Globals.BATCH_ARRAY=batchId;
		Ti.API.info('Alloy.Globals.BATCH_ARRAY values are:', Alloy.Globals.BATCH_ARRAY);
		
	}else {
		commonDB.updateAlerts(itemID);
		if (item.testID == 1) {
			Ti.API.info('Nback reminder version : ', item.version);
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackLevel', {
				"reminderVersion" : item.version,
				"fromNotification" : true,
				"createdDate" : item.createdDate,
				"isLocal" : item.isLocal
			});
		} else if (item.testID == 2) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsB', {
				"fromNotification" : true,
				"createdDate" : item.createdDate,
				"isLocal" : item.isLocal
			});
		} else if (item.testID == 3) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
				"isForward" : true,
				"fromNotification" : true,
				"createdDate" : item.createdDate,
				"isLocal" : item.isLocal
			});
		} else if (item.testID == 4) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
				"isForward" : false,
				"fromNotification" : true,
				"createdDate" : item.createdDate,
				"isLocal" : item.isLocal
			});
		} else if (item.testID == 5) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('simpleMemoryTask', {
				"reminderVersion" : item.version,
				"fromNotification" : true,
				"createdDate" : item.createdDate,
				"isLocal" : item.isLocal
			});
		} else if (item.testID == 6) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('serial7STestScreen', {
				"reminderVersion" : item.version,
				"fromNotification" : true,
				"createdDate" : item.createdDate,
				"isLocal" : item.isLocal
			});
		} else if (item.testID == 7) {
			//Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('catAndDogGame');
		} else if (item.testID == 8) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('figureCopyScreen', {
				"fromNotification" : true,
				"createdDate" : item.createdDate,
				"isLocal" : item.isLocal
			});
		} else if (item.testID == 9) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('visualAssociation', {
				"reminderVersion" : item.version,
				"fromNotification" : true,
				"createdDate" : item.createdDate,
				"isLocal" : item.isLocal
			});
		} else if (item.testID == 10) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
				"isForward" : true,
				"fromNotification" : true,
				"createdDate" : item.createdDate,
				"isLocal" : item.isLocal
			});
		} else if (item.testID == 11) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('catAndDogGameNew', {
				"fromNotification" : true,
				"createdDate" : item.createdDate,
				"isLocal" : item.isLocal
				
			});
		} else if (item.testID == 12) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('temporalOrder', {
				"reminderVersion" : item.version,
				"fromNotification" : true,
				"createdDate" : item.createdDate,
				"isLocal" : item.isLocal
			});
		} else if (item.testID == 13) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
				"isForward" : false,
				"fromNotification" : true,
				"createdDate" : item.createdDate,
				"isLocal" : item.isLocal
			});
		} else if (item.testID == 13) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
				"isForward" : false,
				"fromNotification" : true,
				"createdDate" : item.createdDate,
				"isLocal" : item.isLocal
			});
		} else if (item.testID == 14) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackLevelNew', {
				"fromNotification" : true,
				"createdDate" : item.createdDate,
				"isLocal" : item.isLocal
			});
		} else if (item.testID == 15) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsbNonOverlap', {
				"reminderVersion" : item.version,
				"fromNotification" : true,
				"createdDate" : item.createdDate,
				"isLocal" : item.isLocal
			});
		} else if (item.testID == 16) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsBNew', {
				"fromNotification" : true,
				"createdDate" : item.createdDate,
				"isLocal" : item.isLocal
			});
		} else if (item.testID == 17) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsIntro', {
				"fromNotification" : true,
				"createdDate" : item.createdDate,
				"isLocal" : item.isLocal
			});
		} else if (item.testID == 18) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsIntroB', {
				"fromNotification" : true,
				"createdDate" : item.createdDate,
				"isLocal" : item.isLocal
			});
		}

		//Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionTestScreen');
	}

}

/**
 * Inserting remainder to DB
 */
function insertReminderToDB() {
	var resumeDateTime = new Date();
	var pauseTime = Ti.App.Properties.getObject('pausedTime');
	var sendTimeList = Ti.App.Properties.getObject('sendTime');
	console.log("sendTimeList");
	console.log(sendTimeList);
	Ti.API.info('pause time:: ', pauseTime);
	Ti.API.info('resumed time:: ', resumeDateTime);
	Date.prototype.addHours = function(h) {
		this.setTime(this.getTime() + (h * 60 * 60 * 1000));
		return this;
	};

	if (pauseTime != null) {//&& openFromNotificationClick == false
		var credentials = Alloy.Globals.getCredentials();
		if (sendTimeList != null && sendTimeList.length > 0) {
			commonFunctions.getLastReminderTime();
			for (var i = 0; i < sendTimeList.length; i++) {
				var time = sendTimeList[i].sendDateTime;

				if (sendTimeList[i].index === 0) {

					if (sendTimeList[i].isAdmin == 1) {
						var reminderValues = Ti.App.Properties.getObject('lastAdminReminderTime');
						if (reminderValues != null) {
							if (sendTimeList[i].type == "survey") {
								var lastReminderTime = reminderValues.hourlySurvey;
							} else {
								var lastReminderTime = reminderValues.hourlyCog;

							}
						}

					} else {
						var reminderValues = Ti.App.Properties.getObject('lastLocalReminderTime');
						if (reminderValues != null) {
							if (sendTimeList[i].type == "survey") {
								var lastReminderTime = reminderValues.hourlySurvey;
							} else {
								var lastReminderTime = reminderValues.hourlyCog;

							}
						}
					}

					if (lastReminderTime == "") {
						var setTime = sendTimeList[i].sendDateTime;
					} else {
						var setTime = lastReminderTime;
					}

					var numdays = commonFunctions.getHoursNumber(pauseTime, resumeDateTime, setTime, 0, sendTimeList[i].type, sendTimeList[i].isAdmin);
					Ti.API.info('Hours:: ', numdays);
					if (numdays > 0) {
						for (var j = 0; j < numdays; j++) {

							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
						}

					}

				} else if (sendTimeList[i].index === 1) {

					if (sendTimeList[i].isAdmin == 1) {
						var reminderValues = Ti.App.Properties.getObject('lastAdminReminderTime');
						if (reminderValues != null) {
							if (sendTimeList[i].type == "survey") {
								var lastReminderTime = reminderValues.threeHourSurvey;
							} else {
								var lastReminderTime = reminderValues.threeHourCog;

							}
						}

					} else {
						var reminderValues = Ti.App.Properties.getObject('lastLocalReminderTime');
						console.log("lastLocalReminderTime");
						console.log(reminderValues);
						if (reminderValues != null) {
							if (sendTimeList[i].type == "survey") {
								var lastReminderTime = reminderValues.threeHourSurvey;
							} else {
								var lastReminderTime = reminderValues.threeHourCog;

							}
						}
					}
					if (lastReminderTime == "") {
						var setTime = sendTimeList[i].sendDateTime;
					} else {
						var setTime = lastReminderTime;
					}

					console.log("setTime 3 hours : " + setTime);

					var numdays = commonFunctions.getHoursNumber(pauseTime, resumeDateTime, setTime, 1, sendTimeList[i].type, sendTimeList[i].isAdmin);

					Ti.API.info('3 Hours:: ', numdays);
					if (numdays > 0) {
						for (var j = 0; j < numdays; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
						}
					}
				} else if (sendTimeList[i].index === 2) {

					if (sendTimeList[i].isAdmin == 1) {
						var reminderValues = Ti.App.Properties.getObject('lastAdminReminderTime');
						if (reminderValues != null) {
							if (sendTimeList[i].type == "survey") {
								var lastReminderTime = reminderValues.sixHourSurvey;
							} else {
								var lastReminderTime = reminderValues.sixHourCog;

							}
						}

					} else {
						var reminderValues = Ti.App.Properties.getObject('lastLocalReminderTime');
						if (reminderValues != null) {
							if (sendTimeList[i].type == "survey") {
								var lastReminderTime = reminderValues.sixHourSurvey;
							} else {
								var lastReminderTime = reminderValues.sixHourCog;

							}
						}
					}
					if (lastReminderTime == "") {
						var setTime = sendTimeList[i].sendDateTime;
					} else {
						var setTime = lastReminderTime;
					}

					var numdays = commonFunctions.getHoursNumber(pauseTime, resumeDateTime, setTime, 2, sendTimeList[i].type, sendTimeList[i].isAdmin);

					Ti.API.info('6 Hours:: ', numdays);
					if (numdays > 0) {
						for (var j = 0; j < numdays; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
						}
					}
				} else if (sendTimeList[i].index === 3) {

					if (sendTimeList[i].isAdmin == 1) {
						var reminderValues = Ti.App.Properties.getObject('lastAdminReminderTime');
						if (reminderValues != null) {
							if (sendTimeList[i].type == "survey") {
								var lastReminderTime = reminderValues.twelveHourSurvey;
							} else {
								var lastReminderTime = reminderValues.twelveHourCog;

							}
						}

					} else {
						var reminderValues = Ti.App.Properties.getObject('lastLocalReminderTime');
						if (reminderValues != null) {
							if (sendTimeList[i].type == "survey") {
								var lastReminderTime = reminderValues.twelveHourSurvey;
							} else {
								var lastReminderTime = reminderValues.twelveHourCog;

							}
						}
					}
					if (lastReminderTime == "") {
						var setTime = sendTimeList[i].sendDateTime;
					} else {
						var setTime = lastReminderTime;
					}

					var numdays = commonFunctions.getHoursNumber(pauseTime, resumeDateTime, setTime, 3, sendTimeList[i].type, sendTimeList[i].isAdmin);

					Ti.API.info('12 Hours:: ', numdays);
					if (numdays > 0) {
						for (var j = 0; j < numdays; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
						}
					}
				} else if (sendTimeList[i].index === 4) {

					var setTime = sendTimeList[i].sendDateTime;
					var dayName = commonFunctions.getDayName(setTime);
             Ti.API.info('setTime : ',setTime,dayName,sendTimeList[i].testName);
					var numdays = commonFunctions.getDailyDays(pauseTime, resumeDateTime, dayName, setTime);
					Ti.API.info('DAILY:: ', numdays);
					//alert("numdays : "+numdays);
					if (numdays > 0) {
						for (var j = 0; j < numdays; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
						}
					}
				} else if (sendTimeList[i].index === 5) {
					var setTime = sendTimeList[i].sendDateTime;
					//alert("setTime : " + setTime);
					var dayName = commonFunctions.getDayName(setTime);
					var biWeekCount = commonFunctions.getWeekDays(pauseTime, resumeDateTime, dayName, setTime);
					Ti.API.info('count:: ', biWeekCount);
					//alert("biWeekCount : " + biWeekCount);
					if (biWeekCount > 0) {
						for (var j = 0; j < biWeekCount; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
						}

					}
				} else if (sendTimeList[i].index === 6) {
					var setTime = sendTimeList[i].sendDateTime;
					var dayName = commonFunctions.getDayName(setTime);
					var triWeekCount = commonFunctions.getWeekDays(pauseTime, resumeDateTime, dayName, setTime);
					Ti.API.info('tricount:: ', triWeekCount);
					if (triWeekCount > 0) {
						for (var j = 0; j < triWeekCount; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
						}

					}
				} else if (sendTimeList[i].index === 7) {
					var setTime = sendTimeList[i].sendDateTime;
					//alert("setTime : " + setTime);
					var dayName = commonFunctions.getDayName(setTime);
					var WeekCount = commonFunctions.getWeekDays(pauseTime, resumeDateTime, dayName, setTime);
					Ti.API.info('weekcount:: ', WeekCount);
					if (WeekCount > 0) {
						for (var j = 0; j < WeekCount; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
						}

					}
				} else if (sendTimeList[i].index === 8) {
					var setTime = sendTimeList[i].sendDateTime;
					var monthDayCount = commonFunctions.getMonthDays(pauseTime, resumeDateTime, setTime);
					Ti.API.info('monthDayCount:: ', monthDayCount);
					if (monthDayCount > 0) {
						for (var j = 0; j < monthDayCount; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
						}

					}
				} else if (sendTimeList[i].index === 9) {
					var setTime = sendTimeList[i].sendDateTime;
					//alert("setTime : " + setTime);
					var monthDayCount = commonFunctions.getMonthDaysNew(pauseTime, resumeDateTime, setTime);
					Ti.API.info('monthDayCount:: ', monthDayCount);
					if (monthDayCount > 0) {
						for (var j = 0; j < monthDayCount; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
						}

					}
				} else if (sendTimeList[i].index === 11) {

					var setTime = sendTimeList[i].sendDateTime;
					var dayName = commonFunctions.getDayName(setTime);

					var from = new Date(pauseTime);
					var to = new Date(resumeDateTime);
					var notTime = new Date(setTime);
					Ti.API.info('from:: ', from);
					Ti.API.info('to:: ', to);
					Ti.API.info('notTime:: ', notTime);

					if (notTime > from && notTime < to)
						commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
				}
			}
			commonFunctions.setLastReminderTime();
			reminderAlerts();


		}
	}
	var pausedDateTime = new Date();
	Ti.API.info('pausedDateTime:: ', pausedDateTime);
	Ti.App.Properties.setObject('pausedTime', pausedDateTime);
}

/**
 * Function to list the value set in the properties.
 */
function reminderAlerts() {
	try {
		var arrayToList = commonDB.getNotificationAlerts();
		console.log("arrayToList");
		console.log(arrayToList);
		loadingAlerts(arrayToList);
	} catch(ex) {
		commonFunctions.handleException("home", "reminderAlerts", ex);
	}
}

Ti.App.addEventListener('notificationRefresh', onNotificationRefresh);
function onNotificationRefresh() {
	try {
		Ti.API.info('Notification refresh');

		reminderAlerts();
	} catch(ex) {
		commonFunctions.handleException("home", "onNotificationRefresh", ex);
	}
}

if (OS_IOS) {
	Ti.App.addEventListener('resumed', onResume);
} else {
	Ti.API.info('OPEN');
	var activity = $.home.activity;
	activity.onRestart = function() {
		Ti.API.info("HOME START ANDROID");
		Ti.App.fireEvent("app:android_resume");
	};
	activity.onStop = function() {
		Ti.API.info("HOME STOP ANDROID");
		Ti.App.fireEvent("app:android_pause");
	};
	Ti.App.addEventListener('app:android_resume', onResume);
}

/**
 * Function to handle on resuming the app.
 */
function onResume() {
	try {

		Ti.API.info('resumed');
		if (Ti.Network.online) {
			serviceManager.getProtocolDate(onGetProtocolDateSuccess,onGetProtocolDateFailure);
		}
		Alloy.Globals.ISPAUSED = false;
		var credentials = Alloy.Globals.getCredentials();
		if (credentials.userId == null || credentials.userId == "" || credentials.userId == 0) {
			return;
		}
		var showPopUp = false;
		var MonthlyAlertTime = Ti.App.Properties.getString("monthlyPopUp", "");
		Ti.API.info('MonthlyAlertTime : ', MonthlyAlertTime);

		if (MonthlyAlertTime != "") {
			var curTime = new Date().toUTCString();
			var timeDiff = Math.abs(new Date(curTime).getTime() - new Date(MonthlyAlertTime).getTime());
			var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
			if (diffDays >= 30) {
				showPopUp = true;
			}

		} else {
			showPopUp = true;
		}

		if (showPopUp == true) {
			//commonFunctions.getMonthlyPopUp();
		}
		var proto=	Ti.App.Properties.getString('isProtocolActivated');
		if(proto==1 || proto=="1"){
			commonFunctions.protoTypeReminder();
		}
		if (OS_IOS)
			locationupdatemodule.stopUpdatingLocation();

		Ti.API.info('credentials : ', credentials);
		//	serviceManager.getUserProfile(credentials.userId, getUserProfileSuccess, getUserProfileFailure);

		if (openFromNotificationClick == false) {
			insertReminderToDB();
		}

		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow.windowName == "healthDataScreen") {
			Ti.App.fireEvent("healthDataRefresh");
		} else if (parentWindow.windowName == "home") {
			Ti.App.fireEvent("notificationRefresh");
		} else if (parentWindow != null && parentWindow.windowName === "preventIntroScreen") {
			parentWindow.window.refreshPreventScreen();
		}

		//Ti.App.fireEvent("getCurrentLocation");
		openFromNotificationClick = false;
		checkAdminNotification();
		
		var currentDay = new Date().getDate();
		var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
	 	if(spinInfo.spinDate != currentDay){
	 		var dayDiff = parseInt(currentDay) - parseInt(spinInfo.spinDate);
	 		if(dayDiff > 1) {
	 			spinInfo.dayStreaks = 0;
	 		}
	 		spinInfo.noOFSpins = 0;
	 		Ti.App.Properties.setObject('spinnerInfo', spinInfo);
	 	}
	} catch(ex) {
		commonFunctions.handleException("home", "onResume", ex);
	}
}
/**
 * Protocol date success
 */
function onGetProtocolDateSuccess(e) {
	try {
	
		var response = JSON.parse(e.data);
		Ti.API.info('success of protocol date ************',response);
		var protoDate=new Date(response.ProtocolDate).toString();
		Ti.API.info('proDate ++++',protoDate);
		var previousValue=Ti.App.Properties.getString("initialTime");
		if(previousValue!=protoDate){
			Ti.App.Properties.setString("initialTime",protoDate);
		Ti.App.Properties.setString("memoryTime",protoDate);
		}
	} catch(ex) {
		commonFunctions.handleException("home", "getProtocolDate", ex);
	}
};
/**
 * Protocol date success error api call
 */
function onGetProtocolDateFailure(e) {
	
 };

function getUserProfileSuccess(e) {

}

function getUserProfileFailure(e) {

}

function getSheduleSettingsSuccess(e) {
	try {

		var response = JSON.parse(e.data);
		Ti.API.info('***getSheduleSettingsSuccess****  ', JSON.stringify(response));

		if (response.ErrorCode == 0) {

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
			Ti.API.info('*****updateShedules****');
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
						//preSurveyTextArray.push(commonDB.getSurveyName(preSurveyArray[i]));

					};
					surveyReminder.surveyId = tempPrevSurveyId;
					surveyReminder.surveyText = preSurveyTextArray;
					surveyReminder.currentSurvey = 0;
					Ti.API.info('Save surveyReminder : ', surveyReminder);
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
					Ti.API.info('Save surveyReminder : ', coginitionReminder);
					Ti.App.Properties.setObject("coginitionReminder", coginitionReminder);

				}

			}
			if (OS_IOS) {
				Ti.App.iOS.cancelAllLocalNotifications();
				//Ti.App.iOS.UserNotificationCenter.removeAllPendingNotifications;
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
				Ti.API.info('symptom survey....');
				
			}
			if (response.Data.CognTestRepeatID >= 0 && response.Data.PrefferedCognitions != "") {
				var formateTime = commonFunctions.getTwelveHrFormatTime(cognitionTime);
				Ti.API.info('congnition test....');
			}

		}

	} catch(ex) {
		commonFunctions.handleException("home", "getSheduleSettingsSuccess", ex);
	}

}

function cancelMultipleAlarm(requestcodeArray) {
	notificationManager.cancelAllAlarm();
}

function getSheduleSettingsFailure(e) {
	Ti.API.info('***getSheduleSettingsFailure****  ', JSON.stringify(e));
	commonFunctions.closeActivityIndicator();

}

function sendLocalNotification(index, time, alertBody, type, seconds) {
	try {

		var repeatMode = "";
		var sendDateTime = "";
		var notificationArray = [];
		var userInfo = {
			"type" : type,
			"testId" : 0,
			"testName" : 0,
			"isAdmin" : 0
		};
		var timeForLocal = commonFunctions.ConvertTwentyFourHourForLocal(time);
		Ti.API.info('TIME FOR LOCAL:: ', timeForLocal);
		if (index === 0) {
			if (OS_IOS) {
				//var notify = require('zco.alarmmanager');
				//notify.cancelAllNotification();
				var userInfo1 = {
					'isTextMessage' : false,
					"type" : type,
					"testId" : 0,
					"testName" : 0,
					"isAdmin" : 0
				};
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				notify.sheduleNotification(60, alertBody, "default", userInfo1);
			} else {
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				var setTime = commonFunctions.formatTimeForAndroidHours(new Date(), seconds, 1);
				notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotForNewModule(time, new Date(), seconds), 3600000, type, 0, 0, 0, 0);
			}
			setProperties(type, alertBody, new Date(), 0, 0, 0, 0, 0,0);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 1) {
			var hoursArray = Alloy.Globals.threeHoursRepeatTimeArray;
			for (var i = 0; i < hoursArray.length; i++) {
				timeForLocal = commonFunctions.ConvertTwentyFourHourForLocal(hoursArray[i]);
				setLocalNotifcationAlaram(timeForLocal, userInfo, index, hoursArray[i], alertBody, type, seconds, Alloy.Globals.twentyFourHoursIntervalInMilliSeconds);
			}
		} else if (index === 2) {
			var hoursArray = Alloy.Globals.sixHoursRepeatTimeArray;
			for (var i = 0; i < hoursArray.length; i++) {
				timeForLocal = commonFunctions.ConvertTwentyFourHourForLocal(hoursArray[i]);
				setLocalNotifcationAlaram(timeForLocal, userInfo, index, hoursArray[i], alertBody, type, seconds, Alloy.Globals.twentyFourHoursIntervalInMilliSeconds);
			}
		} else if (index === 3) {
			var hoursArray = Alloy.Globals.tewelHoursRepeatTimeArray;
			for (var i = 0; i < hoursArray.length; i++) {
				timeForLocal = commonFunctions.ConvertTwentyFourHourForLocal(hoursArray[i]);
				setLocalNotifcationAlaram(timeForLocal, userInfo, index, hoursArray[i], alertBody, type, seconds, Alloy.Globals.twentyFourHoursIntervalInMilliSeconds);
			}
		} else if (index === 4) {
			if (OS_IOS) {
				repeatMode = "daily";
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				Ti.API.info('sendDateTime:: ', sendDateTime);
				notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
			} else {

				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				var setTime = commonFunctions.formatTimeForAndroidNot(time, new Date(), seconds);
				var currentDay=new Date();
				var tempDateTime=new Date(sendDateTime).getTime();
							var tempCurrentDateTime=new Date().getTime();
							if(tempDateTime<tempCurrentDateTime){
								
								currentDay.setDate(currentDay.getDate() + 1);
								sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, currentDay, seconds);
								 setTime = commonFunctions.formatTimeForAndroidNot(time, currentDay, seconds);
							}
				

				notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotForNewModule(time, currentDay, seconds),86400000, type, 0, 0, 0, 0);
			}
			setProperties(type, alertBody, sendDateTime, 4, 0, 0, 0, 0,0);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 5) {
			var weekDay = commonFunctions.getDayName(new Date());
			Ti.API.info('weekDay:: ', weekDay);
			var getFormattedDay = commonFunctions.getBiWeekDays(weekDay,new Date(), false);
			Ti.API.info('getFormattedDay:: ', getFormattedDay);
			var result = getFormattedDay.split('/');
			if (result.length > 0) {
				for (var i = 0; i < result.length; i++) {
					if (result[i] != "") {
						var notificationDate =new Date(result[i]);
						if (OS_IOS) {
							repeatMode = "weekly";
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
						} else {
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							var tempDateTime=new Date(sendDateTime).getTime();
							var tempCurrentDateTime=new Date().getTime();
							if(tempDateTime<tempCurrentDateTime){
								notificationDate.setDate(notificationDate.getDate() + 7);
								sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							}
							var setTime = commonFunctions.formatTimeForAndroidNot(time, notificationDate, seconds);
							notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotForNewModule(time, notificationDate, seconds), 604800000, type, 0, 0, 0, 0);
						}
						setProperties(type, alertBody, sendDateTime, 5, 0, 0, 0, 0,0);
					}
				}
				Ti.App.Properties.setObject('sendTime', arrayItems);
			}
		} else if (index === 6) {
			repeatMode = "weekly";
			var weekDay = commonFunctions.getDayName(new Date());
			Ti.API.info('weekDayTRI:: ', weekDay);
			var getFormattedDay = commonFunctions.getTriWeekDays(weekDay, new Date(), false);
			Ti.API.info('getFormattedTRiDay:: ', getFormattedDay);
			var result = getFormattedDay.split('/');
			if (result.length > 0) {
				for (var i = 0; i < result.length; i++) {
					if (result[i] != "") {
						var notificationDate =new Date(result[i]);						
						if (OS_IOS) {
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
						} else {
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							var tempDateTime=new Date(sendDateTime).getTime();
							var tempCurrentDateTime=new Date().getTime();
							if(tempDateTime<tempCurrentDateTime){
								notificationDate.setDate(notificationDate.getDate() + 7);
								sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							}
							var setTime = commonFunctions.formatTimeForAndroidNot(time, notificationDate, seconds);
							notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotForNewModule(time, notificationDate, seconds), 604800000, type, 0, 0, 0, 0);
						}
						setProperties(type, alertBody, sendDateTime, 6, 0, 0, 0, 0,0);
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
				
				var currentDay=new Date();
				var tempDateTime=new Date(sendDateTime).getTime();
							var tempCurrentDateTime=new Date().getTime();
							if(tempDateTime<tempCurrentDateTime){
								Ti.API.info('enter tempdate less');
								currentDay.setDate(currentDay.getDate() + 7);
								sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, currentDay, seconds);
								 setTime = commonFunctions.formatTimeForAndroidNot(time, currentDay, seconds);
							}
				
				notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotForNewModule(time, currentDay, seconds), 604800000, type, 0, 0, 0, 0);
			}
			setProperties(type, alertBody, sendDateTime, 7, 0, 0, 0, 0,0);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 8) {
			repeatMode = "monthly";
			var monthDays = commonFunctions.getBiMonthDays(new Date(), false);
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
							notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotForNewModule(time, notificationDate, seconds), 2592000000, type, 0, 0, 0, 0);
						}
					}
				}
				setProperties(type, alertBody, sendDateTime, 8, 0, 0, 0, 0,0);
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
				var currentDay=new Date();
				var tempDateTime=new Date(sendDateTime).getTime();
							var tempCurrentDateTime=new Date().getTime();
							if(tempDateTime<tempCurrentDateTime){
								
								currentDay.setDate(currentDay.getDate() + 30);
								sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, currentDay, seconds);
								 setTime = commonFunctions.formatTimeForAndroidNot(time, currentDay, seconds);
							}
				notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotForNewModule(time, currentDay, seconds), 2592000000, type, 0, 0, 0, 0);
			}
			setProperties(type, alertBody, sendDateTime, 9, 0, 0, 0, 0,0);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		}
	} catch(ex) {
		commonFunctions.handleException("settings", "sendLocalNotification", ex);
	}
}

/**
 * Function to set local notification alarm
 */
function setLocalNotifcationAlaram(timeForLocal, userInfo, index, time, alertBody, type, seconds, androidTimeIntervalInMilliSeconds) {

	if (OS_IOS) {
		var repeatMode = "daily";
		var sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
		Ti.API.info('sendDateTime:: ', sendDateTime);
		notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
	} else {
		var sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
		var setTime = commonFunctions.formatTimeForAndroidNot(time, new Date(), seconds);
		var curDayFormateTime = new Date(sendDateTime);
		var curTime = new Date();
		if (curDayFormateTime.getTime() < curTime.getTime()) {
			curDayFormateTime.setDate(curDayFormateTime.getDate() + 1);
			//sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, curDayFormateTime, seconds);
			setTime = commonFunctions.formatTimeForAndroidNot(time, curDayFormateTime, seconds);
		}
		Ti.API.info('Set Android Notification : ',setTime,androidTimeIntervalInMilliSeconds);
		notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotForNewModule(time, curDayFormateTime, seconds), androidTimeIntervalInMilliSeconds, type, 0, 0, 0, 0);
	}
	setProperties(type, alertBody, sendDateTime, parseInt(4), 0, 0, 0, 0,0);
	Ti.App.Properties.setObject('sendTime', arrayItems);
}

/**
 * Function to set admin notifications
 */
function setAdminNotifications(index, time, alertBody, type, seconds, testId, version, curDayFormateTime, testName, timeForLocal,batchID) {
	try {
var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
		var repeatMode = "";
		var sendDateTime = "";
		var notificationArray = [];
		var userInfo = {
			"type" : type,
			"testId" : testId,
			"version" : version,
			"testId" : testId,
			"testName" : testName,
			"isAdmin" : 1,
			"repeatID" : index,
			"batchID":batchID
		};

		
		if (index === 0) {
			if (OS_IOS) {
				//var notify = require('zco.alarmmanager');
				//notify.cancelAllNotification();
				var userInfo1 = {
					'isTextMessage' : false,
					"type" : type,
					"testId" : testId,
					"version" : version,
					"testId" : testId,
					"testName" : testName,
					"isAdmin" : 1,
					"batchID":batchID
				};
				sendDateTime = time;

				notify.sheduleNotification(60, alertBody, "default", userInfo1);
			} else {
				sendDateTime = time;
				var setTime = commonFunctions.formatTimeForAndroidHours(new Date(), seconds, 1);
				notificationManager.scheduleAndroidNotification(alertBody, setTime, 3600000, type, version, testId, testName, 1);
			}
			spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
			setProperties(type, alertBody, new Date(), 0, version, testId, testName, 1,batchID);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 1) {
			var hoursArray = Alloy.Globals.threeHoursRepeatTimeArray;
			Ti.API.info('hours array',hoursArray);
			for (var i = 0; i < hoursArray.length; i++) {
				var timeForServer = commonFunctions.ConvertTwentyFourHourForLocal(hoursArray[i]);
				Ti.API.info('timeForServer',timeForServer);
				setServerNotificationAlaram(userInfo, index, timeForServer, alertBody, type, seconds, testId, version, curDayFormateTime, testName, timeForLocal, Alloy.Globals.threeHoursIntervalInMilliSeconds,batchID);
			
			}
			spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 5;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
		} else if (index === 2) {
			var hoursArray = Alloy.Globals.sixHoursRepeatTimeArray;
			for (var i = 0; i < hoursArray.length; i++) {
				var timeForServer = commonFunctions.ConvertTwentyFourHourForLocal(hoursArray[i]);
				setServerNotificationAlaram(userInfo, index, timeForServer, alertBody, type, seconds, testId, version, curDayFormateTime, testName, timeForLocal, Alloy.Globals.sixHoursIntervalInMilliSeconds,batchID);
			}
			spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 3;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
		} else if (index === 3) {
			var hoursArray = Alloy.Globals.tewelHoursRepeatTimeArray;
			for (var i = 0; i < hoursArray.length; i++) {
				var timeForServer = commonFunctions.ConvertTwentyFourHourForLocal(hoursArray[i]);
				setServerNotificationAlaram(userInfo, index, timeForServer, alertBody, type, seconds, testId, version, curDayFormateTime, testName, timeForLocal, Alloy.Globals.tewelHoursIntervalInMilliSeconds,batchID);
			}
			spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 2;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
		} else if (index === 4) {
			if (OS_IOS) {
				repeatMode = "daily";
				sendDateTime = time;
				Ti.API.info('curDayFormateTime:: ', curDayFormateTime);
				var curTime = new Date().getTime();
				var remindtime = sendDateTime.getTime();
				var curDayTime = curDayFormateTime.getTime();
				Ti.API.info('remindtime : ', remindtime, " curTime : ", curTime, " curDayTime : ", curDayTime);
				if (remindtime < curTime) {
					if (curDayTime < curTime) {
						curDayFormateTime.setDate(curDayFormateTime.getDate() + 1);
					}
					sendDateTime = curDayFormateTime;
				}
				Ti.API.info('Final Date for Daily alarm : ', sendDateTime);
				//alert("sendDateTime : " + sendDateTime);
				notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
			} else {
				sendDateTime = time;
				var curTime = new Date().getTime();
				var remindtime = sendDateTime.getTime();
				var curDayTime = curDayFormateTime.getTime();
				Ti.API.info('remindtime : ', remindtime, " curTime : ", curTime, " curDayTime : ", curDayTime);
				//var expectedDate = new Date();
				if (remindtime < curTime) {
					if (curDayTime < curTime) {
						curDayFormateTime.setDate(curDayFormateTime.getDate() + 1);
						//expectedDate.setDate(expectedDate.getDate() + 1);
					}
					sendDateTime = curDayFormateTime;
				}
				var setTime = commonFunctions.formatTimeForAndroidNotNew(timeForLocal, sendDateTime, seconds);
				Ti.API.info('senddatetime ',sendDateTime,timeForLocal);
				Ti.API.info('converetedsndtime',commonFunctions.formatTimeForAndroidNotNewChanged(timeForLocal, sendDateTime, seconds));
				notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotNewChanged(timeForLocal, sendDateTime, seconds), 86400000, type, version, testId, testName, 1);
			}
			spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
			setProperties(type, alertBody, sendDateTime, 4, version, testId, testName, 1,batchID);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 5) {
			sendDateTime = time;
			Ti.API.info('sendDateTime : ', sendDateTime,curDayFormateTime);
			var weekDay = commonFunctions.getDayName(sendDateTime);
			Ti.API.info('weekDay:: ', weekDay);
			var getFormattedDay = commonFunctions.getBiWeekDays(weekDay,sendDateTime, true);
			Ti.API.info('getFormattedDay:: ', getFormattedDay);
			var result = getFormattedDay.split('/');
			if (result.length > 0) {
				for (var i = 0; i < result.length; i++) {
					if (result[i] != "") {
						var notificationDate =new Date(result[i]);
						if (OS_IOS) {
							repeatMode = "weekly";
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							//sendDateTime = time;

							notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
						} else {
							//sendDateTime = time;
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							var tempDateTime=new Date(sendDateTime).getTime();
							var tempCurrentDateTime=new Date().getTime();
							if(tempDateTime<tempCurrentDateTime){
								var diffrence=tempCurrentDateTime-tempDateTime;
								var differnceDays=parseInt(Math.floor(diffrence/(1000*60*60*24)));
								var noOfDays=parseInt((differnceDays/7)+1);
								Ti.API.info('noofdays',noOfDays);
								Ti.API.info('notificationDate',notificationDate);
								var differenceMilisecnds=7*noOfDays*24*60*60*1000;
								notificationDate.setTime(notificationDate.getTime() + differenceMilisecnds);
								Ti.API.info('sendDateTime *****',sendDateTime);
								sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
								Ti.API.info('sendDateTime *****',sendDateTime);
							}
							var setTime = commonFunctions.formatTimeForAndroidNotNew(timeForLocal, notificationDate, seconds);
							notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotNewChanged(timeForLocal, notificationDate, seconds), 604800000, type, version, testId, testName, 1);
						}

						setProperties(type, alertBody, sendDateTime, 5, version, testId, testName, 1,batchID);
					}
				}
				Ti.App.Properties.setObject('sendTime', arrayItems);
			}
		} else if (index === 6) {
			sendDateTime = time;
			repeatMode = "weekly";
			var weekDay = commonFunctions.getDayName(sendDateTime);
			Ti.API.info('weekDayTRI:: ', weekDay);
			var getFormattedDay = commonFunctions.getTriWeekDays(weekDay,sendDateTime,true);
			Ti.API.info('getFormattedTRiDay:: ', getFormattedDay);
			var result = getFormattedDay.split('/');
			if (result.length > 0) {
				for (var i = 0; i < result.length; i++) {
					if (result[i] != "") {
						var notificationDate =new Date(result[i]);
						if (OS_IOS) {
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							//sendDateTime = time;
							notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
						} else {
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							Ti.API.info('sendDateTime',sendDateTime);
							var tempDateTime=new Date(sendDateTime).getTime();
							var tempCurrentDateTime=new Date().getTime();
							Ti.API.info('tempDateTime',tempDateTime);
							Ti.API.info('tempCurrentDateTime',tempCurrentDateTime);
							if(tempDateTime<tempCurrentDateTime){
								var diffrence=tempCurrentDateTime-tempDateTime;
								var differnceDays=parseInt(Math.floor(diffrence/(1000*60*60*24)));
								var noOfDays=parseInt((differnceDays/7)+1);
								Ti.API.info('noofdays',noOfDays);
								Ti.API.info('notificationDate',notificationDate);
								var differenceMilisecnds=7*noOfDays*24*60*60*1000;
								notificationDate.setTime(notificationDate.getTime() + differenceMilisecnds);
								Ti.API.info('sendDateTime *****',sendDateTime);
								sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
								Ti.API.info('sendDateTime *****',sendDateTime);
							}
							Ti.API.info('notification date is',notificationDate);
							//sendDateTime = time;
							var setTime = commonFunctions.formatTimeForAndroidNotNew(timeForLocal, notificationDate, seconds);
							notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotNewChanged(timeForLocal, notificationDate, seconds),604800000, type, version, testId, testName, 1);
						}
						setProperties(type, alertBody, sendDateTime, 6, version, testId, testName, 1,batchID);
					}
				}
				Ti.App.Properties.setObject('sendTime', arrayItems);
			}
		} else if (index === 7) {
			if (OS_IOS) {
				repeatMode = "weekly";
				sendDateTime = time;

				var curTime = new Date().getTime();
				var remindtime = sendDateTime.getTime();
				var weekDay = commonFunctions.getDayName(sendDateTime);
				var currentDayLabel = commonFunctions.getDayName(new Date());
				if(weekDay == currentDayLabel){
					spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
				}
				var curDayTime = curDayFormateTime.getTime();
				Ti.API.info('remindtime : ', remindtime, " curTime : ", curTime, " curDayTime : ", curDayTime);
				if (remindtime < curTime) {

					while (remindtime < curTime) {
						sendDateTime.setDate(sendDateTime.getDate() + 7);
						curTime = new Date().getTime();
						remindtime = sendDateTime.getTime();
					}

				}
				Ti.API.info('Final Date Weekly : ', sendDateTime);
				notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
			} else {
				sendDateTime = time;
				var curTime = new Date().getTime();
				var remindtime = sendDateTime.getTime();
				var curDayTime = curDayFormateTime.getTime();
				var weekDay = commonFunctions.getDayName(sendDateTime);
				var currentDayLabel = commonFunctions.getDayName(new Date());
				if(weekDay == currentDayLabel){
					spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
				}
				Ti.API.info('remindtime : ', remindtime, " curTime : ", curTime, " curDayTime : ", curDayTime);
				//var expectedDate = new Date();
				if (remindtime < curTime) {

					while (remindtime < curTime) {
						sendDateTime.setDate(sendDateTime.getDate() + 7);
						curTime = new Date().getTime();
						remindtime = sendDateTime.getTime();
						//expectedDate.setDate(expectedDate.getDate() + 7);
					}

				}
				Ti.API.info('Final Date Weekly : ', sendDateTime);
				var setTime = commonFunctions.formatTimeForAndroidNotNew(timeForLocal, sendDateTime, seconds);
				notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotNewChanged(timeForLocal, sendDateTime, seconds), 604800000, type, version, testId, testName, 1);
			}
			setProperties(type, alertBody, sendDateTime, 7, version, testId, testName, 1,batchID);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 8) {
			sendDateTime = time;
			repeatMode = "monthly";
			var monthDays = commonFunctions.getBiMonthDays(sendDateTime, true);
			Ti.API.info('monthDays:: ', monthDays);
			var resultDays = monthDays.split('/');
			if (resultDays.length > 0) {
				for (var i = 0; i < resultDays.length; i++) {
					if (resultDays[i] != "") {
						var notificationDate = resultDays[i];
						if (OS_IOS) {
							//sendDateTime = time;
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
						} else {
							//	sendDateTime = time;
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							var setTime = commonFunctions.formatTimeForAndroidNotNew(timeForLocal, notificationDate, seconds);
							notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotNewChanged(timeForLocal, notificationDate, seconds), 2592000000, type, version, testId, testName, 1);
						}
					}
				}
				setProperties(type, alertBody, sendDateTime, 8, version, testId, testName, 1,batchID);
				Ti.App.Properties.setObject('sendTime', arrayItems);
			}
		} else if (index === 9) {

			if (OS_IOS) {
				repeatMode = "monthly";
				sendDateTime = time;
				var curTime = new Date().getTime();
				var remindtime = sendDateTime.getTime();
				var sendDate = sendDateTime.getDate();
				var currentDate = new Date().getDate();
				if(sendDate == currentDate){
					spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
					Ti.App.Properties.setObject('spinnerInfo', spinInfo);
				}
				Ti.API.info('remindtime : ', remindtime, " curTime : ", curTime);
				if (remindtime < curTime) {

					while (remindtime < curTime) {
						sendDateTime.setDate(sendDateTime.getDate() + 30);
						curTime = new Date().getTime();
						remindtime = sendDateTime.getTime();

					}

				}

				notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
			} else {
				sendDateTime = time;
				var curTime = new Date().getTime();
				var remindtime = sendDateTime.getTime();
				var sendDate = sendDateTime.getDate();
				var currentDate = new Date().getDate();
				if(sendDate == currentDate){
					spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
					Ti.App.Properties.setObject('spinnerInfo', spinInfo);
				}
				//var expectedDate = new Date();
				Ti.API.info('remindtime : ', remindtime, " curTime : ", curTime);
				if (remindtime < curTime) {

					while (remindtime < curTime) {
						sendDateTime.setDate(sendDateTime.getDate() + 30);
						curTime = new Date().getTime();
						remindtime = sendDateTime.getTime();
						//expectedDate.setDate(expectedDate.getDate() + 30);
					}

				}
				var setTime = commonFunctions.formatTimeForAndroidNotNew(timeForLocal, sendDateTime, seconds);
				notificationManager.formatTimeForAndroidNotNewChanged(alertBody, commonFunctions.formatTimeForAndroidNotForNewModule(timeForLocal, sendDateTime, seconds), 2592000000, type, version, testId, testName, 1);
			}
			setProperties(type, alertBody, sendDateTime, 9, version, testId, testName, 1,batchID);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 10) {
			spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
					Ti.App.Properties.setObject('spinnerInfo', spinInfo);
			setServerNotificationAlaram(userInfo, index, time, alertBody, type, seconds, testId, version, curDayFormateTime, testName, timeForLocal, Alloy.Globals.twentyFourHoursIntervalInMilliSeconds,batchID);
		} else if (index === 11) {
			setServerNotificationAlaram(userInfo, index, time, alertBody, type, seconds, testId, version, curDayFormateTime, testName, timeForLocal, Alloy.Globals.twentyFourHoursIntervalInMilliSeconds,batchID);
		}
	} catch(ex) {
		commonFunctions.handleException("home", "setAdminNotifications", ex);
	}
}

function setServerNotificationAlaram(userInfo, index, time, alertBody, type, seconds, testId, version, curDayFormateTime, testName, timeForLocal, androidTimeIntervalInMilliSeconds,batchID) {
	var sendDateTime = time;
	Ti.API.info('curDayFormateTime:: ', curDayFormateTime);
	var curTime = new Date().getTime();
	var remindtime = sendDateTime.getTime();
	var curDayTime = curDayFormateTime.getTime();
	Ti.API.info('remindtime : ', remindtime, " curTime : ", curTime, " curDayTime : ", curDayTime);
	
	Ti.API.info('Final Date for Daily alarm : ', sendDateTime);

	if (OS_IOS) {
		if (index === 11) {
			console.log("REPEAT NONE");
			Ti.API.info('curDayFormateTime:: ', curDayFormateTime);
			Ti.API.info('remindtime : ', remindtime, " curTime : ", curTime, " curDayTime : ", curDayTime);
			notificationManager.setOneTimeNotification(alertBody, userInfo, sendDateTime);
		}

	} else {

		var setTime = commonFunctions.formatTimeForAndroidNotNew(timeForLocal, sendDateTime, seconds);
							var tempDateTime=new Date(sendDateTime).getTime();
							var tempCurrentDateTime=new Date().getTime();
							Ti.API.info('tempDateTime',tempDateTime);
							Ti.API.info('tempCurrentDateTime',tempCurrentDateTime);
							if(tempDateTime<tempCurrentDateTime){
								return;
							
							}
		if (index === 11)
			notificationManager.scheduleAndroidOneTimeNotification(alertBody, commonFunctions.formatTimeForAndroidNotNewChanged(timeForLocal, sendDateTime, seconds), androidTimeIntervalInMilliSeconds, type, version, testId, testName, 1);

	}
	setProperties(type, alertBody, sendDateTime, parseInt(index), version, testId, testName, 1,batchID);
	Ti.App.Properties.setObject('sendTime', arrayItems);
}

function setProperties(type, alertBody, sendDateTime, index, version, testId, testName, isAdmin,batchID) {
	try {
		var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
		var Items = {
			type : type,
			alertBody : alertBody,
			sendDateTime : sendDateTime,
			index : index,
			version : version,
			testId : testId,
			testName : testName,
			isAdmin : isAdmin,
			batchID:batchID
		};
		
		var myDate = new Date(Items.sendDateTime).getDate();
		var curDate=new Date().getDate();
		Ti.API.info('*** myDate = '+myDate);
		Ti.API.info('*** curDate = '+curDate);
		
		Ti.API.info(' *** numOfRecords = '+spinInfo.lampRecords);
		
		arrayItems.push(Items);
		Ti.API.info('*** arrayItems = '+JSON.stringify(arrayItems));
	} catch(ex) {
		commonFunctions.handleException("settings", "setProperties", ex);
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
				insertReminderToDB();
				if (e.userInfo.repeatID == 11)
					openFromNotificationClick = false;

				reminderAlerts();
				Ti.App.fireEvent("notificationRefresh");
			} else {
				
				var currentTime = new Date(e.date);
				Ti.API.info('********** Notification currentTime ******* '+currentTime);
		var hours = currentTime.getHours();
		var minutes = currentTime.getMinutes();
		var seconds = currentTime.getSeconds();
		var milliSeconds = currentTime.getMilliseconds();
		var month = currentTime.getMonth() + 1;
		var day = currentTime.getDate();
		var year = currentTime.getFullYear();

		if (month.toString().length == 1) {
			month = "0" + month;
		}
		if (day.toString().length == 1) {
			day = "0" + day;
		}
		hours = hours < 10 ? '0' + hours : hours;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		seconds = seconds < 10 ? '0' + seconds : seconds;
		milliSeconds = milliSeconds < 10 ? '0' + milliSeconds : milliSeconds;
		var formatedDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + ":" + milliSeconds;
		Ti.API.info('********** Notification formatedDate ******* '+formatedDate);		
				var testID = 0;
				var testName = "";
				insertReminderToDB();
				var isLocal = 1;
				if (e.userInfo.type === "survey") {

					if (e.userInfo.isAdmin == 1) {
					isLocal = 0;
						testID = e.userInfo.testId;
						testName = e.userInfo.testName;
					} else {
						var surveyReminder = Ti.App.Properties.getObject("surveyReminder");
						if (Ti.App.Properties.hasProperty("surveyReminder")) {
							var arrSurveyIDs = surveyReminder.surveyId;
							Ti.API.info('arrSurveyIDs : ', arrSurveyIDs);
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
					}
					if (OS_IOS) {
						commonDB.updateAlerts(testID);
					}

					Ti.API.info('notification click : ', testID, testName);
					Alloy.Globals.NAVIGATION_CONTROLLER.openFullScreenWindow('syptomSurveyNew', {
						'surveyID' : testID,
						'surveyName' : testName,
						'fromNotification' : true,
			
				"createdDate" : formatedDate,
				"isLocal" : isLocal
					});
					//Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('surveysList');
				}
				else if(e.userInfo.type === "Batch"){
					var surveyName = "";
		var batchId=e.userInfo.batchID;
		batchId=batchId.split(",");
		Ti.API.info('enter here in batch',batchId);
		var surveyId = batchId[0].trim().split(" ");
		Ti.API.info('surveyName', surveyId);
		if (surveyId[0] == "S") {
			surveyName = commonDB.getSurveyName(surveyId[1]);
		}
		Ti.API.info('testID',e.userInfo.testId);
		if (OS_IOS) {
						commonDB.updateBatchAlerts(e.userInfo.testId);
					}
		commonFunctions.navigateToWindow(batchId[0],e.userInfo.version,surveyName,surveyId[1],e.userInfo.testId, formatedDate );
		Alloy.Globals.BATCH_ARRAY=batchId;
		Ti.API.info('Alloy.Globals.BATCH_ARRAY values are:', Alloy.Globals.BATCH_ARRAY);
		
	}
				 else {
				 	var isLocal = 1;
					//Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionTestScreen');
					if (e.userInfo.isAdmin == 1) {
						isLocal = 0;
						testID = e.userInfo.testId;
						testName = e.userInfo.testName;
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
					}
					if (OS_IOS) {
						commonDB.updateAlerts(testID);
					}

					Ti.API.info('notification click : ', testID, testName);
					if (testID == 1) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackLevel', {
							"reminderVersion" : e.userInfo.version,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 2) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsB', {
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 3) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
							"isForward" : true,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 4) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
							"isForward" : false,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 5) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('simpleMemoryTask', {
							"reminderVersion" : e.userInfo.version,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 6) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('serial7STestScreen', {
							"reminderVersion" : e.userInfo.version,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 7) {
						//Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('catAndDogGame');
					} else if (testID == 8) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('figureCopyScreen', {
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 9) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('visualAssociation', {
							"reminderVersion" : e.userInfo.version,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 10) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
							"isForward" : true,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
						//Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest');
					} else if (testID == 13) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
							"isForward" : false,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
						//Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest');
					} else if (testID == 11) {
						Ti.API.info('********* OPen Cat n Dog Game ********' +formatedDate);
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('catAndDogGameNew', {
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 12) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('temporalOrder', {
							"reminderVersion" : e.userInfo.version,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 14) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackLevelNew', {
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 15) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsbNonOverlap', {
							"reminderVersion" : e.userInfo.version,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 16) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsBNew',{
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});				
					} else if (testID == 17) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsIntro', {
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 18) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsIntroB', {
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
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
		Alloy.Globals.NAVIGATION_CONTROLLER.closeAllWindows();
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('signin');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('newHomeScreen');
		if (OS_IOS) {
			Ti.App.iOS.cancelAllLocalNotifications();
			//Ti.App.iOS.UserNotificationCenter.removeAllPendingNotifications;

			notify.cancelAllNotification();
		} else {
			Alloy.Globals.REQUEST_CODE_ARRAY = [];
			if (Ti.App.Properties.getObject('requestCode') != null) {
				cancelMultipleAlarm(Ti.App.Properties.getObject('requestCode'));
				Ti.App.Properties.setObject('requestCode', null);
			}
		}
		Ti.App.Properties.setObject('sendTime', null);
		Ti.API.info('openWindow Signin');
		//Ti.App.removeEventListener('sessionTokenExpired', onSessionExpire);
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


$.footerView.on('clickLearn', function(e) {

	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('homeStaticPages');

});

$.footerView.on('clickAssess', function(e) {

	return;

});

$.footerView.on('clickManage', function(e) {
	if (OS_IOS) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scratchImageScreen');
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scratchTestScreen');
		setTimeout(function() {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scratchImageScreen');
		}, 5);
	}
});

$.footerView.on('clickPrevent', function(e) {

	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('preventIntroScreen');

});


function touchSt(e) {
	Ti.API.info('touchSt : ', JSON.stringify(e));
	Ti.API.info('e.itemIndex 1 : ', e.itemIndex);
	var item = $.notificationList.sections[0].getItemAt(e.itemIndex);
	if (item != null && item.listOuterView.right == '0dp') {

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
	} else if (item != null && item.listOuterView.right == '80dp') {
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

}

function checkUpdate() {
	var credentials = Alloy.Globals.getCredentials();
	serviceManager.getStatus(credentials.userId, getStatusSuccess, getStatusFailure);
}

function getStatusSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		Ti.API.info('getStatusSuccess : ', JSON.stringify(response));

		if (response.ErrorCode == 0) {
			Ti.App.Properties.setString('BlogsUpdate', response.BlogsUpdate);
			Ti.App.Properties.setString('TipsUpdate', response.TipsUpdate);
			var BlogsUpdate = Ti.App.Properties.getString("BlogsUpdate", "");
			var TipsUpdate = Ti.App.Properties.getString("TipsUpdate", "");
			if (BlogsUpdate == true || BlogsUpdate == "true" || TipsUpdate == true || TipsUpdate == "true") {
				$.footerView.setInfoIndicatorON();
			} else {
				$.footerView.setInfoIndicatorOFF();
			}

		}

	} catch(ex) {
		commonFunctions.handleException("home", "getStatusSuccess", ex);
	}
}

function getStatusFailure(e) {
	Ti.API.info('getStatusFailure : ', JSON.stringify(e));
}

function checkAdminNotification() {
	Ti.API.info('checkAdminNotification');
	var credentials = Alloy.Globals.getCredentials();

	if (Ti.App.Properties.hasProperty("appVersion")) {
		if (Ti.App.Properties.getString("appVersion") != Titanium.App.version) {
			Ti.App.Properties.setString('appVersion', Titanium.App.version);
			reSettingObjects();
		}
	} else {
		Ti.App.Properties.setString('appVersion', Titanium.App.version);
		reSettingObjects();
	}
	if (Ti.App.Properties.hasProperty("lastSyncDate") == true) {
		var lastSyncDate = Ti.App.Properties.getObject('lastSyncDate');
		var lastUpdateSurveyDate = lastSyncDate.LastUpdatedSurveyDate;
		var lastUpdateGameDate = lastSyncDate.LastUpdatedGameDate;

	} else {
		var lastSyncDate = {
			LastUpdatedSurveyDate : "",
			LastUpdatedGameDate : "",
		};
		Ti.App.Properties.setObject('lastSyncDate', lastSyncDate);
		var lastUpdateSurveyDate = "";
		var lastUpdateGameDate = "";
	}

	serviceManager.getSurveyAndGameShedule(credentials.userId, lastUpdateGameDate, lastUpdateSurveyDate, SurveyAndGameSheduleSuccess, SurveyAndGameSheduleFailure);

}

function reSettingObjects() {
	if (Ti.App.Properties.hasProperty("lastSyncDate"))
		Ti.App.Properties.removeProperty("lastSyncDate");

	var versionInfo = Ti.App.Properties.getObject('GameVersionNumber');
	if (versionInfo.Jewel == null) {
		var versionsInfo1 = {
			SimpleMemory : versionInfo.SimpleMemory,
			TemporalOrder : versionInfo.TemporalOrder,
			VisualAssociation : versionInfo.VisualAssociation,
			Serial7s : versionInfo.Serial7s,
			nBack : versionInfo.nBack,
			Jewel : 1
		};
		Ti.App.Properties.setObject('GameVersionNumber', versionsInfo1);
	}
	var credentials = Alloy.Globals.getCredentials();
	var jewelInfo = Ti.App.Properties.getObject(credentials.userId.toString());
	if (jewelInfo.jewelsTrailACurrentLevel == null) {
		var jewelInfo1 = {
			totalgamesTrailsA : jewelInfo.totalgamesTrailsA,
			totalgamesTrailsB : jewelInfo.totalgamesTrailsB,
			jewelsTrailACurrentLevel : 1,
			jewelsTrailBCurrentLevel : 1,
			jewelsTrailATotalDiamonds : 0,
			jewelsTrailBTotalDiamonds : 0,
			jewelsTrailBTotalShapes : 0,
			jewelsTrailAServerDiamonds : 0,
			jewelsTrailBServerDiamonds : 0,
			jewelsTrailBServerShapes : 0

		};
		Ti.App.Properties.setObject(credentials.userId.toString(), jewelInfo1);
	}

}

/**
 * SurveyAndGameSheduleSuccess function
 */
function SurveyAndGameSheduleSuccess(e) {

	Ti.API.info('SurveyAndGameSheduleSuccess *************** : ', JSON.stringify(e));
	var response = JSON.parse(e.data);
	Ti.App.Properties.setInt("ReminderClearInterval",response.ReminderClearInterval);
	var credentials = Alloy.Globals.getCredentials();
	if (response.ErrorCode == 0) {
		var surveyList = response.ScheduleSurveyList;
		var cognitionList = response.ScheduleGameList;
		var batchList=response.BatchScheduleList;

		Ti.API.info('surveyList : ', surveyList);
		Ti.API.info('cognitionList : ', cognitionList);
		Ti.API.info('batchList ******* : ', batchList);
		
		var currentDate = new Date();
		var currentMonth = currentDate.getMonth() + 1;
		if (currentMonth < 10)
			currentMonth = "0" + currentMonth;
		var scheduleDateFormat = currentDate.getFullYear() + "-" + currentMonth + "-" + currentDate.getDate() + "T00:00:00";
		if (surveyList.length != 0) {
			for (var i = 0; i < surveyList.length; i++) {
				var slotsArray = surveyList[i].SlotTimeOptions;
				var dataValues = {
					"userID" : credentials.userId,
					"testID" : surveyList[i].SurveyId,
					"testName" : surveyList[i].SurveyName,
					"versionNumber" : 0,
					"startDate" : surveyList[i].ScheduleDate,
					"startTime" : (surveyList[i].RepeatID === 11) ? slotsArray.toString() : surveyList[i].SlotTime,
					"repeateID" : surveyList[i].RepeatID,
					"IsDeleted" : (surveyList[i].IsDeleted == null) ? 0 : surveyList[i].IsDeleted,
					"IsSurvey" : 1,
					"scheduleID" : surveyList[i].SurveyScheduleID,
					"batchID":""
				};
				console.log("else array");
				console.log(dataValues);
				commonDB.insertAdminShedule(dataValues);
			}
		}
		if (cognitionList.length != 0) {
			for (var i = 0; i < cognitionList.length; i++) {
				var slotsArray = cognitionList[i].SlotTimeOptions;
				var dataValues = {
					"userID" : credentials.userId,
					"testID" : cognitionList[i].CTestId,
					"testName" : cognitionList[i].CTestName,
					"versionNumber" : (cognitionList[i].Version == null) ? 0 : cognitionList[i].Version,
					"startDate" : cognitionList[i].ScheduleDate,
					"startTime" : (cognitionList[i].RepeatID === 11) ? slotsArray.toString() : cognitionList[i].SlotTime,
					"repeateID" : cognitionList[i].RepeatID,
					"IsDeleted" : cognitionList[i].IsDeleted,
					"IsSurvey" : 0,
					"scheduleID" : cognitionList[i].GameScheduleID,
					"batchID":""
				};
				commonDB.insertAdminShedule(dataValues);

			}
		}
		
		if (batchList.length != 0) {
			var batchOptions="";
			for (var i = 0; i < batchList.length; i++) {
				batchOptions="";
				var slotsArray =[];
				
				if(batchList[i].RepeatId === 11){
				
				for(var k=0;k< batchList[i].BatchScheduleCustomTime.length;k++){
					
					slotsArray.push(batchList[i].BatchScheduleCustomTime[k].Time);
				}
				}
				
				Ti.API.info('slotsArray*******', slotsArray.toString());
				Ti.API.info('BatchScheduleSurvey_CTest',batchList[i].BatchScheduleSurvey_CTest);
				if(batchList[i].BatchScheduleSurvey_CTest != null){
					for(var j = 0; j< batchList[i].BatchScheduleSurvey_CTest.length; j++){
					var option=batchList[i].BatchScheduleSurvey_CTest[j].Type==1 ? "S" :"C";
					var batchID=option+" "+batchList[i].BatchScheduleSurvey_CTest[j].ID;
					if (batchOptions == "") {
					batchOptions = batchID;
				} else {
					batchOptions = batchOptions + ", " + batchID;
				}
				}
				}
				
				
				
			Ti.API.info('batchOptions*******',batchOptions);
				
				var dataValues = {
					"userID" : credentials.userId,
					"testID" : batchList[i].BatchScheduleId,
					"testName" : "BatchShedule",
					"versionNumber" : 0,
					"startDate" : batchList[i].ScheduleDate,
					"startTime" : (batchList[i].RepeatId === 11) ? slotsArray.toString() : batchList[i].SlotTime,
					"repeateID" : batchList[i].RepeatId,
					"IsDeleted" : batchList[i].IsDeleted,
					"IsSurvey" : 2,
					"scheduleID" : batchList[i].BatchScheduleId,
					"batchID":batchOptions
				};

				Ti.API.info('dataValues of batcch', dataValues);
				commonDB.insertAdminShedule(dataValues);

}
}

		if (surveyList.length != 0 || cognitionList.length != 0 || batchList!=0) {
			resetAllNotifications();
		}
		setJewelGameParam(response);
		var lastSyncDate = Ti.App.Properties.getObject('lastSyncDate');
		lastSyncDate.LastUpdatedSurveyDate = response.LastUpdatedSurveyDate;
		lastSyncDate.LastUpdatedGameDate = response.LastUpdatedGameDate;
		Ti.App.Properties.setObject('lastSyncDate', lastSyncDate);

	}

}

/**
 * SurveyAndGameSheduleFailure function
 */
function SurveyAndGameSheduleFailure(e) {
	Ti.API.info('SurveyAndGameSheduleFailure : ', JSON.stringify(e));

}

Ti.App.addEventListener('resetAllNotifications', resetAllNotifications);
function resetAllNotifications() {
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
	var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
	//numOfRecords = 0;
	spinInfo.lampRecords = 0;
	Ti.App.Properties.setObject('spinnerInfo', spinInfo);
	Ti.App.Properties.setObject('lastAdminReminderTime', reminderValues);
	Ti.App.Properties.setObject('lastLocalReminderTime', reminderValues);
	if (OS_IOS) {
		Ti.App.iOS.cancelAllLocalNotifications();
		//Ti.App.iOS.UserNotificationCenter.removeAllPendingNotifications;
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
	arrayItems = [];
	var notificationArray = commonDB.getAdminShedules();
	Ti.API.info('notificationArray : ', notificationArray);
	var j = 3;

	for (var i = 0; i < notificationArray.length; i++) {
		var testType = "survey";
		var alertText = "Survey : " + notificationArray[i].testName;
		
		var secondTest = j;
		j += 1;
		if (notificationArray[i].isSurvey == 0) {
			testType = "cognition";
			var alertText = "Cognition : " + notificationArray[i].testName;
		}else if(notificationArray[i].isSurvey == 1){
			var testType = "survey";
		var alertText = "Survey : " + notificationArray[i].testName;
		}else{
			var testType = "Batch";
		var alertText = "You have a new Batched survey.";
		}
		Ti.API.info('alertText : ', alertText);
		Ti.API.info('notificationArray[i].startTime : ', notificationArray[i].startTime);
		if (notificationArray[i].startTime != null && notificationArray[i].startTime != "" && notificationArray[i].startDate != null && notificationArray[i].startDate != "") {

			var stTime = notificationArray[i].startTime;
			var stDate = notificationArray[i].startDate;
			var dateArray = stTime.split(" ");
			var datePartArray = stDate.split("T");
			var utcDateTime = datePartArray[0] + "T" + dateArray[1] + ".000Z";
			
			Ti.API.info('utcDateTime : ', utcDateTime);
			var convLocalTime = new Date(utcDateTime);
			Ti.API.info('convLocalTime : ', convLocalTime);
			//var finalArray = convLocalTime.split(" ");
			Ti.API.info('dateArray : ', dateArray);
			if (dateArray.length >= 2) {

				//var timeForLocal = finalArray[1];
				if(OS_IOS){
					var minutes = convLocalTime.getMinutes();
				}else{
					var minutes = convLocalTime.getMinutes();
					//var minutes = convLocalTime.getUTCMinutes();
				}
				
				minutes = minutes < 10 ? '0' + minutes : minutes;
				
				if(OS_IOS){
					var hours = convLocalTime.getHours();
				}else{
					var hours = convLocalTime.getHours();
					//var hours = convLocalTime.getUTCHours();
				}
				hours = hours < 10 ? '0' + hours : hours;
				
					if(OS_IOS){
					var seconds = convLocalTime.getSeconds();
				}else{
					var seconds = convLocalTime.getSeconds();
					//var seconds = convLocalTime.getUTCSeconds();
				}
				seconds = seconds < 10 ? '0' + seconds : seconds;
				var timeForLocal = hours + ":" + minutes + ":" + seconds;
				// var datePartArr = datePartArray[0].split("-");
				var month = convLocalTime.getUTCMonth() + 1;
				month = month < 10 ? '0' + month : month;
				var dateValue = convLocalTime.getUTCDate();
				dateValue = dateValue < 10 ? '0' + dateValue : dateValue;

				var dateText = convLocalTime.getUTCFullYear() + "-" + month + "-" + dateValue;
				//var dateText = finalArray[0];
				Ti.API.info('dateText : ', dateText);
				Ti.API.info('timeForLocal : ', timeForLocal);
				var formateTime = commonFunctions.formatTimeToDate(timeForLocal, dateText, secondTest);
				var curDayFormateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), secondTest);
				Ti.API.info('formateTime : ', formateTime, " notificationArray[i].repeateID : ", notificationArray[i].repeateID);
				setAdminNotifications(notificationArray[i].repeateID - 1, formateTime, alertText, testType, secondTest, notificationArray[i].testID, notificationArray[i].versionNumber, curDayFormateTime, notificationArray[i].testName, timeForLocal,notificationArray[i].batchID);
			}

		}

	};

	var localNotificationArray = commonDB.getLocalShedules();
	Ti.API.info('localNotificationArray : ', localNotificationArray);
	for (var k = 0; k < localNotificationArray.length; k++) {
		if (localNotificationArray[k].isSurvey == 1) {
			if (Ti.App.Properties.hasProperty("surveyReminder")) {
				sendLocalNotification(localNotificationArray[k].repeateID, localNotificationArray[k].setDate, L('symptomTimeReminder'), 'survey', 1);
			}
		} else {
			if (Ti.App.Properties.hasProperty("coginitionReminder")) {

				//setTimeout(function() {
				sendLocalNotification(localNotificationArray[k].repeateID, localNotificationArray[k].setDate, L('cognitionTimeReminder'), 'cognition', 2);
				//}, 1000);
			}
		}

	}

}

/**
 * To set Jewel game 
 */
function setJewelGameParam(responseData) {
	var credentials = Alloy.Globals.getCredentials();
	Ti.App.Properties.setString('JewelsTrailsASettings', JSON.stringify(responseData.JewelsTrailsASettings));
	Ti.App.Properties.setString('JewelsTrailsBSettings', JSON.stringify(responseData.JewelsTrailsBSettings));
	console.log("~~~~~~~~~~~~~~~~~~~~~~~~START~~~~~~~~~~~~~~~~~~~~~~~~");
	var retrievedJSON = Ti.App.Properties.getString('JewelsTrailsASettings', 'JewelsTrailsASettings not found');
	console.log("The JewelsTrailsASettings property contains: " + retrievedJSON);
	var retrievedJSON1 = Ti.App.Properties.getString('JewelsTrailsBSettings', 'JewelsTrailsBSettings not found');
	console.log("The JewelsTrailsBSettings property contains: " + retrievedJSON1);
	console.log("~~~~~~~~~~~~~~~~~~~~~~~~END~~~~~~~~~~~~~~~~~~~~~~~~");
	var jewelTrail = Ti.App.Properties.getObject(credentials.userId.toString());
	console.log("local jewl a diamonds");
	console.log(parseInt(jewelTrail.jewelsTrailAServerDiamonds));
	console.log("server jewl a diamonds");
	console.log(parseInt(responseData.JewelsTrailsASettings.NoOfDiamonds));

	console.log("local jewl b diamonds");
	console.log(parseInt(jewelTrail.jewelsTrailBServerDiamonds));
	console.log("server jewl b diamonds");
	console.log(parseInt(responseData.JewelsTrailsBSettings.NoOfDiamonds));

	console.log("local jewl b shape");
	console.log(parseInt(jewelTrail.jewelsTrailBServerShapes));
	console.log("server jewl b shape");
	console.log(parseInt(responseData.JewelsTrailsBSettings.NoOfShapes));

	if (parseInt(jewelTrail.jewelsTrailAServerDiamonds) != parseInt(responseData.JewelsTrailsASettings.NoOfDiamonds)) {
		console.log("changed jewess a game settings");
		jewelTrail.jewelsTrailACurrentLevel = 1;
		jewelTrail.jewelsTrailATotalDiamonds = 0;
		jewelTrail.jewelsTrailAServerDiamonds = responseData.JewelsTrailsASettings.NoOfDiamonds;
		Ti.App.Properties.setObject(credentials.userId.toString(), jewelTrail);
	}

	if (parseInt(jewelTrail.jewelsTrailBServerDiamonds) != parseInt(responseData.JewelsTrailsBSettings.NoOfDiamonds)) {
		console.log("changed jewess b game settings diamonds");
		jewelTrail.jewelsTrailBCurrentLevel = 1;
		jewelTrail.jewelsTrailBTotalDiamonds = 0;
		jewelTrail.jewelsTrailBTotalShapes = 0;
		jewelTrail.jewelsTrailBServerDiamonds = responseData.JewelsTrailsBSettings.NoOfDiamonds;
		jewelTrail.jewelsTrailBServerShapes = responseData.JewelsTrailsBSettings.NoOfShapes;
		Ti.App.Properties.setObject(credentials.userId.toString(), jewelTrail);
		console.log("end jewel b diamond change");
	}

	if (parseInt(jewelTrail.jewelsTrailBServerShapes) != parseInt(responseData.JewelsTrailsBSettings.NoOfShapes)) {
		console.log("changed jewess b game settings shapes");
		jewelTrail.jewelsTrailBCurrentLevel = 1;
		jewelTrail.jewelsTrailBTotalDiamonds = 0;
		jewelTrail.jewelsTrailBTotalShapes = 0;
		jewelTrail.jewelsTrailBServerDiamonds = responseData.JewelsTrailsBSettings.NoOfDiamonds;
		jewelTrail.jewelsTrailBServerShapes = responseData.JewelsTrailsBSettings.NoOfShapes;
		Ti.App.Properties.setObject(credentials.userId.toString(), jewelTrail);
	}
}