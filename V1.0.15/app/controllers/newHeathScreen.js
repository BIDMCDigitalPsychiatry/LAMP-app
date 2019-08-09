// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var commonFunctions = require('commonFunctions');
if (OS_IOS) {
	var TiHealthkit = require('com.zco.healthKitIOS');

} else {

}
var healthDatas = [];
var LangCode = Ti.App.Properties.getString('languageCode');
var result = "NA";
var displayDate;
var average = "";
var textPosition = 12;
var anchorDate = new Date();
var ValueArray = [];
// midnight
anchorDate.setHours(0, 0, 0, 0);
if (OS_IOS) {
	var startDate = new Date();
	startDate.setDate(startDate.getDate() - 30);
	var endDate = new Date();
}
var heightLbl = commonFunctions.L('heightLbl', LangCode);
var weightLbl = commonFunctions.L('wieghtLbl', LangCode);
var heartLbl = commonFunctions.L('heartLbl', LangCode);
var stepLbl = commonFunctions.L('stepLbl', LangCode);
var repsiratoryLbl = commonFunctions.L('respiratoryLbl', LangCode);
var flightLbl = commonFunctions.L('flightLbl', LangCode);
var sleepLbl = commonFunctions.L('sleepLbl', LangCode);
var sexLbl = commonFunctions.L('sexLbl', LangCode);
var bloodLbl = commonFunctions.L('bloodtypeLbl', LangCode);
var bpLbl = commonFunctions.L('BpLbl', LangCode);
var fmLbl = commonFunctions.L('femaleLbl', LangCode);
var maleLbl = commonFunctions.L('maleLbl', LangCode);
var otherLbl = commonFunctions.L('otherLbl', LangCode);

if (!OS_IOS) {
	var healthArray = [{
		field : commonFunctions.L('heightLbl', LangCode)
	}, {
		field : commonFunctions.L('wieghtLbl', LangCode)
	}, {
		field : commonFunctions.L('heartLbl', LangCode)
	}, {
		field : commonFunctions.L('distanceLbl', LangCode)
	}, {
		field : commonFunctions.L('stepLbl', LangCode)
	}, {
		field : commonFunctions.L('segmnetLbl', LangCode)
	}];
}

/**
 * Function for screen open
 */
$.newHeathScreen.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
				$.healthScrollView.bottom = "40dp";
				$.supportLabel.bottom = "20dp";
			}

		}
		$.headerView.setTitle(commonFunctions.L('healthDataTitle', LangCode));
		$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
		if (OS_IOS) {

			healthKitAuthorization();
		} else {
			googleFitDataAndroid();
		}
	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("healthData", "open", ex);
	}
});

function onDetailsClick(e) {

	var index;
	if (e.source.id == "dobouterView") {
		index = 0;
	} else if (e.source.id == "genderouterView") {
		index = 1;
	} else if (e.source.id == "bloodouterView") {
		index = 2;
	} else if (e.source.id == "heightouterView") {
		index = 3;
	} else if (e.source.id == "weightouterView") {
		index = 4;
	}
	if (healthDatas[index].detailsArray.length != 0) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('healthDataDetails', {
			"detailsArray" : healthDatas[index].detailsArray,
			"rowIndex" : index
		});
	}
}

/***
 * Function for loading health datas
 */
function loadHealthDatas() {
	try {

		if (OS_IOS) {
			var length = 5;
		} else {
			var length = 2;
		}

		if (OS_IOS) {

			if (healthDatas[0].average != "NA") {
				$.dobaverageLabel.text = healthDatas[0].average.toString();
			}
			$.dobdataLabel.text = healthDatas[0].field;
			$.dobdataLabel.top = healthDatas[0].position + "dp";
			if (healthDatas[0].value != " ") {
				$.dobdataValueLabel.text = healthDatas[0].value;
			} else {
				$.dobdataValueLabel.text = "NA";
			}

			$.dobdataValueLabel.top = healthDatas[0].position + "dp";

			if (healthDatas[1].average != "NA") {
				$.genderaverageLabel.text = healthDatas[1].average.toString();
			}

			$.genderdataLabel.text = healthDatas[1].field;
			$.genderdataLabel.top = healthDatas[1].position + "dp";
			if (healthDatas[1].value != " ") {
				$.genderdataValueLabel.text = healthDatas[1].value;
			} else {
				$.genderdataValueLabel.text = "NA";
			}

			$.genderdataValueLabel.top = healthDatas[1].position + "dp";

			if (healthDatas[2].average != "NA") {
				$.bloodaverageLabel.text = healthDatas[2].average.toString();
			}
			$.blooddataLabel.text = healthDatas[2].field;
			$.blooddataLabel.top = healthDatas[2].position + "dp";
			if (healthDatas[2].value != " ") {
				$.blooddataValueLabel.text = healthDatas[2].value;
			} else {
				$.blooddataValueLabel.text = "NA";
			}

			$.blooddataValueLabel.top = healthDatas[2].position + "dp";

			if (healthDatas[3].average != "NA") {
				$.heightaverageLabel.text = healthDatas[3].average.toString();
			}

			$.heightdataLabel.text = healthDatas[3].field;
			$.heightdataLabel.top = healthDatas[3].position + "dp";

			$.heightdataValueLabel.text = healthDatas[3].value;

			$.heightdataValueLabel.top = healthDatas[3].position + "dp";
			$.heightdateLabel.text = healthDatas[3].date;

			if (healthDatas[4].average != "NA") {
				$.weightaverageLabel.text = healthDatas[4].average.toString();
			}

			$.weightdataLabel.text = healthDatas[4].field;
			$.weightdataLabel.top = healthDatas[4].position + "dp";
			$.weightdataValueLabel.text = healthDatas[4].value;
			$.weightdataValueLabel.top = healthDatas[4].position + "dp";
			$.weightdateLabel.text = healthDatas[4].date;
		}

		if (!OS_IOS) {

			for (var i = 0; i < length; i++) {
				var outerView = Ti.UI.createView({
					backgroundColor : '#ffffff',
					width : Ti.UI.FILL,
					height : '50dp',
					right : '4dp',
					left : '4dp',
					top : "6dp",
					index : i
				});

				var dataFieldView = Ti.UI.createView({
					backgroundColor : 'transparent',
					width : Ti.UI.SIZE,
					height : Ti.UI.SIZE,
					left : '0dp'
				});

				var valueView = Ti.UI.createView({
					backgroundColor : 'transparent',
					width : Ti.UI.SIZE,
					height : Ti.UI.SIZE,
					right : '10dp'
				});
				var dataLabel = Ti.UI.createLabel({
					width : Ti.UI.SIZE,
					height : Ti.UI.SIZE,
					color : '#546e7a',
					font : Alloy.Globals.MediumFontLight,
					left : '10dp',
					opacity : 1,
					top : healthDatas[i].position + "dp",
					text : healthDatas[i].field
				});

				var averageLabel = Ti.UI.createLabel({
					width : Ti.UI.SIZE,
					height : Ti.UI.SIZE,
					color : '#546e7a',
					font : Alloy.Globals.MediumFontLight,
					left : '10dp',
					opacity : 1,
					top : "20dp",
					text : healthDatas[i].average
				});

				var dataValueLabel = Ti.UI.createLabel({
					width : Ti.UI.SIZE,
					height : Ti.UI.SIZE,
					color : '#90a4ae',
					font : Alloy.Globals.smallSemiBold,
					opacity : 1,
					top : healthDatas[i].position + "dp",
					text : healthDatas[i].value,
					right : 0
				});
				var dateLabel = Ti.UI.createLabel({
					width : Ti.UI.SIZE,
					height : Ti.UI.SIZE,
					color : '#90a4ae',
					font : Alloy.Globals.smallSemiBold,
					opacity : 1,
					right : 0,
					top : "20dp",
					text : healthDatas[i].date
				});

				var seperator = Ti.UI.createView({
					width : Ti.UI.FILL,
					height : '1dp',
					right : '10dp',
					left : '10dp',
					bottom : "5dp",
					backgroundColor : '#E7EAED'
				});

				dataFieldView.add(dataLabel);
				dataFieldView.add(averageLabel);
				valueView.add(dataValueLabel);
				valueView.add(dateLabel);
				outerView.add(dataFieldView);
				outerView.add(valueView);
				outerView.add(seperator);
				$.firstView.add(outerView);

			}
		}

		if (OS_IOS) {
			$.heartDataLbl.text = healthDatas[5].field;

			if (healthDatas[5].value == "NA") {
				$.heartValueLbl.color = '#b0bec5';
				$.heartImg.image = '/images/healthKit/heart_rate_disable.png';
			} else {
				var heartRate = healthDatas[5].value.split(" ");
				$.heartValueLbl.text = heartRate[0] + " " + "beats/min";

				$.heartValueLbl.color = '#359ffe';
				$.heartImg.image = '/images/healthKit/heart_rate.png';
			}

			$.heartValueDataLbl.text = healthDatas[5].date;

			$.bpDataLbl.text = healthDatas[6].field;
			$.respiratorydataLbl.text = healthDatas[7].field;
			$.sleepDataLbl.text = healthDatas[8].field;
			$.stepDataLbl.text = healthDatas[9].field;
			$.flightDataLbl.text = healthDatas[10].field;

			$.bpValueDateLbl.text = healthDatas[6].date;
			$.respiratoryValueLbl.text = healthDatas[7].date;
			$.sleepDateLbl.text = healthDatas[8].date;
			$.stepValueLbl.text = healthDatas[9].date;
			$.flightDateLbl.text = healthDatas[10].date;

			$.bpValueLbl.text = healthDatas[6].value;
			if ($.bpValueLbl.text == "NA") {
				$.bpValueLbl.color = '#b0bec5';
				$.bpImg.image = '/images/healthKit/blood_pressure_disable.png';

			} else {
				$.bpValueLbl.color = '#359ffe';
				$.bpImg.image = '/images/healthKit/blood_pressure.png';
			}

			if (healthDatas[7].value == "NA") {
				$.respiratoryLbl.color = '#b0bec5';
				$.respiratoryImg.image = '/images/healthKit/resipiratory_rate_disable.png';
			} else {

				var resRate = healthDatas[7].value.split(" ");
				$.respiratoryLbl.text = resRate[0] + " " + "breaths/min";
				$.respiratoryLbl.color = '#359ffe';
				$.respiratoryImg.image = '/images/healthKit/resipiratory_rate.png';
			}
			$.sleepLbl.text = healthDatas[8].value;
			if ($.sleepLbl.text == "NA") {
				$.sleepLbl.color = '#b0bec5';
				$.sleepImg.image = '/images/healthKit/sleep_disable.png';
			} else {
				$.sleepLbl.color = '#359ffe';
				$.sleepImg.image = '/images/healthKit/sleep.png';
			}

			if (healthDatas[9].value == "NA") {
				$.stepLbl.color = '#b0bec5';
				$.stepImg.image = '/images/healthKit/steps_disable.png';
			} else {
				$.stepLbl.text = healthDatas[9].value + " " + "steps";
				$.stepLbl.color = '#359ffe';
				$.stepImg.image = '/images/healthKit/steps.png';
			}
			$.flightLbl.text = healthDatas[10].value;
			if (healthDatas[10].value == "NA") {
				$.flightLbl.color = '#b0bec5';
				$.flightImg.image = '/images/healthKit/flights_climbed_disable.png';
			} else {
				$.flightLbl.color = '#359ffe';
				$.flightImg.image = '/images/healthKit/flights_climbed.png';
			}

		} else {

			$.heartDataLbl.text = healthDatas[2].field;

			$.distanceDataLbl.text = healthDatas[3].field;
			$.stepDataLbl.text = healthDatas[4].field;
			$.segmentDataLbl.text = healthDatas[5].field;

			$.heartValueDataLbl.text = healthDatas[2].date;

			$.distanceValueDateLbl.text = healthDatas[3].date;

			$.stepValueLbl.text = healthDatas[4].date;

			$.segmentDateLbl.text = healthDatas[5].date;

			$.heartValueDataLbl.text = healthDatas[2].value;

			$.distanceValueLbl.text = healthDatas[3].value;

			$.stepLbl.text = healthDatas[4].value;

			$.segmentLbl.text = healthDatas[5].value;

		}

		commonFunctions.closeActivityIndicator();
	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("healthdatas", "loadHealthDatas", ex);
	}
}

/**
 * Function for leftclick
 */
function onHeartClick(e) {
	if (healthDatas[5].detailsArray.length != 0) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('healthDataDetails', {
			"detailsArray" : healthDatas[5].detailsArray,
			"rowIndex" : 5
		});
	}

}

function onBpClick(e) {
	if (healthDatas[6].detailsArray.length != 0) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('healthDataDetails', {
			"detailsArray" : healthDatas[6].detailsArray,
			"rowIndex" : 6
		});
	}
}

function onRespiratoryClick(e) {
	if (healthDatas[7].detailsArray.length != 0) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('healthDataDetails', {
			"detailsArray" : healthDatas[7].detailsArray,
			"rowIndex" : 7
		});
	}
}

function onStepsClick(e) {
	if (healthDatas[9].detailsArray.length != 0) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('healthDataDetails', {
			"detailsArray" : healthDatas[9].detailsArray,
			"rowIndex" : 9
		});
	}
}

function onSleepClick(e) {
	if (healthDatas[8].detailsArray.length != 0) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('healthDataDetails', {
			"detailsArray" : healthDatas[8].detailsArray,
			"rowIndex" : 8
		});
	}
}

function onFlightsClick(e) {
	if (healthDatas[10].detailsArray.length != 0) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('healthDataDetails', {
			"detailsArray" : healthDatas[10].detailsArray,
			"rowIndex" : 10
		});
	}
}

/**
 * function for back button click
 */

$.headerView.on('backButtonClick', function(e) {

	goBack();
});
function goBack(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('newHeathScreen');
	var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	if (parentWindow != null && parentWindow.windowName === "home") {
		parentWindow.window.refreshHomeScreen();
	}
}

/***
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
/**
 * function for android back
 */
$.newHeathScreen.addEventListener('android:back', function() {
	goBack();
});

/**
 * For authorizing the health kit..
 */
function healthKitAuthorization() {
	try {
		var readTypes = {
			HKCategoryType : ["HKCategoryTypeIdentifierSleepAnalysis"],
			HKCharacteristicType : ["HKCharacteristicTypeIdentifierDateOfBirth", "HKCharacteristicTypeIdentifierBiologicalSex", "HKCharacteristicTypeIdentifierBloodType"],
			HKCorrelationType : [],
			HKQuantityType : ["HKQuantityTypeIdentifierHeight", "HKQuantityTypeIdentifierBodyMass", "HKQuantityTypeIdentifierHeartRate", "HKQuantityTypeIdentifierBloodPressureSystolic", "HKQuantityTypeIdentifierBloodPressureDiastolic", "HKQuantityTypeIdentifierRespiratoryRate", "HKQuantityTypeIdentifierStepCount", "HKQuantityTypeIdentifierFlightsClimbed"]
		};
		var writeTypes = {
			HKCategoryType : [],
			HKCharacteristicType : [],
			HKCorrelationType : [],
			HKQuantityType : [],
		};
		TiHealthkit.authorize(writeTypes, readTypes, function(data) {
			if (data.success == 1) {
				getValuesFromHealthKit();

			} else {

				healthAppNotFound();
			}

		});

	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("healthdatas", "healthKitAuthorization", ex);
	}
}

/**
 * Function for getting the blood group,sex,date of birth,height,weight....
 */
function getValuesFromHealthKit() {
	try {
		getHeight();
	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("healthdatas", "getValuesFromHealthKit", ex);
	}
}

/**
 * Function used to push values to the health data array.
 */
function addvaluesToArray(field, value, average, date, position, detailsArray) {
	try {

		var avg = 'NA';
		var valueDate = 'NA';
		if (average != null) {
			avg = average;
		}
		if (date != null) {
			valueDate = date;
		}

		var healthDataslist = {
			field : field,
			value : value,
			average : avg,
			date : valueDate,
			position : position,
			detailsArray : detailsArray
		};
		healthDatas.push(healthDataslist);

	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("healthdatas", "addvaluesToArray", ex);
	}
}

/**
 *
 * fucntion to convert date
 */
function formattedDate(d) {
	return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
}

function datePredicate(startDate, endDate) {
	return {
		"datePredicate" : [formattedDate(startDate), formattedDate(endDate)]
	};
}

/**
 * Function to get bloodtype,sex and dob
 */
function getDatas(sex, bloodType, dob) {

	var dateOfBirth = " ";
	if (dob != null) {
		var dob = dob.split(" ");
		dateOfBirth = commonFunctions.getMonthNameFormat(dob[0]);
	}
	addvaluesToArray("DOB", dateOfBirth, null, null, 12, []);

	var biologicalSex = " ";
	if (sex != null) {
		switch (sex.toString()) {

		case '0':
			biologicalSex = 'Not set';
			break;

		case '1':
			biologicalSex = fmLbl;
			break;
		case '2':
			biologicalSex = maleLbl;
			break;
		case '3':
			biologicalSex = otherLbl;
			break;
		}

	}
	addvaluesToArray(sexLbl, biologicalSex, null, null, 12, []);
	var bloodGroup = " ";
	if (bloodType != null) {
		switch (bloodType.toString()) {
		case '0':
			bloodGroup = 'Not set';
			break;
		case '1':
			bloodGroup = 'A+';
			break;
		case '2':
			bloodGroup = 'A-';
			break;
		case '3':
			bloodGroup = 'B+';
			break;
		case '4':
			bloodGroup = 'B-';
			break;
		case '5':
			bloodGroup = 'AB+';
			break;
		case '6':
			bloodGroup = 'AB-';
			break;
		case '7':
			bloodGroup = 'O+';
			break;
		case '8':
			bloodGroup = 'O-';
			break;
		}
	}
	addvaluesToArray(bloodLbl, bloodGroup, null, null, 12, []);
}

/**
 * Function to get the height
 */
function getHeight() {
	try {
		ValueArray = [];
		var sortTime = "";
		var prevSortTime = "";
		var heightArray = [];
		var predicate = new datePredicate(startDate, endDate);
		var heightValue;
		var heightSplitArray = [];
		var Query = function(quantityType, limit, predicate) {
			this.quantityType = quantityType;
			this.limit = limit;
			this.predicate = predicate;
		};
		var query = new Query("HKQuantityTypeIdentifierHeight", 0, predicate);
		TiHealthkit.getQuantityResult(query, function(data) {
			if (data.success == 1) {
				getDatas(data.biologicalSex, data.bloodType, data.dateOfBirth);
				if (data.quantities != null) {
					for (var i = 0; i < data.quantities.length; i++) {
						ValueArray.push({
							date : commonFunctions.getMonthNameFormat(data.quantities[i].startDate),
							value : data.quantities[i].quantity,
						});
						heightValue = data.quantities[0].quantity;
						heightArray.push(data.quantities[i].quantity);
						var item = data.quantities[i].quantity.split(" ");
						heightSplitArray.push(item[0]);

					};
					displayDate = commonFunctions.getMonthNameFormat(ValueArray[0].date);
					var average = getAverageValue(heightSplitArray);
				} else {
					heightValue = "NA";
				}

				addvaluesToArray(heightLbl, heightValue, average, displayDate, 5, ValueArray);

				getWeight();
			} else {

			}

		});

	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("healthdatas", "getHeight", ex);
	}
}

/**
 * Function to find average value
 */

function getAverageValue(splitArray) {
	try {
		var total = 0;
		for (var i = 0; i < splitArray.length; i++) {
			total = parseFloat(total) + parseFloat(splitArray[i]);
		}

		return parseFloat(total) / splitArray.length;
	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("healthdatas", "getAverageValue", ex);
	}

}

/**
 * Function to get weight.
 */
function getWeight() {
	try {
		ValueArray = [];
		var heightArray = [];
		var predicate = new datePredicate(startDate, endDate);
		var heightValue;
		var heightSplitArray = [];
		var Query = function(quantityType, limit, predicate) {
			this.quantityType = quantityType;
			this.limit = limit;
			this.predicate = predicate;
		};
		var query = new Query("HKQuantityTypeIdentifierBodyMass", 1, predicate);
		TiHealthkit.getQuantityResult(query, function(data) {
			if (data.success == 1) {
				if (data.quantities != null) {
					for (var i = 0; i < data.quantities.length; i++) {
						ValueArray.push({
							date : commonFunctions.getMonthNameFormat(data.quantities[i].startDate),
							value : data.quantities[i].quantity,
						});
						heightArray.push(data.quantities[i].quantity);
						heightValue = data.quantities[0].quantity;
						var item = data.quantities[i].quantity.split(" ");
						heightSplitArray.push(item[0]);

					};

					var average = getAverageValue(heightSplitArray);
					displayDate = commonFunctions.getMonthNameFormat(ValueArray[0].date);
				} else {
					heightValue = "NA";
				}
				addvaluesToArray(weightLbl, heightValue, average, displayDate, 5, ValueArray);
				getHeartRate();
			} else {

			}

		});

	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("healthdatas", "getWeight", ex);
	}
}

function getHeartRate() {
	try {
		ValueArray = [];
		var heightArray = [];
		var predicate = new datePredicate(startDate, endDate);
		var heightValue;
		var heightSplitArray = [];
		var DateArray = [];
		var Query = function(quantityType, limit, predicate) {
			this.quantityType = quantityType;
			this.limit = limit;
			this.predicate = predicate;
		};
		var query = new Query("HKQuantityTypeIdentifierHeartRate", 2, predicate);
		TiHealthkit.getQuantityResult(query, function(data) {
			if (data.success == 1) {
				if (data.quantities != null) {
					for (var i = 0; i < data.quantities.length; i++) {
						if (DateArray.length == 0 || DateArray.indexOf(newDate) == -1) {
							var newDate = data.quantities[i].startDate;
							DateArray.push(newDate);
							ValueArray.push({
								date : commonFunctions.getMonthNameFormat(data.quantities[i].startDate),
								minValue : data.quantities[i].quantity,
								maxValue : data.quantities[i].quantity,
							});
						} else {
							if (data.quantities[i].quantity < ValueArray[DateArray.indexOf(newDate)].minValue) {
								ValueArray[DateArray.indexOf(newDate)].minValue = data.quantities[i].quantity;
							} else if (data.quantities[i].quantity > ValueArray[DateArray.indexOf(newDate)].maxValue) {
								ValueArray[DateArray.indexOf(newDate)].maxValue = data.quantities[i].quantity;
							}
						}

						heightArray.push(data.quantities[i].quantity);
						heightValue = data.quantities[0].quantity;
						var item = data.quantities[i].quantity.split(" ");
						heightSplitArray.push(item[0]);

					};

					var average = getAverageValue(heightSplitArray);
					displayDate = commonFunctions.getMonthNameFormat(ValueArray[0].date);
				} else {
					heightValue = "NA";
				}
				addvaluesToArray(heartLbl, heightValue, average, displayDate, 5, ValueArray);
				getSystolicPressure();
			} else {

			}

		});

	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("healthdatas", "getHeartRate", ex);
	}
}

var systolicResult = "";
var diastolicResult = "";
var sysMin = "";
var sysMax = "";
var diaMin = "";
var diaMax = "";
var sysResult = "";
var diaResult = "";
function getSystolicPressure() {
	try {
		ValueArray = [];
		var heightArray = [];
		var predicate = new datePredicate(startDate, endDate);
		var heightValue;
		var heightSplitArray = [];
		var Query = function(quantityType, limit, predicate) {
			this.quantityType = quantityType;
			this.limit = limit;
			this.predicate = predicate;
		};
		var query = new Query("HKQuantityTypeIdentifierBloodPressureSystolic", 3, predicate);
		TiHealthkit.getQuantityResult(query, function(data) {
			if (data.success == 1) {
				if (data.quantities != null) {
					for (var i = 0; i < data.quantities.length; i++) {
						ValueArray.push({
							date : commonFunctions.getMonthNameFormat(data.quantities[i].startDate),
							sPressure : data.quantities[i].quantity,
							dPressure : "",
						});
						heightArray.push(data.quantities[i].quantity);
						systolicResult = data.quantities[0].quantity;
						var item = data.quantities[i].quantity.split(" ");
						heightSplitArray.push(item[0]);
						var average = getAverageValue(heightSplitArray);

					};

				}
				getDiastolicPressure();
			} else {

			}

		});

	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("healthdatas", "getSystolicPressure", ex);
	}

}

/**
 * To get getDiastolicPressure
 */
function getDiastolicPressure() {
	try {

		var heightArray = [];
		var predicate = new datePredicate(startDate, endDate);
		var heightValue;
		var heightSplitArray = [];

		var Query = function(quantityType, limit, predicate) {
			this.quantityType = quantityType;
			this.limit = limit;
			this.predicate = predicate;
		};
		var query = new Query("HKQuantityTypeIdentifierBloodPressureDiastolic", 4, predicate);
		TiHealthkit.getQuantityResult(query, function(data) {
			if (data.success == 1) {
				if (data.quantities != null) {
					var k = 0;
					for (var i = 0; i < data.quantities.length; i++) {

						ValueArray[k].dPressure = data.quantities[i].quantity;
						k += 1;

						heightArray.push(data.quantities[i].quantity);
						diastolicResult = data.quantities[0].quantity;
						var item = data.quantities[i].quantity.split(" ");
						heightSplitArray.push(item[0]);
					};

					if (systolicResult != "" || diastolicResult != "") {
						var splitPressure1 = systolicResult.split(" ");
						var splitPressure2 = diastolicResult.split(" ");
						var result = splitPressure1[0] + "/" + splitPressure2[0] + " mmHg";
					} else {
						var result = "NA";
					}
					var average = getAverageValue(heightSplitArray);
					displayDate = commonFunctions.getMonthNameFormat(ValueArray[0].date);
				} else {
					var result = "NA";
				}
				addvaluesToArray(bpLbl, result, average, displayDate, 5, ValueArray);
				getRespiratoryRate();
			} else {

			}

		});

	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("healthdatas", "getDiastolicPressure", ex);
	}
}

/**
 * To get respiratory rate
 */
function getRespiratoryRate() {
	try {
		ValueArray = [];
		var heightArray = [];
		var predicate = new datePredicate(startDate, endDate);
		var heightValue;
		var heightSplitArray = [];
		var Query = function(quantityType, limit, predicate) {
			this.quantityType = quantityType;
			this.limit = limit;
			this.predicate = predicate;
		};
		var query = new Query("HKQuantityTypeIdentifierRespiratoryRate", 5, predicate);
		TiHealthkit.getQuantityResult(query, function(data) {
			if (data.success == 1) {
				if (data.quantities != null) {
					for (var i = 0; i < data.quantities.length; i++) {
						ValueArray.push({
							date : commonFunctions.getMonthNameFormat(data.quantities[i].startDate),
							value : data.quantities[i].quantity,
						});
						heightArray.push(data.quantities[i].quantity);
						heightValue = data.quantities[0].quantity;
						var item = data.quantities[i].quantity.split(" ");
						heightSplitArray.push(item[0]);

					};
					var average = getAverageValue(heightSplitArray);
					displayDate = commonFunctions.getMonthNameFormat(ValueArray[0].date);
				} else {
					heightValue = "NA";
				}
				addvaluesToArray(repsiratoryLbl, heightValue, average, displayDate, 5, ValueArray);
				getSleepAnalysis();
			} else {

			}

		});

	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("healthdatas", "getRespiratoryRate", ex);
	}
}

/**
 * To get respiratory rate
 */
function getStepCount() {
	try {
		ValueArray = [];
		var heightArray = [];

		var predicate = new datePredicate(startDate, endDate);
		var heightValue;
		var heightSplitArray = [];
		var Query = function(quantityType, limit, predicate) {
			this.quantityType = quantityType;
			this.limit = limit;
			this.predicate = predicate;
		};
		var query = new Query("HKQuantityTypeIdentifierStepCount", 6, predicate);
		TiHealthkit.getQuantityResult(query, function(data) {
			var stepCount = 0;
			if (data.success == 1) {

				if (data.quantities != null) {

					for (var i = 0; i < data.quantities.length; i++) {
						ValueArray.push({
							date : commonFunctions.getMonthNameFormat(data.quantities[i].startDate),
							value : data.quantities[i].quantity,
						});
						heightArray.push(data.quantities[i].quantity);
						heightValue = data.quantities[0].quantity;

						var item = data.quantities[i].quantity.split(" ");
						heightSplitArray.push(item[0]);

						var stepD = new Date(data.quantities[i].startDate);
						var newStartDate = stepD.getDate() + "/" + parseInt(stepD.getMonth() + 1) + "/" + stepD.getFullYear();
						var endDate = new Date();
						var todayDate = endDate.getDate() + "/" + parseInt(endDate.getMonth() + 1) + "/" + endDate.getFullYear();

						if (todayDate == newStartDate) {

							var step = data.quantities[i].quantity.split(" ");
							stepCount = parseInt(stepCount) + parseInt(step[0]);

						}

					};

					var average = getAverageValue(heightSplitArray);
					displayDate = commonFunctions.getMonthNameFormat(ValueArray[0].date);
					Ti.App.Properties.setString('StepValue', stepCount);
				} else {

					heightValue = "NA";
					stepCount = "NA";
				}

				addvaluesToArray(stepLbl, stepCount, average, displayDate, 5, ValueArray);
				getFlightsClimbed();
			} else {

			}

		});

	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("healthdatas", "getStepCount", ex);
	}
}

/**
 * To get respiratory rate
 */
function getFlightsClimbed() {
	try {
		ValueArray = [];
		var heightArray = [];
		var predicate = new datePredicate(startDate, endDate);
		var heightValue;
		var heightSplitArray = [];
		var Query = function(quantityType, limit, predicate) {
			this.quantityType = quantityType;
			this.limit = limit;
			this.predicate = predicate;
		};
		var query = new Query("HKQuantityTypeIdentifierFlightsClimbed", 7, predicate);
		TiHealthkit.getQuantityResult(query, function(data) {
			var flightCount = 0;
			if (data.success == 1) {
				if (data.quantities != null) {
					for (var i = 0; i < data.quantities.length; i++) {
						ValueArray.push({
							date : commonFunctions.getMonthNameFormat(data.quantities[i].startDate),
							value : data.quantities[i].quantity,
						});
						heightArray.push(data.quantities[i].quantity);
						var flightclimbed = data.quantities[0].quantity.split(" ");
						heightValue = flightclimbed[0] + " " + "floors";
						var item = data.quantities[i].quantity.split(" ");
						heightSplitArray.push(item[0]);

						var stepD = new Date(data.quantities[i].startDate);
						var newStartDate = stepD.getDate() + "/" + parseInt(stepD.getMonth() + 1) + "/" + stepD.getFullYear();
						var endDate = new Date();
						var todayDate = endDate.getDate() + "/" + parseInt(endDate.getMonth() + 1) + "/" + endDate.getFullYear();

						if (todayDate == newStartDate) {
							var flight = data.quantities[i].quantity.split(" ");
							flightCount = parseInt(flightCount) + parseInt(flight[0]);
						}

					};
					var average = getAverageValue(heightSplitArray);
					displayDate = commonFunctions.getMonthNameFormat(ValueArray[0].date);
				} else {
					heightValue = "NA";
					flightCount = "NA";

				}
				addvaluesToArray(flightLbl, flightCount, average, displayDate, 5, ValueArray);
				loadHealthDatas();
			} else {

			}

		});

	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("healthdatas", "getFlightsClimbed", ex);
	}
}

/**
 * To get respiratory rate
 */
function getSleepAnalysis() {
	try {
		ValueArray = [];
		var heightArray = [];
		var predicate = new datePredicate(startDate, endDate);
		var heightValue;
		var heightSplitArray = [];
		var Query = function(quantityType, limit, predicate) {
			this.quantityType = quantityType;
			this.limit = limit;
			this.predicate = predicate;
		};
		var query = new Query("HKCategoryTypeIdentifierSleepAnalysis", 0, predicate);
		TiHealthkit.getCategoryQuantityResult(query, function(data) {

			if (data.success == 1) {
				var totalSleepTime = 0;
				if (data.quantities != null) {
					for (var i = 0; i < data.quantities.length; i++) {
						var strtDate = new Date(data.quantities[i].startDate).getTime();

						var todayCurrentDate = new Date();
						var stepD = new Date(data.quantities[i].startDate);
						var newStartDate = stepD.getDate() + "/" + parseInt(stepD.getMonth() + 1) + "/" + stepD.getFullYear();
						var endDate = new Date(data.quantities[i].endDate).getTime();
						var yesterdayDate = todayCurrentDate.getDate() - 1 + "/" + parseInt(todayCurrentDate.getMonth() + 1) + "/" + todayCurrentDate.getFullYear();

						var currentHour = parseInt(stepD.getHours());
						var todayDate = todayCurrentDate.getDate() + "/" + parseInt(todayCurrentDate.getMonth() + 1) + "/" + todayCurrentDate.getFullYear();
						var sleepTime = endDate - strtDate;
						if ((yesterdayDate == newStartDate && currentHour >= 18) || (todayDate == newStartDate && currentHour < 18)) {
							if (data.quantities[i].mode != "InBed") {

								totalSleepTime = totalSleepTime + sleepTime;

								var convertedSleep = msToTime(totalSleepTime);

							}

						}

						ValueArray.push({
							date : commonFunctions.getMonthNameFormat(data.quantities[i].startDate),
							sDate : commonFunctions.formatDateTime(data.quantities[i].startDate),
							eDate : commonFunctions.formatDateTime(data.quantities[i].endDate),
							value : msToTime(sleepTime)
						});
						heightArray.push(ValueArray[i]);
						heightValue = ValueArray[0].value;
						heightSplitArray.push(ValueArray[i].value);

					};
					var totalConvertedSleep = msToTime(totalSleepTime);
					Ti.App.Properties.setString('SleepValue', totalConvertedSleep);

					var average = getAverageValue(heightSplitArray);
					if (totalSleepTime != 0) {
						heightValue = totalConvertedSleep;
					} else {
						heightValue = "NA";
					}
					displayDate = commonFunctions.getMonthNameFormat(ValueArray[0].date);
				} else {
					heightValue = "NA";
				}
				addvaluesToArray(sleepLbl, heightValue, average, displayDate, 5, ValueArray);
				getStepCount();
			} else {

			}

		});

	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("healthdatas", "getSleepAnalysis", ex);
	}
}

function msToTime(duration) {
	var results;
	var milliseconds = parseInt((duration % 1000) / 100),
	    seconds = Math.floor((duration / 1000) % 60),
	    minutes = Math.floor((duration / (1000 * 60)) % 60),
	    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;

	if (hours > 0 && minutes > 0)
		result = hours + " hr " + minutes + " m";
	else if (hours > 0 && minutes <= 0)
		result = hours + " hr";
	else if (hours <= 0 && minutes > 0)
		result = minutes + " m";
	else
		result = "";

	return result;
}


/**
 * Function to get UV exposure
 */
function getUvExposure() {
	try {
		addvaluesToArray("UV EXPOSURE", "NA", "", "", 0, []);
		loadHealthDatas();
	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("healthdatas", "getUvExposure", ex);
	}
}

/**
 * Function used when health app is not found in the device. The array filled with value NA(Not available).
 */
function healthAppNotFound() {
	try {
		healthDatas = [];
		healthDatas = [{
			field : commonFunctions.L('dobLbl', LangCode),
			value : "NA",
			average : "",
			date : "",
			position : 12
		}, {
			field : commonFunctions.L('sexLbl', LangCode),
			value : "NA",
			average : "",
			date : "",
			position : 12
		}, {
			field : commonFunctions.L('bloodtypeLbl', LangCode),
			value : "NA",
			average : "",
			date : "",
			position : 12
		}, {
			field : commonFunctions.L('wieghtLbl', LangCode),
			value : "NA",
			average : "",
			date : "",
			position : 12
		}, {
			field : commonFunctions.L('heightLbl', LangCode),
			value : "NA",
			average : "",
			date : "",
			position : 12
		}, {
			field : commonFunctions.L('heartLbl', LangCode),
			value : "NA",
			average : "",
			date : "",
			position : 12
		}, {
			field : commonFunctions.L('BpLbl', LangCode),
			value : "NA",
			average : "",
			date : "",
			position : 12
		}, {
			field : commonFunctions.L('respiratoryLbl', LangCode),
			value : "NA",
			average : "",
			date : "",
			position : 12
		}, {
			field : commonFunctions.L('sleepLbl', LangCode),
			value : "NA",
			average : "",
			date : "",
			position : 12
		}, {
			field : commonFunctions.L('stepLbl', LangCode),
			value : "NA",
			average : "",
			date : "",
			position : 12
		}, {
			field : commonFunctions.L('flightLbl', LangCode),
			value : "NA",
			average : "",
			date : "",
			position : 12
		}];
		loadHealthDatas();
	} catch(ex) {
		commonFunctions.handleException("healthdatas", "healthAppNotFound", ex);
	}
}

/**
 * call back function for getting the steps count(statistics collectiion query).
 */
function onInitialResultsStep(e) {
	try {
		e.statisticsCollection.statistics.forEach(function(statistics) {
			var quantity = statistics.getSumQuantity();
			var stepCount = quantity.valueForUnit(TiHealthkit.createUnit('count'));

			result = stepCount + " steps";

			addvaluesToArray(commonFunctions.L('stepLbl', LangCode), result, average, displayDate, 0, ValueArray);
			getFlightsClimbed();
		});
	} catch(ex) {
		commonFunctions.handleException("healthdatas", "onInitialResultsStep", ex);
	}
}

/**
 * call back function for getting the flight climbed count(statistics collectiion query).
 */
function onInitialResults(e) {
	try {
		e.statisticsCollection.statistics.forEach(function(statistics) {
			var quantity = statistics.getSumQuantity();
			var flightCount = quantity.valueForUnit(TiHealthkit.createUnit('count'));

			result = flightCount + " floors";
			addvaluesToArray(commonFunctions.L('flightLbl', LangCode), result, average, displayDate, 0, ValueArray);

			loadHealthDatas();
		});
	} catch(ex) {
		commonFunctions.handleException("healthdatas", "onInitialResults", ex);
	}
}

function onStatisticsUpdate(e) {

}

/**
 * event listners.
 */
Ti.App.addEventListener('healthDataRefresh', onHealthUpdate);
$.newHeathScreen.addEventListener('close', windowClose);

/**
 * Listner for updating the health datas when the app taken from background.
 */
function onHealthUpdate() {
	try {

		healthDatas = [];
		if (OS_IOS) {
			commonFunctions.openActivityIndicator(commonFunctions.L('activityLoading', LangCode));
			healthKitAuthorization();
			getValuesFromHealthKit();
		} else {
			googleFitDataAndroid();
		}
	} catch(ex) {
		commonFunctions.handleException("healthdatas", "onHealthUpdate", ex);
	}
}

/**
 * For removing all the listners when closing the window.
 */
function windowClose() {
	try {
		Ti.App.removeEventListener('healthDataRefresh', onHealthUpdate);
		$.newHeathScreen.removeEventListener('close', windowClose);
	} catch(ex) {
		commonFunctions.handleException("healthdatas", "windowClose", ex);
	}
}

/**
 * Function for listing the values from google fit..
 */
function googleFitDataAndroid() {
	try {
		var googlefitmodule = require('com.zco.google.fit');

		googlefitmodule.init();

		googlefitmodule.addEventListener("read_fitness_data", function(evt) {

			if (healthArray.length > 0) {
				var receivedValue = "";
				healthDatas = [];
				for (var i = 0; i < healthArray.length; i++) {

					if (healthArray[i].field == commonFunctions.L('heightLbl', LangCode)) {
						if (evt.height != null) {
							receivedValue = evt.height;
							receivedValue = receivedValue * 100 + " Cm";
						} else {
							receivedValue = "NA";
						}
					} else if (healthArray[i].field == commonFunctions.L('wieghtLbl', LangCode)) {
						if (evt.weight != null)
							receivedValue = Math.round(evt.weight) + " Kg";
						else
							receivedValue = "NA";
					} else if (healthArray[i].field == commonFunctions.L('heartLbl', LangCode)) {
						receivedValue = (evt.bpm != null) ? evt.bpm + " bpm" : "NA";
						Ti.App.Properties.setString('SleepValue', receivedValue);
					} else if (healthArray[i].field == commonFunctions.L('distanceLbl', LangCode)) {
						receivedValue = (evt.distance != null) ? evt.distance + " meters" : "NA";
					} else if (healthArray[i].field == commonFunctions.L('stepLbl', LangCode)) {
						receivedValue = (evt.steps != null) ? evt.steps + " steps" : "NA";

						Ti.App.Properties.setString('StepValue', receivedValue);
					} else if (healthArray[i].field == commonFunctions.L('segmnetLbl', LangCode)) {
						receivedValue = (evt.activity != null) ? evt.activity : "NA";
					}
					var healthDataslist = {
						field : healthArray[i].field,
						value : receivedValue,
						average : "",
						date : "",
						position : 12
					};
					healthDatas.push(healthDataslist);
				}
				loadHealthDatas();
			}

		});
	} catch(ex) {
		commonFunctions.handleException("healthdatas", "googleFitDataAndroid", ex);
	}
}

function listViewClick(e) {

	if (OS_IOS) {
		if (healthDatas[e.itemIndex].detailsArray.length != 0) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('healthDataDetails', {
				"detailsArray" : healthDatas[e.itemIndex].detailsArray,
				"rowIndex" : e.itemIndex
			});
		}
	}

}