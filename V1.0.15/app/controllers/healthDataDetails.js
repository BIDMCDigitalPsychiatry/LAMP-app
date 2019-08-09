// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = arguments[0] || {};
var commonFunctions = require('commonFunctions');
var serviceManager = require('serviceManager');
var commonDB = require('commonDB');
var credentials = Alloy.Globals.getCredentials();
var LangCode = Ti.App.Properties.getString('languageCode');
$.healthDataDetails.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
				$.HealthListView.bottom = "30dp";
				$.supportLabel.bottom = "20dp";
			}

		}
		$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
		var dataArray = [];
		var unitText = "";
		var valueText = "";
		var dateText = "";
		var fontSize = Alloy.Globals.LargeFontLight;

		if (args.detailsArray.length != 0) {
			for (var i = 0; i < args.detailsArray.length; i++) {
				if (i > 29) {
					break;
				}
				if (args.rowIndex == 3) {
					$.headerView.setTitle(commonFunctions.L('heightLbl', LangCode));
					unitText = "";
					valueText = args.detailsArray[i].value;
					dateText = args.detailsArray[i].date;

				} else if (args.rowIndex == 4) {
					$.headerView.setTitle(commonFunctions.L('wieghtLbl', LangCode));
					unitText = "";
					valueText = args.detailsArray[i].value;
					dateText = args.detailsArray[i].date;

				} else if (args.rowIndex == 5) {
					$.headerView.setTitle(commonFunctions.L('heartLbl', LangCode));
					unitText = "bpm";
					var minValue = args.detailsArray[i].minValue.split(" ");
					var maxValue = args.detailsArray[i].maxValue.split(" ");
					valueText = minValue[0] + " - " + maxValue[0];
					dateText = args.detailsArray[i].date;

				} else if (args.rowIndex == 6) {
					$.headerView.setTitle(commonFunctions.L('BpLbl', LangCode));
					unitText = "mmHg";

					var sPressure = args.detailsArray[i].sPressure.split(" ");
					var dPressure = args.detailsArray[i].dPressure.split(" ");
					valueText = sPressure[0] + " / " + dPressure[0];
					dateText = args.detailsArray[i].date;

				} else if (args.rowIndex == 7) {
					$.headerView.setTitle(commonFunctions.L('respiratoryLbl', LangCode));
					unitText = "";
					valueText = args.detailsArray[i].value;
					dateText = args.detailsArray[i].date;

				} else if (args.rowIndex == 8) {
					$.headerView.setTitle(commonFunctions.L('sleepLbl', LangCode));
					unitText = "";
					valueText = args.detailsArray[i].sDate + " - " + args.detailsArray[i].eDate;
					dateText = args.detailsArray[i].value;
					fontSize = Alloy.Globals.MediumTimeLargeFontLight;
				} else if (args.rowIndex == 9 || args.rowIndex == 10) {
					if (args.rowIndex == 9) {
						$.headerView.setTitle(commonFunctions.L('stepLbl', LangCode));
						unitText = "Steps";
					} else if (args.rowIndex == 10) {
						$.headerView.setTitle("FLIGHTS CLIMBED");
						unitText = "Flights";
					}

					var step = args.detailsArray[i].value.split(" ");
					valueText = step[0];
					dateText = args.detailsArray[i].date;
				}

				dataArray.push({
					template : "healthDataTemplate",
					valueLabel : {
						text : valueText + " " + unitText,
						font : fontSize

					},
					dateLabel : {
						text : dateText,
						font : fontSize

					},

				});

			};
			$.lstSection.setItems(dataArray);

		}

	} catch(ex) {

		commonFunctions.handleException("healthDataDetails", "open", ex);
	}
});
/***
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
$.headerView.on('backButtonClick', function(e) {
	goBack();
});
function goBack(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('healthDataDetails');
}

/**
 * function for android back
 */
$.healthDataDetails.addEventListener('android:back', function() {
	goBack();
});
