var commonFunctions = require('commonFunctions');
if (OS_IOS) {
	var TiHealthkit = require('ti.healthkit');
} else {

	//var googlefitmodule = require('com.zco.google.fit');
}
var healthArray = [];
var healthArrayAndroid = [];
var tempPressureValue = "";
var heartRateObserverQuery = null;
var heartRateCallback;
var healthKitParams = [];
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
if (!OS_IOS) {
	var healthArray = [{
		field : "HEIGHT"
	}, {
		field : "WEIGHT"
	}, {
		field : "HEART RATE"
	}, {
		field : "DISTANCE"
	}, {
		field : "STEPS"
	}, {
		field : "SEGMENT"
	}];
}

exports.getHealthDatas = function(successCallBack) {
	try {
		
		healthArrayAndroid = [];
		tempPressureValue = "";
		heartRateObserverQuery = null;
		healthKitParams = [];
		if (OS_IOS) {
			healthArray = [];
			timestamp = new Date();
			timestamp.setDate(timestamp.getDate() - 30);
			timestampEnd = new Date();
			filter = TiHealthkit.createFilterForSamples({
				startDate : timestamp,
				endDate : timestampEnd,
				options : TiHealthkit.QUERY_OPTION_STRICT_START_DATE
			});
			healthKitAuthorization(onSuccessFinal);
			function onSuccessFinal(e) {
				successCallBack(healthArray, healthKitParams);
			}

		} else {

			googleFitDataAndroid(onSuccessFinalAndroid);
			function onSuccessFinalAndroid(e) {
				Ti.API.info('onSuccessFinalAndroid');
				successCallBack(healthArrayAndroid);
			}

		}

	} catch(e) {

	}
};
/**
 * Function for listing the values from google fit..
 */
function googleFitDataAndroid(successCallBack) {
	try {
		var googlefitmodule = require('com.zco.google.fit');
		Ti.API.info('googleFitDataAndroid health Data init');
		googlefitmodule.init();
		Ti.API.info('googleFitDataAndroid health Data init complete');
		googlefitmodule.addEventListener("read_fitness_data", function(evt) {
			Ti.API.info('read_fitness_data', JSON.stringify(evt));
			Ti.API.info('healthArray.length',healthArray, " " ,healthArray.length);
			if (healthArray.length > 0) {
				Ti.API.info('read_fitness_data if');
				var receivedValue = "";
				healthDatas = [];
				healthArrayAndroid = ["", "", "", "", "", "", "", "", "", "", "", "", ""];
				for (var i = 0; i < healthArray.length; i++) {
					Ti.API.info('read_fitness_data for', healthArray[i].field);
					if (healthArray[i].field == "HEIGHT") {
						Ti.API.info('read_fitness_data HEIGHT');
						if (evt.height != null) {
							receivedValue = evt.height;
							receivedValue = receivedValue * 100 + " Cm";
						} else {
							receivedValue = "NA";
						}
						healthArrayAndroid[3] = receivedValue;
					} else if (healthArray[i].field == "WEIGHT") {
						Ti.API.info('read_fitness_data WEIGHT');
						if (evt.weight != null)
							receivedValue = Math.round(evt.weight) + " Kg";
						else
							receivedValue = "NA";

						healthArrayAndroid[4] = receivedValue;
					} else if (healthArray[i].field == "HEART RATE") {
						receivedValue = (evt.bpm != null) ? evt.bpm + " bpm" : "NA";
						healthArrayAndroid[5] = receivedValue;
					} else if (healthArray[i].field == "DISTANCE") {
						receivedValue = (evt.distance != null) ? evt.distance + " meters" : "NA";
						Ti.API.info('enter the susscess of DISTANCE', receivedValue);
						healthArrayAndroid[12] = receivedValue;
					} else if (healthArray[i].field == "STEPS") {
						receivedValue = (evt.steps != null) ? evt.steps + " steps" : "NA";
						Ti.API.info('enter the susscess of step', receivedValue);

						healthArrayAndroid[9] = receivedValue;

					} else if (healthArray[i].field == "SEGMENT") {
						receivedValue = (evt.activity != null) ? evt.activity : "NA";
						Ti.API.info('enter the susscess of SEGMENT', receivedValue);
						healthArrayAndroid[11] = receivedValue;
					}

				}
				Ti.API.info('enter the susscess of healhdat', healthArrayAndroid);
				successCallBack();
			}

		});
	} catch(ex) {
		Ti.API.info('error of event', JSON.stringify(ex));
		commonFunctions.handleException("healthdatas", "googleFitDataAndroid", ex);
	}
}

function healthKitAuthorization(successCallBack) {
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
						startHeartRateObserverQuery();
						getValuesFromHealthKit(onSuccess);
						function onSuccess(e) {
							successCallBack();
						}

					} else {

						Ti.API.info('failed..', e);
					}
				}
			});
		}
	} catch(ex) {

		commonFunctions.handleException("healthdatas", "healthKitAuthorization", ex);
	}
}

function startHeartRateObserverQuery() {
	if (heartRateObserverQuery) {

		return;
	}
	//alert("oberver query");
	heartRateObserverQuery = TiHealthkit.createObserverQuery({
		type : TiHealthkit.OBJECT_TYPE_HEART_RATE,
		onUpdate : function(e) {
			// The onUpdate callback will fire immediately after executing the
			// observerQuery if there are matching entries in the data store.
			// After that, the callback will be called every time a matching
			// entry is added or deleted, until the query is finally stopped.

			//alert(JSON.stringify(e));
			if (e.errorCode !== undefined) {

				// if (heartRateCallback) {
				// heartRateCallback(e);
				// }
				if (e.completionToken !== undefined) {
					TiHealthkit.callObserverQueryCompletionHandler(e.completionToken);
				}
			}
			// else {
			// retrieveHeartRateSamples(e.completionToken);
			// }
		}
	});

	TiHealthkit.executeQuery(heartRateObserverQuery);
}

function getValuesFromHealthKit(successCallBack) {
	try {

		//Ti.API.info('DATE OF BIRTH:: ', TiHealthkit.userDateOfBirth);
		var dateOfBirth = null;
		if (TiHealthkit.userDateOfBirth != null)

			if (!OS_IOS) {
				dateOfBirth = commonFunctions.getMonthNameFormat(TiHealthkit.userDateOfBirth);
			} else {

				if (!TiHealthkit.userDateOfBirth) {
					var date = new Date();
				} else {
					var date = new Date(TiHealthkit.userDateOfBirth);
				}
				var currentTime = date;
				var monthCount = currentTime.getMonth();
				if (monthCount < 10) {
					monthCount = "0" + monthCount;
				}
				var day = currentTime.getDate();
				if (day < 10) {
					day = "0" + day;
				}
				var year = currentTime.getFullYear();

				dateOfBirth = year + "/" + monthCount + "/" + day;
			}

		healthArray.push(dateOfBirth);

		var biologicalSex;
		switch (TiHealthkit.userBiologicalSex) {
		case TiHealthkit.SEX_NOT_SET:
			biologicalSex = 'Not set';
			break;
		case TiHealthkit.SEX_FEMALE:
			//biologicalSex = 'Female';
			biologicalSex = 'F';
			break;
		case TiHealthkit.SEX_MALE:
			//biologicalSex = 'Male';
			biologicalSex = 'M';
			break;
		case TiHealthkit.SEX_OTHER:
			biologicalSex = 'Other';
			break;
		}

		healthArray.push(biologicalSex);
		var bloodGroup;
		switch (TiHealthkit.userBloodType) {
		case TiHealthkit.BLOOD_TYPE_NOT_SET:
			bloodGroup = 'Not set';
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

		healthArray.push(bloodGroup);
		getHeight(onSuccess);
		function onSuccess(e) {
			successCallBack();
		}

	} catch(ex) {

		commonFunctions.handleException("healthdatas", "getValuesFromHealthKit", ex);
	}
}

function getHeight(successCallBack) {
	try {
		var heightValue = "";
		var query = TiHealthkit.createSampleQuery({
			type : TiHealthkit.OBJECT_TYPE_HEIGHT,
			filter : filter,
			onCompletion : function(e) {

				if (e.results.length > 0) {
					e.results.forEach(function(height) {

						var stepD = new Date(height.startDate);
						var newDate = stepD.getDate() + "/" + parseInt(stepD.getMonth() + 1) + "/" + stepD.getFullYear();
						var curDate = new Date();
						var todayDate = curDate.getDate() + "/" + parseInt(curDate.getMonth() + 1) + "/" + curDate.getFullYear();

						if (todayDate == newDate) {
							heightValue = commonFunctions.getFeetInchesFormat(height.quantity.valueForUnit(TiHealthkit.createUnit('ft')));
							var DateTimeParam = commonFunctions.getUTCDateTimeFormat(stepD);
							healthKitParams.push({
								"ParamID" : 1,
								"Value" : heightValue,
								"DateTime" : DateTimeParam
							});
						}

					});

				}
				healthArray.push(heightValue);
				getWeight(onSuccess);
				function onSuccess(e) {
					successCallBack();
				}

			}
		});
		setTimeout(function() {
			TiHealthkit.executeQuery(query);
		}, 100);

	} catch(ex) {

		commonFunctions.handleException("healthdatas", "getHeight", ex);
	}
}

function getWeight(successCallBack) {
	try {
		var weightValue = "";

		var query = TiHealthkit.createSampleQuery({
			type : TiHealthkit.OBJECT_TYPE_BODY_MASS,
			filter : filter,
			onCompletion : function(e) {

				if (e.results.length > 0) {
					e.results.forEach(function(bodyMass) {

						var stepD = new Date(bodyMass.startDate);
						var newDate = stepD.getDate() + "/" + parseInt(stepD.getMonth() + 1) + "/" + stepD.getFullYear();
						var curDate = new Date();
						var todayDate = curDate.getDate() + "/" + parseInt(curDate.getMonth() + 1) + "/" + curDate.getFullYear();

						if (todayDate == newDate) {
							weightValue = commonFunctions.convertKiloGmToPound(bodyMass.quantity.valueForUnit(TiHealthkit.createUnit('kg'))) + " lbs";
							var DateTimeParam = commonFunctions.getUTCDateTimeFormat(stepD);
							healthKitParams.push({
								"ParamID" : 2,
								"Value" : weightValue,
								"DateTime" : DateTimeParam
							});

						}
					});

				}
				healthArray.push(weightValue);

				getHeartRate(onSuccess);
				function onSuccess(e) {
					successCallBack();
				}

			}
		});
		setTimeout(function() {
			TiHealthkit.executeQuery(query);
		}, 100);

	} catch(ex) {

		commonFunctions.handleException("healthdatas", "getWeight", ex);
	}
}

function getHeartRate(successCallBack) {
	try {
		var heartRateValueMin = "";
		var heartRateValueMax = "";
		var heartRateArray = [];
		var query = TiHealthkit.createSampleQuery({
			type : TiHealthkit.OBJECT_TYPE_HEART_RATE,
			filter : filter,
			onCompletion : function(e) {

				if (e.results.length > 0) {
					e.results.forEach(function(heartRate) {

						var stepD = new Date(heartRate.startDate);
						var newDate = stepD.getDate() + "/" + parseInt(stepD.getMonth() + 1) + "/" + stepD.getFullYear();
						var curDate = new Date();
						var todayDate = curDate.getDate() + "/" + parseInt(curDate.getMonth() + 1) + "/" + curDate.getFullYear();

						if (todayDate == newDate) {
							if (heartRateValueMin == "") {
								//heartRateValueMin = heartRateValueMax < heartRate.quantity.valueForUnit(TiHealthkit.createUnit('count/min'));

								//heartRateValueMax = heartRateValueMax < heartRate.quantity.valueForUnit(TiHealthkit.createUnit('count/min'));

								heartRateValueMin = heartRate.quantity.valueForUnit(TiHealthkit.createUnit('count/min'));
								heartRateValueMax = heartRate.quantity.valueForUnit(TiHealthkit.createUnit('count/min'));

							} else if (heartRateValueMax != "" && heartRateValueMax < heartRate.quantity.valueForUnit(TiHealthkit.createUnit('count/min'))) {
								heartRateValueMax = heartRate.quantity.valueForUnit(TiHealthkit.createUnit('count/min'));
							} else if (heartRateValueMin != "" && heartRateValueMin > heartRate.quantity.valueForUnit(TiHealthkit.createUnit('count/min'))) {
								heartRateValueMin = heartRate.quantity.valueForUnit(TiHealthkit.createUnit('count/min'));
							}
							var heartRate = heartRate.quantity.valueForUnit(TiHealthkit.createUnit('count/min'));
							var DateTimeParam = commonFunctions.getUTCDateTimeFormat(stepD);
							healthKitParams.push({
								"ParamID" : 3,
								"Value" : heartRate,
								"DateTime" : DateTimeParam
							});

						}

					});

				}
				var fullValue = "";
				if (heartRateValueMin != "" && heartRateValueMax != "") {
					fullValue = heartRateValueMin + " - " + heartRateValueMax + " bpm";
				}

				healthArray.push(fullValue);
				getSystolicPressure(onSuccess);
				function onSuccess(e) {
					successCallBack();
				}

			}
		});
		setTimeout(function() {
			TiHealthkit.executeQuery(query);
		}, 500);
	} catch(ex) {

		commonFunctions.handleException("healthdatas", "getHeartRate", ex);
	}
}

function getSystolicPressure(successCallBack) {
	try {
		var systolicPressureValue = "";
		var systolicPressureArray = [];
		var query = TiHealthkit.createSampleQuery({
			type : TiHealthkit.OBJECT_TYPE_BLOOD_PRESSURE_SYSTOLIC,
			filter : filter,
			onCompletion : function(e) {

				if (e.results.length > 0) {
					e.results.forEach(function(pressure) {

						var stepD = new Date(pressure.startDate);
						Ti.API.info('stepD of pressure', stepD);
						var newDate = stepD.getDate() + "/" + parseInt(stepD.getMonth() + 1) + "/" + stepD.getFullYear();
						Ti.API.info('newDate of pressure', newDate);
						var curDate = new Date();

						var todayDate = curDate.getDate() + "/" + parseInt(curDate.getMonth() + 1) + "/" + curDate.getFullYear();
						var pressureValue1 = pressure.quantity.valueForUnit(TiHealthkit.createUnit('mmHg'));
						Ti.API.info('pressureValue1 of pressure1', pressureValue1);
						if (todayDate == newDate) {
							var pressureValue = pressure.quantity.valueForUnit(TiHealthkit.createUnit('mmHg'));
							Ti.API.info('pressureValue of pressure', pressureValue);
							var DateTimeParam = commonFunctions.getUTCDateTimeFormat(stepD);
							healthKitParams.push({
								"ParamID" : 4,
								"Value" : pressureValue,
								"DateTime" : DateTimeParam
							});
							systolicPressureValue = pressure.quantity.valueForUnit(TiHealthkit.createUnit('mmHg'));
						}

					});

				}
				tempPressureValue = systolicPressureValue;
				getDiastolicPressure(onSuccess);
				function onSuccess(e) {
					successCallBack();
				}

			}
		});
		setTimeout(function() {
			TiHealthkit.executeQuery(query);
		}, 100);

	} catch(ex) {

		commonFunctions.handleException("healthdatas", "getSystolicPressure", ex);
	}
}

function getDiastolicPressure(successCallBack) {
	try {
		var diastolicPressureValue = "";
		var diastolicPressureArray = [];
		var query = TiHealthkit.createSampleQuery({
			type : TiHealthkit.OBJECT_TYPE_BLOOD_PRESSURE_DIASTOLIC,
			filter : filter,
			onCompletion : function(e) {

				if (e.results.length > 0) {
					e.results.forEach(function(pressure) {

						var stepD = new Date(pressure.startDate);
						var newDate = stepD.getDate() + "/" + parseInt(stepD.getMonth() + 1) + "/" + stepD.getFullYear();
						var curDate = new Date();
						var todayDate = curDate.getDate() + "/" + parseInt(curDate.getMonth() + 1) + "/" + curDate.getFullYear();

						if (todayDate == newDate) {
							var pressureValue = pressure.quantity.valueForUnit(TiHealthkit.createUnit('mmHg'));
							var DateTimeParam = commonFunctions.getUTCDateTimeFormat(stepD);
							healthKitParams.push({
								"ParamID" : 4,
								"Value" : pressureValue,
								"DateTime" : DateTimeParam
							});
							diastolicPressureValue = pressure.quantity.valueForUnit(TiHealthkit.createUnit('mmHg'));

						}

					});

				}
				var totalValue = "";
				if (tempPressureValue != "" || diastolicPressureValue != "") {

					totalValue = tempPressureValue + "/" + diastolicPressureValue + " mmHg";
				}
				healthArray.push(totalValue);
				getRespiratoryRate(onSuccess);
				function onSuccess(e) {
					successCallBack();
				}

			}
		});
		setTimeout(function() {
			TiHealthkit.executeQuery(query);
		}, 100);

	} catch(ex) {

		commonFunctions.handleException("healthdatas", "getDiastolicPressure", ex);
	}

}

function getRespiratoryRate(successCallBack) {
	try {
		var respiratoryRateValue = "";
		var respiratoryArray = [];
		var query = TiHealthkit.createSampleQuery({
			type : TiHealthkit.OBJECT_TYPE_RESPIRATORY_RATE,
			filter : filter,
			onCompletion : function(e) {

				if (e.results.length > 0) {
					e.results.forEach(function(respiratory) {

						var stepD = new Date(respiratory.startDate);
						sortTime = stepD.getTime();
						var newDate = stepD.getDate() + "/" + parseInt(stepD.getMonth() + 1) + "/" + stepD.getFullYear();
						var curDate = new Date();
						var todayDate = curDate.getDate() + "/" + parseInt(curDate.getMonth() + 1) + "/" + curDate.getFullYear();

						if (todayDate == newDate) {
							var respiratoryValue = respiratory.quantity.valueForUnit(TiHealthkit.createUnit('count/min')) + " breaths/min";
							var DateTimeParam = commonFunctions.getUTCDateTimeFormat(stepD);
							healthKitParams.push({
								"ParamID" : 5,
								"Value" : respiratoryValue,
								"DateTime" : DateTimeParam
							});
							respiratoryRateValue = respiratory.quantity.valueForUnit(TiHealthkit.createUnit('count/min')) + " breaths/min";

						}

					});

				}
				healthArray.push(respiratoryRateValue);
				getSleepAnalysis(onSuccess);
				function onSuccess(e) {
					successCallBack();
				}

			}
		});
		setTimeout(function() {
			TiHealthkit.executeQuery(query);
		}, 100);

	} catch(ex) {

		commonFunctions.handleException("healthdatas", "getRespiratoryRate", ex);
	}
}

function getSleepAnalysis(successCallBack) {
	try {
		var sleepValue = "";
		var sleepArray = [];
		TiHealthkit.executeQuery(TiHealthkit.createSampleQuery({
			type : TiHealthkit.OBJECT_TYPE_SLEEP_ANALYSIS,
			filter : filter,
			onCompletion : function(e) {

				sleepAnalysis = e.results;
				if (sleepAnalysis.length > 0) {
					sleepAnalysis.forEach(function(entry) {

						var stepD = new Date(entry.startDate);
						sortTime = stepD.getTime();
						var newDate = stepD.getDate() + "/" + parseInt(stepD.getMonth() + 1) + "/" + stepD.getFullYear();
						var curDate = new Date();
						var todayDate = curDate.getDate() + "/" + parseInt(curDate.getMonth() + 1) + "/" + curDate.getFullYear();

						if (todayDate == newDate) {
							var sleep = commonFunctions.sleepAnalysisNameForValue(entry.value);
							var DateTimeParam = commonFunctions.getUTCDateTimeFormat(stepD);
							healthKitParams.push({
								"ParamID" : 6,
								"Value" : sleep,
								"DateTime" : DateTimeParam
							});

							sleepValue = commonFunctions.formatDateTime(entry.startDate) + " - " + commonFunctions.formatDateTime(entry.endDate) + " " + commonFunctions.sleepAnalysisNameForValue(entry.value);

						}

					});

				}
				Ti.App.Properties.setString('SleepValue', sleepValue);
				healthArray.push(sleepValue);
				getStepCount(onSuccess);
				function onSuccess(e) {
					successCallBack();
				}

			}
		}));
	} catch(ex) {

		commonFunctions.handleException("healthdatas", "getSleepAnalysis", ex);
	}
}

function getStepCount(successCallBack) {
	try {

		var stepCount = 0;
		var stepArray = [];
		var stepValue;

		var query = TiHealthkit.createSampleQuery({
			type : TiHealthkit.OBJECT_TYPE_STEP_COUNT,
			filter : filter,
			onCompletion : function(e) {
				Ti.API.info('stepCount count', JSON.stringify(e));
				if (e.results.length > 0) {

					e.results.forEach(function(steps) {
						var stepD = new Date(steps.startDate);
						var newDate = stepD.getDate() + "/" + parseInt(stepD.getMonth() + 1) + "/" + stepD.getFullYear();
						//Ti.API.info('stepCount date', stepD);
						var curDate = new Date();
						var todayDate = curDate.getDate() + "/" + parseInt(curDate.getMonth() + 1) + "/" + curDate.getFullYear();
						//Ti.API.info('array steps', steps.quantity.valueForUnit(TiHealthkit.createUnit('count')));
						if (todayDate == newDate) {
							var step = steps.quantity.valueForUnit(TiHealthkit.createUnit('count'));
							var DateTimeParam = commonFunctions.getUTCDateTimeFormat(stepD);
							healthKitParams.push({
								"ParamID" : 7,
								"Value" : step,
								"DateTime" : DateTimeParam
							});
							stepCount = stepCount + steps.quantity.valueForUnit(TiHealthkit.createUnit('count'));
							Ti.App.Properties.setString('StepValue', stepCount);
							Ti.API.info('stepCount', stepCount);
						}

					});

				}

				var temp = stepCount + " Steps";
				Ti.App.Properties.setString('StepValue', temp);
				healthArray.push(temp);
				getFlightsClimbed(onSuccess);
				function onSuccess(e) {
					successCallBack();
				}

			}
		});
		setTimeout(function() {
			TiHealthkit.executeQuery(query);
		}, 100);

	} catch(ex) {

		commonFunctions.handleException("healthdatas", "getStepCount", ex);
	}
}

function getFlightsClimbed(successCallBack) {
	try {

		var climbCount = 0;
		var flightArray = [];
		var query = TiHealthkit.createSampleQuery({
			type : TiHealthkit.OBJECT_TYPE_FLIGHTS_CLIMBED,
			filter : filter,
			onCompletion : function(e) {

				if (e.results.length > 0) {
					e.results.forEach(function(flightsClimbed) {

						var climbD = new Date(flightsClimbed.startDate);
						var newDate = climbD.getDate() + "/" + parseInt(climbD.getMonth() + 1) + "/" + climbD.getFullYear();
						var curDate = new Date();
						var todayDate = curDate.getDate() + "/" + parseInt(curDate.getMonth() + 1) + "/" + curDate.getFullYear();

						if (todayDate == newDate) {
							var flights = flightsClimbed.quantity.valueForUnit(TiHealthkit.createUnit('count'));
							var DateTimeParam = commonFunctions.getUTCDateTimeFormat(climbD);
							healthKitParams.push({
								"ParamID" : 8,
								"Value" : flights,
								"DateTime" : DateTimeParam
							});
							climbCount = climbCount + flightsClimbed.quantity.valueForUnit(TiHealthkit.createUnit('count'));

						}

					});

				}
				var temp = climbCount + " Steps";
				healthArray.push(temp);
				healthArray.push("");
				healthArray.push("");
				//Ti.API.info("healthKitParams", JSON.stringify(healthKitParams));
				successCallBack(healthArray, healthKitParams);

			}
		});
		setTimeout(function() {
			TiHealthkit.executeQuery(query);
		}, 100);

	} catch(ex) {

		commonFunctions.handleException("healthdatas", "getFlightsClimbed", ex);
	}
}