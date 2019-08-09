var commonFunctions = require('commonFunctions');

/**
 * Insert settings data
 */
exports.insertSettingsData = function(settingsData) {
	try {
		var db = Ti.Database.open(Alloy.Globals.DATABASE);
		db.execute('BEGIN;');
		Ti.API.info('The settings data in insert is' + JSON.stringify(settingsData));
		var sqlResultSet = db.execute('SELECT * FROM Settings WHERE userSettingID = ? AND userID=?', settingsData.userSettingsId, settingsData.userId);

		if (!sqlResultSet.isValidRow()) {
			Ti.API.info('entered insert ' + settingsData.userId);
			db.execute('INSERT INTO Settings(userID,userSettingID,appColor,sympSurveySlotID,sympSurveySlotTime,sympSurveyRepeatID,cognTestSlotID,cognTestSlotTime,cognTestRepeatID,contactNo,personalHelpline,protocol)VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', settingsData.userId, settingsData.userSettingsId, settingsData.appColor, settingsData.sympSurveySlotID, settingsData.sympSurveySlotTime, settingsData.sympSurveyRepeatID, settingsData.cognTestSlotID, settingsData.cognTestSlotTime, settingsData.cognTestRepeatID, settingsData.contactNo, settingsData.personalHelpline, settingsData.Protocol);
		} else {

			Ti.API.info('else of insert');
			db.execute('UPDATE Settings SET appColor =?, sympSurveySlotID =?, sympSurveySlotTime =?, sympSurveyRepeatID =?,cognTestSlotID=?,cognTestSlotTime=?,cognTestRepeatID=?,contactNo=?,personalHelpline=?,protocol=? where userSettingID = ? AND userID=?', settingsData.appColor, settingsData.sympSurveySlotID, settingsData.sympSurveySlotTime, settingsData.sympSurveyRepeatID, settingsData.cognTestSlotID, settingsData.cognTestSlotTime, settingsData.cognTestRepeatID, settingsData.contactNo, settingsData.personalHelpline, settingsData.Protocol, settingsData.userSettingsId, settingsData.userId);

		}
		db.execute('COMMIT;');
		//sqlResultSet.close();
		db.close();
	} catch(e) {
		db.close();
		throw (e);
	}
};

/**
 * Get Settings Data
 */
exports.getSettingsData = function(userID) {
	var returnVal = false;
	var db = Ti.Database.open(Alloy.Globals.DATABASE);
	try {
		Ti.API.info('user id in getdata local DB  is ' + userID);
		var settingRows = db.execute('SELECT * FROM Settings WHERE  userID=?', userID);
		if (settingRows.isValidRow()) {
			Ti.API.info('valid row in getdata');
			var settingsData = {
				"userSettingID" : settingRows.fieldByName('userSettingID'),
				"appColor" : settingRows.fieldByName('appColor'),
				"sympSurveySlotID" : settingRows.fieldByName('sympSurveySlotID'),
				"sympSurveySlotTime" : settingRows.fieldByName('sympSurveySlotTime'),
				"sympSurveyRepeatID" : settingRows.fieldByName('sympSurveyRepeatID'),
				"cognTestSlotID" : settingRows.fieldByName('cognTestSlotID'),
				"cognTestSlotTime" : settingRows.fieldByName('cognTestSlotTime'),
				"cognTestRepeatID" : settingRows.fieldByName('cognTestRepeatID'),
				"contactNo" : settingRows.fieldByName('contactNo'),
				"personalHelpline" : settingRows.fieldByName('personalHelpline'),
				"Protocol" : settingRows.fieldByName('protocol'),
			};

		} else {
			Ti.API.info('invalid row');
		}
		Ti.API.info('settingsData DB : ', settingsData);
		//settingRows.close();
		db.close();
		return settingsData;

	} catch(ex) {
		db.close();
		throw ex;
	}
	return returnVal;
};
/**
 * Insert game result
 */
exports.insertGameScore = function(gameID, score, points, curPoints) {
	try {
		var credentials = Alloy.Globals.getCredentials();
		var db = Ti.Database.open(Alloy.Globals.DATABASE);
		db.execute('BEGIN;');
		var sqlResultSet = db.execute('SELECT * FROM CoginitionTestResult WHERE gameID = ? AND userID=?', gameID, credentials.userId);
		if (!sqlResultSet.isValidRow()) {

			Ti.API.info('enter');
			db.execute('INSERT INTO CoginitionTestResult(userID,gameID,score,points)VALUES (?,?,?,?)', credentials.userId, gameID, score, points);
		} else {
			Ti.API.info('enter2');

			db.execute('UPDATE CoginitionTestResult SET score =? ,points =? where gameID = ? AND userID=?', score, points, gameID, credentials.userId);
		}

		var sqlResultSet1 = db.execute('SELECT sum(points) AS "totalPoints" FROM CoginitionTestResult WHERE userID=?', credentials.userId);
		var sumPoint = 0;
		if (sqlResultSet1.isValidRow()) {
			var sumPoint = sqlResultSet1.fieldByName('totalPoints');
		}
		Ti.App.Properties.setString('totalPoints', sumPoint);
		Ti.API.info('****sumPoint**** : ', sumPoint);
		if (sumPoint < 10) {
			Ti.App.Properties.setString('currentLevel', "Level 1");
		} else if (sumPoint < 50) {
			Ti.App.Properties.setString('currentLevel', "Level 2");

		} else if (sumPoint < 100) {
			Ti.App.Properties.setString('currentLevel', "Level 3");

		} else if (sumPoint < 500) {
			Ti.App.Properties.setString('currentLevel', "Level 4");

		} else if (sumPoint > 500) {
			Ti.App.Properties.setString('currentLevel', "Level 5");

		}

		db.execute('COMMIT;');
		db.close();
	} catch(e) {
		db.close();
		throw (e);
	}
};
/**
 * Insert Point
 */
exports.insertPoint = function(gameID, points, currentPoints) {
	try {
		var credentials = Alloy.Globals.getCredentials();
		var db = Ti.Database.open(Alloy.Globals.DATABASE);
		db.execute('BEGIN;');
		var sqlResultSet = db.execute('SELECT * FROM CoginitionTestResult WHERE gameID = ? AND userID=?', gameID, credentials.userId);
		var totalPoint = Ti.App.Properties.getString("totalPoints");
		if (!sqlResultSet.isValidRow()) {
			var sumPoint = parseInt(totalPoint) + parseInt(currentPoints);
			Ti.App.Properties.setString('totalPoints', sumPoint);
			if (sumPoint < 10) {
				Ti.App.Properties.setString('currentLevel', "Level 1");
			} else if (sumPoint < 50) {
				Ti.App.Properties.setString('currentLevel', "Level 2");

			} else if (sumPoint < 100) {
				Ti.App.Properties.setString('currentLevel', "Level 3");

			} else if (sumPoint < 500) {
				Ti.App.Properties.setString('currentLevel', "Level 4");

			} else if (sumPoint > 500) {
				Ti.App.Properties.setString('currentLevel', "Level 5");

			}
			Ti.API.info('enter');
			db.execute('INSERT INTO CoginitionTestResult(userID,gameID,score,points)VALUES (?,?,?,?)', credentials.userId, gameID, 0, points);
		} else {
			var sumPoint = parseInt(totalPoint) + parseInt(currentPoints);
			Ti.App.Properties.setString('totalPoints', sumPoint);
			if (sumPoint < 10) {
				Ti.App.Properties.setString('currentLevel', "Level 1");
			} else if (sumPoint < 50) {
				Ti.App.Properties.setString('currentLevel', "Level 2");

			} else if (sumPoint < 100) {
				Ti.App.Properties.setString('currentLevel', "Level 3");

			} else if (sumPoint < 500) {
				Ti.App.Properties.setString('currentLevel', "Level 4");

			} else if (sumPoint > 500) {
				Ti.App.Properties.setString('currentLevel', "Level 5");

			}
			Ti.API.info('enter2');
			db.execute('UPDATE CoginitionTestResult SET points =? where gameID = ? AND userID=?', points, gameID, credentials.userId);
		}
		db.execute('COMMIT;');
		db.close();
	} catch(e) {
		db.close();
		throw (e);
	}
};
exports.insertJewelCounts = function(totalJewel, totalBonus, totalScore, type) {
	try {
		var credentials = Alloy.Globals.getCredentials();
		var db = Ti.Database.open(Alloy.Globals.DATABASE);
		db.execute('BEGIN;');
		Ti.API.info('Insert DB totalBonus : ', totalBonus);
		var sqlResultSet = db.execute('SELECT * FROM JewelCollection WHERE userID=? and type=?', credentials.userId, type);
		if (!sqlResultSet.isValidRow()) {
			db.execute('INSERT INTO JewelCollection(userID,totalJewel,totalBonus,totalScore,type)VALUES (?,?,?,?,?)', credentials.userId, totalJewel, totalBonus, totalScore, type);
		} else {
			if (totalScore == 0) {
				db.execute('UPDATE JewelCollection SET totalJewel =?,totalBonus =? where userID=? and type=?', totalJewel, totalBonus, credentials.userId, type);

			} else {
				db.execute('UPDATE JewelCollection SET totalJewel =?,totalBonus =?,totalScore=? where userID=? and type=?', totalJewel, totalBonus, totalScore, credentials.userId, type);
			}

		}
		db.execute('COMMIT;');
		db.close();
	} catch(e) {
		db.close();
		throw (e);
	}
};
/**
 * Get game Result
 */
exports.getGameScore = function() {
	var returnVal = false;
	var credentials = Alloy.Globals.getCredentials();
	var db = Ti.Database.open(Alloy.Globals.DATABASE);
	var scoreArray = [];
	try {
		var resultRows = db.execute('SELECT * FROM CoginitionTestResult WHERE  userID=? ', credentials.userId);
		while (resultRows.isValidRow()) {
			scoreArray.push({
				"gameID" : (resultRows.fieldByName('gameID') != null) ? resultRows.fieldByName('gameID') : 0,
				"score" : (resultRows.fieldByName('score') != null) ? resultRows.fieldByName('score') : 0,
				"points" : (resultRows.fieldByName('points') != null) ? resultRows.fieldByName('points') : 0,
			});

			resultRows.next();
		}
		resultRows.close();
		db.close();
		return scoreArray;

	} catch(ex) {
		db.close();
		throw ex;
	}
	return returnVal;
};
exports.getJewelsCount = function(type) {
	var returnVal = false;
	var credentials = Alloy.Globals.getCredentials();
	var db = Ti.Database.open(Alloy.Globals.DATABASE);
	var jewelArray = [];
	try {
		var resultRows = db.execute('SELECT * FROM JewelCollection WHERE  userID=? and type=?', credentials.userId, type);
		while (resultRows.isValidRow()) {
			jewelArray.push({
				"totalJewel" : (resultRows.fieldByName('totalJewel') != null) ? resultRows.fieldByName('totalJewel') : 0,
				"totalBonus" : (resultRows.fieldByName('totalBonus') != null) ? resultRows.fieldByName('totalBonus') : 0,
				"totalScore" : (resultRows.fieldByName('totalScore') != null) ? parseFloat(resultRows.fieldByName('totalScore')) : 0,
			});

			resultRows.next();
		}
		resultRows.close();
		db.close();
		return jewelArray;

	} catch(ex) {
		db.close();
		throw ex;
	}
	return returnVal;
};
/**
 * To insert survey questions
 */
exports.insertSurveyQuestions = function(surveyDatas, userId, surveyID, languageCode) {
	try {
		//Ti.API.info('languageArray in survey', languageCode);
		var db = Ti.Database.open(Alloy.Globals.DATABASE);
		db.execute('BEGIN;');

		for (var i = 0; i < surveyDatas.length; i++) {
			if (surveyDatas[i].AnswerType == "LikertResponse") {
				var ansType = 1;
			} else if (surveyDatas[i].AnswerType == "ScrollWheels") {
				var ansType = 2;

			} else if (surveyDatas[i].AnswerType == "YesNO") {
				var ansType = 3;

			} else if (surveyDatas[i].AnswerType == "Clock") {
				var ansType = 4;

			} else if (surveyDatas[i].AnswerType == "Years") {
				var ansType = 5;

			} else if (surveyDatas[i].AnswerType == "Months" || surveyDatas[i].AnswerType == "6") {
				var ansType = 6;

			} else if (surveyDatas[i].AnswerType == "Days" || surveyDatas[i].AnswerType == "7") {
				var ansType = 7;

			} else if (surveyDatas[i].AnswerType == "Textbox" || surveyDatas[i].AnswerType == "8") {
				var ansType = 8;
			}

			var sqlResultSet = db.execute('SELECT * FROM Survey WHERE questionId = ? and userId=?', surveyDatas[i].QuestionId, userId);

			if (!sqlResultSet.isValidRow()) {

				Ti.API.info('i' + i);
				if (surveyDatas[i].IsDeleted == false) {
					db.execute('INSERT INTO Survey(userId,answerType,surveyId,questionId,questionText,language,EnableCustomPopup,ThresholdId,OperatorId,CustomPopupMessage)VALUES (?,?,?,?,?,?,?,?,?,?)', userId, ansType, surveyID, surveyDatas[i].QuestionId, surveyDatas[i].QuestionText, languageCode,surveyDatas[i].EnableCustomPopup,surveyDatas[i].ThresholdId,surveyDatas[i].OperatorId,surveyDatas[i].CustomPopupMessage);
					if (ansType == 2) {

						if (surveyDatas[i].QuestionOptions != null && surveyDatas[i].QuestionOptions.length != 0) {
							db.execute("DELETE FROM surveyOptionList WHERE questionId=? AND userId=?", surveyDatas[i].QuestionId, userId);
							for (var j = 0; j < surveyDatas[i].QuestionOptions.length; j++) {

								db.execute('INSERT INTO surveyOptionList(userId,questionId,optionText)VALUES (?,?,?)', userId, surveyDatas[i].QuestionId, surveyDatas[i].QuestionOptions[j].OptionText);
							};

						}

					}
				}

			} else {

				if (surveyDatas[i].IsDeleted == false) {
					db.execute('UPDATE Survey SET answerType =?,questionText=?,language=?,EnableCustomPopup=?,ThresholdId=?,OperatorId=?, CustomPopupMessage=? where questionId = ? AND userId=?', ansType, surveyDatas[i].QuestionText, languageCode,surveyDatas[i].EnableCustomPopup,surveyDatas[i].ThresholdId,surveyDatas[i].OperatorId,surveyDatas[i].CustomPopupMessage, surveyDatas[i].QuestionId, userId);
					if (ansType == 2) {

						if (surveyDatas[i].QuestionOptions != null && surveyDatas[i].QuestionOptions.length != 0) {
							db.execute("DELETE FROM surveyOptionList WHERE questionId=? AND userId=?", surveyDatas[i].QuestionId, userId);
							for (var j = 0; j < surveyDatas[i].QuestionOptions.length; j++) {

								db.execute('INSERT INTO surveyOptionList(userId,questionId,optionText)VALUES (?,?,?)', userId, surveyDatas[i].QuestionId, surveyDatas[i].QuestionOptions[j].OptionText);
							};

						}

					}
				} else {
					db.execute("DELETE FROM Survey WHERE questionId=? AND userId=?", surveyDatas[i].QuestionId, userId);

				}

			}
		}

		db.execute('COMMIT;');
		db.close();
	} catch(e) {
		db.close();
		throw (e);
	}
};
/**
 * To insert survey types
 */
exports.insertSurveyTypes = function(surveyID, surveyName, userId, IsDeleted, surveyInstruction) {
	try {
		var db = Ti.Database.open(Alloy.Globals.DATABASE);
		db.execute('BEGIN;');
		Ti.API.info('insertSurveyTypes : ', surveyID, "surveyName : ", surveyName);
		Ti.API.info('***insertSurveyTypes surveyInstruction : ', surveyInstruction);

		var sqlResultSet = db.execute('SELECT * FROM SurveyListings WHERE surveyId = ? AND userId=?', surveyID, userId);

		if (!sqlResultSet.isValidRow()) {
			Ti.API.info('Insert Survey : ', surveyName);
			if (IsDeleted == false) {

				db.execute('INSERT INTO SurveyListings(userId,surveyId,surveyName,surveyInstruction)VALUES (?,?,?,?)', userId, surveyID, surveyName, surveyInstruction);
			}

		} else {
			Ti.API.info('update survey', surveyName, IsDeleted);
			if (IsDeleted == false) {
				db.execute('UPDATE SurveyListings SET surveyName =?, surveyInstruction =? where surveyId = ? AND userId=?', surveyName, surveyInstruction, surveyID, userId);
			} else {
				db.execute("DELETE FROM SurveyListings WHERE surveyId = ? AND userId=?", surveyID, userId);
				db.execute("DELETE FROM Survey WHERE surveyId = ? AND userId=?", surveyID, userId);

				var surveyReminder = Ti.App.Properties.getObject("surveyReminder");
				var tempSID = surveyReminder.surveyId;
				var tempSText = surveyReminder.surveyText;
				if (tempSID.length != 0) {
					for (var i = 0; i < tempSID.length; i++) {
						if (tempSID[i] == surveyID) {
							tempSID.splice(i, 1);
							tempSText.splice(i, 1);
							break;
						}
					};
				}
				surveyReminder.surveyId = tempSID;
				surveyReminder.surveyText = tempSText;
				surveyReminder.currentSurvey = 0;
				Ti.API.info('delete survey', surveyReminder);
				Ti.App.Properties.setObject("surveyReminder", surveyReminder);
				if (tempSID.length == 0) {
					var sqlResultSet1 = db.execute('SELECT * FROM LocalSchedule WHERE userID=? and isSurvey=?', userId, 1);
					if (sqlResultSet1.isValidRow()) {
						db.execute("DELETE FROM LocalSchedule WHERE isSurvey = 1 AND userID=?", userId);
						var lastSyncDate = {
							LastUpdatedSurveyDate : "",
							LastUpdatedGameDate : "",
						};
						Ti.App.Properties.setObject('lastSyncDate', lastSyncDate);

					}
				}

			}

		}

		db.execute('COMMIT;');
		db.close();
	} catch(e) {
		db.close();
		throw (e);
	}
};
/**
 * To get survey questions
 */
exports.getSurveyQuestions = function(surveyID) {
	var returnVal = false;
	var surveyQuestions = [];
	var sqlResultSet;
	Ti.API.info('getSurveyQuestions : ', surveyID);
	var db = Ti.Database.open(Alloy.Globals.DATABASE);
	var credentials = Alloy.Globals.getCredentials();
	db.execute('BEGIN;');
	var optionsArray = [];
	try {
		sqlResultSet = db.execute('SELECT * FROM Survey WHERE surveyId = ? and userId=?', surveyID, credentials.userId);
		while (sqlResultSet.isValidRow()) {
			optionsArray = [];
			Ti.API.info('Get survey Questions : ', sqlResultSet.fieldByName('questionText'));
			var qId = sqlResultSet.fieldByName('questionId');
			var langCode = sqlResultSet.fieldByName('language');
			Ti.API.info('langCode in get', langCode);
			var ansType = sqlResultSet.fieldByName('answerType');
			var enablePopup = sqlResultSet.fieldByName('EnableCustomPopup');
			var thresholdValue = sqlResultSet.fieldByName('ThresholdId');
			var operatorValue = sqlResultSet.fieldByName('OperatorId');
			var popupMessage = sqlResultSet.fieldByName('CustomPopupMessage');
			if (ansType == 2 || ansType == "2") {
				var k = 1;
				var sqlResultSet1 = db.execute('SELECT * FROM surveyOptionList WHERE questionId = ?', qId);
				while (sqlResultSet1.isValidRow()) {
					if (k == 1) {
						optionsArray.push({
							value : k,
							title : "Select"
						});

						k += 1;
					}

					optionsArray.push({
						value : k,
						title : sqlResultSet1.fieldByName('optionText')
					});
					k += 1;
					sqlResultSet1.next();
				}
				sqlResultSet1.close();
				Ti.API.info('Options : ', optionsArray);
			}

			surveyQuestions.push({
				"surveyQuestions" : sqlResultSet.fieldByName('questionText'),
				"questionID" : qId,
				"surveyType" : ansType,
				"pickerData" : optionsArray,
				"language" : langCode,
				"enablePopup" : enablePopup,
				"thresholdValue" : thresholdValue,
				"operatorValue" : operatorValue,
				"popupMessage" : popupMessage
			});
			sqlResultSet.next();
		}
		db.execute('COMMIT;');
		sqlResultSet.close();

		db.close();
		Ti.API.info('All surveyQuestions : ', surveyQuestions);
		return surveyQuestions;

	} catch(ex) {
		db.close();
		throw ex;
	}
	return returnVal;
};
/**
 * To get survey Types
 */
exports.getSurveyTypes = function() {
	var returnVal = false;
	var surveyType = [];
	var surveyRows;
	var isGuest = Ti.App.Properties.getString("isGuest", "");
	Ti.API.info('isGuest : ', isGuest);
	var db = Ti.Database.open(Alloy.Globals.DATABASE);
	var credentials = Alloy.Globals.getCredentials();
	db.execute('BEGIN;');
	try {

		surveyRows = db.execute('SELECT * FROM SurveyListings where userId=' + credentials.userId + ' ORDER BY surveyName');
		while (surveyRows.isValidRow()) {
			surveyType.push({
				"surveyID" : surveyRows.fieldByName('surveyId'),
				"questions" : surveyRows.fieldByName('surveyName'),
				"surveyInstruction" : surveyRows.fieldByName('surveyInstruction')
			});
			surveyRows.next();
		}
		Ti.API.info('Survey List : ', surveyType);
		db.execute('COMMIT;');
		surveyRows.close();
		db.close();
		return surveyType;

	} catch(ex) {
		db.close();
		throw ex;
	}
	return returnVal;
};
exports.insertSurveyResult = function(answerArray) {
	try {
		var credentials = Alloy.Globals.getCredentials();

		var db = Ti.Database.open(Alloy.Globals.DATABASE);
		db.execute('BEGIN;');
		Ti.API.info('The insertSurveyResult data is' + JSON.stringify(answerArray));
		groupIDValue = 0;
		var sqlResultSet = db.execute('SELECT max(groupID) as groupID FROM SurveyResultListing where userID=' + credentials.userId);
		if (sqlResultSet.isValidRow()) {
			var groupIDValue = (sqlResultSet.fieldByName('groupID') != null) ? parseInt(sqlResultSet.fieldByName('groupID')) : 0;
		}
		Ti.API.info('Insert answerArray[0].SurveyName : ', answerArray[0].SurveyName);
		groupIDValue = groupIDValue + 1;
		var suveryTime = new Date().toUTCString();
		db.execute('INSERT INTO SurveyResultListing(userID,groupID,surveyID,suveryTime,surveyName)VALUES (?,?,?,?,?)', credentials.userId, groupIDValue, answerArray[0].surveyID, suveryTime, answerArray[0].SurveyName);

		for (var i = 0; i < answerArray.length; i++) {
			Ti.API.info('Insert Survey Q : ', answerArray[i].questionID);
			db.execute('INSERT INTO SurveyResult(userID,groupID,questionID,answer,question)VALUES (?,?,?,?,?)', credentials.userId, groupIDValue, answerArray[i].questionID, answerArray[i].answer, answerArray[i].surveyQuestions);
		}

		db.execute('COMMIT;');
		db.close();
	} catch(e) {
		db.close();
		throw (e);
	}
};
exports.getSurveyResultList = function() {
	var returnVal = false;
	var surveyResult = [];
	var surveyRows;
	var db = Ti.Database.open(Alloy.Globals.DATABASE);
	var credentials = Alloy.Globals.getCredentials();

	db.execute('BEGIN;');
	try {
		surveyRows = db.execute('SELECT groupID as groupID,surveyID as surveyID,suveryTime as suveryTime,surveyName as questions FROM SurveyResultListing where userID=' + credentials.userId + ' ORDER BY groupID DESC');
		while (surveyRows.isValidRow()) {
			surveyResult.push({
				"groupID" : surveyRows.fieldByName('groupID'),
				"surveyID" : surveyRows.fieldByName('surveyID'),
				"suveryTime" : surveyRows.fieldByName('suveryTime'),
				"questions" : surveyRows.fieldByName('questions'),
			});
			surveyRows.next();
		}
		db.execute('COMMIT;');
		surveyRows.close();
		db.close();
		return surveyResult;

	} catch(ex) {
		db.close();
		throw ex;
	}
	return returnVal;
};
exports.getSurveyResultDetails = function(surveyID, groupID) {
	var returnVal = false;
	var surveyResult = [];
	var surveyRows;
	var db = Ti.Database.open(Alloy.Globals.DATABASE);
	var credentials = Alloy.Globals.getCredentials();
	db.execute('BEGIN;');
	try {
		surveyRows = db.execute('SELECT answer ,question as surveyQuestions FROM SurveyResult where groupID=' + groupID + ' and userID=' + credentials.userId);
		while (surveyRows.isValidRow()) {
			surveyResult.push({
				"answer" : surveyRows.fieldByName('answer').toString(),
				"surveyQuestions" : surveyRows.fieldByName('surveyQuestions').toString(),
			});
			surveyRows.next();
		}
		db.execute('COMMIT;');
		surveyRows.close();
		db.close();
		return surveyResult;

	} catch(ex) {
		db.close();
		throw ex;
	}
	return returnVal;
};

/**
 * Insert Alerts
 */
exports.insertAlerts = function(userId, alertbody, type, version, pTestId, pTestName, pIsAdmin, batchID) {
	try {
		Ti.API.info('enter insertAlerts*******');
		// if (Alloy.Globals.Prev_Time != null && Alloy.Globals.Prev_Type != null && Alloy.Globals.Prev_Type == type) {
		// var date1 = Alloy.Globals.Prev_Time;
		// var date2 = new Date();
		// var timeDiff = Math.abs(date2.getTime() - date1.getTime());
		// Ti.API.info('Time Diff : ', timeDiff);
		// if (timeDiff < 10000) {
		// return;
		// }
		// }
		// Alloy.Globals.Prev_Time = new Date();
		// Alloy.Globals.Prev_Type = type;
		var db = Ti.Database.open(Alloy.Globals.DATABASE);
		var credentials = Alloy.Globals.getCredentials();
		var testID = 0;
		var testName = "";

		if (type == "survey") {
			var surveyReminder = Ti.App.Properties.getObject("surveyReminder");
			if (Ti.App.Properties.hasProperty("surveyReminder")) {
				var arrSurveyIDs = surveyReminder.surveyId;
				var arrSurveyTexts = surveyReminder.surveyText;
				Ti.API.info('arrSurveyIDs : ', arrSurveyIDs);
				if (arrSurveyIDs.length != 0) {
					if (arrSurveyIDs.length == 1) {
						testID = arrSurveyIDs[0];
						surveyReminder.currentSurvey = 0;
						testName = arrSurveyTexts[0];
					} else {
						if (surveyReminder.currentSurvey + 1 >= arrSurveyIDs.length) {
							testID = arrSurveyIDs[0];
							surveyReminder.currentSurvey = 0;
							testName = arrSurveyTexts[0];
						} else {
							Ti.API.info('Set testID ');
							testID = arrSurveyIDs[surveyReminder.currentSurvey];
							if (testID == 0) {
								testID = arrSurveyIDs[surveyReminder.currentSurvey + 1];
							}
							testName = arrSurveyTexts[surveyReminder.currentSurvey];
							surveyReminder.currentSurvey = surveyReminder.currentSurvey + 2;
						}

					}
					Ti.API.info('testID : ', testID);
					Ti.App.Properties.setObject("surveyReminder", surveyReminder);
				}
			}

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
		//	Ti.API.info('testID : ', testID, "testName : ", testName);

		db.execute('BEGIN;');
		var vNumber = version;
		if (version == null) {
			vNumber = 0;
		}

		var currentTime = new Date();
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

		if (pIsAdmin == 1) {
			Ti.API.info('pTestId : ', pTestId, "pTestName : ", pTestName);
			var alertRows = db.execute("SELECT * FROM Alerts where testID=" + pTestId + " AND type='" + type + "' AND isLocal=" + 0);
			if (!alertRows.isValidRow()) {
				db.execute('INSERT INTO Alerts(userId,alertBody,type,read,testID,testName,version,isLocal,createdDate,batchID)VALUES (?,?,?,?,?,?,?,?,?,?)', credentials.userId, alertbody, type, 0, pTestId, pTestName, vNumber, 0, formatedDate, batchID);

			} else {
				db.execute('UPDATE Alerts SET  createdDate =? where testID = ? AND isLocal=?', formatedDate, pTestId, 0);

			}

		} else {
			if (testID != 0) {
				Ti.API.info('testID : ', testID, "testName : ", testName);
				var alertRows = db.execute("SELECT * FROM Alerts where type='" + type + "' AND isLocal=" + 1);
				if (!alertRows.isValidRow()) {
					db.execute('INSERT INTO Alerts(userId,alertBody,type,read,testID,testName,version,isLocal,createdDate,batchID)VALUES (?,?,?,?,?,?,?,?,?,?)', credentials.userId, alertbody, type, 0, testID, testName, 0, 1, formatedDate, batchID);

				} else {
					db.execute('UPDATE Alerts SET  createdDate =? where type = ? AND isLocal=?', formatedDate, type, 1);
				}

			}
		}

		db.execute('COMMIT;');
		db.close();
	} catch(e) {
		db.close();
		throw (e);
	}
};

/**
 * For getting the alerts.
 */
exports.getNotificationAlerts = function() {
	var alertResult = [];
	var alertRows;
	var db = Ti.Database.open(Alloy.Globals.DATABASE);
	var credentials = Alloy.Globals.getCredentials();
	try {
		var ReminderClearInterval = Ti.App.Properties.getInt("ReminderClearInterval");
		if (ReminderClearInterval != 1) {
			var currentTime = new Date();
			if (ReminderClearInterval == 2) {
				currentTime.setTime(currentTime.getTime() - (1 * 60 * 60 * 1000));
			} else if (ReminderClearInterval == 3) {
				currentTime.setTime(currentTime.getTime() - (6 * 60 * 60 * 1000));
			}
			Ti.API.info('enter ReminderClearInterval ', ReminderClearInterval);
			//currentTime.setHours(currentTime.getHours() - 3);

			//currentTime.setHours(currentTime.getHours() - ReminderClearInterval);
			//currentTime.setMinutes(currentTime.getMinutes() - 2);
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

			Ti.API.info('Delete Alerts Before : ', formatedDate);
			db.execute("DELETE FROM Alerts where createdDate<= '" + formatedDate + "'");
		}
		alertRows = db.execute('SELECT ID,alertBody,type,read,testID,testName,version,createdDate,batchID,isLocal FROM Alerts where UserId=' + credentials.userId + ' ORDER BY ID DESC');
		while (alertRows.isValidRow()) {
			alertResult.push({
				"ID" : alertRows.fieldByName('ID'),
				"alertBody" : alertRows.fieldByName('alertBody'),
				"type" : alertRows.fieldByName('type'),
				"read" : alertRows.fieldByName('read'),
				"testID" : alertRows.fieldByName('testID'),
				"testName" : alertRows.fieldByName('testName'),
				"version" : alertRows.fieldByName('version'),
				"createdDate" : alertRows.fieldByName('createdDate'),
				"batchID" : alertRows.fieldByName('batchID'),
				"isLocal" : alertRows.fieldByName('isLocal')
			});
			alertRows.next();
		}
		alertRows.close();
		db.close();
		return alertResult;

	} catch(ex) {
		db.close();
		Ti.API.info('error of sql', JSON.stringify(ex));
		throw ex;
	}
};
/**
 * Deleting the alerts.
 */
exports.deleteAlerts = function(ID) {
	var returnVal = false;
	var credentials = Alloy.Globals.getCredentials();
	var db = Ti.Database.open(Alloy.Globals.DATABASE);
	db.execute('BEGIN;');
	try {
		db.execute("DELETE FROM Alerts WHERE ID=? AND UserId=?", ID, credentials.userId);
		db.execute('COMMIT;');
		db.close();
		returnVal = true;

	} catch(ex) {
		db.close();
		throw ex;
	}
	return returnVal;
};
exports.updateAlerts = function(ID) {
	var returnVal = false;
	var credentials = Alloy.Globals.getCredentials();
	var db = Ti.Database.open(Alloy.Globals.DATABASE);
	db.execute('BEGIN;');
	try {
		db.execute("Delete from Alerts WHERE ID=? AND UserId=?", ID, credentials.userId);
		db.execute('COMMIT;');
		db.close();
		returnVal = true;

	} catch(ex) {
		db.close();
		throw ex;
	}
	return returnVal;
};
exports.updateBatchAlerts = function(ID) {
	Ti.API.info('UpdateBatch');
	var returnVal = false;
	var credentials = Alloy.Globals.getCredentials();
	var db = Ti.Database.open(Alloy.Globals.DATABASE);
	db.execute('BEGIN;');
	try {
		db.execute("Delete from Alerts WHERE testID=? AND UserId=?", ID, credentials.userId);
		db.execute('COMMIT;');
		db.close();
		returnVal = true;

	} catch(ex) {
		db.close();
		throw ex;
	}
	return returnVal;
};
exports.saveLocationAdress = function(loggedUserId, selectedLoc, CurrentLoc, environment) {
	try {
		var db = Ti.Database.open(Alloy.Globals.DATABASE);
		db.execute('BEGIN;');
		var curTime = new Date().toUTCString();
		if (environment == 0) {
			var getTime = new Date().getTime();
			Ti.App.Properties.setString('locationUpdate', getTime);
			Ti.API.info('Update Significant location : ', CurrentLoc, curTime);
		} else {
			Ti.API.info('Update Env location : ', CurrentLoc, curTime);
		}
		db.execute('INSERT INTO location(UserId,address,selectedLocation,environment,updateTime)VALUES (?,?,?,?,?)', loggedUserId, CurrentLoc, selectedLoc, environment, curTime);
		db.execute('COMMIT;');
		db.close();
	} catch(e) {
		db.close();
		throw (e);
	}
};
exports.getLocationList = function() {
	var returnVal = false;
	var locationResult = [];
	var locationRows;
	var db = Ti.Database.open(Alloy.Globals.DATABASE);
	var credentials = Alloy.Globals.getCredentials();
	db.execute('BEGIN;');
	try {
		locationRows = db.execute('SELECT * FROM location  where environment=0 and userID=' + credentials.userId + ' ORDER BY ID DESC');
		while (locationRows.isValidRow()) {
			locationResult.push({
				"address" : locationRows.fieldByName('address'),
				"updateTime" : locationRows.fieldByName('updateTime'),

			});
			locationRows.next();
		}
		db.execute('COMMIT;');
		locationRows.close();
		db.close();
		return locationResult;

	} catch(ex) {
		db.close();
		throw ex;
	}
	return returnVal;
};
exports.getEnvironmentList = function() {
	var returnVal = false;
	var locationResult = [];
	var locationRows;
	var db = Ti.Database.open(Alloy.Globals.DATABASE);
	var credentials = Alloy.Globals.getCredentials();
	db.execute('BEGIN;');
	try {
		locationRows = db.execute('SELECT * FROM location  where environment=1 and userID=' + credentials.userId + ' ORDER BY ID DESC');
		while (locationRows.isValidRow()) {
			locationResult.push({
				"address" : locationRows.fieldByName('address'),
				"updateTime" : locationRows.fieldByName('updateTime'),
				"selectedLocation" : locationRows.fieldByName('selectedLocation'),
			});
			locationRows.next();
		}
		db.execute('COMMIT;');
		locationRows.close();
		db.close();
		return locationResult;

	} catch(ex) {
		db.close();
		throw ex;
	}
	return returnVal;
};
/**
 * Insert Article data
 */
exports.insertArticles = function(blogTitle, blogContent, blogImageURL, MainContent) {
	try {
		var db = Ti.Database.open(Alloy.Globals.DATABASE);
		db.execute('BEGIN;');
		db.execute('INSERT INTO Articles(BlogTitle,Content,ImageURL,MainContent)VALUES (?,?,?,?)', blogTitle, blogContent, blogImageURL, MainContent);
		db.execute('COMMIT;');
		//sqlResultSet.close();
		db.close();
	} catch(e) {
		db.close();
		throw (e);
	}
};

exports.deleteArticles = function() {
	try {
		var db = Ti.Database.open(Alloy.Globals.DATABASE);
		db.execute('BEGIN;');
		db.execute("DELETE FROM Articles");
		db.execute('COMMIT;');
		//sqlResultSet.close();
		db.close();
	} catch(e) {
		db.close();
		throw (e);
	}
};

exports.getArticles = function(startCount) {

	var articleArray = [];

	var db = Ti.Database.open(Alloy.Globals.DATABASE);
	var credentials = Alloy.Globals.getCredentials();
	db.execute('BEGIN;');
	try {
		var articleRows = db.execute('SELECT * FROM Articles LIMIT ?,10', startCount);
		while (articleRows.isValidRow()) {
			articleArray.push({
				"BlogTitle" : articleRows.fieldByName('BlogTitle'),
				"Content" : articleRows.fieldByName('Content'),
				"ImageURL" : articleRows.fieldByName('ImageURL'),
				"MainContent" : articleRows.fieldByName('MainContent'),
			});
			articleRows.next();
		}
		db.execute('COMMIT;');
		articleRows.close();
		db.close();
		return articleArray;

	} catch(ex) {
		db.close();
		throw ex;
	}

};
exports.getSurveyName = function(surveyId) {
	try {
		var credentials = Alloy.Globals.getCredentials();
		var suverName = "";
		var db = Ti.Database.open(Alloy.Globals.DATABASE);
		db.execute('BEGIN;');

		var sqlResultSet = db.execute('SELECT surveyName FROM SurveyListings where surveyId=' + surveyId + ' and userId=' + credentials.userId);
		if (sqlResultSet.isValidRow()) {
			suverName = (sqlResultSet.fieldByName('surveyName') != null) ? sqlResultSet.fieldByName('surveyName') : "";
		}

		db.execute('COMMIT;');
		db.close();
		return suverName;
	} catch(e) {
		db.close();
		throw (e);
	}
};

exports.getSurveyInstruction = function(surveyId) {
	try {
		var credentials = Alloy.Globals.getCredentials();
		var surveyInstruction = "";
		var db = Ti.Database.open(Alloy.Globals.DATABASE);
		db.execute('BEGIN;');

		var sqlResultSet = db.execute('SELECT surveyInstruction FROM SurveyListings where surveyId=' + surveyId + ' and userId=' + credentials.userId);
		if (sqlResultSet.isValidRow()) {
			surveyInstruction = (sqlResultSet.fieldByName('surveyInstruction') != null) ? sqlResultSet.fieldByName('surveyInstruction') : "";
		}

		db.execute('COMMIT;');
		db.close();
		return surveyInstruction;
	} catch(e) {
		db.close();
		throw (e);
	}
};

exports.updateShedules = function(sheduleData) {
	try {
		var db = Ti.Database.open(Alloy.Globals.DATABASE);
		db.execute('BEGIN;');
		Ti.API.info('updateShedules is ' + JSON.stringify(sheduleData));
		var sqlResultSet = db.execute('SELECT * FROM Settings WHERE userSettingID = ? AND userID=?', sheduleData.userSettingsId, sheduleData.userId);

		if (sqlResultSet.isValidRow()) {

			Ti.API.info('Update settings');
			db.execute('UPDATE Settings SET  sympSurveySlotID =?, sympSurveySlotTime =?, sympSurveyRepeatID =?,cognTestSlotID=?,cognTestSlotTime=?,cognTestRepeatID=? where userSettingID = ? AND userID=?', sheduleData.sympSurveySlotID, sheduleData.sympSurveySlotTime, sheduleData.sympSurveyRepeatID, sheduleData.cognTestSlotID, sheduleData.cognTestSlotTime, sheduleData.cognTestRepeatID, sheduleData.userSettingsId, sheduleData.userId);

		}
		db.execute('COMMIT;');
		//sqlResultSet.close();
		db.close();
	} catch(e) {
		db.close();
		throw (e);
	}
};
exports.insertAdminShedule = function(data) {
	try {
		var db = Ti.Database.open(Alloy.Globals.DATABASE);
		db.execute('BEGIN;');
		//Ti.API.info('The settings data in insert is' + JSON.stringify(settingsData));
		var sqlResultSet = db.execute('SELECT * FROM AdminShedule WHERE scheduleID = ? AND isSurvey=? AND userID=?', data.scheduleID, data.IsSurvey, data.userID);

		if (!sqlResultSet.isValidRow()) {
			//Ti.API.info('entered insert ' + settingsData.userId);
			if (!data.IsDeleted) {
				db.execute('INSERT INTO AdminShedule(userID,scheduleID,testID,testName,versionNumber,startDate,startTime,repeateID,isSurvey,batchID)VALUES (?,?,?,?,?,?,?,?,?,?)', data.userID, data.scheduleID, data.testID, data.testName, data.versionNumber, data.startDate, data.startTime, data.repeateID, data.IsSurvey, data.batchID);
			}

		} else {
			if (!data.IsDeleted) {
				db.execute('UPDATE AdminShedule SET testID=?,testName=?, startDate =?, startTime =?, repeateID =?,versionNumber=?,batchID=? where scheduleID = ? AND isSurvey=? AND userID=? ', data.testID, data.testName, data.startDate, data.startTime, data.repeateID, data.versionNumber, data.batchID, data.scheduleID, data.IsSurvey, data.userID);
			} else {
				db.execute("Delete from AdminShedule WHERE scheduleID=? AND isSurvey=? AND userID=?", data.scheduleID, data.IsSurvey, data.userID);
			}

		}
		db.execute('COMMIT;');
		//sqlResultSet.close();
		db.close();
	} catch(e) {
		db.close();
		throw (e);
	}
};
exports.insertLocalShedule = function(data) {
	try {
		var db = Ti.Database.open(Alloy.Globals.DATABASE);
		db.execute('BEGIN;');
		Ti.API.info('insertLocalShedule is' + JSON.stringify(data));
		var sqlResultSet = db.execute('SELECT * FROM LocalSchedule WHERE userID=? and isSurvey=?', data.userID, data.isSurvey);

		if (!sqlResultSet.isValidRow()) {
			db.execute('INSERT INTO LocalSchedule(userID,repeateID,isSurvey,setDate)VALUES (?,?,?,?)', data.userID, data.repeateID, data.isSurvey, data.setDate);

		} else {
			db.execute('UPDATE LocalSchedule SET  repeateID =?, setDate =? where  userID=? and isSurvey=?', data.repeateID, data.setDate, data.userID, data.isSurvey);
		}
		db.execute('COMMIT;');
		//sqlResultSet.close();
		db.close();
	} catch(e) {
		db.close();
		throw (e);
	}
};
exports.getAdminShedules = function(startCount) {

	var sheduleArray = [];

	var db = Ti.Database.open(Alloy.Globals.DATABASE);
	var credentials = Alloy.Globals.getCredentials();
	db.execute('BEGIN;');
	try {
		var currentDate = new Date();
		var currentMonth = currentDate.getMonth() + 1;
		var currentFullDate = currentDate.getDate();
		if (currentMonth < 10)
			currentMonth = "0" + currentMonth;
		if (currentFullDate < 10)
			currentFullDate = "0" + currentFullDate;
		var scheduleDateFormat = currentDate.getFullYear() + "-" + currentMonth + "-" + currentFullDate + "T00:00:00";

		var sheduleRows = db.execute('SELECT * FROM AdminShedule WHERE userID=?', credentials.userId);
		while (sheduleRows.isValidRow()) {

			if (sheduleRows.fieldByName('repeateID') === 2 || sheduleRows.fieldByName('repeateID') === 3 || sheduleRows.fieldByName('repeateID') === 4) {
				var hoursArray = "";
				if (sheduleRows.fieldByName('repeateID') === 2)
					hoursArray = Alloy.Globals.threeHoursRepeatTimeArray;
				else if (sheduleRows.fieldByName('repeateID') === 3)
					hoursArray = Alloy.Globals.sixHoursRepeatTimeArray;
				else if (sheduleRows.fieldByName('repeateID') === 4)
					hoursArray = Alloy.Globals.tewelHoursRepeatTimeArray;
				for (var t = 0; t < hoursArray.length; t++) {
					var twentyFourHoursFormatTime = commonFunctions.ConvertTwentyFourHourForLocal(hoursArray[t]);
					Ti.API.info('twentyFourHoursFormatTime', twentyFourHoursFormatTime);

					var locSt = new Date();
					var splitHrs = twentyFourHoursFormatTime.split(":");
					locSt.setHours(splitHrs[0]);
					locSt.setMinutes(splitHrs[1]);
					Ti.API.info('locSt', locSt);
					var hrs = locSt.getUTCHours();
					var min = locSt.getUTCMinutes();
					if (locSt.getUTCHours() < 10) {
						hrs = "0" + locSt.getUTCHours();
					}
					if (locSt.getUTCMinutes() < 10) {
						min = "0" + locSt.getUTCMinutes();
					}
					var tentyFourHourUtc = hrs + ":" + min;
					Ti.API.info('tentyFourHourUtc', tentyFourHourUtc);
					var startTime = currentFullDate + "-" + currentMonth + "-" + currentDate.getFullYear() + " " + tentyFourHourUtc + ":00";
					Ti.API.info('startTime', startTime);
					sheduleArray.push({
						"testID" : sheduleRows.fieldByName('testID'),
						"testName" : sheduleRows.fieldByName('testName'),
						"versionNumber" : sheduleRows.fieldByName('versionNumber'),
						"startDate" : scheduleDateFormat,
						"startTime" : startTime,
						"repeateID" : 5,
						"isSurvey" : sheduleRows.fieldByName('isSurvey'),
						"batchID" : (sheduleRows.fieldByName('batchID') != null) ? sheduleRows.fieldByName('batchID') : ""

					});
				}
			} else if (sheduleRows.fieldByName('repeateID') === 11) {
				var hoursStr = sheduleRows.fieldByName('startTime');
				var hoursArray = hoursStr.split(",");
				for (var t = 0; t < hoursArray.length; t++) {
					sheduleArray.push({
						"testID" : sheduleRows.fieldByName('testID'),
						"testName" : sheduleRows.fieldByName('testName'),
						"versionNumber" : sheduleRows.fieldByName('versionNumber'),
						"startDate" : scheduleDateFormat,
						"startTime" : hoursArray[t],
						"repeateID" : 5,
						"isSurvey" : sheduleRows.fieldByName('isSurvey'),
						"batchID" : (sheduleRows.fieldByName('batchID') != null) ? sheduleRows.fieldByName('batchID') : ""
					});
				}
			} else {
				sheduleArray.push({
					"testID" : sheduleRows.fieldByName('testID'),
					"testName" : sheduleRows.fieldByName('testName'),
					"versionNumber" : sheduleRows.fieldByName('versionNumber'),
					"startDate" : sheduleRows.fieldByName('startDate'),
					"startTime" : sheduleRows.fieldByName('startTime'),
					"repeateID" : sheduleRows.fieldByName('repeateID'),
					"isSurvey" : sheduleRows.fieldByName('isSurvey'),
					"batchID" : (sheduleRows.fieldByName('batchID') != null) ? sheduleRows.fieldByName('batchID') : ""
				});
			}
			sheduleRows.next();
		}

		db.execute('COMMIT;');
		sheduleRows.close();
		db.close();
		return sheduleArray;

	} catch(ex) {
		db.close();
		throw ex;
	}

};
exports.getLocalShedules = function() {

	var sheduleArray = [];

	var db = Ti.Database.open(Alloy.Globals.DATABASE);
	var credentials = Alloy.Globals.getCredentials();
	db.execute('BEGIN;');
	try {
		var sheduleRows = db.execute('SELECT * FROM LocalSchedule WHERE userID=?', credentials.userId);
		while (sheduleRows.isValidRow()) {

			sheduleArray.push({
				"setDate" : sheduleRows.fieldByName('setDate'),
				"repeateID" : sheduleRows.fieldByName('repeateID'),
				"isSurvey" : sheduleRows.fieldByName('isSurvey'),
			});
			sheduleRows.next();
		}
		db.execute('COMMIT;');
		sheduleRows.close();
		db.close();
		return sheduleArray;

	} catch(ex) {
		db.close();
		throw ex;
	}

};
