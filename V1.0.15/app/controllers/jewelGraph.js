// Arguments passed into this controller can be accessed off of the `$.args` object directly or:

var args = arguments[0] || {};
var serviceManager = require('serviceManager');
var commonFunctions = require('commonFunctions');
var commonDB = require('commonDB');
var credentials = Alloy.Globals.getCredentials();
var arrayScore = [];
var arrayJewel = [];
var arrayBonus = [];
var arrayScoreWeek = [];
var arrayJewelWeek = [];
var arrayBonusWeek = [];
var xAxisArray = [];
var xAxisArrayWeek = [];
var LangCode = Ti.App.Properties.getString('languageCode');
$.jewelGraph.addEventListener("open", function(e) {
	if (OS_IOS) {
		if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
			$.headerContainer.height = "80dp";
			$.contentView.top = "80dp";
			$.footerView.bottom = "10dp";
		}
	}
	$.headerView.setTitle(commonFunctions.L('reprtLbl', LangCode));
	$.lastWeekLabel.text = commonFunctions.L('lastweekLbl', LangCode);
	$.lastMonthLabel.text = commonFunctions.L('lastmnthLbl', LangCode);
	try {
		if (Ti.Network.online) {
			commonFunctions.openActivityIndicator(commonFunctions.L('activityLoading', LangCode));
			serviceManager.GetUserReport(credentials.userId, getJewelValueSuccess, getJewelValueFailure);
		}

	} catch(ex) {
		commonFunctions.handleException("jewelsTrailsA", "open", ex);
	}
});
/***
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
function getJewelValueSuccess(e) {
	try {

		var response = JSON.parse(e.data);

		if (response.ErrorCode == 0) {

			if (args.type == 1) {
				for (var i = 0; i < response.JewelsTrialsAList.length; i++) {
					var xvalue = "";
					var dateValue = response.JewelsTrialsAList[i].CreatedDate;
					var arr1 = dateValue.split("T");
					if (arr1[0] != null && arr1[0] != "") {
						var arr2 = arr1[0].split("-");
						if (arr2.length == 3) {
							xvalue = arr2[1] + "/" + arr2[2];
							xAxisArray.push(xvalue);
						}
					}
					arrayScore.push(response.JewelsTrialsAList[i].ScoreAvg);
					arrayJewel.push(response.JewelsTrialsAList[i].TotalJewelsCollected);
					arrayBonus.push(response.JewelsTrialsAList[i].TotalBonusCollected);
					if (response.JewelsTrialsAList.length > 7) {
						var maxValue = response.JewelsTrialsAList.length - 8;
						if (i > maxValue) {
							xAxisArrayWeek.push(xvalue);
							arrayScoreWeek.push(response.JewelsTrialsAList[i].ScoreAvg);
							arrayJewelWeek.push(response.JewelsTrialsAList[i].TotalJewelsCollected);
							arrayBonusWeek.push(response.JewelsTrialsAList[i].TotalBonusCollected);

						}

					} else {
						xAxisArrayWeek.push(xvalue);
						arrayScoreWeek.push(response.JewelsTrialsAList[i].ScoreAvg);
						arrayJewelWeek.push(response.JewelsTrialsAList[i].TotalJewelsCollected);
						arrayBonusWeek.push(response.JewelsTrialsAList[i].TotalBonusCollected);
					}

				};
			} else {
				for (var i = 0; i < response.JewelsTrialsBList.length; i++) {
					var xvalue = "";
					var dateValue = response.JewelsTrialsBList[i].CreatedDate;
					var arr1 = dateValue.split("T");
					if (arr1[0] != null && arr1[0] != "") {
						var arr2 = arr1[0].split("-");
						if (arr2.length == 3) {
							xvalue = arr2[1] + "/" + arr2[2];
							xAxisArray.push(xvalue);
						}
					}
					arrayScore.push(response.JewelsTrialsBList[i].ScoreAvg);
					arrayJewel.push(response.JewelsTrialsBList[i].TotalJewelsCollected);
					arrayBonus.push(response.JewelsTrialsBList[i].TotalBonusCollected);
					if (response.JewelsTrialsBList.length > 7) {
						var maxValue = response.JewelsTrialsBList.length - 8;
						if (i > maxValue) {
							xAxisArrayWeek.push(xvalue);
							arrayScoreWeek.push(response.JewelsTrialsBList[i].ScoreAvg);
							arrayJewelWeek.push(response.JewelsTrialsBList[i].TotalJewelsCollected);
							arrayBonusWeek.push(response.JewelsTrialsBList[i].TotalBonusCollected);
						}
					} else {
						xAxisArrayWeek.push(xvalue);
						arrayScoreWeek.push(response.JewelsTrialsBList[i].ScoreAvg);
						arrayJewelWeek.push(response.JewelsTrialsBList[i].TotalJewelsCollected);
						arrayBonusWeek.push(response.JewelsTrialsBList[i].TotalBonusCollected);

					}

				};

			}
			$.lastMonthButton.backgroundColor = Alloy.Globals.HEADER_COLOR;
			$.lastMonthLabel.color = "white";

			$.pie_chart.loadChart('LINE', {
				s1 : arrayScore,
				s2 : arrayJewel,
				s3 : arrayBonus,
				reg : xAxisArray
			});
		}

		commonFunctions.closeActivityIndicator();

	} catch(ex) {
		commonFunctions.handleException("articles", "getArticleSuccess", ex);
	}
}

function getJewelValueFailure(e) {

	commonFunctions.closeActivityIndicator();

}

$.jewelGraph.addEventListener('android:back', function() {
	goBack();
});
$.headerView.on('backButtonClick', function(e) {

	goBack();
});
function goBack(e) {

	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelGraph');

}

function weeklyClick(e) {

	$.lastWeekButton.backgroundColor = Alloy.Globals.HEADER_COLOR;
	$.lastWeekLabel.color = "white";
	$.lastMonthButton.backgroundColor = "white";
	$.lastMonthLabel.color = Alloy.Globals.HEADER_COLOR;
	$.contentView.visible = false;
	$.pie_chart.loadChart('LINE', {
		s1 : arrayScoreWeek,
		s2 : arrayJewelWeek,
		s3 : arrayBonusWeek,
		reg : xAxisArrayWeek
	});
	setTimeout(function() {
		$.contentView.visible = true;
	}, 1000);

}

function monthlyClick(e) {

	$.lastMonthButton.backgroundColor = Alloy.Globals.HEADER_COLOR;
	$.lastMonthLabel.color = "white";
	$.lastMonthLabel.color = "white";
	$.lastWeekButton.backgroundColor = "white";
	$.lastWeekLabel.color = Alloy.Globals.HEADER_COLOR;
	$.contentView.visible = false;
	$.pie_chart.loadChart('LINE', {
		s1 : arrayScore,
		s2 : arrayJewel,
		s3 : arrayBonus,
		reg : xAxisArray
	});
	setTimeout(function() {
		$.contentView.visible = true;
	}, 1000);

}