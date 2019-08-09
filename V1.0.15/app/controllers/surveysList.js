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
	var surveyID;

}
$.surveysList.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.tabView.top = "80dp";
				$.contentView.top = "120dp";
				$.contentView.bottom = "25dp";
				$.surveyList.botttom = "30dp";
				$.supportLabel.botttom = "30dp";
			}
		}
		$.headerView.setTitle(commonFunctions.L('surveyListHeader', LangCode));
		$.pendingLabel.text = commonFunctions.L('surveysLabel', LangCode);
		$.completedLabel.text = commonFunctions.L('completedLabel', LangCode);
		$.noDataLabel.text = commonFunctions.L('noDataLabel', LangCode);
		$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
		surveyListing = commonDB.getSurveyTypes();
		Ti.API.info('********* surveyListing 456 = ' + JSON.stringify(surveyListing));
		completedSurveyListing = commonDB.getSurveyResultList();
		loadSurveys();
		if (Ti.Network.online) {
			var LastUpdatedDate = Ti.App.Properties.getString("surveyLastUpdatedDate", "");
			if (LastUpdatedDate == "") {
				commonFunctions.openActivityIndicator(commonFunctions.L('activityLoading', LangCode));
			}
			serviceManager.getSurveyList(credentials.userId, LastUpdatedDate, getSurveyListSuccess, getSurveyListFailure);
		} else {

		}

	} catch(ex) {
		commonFunctions.handleException("surveyList", "open", ex);
	}
});
function getSurveyListSuccess(e) {

	try {
		var response = JSON.parse(e.data);

		if (response.ErrorCode == 0) {
			Ti.App.Properties.setString('surveyLastUpdatedDate', response.LastUpdatedDate);
			var resultArrayList = response.Survey;
			for (var i = 0; i < resultArrayList.length; i++) {
				surveyID = resultArrayList[i].SurveyID;
				var surveyName = resultArrayList[i].SurveyName;
				var surveyInstruction = resultArrayList[i].Instruction;

				if (surveyName != null && surveyName != "") {
					commonDB.insertSurveyTypes(surveyID, surveyName, credentials.userId, resultArrayList[i].IsDeleted, surveyInstruction);
					commonDB.insertSurveyQuestions(resultArrayList[i].Questions, credentials.userId, surveyID, resultArrayList[i].LanguageCode);
				}

			};
			surveyListing = commonDB.getSurveyTypes();

			completedSurveyListing = commonDB.getSurveyResultList();
			if (currentTab == 1) {
				loadSurveys();
			}
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

	commonFunctions.closeActivityIndicator();
	surveyListing = commonDB.getSurveyTypes();
	completedSurveyListing = commonDB.getSurveyResultList();
	loadSurveys();

}

function loadSurveys() {
	try {

		var surveyArray = [];

		for (var i = 0; i < surveyListing.length; i++) {
			var fileName = "S" + surveyListing[i].surveyID + ".png";
			var surveyIcon = "/images/gameIcons/surveyIcon.png";
			var file = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
			if (file.exists() == true) {
				surveyIcon = Ti.Filesystem.applicationDataDirectory + fileName;
				Ti.API.info('surveyIcon exists *****' + surveyIcon);
			}

			surveyArray.push({
				template : "surveyListTemplate",
				gameNameLabel : {
					text : surveyListing[i].questions
				},
				iconImage : {
					image : surveyIcon
				},

				surveyID : {
					text : surveyListing[i].surveyID
				},

				surveyInstruction : {
					text : surveyListing[i].surveyInstruction
				},

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
				surveyInstruction : completedSurveyListing[i].surveyInstruction

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

$.headerView.on('backButtonClick', function(e) {
	goBack();
});
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

function startSurveyClick(e) {
	try {
		var itemname;
		var surveyInstruction;
		if (e.itemIndex != null) {
			var item = $.surveyList.sections[0].getItemAt(e.itemIndex);
			if (item != null) {

				itemname = item.gameNameLabel.text;
				var surveyId = item.surveyID.text;
				surveyInstruction = item.surveyInstruction.text;

			} else {
				return;
			}

			if (surveyInstruction == null || surveyInstruction == "") {
				Alloy.Globals.NAVIGATION_CONTROLLER.openFullScreenWindow('syptomSurveyNew', {
					'surveyID' : surveyId,
					'surveyName' : itemname
				});
			} else {
				Alloy.Globals.NAVIGATION_CONTROLLER.openFullScreenWindow('surveyInstructionScreen', {
					'surveyID' : surveyId,
					'surveyName' : itemname,
					'surveyInst' : surveyInstruction
				});
			}

		}

	} catch(ex) {
		commonFunctions.handleException("surveyList", "startSurveyClick", ex);
	}

}

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

$.showCompletedList = function(e) {
	try {
		completedSurveyListing = commonDB.getSurveyResultList();
		completedSurveyTabClick(e);
	} catch(ex) {
		commonFunctions.handleException("surveyList", "showCompletedList", ex);
	}
};
