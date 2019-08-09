// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var serviceManager = require('serviceManager');
var commonFunctions = require('commonFunctions');
var credentials = Alloy.Globals.getCredentials();
var LangCode = Ti.App.Properties.getString('languageCode');
var userData = [];
var valueField;
var userDataObj = null;
/**
 * Function for screen open
 */
$.userProfileScreen.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
				$.contentView.bottom = "25dp";
				$.supportLabel.bottom = "17dp";
			}

		}
		$.headerView.setTitle(commonFunctions.L('profileLbl', LangCode));
		$.firstNamelabel.text = commonFunctions.L('firstName', LangCode);
		$.lastNamelabel.text = commonFunctions.L('lastName', LangCode);
		$.studyIdlabel.text = commonFunctions.L('studyIdLbl', LangCode);
		$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
		var userDataObj = Ti.App.Properties.getObject("userDataObj");
		if (userDataObj != null) {
			Ti.API.info('enter not null');
			$.firstNameText.value = userDataObj.firstName;
			$.lastNameText.value = userDataObj.lastName;
			$.studyIdText.value = userDataObj.studyID;
			if (Ti.Network.online) {
				serviceManager.getUserProfile(credentials.userId, getUserProfileSuccess, getUserProfileFailure);
			} else {
				commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));
			}
		} else {
			Ti.API.info('enter null');
			if (Ti.Network.online) {
				commonFunctions.openActivityIndicator(commonFunctions.L('activityLoading', LangCode));
				serviceManager.getUserProfile(credentials.userId, getUserProfileSuccess, getUserProfileFailure);
			} else {
				commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));
			}
		}

	} catch(ex) {
		commonFunctions.handleException("userprofile", "open", ex);
	}
});

/**
 * Success api call
 */
function getUserProfileSuccess(e) {

	try {
		var response = JSON.parse(e.data);
		Ti.API.info('***GET USER PROFILE SUCCESS  RESPONSE****  ', JSON.stringify(response));

		if (response.ErrorCode == 0) {
			userDataObj = {
				firstName : response.Data.FirstName,
				lastName : response.Data.LastName,
				studyID : response.Data.StudyId
			};
			Ti.App.Properties.setObject("userDataObj", userDataObj);

			if (response.Data.FirstName != null) {
				$.firstNameText.value = response.Data.FirstName;
			}
			if (response.Data.LastName != null) {
				$.lastNameText.value = response.Data.LastName;
			}
			if (response.Data.StudyId != null) {
				$.studyIdText.value = response.Data.StudyId;
			}

		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}
		commonFunctions.closeActivityIndicator();

	} catch(ex) {
		commonFunctions.handleException("userprofile", "getUserProfileSuccess", ex);
	}
}

/**
 * Failure api call
 */
function getUserProfileFailure(e) {
	Ti.API.info('***GET USER PROFILE FAILURE  RESPONSE****  ', JSON.stringify(response));
	commonFunctions.closeActivityIndicator();

}

/***
 * Save settings
 */
$.headerView.on('rightButtonClick', function(e) {
	try {

		if (Ti.Network.online) {
			commonFunctions.openActivityIndicator(commonFunctions.L('activitySaving', LangCode));

			var userProfileData = {
				"UserId" : credentials.userId,
				"FirstName" : $.firstNameText.value,
				"LastName" : $.lastNameText.value,
				"StudyId" : $.studyIdText.value
			};
			userDataObj = {
				firstName : $.firstNameText.value,
				lastName : $.lastNameText.value,
				studyID : $.studyIdText.value
			};
			Ti.App.Properties.setObject("userDataObj", userDataObj);
			Ti.API.info('updateUserProfile : ' + JSON.stringify(userProfileData));

			serviceManager.updateUserProfile(userProfileData, updateUserProfileSuccess, updateUserProfileFailure);
		} else {
			commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));
		}
	} catch(ex) {
		commonFunctions.handleException("userProfile", "update userprofile", ex);
	}
});
/**
 * Failure api call
 */
function updateUserProfileSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		Ti.API.info('***UPDATE USER PROFILE SUCCESS  RESPONSE****  ', JSON.stringify(response));
		if (response.ErrorCode == 0) {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('userProfileScreen');
		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}
		commonFunctions.closeActivityIndicator();
	} catch(ex) {
		commonFunctions.handleException("userProfile", "updateUserProfileSuccess", ex);
	}

}

/**
 * Failure api call
 */
function updateUserProfileFailure(e) {
	commonFunctions.closeActivityIndicator();
}

/**
 * function for back button click
 */

$.headerView.on('backButtonClick', function(e) {
	goBack();
});
function goBack(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('userProfileScreen');
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
$.userProfileScreen.addEventListener('android:back', function() {
	goBack();
});

$.firstNameText.addEventListener('return', function() {
	$.lastNameText.focus();
});

function blurKeybrod() {
	$.firstNameText.blur();
	$.lastNameText.blur();

}