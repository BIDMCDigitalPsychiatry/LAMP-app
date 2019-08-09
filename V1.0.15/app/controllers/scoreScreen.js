// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var gameType = args.GameType;
var serviceManager = require('serviceManager');
var LangCode = Ti.App.Properties.getString('languageCode');
var commonFunctions = require('commonFunctions');
var dayArray = [];
var scoreArray = [];
var covertedDayArray = [];
/**
 * function for screen open
 */
$.scoreScreen.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerView.height = "80dp";
				$.scrollView.top = "80dp";
			}

		}
		$.headerLabel.text = args.GameName + " " + commonFunctions.L('scoreLbl', LangCode);
		$.highTitleLbl.text = commonFunctions.L('highScoreLbl', LangCode);
		$.lowTitleLbl.text = commonFunctions.L('lowscoreLbl', LangCode);
		$.brainText.text = commonFunctions.L('scoreBrainLbl', LangCode);
		$.currentScoreLabel.text = Math.trunc(args.GameScore);

		if (Ti.Network.online) {
			var graphParam = {
				"GameID" : args.GameID
			};
			serviceManager.getGraphDetails(graphParam, onGetGraphDetailsSuccess, onGetGraphDetailsError);
		} else {
			commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));
		}
	} catch(ex) {
		commonFunctions.handleException("scoreScreen", "open", ex);
	}
});

/**
 * On service success
 */
function onGetGraphDetailsSuccess(e) {
	var response = JSON.parse(e.data);

	if (response.HighScore == null) {
		response.HighScore = -1;
	}
	if (response.LowScore == null) {
		response.LowScore = -1;
	}
	if (args.GameScore == null) {
		args.GameScore = 0;
	}

	if (response.HighScore == -1) {
		$.highScoreLbl.text = Math.trunc(args.GameScore);
	} else {
		if (Math.trunc(args.GameScore) >= Math.trunc(response.HighScore)) {
			$.highScoreLbl.text = Math.trunc(args.GameScore);
		} else {
			$.highScoreLbl.text = Math.trunc(response.HighScore);
		}
	}

	if (response.LowScore == -1) {
		if (response.HighScore == -1 && Math.trunc(args.GameScore) == 0) {
			$.lowScoreLbl.text = 0;
		} else if (response.HighScore == -1) {
			$.lowScoreLbl.text = "NA";
		} else {
			if (Math.trunc(args.GameScore) <= Math.trunc(response.HighScore)) {
				$.lowScoreLbl.text = Math.trunc(args.GameScore);
			} else {
				$.lowScoreLbl.text = Math.trunc(response.HighScore);
			}
		}

	} else {
		if (Math.trunc(args.GameScore) <= Math.trunc(response.LowScore)) {
			if (Math.trunc(args.GameScore) == 0) {
				$.lowScoreLbl.text = Math.trunc(response.LowScore);
			} else {
				$.lowScoreLbl.text = Math.trunc(args.GameScore);
			}
		} else {

			$.lowScoreLbl.text = Math.trunc(response.LowScore);
		}
	}
	if (gameType == 1) {
		$.brainImage.image = "/images/score/brain_img1.png";
	} else if (gameType == 2) {
		$.brainImage.image = "/images/score/brain_img2.png";
	}

	var startDate = new Date();
	var aryDates = GetDates(startDate, 7);
	dayArray = aryDates.reverse();

	for (var i = 0; i < 7; i++) {
		var day = commonFunctions.getWeekName(dayArray[i]);

		covertedDayArray.push(day);

	}

	scoreArray = response.DayTotalScore;
	if (scoreArray[6] == null) {
		scoreArray[6] = 0;
	}

	scoreArray[6] = parseInt(scoreArray[6]) + parseInt(args.GameScore);
	

	var largest = 0;

	for ( i = 0; i < scoreArray.length; i++) {
		if (scoreArray[i] > largest) {
			largest = scoreArray[i];
		}
	}

	$.pie_chart.loadChart('SCORE', {
		region : covertedDayArray,
		s1 : scoreArray,
		largest : largest,
		titleY : commonFunctions.L('scoreLbl', LangCode),
		titleX : commonFunctions.L('yourScoreLbl', LangCode),
		titleTop : commonFunctions.L('weeklyScoreLbl', LangCode)
	});

}

/**
 * Function to get dates
 */
function GetDates(startDate, daysToAdd) {
	var aryDates = [];
	for (var i = 0; i < daysToAdd; i++) {
		var currentDate = new Date();
		currentDate.setDate(startDate.getDate() - i);
		aryDates.push(DayAsString(currentDate.getDay()));
	}
	return aryDates;
}

function DayAsString(dayIndex) {
	var weekdays = new Array(7);
	weekdays[0] = "Sunday";
	weekdays[1] = "Monday";
	weekdays[2] = "Tuesday";
	weekdays[3] = "Wednesday";
	weekdays[4] = "Thursday";
	weekdays[5] = "Friday";
	weekdays[6] = "Saturday";
	return weekdays[dayIndex];
}

/**
 * On error of api
 */
function onGetGraphDetailsError(e) {

}

/**
 * On close click
 */
function onCloseClick() {
	Ti.App.fireEvent("getValues");
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('scoreScreen');
}
