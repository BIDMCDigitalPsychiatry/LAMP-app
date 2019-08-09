// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
/**
 * Declarations
 */
var args = arguments[0] || {};
var commonFunctions = require('commonFunctions');
var commonDB = require('commonDB');
var serviceManager = require('serviceManager');
var credentials = Alloy.Globals.getCredentials();
var startTime = "";
var endTime = "";
var points = 0;
var gamePoints = 0;
var correctLines = 0;
var lineStartTime = new Date();
var lineEndTime = new Date();
var totalgameAttempt = 0;
var gameStarted = 0;
var targetIndex = 0;
var gameFinishStatus = 0;
var countDownTimer = null;
var lineRoutArrayFull = [];
var lineRoutArray = [];
var lastWrongUndo = null;
var jewelType = Ti.App.Properties.getString("jewelType", 1);
var timerStartCount = 60;
var remainingSeconds = 0;
var totalCollectedJewels = 0;
var totalCollectedBonus = 0;
var totalColelctedScore = 0;
var currentpenalty = 0;
var currentInfoIconIndex = 0;
var resultSubmited = false;
var startWithHintImg = null;
var vNumber = 1;
var LangCode = Ti.App.Properties.getString('languageCode');
var noOfDiamondsToDisplayForTrailA = Alloy.Globals.jewelsTrailAMinDiamonds;
var noOfDiamondsToDisplayForTrailB = Alloy.Globals.jewelsTrailBMinDiamonds;
var noOfDiamondShapesToDisplayForTrailB = Alloy.Globals.jewelsTrailBMinShapes;
var diamondShapes = ["/diamond1.png", "/diamond2.png", "/diamond3.png", "/diamond4.png"];
var diamondShapesTransparent = ["/diamond1_trans.png", "/diamond2_trans.png", "/diamond3_trans.png", "/diamond4_trans.png"];
var startWithHintDiamondShapes = ["/diamond1-sm.png", "/diamond2-sm.png", "/diamond3-sm.png", "/diamond4-sm.png"];
var StatusType = 1;
var jewelTimerStart = 0;
var notificationGame;
var calculateTime;
var playedTime;
var spinWheelScore;
var diamondSizeForTrailB = {
	"version" : [{
		"diamond_size" : [{
			"width" : "30dp",
			"height" : "30dp"
		}, {
			"width" : "30dp",
			"height" : "38dp"
		}, {
			"width" : "38dp",
			"height" : "32dp"
		}, {
			"width" : "28dp",
			"height" : "38dp"
		}]
	}, {
		"diamond_size" : [{
			"width" : "35dp",
			"height" : "35dp"
		}, {
			"width" : "35dp",
			"height" : "40dp"
		}, {
			"width" : "30dp",
			"height" : "32dp"
		}, {
			"width" : "28dp",
			"height" : "38dp"
		}]
	}, {
		"diamond_size" : [{
			"width" : "33dp",
			"height" : "33dp"
		}, {
			"width" : "33dp",
			"height" : "45dp"
		}, {
			"width" : "32dp",
			"height" : "31dp"
		}, {
			"width" : "30dp",
			"height" : "36dp"
		}]
	}, {
		"diamond_size" : [{
			"width" : "35dp",
			"height" : "35dp"
		}, {
			"width" : "35dp",
			"height" : "35dp"
		}, {
			"width" : "30dp",
			"height" : "38dp"
		}, {
			"width" : "30dp",
			"height" : "32dp"
		}]
	}, {
		"diamond_size" : [{
			"width" : "35dp",
			"height" : "35dp"
		}, {
			"width" : "35dp",
			"height" : "40dp"
		}, {
			"width" : "30dp",
			"height" : "38dp"
		}, {
			"width" : "35dp",
			"height" : "32dp"
		}]
	}, {
		"diamond_size" : [{
			"width" : "33dp",
			"height" : "40dp"
		}, {
			"width" : "30dp",
			"height" : "38dp"
		}, {
			"width" : "30dp",
			"height" : "30dp"
		}, {
			"width" : "38dp",
			"height" : "32dp"
		}]
	}, {
		"diamond_size" : [{
			"width" : "33dp",
			"height" : "40dp"
		}, {
			"width" : "35dp",
			"height" : "35dp"
		}, {
			"width" : "30dp",
			"height" : "36dp"
		}, {
			"width" : "35dp",
			"height" : "30dp"
		}]
	}, {
		"diamond_size" : [{
			"width" : "30dp",
			"height" : "38dp"
		}, {
			"width" : "30dp",
			"height" : "30dp"
		}, {
			"width" : "35dp",
			"height" : "30dp"
		}, {
			"width" : "38dp",
			"height" : "32dp"
		}]
	}]
};

var diamondHintSizeForTrailB = {
	"version" : [{
		"diamond_size" : [{
			"width" : "23dp",
			"height" : "22dp"
		}, {
			"width" : "22dp",
			"height" : "31dp"
		}, {
			"width" : "29dp",
			"height" : "24dp"
		}, {
			"width" : "22dp",
			"height" : "35dp"
		}]
	}, {
		"diamond_size" : [{
			"width" : "28dp",
			"height" : "26dp"
		}, {
			"width" : "23dp",
			"height" : "30dp"
		}, {
			"width" : "21dp",
			"height" : "22dp"
		}, {
			"width" : "22dp",
			"height" : "35dp"
		}]
	}, {
		"diamond_size" : [{
			"width" : "21dp",
			"height" : "22dp"
		}, {
			"width" : "22dp",
			"height" : "35dp"
		}, {
			"width" : "22dp",
			"height" : "22dp"
		}, {
			"width" : "22dp",
			"height" : "30dp"
		}]
	}, {
		"diamond_size" : [{
			"width" : "29dp",
			"height" : "24dp"
		}, {
			"width" : "23dp",
			"height" : "23dp"
		}, {
			"width" : "23dp",
			"height" : "31dp"
		}, {
			"width" : "21dp",
			"height" : "23dp"
		}]
	}, {
		"diamond_size" : [{
			"width" : "22dp",
			"height" : "22dp"
		}, {
			"width" : "23dp",
			"height" : "30dp"
		}, {
			"width" : "22dp",
			"height" : "31dp"
		}, {
			"width" : "27dp",
			"height" : "26dp"
		}]
	}, {
		"diamond_size" : [{
			"width" : "23dp",
			"height" : "30dp"
		}, {
			"width" : "23dp",
			"height" : "31dp"
		}, {
			"width" : "22dp",
			"height" : "23dp"
		}, {
			"width" : "29dp",
			"height" : "23dp"
		}]
	}, {
		"diamond_size" : [{
			"width" : "22dp",
			"height" : "36dp"
		}, {
			"width" : "22dp",
			"height" : "22dp"
		}, {
			"width" : "23dp",
			"height" : "30dp"
		}, {
			"width" : "29dp",
			"height" : "24dp"
		}]
	}, {
		"diamond_size" : [{
			"width" : "23dp",
			"height" : "31dp"
		}, {
			"width" : "22dp",
			"height" : "22dp"
		}, {
			"width" : "27dp",
			"height" : "26dp"
		}, {
			"width" : "29dp",
			"height" : "23dp"
		}]
	}]
};

/**
 * Handles report image click
 */

$.headerView.on('reportButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});

/**
 * Window open function
 */
$.jewelsTrailsA.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
			}
		}
		var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
		var spinRecords = spinInfo.lampRecords;
		var notiGameScore;

		if (args.fromNotification === true && args.isLocal != 1) {
			notificationGame = true;
			dateTimeFormat(args.createdDate);
			if (spinRecords != 0) {
				notiGameScore = Math.trunc(100 / spinRecords);
				Ti.API.info(' ***** notiGameScore ***** ' + notiGameScore);
				if (playedTime >= 5) {
					calculateTime = Math.trunc(parseInt(playedTime) / 5);
					Ti.API.info(' ***** calculateTime ***** ' + calculateTime);
					spinWheelScore = notiGameScore - calculateTime;
				} else {
					spinWheelScore = notiGameScore;
				}
			}
		} else {
			notificationGame = false;
			spinWheelScore = 5;
		}
		if (args.type == 1) {
			$.messageLabel.text = commonFunctions.L('jwelA', LangCode);
		} else {
			$.messageLabel.text = commonFunctions.L('jwelB', LangCode);
		}
		var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
		vNumber = versionsInfo.Jewel;
		if (vNumber == "") {
			versionsInfo.Jewel = 2;
			vNumber = 1;
		} else if (vNumber == 1 || vNumber == "1") {
			versionsInfo.Jewel = 2;
		} else if (vNumber == 2 || vNumber == "2") {
			versionsInfo.Jewel = 3;
		} else if (vNumber == 3 || vNumber == "3") {
			versionsInfo.Jewel = 4;
		} else if (vNumber == 4 || vNumber == "4") {
			versionsInfo.Jewel = 5;
		} else if (vNumber == 5 || vNumber == "5") {
			versionsInfo.Jewel = 6;
		} else if (vNumber == 6 || vNumber == "6") {
			versionsInfo.Jewel = 7;
		} else if (vNumber == 7 || vNumber == "7") {
			versionsInfo.Jewel = 8;
		} else if (vNumber == 8 || vNumber == "8") {
			versionsInfo.Jewel = 1;
		}
		Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);

		noOfDiamondShapesToDisplayForTrailB = commonFunctions.getJewelsTrailBGameDiamondsShapesToDisplay(credentials.userId.toString());

		Ti.API.info("Game Level = " + vNumber);

		setStartWithHint();

		if (args.type == 1) {
			var titleText = commonFunctions.L('jwelA', LangCode);
			if (Ti.Platform.osname == "ipad") {
				$.headerView.setTitle(titleText);
			} else {
				$.headerView.setTitle(commonFunctions.trimText(titleText, 12));
			}

		} else {
			var titleText = commonFunctions.L('jwelB', LangCode);
			if (Ti.Platform.osname == "ipad") {
				$.headerView.setTitle(titleText);
			} else {
				$.headerView.setTitle(commonFunctions.trimText(titleText, 12));
			}
		}
		$.headerView.setQuitViewVisibility(true);
		$.headerView.setReportViewVisibility(true);
		$.headerView.setReportImage("/images/common/report_icn.png");
		$.headerView.setQuitViewPosition();
		var gameInfo = commonDB.getGameScore(credentials.userId);
		Ti.API.info('gameInfo : ', gameInfo);
		for (var i = 0; i < gameInfo.length; i++) {
			if (args.type == 1) {
				if (gameInfo[i].gameID == 17) {
					gamePoints = gameInfo[i].points;
					Ti.API.info('gamePoints : ', gamePoints);
				}
			} else {
				if (gameInfo[i].gameID == 18) {
					gamePoints = gameInfo[i].points;
					Ti.API.info('gamePoints : ', gamePoints);
				}

			}
		}
		if (args.type == 1) {
			var jewelInfo = commonDB.getJewelsCount(1);
		} else {
			var jewelInfo = commonDB.getJewelsCount(2);
		}
		Ti.API.info('jewelInfo : ', jewelInfo);
		if (jewelInfo.length != 0) {
			totalCollectedJewels = jewelInfo[0].totalJewel;
			totalCollectedBonus = jewelInfo[0].totalBonus;
			totalColelctedScore = jewelInfo[0].totalScore;
		}
		var retrievedJSONStr = Ti.App.Properties.getString('JewelsTrailsASettings', 'JewelsTrailsASettings not found');
		var jewelTrailsASettingsJSON = JSON.parse(retrievedJSONStr);
		var retrievedJSONStrB = Ti.App.Properties.getString('JewelsTrailsBSettings', 'JewelsTrailsBSettings not found');
		var jewelTrailsBSettingsJSON = JSON.parse(retrievedJSONStrB);
		if (args.type == 1) {
			var level = Ti.App.Properties.getInt('difficultyTypeA');
		} else {
			var level = Ti.App.Properties.getInt('difficultyTypeB');
		}

		Ti.API.info('level is', level);
		if (level == null || level == "" || level == 0) {
			level = 1;
		}
		if (args.type == 1) {
			if (level == 1) {
				timerStartCount = jewelTrailsASettingsJSON["NoOfSeconds_Beg"] ? jewelTrailsASettingsJSON["NoOfSeconds_Beg"] : Alloy.Globals.jewelsTrailABeginnerTimerDefault;
			} else if (level == 2) {
				timerStartCount = jewelTrailsASettingsJSON["NoOfSeconds_Int"] ? jewelTrailsASettingsJSON["NoOfSeconds_Int"] : Alloy.Globals.jewelsTrailAIntermediateTimerDefault;
			} else if (level == 3) {
				timerStartCount = jewelTrailsASettingsJSON["NoOfSeconds_Adv"] ? jewelTrailsASettingsJSON["NoOfSeconds_Adv"] : Alloy.Globals.jewelsTrailAAdvancedTimerDefault;
			} else if (level == 4) {
				timerStartCount = jewelTrailsASettingsJSON["NoOfSeconds_Exp"] ? jewelTrailsASettingsJSON["NoOfSeconds_Exp"] : Alloy.Globals.jewelsTrailAExpertTimerDefault;
			}
		} else {
			if (level == 1) {
				timerStartCount = jewelTrailsBSettingsJSON["NoOfSeconds_Beg"] ? jewelTrailsBSettingsJSON["NoOfSeconds_Beg"] : Alloy.Globals.jewelsTrailBBeginnerTimerDefault;
			} else if (level == 2) {
				timerStartCount = jewelTrailsBSettingsJSON["NoOfSeconds_Int"] ? jewelTrailsBSettingsJSON["NoOfSeconds_Int"] : Alloy.Globals.jewelsTrailBIntermediateTimerDefault;
			} else if (level == 3) {
				timerStartCount = jewelTrailsBSettingsJSON["NoOfSeconds_Adv"] ? jewelTrailsBSettingsJSON["NoOfSeconds_Adv"] : Alloy.Globals.jewelsTrailBAdvancedTimerDefault;
			} else if (level == 4) {
				timerStartCount = jewelTrailsBSettingsJSON["NoOfSeconds_Exp"] ? jewelTrailsBSettingsJSON["NoOfSeconds_Exp"] : Alloy.Globals.jewelsTrailBExpertTimerDefault;
			}

		}

		if (args.type == 1) {
			createGame();
		} else {
			createGameB();
		}

	} catch(ex) {
		commonFunctions.handleException("jewelsTrailsA", "open", ex);
	}
});

/**
 * Date Time Format
 */
function dateTimeFormat(createdDate) {
	Ti.API.info('args.createdDate : ', createdDate);
	var createdDateTime = createdDate.split(" ");
	Ti.API.info(' ***** createdDateTime ***** ' + createdDateTime);
	var datePart = createdDateTime[0].split("-");
	var day = datePart[1];
	var month = datePart[2];
	var year = datePart[0];
	var myCreatedDate = day + "/" + month + "/" + year;

	var timePart = createdDateTime[1].split(":");
	var hour = timePart[0];
	var min = timePart[1];
	var second = timePart[2];
	var myCreatedTime = hour + ":" + min + ":" + second;

	var resultDate = myCreatedDate + " " + myCreatedTime;

	Ti.API.info('*** resultDate **** ' + resultDate);

	var myDate = new Date(resultDate).getTime();
	var curDate = new Date().getTime();
	Ti.API.info(' ***** myDate ***** ' + myDate);
	Ti.API.info(' ***** curDate ***** ' + curDate);
	var timeDifference = curDate - myDate;
	Ti.API.info(' ***** timeDifference ***** ' + timeDifference);

	playedTime = parseInt(timeDifference) / 60000;
	Ti.API.info(' ***** playedTime ***** ' + playedTime);
}

/**
 * Android back button handler
 */
$.jewelsTrailsA.addEventListener('android:back', function() {
	goBack();
});

/**
 * Header back button click handler
 */
$.headerView.on('backButtonClick', function(e) {

	goBack();
});

/**
 * Handles report image click
 */
$.headerView.on('reportButtonClick', function(e) {

	commonFunctions.sendScreenshot();
});

/**
 * Header quit button click
 */
$.headerView.on('quitButtonClick', function(e) {
	//Ti.App.removeEventListener('getValues', getValues);
	Ti.App.removeEventListener('totalScoreClick', totalScoreClick);
	Ti.App.removeEventListener('ReportClick', ReportClick);
	Ti.App.removeEventListener('exitScoreView', exitScoreView);
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}
	endTime = new Date().toUTCString();
	if (lineRoutArray.length != 0) {
		lineRoutArrayFull.push({
			"Routes" : lineRoutArray,

		});
		lineRoutArray = [];
	}
	getValues();

});

/**
 * goBack function handler
 */
function goBack(e) {
	Ti.App.removeEventListener('totalScoreClick', totalScoreClick);
	Ti.App.removeEventListener('ReportClick', ReportClick);
	Ti.App.removeEventListener('exitScoreView', exitScoreView);
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}
	endTime = new Date().toUTCString();
	if (lineRoutArray.length != 0) {
		lineRoutArrayFull.push({
			"Routes" : lineRoutArray,

		});
		lineRoutArray = [];
	}
	getValues();

}

/**
 * Function to handle Timer
 */
function startTimer() {
	var timer = timerStartCount;
	var minutes = 0;
	var seconds = 0;
	startTime = new Date().toUTCString();
	countDownTimer = setInterval(function() {
		if (timer == timerStartCount) {
			if (startTime == "") {

				Ti.API.info('startTime JewelsA : ', startTime);
			}
		}
		minutes = parseInt(timer / 60, 10);
		seconds = parseInt(timer % 60, 10);

		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;
		remainingSeconds = timer;
		$.countTimer.text = minutes + ":" + seconds;
		if (timer == 0) {
			if (countDownTimer != null) {
				clearInterval(countDownTimer);
			}
			$.contentView.touchEnabled = false;
			$.messageLabel.text = commonFunctions.L('intructionLabel3', LangCode);

			$.messageView.visible = true;

			endTime = new Date().toUTCString();
			if (lineRoutArray.length != 0) {
				lineRoutArrayFull.push({
					"Routes" : lineRoutArray,

				});
				lineRoutArray = [];
			}
			getValues();

		}

		timer -= 1;
	}, 1000);
}

Ti.App.addEventListener('getValues', getValuesFromPopup);
Ti.App.addEventListener('totalScoreClick', totalScoreClick);
Ti.App.addEventListener('ReportClick', ReportClick);
Ti.App.addEventListener('exitScoreView', exitScoreView);

/**
 * Function calls on scroll view exit
 */
function exitScoreView() {

	Ti.App.removeEventListener('totalScoreClick', totalScoreClick);
	Ti.App.removeEventListener('ReportClick', ReportClick);
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
	}
	endTime = new Date().toUTCString();
	getValues();
}

/**
 * getValues event handler
 */
function getValues() {
	if (startTime == null || startTime == "") {
		onSaveTrailsBGameFailure();
		return;
	}
	if (resultSubmited == false) {
		if (Ti.Network.online) {
			var attempt = 0;
			if (totalgameAttempt != 0) {
				attempt = totalgameAttempt - 1;
			}

			if (args.type == 1) {
				if (totalgameAttempt < noOfDiamondsToDisplayForTrailA) {
					var gameScore = ((correctLines / noOfDiamondsToDisplayForTrailA) * 100).toFixed(1);
				} else {
					var gameScore = ((correctLines / totalgameAttempt) * 100).toFixed(1);
				}
			} else {
				if (totalgameAttempt < noOfDiamondsToDisplayForTrailB) {
					var gameScore = ((correctLines / noOfDiamondsToDisplayForTrailB) * 100).toFixed(1);
				} else {
					var gameScore = ((correctLines / totalgameAttempt) * 100).toFixed(1);
				}
			}
			if (StatusType == 1) {
				remainingSeconds = 0;
				gameScore = 0;
				correctLines = 0;
			}
			if (args.isBatch == true && Alloy.Globals.BATCH_ARRAY.length != 1) {
				spinWheelScore = 0;
			}
			if (spinWheelScore < 0) {
				spinWheelScore = 0;
			}
			var resultParameter = {
				"UserID" : credentials.userId,
				"TotalAttempts" : attempt,
				"StartTime" : startTime,
				"EndTime" : endTime,
				"Point" : points,
				"Score" : gameScore,
				"RoutesList" : lineRoutArrayFull,
				"TotalJewelsCollected" : correctLines,
				"TotalBonusCollected" : remainingSeconds,
				"StatusType" : StatusType,
				"IsNotificationGame" : notificationGame,
				"AdminBatchSchID" : args.isBatch == true ? args.testID : 0,
				"SpinWheelScore" : spinWheelScore
			};
			Ti.API.info('**** resultParameter SpinWheelScore **** = ' + resultParameter.SpinWheelScore);
			Ti.API.info('getValues resultParameter : ', resultParameter);
			commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
			if (args.type == 1) {
				serviceManager.SaveJewelsTrailsAGame(resultParameter, onSaveTrailsBGameSuccess, onSaveTrailsBGameFailure);
			} else {
				serviceManager.SaveJewelsTrailsBGame(resultParameter, onSaveTrailsBGameSuccess, onSaveTrailsBGameFailure);
			}
		} else {
			commonFunctions.closeActivityIndicator();
			commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode), function() {
				onSaveTrailsBGameFailure();

			});

		}

	} else {

		var diff = 0;
		var curTime = new Date().getTime();
		var setTime = Ti.App.Properties.getString('EnvTime', "");
		if (setTime != "") {
			diff = curTime - setTime;
		}
		if (args.isBatch != true) {
			if (diff == 0 || diff > 3600000) {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spaceBlockScreen', {
					'backDisable' : true,
				});

				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
				if (args.type == 1) {
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntro');
				} else {
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntroB');

				}
			}
		}

		if (args.isBatch == true) {
			var surveyName = "";
			Alloy.Globals.BATCH_ARRAY = Alloy.Globals.BATCH_ARRAY.splice(1, Alloy.Globals.BATCH_ARRAY.length);
			if (Alloy.Globals.BATCH_ARRAY.length != 0) {

				Ti.API.info('Alloy.Globals.BATCH_ARRAY in nback', Alloy.Globals.BATCH_ARRAY);
				var surveyId = Alloy.Globals.BATCH_ARRAY[0].trim().split(" ");
				if (surveyId[0] == "S") {
					surveyName = commonDB.getSurveyName(surveyId[1]);
				}
				if (Alloy.Globals.BATCH_ARRAY[0].trim() != "C 17" && Alloy.Globals.BATCH_ARRAY[0].trim() != "C 18") {
					Ti.App.removeEventListener('getValues', getValuesFromPopup);
					Ti.App.removeEventListener('totalScoreClick', totalScoreClick);
					Ti.App.removeEventListener('ReportClick', ReportClick);
					Ti.App.removeEventListener('exitScoreView', exitScoreView);
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntro');

					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntroB');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsDifficulty');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsA');
					commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

				} else {
					if (Alloy.Globals.BATCH_ARRAY[0].trim() == "C 17") {
						args.type = 1;
					} else {
						args.type = 2;
					}
					Ti.API.info('restartGame');

					restartGame();

					commonFunctions.closeActivityIndicator();
				}
			} else {
				Ti.App.removeEventListener('getValues', getValuesFromPopup);
				Ti.App.removeEventListener('totalScoreClick', totalScoreClick);
				Ti.App.removeEventListener('ReportClick', ReportClick);
				Ti.App.removeEventListener('exitScoreView', exitScoreView);
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsDifficulty');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntro');

				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntroB');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsA');
				var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
				if (parentWindow != null && (parentWindow.windowName === "jewelsTrailsIntro" || parentWindow.windowName === "jewelsTrailsIntroB")) {
					parentWindow.window.addListner();
					Ti.API.info('add event listenere', parentWindow.windowName);
				}
				if (parentWindow != null && parentWindow.windowName === "home") {
					parentWindow.window.refreshHomeScreen();
				}
				if (parentWindow != null && parentWindow.windowName === "preventIntroScreen") {
					parentWindow.window.refreshPreventScreen();
				}
				if (diff == 0 || diff > 900000) {
					Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spaceBlockScreen', {
						'backDisable' : true,
					});
				}

			}
		} else {

			Ti.App.removeEventListener('getValues', getValuesFromPopup);
			Ti.App.removeEventListener('totalScoreClick', totalScoreClick);
			Ti.App.removeEventListener('ReportClick', ReportClick);
			Ti.App.removeEventListener('exitScoreView', exitScoreView);
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsDifficulty');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntro');

			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntroB');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsA');
			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "jewelsTrailsIntro" || parentWindow.windowName === "jewelsTrailsIntroB")) {
				Ti.API.info('add event listenere else', parentWindow.windowName);
				parentWindow.window.addListner();
			}
			if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
				parentWindow.window.refreshHomeScreen();
			}
			if (parentWindow != null && parentWindow.windowName === "preventIntroScreen") {
				parentWindow.window.refreshPreventScreen();
			}
		}

	}
}

/**
 * Function to get values
 */
function getValuesFromPopup() {
	Ti.API.info('getValuesFromPopup', startTime, resultSubmited);
	if (startTime == null || startTime == "") {
		onSaveTrailsBGameFailurePopUp();
		return;
	}
	if (resultSubmited == false) {
		if (Ti.Network.online) {
			var attempt = 0;
			if (totalgameAttempt != 0) {
				attempt = totalgameAttempt - 1;
			}

			if (args.type == 1) {
				if (totalgameAttempt < noOfDiamondsToDisplayForTrailA) {
					var gameScore = ((correctLines / noOfDiamondsToDisplayForTrailA) * 100).toFixed(1);
				} else {
					var gameScore = ((correctLines / totalgameAttempt) * 100).toFixed(1);
				}
			} else {
				if (totalgameAttempt < noOfDiamondsToDisplayForTrailB) {
					var gameScore = ((correctLines / noOfDiamondsToDisplayForTrailB) * 100).toFixed(1);
				} else {
					var gameScore = ((correctLines / totalgameAttempt) * 100).toFixed(1);
				}
			}
			if (StatusType == 1) {
				remainingSeconds = 0;
				gameScore = 0;
				correctLines = 0;
			}
			if (args.isBatch == true && Alloy.Globals.BATCH_ARRAY.length != 1) {
				spinWheelScore = 0;
			}
			if (spinWheelScore < 0) {
				spinWheelScore = 0;
			}
			var resultParameter = {
				"UserID" : credentials.userId,
				"TotalAttempts" : attempt,
				"StartTime" : startTime,
				"EndTime" : endTime,
				"Point" : points,
				"Score" : gameScore,
				"RoutesList" : lineRoutArrayFull,
				"TotalJewelsCollected" : correctLines,
				"TotalBonusCollected" : remainingSeconds,
				"StatusType" : StatusType,
				"IsNotificationGame" : notificationGame,
				"AdminBatchSchID" : args.isBatch == true ? args.testID : 0,
				"SpinWheelScore" : spinWheelScore
			};

			Ti.API.info('getValues resultParameter : ', resultParameter);
			commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
			if (args.type == 1) {
				serviceManager.SaveJewelsTrailsAGame(resultParameter, onSaveTrailsBGameSuccessPopUp, onSaveTrailsBGameFailurePopUp);
			} else {
				serviceManager.SaveJewelsTrailsBGame(resultParameter, onSaveTrailsBGameSuccessPopUp, onSaveTrailsBGameFailurePopUp);
			}

		} else {
			commonFunctions.closeActivityIndicator();
			commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode), function() {
				onSaveTrailsBGameFailurePopUp();

			});

		}

	} else {

		if (args.isBatch == true) {
			var surveyName = "";
			Alloy.Globals.BATCH_ARRAY = Alloy.Globals.BATCH_ARRAY.splice(1, Alloy.Globals.BATCH_ARRAY.length);
			if (Alloy.Globals.BATCH_ARRAY.length != 0) {

				Ti.API.info('Alloy.Globals.BATCH_ARRAY in nback', Alloy.Globals.BATCH_ARRAY);
				var surveyId = Alloy.Globals.BATCH_ARRAY[0].trim().split(" ");
				if (surveyId[0] == "S") {
					surveyName = commonDB.getSurveyName(surveyId[1]);
				}
				if (Alloy.Globals.BATCH_ARRAY[0].trim() != "C 17" && Alloy.Globals.BATCH_ARRAY[0].trim() != "C 18") {
					Ti.App.removeEventListener('getValues', getValuesFromPopup);
					Ti.App.removeEventListener('totalScoreClick', totalScoreClick);
					Ti.App.removeEventListener('ReportClick', ReportClick);
					Ti.App.removeEventListener('exitScoreView', exitScoreView);
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntroB');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsDifficulty');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsA');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntro');
					commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

				} else {
					if (Alloy.Globals.BATCH_ARRAY[0].trim() == "C 17") {
						args.type = 1;
					} else {
						args.type = 2;
					}
					Ti.API.info('restartGame');
					restartGame();

					commonFunctions.closeActivityIndicator();
				}
			} else {
				Ti.App.removeEventListener('getValues', getValuesFromPopup);
				Ti.App.removeEventListener('totalScoreClick', totalScoreClick);
				Ti.App.removeEventListener('ReportClick', ReportClick);
				Ti.App.removeEventListener('exitScoreView', exitScoreView);
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsDifficulty');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntro');

				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntroB');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsA');
				var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
				if (parentWindow != null && (parentWindow.windowName === "jewelsTrailsIntro" || parentWindow.windowName === "jewelsTrailsIntroB")) {
					parentWindow.window.addListner();
					Ti.API.info('add event listenere', parentWindow.windowName);
				}
				if (parentWindow != null && parentWindow.windowName === "home") {
					parentWindow.window.refreshHomeScreen();
				}
				if (parentWindow != null && parentWindow.windowName === "preventIntroScreen") {
					parentWindow.window.refreshPreventScreen();
				}
			}
		} else {
			restartGame();
		}

	}
}

/**
 * onSaveTrailsBGameSuccessPopUp event
 */
function onSaveTrailsBGameSuccessPopUp(e) {
	try {
		var response = JSON.parse(e.data);
		Ti.API.info('***SAVE TRAILS-B GAME SUCCESS  RESPONSE****  ', JSON.stringify(response));
		if (response.ErrorCode == 0) {
			var diff = 0;
			var curTime = new Date().getTime();
			var setTime = Ti.App.Properties.getString('EnvTime', "");
			if (setTime != "") {
				diff = curTime - setTime;
			}
			if (args.isBatch == true) {
				var surveyName = "";
				Alloy.Globals.BATCH_ARRAY = Alloy.Globals.BATCH_ARRAY.splice(1, Alloy.Globals.BATCH_ARRAY.length);
				if (Alloy.Globals.BATCH_ARRAY.length != 0) {

					Ti.API.info('Alloy.Globals.BATCH_ARRAY in nback', Alloy.Globals.BATCH_ARRAY);
					var surveyId = Alloy.Globals.BATCH_ARRAY[0].trim().split(" ");
					if (surveyId[0] == "S") {
						surveyName = commonDB.getSurveyName(surveyId[1]);
					}
					if (Alloy.Globals.BATCH_ARRAY[0].trim() != "C 17" && Alloy.Globals.BATCH_ARRAY[0].trim() != "C 18") {
						Ti.App.removeEventListener('getValues', getValuesFromPopup);
						Ti.App.removeEventListener('totalScoreClick', totalScoreClick);
						Ti.App.removeEventListener('ReportClick', ReportClick);
						Ti.App.removeEventListener('exitScoreView', exitScoreView);
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntroB');
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsDifficulty');
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsA');
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntro');
						commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

					} else {
						if (Alloy.Globals.BATCH_ARRAY[0].trim() == "C 17") {
							args.type = 1;
						} else {
							args.type = 2;
						}
						Ti.API.info('restartGame');

						restartGame();

						commonFunctions.closeActivityIndicator();
					}
				} else {

					Ti.App.removeEventListener('getValues', getValuesFromPopup);
					Ti.App.removeEventListener('totalScoreClick', totalScoreClick);
					Ti.App.removeEventListener('ReportClick', ReportClick);
					Ti.App.removeEventListener('exitScoreView', exitScoreView);
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsDifficulty');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntro');

					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntroB');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsA');
					var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
					if (parentWindow != null && (parentWindow.windowName === "jewelsTrailsIntro" || parentWindow.windowName === "jewelsTrailsIntroB")) {
						parentWindow.window.addListner();
						Ti.API.info('add event listenere', parentWindow.windowName);
					}
					if (parentWindow != null && parentWindow.windowName === "home") {
						parentWindow.window.refreshHomeScreen();
					}
					if (parentWindow != null && parentWindow.windowName === "preventIntroScreen") {
						parentWindow.window.refreshPreventScreen();
					}
					if (diff == 0 || diff > 900000) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spaceBlockScreen', {
							'backDisable' : true,
						});
					}
				}
			} else {

				Ti.App.removeEventListener('getValues', getValuesFromPopup);
				Ti.App.removeEventListener('totalScoreClick', totalScoreClick);
				Ti.App.removeEventListener('ReportClick', ReportClick);
				Ti.App.removeEventListener('exitScoreView', exitScoreView);
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsDifficulty');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntro');

				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntroB');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsA');
				var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
				if (parentWindow != null && (parentWindow.windowName === "jewelsTrailsIntro" || parentWindow.windowName === "jewelsTrailsIntroB")) {
					parentWindow.window.addListner();
					Ti.API.info('add event listenere', parentWindow.windowName);
				}
				if (parentWindow != null && parentWindow.windowName === "home") {
					parentWindow.window.refreshHomeScreen();
				}
				if (parentWindow != null && parentWindow.windowName === "preventIntroScreen") {
					parentWindow.window.refreshPreventScreen();
				}
			}

			commonFunctions.closeActivityIndicator();

		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}

	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("trails-B", "onSaveTrailsBGameSuccess", ex);
	}
}

/**
 * Failure api call
 */
function onSaveTrailsBGameFailurePopUp(e) {
	if (args.isBatch == true) {
		var diff = 0;
		var surveyName = "";
		Alloy.Globals.BATCH_ARRAY = Alloy.Globals.BATCH_ARRAY.splice(1, Alloy.Globals.BATCH_ARRAY.length);
		if (Alloy.Globals.BATCH_ARRAY.length != 0) {

			Ti.API.info('Alloy.Globals.BATCH_ARRAY in nback', Alloy.Globals.BATCH_ARRAY);
			var surveyId = Alloy.Globals.BATCH_ARRAY[0].trim().split(" ");
			if (surveyId[0] == "S") {
				surveyName = commonDB.getSurveyName(surveyId[1]);
			}
			if (Alloy.Globals.BATCH_ARRAY[0].trim() != "C 17" && Alloy.Globals.BATCH_ARRAY[0].trim() != "C 18") {
				Ti.App.removeEventListener('getValues', getValuesFromPopup);
				Ti.App.removeEventListener('totalScoreClick', totalScoreClick);
				Ti.App.removeEventListener('ReportClick', ReportClick);
				Ti.App.removeEventListener('exitScoreView', exitScoreView);
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntro');

				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntroB');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsDifficulty');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsA');
				commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

			} else {
				if (Alloy.Globals.BATCH_ARRAY[0].trim() == "C 17") {
					args.type = 1;
				} else {
					args.type = 2;
				}
				Ti.API.info('restartGame');
				restartGame();

				commonFunctions.closeActivityIndicator();
			}
		} else {

			Ti.App.removeEventListener('getValues', getValuesFromPopup);
			Ti.App.removeEventListener('totalScoreClick', totalScoreClick);
			Ti.App.removeEventListener('ReportClick', ReportClick);
			Ti.App.removeEventListener('exitScoreView', exitScoreView);
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsDifficulty');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntro');

			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntroB');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsA');
			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "jewelsTrailsIntro" || parentWindow.windowName === "jewelsTrailsIntroB")) {
				parentWindow.window.addListner();
				Ti.API.info('add event listenere', parentWindow.windowName);
			}
			if (parentWindow != null && parentWindow.windowName === "home") {
				parentWindow.window.refreshHomeScreen();
			}
			if (parentWindow != null && parentWindow.windowName === "preventIntroScreen") {
				parentWindow.window.refreshPreventScreen();
			}
			if (diff == 0 || diff > 900000) {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spaceBlockScreen', {
					'backDisable' : true,
				});
			}
		}
	} else {
		restartGame();
	}

	commonFunctions.closeActivityIndicator();
}

/**
 * Total score click handler
 */
function totalScoreClick() {
	Ti.API.info('totalCollectedBonus : ', totalCollectedBonus);
	if (totalCollectedBonus > Alloy.Globals.jewelsTrailMaxTotalScore) {
		totalCollectedBonus = Alloy.Globals.jewelsTrailMaxTotalScore;
	}
	if (totalCollectedJewels > Alloy.Globals.jewelsTrailMaxTotalScore) {
		totalCollectedJewels = Alloy.Globals.jewelsTrailMaxTotalScore;
	}
	var jewelInfo = Ti.App.Properties.getObject(credentials.userId.toString());

	if (args.type == 1) {
		var numberOfGames = jewelInfo.totalgamesTrailsA;
		if (totalColelctedScore != 0 && numberOfGames != 0) {

			var tempvalue = (totalColelctedScore / numberOfGames).toFixed(1);
		} else {
			var tempvalue = 0;
		}

	} else {
		var numberOfGames = jewelInfo.totalgamesTrailsB;
		if (totalColelctedScore != 0 && numberOfGames != 0) {

			var tempvalue = (totalColelctedScore / numberOfGames).toFixed(1);
		} else {
			var tempvalue = 0;
		}
	}
	var totalBonusString = "/" + Alloy.Globals.jewelsTrailMaxTotalScore;
	commonFunctions.getScoreViewJewelTotal(tempvalue + "%", totalCollectedBonus + totalBonusString, totalCollectedJewels + totalBonusString);

}

/**
 * ReportClick event handler
 */
function ReportClick() {
	if (resultSubmited == false) {

		if (Ti.Network.online) {
			var attempt = 0;
			if (totalgameAttempt != 0) {
				attempt = totalgameAttempt - 1;
			}

			if (args.type == 1) {
				if (totalgameAttempt < noOfDiamondsToDisplayForTrailA) {
					var gameScore = ((correctLines / noOfDiamondsToDisplayForTrailA) * 100).toFixed(1);
				} else {
					var gameScore = ((correctLines / totalgameAttempt) * 100).toFixed(1);
				}
			} else {
				if (totalgameAttempt < noOfDiamondsToDisplayForTrailB) {
					var gameScore = ((correctLines / noOfDiamondsToDisplayForTrailB) * 100).toFixed(1);
				} else {
					var gameScore = ((correctLines / totalgameAttempt) * 100).toFixed(1);
				}
			}
			if (args.isBatch == true && Alloy.Globals.BATCH_ARRAY.length != 1) {
				spinWheelScore = 0;
			}
			if (spinWheelScore < 0) {
				spinWheelScore = 0;
			}
			var resultParameter = {
				"UserID" : credentials.userId,
				"TotalAttempts" : attempt,
				"StartTime" : startTime,
				"EndTime" : endTime,
				"Point" : points,
				"Score" : gameScore,
				"RoutesList" : lineRoutArrayFull,
				"TotalJewelsCollected" : correctLines,
				"TotalBonusCollected" : remainingSeconds,
				"IsNotificationGame" : notificationGame,
				"AdminBatchSchID" : args.isBatch == true ? args.testID : 0,
				"SpinWheelScore" : spinWheelScore
			};
			Ti.API.info('**** resultParameter SpinWheelScore **** = ' + resultParameter.SpinWheelScore);
			Ti.API.info('getValues resultParameter : ', resultParameter);
			commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
			if (args.type == 1) {
				serviceManager.SaveJewelsTrailsAGame(resultParameter, onSaveTrailsBGameReportSuccess, onSaveTrailsBGameReportFailure);
			} else {
				serviceManager.SaveJewelsTrailsBGame(resultParameter, onSaveTrailsBGameReportSuccess, onSaveTrailsBGameReportFailure);
			}
		} else {
			commonFunctions.closeActivityIndicator();
			commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode), function() {
				onSaveTrailsBGameReportFailure();

			});

		}

	} else {
		if (args.type == 1) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelGraph', {
				'type' : 1
			});
		} else {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelGraph', {
				'type' : 2
			});
		}
	}

}

/**
 * onSaveTrailsBGameReportSuccess event
 */
function onSaveTrailsBGameReportSuccess(e) {
	resultSubmited = true;
	commonFunctions.closeActivityIndicator();

	if (args.type == 1) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelGraph', {
			'type' : 1
		});
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelGraph', {
			'type' : 2
		});
	}

}

/**
 * onSaveTrailsBGameReportFailure event
 */
function onSaveTrailsBGameReportFailure(e) {
	commonFunctions.closeActivityIndicator();
}

/**
 * onSaveTrailsBGameSuccess event
 */
function onSaveTrailsBGameSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		Ti.API.info('***SAVE TRAILS-B GAME SUCCESS  RESPONSE****  ', JSON.stringify(response));
		if (response.ErrorCode == 0) {
			setTimeout(function() {
				resultSubmited = true;

				var diff = 0;
				var curTime = new Date().getTime();
				var setTime = Ti.App.Properties.getString('EnvTime', "");
				if (setTime != "") {
					diff = curTime - setTime;
				}
				if (args.isBatch != true) {
					if (diff == 0 || diff > 3600000) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spaceBlockScreen', {
							'backDisable' : true,
						});
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
						if (args.type == 1) {
							Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntro');
						} else {
							Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntroB');

						}
					}
				}

				commonFunctions.closeActivityIndicator();

			}, 3000);

			if (args.isBatch == true) {
				var surveyName = "";
				Alloy.Globals.BATCH_ARRAY = Alloy.Globals.BATCH_ARRAY.splice(1, Alloy.Globals.BATCH_ARRAY.length);
				if (Alloy.Globals.BATCH_ARRAY.length != 0) {

					Ti.API.info('Alloy.Globals.BATCH_ARRAY in nback', Alloy.Globals.BATCH_ARRAY);
					var surveyId = Alloy.Globals.BATCH_ARRAY[0].trim().split(" ");
					if (surveyId[0] == "S") {
						surveyName = commonDB.getSurveyName(surveyId[1]);
					}
					if (Alloy.Globals.BATCH_ARRAY[0].trim() != "C 17" && Alloy.Globals.BATCH_ARRAY[0].trim() != "C 18") {
						Ti.App.removeEventListener('getValues', getValuesFromPopup);
						Ti.App.removeEventListener('totalScoreClick', totalScoreClick);
						Ti.App.removeEventListener('ReportClick', ReportClick);
						Ti.App.removeEventListener('exitScoreView', exitScoreView);
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsDifficulty');

						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntro');

						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntroB');

						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsA');
						commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

					} else {
						if (Alloy.Globals.BATCH_ARRAY[0].trim() == "C 17") {
							args.type = 1;
						} else {
							args.type = 2;
						}
						Ti.API.info('restartGame');
						Ti.App.addEventListener('getValues', getValuesFromPopup);
						Ti.App.addEventListener('totalScoreClick', totalScoreClick);
						Ti.App.addEventListener('ReportClick', ReportClick);
						Ti.App.addEventListener('exitScoreView', exitScoreView);
						restartGame();

						commonFunctions.closeActivityIndicator();
					}
				} else {
					Ti.App.removeEventListener('getValues', getValuesFromPopup);
					Ti.App.removeEventListener('totalScoreClick', totalScoreClick);
					Ti.App.removeEventListener('ReportClick', ReportClick);
					Ti.App.removeEventListener('exitScoreView', exitScoreView);
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsDifficulty');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntro');

					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntroB');
					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsA');
					var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
					if (parentWindow != null && (parentWindow.windowName === "jewelsTrailsIntro" || parentWindow.windowName === "jewelsTrailsIntroB")) {
						parentWindow.window.addListner();
						Ti.API.info('add event listenere', parentWindow.windowName);
					}
					if (parentWindow != null && parentWindow.windowName === "home") {
						parentWindow.window.refreshHomeScreen();
					}
					if (parentWindow != null && parentWindow.windowName === "preventIntroScreen") {
						parentWindow.window.refreshPreventScreen();
					}
				}
			} else {
				Ti.App.removeEventListener('getValues', getValuesFromPopup);
				Ti.App.removeEventListener('totalScoreClick', totalScoreClick);
				Ti.App.removeEventListener('ReportClick', ReportClick);
				Ti.App.removeEventListener('exitScoreView', exitScoreView);
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsDifficulty');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntro');

				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntroB');
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsA');
				var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
				if (parentWindow != null && (parentWindow.windowName === "jewelsTrailsIntro" || parentWindow.windowName === "jewelsTrailsIntroB")) {
					parentWindow.window.addListner();
					Ti.API.info('add event listenere', parentWindow.windowName);
				}
				if (parentWindow != null && parentWindow.windowName === "home") {
					parentWindow.window.refreshHomeScreen();
				}
				if (parentWindow != null && parentWindow.windowName === "preventIntroScreen") {
					parentWindow.window.refreshPreventScreen();
				}
			}

		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}

	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("trails-B", "onSaveTrailsBGameSuccess", ex);
	}
}

/**
 * Failure api call
 */
function onSaveTrailsBGameFailure(e) {

	Ti.App.removeEventListener('getValues', getValuesFromPopup);
	Ti.App.removeEventListener('totalScoreClick', totalScoreClick);
	Ti.App.removeEventListener('ReportClick', ReportClick);
	Ti.App.removeEventListener('exitScoreView', exitScoreView);

	if (args.isBatch == true) {
		var surveyName = "";
		Alloy.Globals.BATCH_ARRAY = Alloy.Globals.BATCH_ARRAY.splice(1, Alloy.Globals.BATCH_ARRAY.length);
		if (Alloy.Globals.BATCH_ARRAY.length != 0) {

			Ti.API.info('Alloy.Globals.BATCH_ARRAY in nback', Alloy.Globals.BATCH_ARRAY);
			var surveyId = Alloy.Globals.BATCH_ARRAY[0].trim().split(" ");
			if (surveyId[0] == "S") {
				surveyName = commonDB.getSurveyName(surveyId[1]);
			}
			if (Alloy.Globals.BATCH_ARRAY[0].trim() != "C 17" && Alloy.Globals.BATCH_ARRAY[0].trim() != "C 18") {
				Ti.App.removeEventListener('getValues', getValuesFromPopup);
				Ti.App.removeEventListener('totalScoreClick', totalScoreClick);
				Ti.App.removeEventListener('ReportClick', ReportClick);
				Ti.App.removeEventListener('exitScoreView', exitScoreView);
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsDifficulty');

				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntro');

				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntroB');

				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsA');
				commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

			} else {
				if (Alloy.Globals.BATCH_ARRAY[0].trim() == "C 17") {
					args.type = 1;
				} else {
					args.type = 2;
				}
				Ti.API.info('restartGame');
				Ti.App.addEventListener('getValues', getValuesFromPopup);
				Ti.App.addEventListener('totalScoreClick', totalScoreClick);
				Ti.App.addEventListener('ReportClick', ReportClick);
				Ti.App.addEventListener('exitScoreView', exitScoreView);
				restartGame();

				commonFunctions.closeActivityIndicator();
			}
		} else {
			Ti.App.removeEventListener('getValues', getValuesFromPopup);
			Ti.App.removeEventListener('totalScoreClick', totalScoreClick);
			Ti.App.removeEventListener('ReportClick', ReportClick);
			Ti.App.removeEventListener('exitScoreView', exitScoreView);
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsDifficulty');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntro');

			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntroB');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsA');
			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "jewelsTrailsIntro" || parentWindow.windowName === "jewelsTrailsIntroB")) {
				parentWindow.window.addListner();
				Ti.API.info('add event listenere', parentWindow.windowName);
			}
			if (parentWindow != null && parentWindow.windowName === "home") {
				parentWindow.window.refreshHomeScreen();
			}
			if (parentWindow != null && parentWindow.windowName === "preventIntroScreen") {
				parentWindow.window.refreshPreventScreen();
			}
		}
	} else {

		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionTestScreen');
		if (args.type == 1) {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntro');
		} else {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsIntroB');

		}
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsDifficulty');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsA');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
			parentWindow.window.refreshHomeScreen();
		}
		if (parentWindow != null && parentWindow.windowName === "preventIntroScreen") {
			parentWindow.window.refreshPreventScreen();
		}
	}

	commonFunctions.closeActivityIndicator();
}

/**
 * Function to create the Game
 */
function createGame() {
	try {
		Ti.API.info('createGame A');

		var pWidth = Alloy.Globals.DEVICE_WIDTH - 40;
		if (OS_IOS) {
			var pHeight = Alloy.Globals.DEVICE_HEIGHT - 220;
		} else {
			var pHeight = Alloy.Globals.DEVICE_HEIGHT_DPI - 220;
		}
		Ti.App.Properties.setString('jewelType', 2);
		if (vNumber == 1) {
			var jewelWidth = "35dp";
			var jewelHeight = "35dp";
		} else if (vNumber == 2) {
			var jewelWidth = "35dp";
			var jewelHeight = "35dp";
		} else if (vNumber == 3) {
			var jewelWidth = "35dp";
			var jewelHeight = "35dp";
		} else if (vNumber == 4) {
			var jewelWidth = "35dp";
			var jewelHeight = "35dp";
		} else if (vNumber == 5) {
			var jewelWidth = "38dp";
			var jewelHeight = "38dp";
		} else if (vNumber == 6) {
			var jewelWidth = "35dp";
			var jewelHeight = "40dp";
		} else if (vNumber == 7) {
			var jewelWidth = "35dp";
			var jewelHeight = "40dp";
		} else if (vNumber == 8) {
			var jewelWidth = "30dp";
			var jewelHeight = "38dp";
		}

		jewelImage = "/images/jewelTrails/jewel_A/" + vNumber + "/diamond.png";

		noOfDiamondsToDisplayForTrailA = commonFunctions.getJewelsTrailAGameDiamondsToDisplay(credentials.userId.toString());
		console.log("noOfDiamondsToDisplayForTrailA : " + noOfDiamondsToDisplayForTrailA);
		Ti.API.info('args.type : ', args.type);
		console.log("pHeight " + pHeight);
		var fullArrayPositions = generatePositionsArray(pWidth, pHeight, 50, 10);
		if (commonFunctions.getIsTablet()) {
			if (noOfDiamondsToDisplayForTrailA <= 10) {
				var tabletJewelContainerHeight = (parseInt(noOfDiamondsToDisplayForTrailA) * parseInt(40)) + 100;
				console.log("tabletJewelContainerHeight : " + tabletJewelContainerHeight);
				fullArrayPositions = generatePositionsArray(pWidth, tabletJewelContainerHeight, 50, 10);
				$.alphabetOuterView.height = tabletJewelContainerHeight + 100;
			}
		}

		Ti.API.info('fullArrayPositions : ', fullArrayPositions.length);
		arrayPositions = getRandomPosition(fullArrayPositions, noOfDiamondsToDisplayForTrailA);

		tempArrPositions = arrayPositions.slice();
		Ti.API.info('arrayPositions.length : ', arrayPositions.length);
		for (var i = 0; i < arrayPositions.length; i++) {

			var displayText = i + 1;

			var AlphabetsView = Titanium.UI.createView({
				height : jewelHeight,
				width : jewelWidth,
				center : {
					x : arrayPositions[i].x,
					y : arrayPositions[i].y
				},
				customText : displayText,
				bubbleParent : true,
				zIndex : 10,
				indexValue : arrayPositions[i].index,
				backgroundImage : jewelImage

			});
			AlphabetsView.addEventListener("click", function(e) {
				if (jewelTimerStart == 0) {
					startTimer();
					jewelTimerStart = 1;
				}
				totalgameAttempt += 1;
				if (e.source.indexValue == 0) {
					Ti.API.info('****123');
					if ($.messageLabel.text != "") {
						correctLines += 1;

						Ti.API.info('noOfDiamondShapesToDisplayForTrailB Jewel A : ', noOfDiamondShapesToDisplayForTrailB, currentInfoIconIndex);
						$.messageView.visible = false;
						$.startWithHintContainerVw.visible = false;
						lineStartTime = new Date();
						if (gameStarted == 0) {
							targetIndex += 1;
							var displayText = e.source.indexValue + 1;
							lineRoutArray.push({
								"Alphabet" : displayText,
								"Status" : 0,
								"TimeTaken" : 0

							});
							e.source.backgroundImage = "/images/jewelTrails/jewel_A/" + vNumber + "/diamond_trans.png";
							e.source.touchEnabled = false;
						} else {
							lineEndTime = new Date();
							var timeDiff = Math.abs(lineEndTime.getTime() - lineStartTime.getTime());
							lineStartTime = new Date();
							var timeTaken = (timeDiff / 1000);
							timeTaken = timeTaken.toFixed(1);
							var displayText = e.source.indexValue + 1;
							lineRoutArray.push({
								"Alphabet" : displayText,
								"Status" : 0,
								"TimeTaken" : timeTaken

							});
						}
						gameStarted = 1;
					}

				} else {
					if (gameStarted == 1) {
						Ti.API.info('****456');

						Ti.API.info('e.source.indexValue : ', e.source.indexValue, targetIndex);
						if (e.source.indexValue == targetIndex) {
							Ti.API.info('Correct answer');
							correctLines += 1;
							targetIndex += 1;
							e.source.backgroundImage = "/images/jewelTrails/jewel_A/" + vNumber + "/diamond_trans.png";
							e.source.touchEnabled = false;
							lineEndTime = new Date();
							var timeDiff = Math.abs(lineEndTime.getTime() - lineStartTime.getTime());
							lineStartTime = new Date();
							var timeTaken = (timeDiff / 1000);
							timeTaken = timeTaken.toFixed(1);
							var displayText = e.source.indexValue + 1;
							lineRoutArray.push({
								"Alphabet" : displayText,
								"Status" : 1,
								"TimeTaken" : timeTaken

							});

						} else {
							Ti.API.info('Wrong answer');
							currentpenalty = currentpenalty - 2;
							$.contentView.touchEnabled = false;
							$.penaltyLabel.text = currentpenalty;
							$.countTimer.color = "red";
							$.pentaltyView.visible = true;

							lineEndTime = new Date();
							var timeDiff = Math.abs(lineEndTime.getTime() - lineStartTime.getTime());
							lineStartTime = new Date();
							var timeTaken = (timeDiff / 1000);
							timeTaken = timeTaken.toFixed(1);
							var displayText = e.source.indexValue + 1;
							lineRoutArray.push({
								"Alphabet" : displayText,
								"Status" : 0,
								"TimeTaken" : timeTaken

							});
							setTimeout(function() {
								$.contentView.touchEnabled = true;
								$.countTimer.color = "#ffffff";
								$.pentaltyView.visible = false;
							}, 2000);

						}
						Ti.API.info('targetIndex : ', targetIndex);

						if (targetIndex == noOfDiamondsToDisplayForTrailA) {
							if (lineRoutArray.length != 0) {
								lineRoutArrayFull.push({
									"Routes" : lineRoutArray,

								});
								lineRoutArray = [];
							}

							gameFinishStatus = 1;

							endTime = new Date().toUTCString();
							if (countDownTimer != null) {
								clearInterval(countDownTimer);
							}
							Ti.API.info('totalgameAttempt : ', totalgameAttempt, correctLines);

							if (totalgameAttempt < noOfDiamondsToDisplayForTrailA) {
								var gameScore = ((correctLines / noOfDiamondsToDisplayForTrailA) * 100).toFixed(1);
							} else {
								var gameScore = ((correctLines / totalgameAttempt) * 100).toFixed(1);
							}
							Ti.API.info('gameScore : ', gameScore);
							Ti.API.info('gamePoints : ', gamePoints);
							if (gameScore == 100) {
								points = points + 2;
							} else {
								points = points + 1;
							}
							var jewelInfo = Ti.App.Properties.getObject(credentials.userId.toString());
							if (totalColelctedScore != 0) {
								var num1 = parseFloat(totalColelctedScore);
								var num2 = parseFloat(gameScore);
								Ti.API.info('num1 : ', num1, " num2 : ", num2);
								var sumscore = num1 + num2;
								totalColelctedScore = sumscore;
								var numberOfGames = jewelInfo.totalgamesTrailsA;

								var UpdatednumberOfGames = parseInt(numberOfGames) + 1;
								jewelInfo.totalgamesTrailsA = UpdatednumberOfGames;

								Ti.API.info('totalColelctedScore : ', totalColelctedScore);
							} else {
								totalColelctedScore = gameScore;
								var numberOfGames = jewelInfo.totalgamesTrailsA;

								var UpdatednumberOfGames = parseInt(numberOfGames) + 1;
								jewelInfo.totalgamesTrailsA = UpdatednumberOfGames;

							}
							Ti.App.Properties.setObject(credentials.userId.toString(), jewelInfo);
							totalCollectedJewels = totalCollectedJewels + correctLines;
							totalCollectedBonus = parseInt(totalCollectedBonus) + parseInt(remainingSeconds);
							console.log("remainingSeconds : " + remainingSeconds);
							console.log("totalCollectedBonus : " + totalCollectedBonus);
							gamePoints = gamePoints + points;
							Ti.API.info('gamePoints1 : ', gamePoints);
							Ti.API.info('args.type : ', args.type);
							var timeDiff = commonFunctions.getMinuteSecond(startTime, endTime);
							StatusType = 2;
							if (args.type == 1) {
								commonFunctions.checkTotalEarnedBonusAndUpdateJewelTrailALevel(parseInt(remainingSeconds), credentials.userId.toString());
								commonDB.insertGameScore(17, gameScore, gamePoints, points);
								commonDB.insertJewelCounts(totalCollectedJewels, totalCollectedBonus, totalColelctedScore, 1);
								var totalDiamonds = "/" + noOfDiamondsToDisplayForTrailA;

								Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scoreScreen', {
									"GameID" : 17,
									"GameScore" : gameScore,
									"GameType" : 1,
									"GameName" : commonFunctions.L('jwelA', LangCode)

								});
							} else {
								commonFunctions.checkTotalEarnedBonusAndUpdateJewelTrailBLevel(parseInt(remainingSeconds), credentials.userId.toString());
								commonDB.insertGameScore(18, gameScore, gamePoints, points);
								commonDB.insertJewelCounts(totalCollectedJewels, totalCollectedBonus, totalColelctedScore, 2);
								var totalDiamonds = "/" + noOfDiamondsToDisplayForTrailB;
								Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scoreScreen', {
									"GameID" : 18,
									"GameScore" : gameScore,
									"GameType" : 1,
									"GameName" : commonFunctions.L('jwelB', LangCode)

								});

							}

						}

					}
				}

			});
			var lblFontSize;
			if (commonFunctions.getIsTablet()) {
				lblFontSize = Alloy.Globals.LargeMenuFontBoldTablet;
			} else {
				lblFontSize = Alloy.Globals.PointLargeFontBold;
			}
			var lbl = Titanium.UI.createLabel({
				height : Titanium.UI.SIZE,
				width : Titanium.UI.SIZE,
				text : displayText,
				touchEnabled : false,
				font : lblFontSize,
				color : '#ffffff'

			});
			AlphabetsView.add(lbl);
			$.alphabetOuterView.add(AlphabetsView);
			Ti.API.info('Add alphabet : ' + displayText);

		};

	} catch(ex) {
		commonFunctions.handleException("trailsBNew", "createGame", ex);
	}

}

/**
 * Function to create game B
 */
function createGameB() {
	try {
		Ti.API.info('createGame B');

		var pWidth = Alloy.Globals.DEVICE_WIDTH - 40;
		if (OS_IOS) {
			var pHeight = Alloy.Globals.DEVICE_HEIGHT - 220;
		} else {
			var pHeight = Alloy.Globals.DEVICE_HEIGHT_DPI - 220;
		}

		noOfDiamondsToDisplayForTrailB = commonFunctions.getJewelsTrailBGameDiamondsToDisplay(credentials.userId.toString());

		var fullArrayPositions = generatePositionsArray(pWidth, pHeight, 50, 10);
		if (commonFunctions.getIsTablet()) {
			if (noOfDiamondsToDisplayForTrailB <= 10) {
				var tabletJewelContainerHeight = (parseInt(noOfDiamondsToDisplayForTrailB) * parseInt(40)) + 100;
				console.log("tabletJewelContainerHeight : " + tabletJewelContainerHeight);
				fullArrayPositions = generatePositionsArray(pWidth, tabletJewelContainerHeight, 50, 10);
				$.alphabetOuterView.height = tabletJewelContainerHeight + 100;
			}
		}

		Ti.API.info('fullArrayPositions : ', fullArrayPositions.length);
		arrayPositions = getRandomPosition(fullArrayPositions, noOfDiamondsToDisplayForTrailB);
		var displayText = 1,
		    currentShape = 1;
		tempArrPositions = arrayPositions.slice();
		Ti.API.info('arrayPositions.length : ', arrayPositions.length);
		for (var i = 0; i < arrayPositions.length; i++) {

			for (var s = 0; s < noOfDiamondShapesToDisplayForTrailB; s++) {
				if ((currentShape - 1) == s) {
					var jewelImage = "/images/jewelTrails/jewel_B/" + vNumber + diamondShapes[s];
					var jewelImageTransparent = "/images/jewelTrails/jewel_B/" + vNumber + diamondShapesTransparent[s];
					var jewelWidth = diamondSizeForTrailB["version"][vNumber-1]["diamond_size"][s]["width"];
					var jewelHeight = diamondSizeForTrailB["version"][vNumber-1]["diamond_size"][s]["height"];
					break;
				}
			}

			var AlphabetsView = Titanium.UI.createView({
				height : jewelHeight,
				width : jewelWidth,
				center : {
					x : arrayPositions[i].x,
					y : arrayPositions[i].y
				},
				customText : displayText,
				bubbleParent : true,
				zIndex : 10,
				indexValue : arrayPositions[i].index,
				backgroundImage : jewelImage,
				transImg : jewelImageTransparent

			});
			AlphabetsView.addEventListener("click", function(e) {
				if (jewelTimerStart == 0) {
					startTimer();
					jewelTimerStart = 1;
				}
				totalgameAttempt += 1;
				if (e.source.indexValue == 0) {
					if ($.messageLabel.text != "") {
						correctLines += 1;

						Ti.API.info('noOfDiamondShapesToDisplayForTrailB Jewel B : ', noOfDiamondShapesToDisplayForTrailB, currentInfoIconIndex);
						if (currentInfoIconIndex < noOfDiamondShapesToDisplayForTrailB) {
							$.informationImage.image = "/images/jewelTrails/jewel_B/" + vNumber + startWithHintDiamondShapes[currentInfoIconIndex];

							currentInfoIconIndex += 1;
						} else {
							$.messageView.visible = false;
							$.startWithHintContainerVw.visible = false;

						}

						lineStartTime = new Date();
						if (gameStarted == 0) {
							targetIndex += 1;
							var displayText = e.source.customText;
							lineRoutArray.push({
								"Alphabet" : displayText,
								"Status" : 0,
								"TimeTaken" : 0

							});

							e.source.backgroundImage = e.source.transImg;
							e.source.touchEnabled = false;
						}
						gameStarted = 1;
					}

				} else {
					if (gameStarted == 1) {

						Ti.API.info('e.source.indexValue : ', e.source.indexValue, targetIndex);
						if (e.source.indexValue == targetIndex) {
							Ti.API.info('Correct answer');
							if (currentInfoIconIndex < noOfDiamondShapesToDisplayForTrailB) {
								$.informationImage.image = "/images/jewelTrails/jewel_B/" + vNumber + startWithHintDiamondShapes[currentInfoIconIndex];

								currentInfoIconIndex += 1;
							} else {
								$.messageView.visible = false;
								$.startWithHintContainerVw.visible = false;

							}
							correctLines += 1;

							targetIndex += 1;

							e.source.backgroundImage = e.source.transImg;
							e.source.touchEnabled = false;

							lineEndTime = new Date();
							var timeDiff = Math.abs(lineEndTime.getTime() - lineStartTime.getTime());
							lineStartTime = new Date();
							var timeTaken = (timeDiff / 1000);
							timeTaken = timeTaken.toFixed(1);
							var displayText = e.source.customText;
							lineRoutArray.push({
								"Alphabet" : displayText,
								"Status" : 1,
								"TimeTaken" : timeTaken

							});

						} else {
							Ti.API.info('Wrong answer');
							currentpenalty = currentpenalty - 2;
							$.contentView.touchEnabled = false;
							$.countTimer.color = "red";
							$.penaltyLabel.text = currentpenalty;
							$.pentaltyView.visible = true;

							lineEndTime = new Date();
							var timeDiff = Math.abs(lineEndTime.getTime() - lineStartTime.getTime());
							lineStartTime = new Date();
							var timeTaken = (timeDiff / 1000);
							timeTaken = timeTaken.toFixed(1);
							var displayText = e.source.customText;
							lineRoutArray.push({
								"Alphabet" : displayText,
								"Status" : 0,
								"TimeTaken" : timeTaken

							});
							setTimeout(function() {
								$.contentView.touchEnabled = true;
								$.countTimer.color = "#ffffff";
								$.pentaltyView.visible = false;
							}, 2000);

						}
						Ti.API.info('targetIndex : ', targetIndex);

						if (targetIndex == noOfDiamondsToDisplayForTrailB) {

							if (lineRoutArray.length != 0) {
								lineRoutArrayFull.push({
									"Routes" : lineRoutArray,

								});
								lineRoutArray = [];
							}

							gameFinishStatus = 1;

							endTime = new Date().toUTCString();
							if (countDownTimer != null) {
								clearInterval(countDownTimer);
							}
							Ti.API.info('totalgameAttempt : ', totalgameAttempt, correctLines);

							if (totalgameAttempt < noOfDiamondsToDisplayForTrailB) {
								var gameScore = ((correctLines / noOfDiamondsToDisplayForTrailB) * 100).toFixed(1);
							} else {
								var gameScore = ((correctLines / totalgameAttempt) * 100).toFixed(1);
							}
							Ti.API.info('gameScore Jewels B : ', gameScore);
							Ti.API.info('gamePoints Jewels B  : ', gamePoints);
							if (gameScore == 100) {
								points = points + 2;
							} else {
								points = points + 1;
							}
							var jewelInfo = Ti.App.Properties.getObject(credentials.userId.toString());
							if (totalColelctedScore != 0) {
								var num1 = parseFloat(totalColelctedScore);
								var num2 = parseFloat(gameScore);
								Ti.API.info('num1 : ', num1, " num2 : ", num2);
								var sumscore = num1 + num2;
								totalColelctedScore = sumscore;
								var numberOfGames = jewelInfo.totalgamesTrailsB;

								var UpdatednumberOfGames = parseInt(numberOfGames) + 1;
								jewelInfo.totalgamesTrailsB = UpdatednumberOfGames;
							} else {
								var numberOfGames = jewelInfo.totalgamesTrailsB;

								var UpdatednumberOfGames = parseInt(numberOfGames) + 1;
								jewelInfo.totalgamesTrailsB = UpdatednumberOfGames;

								totalColelctedScore = gameScore;
							}
							Ti.App.Properties.setObject(credentials.userId.toString(), jewelInfo);
							totalCollectedJewels = totalCollectedJewels + correctLines;
							totalCollectedBonus = parseInt(totalCollectedBonus) + parseInt(remainingSeconds);
							console.log("totalCollectedBonus Jewels B : " + totalCollectedBonus);
							console.log("remainingSeconds Jewels B  : " + remainingSeconds);
							gamePoints = gamePoints + points;
							Ti.API.info('gamePoints1 Jewels B  : ', gamePoints);
							var timeDiff = commonFunctions.getMinuteSecond(startTime, endTime);
							StatusType = 2;
							if (args.type == 1) {
								commonFunctions.checkTotalEarnedBonusAndUpdateJewelTrailALevel(parseInt(remainingSeconds), credentials.userId.toString());
								commonDB.insertGameScore(17, gameScore, gamePoints, points);
								commonDB.insertJewelCounts(totalCollectedJewels, totalCollectedBonus, totalColelctedScore, 1);
								var totalDiamonds = "/" + noOfDiamondsToDisplayForTrailA;

								Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scoreScreen', {
									"GameID" : 17,
									"GameScore" : gameScore,
									"GameType" : 1,
									"GameName" : commonFunctions.L('jwelA', LangCode)

								});
							} else {
								commonFunctions.checkTotalEarnedBonusAndUpdateJewelTrailBLevel(parseInt(remainingSeconds), credentials.userId.toString());
								Ti.API.info('******* Jewels B Insert Scvore ' + gameScore);
								commonDB.insertGameScore(18, gameScore, gamePoints, points);
								commonDB.insertJewelCounts(totalCollectedJewels, totalCollectedBonus, totalColelctedScore, 2);
								var totalDiamonds = "/" + noOfDiamondsToDisplayForTrailB;

								Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scoreScreen', {
									"GameID" : 18,
									"GameScore" : gameScore,
									"GameType" : 1,
									"GameName" : commonFunctions.L('jwelB', LangCode)

								});
							}

						}

					}
				}

			});
			var lblFontSize;
			if (commonFunctions.getIsTablet()) {
				lblFontSize = Alloy.Globals.LargeMenuFontBoldTablet;
			} else {
				lblFontSize = Alloy.Globals.PointLargeFontBold;
			}
			var lbl = Titanium.UI.createLabel({
				height : Titanium.UI.SIZE,
				width : Titanium.UI.SIZE,
				text : displayText,
				touchEnabled : false,
				font : lblFontSize,
				color : '#ffffff'

			});
			AlphabetsView.add(lbl);

			$.alphabetOuterView.add(AlphabetsView);
			Ti.API.info('Add alphabet : ' + displayText);

			if (currentShape == noOfDiamondShapesToDisplayForTrailB) {
				currentShape = 1;
				displayText = displayText + 1;
			} else {
				currentShape = currentShape + 1;
			}

		};

	} catch(ex) {
		commonFunctions.handleException("trailsBNew", "createGame", ex);
	}

}

/**
 * Function to get random integer
 */
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Function to get random position
 */
function getRandomPosition(arr, n) {
	try {
		var tempArray = [];
		var result = [];
		var len = arr.length;
		var indexValue = 0;
		while (tempArray.length < n) {
			var randomnumber = Math.floor(Math.random() * len);
			if (tempArray.indexOf(randomnumber) > -1)
				continue;
			tempArray[tempArray.length] = randomnumber;

			result.push({
				x : arr[randomnumber].x,
				y : arr[randomnumber].y,
				index : indexValue
			});
			indexValue = indexValue + 1;

		}

		return result;
	} catch(ex) {
		commonFunctions.handleException("trailsB", "getRandomPosition", ex);
	}
}

/**
 * Function to get array positions
 */
function generatePositionsArray(maxX, maxY, safeRadius, irregularity) {
	try {
		var positionsArray = [];
		var r,
		    c;
		var rows;
		var columns;
		rows = Math.floor(maxY / safeRadius);
		columns = Math.floor(maxX / safeRadius);
		for ( r = 1; r <= rows; r += 1) {
			for ( c = 1; c <= columns; c += 1) {
				positionsArray.push({
					x : Math.round(maxX * c / columns) + getRandomInt(irregularity * -1, irregularity),
					y : Math.round(maxY * r / rows) + getRandomInt(irregularity * -1, irregularity),

				});

			}
		}
		return positionsArray;
	} catch(ex) {
		commonFunctions.handleException("trailsB", "generatePositionsArray", ex);
	}
}

/**
 * Function to refresh the window
 */
$.refreshWindow = function(e) {
	try {
		if (totalCollectedBonus > Alloy.Globals.jewelsTrailMaxTotalScore) {
			totalCollectedBonus = Alloy.Globals.jewelsTrailMaxTotalScore;
		}
		if (totalCollectedJewels > Alloy.Globals.jewelsTrailMaxTotalScore) {
			totalCollectedJewels = Alloy.Globals.jewelsTrailMaxTotalScore;
		}
		var jewelInfo = Ti.App.Properties.getObject(credentials.userId.toString());
		if (args.type == 1) {
			var numberOfGames = jewelInfo.totalgamesTrailsA;
			if (totalColelctedScore != 0 && numberOfGames != 0) {

				var tempvalue = (totalColelctedScore / numberOfGames).toFixed(1);
			} else {
				var tempvalue = 0;
			}

		} else {
			var numberOfGames = jewelInfo.totalgamesTrailsB;
			if (totalColelctedScore != 0 && numberOfGames != 0) {
				var tempvalue = (totalColelctedScore / numberOfGames).toFixed(1);
			} else {
				var tempvalue = 0;
			}
		}
		var totalBonusString = "/" + Alloy.Globals.jewelsTrailMaxTotalScore;
		commonFunctions.getScoreViewJewelTotal(tempvalue + "%", totalCollectedBonus + totalBonusString, totalCollectedJewels + totalBonusString);

	} catch(ex) {
		commonFunctions.handleException("jewelsTrailsIntro", "refreshWindow", ex);
	}
};

/**
 * Function to set Game Hint
 */
function setStartWithHint() {

	if (args.type == 1) {

		if (vNumber == 1) {
			var jewelWidth = "23dp";
			var jewelHeight = "22dp";
		} else if (vNumber == 2) {
			var jewelWidth = "28dp";
			var jewelHeight = "26dp";
		} else if (vNumber == 3) {
			var jewelWidth = "21dp";
			var jewelHeight = "22dp";
		} else if (vNumber == 4) {
			var jewelWidth = "29dp";
			var jewelHeight = "24dp";
		} else if (vNumber == 5) {
			var jewelWidth = "22dp";
			var jewelHeight = "22dp";
		} else if (vNumber == 6) {
			var jewelWidth = "23dp";
			var jewelHeight = "30dp";
		} else if (vNumber == 7) {
			var jewelWidth = "22dp";
			var jewelHeight = "36dp";
		} else if (vNumber == 8) {
			var jewelWidth = "23dp";
			var jewelHeight = "31dp";
		}
		$.informationImage.image = "/images/jewelTrails/jewel_A/" + vNumber + "/diamond-sm.png";
	} else {
		var jewelWidth = diamondHintSizeForTrailB["version"][vNumber-1]["diamond_size"][0]["width"];
		var jewelHeight = diamondHintSizeForTrailB["version"][vNumber-1]["diamond_size"][0]["height"];
		$.informationImage.image = "/images/jewelTrails/jewel_B/" + vNumber + startWithHintDiamondShapes[0];
		currentInfoIconIndex += 1;

	}

}

/**
 * Adding game hint
 */
function addStartWithHint(hintImg, hintImgWidth, hintImgHeight) {
	var startWithHintVw = Ti.UI.createView({
		left : 10,
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE
	});

	startWithHintImg = Ti.UI.createImageView({
		image : hintImg,
		width : hintImgWidth,
		height : hintImgHeight
	});

	var startWithHintLbl = Ti.UI.createLabel({
		width : Titanium.UI.SIZE,
		height : Titanium.UI.SIZE,
		color : '#ffffff',
		font : Alloy.Globals.MediumMenuFontBold,
		text : "1",
		zIndex : 1
	});
	startWithHintVw.add(startWithHintImg);
	startWithHintVw.add(startWithHintLbl);
	$.startWithHintContainerVw.add(startWithHintVw);
}

/**
 * Function to restart game
 */
function restartGame() {
	try {
		resetAllvalues();
		if (countDownTimer != null) {
			clearInterval(countDownTimer);
		}
		if (args.type == 1) {
			createGame();
		} else {
			createGameB();
		}

	} catch(ex) {
		commonFunctions.handleException("trailsB", "restartClick", ex);
	}
}

/**
 * Function to reset values
 */
function resetAllvalues() {
	startTime = "";
	endTime = "";
	points = 0;
	gamePoints = 0;
	correctLines = 0;
	lineStartTime = new Date();
	lineEndTime = new Date();
	totalgameAttempt = 0;
	gameStarted = 0;
	targetIndex = 0;
	gameFinishStatus = 0;
	countDownTimer = null;
	lineRoutArrayFull = [];
	lineRoutArray = [];
	lastWrongUndo = null;
	jewelType = Ti.App.Properties.getString("jewelType", 1);
	timerStartCount = 60;
	remainingSeconds = 0;
	totalCollectedJewels = 0;
	totalCollectedBonus = 0;
	totalColelctedScore = 0;
	currentpenalty = 0;
	currentInfoIconIndex = 0;
	resultSubmited = false;
	startWithHintImg = null;
	vNumber = 1;
	StatusType = 1;
	jewelTimerStart = 0;
	if ($.alphabetOuterView.children && $.alphabetOuterView.children.length > 0) {
		// Make a copy of the array
		var children = $.alphabetOuterView.children.slice(0);
		var numChildren = children.length;
		for ( m = 0; m < numChildren; m++) {

			$.alphabetOuterView.remove(children[m]);

		}
	}

	var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
	vNumber = versionsInfo.Jewel;
	if (vNumber == "") {
		versionsInfo.Jewel = 2;
		vNumber = 1;
	} else if (vNumber == 1 || vNumber == "1") {
		versionsInfo.Jewel = 2;
	} else if (vNumber == 2 || vNumber == "2") {
		versionsInfo.Jewel = 3;
	} else if (vNumber == 3 || vNumber == "3") {
		versionsInfo.Jewel = 4;
	} else if (vNumber == 4 || vNumber == "4") {
		versionsInfo.Jewel = 5;
	} else if (vNumber == 5 || vNumber == "5") {
		versionsInfo.Jewel = 6;
	} else if (vNumber == 6 || vNumber == "6") {
		versionsInfo.Jewel = 7;
	} else if (vNumber == 7 || vNumber == "7") {
		versionsInfo.Jewel = 8;
	} else if (vNumber == 8 || vNumber == "8") {
		versionsInfo.Jewel = 1;
	}
	Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);

	noOfDiamondShapesToDisplayForTrailB = commonFunctions.getJewelsTrailBGameDiamondsShapesToDisplay(credentials.userId.toString());
	var gameInfo = commonDB.getGameScore(credentials.userId);
	Ti.API.info('gameInfo : ', gameInfo);
	for (var i = 0; i < gameInfo.length; i++) {
		if (args.type == 1) {
			if (gameInfo[i].gameID == 17) {
				gamePoints = gameInfo[i].points;
				Ti.API.info('gamePoints : ', gamePoints);
			}
		} else {
			if (gameInfo[i].gameID == 18) {
				gamePoints = gameInfo[i].points;
				Ti.API.info('gamePoints : ', gamePoints);
			}

		}
	}
	if (args.type == 1) {
		var jewelInfo = commonDB.getJewelsCount(1);
	} else {
		var jewelInfo = commonDB.getJewelsCount(2);
	}
	Ti.API.info('jewelInfo : ', jewelInfo);
	if (jewelInfo.length != 0) {
		totalCollectedJewels = jewelInfo[0].totalJewel;
		totalCollectedBonus = jewelInfo[0].totalBonus;
		totalColelctedScore = jewelInfo[0].totalScore;
	}
	var retrievedJSONStr = Ti.App.Properties.getString('JewelsTrailsASettings', 'JewelsTrailsASettings not found');
	var jewelTrailsASettingsJSON = JSON.parse(retrievedJSONStr);
	var retrievedJSONStrB = Ti.App.Properties.getString('JewelsTrailsBSettings', 'JewelsTrailsBSettings not found');
	var jewelTrailsBSettingsJSON = JSON.parse(retrievedJSONStrB);
	if (args.type == 1) {
		var level = Ti.App.Properties.getInt('difficultyTypeA');
	} else {
		var level = Ti.App.Properties.getInt('difficultyTypeB');
	}

	Ti.API.info('level is', level);
	if (level == null || level == "" || level == 0) {
		level = 1;
	}
	if (args.type == 1) {
		var titleText = commonFunctions.L('jwelA', LangCode);
		if (Ti.Platform.osname == "ipad") {
			$.headerView.setTitle(titleText);
		} else {
			$.headerView.setTitle(commonFunctions.trimText(titleText, 12));
		}

	} else {
		var titleText = commonFunctions.L('jwelB', LangCode);
		if (Ti.Platform.osname == "ipad") {
			$.headerView.setTitle(titleText);
		} else {
			$.headerView.setTitle(commonFunctions.trimText(titleText, 12));
		}
	}
	if (args.type == 1) {
		if (level == 1) {
			timerStartCount = jewelTrailsASettingsJSON["NoOfSeconds_Beg"] ? jewelTrailsASettingsJSON["NoOfSeconds_Beg"] : Alloy.Globals.jewelsTrailABeginnerTimerDefault;
		} else if (level == 2) {
			timerStartCount = jewelTrailsASettingsJSON["NoOfSeconds_Int"] ? jewelTrailsASettingsJSON["NoOfSeconds_Int"] : Alloy.Globals.jewelsTrailAIntermediateTimerDefault;
		} else if (level == 3) {
			timerStartCount = jewelTrailsASettingsJSON["NoOfSeconds_Adv"] ? jewelTrailsASettingsJSON["NoOfSeconds_Adv"] : Alloy.Globals.jewelsTrailAAdvancedTimerDefault;
		} else if (level == 4) {
			timerStartCount = jewelTrailsASettingsJSON["NoOfSeconds_Exp"] ? jewelTrailsASettingsJSON["NoOfSeconds_Exp"] : Alloy.Globals.jewelsTrailAExpertTimerDefault;
		}
	} else {
		if (level == 1) {
			timerStartCount = jewelTrailsBSettingsJSON["NoOfSeconds_Beg"] ? jewelTrailsBSettingsJSON["NoOfSeconds_Beg"] : Alloy.Globals.jewelsTrailBBeginnerTimerDefault;
		} else if (level == 2) {
			timerStartCount = jewelTrailsBSettingsJSON["NoOfSeconds_Int"] ? jewelTrailsBSettingsJSON["NoOfSeconds_Int"] : Alloy.Globals.jewelsTrailBIntermediateTimerDefault;
		} else if (level == 3) {
			timerStartCount = jewelTrailsBSettingsJSON["NoOfSeconds_Adv"] ? jewelTrailsBSettingsJSON["NoOfSeconds_Adv"] : Alloy.Globals.jewelsTrailBAdvancedTimerDefault;
		} else if (level == 4) {
			timerStartCount = jewelTrailsBSettingsJSON["NoOfSeconds_Exp"] ? jewelTrailsBSettingsJSON["NoOfSeconds_Exp"] : Alloy.Globals.jewelsTrailBExpertTimerDefault;
		}

	}
	$.startWithHintContainerVw.visible = true;
	$.messageView.visible = true;
	setStartWithHint();
}