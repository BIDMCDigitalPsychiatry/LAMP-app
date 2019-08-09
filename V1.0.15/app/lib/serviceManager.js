/**
 * Declarations
 */
{

	var WebClient = require('webClient');
	var webClient = new WebClient();
	var commonFunctions = require('commonFunctions');
	var message;
	var serviceUrl;
	var LangCode = Ti.App.Properties.getString('languageCode');
}

/**
 * User login service
 */
exports.userLogin = function(loginParameter, successCallBack, failureCallBack) {
	try {
		var serviceUrl = Alloy.Globals.SERVICEURL + 'SignIn';
		var devType = 1;
		if (!OS_IOS) {
			devType = 2;
		}

		var parameter = {
			"Username" : loginParameter[0].userName,
			"Password" : loginParameter[0].password,
			"APPVersion" : Titanium.App.version,
			"DeviceType" : devType,
			"DeviceID" : Ti.Platform.id,
			"DeviceToken" : "",
			"Language" : loginParameter[0].Language
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, null);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

/**
 * Guest user sign up Service
 */
exports.guestUserSignUp = function(signUpDetails, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'GuestUserSignUp';
		var devType = 1;
		if (!OS_IOS) {
			devType = 2;
		}
		var parameter = {
			"FirstName" : signUpDetails[0].firstName,
			"LastName" : signUpDetails[0].lastName,
			"Email" : signUpDetails[0].email,
			"Password" : signUpDetails[0].password,
			"APPVersion" : Titanium.App.version,
			"DeviceType" : devType,
			"DeviceID" : Ti.Platform.id,
			"DeviceToken" : "",
			"Language" : signUpDetails[0].Language
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, null);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure" + JSON.stringify(e));
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
/**
 * Sign up for user
 */
exports.userSignUp = function(signUpDetails, successCallBack, failureCallBack) {
	try {
		var devType = 1;
		if (!OS_IOS) {
			devType = 2;
		}
		serviceUrl = Alloy.Globals.SERVICEURL + 'UserSignUp';
		var parameter = {
			"StudyCode" : signUpDetails[0].StudyCode,
			"StudyId" : signUpDetails[0].StudyId,
			"Password" : signUpDetails[0].password,
			"APPVersion" : Titanium.App.version,
			"DeviceType" : devType,
			"DeviceID" : Ti.Platform.id,
			"DeviceToken" : "",
			"Language" : signUpDetails[0].Language

		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, null);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure" + JSON.stringify(e));
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

/**
 * forgot password
 */
exports.forgotPassword = function(forgotPasswordParam, successCallBack, failureCallBack) {
	try {

		serviceUrl = Alloy.Globals.SERVICEURL + 'ForgotPassword';
		var parameter = {
			"Email" : forgotPasswordParam
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, null);

		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

/**
 * service for user settings
 */
exports.saveUserSettings = function(settingsParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveUserSetting';
		var parameter = {
			"UserSettingID" : settingsParam.userSettingsId,
			"UserID" : settingsParam.userId,
			"AppColor" : settingsParam.appColor,
			"SympSurveySlotID" : settingsParam.sympSurveySlotID,
			"SympSurveySlotTime" : settingsParam.sympSurveySlotTime,
			"SympSurveyRepeatID" : settingsParam.sympSurveyRepeatID,
			"CognTestSlotID" : settingsParam.cognTestSlotID,
			"CognTestSlotTime" : settingsParam.cognTestSlotTime,
			"CognTestRepeatID" : settingsParam.cognTestRepeatID,
			"ContactNo" : settingsParam.contactNo,
			"PersonalHelpline" : settingsParam.personalHelpline,
			"PrefferedSurveys" : settingsParam.PrefferedSurveys,
			"PrefferedCognitions" : settingsParam.PrefferedCognitions,
			"Protocol" : settingsParam.Protocol,
			"Language" : settingsParam.Language
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);

		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(ex) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

/**
 * webservice for deleting an account
 */
exports.deleteAccount = function(userID, successCallBack, failureCallBack) {
	try {

		serviceUrl = Alloy.Globals.SERVICEURL + 'DeleteUser';
		var parameter = {
			"UserID" : userID
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);

		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

/**
 * webservice for saving game result
 */
exports.saveUserSurvey = function(surveyParam, successCallBack, failureCallBack) {
	try {

		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveUserSurvey';
		var parameter = {
			"UserID" : surveyParam.UserID,
			"SurveyID" : surveyParam.SurveyID,
			"SurveyType" : surveyParam.SurveyType,
			"SurveyName" : surveyParam.SurveyName,
			"StartTime" : surveyParam.StartTime,
			"EndTime" : surveyParam.EndTime,
			"Rating" : surveyParam.Rating,
			"Comment" : surveyParam.Comment,
			"Point" : surveyParam.Point,
			"QuestAndAnsList" : surveyParam.QuestAndAnsList,
			"StatusType" : surveyParam.StatusType,
			"IsDistraction" : surveyParam.IsDistraction,
			"IsNotificationGame" : surveyParam.IsNotificationGame,
			"AdminBatchSchID" : surveyParam.AdminBatchSchID,
			"SpinWheelScore" : surveyParam.SpinWheelScore
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};

		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);

		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

/**
 * webservice for getting user profile
 */
exports.getUserProfile = function(userID, successCallBack, failureCallBack) {
	try {

		serviceUrl = Alloy.Globals.SERVICEURL + 'GetUserProfile';
		var parameter = {
			"UserID" : userID
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);

		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

/**
 * webservice for updating user profile
 */
exports.updateUserProfile = function(userParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'UpdateUserProfile';
		var parameter = {
			"UserId" : userParam.UserId,
			"FirstName" : userParam.FirstName,
			"LastName" : userParam.LastName,
			"StudyId" : userParam.StudyId,
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

/**
 * webservice for saving user location
 */
exports.saveUserLocation = function(locationParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveLocation';
		var parameter = {
			"UserID" : locationParam.UserID,
			"LocationName" : locationParam.LocationName,
			"Address" : locationParam.Address,
			"Type" : locationParam.Type,
			"Latitude" : locationParam.Latitude,
			"Longitude" : locationParam.Longitude
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

/**
 * webservice for saving n-back game results
 */
exports.saveNBackGame = function(resultParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveNBackGame';
		var parameter = {
			"UserID" : resultParam.UserID,
			"TotalQuestions" : resultParam.TotalQuestions,
			"CorrectAnswers" : resultParam.CorrectAnswers,
			"WrongAnswers" : resultParam.WrongAnswers,
			"StartTime" : resultParam.StartTime,
			"EndTime" : resultParam.EndTime,
			"Point" : resultParam.Point,
			"Score" : resultParam.Score,
			"Version" : resultParam.Version,
			"StatusType" : resultParam.StatusType,
			"IsNotificationGame" : resultParam.IsNotificationGame,
			"AdminBatchSchID" : resultParam.AdminBatchSchID,
			"SpinWheelScore" : resultParam.SpinWheelScore
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
exports.saveNBackGameImages = function(resultParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveNBackGameNewGame';
		var parameter = {
			"UserID" : resultParam.UserID,
			"TotalQuestions" : resultParam.TotalQuestions,
			"CorrectAnswers" : resultParam.CorrectAnswers,
			"WrongAnswers" : resultParam.WrongAnswers,
			"StartTime" : resultParam.StartTime,
			"EndTime" : resultParam.EndTime,
			"Point" : resultParam.Point,
			"Score" : resultParam.Score,
			"StatusType" : resultParam.StatusType,
			"IsNotificationGame" : resultParam.IsNotificationGame,
			"AdminBatchSchID" : resultParam.AdminBatchSchID,
			"SpinWheelScore" : resultParam.SpinWheelScore
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
/**
 * webservice for saving trails-B game results
 */
exports.saveTrailsBGame = function(resultParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveTrailsBGame';
		var parameter = {
			"UserID" : resultParam.UserID,
			"TotalAttempts" : resultParam.TotalAttempts,
			"StartTime" : resultParam.StartTime,
			"EndTime" : resultParam.EndTime,
			"Point" : resultParam.Point,
			"Score" : resultParam.Score,
			"RoutesList" : resultParam.RoutesList,
			"StatusType" : resultParam.StatusType,
			"IsNotificationGame" : resultParam.IsNotificationGame,
			"AdminBatchSchID" : resultParam.AdminBatchSchID,
			"SpinWheelScore" : resultParam.SpinWheelScore
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
exports.saveTrailsBGameNew = function(resultParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveTrailsBGameNew';
		var parameter = {
			"UserID" : resultParam.UserID,
			"TotalAttempts" : resultParam.TotalAttempts,
			"StartTime" : resultParam.StartTime,
			"EndTime" : resultParam.EndTime,
			"Point" : resultParam.Point,
			"Score" : resultParam.Score,
			"RoutesList" : resultParam.RoutesList,
			"Version" : resultParam.Version,
			"StatusType" : resultParam.StatusType,
			"IsNotificationGame" : resultParam.IsNotificationGame,
			"AdminBatchSchID" : resultParam.AdminBatchSchID,
			"SpinWheelScore" : resultParam.SpinWheelScore
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
exports.saveTrailsBGameTouch = function(resultParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveTrailsBDotTouchGame';
		var parameter = {
			"UserID" : resultParam.UserID,
			"TotalAttempts" : resultParam.TotalAttempts,
			"StartTime" : resultParam.StartTime,
			"EndTime" : resultParam.EndTime,
			"Point" : resultParam.Point,
			"Score" : resultParam.Score,
			"RoutesList" : resultParam.RoutesList,
			"StatusType" : resultParam.StatusType,
			"IsNotificationGame" : resultParam.IsNotificationGame,
			"AdminBatchSchID" : resultParam.AdminBatchSchID,
			"SpinWheelScore" : resultParam.SpinWheelScore
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
exports.SaveJewelsTrailsAGame = function(resultParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveJewelsTrailsAGame';
		var parameter = {
			"UserID" : resultParam.UserID,
			"TotalAttempts" : resultParam.TotalAttempts,
			"StartTime" : resultParam.StartTime,
			"EndTime" : resultParam.EndTime,
			"Point" : resultParam.Point,
			"Score" : resultParam.Score,
			"RoutesList" : resultParam.RoutesList,
			"TotalJewelsCollected" : resultParam.TotalJewelsCollected,
			"TotalBonusCollected" : resultParam.TotalBonusCollected,
			"StatusType" : resultParam.StatusType,
			"IsNotificationGame" : resultParam.IsNotificationGame,
			"AdminBatchSchID" : resultParam.AdminBatchSchID,
			"SpinWheelScore" : resultParam.SpinWheelScore
		};
		Ti.API.info('param is', JSON.stringify(parameter));
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
exports.SaveJewelsTrailsBGame = function(resultParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveJewelsTrailsBGame';
		var parameter = {
			"UserID" : resultParam.UserID,
			"TotalAttempts" : resultParam.TotalAttempts,
			"StartTime" : resultParam.StartTime,
			"EndTime" : resultParam.EndTime,
			"Point" : resultParam.Point,
			"Score" : resultParam.Score,
			"RoutesList" : resultParam.RoutesList,
			"TotalJewelsCollected" : resultParam.TotalJewelsCollected,
			"TotalBonusCollected" : resultParam.TotalBonusCollected,
			"StatusType" : resultParam.StatusType,
			"IsNotificationGame" : resultParam.IsNotificationGame,
			"AdminBatchSchID" : resultParam.AdminBatchSchID,
			"SpinWheelScore" : resultParam.SpinWheelScore
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(L("unexpectedError"));
	}
};
/**
 * webservice for saving spatial span game results
 */
exports.saveSpatialSpanGame = function(resultParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveSpatialSpanGame';
		var parameter = {
			"UserID" : resultParam.UserID,
			"Type" : resultParam.Type,
			"CorrectAnswers" : resultParam.CorrectAnswers,
			"WrongAnswers" : resultParam.WrongAnswers,
			"StartTime" : resultParam.StartTime,
			"EndTime" : resultParam.EndTime,
			"Point" : resultParam.Point,
			"Score" : resultParam.Score,
			"StatusType" : resultParam.StatusType,
			"BoxList" : resultParam.BoxList,
			"IsNotificationGame" : resultParam.IsNotificationGame,
			"AdminBatchSchID" : resultParam.AdminBatchSchID,
			"SpinWheelScore" : resultParam.SpinWheelScore
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

/**
 * webservice for saving memory game results
 */
exports.saveSimpleMemoryGame = function(resultParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveSimpleMemoryGame';
		var parameter = {
			"UserID" : resultParam.UserID,
			"TotalQuestions" : resultParam.TotalQuestions,
			"CorrectAnswers" : resultParam.CorrectAnswers,
			"WrongAnswers" : resultParam.WrongAnswers,
			"StartTime" : resultParam.StartTime,
			"EndTime" : resultParam.EndTime,
			"Point" : resultParam.Point,
			"Score" : resultParam.Score,
			"Version" : resultParam.Version,
			"StatusType" : resultParam.StatusType,
			"IsNotificationGame" : resultParam.IsNotificationGame,
			"AdminBatchSchID" : resultParam.AdminBatchSchID,
			"SpinWheelScore" : resultParam.SpinWheelScore
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

/**
 * webservice for saving cats and dogs game results
 */
exports.saveCatAndDogGame = function(resultParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveCatAndDogGame';
		var parameter = {
			"UserID" : resultParam.UserID,
			"TotalQuestions" : resultParam.TotalQuestions,
			"CorrectAnswers" : resultParam.CorrectAnswers,
			"WrongAnswers" : resultParam.WrongAnswers,
			"StartTime" : resultParam.StartTime,
			"EndTime" : resultParam.EndTime,
			"Point" : resultParam.Point,
			"StatusType" : resultParam.StatusType,
			"IsNotificationGame" : resultParam.IsNotificationGame,
			"AdminBatchSchID" : resultParam.AdminBatchSchID,
			"SpinWheelScore" : resultParam.SpinWheelScore
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

/**
 * webservice for saving serial7s game results
 */
exports.saveSerial7Game = function(resultParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveSerial7Game';
		var parameter = {
			"UserID" : resultParam.UserID,
			"TotalQuestions" : resultParam.TotalQuestions,
			"TotalAttempts" : resultParam.TotalAttempts,
			"StartTime" : resultParam.StartTime,
			"EndTime" : resultParam.EndTime,
			"Point" : resultParam.Point,
			"Score" : resultParam.Score,
			"Version" : resultParam.Version,
			"StatusType" : resultParam.StatusType,
			"IsNotificationGame" : resultParam.IsNotificationGame,
			"AdminBatchSchID" : resultParam.AdminBatchSchID,
			"SpinWheelScore" : resultParam.SpinWheelScore
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

/**
 * webservice for saving 3dfigurecopy game results
 */
exports.save3DFigureGame = function(resultParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'Save3DFigureGame';
		var parameter = {
			"UserID" : resultParam.UserID,
			"C3DFigureID" : resultParam.C3DFigureID,
			"DrawnFig" : resultParam.DrawnFig,
			"DrawnFigFileName" : resultParam.DrawnFigFileName,
			"StartTime" : resultParam.StartTime,
			"EndTime" : resultParam.EndTime,
			"Point" : resultParam.Point,
			"GameName" : resultParam.GameName,
			"IsNotificationGame" : resultParam.IsNotificationGame,
			"AdminBatchSchID" : resultParam.AdminBatchSchID,
			"SpinWheelScore" : resultParam.SpinWheelScore
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

/**
 * Webservice for saving Scartch Image game results
 */
exports.saveScartchImageGame = function(resultParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveScratchImageGame';
		var parameter = {
			"UserID" : resultParam.UserID,
			"ScratchImageID" : resultParam.ScratchImageID,
			"DrawnImage" : resultParam.DrawnImage,
			"DrawnImageName" : resultParam.DrawnImageName,
			"StartTime" : resultParam.StartTime,
			"EndTime" : resultParam.EndTime,
			"Point" : resultParam.Point,
			"GameName" : resultParam.GameName,
			"IsNotificationGame" : resultParam.IsNotificationGame,
			"AdminBatchSchID" : 0,
			"SpinWheelScore" : resultParam.SpinWheelScore
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

/**
 * webservice for saving visual association game results
 */
exports.saveVisualAssociationGame = function(resultParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveVisualAssociationGame';
		var parameter = {
			"UserID" : resultParam.UserID,
			"TotalQuestions" : resultParam.TotalQuestions,
			"TotalAttempts" : resultParam.TotalAttempts,
			"StartTime" : resultParam.StartTime,
			"EndTime" : resultParam.EndTime,
			"Point" : resultParam.Point,
			"Score" : resultParam.Score,
			"Version" : resultParam.Version,
			"StatusType" : resultParam.StatusType,
			"IsNotificationGame" : resultParam.IsNotificationGame,
			"AdminBatchSchID" : resultParam.AdminBatchSchID,
			"SpinWheelScore" : resultParam.SpinWheelScore
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
/**
 * webservice for saving digital span game results
 */
exports.saveDigitSpanGame = function(resultParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveDigitSpanGame';
		var parameter = {
			"UserID" : resultParam.UserID,
			"Type" : resultParam.Type,
			"CorrectAnswers" : resultParam.CorrectAnswers,
			"WrongAnswers" : resultParam.WrongAnswers,
			"StartTime" : resultParam.StartTime,
			"EndTime" : resultParam.EndTime,
			"Point" : resultParam.Point,
			"Score" : resultParam.Score,
			"StatusType" : resultParam.StatusType,
			"IsNotificationGame" : resultParam.IsNotificationGame,
			"AdminBatchSchID" : resultParam.AdminBatchSchID,
			"SpinWheelScore" : resultParam.SpinWheelScore
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

/**
 * webservice for saving new cat and dog game results
 */
exports.saveCatAndDogNewGame = function(resultParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveCatAndDogNewGame';
		var parameter = {
			"UserID" : resultParam.UserID,
			"CorrectAnswers" : resultParam.CorrectAnswers,
			"WrongAnswers" : resultParam.WrongAnswers,
			"StartTime" : resultParam.StartTime,
			"EndTime" : resultParam.EndTime,
			"Point" : resultParam.Point,
			"Score" : resultParam.Score,
			"StatusType" : resultParam.StatusType,
			"IsNotificationGame" : resultParam.IsNotificationGame,
			"AdminBatchSchID" : resultParam.AdminBatchSchID,
			"SpinWheelScore" : resultParam.SpinWheelScore,
			"GameLevelDetailList" : resultParam.GameLevelDetailList
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
/**
 * webservice for saving SaveTemporalOrder game results
 */
exports.saveTemporalOrderGame = function(resultParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveTemporalOrderGame';
		var parameter = {
			"UserID" : resultParam.UserID,
			"CorrectAnswers" : resultParam.CorrectAnswers,
			"WrongAnswers" : resultParam.WrongAnswers,
			"StartTime" : resultParam.StartTime,
			"EndTime" : resultParam.EndTime,
			"Point" : resultParam.Point,
			"Score" : resultParam.Score,
			"Version" : resultParam.Version,
			"StatusType" : resultParam.StatusType,
			"IsNotificationGame" : resultParam.IsNotificationGame,
			"AdminBatchSchID" : resultParam.AdminBatchSchID,
			"SpinWheelScore" : resultParam.SpinWheelScore
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
/**
 * webservice for saving call durations
 */
exports.saveHelpCall = function(resultParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveHelpCall';
		var parameter = {
			"UserID" : resultParam.UserID,
			"CalledNumber" : resultParam.CalledNumber,
			"CallDateTime" : resultParam.CallDateTime,
			"CallDuraion" : resultParam.CallDuraion,
			"Type" : resultParam.Type
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
/**
 * webservice for getting Articles
 */
exports.getArticles = function(userID, successCallBack, failureCallBack) {
	try {

		serviceUrl = Alloy.Globals.SERVICEURL + 'GetBlogs';
		var parameter = {
			"UserID" : userID
		};
		//var parameter = {};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		//Ti.API.info("extraParameter " + JSON.stringify(extraParameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);

		function onSuccess(e) {
			Ti.API.info("success" + JSON.stringify(e));
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure" + JSON.stringify(e));
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
exports.getTips = function(userID, successCallBack, failureCallBack) {
	try {

		serviceUrl = Alloy.Globals.SERVICEURL + 'GetTips';
		var parameter = {
			"UserID" : userID
		};

		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		//Ti.API.info("extraParameter " + JSON.stringify(extraParameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);

		function onSuccess(e) {
			Ti.API.info("success" + JSON.stringify(e));
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure" + JSON.stringify(e));
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
exports.getStatus = function(userID, successCallBack, failureCallBack) {
	try {

		serviceUrl = Alloy.Globals.SERVICEURL + 'GetTipsandBlogUpdates';
		var parameter = {
			"UserID" : userID
		};

		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		//Ti.API.info("extraParameter " + JSON.stringify(extraParameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);

		function onSuccess(e) {
			Ti.API.info("success" + JSON.stringify(e));
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure" + JSON.stringify(e));
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
exports.getScore = function(userID, successCallBack, failureCallBack) {
	try {

		serviceUrl = Alloy.Globals.SERVICEURL + 'GetGameScoresForGraph';
		var parameter = {
			"UserID" : userID
		};

		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		//Ti.API.info("extraParameter " + JSON.stringify(extraParameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);

		function onSuccess(e) {
			Ti.API.info("success" + JSON.stringify(e));
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure" + JSON.stringify(e));
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
exports.GetUserReport = function(userID, successCallBack, failureCallBack) {
	try {

		serviceUrl = Alloy.Globals.SERVICEURL + 'GetUserReport';
		var parameter = {
			"UserID" : userID
		};

		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		//Ti.API.info("extraParameter " + JSON.stringify(extraParameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);

		function onSuccess(e) {
			Ti.API.info("success" + JSON.stringify(e));
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure" + JSON.stringify(e));
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

exports.getHowToUseInstructions = function(userID, successCallBack, failureCallBack) {
	try {

		serviceUrl = Alloy.Globals.SERVICEURL + 'GetAppHelp';
		var parameter = {
			"UserID" : userID
		};

		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		//Ti.API.info("extraParameter " + JSON.stringify(extraParameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);

		function onSuccess(e) {
			Ti.API.info("success" + JSON.stringify(e));
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure" + JSON.stringify(e));
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
exports.getSurveyList = function(userID, LastUpdatedDate, successCallBack, failureCallBack) {
	try {

		serviceUrl = Alloy.Globals.SERVICEURL + 'GetSurveys';
		var parameter = {
			"UserID" : userID,
			"LastUpdatedDate" : LastUpdatedDate
		};

		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		//Ti.API.info("extraParameter " + JSON.stringify(extraParameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);

		function onSuccess(e) {
			Ti.API.info("success" + JSON.stringify(e));
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure" + JSON.stringify(e));
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
exports.getDistractionSurvey = function(parameter, successCallBack, failureCallBack) {
	try {

		serviceUrl = Alloy.Globals.SERVICEURL + 'GetDistractionSurveys';

		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		//Ti.API.info("extraParameter " + JSON.stringify(extraParameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);

		function onSuccess(e) {
			Ti.API.info("success" + JSON.stringify(e));
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure" + JSON.stringify(e));
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
exports.getSheduleSettings = function(userID, successCallBack, failureCallBack) {
	try {

		serviceUrl = Alloy.Globals.SERVICEURL + 'GetUserSetting';
		var parameter = {
			"UserID" : userID,
		};

		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		//Ti.API.info("extraParameter " + JSON.stringify(extraParameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);

		function onSuccess(e) {
			Ti.API.info("success" + JSON.stringify(e));
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure" + JSON.stringify(e));
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
exports.saveUserHealthData = function(userID, healthParam, successCallBack, failureCallBack) {
	try {

		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveUserHealthKit';
		var parameter = {
			"UserID" : userID,
			"DateOfBirth" : healthParam[0],
			"Sex" : healthParam[1],
			"BloodType" : healthParam[2],
			"Height" : healthParam[3],
			"Weight" : healthParam[4],
			"HeartRate" : healthParam[5],
			"BloodPressure" : healthParam[6],
			"RespiratoryRate" : healthParam[7],
			"Sleep" : healthParam[8],
			"Steps" : healthParam[9],
			"FlightClimbed" : healthParam[10],
			"Segment" : healthParam[11],
			"Distance" : healthParam[12]

		};

		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		//Ti.API.info("extraParameter " + JSON.stringify(extraParameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);

		function onSuccess(e) {
			Ti.API.info("success" + JSON.stringify(e));
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure" + JSON.stringify(e));
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
exports.getSurveyAndGameShedule = function(userID, lastUpdateGameDate, lastUpdateSurveyDate, successCallBack, failureCallBack) {
	try {

		serviceUrl = Alloy.Globals.SERVICEURL + 'GetSurveyAndGameSchedule';
		var parameter = {
			"UserID" : userID,
			"LastUpdatedGameDate" : lastUpdateGameDate,
			"LastUpdatedSurveyDate" : lastUpdateSurveyDate
		};

		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		//Ti.API.info("getSurveyAndGameShedule : " + serviceUrl + " " + JSON.stringify(parameter));
		//Ti.API.info("extraParameter " + JSON.stringify(extraParameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);

		function onSuccess(e) {
			//Ti.API.info("success" + JSON.stringify(e));
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				//Ti.API.info("failure" + JSON.stringify(e));
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

/**
 * Protocol service
 */
exports.getProtocolDate = function(successCallBack, failureCallBack) {
	try {
		var credentials = Alloy.Globals.getCredentials();
		serviceUrl = Alloy.Globals.SERVICEURL + 'GetProtocolDate';
		var parameter = {
			"UserId" : credentials.userId
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);

		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

/**
 * webservice for getting user total score
 */
exports.GetAllGameTotalSpinWheelScore = function(UserID, newdate, successCallBack, failureCallBack) {
	try {

		serviceUrl = Alloy.Globals.SERVICEURL + 'GetAllGameTotalSpinWheelScore';
		var parameter = {
			"UserID" : UserID,
			"Date" : newdate
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);

		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

/**
 * webservice for saving Spin Wheel Results
 */
exports.SaveSpinWheelGame = function(resultParam, successCallBack, failureCallBack) {
	try {
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveSpinWheelGame';
		var parameter = {
			"UserID" : resultParam.UserID,
			"StartTime" : resultParam.StartTime,
			"CollectedStars" : resultParam.CollectedStars,
			"DayStreak" : resultParam.DayStreak,
			"GameDate" : resultParam.GameDate,
			"StrakSpin" : resultParam.StrakSpin
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));
		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);
		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};

/**
 * Get score card
 */
exports.getGraphDetails = function(graphParam, successCallBack, failureCallBack) {
	try {
		var credentials = Alloy.Globals.getCredentials();
		serviceUrl = Alloy.Globals.SERVICEURL + 'GetGameHighAndLowScoreforGraph';
		var parameter = {
			"UserId" : credentials.userId,
			"GameID" : graphParam.GameID
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);

		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
/**
 * New health data service
 */
exports.saveUserHealthDetailData = function(userID, healthParam, HealthKitParams, successCallBack, failureCallBack) {
	try {

		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveUserHealthKitV2';
		var parameter = {
			"UserID" : userID,
			"DateOfBirth" : healthParam[0],
			"Gender" : healthParam[1],
			"BloodType" : healthParam[2],
			"HealthKitParams" : HealthKitParams
		};

		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);

		function onSuccess(e) {
			Ti.API.info("success" + JSON.stringify(e));
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure" + JSON.stringify(e));
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
/**
 * Update favourite Game
 */
exports.updateFavorite = function(favoriteParam, successCallBack, failureCallBack) {
	try {
		var credentials = Alloy.Globals.getCredentials();
		serviceUrl = Alloy.Globals.SERVICEURL + 'SaveUserCTestsFavourite';
		var parameter = {
		"UserId" : credentials.userId,
		"CTestID":  favoriteParam.GameID,
		"FavType": favoriteParam.FavType,
		"Type":favoriteParam.Type
		};
		var extraParameter = {
			"shouldAuthenticate" : true,
			"SessionToken" : Ti.App.Properties.getString('SESSION_TOKEN')
		};
		Ti.API.info(serviceUrl + " " + JSON.stringify(parameter));

		webClient.post(serviceUrl, parameter, onSuccess, onError, extraParameter);

		function onSuccess(e) {
			Ti.API.info("success");
			var result = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
			successCallBack(e);
		}

		function onError(e) {
			try {
				Ti.API.info("failure");
				var err = e.data == "" || e.data == null ? commonFunctions.L('unexpectedError', LangCode) : e.data;
				failureCallBack(err);
			} catch(ex) {
				failureCallBack(commonFunctions.L('unexpectedError', LangCode));
			}
		}

	} catch(e) {
		failureCallBack(commonFunctions.L('unexpectedError', LangCode));
	}
};
