/**
 * Declarations
 */
{
	var args = arguments[0] || {};
	var commonFunctions = require('commonFunctions');
	var commonDB = require('commonDB');
	var serviceManager = require('serviceManager');
	var credentials = Alloy.Globals.getCredentials();
	Ti.API.info('the args is ' + JSON.stringify(args.arraySubmitedAnswers));
	var surveyQuesAns = [];
}
for (var i = 0; i < args.arraySubmitedAnswers.length; i++) {
	surveyQuesAns.push({
		Question : args.arraySubmitedAnswers[i].surveyQuestions,
		Answer : args.arraySubmitedAnswers[i].answer
	});
}
Ti.API.info('surveyques' + JSON.stringify(surveyQuesAns));

/**
 * Open Window.
 */
$.comments.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
				$.footerView.bottom = "10dp";
			}
		}
		if (Alloy.Globals.SURVEY_COMMENTS != "") {
			$.commentText.value = Alloy.Globals.SURVEY_COMMENTS;
		}
		var flexSpace = Ti.UI.createButton({
			systemButton : Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});
		var done = Ti.UI.createButton({
			title : "Done",
		});
		done.addEventListener('click', function(e) {
			$.commentText.blur();

		});

		$.commentText.keyboardToolbar = [flexSpace, done];

	} catch(ex) {
		commonFunctions.handleException("comments", "open", ex);
	}
});
$.commentText._hintText = $.commentText.value;

$.commentText.addEventListener('focus', function(e) {
	try {
		if (e.source.value == e.source._hintText) {
			e.source.value = "";
		}
	} catch(ex) {
		commonFunctions.handleException("comments", "focus", ex);
	}
});
$.commentText.addEventListener('blur', function(e) {
	if (e.source.value == "") {
		e.source.value = e.source._hintText;
	}
});

/**
 * Submit Survey.
 */
function submitButtonClick(e) {
	try {

		var surveyParam = {
			"UserID" : credentials.userId,
			"SurveyType" : args.arraySubmitedAnswers[0].surveyType,
			"SurveyName" : args.surveyName,
			"StartTime" : args.symptomStartTime,
			"EndTime" : args.symptomEndTime,
			"Rating" : "",
			"Comment" : $.commentText.value,
			"QuestAndAnsList" : surveyQuesAns
		};

		if (Ti.Network.online) {
			commonFunctions.openActivityIndicator(L('activitySaving'));
			serviceManager.saveUserSurvey(surveyParam, saveUserSurveySuccess, saveUserSurveyFailure);

		} else {
			commonFunctions.closeActivityIndicator();
			commonFunctions.showAlert(L('noNetwork'));
		}

	} catch(ex) {
		commonFunctions.handleException("comments", "submitButtonClick", ex);
	}
}

/**
 * Signin API Calling Success
 */
function saveUserSurveySuccess(e) {
	try {

		var response = JSON.parse(e.data);

		Ti.API.info('***SAVE USER SURVEY RESPONSE****  ', JSON.stringify(response));

		if (response.ErrorCode == 0) {
			Alloy.Globals.SURVEY_COMMENTS = "";
			commonDB.insertSurveyResult(args.arraySubmitedAnswers);
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spaceBlockScreen', {
				'backDisable' : true,
				'surveyID' : args.surveyID
			});
			setTimeout(function() {
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('symptomSurvey');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('surveysList');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('comments');
			}, 1000);
			commonFunctions.closeActivityIndicator();
		} else {
			commonFunctions.closeActivityIndicator();
			commonFunctions.showAlert(response.ErrorMessage);
		}
	} catch(ex) {
		commonFunctions.handleException("comment", "saveUserSurveySuccess", ex);
	}
}

/**
 * Signin API Calling Failure
 */
function saveUserSurveyFailure(e) {
	commonFunctions.closeActivityIndicator();
	Ti.API.info('***saveUserSurveyFailure****  ', JSON.stringify(response));
}

/**
 * Window Click handler
 */
function windowClick(e) {
	try {
		if (e.source.id != "commentText" && e.source.id != "headerContainer") {
			$.commentText.blur();

		}
	} catch(ex) {
		commonFunctions.handleException("comments", "windowClick", ex);
	}

}

/**
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});

/**
 * Handle back Click
 */
$.headerView.on('backButtonClick', function(e) {
	goBack();
});

/**
 * goBack function handler
 */
function goBack(e) {
	try {
		if ($.commentText.value != "") {
			Alloy.Globals.SURVEY_COMMENTS = $.commentText.value;
		}
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('comments');
	} catch(ex) {
		commonFunctions.handleException("comments", "goBack", ex);
	}

}

/**
 * function for android back
 */
$.comments.addEventListener('android:back', function() {
	goBack();
});
