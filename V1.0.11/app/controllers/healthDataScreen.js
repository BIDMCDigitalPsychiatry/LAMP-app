// Arguments passed into this controller can be accessed via the `$.args` object directly or:
/**
 * Declarations
 */
var args = $.args;
var commonFunctions = require('commonFunctions');
if (OS_IOS) {
	var TiHealthkit = require('ti.healthkit');
} else {
	Ti.API.info('require');
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
if (OS_IOS) {
	var timestamp = new Date();
	timestamp.setDate(timestamp.getDate() - 30);
	var timestampEnd = new Date();
	var filter = TiHealthkit.createFilterForSamples({
		startDate : timestamp,
		endDate : timestampEnd,
		options : TiHealthkit.QUERY_OPTION_STRICT_START_DATE
	});
}

/**
 * Function for screen open
 */
$.healthDataScreen.addEventListener("open", function(e) {
	try {
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

/***
 * Function for loading health datas
 */
function loadHealthDatas() {
	try {
		var dataArray = [];
		for (var i = 0; i < healthDatas.length; i++) {
			dataArray.push({
				template : "healthDataTemplate",
				dataLabel : {
					text : healthDatas[i].field,
					top : healthDatas[i].position + "dp"
				},
				averageLabel : {
					text : healthDatas[i].average
				},
				dataValueLabel : {
					text : healthDatas[i].value,
					top : healthDatas[i].position + "dp"
				},
				dateLabel : {
					text : healthDatas[i].date
				},

			});
		};
		$.lstSection.setItems(dataArray);
		commonFunctions.closeActivityIndicator();
	} catch(ex) {
		commonFunctions.handleException("healthdatas", "loadHealthDatas", ex);
	}
}

/**
 * function for back button click
 */

$.headerView.on('backButtonClick', function(e) {
	Ti.API.info('backButtonClick');
	goBack();
});

/**
 * goBack function handler
 */
function goBack(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('healthDataScreen');
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
$.healthDataScreen.addEventListener('android:back', function() {
	Ti.API.info('healthDataScreen Android Back');
	goBack();
});

/**
 * For authorizing the health kit..
 */
function healthKitAuthorization() {
	try {
		//TiHealthkit.OBJECT_TYPE_HEIGHT, TiHealthkit.OBJECT_TYPE_BODY_MASS, TiHealthkit.OBJECT_TYPE_BODY_MASS_INDEX, TiHealthkit.OBJECT_TYPE_HEART_RATE, TiHealthkit.OBJECT_TYPE_SLEEP_ANALYSIS, TiHealthkit.OBJECT_TYPE_BLOOD_PRESSURE_SYSTOLIC, TiHealthkit.OBJECT_TYPE_STEP_COUNT, TiHealthkit.OBJECT_TYPE_FLIGHTS_CLIMBED, TiHealthkit.OBJECT_TYPE_BLOOD_PRESSURE_DIASTOLIC, TiHealthkit.OBJECT_TYPE_RESPIRATORY_RATE
		var typesToRead = [TiHealthkit.OBJECT_TYPE_HEART_RATE, TiHealthkit.OBJECT_TYPE_HEIGHT, TiHealthkit.OBJECT_TYPE_BODY_MASS, TiHealthkit.OBJECT_TYPE_BIOLOGICAL_SEX, TiHealthkit.OBJECT_TYPE_BLOOD_TYPE, TiHealthkit.OBJECT_TYPE_DATE_OF_BIRTH, TiHealthkit.OBJECT_TYPE_SLEEP_ANALYSIS, TiHealthkit.OBJECT_TYPE_STEP_COUNT, TiHealthkit.OBJECT_TYPE_FLIGHTS_CLIMBED, TiHealthkit.OBJECT_TYPE_BLOOD_PRESSURE_SYSTOLIC, TiHealthkit.OBJECT_TYPE_BLOOD_PRESSURE_DIASTOLIC, TiHealthkit.OBJECT_TYPE_RESPIRATORY_RATE];
		var typesToShare = [];
		if (TiHealthkit.isHealthDataAvailable) {
			TiHealthkit.requestAuthorization({
				typesToRead : typesToRead,
				typesToShare : typesToShare,
				onCompletion : function(e) {
					if (e.success) {
						Ti.API.info('AUHORIZATION SUCCESS:: ', e);
						getValuesFromHealthKit();
					} else {
						commonFunctions.closeActivityIndicator();
						Ti.API.info('failed..', e);
					}
				}
			});
		} else {
			Ti.API.info('HEALTH DATA NOT AVAILABLE..');
			healthAppNotFound();
		}
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
		Ti.API.info('DATE OF BIRTH:: ', TiHealthkit.userDateOfBirth);
		var dateOfBirth = commonFunctions.L('notSetLbl', LangCode);
		if (TiHealthkit.userDateOfBirth != null)
			dateOfBirth = commonFunctions.getMonthNameFormat(TiHealthkit.userDateOfBirth);
		Ti.API.info('DATE OF BIRTH FORMATTED:: ', dateOfBirth);
		addvaluesToArray("DOB", dateOfBirth, "", "", 12, []);

		var biologicalSex;
		switch (TiHealthkit.userBiologicalSex) {
		case TiHealthkit.SEX_NOT_SET:
			biologicalSex = commonFunctions.L('notSetLbl', LangCode);
			break;
		case TiHealthkit.SEX_FEMALE:
			biologicalSex = commonFunctions.L('femaleLbl', LangCode);
			break;
		case TiHealthkit.SEX_MALE:
			biologicalSex = commonFunctions.L('maleLbl', LangCode);
			break;
		case TiHealthkit.SEX_OTHER:
			biologicalSex = commonFunctions.L('otherLbl', LangCode);
			break;
		}
		Ti.API.info('BIO LOGICAL SEX:: ', biologicalSex);
		addvaluesToArray(commonFunctions.L('sexLbl', LangCode), biologicalSex, "", "", 12, []);

		var bloodGroup;
		switch (TiHealthkit.userBloodType) {
		case TiHealthkit.BLOOD_TYPE_NOT_SET:
			bloodGroup = commonFunctions.L('notSetLbl', LangCode);
			break;
		case TiHealthkit.BLOOD_TYPE_APOSITIVE:
			bloodGroup = 'A+';
			break;
		case TiHealthkit.BLOOD_TYPE_ANEGATIVE:
			bloodGroup = 'A-';
			break;
		case TiHealthkit.BLOOD_TYPE_BPOSITIVE:
			bloodGroup = 'B+';
			break;
		case TiHealthkit.BLOOD_TYPE_BNEGATIVE:
			bloodGroup = 'B-';
			break;
		case TiHealthkit.BLOOD_TYPE_ABPOSITIVE:
			bloodGroup = 'AB+';
			break;
		case TiHealthkit.BLOOD_TYPE_ABNEGATIVE:
			bloodGroup = 'AB-';
			break;
		case TiHealthkit.BLOOD_TYPE_OPOSITIVE:
			bloodGroup = 'O+';
			break;
		case TiHealthkit.BLOOD_TYPE_ONEGATIVE:
			bloodGroup = 'O-';
			break;
		}
		Ti.API.info('BLOOD GROUP:: ', bloodGroup);
		addvaluesToArray(commonFunctions.L('bloodtypeLbl', LangCode), bloodGroup, "", "", 12, []);
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
		Ti.API.info('addvaluesToArray detailsArray : ', detailsArray);
		var healthDataslist = {
			field : field,
			value : value,
			average : average,
			date : date,
			position : position,
			detailsArray : detailsArray
		};
		healthDatas.push(healthDataslist);
		Ti.API.info('healthDatas: ', healthDatas.length);
	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("healthdatas", "addvaluesToArray", ex);
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
		var avgQuery = TiHealthkit.createStatisticsQuery({
			type : TiHealthkit.OBJECT_TYPE_HEIGHT,
			options : TiHealthkit.STATISTICS_OPTION_DISCRETE_AVERAGE,
			onCompletion : function(e) {
				Ti.API.info('RSULT:: ', e.result);
				if (e.result) {
					if (e.result.getAverageQuantity() != null) {
						Ti.API.info('AVERAGE height:: ', e.result.getAverageQuantity().valueForUnit(TiHealthkit.createUnit('ft')));
						average = "Average: " + commonFunctions.getFeetInchesFormat(e.result.getAverageQuantity().valueForUnit(TiHealthkit.createUnit('ft')));
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
			type : TiHealthkit.OBJECT_TYPE_HEIGHT,
			filter : filter,
			onCompletion : function(e) {
				Ti.API.info('BODY HEIGHT:: ', JSON.stringify(e));
				Ti.API.info('HEIGHT LENGTH:: ', e.results.length);
				if (e.results.length > 0) {
					e.results.forEach(function(height) {
						Ti.API.info('HEIGHT VALUE:: ', height.quantity.valueForUnit(TiHealthkit.createUnit('ft')));
						var stepD = new Date(height.startDate);
						sortTime = stepD.getTime();
						var newDate = stepD.getDate() + "/" + parseInt(stepD.getMonth() + 1) + "/" + stepD.getFullYear();
						ValueArray.push({
							date : newDate,
							value : commonFunctions.getFeetInchesFormat(height.quantity.valueForUnit(TiHealthkit.createUnit('ft'))),
							sortTime : sortTime
						});
						if (prevSortTime == "" || prevSortTime < sortTime) {
							result = commonFunctions.getFeetInchesFormat(height.quantity.valueForUnit(TiHealthkit.createUnit('ft')));
							displayDate = commonFunctions.getMonthNameFormat(height.startDate);
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

				addvaluesToArray(commonFunctions.L('heightLbl', LangCode), result, average, displayDate, textPosition, ValueArray);
				getWeight();
			}
		});
		setTimeout(function() {
			TiHealthkit.executeQuery(query);
		}, 100);

	} catch(ex) {
		commonFunctions.closeActivityIndicator();
		commonFunctions.handleException("healthdatas", "getHeight", ex);
	}
}

/**
 * Function to get weight.
 */
function getWeight() {
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
}

/**
 * Function to get the heart rate
 */
function getHeartRate() {
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
}

var systolicResult = "";
var diastolicResult = "";
var sysMin = "";
var sysMax = "";
var diaMin = "";
var diaMax = "";
var sysResult = "";
var diaResult = "";

/**
 * Function to get the systolic pressure
 */
function getSystolicPressure() {
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

/**
 * Function to get the diastolic pressure
 */
function getDiastolicPressure() {
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

}

/**
 * Function to get the respiratory rate.
 */
function getRespiratoryRate() {
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
}

/**
 * Function to get the sleep analysis.
 */
function getSleepAnalysis() {
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
}

/**
 * Function to get the step count.
 */
function getStepCount() {
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

/**
 * Function to get the flights climbed.
 */
function getFlightsClimbed() {
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

						sumClimbed = sumClimbed + flightsClimbed.quantity.valueForUnit(TiHealthkit.createUnit('count'));
						var climbD = new Date(flightsClimbed.startDate);

						sortTime = climbD.getTime();

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
$.healthDataScreen.addEventListener('close', windowClose);

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
		$.healthDataScreen.removeEventListener('close', windowClose);
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
					if (healthArray[i].field == "HEIGHT") {
						if (evt.height != null) {
							receivedValue = evt.height;
							receivedValue = receivedValue * 100 + " Cm";
						} else {
							receivedValue = "NA";
						}
					} else if (healthArray[i].field == "WEIGHT") {
						if (evt.weight != null)
							receivedValue = Math.round(evt.weight) + " Kg";
						else
							receivedValue = "NA";
					} else if (healthArray[i].field == "HEART RATE") {
						receivedValue = (evt.bpm != null) ? evt.bpm + " bpm" : "NA";
					} else if (healthArray[i].field == "DISTANCE") {
						receivedValue = (evt.distance != null) ? evt.distance + " meters" : "NA";
					} else if (healthArray[i].field == "STEPS") {
						receivedValue = (evt.steps != null) ? evt.steps + " steps" : "NA";
					} else if (healthArray[i].field == "SEGMENT") {
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

/**
 * List view click handler
 */
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