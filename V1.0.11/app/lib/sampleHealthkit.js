var commonFunctions = require('commonFunctions');
if (OS_IOS) {
	var TiHealthkit = require('com.zco.healthKitios');
}
var healthArray = [];
var healthKitParams = [];
if (OS_IOS) {
	var startDate = new Date();
	startDate.setHours("00");
	var endDate = new Date();

}

/**
 * Inititaliose health data
 */
exports.getHealthDatas = function(successCallBack) {
	try {
		healthArray = [];
		tempPressureValue = "";
		heartRateObserverQuery = null;
		healthKitParams = [];
		if (OS_IOS) {
			healthKitAuthorization(onSuccessFinal);
			function onSuccessFinal(e) {
				successCallBack(healthArray, healthKitParams);
			}

		}

	} catch(e) {

	}
};

function healthKitAuthorization(successCallBack) {
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
			getValuesFromHealthKit(onSuccess);
			function onSuccess(e) {
				successCallBack();
			}

		} else {
			Ti.API.info('enter error of permission');
		}

	});

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

function getValuesFromHealthKit(successCallBack) {
	try {
		getDatas(onSuccess);
		function onSuccess(e) {
			successCallBack();
		}

	} catch(ex) {

		commonFunctions.handleException("healthdatas", "getValuesFromHealthKit", ex);
	}
}

/**
 * Function to get bloodtype,sex and dob
 */
function getDatas(successCallBack) {
	try {
		var Query = function(quantityType, limit) {
			this.quantityType = quantityType;
			this.limit = limit;
		};
		var query = new Query("HKQuantityTypeIdentifierHeight", 0);
		TiHealthkit.getQuantityResult(query, function(data) {

			if (data.success == 1) {

				Ti.API.info('height values', data.biologicalSex, data.bloodType, data.dateOfBirth);

				var dobValue = "Not set";
				if (data.dateOfBirth != null) {
					var dob = data.dateOfBirth.split(" ");
					if (!data.dateOfBirth) {
						var date = new Date();
					} else {
						var date = new Date(dob[0]);
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

					dobValue = year + "/" + monthCount + "/" + day;
				}

				healthArray.push(dobValue);

				var biologicalSex = "";

				if (data.biologicalSex != null) {

					switch (data.biologicalSex.toString()) {

					case '0':
						biologicalSex = 'Not set';
						break;
					case '1':
						biologicalSex = 'F';
						break;
					case '2':
						biologicalSex = 'M';
						break;
					case '3':
						biologicalSex = 'Other';
						break;
					}
				}
				healthArray.push(biologicalSex);

				var bloodGroup = "";
				var bloodtype = data.bloodType.toString();
				if (data.bloodType != null) {
					switch (bloodtype) {
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
				healthArray.push(bloodGroup);

			} else {
				Ti.API.info('error of getdata values');
			}
			getHeight(onSuccess);
			function onSuccess(e) {
				successCallBack();
			}

		});

	} catch(ex) {
		commonFunctions.handleException("healthdatas", "getdatas", ex);
	}
}

/*
 * To get Height
 */
function getHeight(successCallBack) {
	try {

		var predicate = new datePredicate(startDate, endDate);
		var heightArray = [];
		var heightValue;
		var Query = function(quantityType, limit, predicate) {
			this.quantityType = quantityType;
			this.limit = limit;
			this.predicate = predicate;
		};
		var query = new Query("HKQuantityTypeIdentifierHeight", 0, predicate);
		TiHealthkit.getQuantityResult(query, function(data) {

			if (data.success == 1) {
				if (data.quantities != null) {
					for (var i = 0; i < data.quantities.length; i++) {
						healthKitParams.push({
							"ParamID" : 1,
							"Value" : data.quantities[i].quantity,
							"DateTime" : commonFunctions.getUTCDateTimeFormat(data.quantities[i].startDate)
						});
						healthArray.push(data.quantities[i].quantity);
					};
				}

			} else {
				Ti.API.info('error of height values');
			}
			getWeight(onSuccess);
			function onSuccess(e) {
				successCallBack();
			}

		});

	} catch(ex) {
		commonFunctions.handleException("healthdatas", "getHeight", ex);
	}
};
/**
 *
 * To get Weight
 */

function getWeight(successCallBack) {
	try {
		var predicate = new datePredicate(startDate, endDate);
		var weightArray = [];
		var weightValue;
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
						healthKitParams.push({
							"ParamID" : 2,
							"Value" : data.quantities[i].quantity,
							"DateTime" : commonFunctions.getUTCDateTimeFormat(data.quantities[i].startDate)
						});
						healthArray.push(data.quantities[i].quantity);
					}
				}
			} else {
				Ti.API.info('error of weight values');
			}
			getHeartRate(onSuccess);
			function onSuccess(e) {
				successCallBack();
			}

		});

	} catch(ex) {
		commonFunctions.handleException("healthdatas", "getWeight", ex);
	}
};

/**
 * To get heart rate
 */
function getHeartRate(successCallBack) {
	try {
		var predicate = new datePredicate(startDate, endDate);
		var heartArray = [];
		var heartValue;
		var Query = function(quantityType, limit, predicate) {
			this.quantityType = quantityType;
			this.limit = limit;
			this.predicate = predicate;
		};
		var query = new Query("HKQuantityTypeIdentifierHeartRate", 2, predicate);
		TiHealthkit.getQuantityResult(query, function(data) {
			if (data.success == 1) {
				//Ti.API.info('getHeartRate values are', data.quantities);
				var heartValue = data.quantities;
				if (data.quantities != null) {
					for (var i = 0; i < data.quantities.length; i++) {
						healthKitParams.push({
							"ParamID" : 3,
							"Value" : data.quantities[i].quantity,
							"DateTime" : commonFunctions.getUTCDateTimeFormat(data.quantities[i].startDate)
						});
						healthArray.push(data.quantities[i].quantity);
					}
				}

			} else {
				Ti.API.info('error of heartArray values');
			}

			getSystolicPressure(onSuccess);
			function onSuccess(e) {
				successCallBack();
			}

		});

	} catch(ex) {
		commonFunctions.handleException("healthdatas", "getHeartRate", ex);
	}
};

/**
 * To get getSystolicPressure
 */
function getSystolicPressure(successCallBack) {
	try {
		var predicate = new datePredicate(startDate, endDate);
		var SystolicPressureArray = [];
		var SystolicPressureValue;
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
						healthKitParams.push({
							"ParamID" : 4,
							"Value" : data.quantities[i].quantity,
							"DateTime" : commonFunctions.getUTCDateTimeFormat(data.quantities[i].startDate)
						});
						healthArray.push(data.quantities[i].quantity);
					}
				}

			} else {
				Ti.API.info('error of weight values');
			}

			getDiastolicPressure(onSuccess);
			function onSuccess(e) {
				successCallBack();
			}

		});

	} catch(ex) {
		commonFunctions.handleException("healthdatas", "getWeight", ex);
	}
};

/**
 * To get getDiastolicPressure
 */
function getDiastolicPressure(successCallBack) {
	try {
		var predicate = new datePredicate(startDate, endDate);
		var DiastolicPressureArray = [];
		var DiastolicPressureValue;
		var Query = function(quantityType, limit, predicate) {
			this.quantityType = quantityType;
			this.limit = limit;
			this.predicate = predicate;
		};
		var query = new Query("HKQuantityTypeIdentifierBloodPressureDiastolic", 4, predicate);
		TiHealthkit.getQuantityResult(query, function(data) {
			if (data.success == 1) {
				if (data.quantities != null) {
					for (var i = 0; i < data.quantities.length; i++) {
						healthKitParams.push({
							"ParamID" : 4,
							"Value" : data.quantities[i].quantity,
							"DateTime" : commonFunctions.getUTCDateTimeFormat(data.quantities[i].startDate)
						});
						healthArray.push(data.quantities[i].quantity);
					}
				}

			} else {
				Ti.API.info('error of weight values');
			}

			getRespiratoryRate(onSuccess);
			function onSuccess(e) {
				successCallBack();
			}

		});

	} catch(ex) {

		commonFunctions.handleException("healthdatas", "getDiastolicPressure", ex);
	}
}

/**
 * To get respiratory rate
 */
function getRespiratoryRate(successCallBack) {
	try {
		var predicate = new datePredicate(startDate, endDate);
		var RespiratoryRateArray = [];
		var RespiratoryRateValue;
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
						healthKitParams.push({
							"ParamID" : 5,
							"Value" : data.quantities[i].quantity,
							"DateTime" : commonFunctions.getUTCDateTimeFormat(data.quantities[i].startDate)
						});
						healthArray.push(data.quantities[i].quantity);
					}
				}
			} else {
				Ti.API.info('error of weight values');
			}

			getSleepAnalysis(onSuccess);
			function onSuccess(e) {
				successCallBack();
			}

		});

	} catch(ex) {

		commonFunctions.handleException("healthdatas", "getDiastolicPressure", ex);
	}
}

/**
 * To get respiratory rate
 */
function getSleepAnalysis(successCallBack) {
	try {
		var predicate = new datePredicate(startDate, endDate);
		var sleepArray = [];
		var sleepValue;
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
						Ti.API.info('sleepTime', convertedSleep);
						healthKitParams.push({
							"ParamID" : 6,
							"Value" : convertedSleep,
							"DateTime" : commonFunctions.getUTCDateTimeFormat(data.quantities[i].startDate)
						});
						healthArray.push(convertedSleep);
					}
				}

			} else {
				Ti.API.info('error of weight values');
			}

			successCallBack(healthArray, healthKitParams);

		});

	} catch(ex) {

		commonFunctions.handleException("healthdatas", "getSleepAnalysis", ex);
	}
}

function msToTime(duration) {
	var milliseconds = parseInt((duration % 1000) / 100),
	    seconds = Math.floor((duration / 1000) % 60),
	    minutes = Math.floor((duration / (1000 * 60)) % 60),
	    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;

	Ti.API.info('return time', hours + ":" + minutes + ":" + seconds + "." + milliseconds);

	return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

/**
 * To get respiratory rate
 */
function getStepCount(successCallBack) {
	try {
		var predicate = new datePredicate(startDate, endDate);
		var stepArray = [];
		var stepValue;
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
						healthKitParams.push({
							"ParamID" : 7,
							"Value" : data.quantities[i].quantity,
							"DateTime" : commonFunctions.getUTCDateTimeFormat(data.quantities[i].startDate)
						});
						healthArray.push(data.quantities[i].quantity);
					}
				}

			} else {
				Ti.API.info('error of weight values');
			}

			getFlightsClimbed(onSuccess);
			function onSuccess(e) {
				successCallBack();
			}

		});

	} catch(ex) {

		commonFunctions.handleException("healthdatas", "getDiastolicPressure", ex);
	}
}

/**
 * To get respiratory rate
 */
function getFlightsClimbed(successCallBack) {
	try {
		var predicate = new datePredicate(startDate, endDate);
		var flightArray = [];
		var flightValue;
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
						healthKitParams.push({
							"ParamID" : 8,
							"Value" : data.quantities[i].quantity,
							"DateTime" : commonFunctions.getUTCDateTimeFormat(data.quantities[i].startDate)
						});
						healthArray.push(data.quantities[i].quantity);
					}
				}

			} else {
				Ti.API.info('error of weight values');
			}
			getSleepAnalysis(onSuccess);
			function onSuccess(e) {
				successCallBack();
			}

		});

	} catch(ex) {

		commonFunctions.handleException("healthdatas", "getFlightsClimbed", ex);
	}
}