/**
 * Declarations
 */
{
	var args = arguments[0] || {};
	var commonFunctions = require('commonFunctions');
	var serviceManager = require('serviceManager');
	var credentials = Alloy.Globals.getCredentials();
	var commonDB = require('commonDB');
	var currentTab = 1;
	var currentFooterTab = 1;
	var surveyNumber;
	var surveyListing = [];
	var completedSurveyListing = [];
	var LangCode = Ti.App.Properties.getString('languageCode');

}

/**
 * Window open function
 */
$.surveysList.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.tabView.top = "80dp";
				$.contentView.top = "120dp";
				$.surveyList.botttom = "40dp";
				$.supportLabel.botttom = "25dp";
			}
		}
		$.headerView.setTitle(commonFunctions.L('surveyListHeader', LangCode));
		$.pendingLabel.text = commonFunctions.L('surveysLabel', LangCode);
		$.completedLabel.text = commonFunctions.L('completedLabel', LangCode);
		$.noDataLabel.text = commonFunctions.L('noDataLabel', LangCode);
		$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
		if (Ti.Network.online) {
			var LastUpdatedDate = Ti.App.Properties.getString("surveyLastUpdatedDate", "");
			commonFunctions.openActivityIndicator(commonFunctions.L('activityLoading', LangCode));
			serviceManager.getSurveyList(credentials.userId, LastUpdatedDate, getSurveyListSuccess, getSurveyListFailure);
		} else {
			surveyListing = commonDB.getSurveyTypes();
			completedSurveyListing = commonDB.getSurveyResultList();
			loadSurveys();
		}

	} catch(ex) {
		commonFunctions.handleException("surveyList", "open", ex);
	}
});

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
				// credentials.userId
				if (surveyName != null && surveyName != "") {
					commonDB.insertSurveyTypes(surveyID, surveyName, credentials.userId, resultArrayList[i].IsDeleted);
					commonDB.insertSurveyQuestions(resultArrayList[i].Questions, credentials.userId, surveyID, resultArrayList[i].LanguageCode);
				}

			};
			surveyListing = commonDB.getSurveyTypes();
			completedSurveyListing = commonDB.getSurveyResultList();
			loadSurveys();
		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}
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
	commonFunctions.closeActivityIndicator();
	surveyListing = commonDB.getSurveyTypes();
	completedSurveyListing = commonDB.getSurveyResultList();
	loadSurveys();

}

/**
 * Function to load surveys
 */
function loadSurveys() {
	try {
		Ti.API.info('load survey');
		Ti.API.info('surveyListing.length : ', surveyListing.length);
		var surveyArray = [];
		for (var i = 0; i < surveyListing.length; i += 2) {
			var boxVisible = true;
			Ti.API.info('Value i : ', i);
			if (i + 1 >= surveyListing.length) {
				boxVisible = false;
				var rightName = "";
				var surveyIDRight = 0;

			} else {
				var rightName = surveyListing[i + 1].questions;
				var surveyIDRight = surveyListing[i + 1].surveyID;
			}
			Ti.API.info('rightName  : ', rightName);
			surveyArray.push({
				template : "surveyListTemplate",
				gameNameLabel1 : {
					text : surveyListing[i].questions
				},
				gameNameLabel2 : {
					text : rightName
				},
				gameNameViewRight : {
					visible : boxVisible
				},
				surveyID : {
					text : surveyListing[i].surveyID
				},
				surveyID1 : {
					text : surveyIDRight
				}

			});

		};
		if (surveyArray.length == 0) {
			$.noDataLabel.visible = true;
		} else {
			$.noDataLabel.visible = false;

		}
		$.lstSection.setItems(surveyArray);

	} catch(ex) {
		commonFunctions.handleException("surveyList", "loadSurveys", ex);
	}

}

/**
 * Function to load surveys
 */
function loadCompletedSurveys() {
	try {
		var surveyArray = [];
		for (var i = 0; i < completedSurveyListing.length; i++) {
			surveyArray.push({
				template : "completedSurveyListTemplate",
				surveyNameLabel : {
					text : completedSurveyListing[i].questions
				},
				completedDateLabel : {
					text : commonFunctions.formatDateTime(completedSurveyListing[i].suveryTime)
				},
				resultLabel : {
					text : commonFunctions.L('resultlabel', LangCode)
				},
				surveyID : completedSurveyListing[i].surveyID,
				groupID : completedSurveyListing[i].groupID,

			});
		};
		Ti.API.info('loadCompletedSurveys : ', surveyArray);
		if (surveyArray.length == 0) {
			$.noDataLabel.visible = true;
		} else {
			$.noDataLabel.visible = false;

		}
		$.lstSection.setItems(surveyArray);

	} catch(ex) {
		commonFunctions.handleException("surveyList", "loadSurveys", ex);
	}

}

/**
 * Header back button click handler
 */
$.headerView.on('backButtonClick', function(e) {
	goBack();
});

/**
 * goBack event handler
 */
function goBack(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('surveysList');
	var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
		parentWindow.window.refreshHomeScreen();
	}
}

/**
 * function for android back
 */
$.surveysList.addEventListener('android:back', function() {
	goBack();
});
/***
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});

/**
 * pendingSurveyTabClick event handler
 */
function pendingSurveyTabClick(e) {
	try {
		if (currentTab == 2) {
			currentTab = 1;
			$.pendingTabDiv.visible = true;
			$.completedTabDiv.visible = false;
			$.pendingLabel.opacity = 1;
			$.completedLabel.opacity = 0.5;
			loadSurveys();
		}

	} catch(ex) {
		commonFunctions.handleException("surveyList", "pendingSurveyTabClick", ex);
	}
}

/**
 * completedSurveyTabClick handler
 */
function completedSurveyTabClick(e) {
	try {
		if (currentTab == 1) {
			currentTab = 2;
			$.completedTabDiv.visible = true;
			$.pendingTabDiv.visible = false;
			$.pendingLabel.opacity = 0.5;
			$.completedLabel.opacity = 1;
			loadCompletedSurveys();
		}
	} catch(ex) {
		commonFunctions.handleException("surveyList", "completedSurveyTabClick", ex);
	}
}

/**
 * startSurveyClick event handler
 */
function startSurveyClick(e) {
	try {
		var itemname;
		if (e.itemIndex != null) {
			var item = $.surveyList.sections[0].getItemAt(e.itemIndex);
			if (item != null) {
				if (e.bindId == "gameNameViewLeft" || e.bindId == "gameNameLabel1") {
					itemname = item.gameNameLabel1.text;
					var surveyId = item.surveyID.text;

				} else if (e.bindId == "gameNameViewRight" || e.bindId == "gameNameLabel2") {
					itemname = item.gameNameLabel2.text;
					var surveyId = item.surveyID1.text;
				} else {
					return;
				}
			} else {
				return;
			}

			
			Ti.API.info('itemname : ', itemname, surveyId);

			Alloy.Globals.NAVIGATION_CONTROLLER.openFullScreenWindow('syptomSurveyNew', {
				'surveyID' : surveyId,
				'surveyName' : itemname
			});

		}

	} catch(ex) {
		commonFunctions.handleException("surveyList", "startSurveyClick", ex);
	}

}

/**
 * resultSurveyClick event handler
 */
function resultSurveyClick(e) {
	try {
		if (e.itemIndex != null) {
			var item = $.surveyList.sections[0].getItemAt(e.itemIndex);
			if (item != null) {
				var itemname = item.surveyNameLabel.text;
				var surveyId = item.surveyID;
				var groupId = item.groupID;
			}
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('surveyResultScreen', {
				'surveyId' : surveyId,
				'groupId' : groupId
			});
		}
	} catch(ex) {
		commonFunctions.handleException("surveyList", "resultSurveyClick", ex);
	}
}

/**
 * Function to shoe completed survey
 */
$.showCompletedList = function(e) {
	try {
		completedSurveyListing = commonDB.getSurveyResultList();
		completedSurveyTabClick(e);
	} catch(ex) {
		commonFunctions.handleException("surveyList", "showCompletedList", ex);
	}
};
