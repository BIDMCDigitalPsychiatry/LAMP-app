// Arguments passed into this controller can be accessed via the `$.args` object directly or:
/**
 * Declarations
 */
var args = $.args;
var commonFunctions = require('commonFunctions');
if (OS_IOS) {
	var TiHealthkit = require('com.zco.healthKitios');

} else {

	var googlefitmodule = require('com.zco.google.fit');
}
var healthDatas = [];
var LangCode = Ti.App.Properties.getString('languageCode');
var result = "NA";
var displayDate;
var average = "";
var textPosition = 12;
var anchorDate = new Date();
var ValueArray = [];
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
			}

		}
		$.headerView.setTitle(commonFunctions.L('healthDataTitle', LangCode));
		$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
		if (OS_IOS) {
			commonFunctions.openActivityIndicator(commonFunctions.L('activityLoading', LangCode));
			healthKitAuthorization();
		} else {
			googleFitDataAndroid();
		}
	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("healthData", "open", ex);
	}
});

/**
 *  onDetailsClick event handler
 */
function onDetailsClick(e) {
	Ti.API.info('onDetailsClick', JSON.stringify(e));
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
		Ti.API.info('healthDatas', JSON.stringify(healthDatas));

		if (OS_IOS) {
			var length = 5;
		} else {
			var length = 2;
		}

		$.dobaverageLabel.text = healthDatas[0].average.toString();
		$.dobdataLabel.text = healthDatas[0].field;
		$.dobdataLabel.top = healthDatas[0].position + "dp";
		$.dobdataValueLabel.text = healthDatas[0].value;
		$.dobdataValueLabel.top = healthDatas[0].position + "dp";
		$.dobdateLabel.text = healthDatas[0].date;

		$.genderaverageLabel.text = healthDatas[1].average.toString();
		$.genderdataLabel.text = healthDatas[1].field;
		$.genderdataLabel.top = healthDatas[1].position + "dp";
		$.genderdataValueLabel.text = healthDatas[1].value;
		$.genderdataValueLabel.top = healthDatas[1].position + "dp";
		$.genderdateLabel.text = healthDatas[1].date;

		$.bloodaverageLabel.text = healthDatas[2].average.toString();
		$.blooddataLabel.text = healthDatas[2].field;
		$.blooddataLabel.top = healthDatas[2].position + "dp";
		$.blooddataValueLabel.text = healthDatas[2].value;
		$.blooddataValueLabel.top = healthDatas[2].position + "dp";
		$.blooddateLabel.text = healthDatas[2].date;

		$.heightaverageLabel.text = healthDatas[3].average.toString();
		$.heightdataLabel.text = healthDatas[3].field;
		$.heightdataLabel.top = healthDatas[3].position + "dp";
		$.heightdataValueLabel.text = healthDatas[3].value;
		$.heightdataValueLabel.top = healthDatas[3].position + "dp";
		$.heightdateLabel.text = healthDatas[3].date;

		$.weightaverageLabel.text = healthDatas[4].average.toString();
		$.weightdataLabel.text = healthDatas[4].field;
		$.weightdataLabel.top = healthDatas[4].position + "dp";
		$.weightdataValueLabel.text = healthDatas[4].value;
		$.weightdataValueLabel.top = healthDatas[4].position + "dp";
		$.weightdateLabel.text = healthDatas[4].date;

		/*for (var i = 0; i < length; i++) {
		var outerView = Ti.UI.createView({
		backgroundColor : '#ffffff',
		width : Ti.UI.FILL,
		height : '50dp',
		right : '4dp',
		left : '4dp',
		top : "6dp",
		//index : i
		});
		Ti.API.info('outerView', outerView);
		var dataFieldView = Ti.UI.createView({
		backgroundColor : 'transparent',
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		left : '0dp'
		});
		Ti.API.info('dataFieldView', dataFieldView);
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
		//top : healthDatas[i].position + "dp",
		top : '12dp',
		text : "fgsg"
		//text : healthDatas[i].field
		});
		Ti.API.info('dataLabel', dataLabel);

		var averageLabel = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#546e7a',
		font : Alloy.Globals.MediumFontLight,
		left : '10dp',
		opacity : 1,
		top : "20dp",
		text : "fgsg"
		//text : healthDatas[i].average.toString()
		});

		var dataValueLabel = Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#90a4ae',
		font : Alloy.Globals.smallSemiBold,
		opacity : 1,
		top : "20dp",
		text : "fgsg",
		// top : healthDatas[i].position + "dp",
		// text : healthDatas[i].value,
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
		text : "",//healthDatas[i].date
		});

		var seperator = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : '1dp',
		right : '10dp',
		left : '10dp',
		bottom : "5dp",
		backgroundColor : '#E7EAED'
		});

		if (Ti.Platform.osname == "ipad") {
		dataLabel.font = Alloy.Globals.LargeFontLightTablet;
		averageLabel.font = Alloy.Globals.LargeFontLightTablet;
		dataValueLabel.font = Alloy.Globals.MediumSemiBold;
		dateLabel.font = Alloy.Globals.MediumSemiBold;

		}
		Ti.API.info('datalabel', dataLabel, averageLabel);
		dataFieldView.add(dataLabel);
		dataFieldView.add(averageLabel);
		valueView.add(dataValueLabel);
		valueView.add(dateLabel);
		outerView.add(dataFieldView);
		outerView.add(valueView);
		outerView.add(seperator);
		$.firstView.add(outerView);
		*/
		// outerView.addEventListener("click", function(e) {
		// if (OS_IOS) {
		// if (healthDatas[e.source.index].detailsArray.length != 0) {
		// Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('healthDataDetails', {
		// "detailsArray" : healthDatas[e.source.index].detailsArray,
		// "rowIndex" : e.source.index
		// });
		// }
		// }
		// });
		//};

		if (OS_IOS) {
			$.heartDataLbl.text = healthDatas[5].field;
			$.heartValueLbl.text = healthDatas[5].value;
			if ($.heartValueLbl.text == "NA") {
				$.heartValueLbl.color = '#b0bec5';
				$.heartImg.image = '/images/healthKit/heart_rate_disable.png';
			} else {
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
			$.respiratoryLbl.text = healthDatas[7].value;
			if ($.respiratoryLbl.text == "NA") {
				$.respiratoryLbl.color = '#b0bec5';
				$.respiratoryImg.image = '/images/healthKit/resipiratory_rate_disable.png';
			} else {
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
			$.stepLbl.text = healthDatas[9].value;
			if ($.stepLbl.text == "NA") {
				$.stepLbl.color = '#b0bec5';
				$.stepImg.image = '/images/healthKit/steps_disable.png';
			} else {
				$.stepLbl.color = '#359ffe';
				$.stepImg.image = '/images/healthKit/steps.png';
			}
			$.flightLbl.text = healthDatas[10].value;
			if ($.flightLbl.text == "NA") {
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

			$.heartDataLbl.text = healthDatas[2].value;
			$.distanceValueLbl.text = healthDatas[3].value;
			$.stepLbl.text = healthDatas[4].value;
			$.segmentLbl.text = healthDatas[5].value;

		}

		commonFunctions.closeActivityIndicator();
	} catch(ex) {
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
	Ti.API.info('backButtonClick');
	goBack();
});
function goBack(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('newHeathScreen');
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
		Ti.API.info('addvaluesToArray detailsArray : ', field, value, average, date, position);
		var healthDataslist = {
			field : field,
			value : value,
			average : average,
			date : date,
			position : position,
			detailsArray : detailsArray
		};
		healthDatas.push(healthDataslist);
		Ti.API.info('healthDatas: ', healthDatas);
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
	Ti.API.info('sex is', sex, bloodType, dateOfBirth);
	var dateOfBirth = commonFunctions.L('notSetLbl', LangCode);
	if (dob != null) {
		var dob = dob.split(" ");
		dateOfBirth = commonFunctions.getMonthNameFormat(dob[0]);
		addvaluesToArray("DOB", dateOfBirth, "", "", 12, []);
	}

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
		addvaluesToArray(sexLbl, biologicalSex, "", "", 12, []);
	}
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

		addvaluesToArray(bloodLbl, bloodGroup, "", "", 12, []);
	}
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
				Ti.API.info('error of height values');
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
	var total = 0;
	for (var i = 0; i < splitArray.length; i++) {
		total = parseFloat(total) + parseFloat(splitArray[i]);
	}
	Ti.API.info('total', total);
	Ti.API.info('splitArray.length', splitArray.length);
	return parseFloat(total) / splitArray.length;

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
				Ti.API.info('error of height values');
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
				Ti.API.info('error of height values');
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
						//displayDate = commonFunctions.getMonthNameFormat(ValueArray[0].date);

					};

				}
				getDiastolicPressure();
			} else {
				Ti.API.info('error of height values');
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
		//ValueArray = [];
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
				Ti.API.info('error of height values');
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
				Ti.API.info('error of height values');
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
			if (data.success == 1) {
				if (data.quantities != null) {
					for (var i = 0; i < data.quantities.length; i++) {
						ValueArray.push({
							date : commonFunctions.getMonthNameFormat(data.quantities[i].startDate),
							value : data.quantities[i].quantity,
							//sortTime : data.quantities[i].startDate.getTime()
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
				addvaluesToArray(stepLbl, heightValue, average, displayDate, 5, ValueArray);
				getFlightsClimbed();
			} else {
				Ti.API.info('error of height values');
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

					};
					var average = getAverageValue(heightSplitArray);
					displayDate = commonFunctions.getMonthNameFormat(ValueArray[0].date);
				} else {
					heightValue = "NA";

				}
				addvaluesToArray(flightLbl, heightValue, average, displayDate, 5, ValueArray);
				loadHealthDatas();
			} else {
				Ti.API.info('error of height values');
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
				if (data.quantities != null) {
					for (var i = 0; i < data.quantities.length; i++) {
						var strtDate = new Date(data.quantities[i].startDate).getTime();
						var endDate = new Date(data.quantities[i].endDate).getTime();
						var sleepTime = endDate - strtDate;
						var convertedSleep = msToTime(sleepTime);
						ValueArray.push({
							date : commonFunctions.getMonthNameFormat(data.quantities[i].startDate),
							sDate : commonFunctions.formatDateTime(data.quantities[i].startDate),
							eDate : commonFunctions.formatDateTime(data.quantities[i].endDate),
							value : convertedSleep
						});
						heightArray.push(ValueArray[i]);
						heightValue = ValueArray[0].value;
						heightSplitArray.push(ValueArray[i].value);

					};
					var average = getAverageValue(heightSplitArray);
					displayDate = commonFunctions.getMonthNameFormat(ValueArray[0].date);
				}
				addvaluesToArray(sleepLbl, heightValue, average, displayDate, 5, ValueArray);
				getStepCount();
			} else {
				Ti.API.info('error of height values');
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

	Ti.API.info('return time', hours + ":" + minutes + ":" + seconds + "." + milliseconds);

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

/*function getWeight() {
try {
ValueArray = [];
var sortTime = "";
var prevSortTime = "";
var avgQuery = TiHealthkit.createStatisticsQuery({
type : TiHealthkit.OBJECT_TYPE_BODY_MASS,
options : TiHealthkit.STATISTICS_OPTION_DISCRETE_AVERAGE,
onCompletion : function(e) {
if (e.result) {
if (e.result.getAverageQuantity() != null) {
Ti.API.info('AVERAGE weight:: ', e.result.getAverageQuantity().valueForUnit(TiHealthkit.createUnit('kg')));
average = "Average: " + commonFunctions.convertKiloGmToPound(e.result.getAverageQuantity().valueForUnit(TiHealthkit.createUnit('kg')));
} else {
average = "";
}
} else {
average = "";
}
}
});
TiHealthkit.executeQuery(avgQuery);

var query = TiHealthkit.createSampleQuery({
type : TiHealthkit.OBJECT_TYPE_BODY_MASS,
filter : filter,
onCompletion : function(e) {
Ti.API.info('BODY MASS:: ', JSON.stringify(e));
Ti.API.info('BODY MASS LENGTH:: ', e.results.length);
if (e.results.length > 0) {
e.results.forEach(function(bodyMass) {
Ti.API.info('BODY MASS:: ', bodyMass.quantity.valueForUnit(TiHealthkit.createUnit('kg')), " DATE:: ", bodyMass.startDate);
var stepD = new Date(bodyMass.startDate);
sortTime = stepD.getTime();
var newDate = stepD.getDate() + "/" + parseInt(stepD.getMonth() + 1) + "/" + stepD.getFullYear();
ValueArray.push({
date : newDate,
value : commonFunctions.convertKiloGmToPound(bodyMass.quantity.valueForUnit(TiHealthkit.createUnit('kg'))) + " lbs",
sortTime : sortTime
});
if (prevSortTime == "" || prevSortTime < sortTime) {
result = commonFunctions.convertKiloGmToPound(bodyMass.quantity.valueForUnit(TiHealthkit.createUnit('kg'))) + " lbs";
displayDate = commonFunctions.getMonthNameFormat(bodyMass.startDate);
prevSortTime = sortTime;

}
});
ValueArray.sort(function(a, b) {
if (a.sortTime < b.sortTime)
return 1;
if (a.sortTime > b.sortTime)
return -1;
return 0;
});
textPosition = 5;
} else {
result = "NA";
displayDate = "";
textPosition = 12;
}

addvaluesToArray(commonFunctions.L('wieghtLbl', LangCode), result, average, displayDate, textPosition, ValueArray);
getHeartRate();
}
});
setTimeout(function() {
TiHealthkit.executeQuery(query);
}, 100);

} catch(ex) {
commonFunctions.closeActivityIndicator();
commonFunctions.handleException("healthdatas", "getWeight", ex);
}
}*/

/**
 * Function to get the heart rate
 */
/*function getHeartRate() {
try {
var Min = "";
var Max = "";
var DateArray = [];
ValueArray = [];
var sortTime = "";
var prevSortTime = "";
var minQuery = TiHealthkit.createStatisticsQuery({
type : TiHealthkit.OBJECT_TYPE_HEART_RATE,
options : TiHealthkit.STATISTICS_OPTION_DISCRETE_MIN,
onCompletion : function(e) {
if (e.result) {
if (e.result.getMinimumQuantity() != null) {
Ti.API.info('MIN:: ', e.result.getMinimumQuantity().valueForUnit(TiHealthkit.createUnit('count/min')));
Min = "Min: " + e.result.getMinimumQuantity().valueForUnit(TiHealthkit.createUnit('count/min'));
} else {
Min = "";
}
} else {
Min = "";
}
}
});
TiHealthkit.executeQuery(minQuery);

var maxQuery = TiHealthkit.createStatisticsQuery({
type : TiHealthkit.OBJECT_TYPE_HEART_RATE,
options : TiHealthkit.STATISTICS_OPTION_DISCRETE_MAX,
onCompletion : function(e) {
if (e.result) {
if (e.result.getMaximumQuantity() != null) {
Ti.API.info('Max:: ', e.result.getMaximumQuantity().valueForUnit(TiHealthkit.createUnit('count/min')));
Max = "Max: " + e.result.getMaximumQuantity().valueForUnit(TiHealthkit.createUnit('count/min'));
} else {
Max = "";
}
} else {
Max = "";
}
average = Min + "  " + Max;
}
});

setTimeout(function() {
TiHealthkit.executeQuery(maxQuery);
}, 200);

var query = TiHealthkit.createSampleQuery({
type : TiHealthkit.OBJECT_TYPE_HEART_RATE,
filter : filter,
onCompletion : function(e) {
Ti.API.info('HEART RATE:: ', JSON.stringify(e));
Ti.API.info('HEART RATE LENGTH:: ', e.results.length);
if (e.results.length > 0) {
e.results.forEach(function(heartRate) {
Ti.API.info('HEART RATE:: ', heartRate.quantity.valueForUnit(TiHealthkit.createUnit('count/min')), " ", heartRate.startDate);
var heartRateValue = heartRate.quantity.valueForUnit(TiHealthkit.createUnit('count/min'));
var stepD = new Date(heartRate.startDate);
sortTime = stepD.getTime();
var newDate = stepD.getDate() + "/" + parseInt(stepD.getMonth() + 1) + "/" + stepD.getFullYear();
Ti.API.info('NEW DTAE:: ', newDate);
if (DateArray.length == 0 || DateArray.indexOf(newDate) == -1) {
DateArray.push(newDate);
ValueArray.push({
date : newDate,
minValue : heartRateValue,
maxValue : heartRateValue,
sortTime : sortTime
});

} else {
Ti.API.info('Already exist');
if (heartRateValue < ValueArray[DateArray.indexOf(newDate)].minValue) {
ValueArray[DateArray.indexOf(newDate)].minValue = heartRateValue;
} else if (heartRateValue > ValueArray[DateArray.indexOf(newDate)].maxValue) {
ValueArray[DateArray.indexOf(newDate)].maxValue = heartRateValue;
}
}
if (prevSortTime == "" || prevSortTime < sortTime) {
displayDate = commonFunctions.getMonthNameFormat(heartRate.startDate);
result = heartRate.quantity.valueForUnit(TiHealthkit.createUnit('count/min')) + " bpm";
prevSortTime = sortTime;

}

});
Ti.API.info('ValueArray : ', ValueArray);

ValueArray.sort(function(a, b) {
if (a.sortTime < b.sortTime)
return 1;
if (a.sortTime > b.sortTime)
return -1;
return 0;
});
Ti.API.info('ValueArray Sort : ', ValueArray);
textPosition = 5;
} else {
result = "NA";
displayDate = "";
textPosition = 12;
}

addvaluesToArray(commonFunctions.L('heartLbl', LangCode), result, average, displayDate, textPosition, ValueArray);
getSystolicPressure();
}
});
setTimeout(function() {
TiHealthkit.executeQuery(query);
}, 500);
} catch(ex) {
commonFunctions.closeActivityIndicator();
commonFunctions.handleException("healthdatas", "getHeartRate", ex);
}
}*/

// var systolicResult = "";
// var diastolicResult = "";
// var sysMin = "";
// var sysMax = "";
// var diaMin = "";
// var diaMax = "";
// var sysResult = "";
// var diaResult = "";
/**
 * Function to get the systolic pressure
 */
/*function getSystolicPressure() {
try {
ValueArray = [];
var sortTime = "";
var sysMinQuery = TiHealthkit.createStatisticsQuery({
type : TiHealthkit.OBJECT_TYPE_BLOOD_PRESSURE_SYSTOLIC,
options : TiHealthkit.STATISTICS_OPTION_DISCRETE_MIN,
onCompletion : function(e) {
if (e.result) {
if (e.result.getMinimumQuantity() != null) {
Ti.API.info('MIN:: ', e.result.getMinimumQuantity().valueForUnit(TiHealthkit.createUnit('mmHg')));
sysMin = e.result.getMinimumQuantity().valueForUnit(TiHealthkit.createUnit('mmHg'));
} else {
sysMin = "";
}
} else {
sysMin = "";
}
}
});
TiHealthkit.executeQuery(sysMinQuery);

var sysMaxQuery = TiHealthkit.createStatisticsQuery({
type : TiHealthkit.OBJECT_TYPE_BLOOD_PRESSURE_SYSTOLIC,
options : TiHealthkit.STATISTICS_OPTION_DISCRETE_MAX,
onCompletion : function(e) {
if (e.result) {
if (e.result.getMaximumQuantity() != null) {
Ti.API.info('MAX SYS:: ', e.result.getMaximumQuantity().valueForUnit(TiHealthkit.createUnit('mmHg')));
sysMax = e.result.getMaximumQuantity().valueForUnit(TiHealthkit.createUnit('mmHg'));
} else {
sysMax = "";
}
} else {
sysMax = "";
}
}
});
setTimeout(function() {
TiHealthkit.executeQuery(sysMaxQuery);
}, 100);

var query = TiHealthkit.createSampleQuery({
type : TiHealthkit.OBJECT_TYPE_BLOOD_PRESSURE_SYSTOLIC,
filter : filter,
onCompletion : function(e) {
Ti.API.info('PRESSURE SYSTOLIC:: ', JSON.stringify(e));
Ti.API.info('PRESSURE LENGTH SYSTOLIC:: ', e.results.length);
if (e.results.length > 0) {
e.results.forEach(function(pressure) {
Ti.API.info('BLOOD PRESSURE SYSTOLIC:: ', pressure.quantity.valueForUnit(TiHealthkit.createUnit('mmHg')));
systolicResult = pressure.quantity.valueForUnit(TiHealthkit.createUnit('mmHg'));
var stepD = new Date(pressure.startDate);
sortTime = stepD.getTime();
var newDate = stepD.getDate() + "/" + parseInt(stepD.getMonth() + 1) + "/" + stepD.getFullYear();

ValueArray.push({
date : newDate,
sPressure : systolicResult,
dPressure : "",
sortTime : sortTime
});

});
} else {
systolicResult = "";
}
getDiastolicPressure();
}
});
setTimeout(function() {
TiHealthkit.executeQuery(query);
}, 100);

} catch(ex) {
commonFunctions.closeActivityIndicator();
commonFunctions.handleException("healthdatas", "getSystolicPressure", ex);
}
}
*/
/**
 * Function to get the diastolic pressure
 */
/*function getDiastolicPressure() {
try {
var diaMinQuery = TiHealthkit.createStatisticsQuery({
type : TiHealthkit.OBJECT_TYPE_BLOOD_PRESSURE_DIASTOLIC,
options : TiHealthkit.STATISTICS_OPTION_DISCRETE_MIN,
onCompletion : function(e) {
if (e.result) {
if (e.result.getMinimumQuantity() != null) {
Ti.API.info('MIN DIA:: ', e.result.getMinimumQuantity().valueForUnit(TiHealthkit.createUnit('mmHg')));
diaMin = e.result.getMinimumQuantity().valueForUnit(TiHealthkit.createUnit('mmHg'));
} else {
diaMin = "";
}
} else {
diaMin = "";
}
}
});
TiHealthkit.executeQuery(diaMinQuery);

var diaMaxQuery = TiHealthkit.createStatisticsQuery({
type : TiHealthkit.OBJECT_TYPE_BLOOD_PRESSURE_DIASTOLIC,
options : TiHealthkit.STATISTICS_OPTION_DISCRETE_MAX,
onCompletion : function(e) {
if (e.result) {
if (e.result.getMaximumQuantity() != null) {
Ti.API.info('MAX DIA:: ', e.result.getMaximumQuantity().valueForUnit(TiHealthkit.createUnit('mmHg')));
diaMax = e.result.getMaximumQuantity().valueForUnit(TiHealthkit.createUnit('mmHg'));
} else {
diaMax = "";
}
} else {
Ti.API.info('********DIAMAX*******');
diaMax = "";
}
}
});
setTimeout(function() {
TiHealthkit.executeQuery(diaMaxQuery);
}, 100);

var pressureDate;
var query = TiHealthkit.createSampleQuery({
type : TiHealthkit.OBJECT_TYPE_BLOOD_PRESSURE_DIASTOLIC,
filter : filter,
onCompletion : function(e) {
Ti.API.info('PRESSURE DIASTOLIC:: ', JSON.stringify(e));
Ti.API.info('PRESSURE LENGTH DIASTOLIC:: ', e.results.length);
var k = 0;
if (e.results.length > 0) {
e.results.forEach(function(pressure) {
Ti.API.info('BLOOD PRESSURE DIASTOLIC:: ', pressure.quantity.valueForUnit(TiHealthkit.createUnit('mmHg')));
diastolicResult = pressure.quantity.valueForUnit(TiHealthkit.createUnit('mmHg'));
pressureDate = commonFunctions.getMonthNameFormat(pressure.startDate);
ValueArray[k].dPressure = diastolicResult;
k += 1;

});
Ti.API.info('ValueArray : ', ValueArray);

ValueArray.sort(function(a, b) {
if (a.sortTime < b.sortTime)
return 1;
if (a.sortTime > b.sortTime)
return -1;
return 0;
});
Ti.API.info('ValueArray Sort : ', ValueArray);
} else {
diastolicResult = "";
displayDate = "";
}
if (systolicResult != "" || diastolicResult != "")
result = systolicResult + "/" + diastolicResult + " mmHg";
else
result = "NA";
displayDate = pressureDate;
sysResult = sysMin + "-" + sysMax;
diaResult = diaMin + "-" + diaMax;
if (sysMin != "" && sysMax != "" && diaMin != "" && diaMax != "") {
if (sysMin === sysMax)
sysResult = sysMin;
if (diaMin === diaMax)
diaResult = diaMin;
} else {
sysResult = "-";
diaResult = "-";
}
average = sysResult + " / " + diaResult + " mmHg";
addvaluesToArray(commonFunctions.L('BpLbl', LangCode), result, average, displayDate, 5, ValueArray);
getRespiratoryRate();
}
});
setTimeout(function() {
TiHealthkit.executeQuery(query);
}, 100);

} catch(ex) {
commonFunctions.closeActivityIndicator();
commonFunctions.handleException("healthdatas", "getDiastolicPressure", ex);
}

}*/

/**
 * Function to get the respiratory rate.
 */
/*function getRespiratoryRate() {
try {
ValueArray = [];
var sortTime = "";
var prevSortTime = "";
var avgQuery = TiHealthkit.createStatisticsQuery({
type : TiHealthkit.OBJECT_TYPE_RESPIRATORY_RATE,
options : TiHealthkit.STATISTICS_OPTION_DISCRETE_AVERAGE,
onCompletion : function(e) {
if (e.result) {
if (e.result.getAverageQuantity() != null) {
Ti.API.info('AVERAGE respiratory:: ', e.result.getAverageQuantity().valueForUnit(TiHealthkit.createUnit('count/min')));
average = "Average: " + Math.round(e.result.getAverageQuantity().valueForUnit(TiHealthkit.createUnit('count/min')));
} else {
average = "";
}
} else {
average = "";
}
}
});
TiHealthkit.executeQuery(avgQuery);

var query = TiHealthkit.createSampleQuery({
type : TiHealthkit.OBJECT_TYPE_RESPIRATORY_RATE,
filter : filter,
onCompletion : function(e) {
Ti.API.info('RESPIRATORY:: ', JSON.stringify(e));
Ti.API.info('RESPIRATORY LENGTH :: ', e.results.length);

if (e.results.length > 0) {
e.results.forEach(function(respiratory) {
Ti.API.info('RESPIRATORY VALUE:: ', respiratory.quantity.valueForUnit(TiHealthkit.createUnit('count/min')));
var stepD = new Date(respiratory.startDate);
sortTime = stepD.getTime();
var newDate = stepD.getDate() + "/" + parseInt(stepD.getMonth() + 1) + "/" + stepD.getFullYear();

ValueArray.push({
date : newDate,
value : respiratory.quantity.valueForUnit(TiHealthkit.createUnit('count/min')) + " breaths/min",
sortTime : sortTime
});
if (prevSortTime == "" || prevSortTime < sortTime) {
result = respiratory.quantity.valueForUnit(TiHealthkit.createUnit('count/min')) + " breaths/min";
displayDate = commonFunctions.getMonthNameFormat(respiratory.startDate);
prevSortTime = sortTime;

}
});
Ti.API.info('ValueArray : ', ValueArray);

ValueArray.sort(function(a, b) {
if (a.sortTime < b.sortTime)
return 1;
if (a.sortTime > b.sortTime)
return -1;
return 0;
});
Ti.API.info('ValueArray Sort : ', ValueArray);

textPosition = 5;
} else {
result = "NA";
displayDate = "";
textPosition = 12;
}

addvaluesToArray(commonFunctions.L('respiratoryLbl', LangCode), result, average, displayDate, textPosition, ValueArray);
getSleepAnalysis();
}
});
setTimeout(function() {
TiHealthkit.executeQuery(query);
}, 100);

} catch(ex) {
commonFunctions.closeActivityIndicator();
commonFunctions.handleException("healthdatas", "getRespiratoryRate", ex);
}
}*/

/**
 * Function to get the sleep analysis.
 */
/*function getSleepAnalysis() {
try {
var sleepAnalysis;
var dateArray = [];
var lastDate;
var sleepDateFinal;
ValueArray = [];
var sleepCount = 0;
var averageHour = 0;
var averageMinuteTot = 0;
var isAsleep = false;
TiHealthkit.executeQuery(TiHealthkit.createSampleQuery({
type : TiHealthkit.OBJECT_TYPE_SLEEP_ANALYSIS,
filter : filter,
onCompletion : function(e) {
Ti.API.info('SLEEP ANALYSIS:: ', JSON.stringify(e));
sleepAnalysis = e.results;
if (sleepAnalysis.length > 0) {
sleepAnalysis.forEach(function(entry) {
Ti.API.info('START SLEEP:: ', entry.startDate);
Ti.API.info('END SLEEP:: ', entry.endDate);
Ti.API.info('SLEEP VALUE:: ', commonFunctions.sleepAnalysisNameForValue(entry.value));

result = commonFunctions.sleepAnalysisNameForValue(entry.value);
ValueArray.push({
sDate : commonFunctions.formatDateTime(entry.startDate),
eDate : commonFunctions.formatDateTime(entry.endDate),
value : result
});
Ti.API.info('Before Sort : ', ValueArray);
ValueArray.sort(function(a, b) {
if (a.sDate < b.sDate)
return 1;
if (a.sDate > b.sDate)
return -1;
return 0;
});
Ti.API.info('ValueArray Sort : ', ValueArray);
if (entry.value === 1) {
isAsleep = true;
displayDate = commonFunctions.getMonthNameFormat(entry.startDate);
lastDate = entry.endDate;
//Average time calculation
var sleepDate = new Date(entry.startDate);
var newDate = sleepDate.getUTCDate() + "/" + parseInt(sleepDate.getMonth() + 1) + "/" + sleepDate.getFullYear();
Ti.API.info('NEW DTAE:: ', newDate);
if (sleepDateFinal != newDate) {
sleepDateFinal = newDate;
sleepCount++;
}
var averageMinute = commonFunctions.getHourMinute(entry.startDate, entry.endDate);
var averageHourMinuteResult = averageMinute.split("/");
averageHour = parseInt(averageHour) + parseInt(averageHourMinuteResult[0]);
averageMinuteTot = parseInt(averageMinuteTot) + parseInt(averageHourMinuteResult[1]);

//Time Calculation.
var dateObject = {
startDate : entry.startDate,
endDate : entry.endDate
};
dateArray.push(dateObject);
}
});
if (isAsleep) {
var resultDate = commonFunctions.getDayMonth(lastDate);
var returnValue = resultDate.split("/");
var hourTotal = 0;
var minuteTotal = 0;
for (var i = 0; i < dateArray.length; i++) {
var arrayDate = commonFunctions.getDayMonth(dateArray[i].startDate);
var returnValueArray = arrayDate.split("/");
//returnValue[0] === returnValueArray[0] &&
if (returnValue[1] === returnValueArray[1]) {
var hourMinute = commonFunctions.getHourMinute(dateArray[i].startDate, dateArray[i].endDate);
var hourMinuteResult = hourMinute.split("/");
hourTotal = parseInt(hourTotal) + parseInt(hourMinuteResult[0]);
minuteTotal = parseInt(minuteTotal) + parseInt(hourMinuteResult[1]);
}
}
Ti.API.info('hourTotal:: ', hourTotal, " minuteTotal:: ", minuteTotal);
if (hourTotal > 0 && minuteTotal > 0)
result = hourTotal + " hr " + minuteTotal + " m";
else if (hourTotal > 0 && minuteTotal <= 0)
result = hourTotal + " hr";
else if (hourTotal <= 0 && minuteTotal > 0)
result = minuteTotal + " m";
else
result = "";

Ti.API.info('SLEEP COUNT:: ', sleepCount, " Average hour:: ", averageHour, " Average Minute:: ", averageMinuteTot);
var hourMinuteSecond = averageHour + ":" + averageMinuteTot;
average = "Average: " + commonFunctions.getHourMinuteFormat(hourMinuteSecond, sleepCount);
textPosition = 5;
} else {
result = "";
average = "";
displayDate = "";
textPosition = 12;
}

} else {
result = "NA";
displayDate = "";
average = "";
textPosition = 12;
}
addvaluesToArray(commonFunctions.L('sleepLbl', LangCode), result, average, displayDate, textPosition, ValueArray);
getStepCount();
}
}));
} catch(ex) {
commonFunctions.closeActivityIndicator();
commonFunctions.handleException("healthdatas", "getSleepAnalysis", ex);
}
}*/

/**
 * Function to get the step count.
 */
/*function getStepCount() {
try {
var sumValue = 0;
var stepCount = 0;
var stepDate;
var startDate;
var endDate;
var DateArray = [];
ValueArray = [];
var PreviousStartDate = "";
var PreviousEndDate = "";
var sortTime = "";
var prevSortTime = "";
var query = TiHealthkit.createSampleQuery({
type : TiHealthkit.OBJECT_TYPE_STEP_COUNT,
filter : filter,
onCompletion : function(e) {
Ti.API.info('STEPS:: ', JSON.stringify(e));
Ti.API.info('STEPS LENGTH:: ', e.results.length);
if (e.results.length > 0) {
e.results.forEach(function(steps) {
Ti.API.info('STEPS:: ', steps.quantity.valueForUnit(TiHealthkit.createUnit('count')));
result = steps.quantity.valueForUnit(TiHealthkit.createUnit('count')) + " steps";

sumValue = sumValue + steps.quantity.valueForUnit(TiHealthkit.createUnit('count'));
var stepD = new Date(steps.startDate);
sortTime = stepD.getTime();
var newDate = stepD.getDate() + "/" + parseInt(stepD.getMonth() + 1) + "/" + stepD.getFullYear();
Ti.API.info('NEW DTAE:: ', newDate);
if (DateArray.length == 0 || DateArray.indexOf(newDate) == -1) {
DateArray.push(newDate);
ValueArray.push({
date : newDate,
value : steps.quantity.valueForUnit(TiHealthkit.createUnit('count')),
sortTime : sortTime
});
stepDate = newDate;
stepCount++;
} else {
Ti.API.info('Already exist');
ValueArray[DateArray.indexOf(newDate)].value = ValueArray[DateArray.indexOf(newDate)].value + steps.quantity.valueForUnit(TiHealthkit.createUnit('count'));
}

startDate = new Date(steps.startDate);
startDate.setHours(0, 0, 0, 0);
endDate = new Date(steps.endDate);
endDate.setDate(endDate.getDate() + 1);
endDate.setHours(0, 0, 0, 0);
if (prevSortTime == "" || prevSortTime < sortTime) {
displayDate = commonFunctions.getMonthNameFormat(steps.startDate);
prevSortTime = sortTime;
PreviousStartDate = startDate;
PreviousEndDate = endDate;
}

});
Ti.API.info('ValueArray : ', ValueArray);

ValueArray.sort(function(a, b) {
if (a.sortTime < b.sortTime)
return 1;
if (a.sortTime > b.sortTime)
return -1;
return 0;
});
Ti.API.info('ValueArray Sort : ', ValueArray);
var returnValue = commonFunctions.getAverage(stepCount, sumValue);
average = "Average: " + returnValue;

var querystep = TiHealthkit.createStatisticsCollectionQuery({
type : TiHealthkit.OBJECT_TYPE_STEP_COUNT,
filter : TiHealthkit.createFilterForSamples({
startDate : PreviousStartDate,
endDate : PreviousEndDate
}),
options : TiHealthkit.STATISTICS_OPTION_CUMULATIVE_SUM,
anchorDate : anchorDate,
interval : 3600 * 24, // 24 hours
onInitialResults : onInitialResultsStep
});
TiHealthkit.executeQuery(querystep);
textPosition = 5;

} else {
result = "NA";
displayDate = "";
average = "";
textPosition = 12;
Ti.API.info('STEPS ARRAY : ', ValueArray);
addvaluesToArray(commonFunctions.L('stepLbl', LangCode), result, average, displayDate, textPosition, ValueArray);
getFlightsClimbed();
}
//addvaluesToArray("STEPS", result, average, displayDate);
//getFlightsClimbed();
}
});
setTimeout(function() {
TiHealthkit.executeQuery(query);
}, 100);

} catch(ex) {
commonFunctions.closeActivityIndicator();
commonFunctions.handleException("healthdatas", "getStepCount", ex);
}
}
*/
/**
 * Function to get the flights climbed.
 */
/*function getFlightsClimbed() {
try {
var sumClimbed = 0;
var climbCount = 0;
var climbDate;
var startDate;
var DateArray = [];
ValueArray = [];
var PreviousStartDate = "";
var PreviousEndDate = "";
var endDate;
var sortTime = "";
var prevSortTime = "";
var query = TiHealthkit.createSampleQuery({
type : TiHealthkit.OBJECT_TYPE_FLIGHTS_CLIMBED,
filter : filter,
onCompletion : function(e) {
Ti.API.info('FLIGHTS CLIMBED:: ', JSON.stringify(e));
Ti.API.info('FLIGHTS CLIMBED LENGTH:: ', e.results.length);
if (e.results.length > 0) {
e.results.forEach(function(flightsClimbed) {
Ti.API.info('FLIGHTS CLIMBED:: ', flightsClimbed.quantity.valueForUnit(TiHealthkit.createUnit('count')));
result = flightsClimbed.quantity.valueForUnit(TiHealthkit.createUnit('count')) + " floors";
//displayDate = commonFunctions.getMonthNameFormat(flightsClimbed.startDate);
sumClimbed = sumClimbed + flightsClimbed.quantity.valueForUnit(TiHealthkit.createUnit('count'));
var climbD = new Date(flightsClimbed.startDate);
// var test1 = commonFunctions.getFormattedDate(climbD);
// Ti.API.info('test1 : ', test1);
sortTime = climbD.getTime();
//Ti.API.info('climbD.getTime() : ', climbD, climbD.getTime());

var newDate = climbD.getDate() + "/" + parseInt(climbD.getMonth() + 1) + "/" + climbD.getFullYear();

if (DateArray.length == 0 || DateArray.indexOf(newDate) == -1) {
DateArray.push(newDate);
ValueArray.push({
date : newDate,
value : flightsClimbed.quantity.valueForUnit(TiHealthkit.createUnit('count')),
sortTime : sortTime
});
climbDate = newDate;
climbCount++;
} else {
Ti.API.info('Already exist');
ValueArray[DateArray.indexOf(newDate)].value = ValueArray[DateArray.indexOf(newDate)].value + flightsClimbed.quantity.valueForUnit(TiHealthkit.createUnit('count'));
}

startDate = new Date(flightsClimbed.startDate);
startDate.setHours(0, 0, 0, 0);
endDate = new Date(flightsClimbed.endDate);
endDate.setDate(endDate.getDate() + 1);
endDate.setHours(0, 0, 0, 0);

if (prevSortTime == "" || prevSortTime < sortTime) {
displayDate = commonFunctions.getMonthNameFormat(startDate);
prevSortTime = sortTime;
PreviousStartDate = startDate;
PreviousEndDate = endDate;
}

});

Ti.API.info('ValueArray : ', ValueArray);

// ValueArray.sort(function(a, b) {
//
// if (new Date(a.date).getTime() < new Date(b.date).getTime())
// return 1;
// if (new Date(a.date).getTime() > new Date(b.date).getTime())
// return -1;
// return 0;
// });
ValueArray.sort(function(a, b) {

if (a.sortTime < b.sortTime)
return 1;
if (a.sortTime > b.sortTime)
return -1;
return 0;
});
Ti.API.info('ValueArray Sort : ', ValueArray);
Ti.API.info('START DATE ===== ', startDate);
Ti.API.info('TO DATE ===== ', endDate);
Ti.API.info('ANCHOR DATE ===== ', anchorDate);

var climbTotalAverage = commonFunctions.getAverage(climbCount, sumClimbed);
average = "Average: " + climbTotalAverage;

var querystst = TiHealthkit.createStatisticsCollectionQuery({
type : TiHealthkit.OBJECT_TYPE_FLIGHTS_CLIMBED,
filter : TiHealthkit.createFilterForSamples({
startDate : PreviousStartDate,
endDate : PreviousEndDate
}),
options : TiHealthkit.STATISTICS_OPTION_CUMULATIVE_SUM,
anchorDate : anchorDate,
interval : 3600 * 24, // 24 hours
onInitialResults : onInitialResults,
onStatisticsUpdate : onStatisticsUpdate
});
TiHealthkit.executeQuery(querystst);
textPosition = 5;

} else {
result = "NA";
displayDate = "";
average = "";
textPosition = 12;
addvaluesToArray(commonFunctions.L('flightLbl', LangCode), result, average, displayDate, textPosition, ValueArray);
loadHealthDatas();

}

}
});
setTimeout(function() {
TiHealthkit.executeQuery(query);
}, 100);

} catch(ex) {
commonFunctions.closeActivityIndicator();
commonFunctions.handleException("healthdatas", "getFlightsClimbed", ex);
}
}
*/
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
			Ti.API.info('quantity:: ', quantity);
			Ti.API.info('stepCount:: ', stepCount);
			result = stepCount + " steps";
			Ti.API.info('onInitialResultsStep ValueArray : ', ValueArray);
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
			Ti.API.info('quantity:: ', quantity);
			Ti.API.info('fightCount:: ', flightCount);
			result = flightCount + " floors";
			addvaluesToArray(commonFunctions.L('flightLbl', LangCode), result, average, displayDate, 0, ValueArray);
			//getUvExposure();
			loadHealthDatas();
		});
	} catch(ex) {
		commonFunctions.handleException("healthdatas", "onInitialResults", ex);
	}
}

function onStatisticsUpdate(e) {
	Ti.API.info('onStatisticsUpdate');
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
		Ti.API.info('healthDataRefresh');
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
		Ti.API.info('googleFitDataAndroid init');
		googlefitmodule.init();
		Ti.API.info('googleFitDataAndroid init complete');
		googlefitmodule.addEventListener("read_fitness_data", function(evt) {
			Ti.API.info('****RESULTS****:: ', JSON.stringify(evt));
			if (healthArray.length > 0) {
				var receivedValue = "";
				healthDatas = [];
				for (var i = 0; i < healthArray.length; i++) {
					///if (healthArray[i].field == "HEIGHT") {
					if (healthArray[i].field == commonFunctions.L('heightLbl', LangCode)) {
						if (evt.height != null) {
							receivedValue = evt.height;
							receivedValue = receivedValue * 100 + " Cm";
						} else {
							receivedValue = "NA";
						}
					}// else if (healthArray[i].field == "WEIGHT") {
					else if (healthArray[i].field == commonFunctions.L('wieghtLbl', LangCode)) {
						if (evt.weight != null)
							receivedValue = Math.round(evt.weight) + " Kg";
						else
							receivedValue = "NA";
					}// else if (healthArray[i].field == "HEART RATE") {
					else if (healthArray[i].field == commonFunctions.L('heartLbl', LangCode)) {
						receivedValue = (evt.bpm != null) ? evt.bpm + " bpm" : "NA";
					}
					// else if (healthArray[i].field == "DISTANCE") {
					else if (healthArray[i].field == commonFunctions.L('distanceLbl', LangCode)) {
						receivedValue = (evt.distance != null) ? evt.distance + " meters" : "NA";
					}
					// else if (healthArray[i].field == "STEPS") {
					else if (healthArray[i].field == commonFunctions.L('stepLbl', LangCode)) {
						receivedValue = (evt.steps != null) ? evt.steps + " steps" : "NA";
					}
					// else if (healthArray[i].field == "SEGMENT") {
					else if (healthArray[i].field == commonFunctions.L('segmnetLbl', LangCode)) {
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
	Ti.API.info('listViewClick : ', JSON.stringify(e));
	if (OS_IOS) {
		if (healthDatas[e.itemIndex].detailsArray.length != 0) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('healthDataDetails', {
				"detailsArray" : healthDatas[e.itemIndex].detailsArray,
				"rowIndex" : e.itemIndex
			});
		}
	}

}