var TiHealthkit = require('ti.healthkit');

function log(text) {
	Ti.API.info(text);
}
exports.log = log;

function pad (number, places) {
	var result = number.toString();
	
	if (places === undefined) {
		places =2;
	}
	
	while (result.length < places) {
		result = '0' + result;
		}
		return result;
}
exports.pad = pad;
	
function formatDate(date) {
	return pad(date.getMonth() + 1) + '/' + pad(date.getDate());
}
exports.formatDate = formatDate;

function formatDateTime(date) {
	return pad(date.getMonth() + 1) + '/' + pad(date.getDate()) 
			+ ' ' 
			+ pad(date.getHours()) + ':' + pad(date.getMinutes());
}
exports.formatDateTime = formatDateTime;

function showError(e) {
	alert(e.errorMessage + ' (' + e.errorCode + ')');
}
exports.showError = showError;

function showException(e) {
	log(e);
	alert('Exception: ' + e.toString());
}
exports.showException = showException;

function parseValueWithUnit(str) {
	var regex, match, value, unit;
	
	regex = /([0-9.]+)?( *([a-zA-Z]*))?/;
	match = regex.exec(str);
	
	if (match[1]) {		
		value = parseFloat(match[1], 10);
	}
	
	if (match[3]) {
		try {
			unit = TiHealthkit.createUnit(match[3]);
		}
		catch(e) {
			log('Invalid unit string: ' + match[3]);
		}
	}
	
	return {
		value: value,
		unit: unit
	};
}
exports.parseValueWithUnit = parseValueWithUnit;

var OBJECT_TYPES = [
	{ type: TiHealthkit.OBJECT_TYPE_BODY_MASS_INDEX, name: 'Body Mass Index' },
	{ type: TiHealthkit.OBJECT_TYPE_BODY_FAT_PERCENTAGE, name: 'Body Fat Percentage' },
	{ type: TiHealthkit.OBJECT_TYPE_HEIGHT, name: 'Height' },
	{ type: TiHealthkit.OBJECT_TYPE_BODY_MASS, name: 'Weight' },
	{ type: TiHealthkit.OBJECT_TYPE_LEAN_BODY_MASS, name: 'Lean Body Mass' },
	{ type: TiHealthkit.OBJECT_TYPE_STEP_COUNT, name: 'Step Count' },
	{ type: TiHealthkit.OBJECT_TYPE_DISTANCE_WALKING_RUNNING, name: 'Distance Walking Running' },
	{ type: TiHealthkit.OBJECT_TYPE_DISTANCE_CYCLING, name: 'Distance Cycling' },
	{ type: TiHealthkit.OBJECT_TYPE_BASAL_ENERGY_BURNED, name: 'Basal Energy Burned' },
	{ type: TiHealthkit.OBJECT_TYPE_ACTIVE_ENERGY_BURNED, name: 'Active Energy Burned' },
	{ type: TiHealthkit.OBJECT_TYPE_FLIGHTS_CLIMBED, name: 'Flights Climbed' },
	{ type: TiHealthkit.OBJECT_TYPE_NIKE_FUEL, name: 'Nike Fuel' },
	{ type: TiHealthkit.OBJECT_TYPE_HEART_RATE, name: 'Heart Rate' },
	{ type: TiHealthkit.OBJECT_TYPE_BODY_TEMPERATURE, name: 'Body Temperature' },
	{ type: TiHealthkit.OBJECT_TYPE_BLOOD_PRESSURE_SYSTOLIC, name: 'Blood Pressure Systolic' },
	{ type: TiHealthkit.OBJECT_TYPE_BLOOD_PRESSURE_DIASTOLIC, name: 'Blood Pressure Diastolic' },
	{ type: TiHealthkit.OBJECT_TYPE_RESPIRATORY_RATE, name: 'Respiratory Rate' },
	{ type: TiHealthkit.OBJECT_TYPE_OXYGEN_SATURATION, name: 'Oxygen Saturation' },
	{ type: TiHealthkit.OBJECT_TYPE_PERIPHERAL_PERFUSION_INDEX, name: 'Peripheral Perfusion Index' },
	{ type: TiHealthkit.OBJECT_TYPE_BLOOD_GLUCOSE, name: 'Blood Glucose' },
	{ type: TiHealthkit.OBJECT_TYPE_NUMBER_OF_TIMES_FALLEN, name: 'Number Of Times Fallen' },
	{ type: TiHealthkit.OBJECT_TYPE_ELECTRODERMAL_ACTIVITY, name: 'Electrodermal Activity' },
	{ type: TiHealthkit.OBJECT_TYPE_INHALER_USAGE, name: 'Inhaler Usage' },
	{ type: TiHealthkit.OBJECT_TYPE_BLOOD_ALCOHOL_CONTENT, name: 'Blood Alcohol Content' },
	{ type: TiHealthkit.OBJECT_TYPE_FORCED_VITAL_CAPACITY, name: 'Forced Vital Capacity' },
	{ type: TiHealthkit.OBJECT_TYPE_FORCED_EXPIRATORY_VOLUME1, name: 'Forced Expiratory Volume1' },
	{ type: TiHealthkit.OBJECT_TYPE_PEAK_EXPIRATORY_FLOW_RATE, name: 'Peak Expiratory Flow Rate' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_BIOTIN, name: 'Dietary Biotin' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_CAFFEINE, name: 'Dietary Caffeine' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_CALCIUM, name: 'Dietary Calcium' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_CARBOHYDRATES, name: 'Dietary Carbohydrates' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_CHLORIDE, name: 'Dietary Chloride' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_CHOLESTEROL, name: 'Dietary Cholesterol' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_CHROMIUM, name: 'Dietary Chromium' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_COPPER, name: 'Dietary Copper' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_ENERGY_CONSUMED, name: 'Dietary Energy Consumed' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_FAT_MONOUNSATURATED, name: 'Dietary Fat Monounsaturated' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_FAT_POLYUNSATURATED, name: 'Dietary Fat Polyunsaturated' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_FAT_SATURATED, name: 'Dietary Fat Saturated' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_FAT_TOTAL, name: 'Dietary Fat Total' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_FIBER, name: 'Dietary Fiber' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_FOLATE, name: 'Dietary Folate' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_IODINE, name: 'Dietary Iodine' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_IRON, name: 'Dietary Iron' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_MAGNESIUM, name: 'Dietary Magnesium' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_MANGANESE, name: 'Dietary Manganese' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_MOLYBDENUM, name: 'Dietary Molybdenum' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_NIACIN, name: 'Dietary Niacin' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_PANTOTHENIC_ACID, name: 'Dietary Pantothenic Acid' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_PHOSPHORUS, name: 'Dietary Phosphorus' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_POTASSIUM, name: 'Dietary Potassium' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_PROTEIN, name: 'Dietary Protein' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_RIBOFLAVIN, name: 'Dietary Riboflavin' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_SELENIUM, name: 'Dietary Selenium' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_SODIUM, name: 'Dietary Sodium' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_SUGAR, name: 'Dietary Sugar' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_THIAMIN, name: 'Dietary Thiamin' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_VITAMIN_A, name: 'Dietary Vitamin A' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_VITAMIN_B12, name: 'Dietary Vitamin B12' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_VITAMIN_B6, name: 'Dietary Vitamin B6' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_VITAMIN_C, name: 'Dietary Vitamin C' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_VITAMIN_D, name: 'Dietary Vitamin D' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_VITAMIN_E, name: 'Dietary Vitamin E' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_VITAMIN_K, name: 'Dietary Vitamin K' },
	{ type: TiHealthkit.OBJECT_TYPE_DIETARY_ZINC, name: 'Dietary Zinc' },
	{ type: TiHealthkit.OBJECT_TYPE_SLEEP_ANALYSIS, name: 'Sleep Analysis' },
	{ type: TiHealthkit.OBJECT_TYPE_BIOLOGICAL_SEX, name: 'Biological Sex' },
	{ type: TiHealthkit.OBJECT_TYPE_BLOOD_TYPE, name: 'Blood Type' },
	{ type: TiHealthkit.OBJECT_TYPE_DATE_OF_BIRTH, name: 'Date Of Birth' },
	{ type: TiHealthkit.OBJECT_TYPE_CORRELATION_BLOOD_PRESSURE, name: 'Blood Pressure Correlation' },
	{ type: TiHealthkit.OBJECT_TYPE_CORRELATION_FOOD, name: 'Food Correlation' },
	{ type: TiHealthkit.OBJECT_TYPE_WORKOUT, name: 'Workout' }
];
exports.OBJECT_TYPES = OBJECT_TYPES;

function objectNameForType(objectType) {
	var i;
	
	for (i=0; i < OBJECT_TYPES.length; i++) {
		if (OBJECT_TYPES[i].type === objectType) {
			return OBJECT_TYPES[i].name;
		}
	}

	return 'Unknown Object Type';	
}
exports.objectNameForType = objectNameForType;

var WORKOUT_TYPES = [
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_AMERICAN_FOOTBALL, name: 'American Football' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_ARCHERY, name: 'Archery' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_AUSTRALIAN_FOOTBALL, name: 'Australian Football' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_BADMINTON, name: 'Badminton' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_BASEBALL, name: 'Baseball' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_BASKETBALL, name: 'Basketball' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_BOWLING, name: 'Bowling' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_BOXING, name: 'Boxing' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_CLIMBING, name: 'Climbing' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_CRICKET, name: 'Cricket' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_CROSS_TRAINING, name: 'Cross Training' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_CURLING, name: 'Curling' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_CYCLING, name: 'Cycling' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_DANCE, name: 'Dance' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_DANCE_INSPIRED_TRAINING, name: 'Dance Inspired Training' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_ELLIPTICAL, name: 'Elliptical' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_EQUESTRIAN_SPORTS, name: 'Equestrian Sports' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_FENCING, name: 'Fencing' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_FISHING, name: 'Fishing' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_FUNCTIONAL_STRENGTH_TRAINING, name: 'Functional Strength Training' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_GOLF, name: 'Golf' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_GYMNASTICS, name: 'Gymnastics' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_HANDBALL, name: 'Handball' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_HIKING, name: 'Hiking' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_HOCKEY, name: 'Hockey' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_HUNTING, name: 'Hunting' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_LACROSSE, name: 'Lacrosse' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_MARTIAL_ARTS, name: 'Martial Arts' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_MIND_AND_BODY, name: 'Mind And Body' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_MIXED_METABOLIC_CARDIO_TRAINING, name: 'Mixed Metabolic Cardio Training' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_PADDLE_SPORTS, name: 'Paddle Sports' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_PLAY, name: 'Play' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_PREPARATION_AND_RECOVERY, name: 'Preparation And Recovery' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_RACQUET_BALL, name: 'Racquet Ball' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_ROWING, name: 'Rowing' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_RUGBY, name: 'Rugby' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_RUNNING, name: 'Running' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_SAILING, name: 'Sailing' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_SKATING_SPORTS, name: 'Skating Sports' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_SNOW_SPORTS, name: 'Snow Sports' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_SOCCER, name: 'Soccer' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_SOFTBALL, name: 'Softball' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_SQUASH, name: 'Squash' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_STAIRCLIMBING, name: 'Stairclimbing' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_SURFING_SPORTS, name: 'Surfing Sports' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_SWIMMING, name: 'Swimming' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_TABLE_TENNIS, name: 'Table Tennis' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_TENNIS, name: 'Tennis' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_TRACK_AND_FIELD, name: 'Track And Field' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_TRADITIONAL_STRENGTH_TRAINING, name: 'Traditional Strength Training' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_VOLLEYBALL, name: 'Volleyball' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_WALKING, name: 'Walking' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_WATERFITNESS, name: 'Waterfitness' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_WATERPOLO, name: 'Waterpolo' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_WATERSPORTS, name: 'Watersports' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_WRESTLING, name: 'Wrestling' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_YOGA, name: 'Yoga' },
	{ type: TiHealthkit.WORKOUT_ACTIVITY_TYPE_OTHER, name: 'Other' }
];
exports.WORKOUT_TYPES = WORKOUT_TYPES;

function workoutActivityNameForType(activityType) {
	var i;
	
	for (i=0; i < WORKOUT_TYPES.length; i++) {
		if (WORKOUT_TYPES[i].type === activityType) {
			return WORKOUT_TYPES[i].name;
		}
	}

	return 'Unknown Workout Type';
}
exports.workoutActivityNameForType = workoutActivityNameForType;

function sleepAnalysisNameForValue(value) {
	switch (value) {
		case TiHealthkit.CATEGORY_VALUE_SLEEP_ANALYSIS_IN_BED:
			return 'In Bed';
		case TiHealthkit.CATEGORY_VALUE_SLEEP_ANALYSIS_ASLEEP:
			return 'Asleep';
	}
}
exports.sleepAnalysisNameForValue = sleepAnalysisNameForValue;

function workoutEventToString(event) {
	return (event.type === TiHealthkit.WORKOUT_EVENT_TYPE_PAUSE ?
				'Paused' : 'Resumed') + ' at ' + formatDate(event.date);
}
exports.workoutEventToString = workoutEventToString;

var FILTER_OPERATORS = [
	{ type: TiHealthkit.FILTER_OPERATOR_LESS_THAN, name: '<' },
	{ type: TiHealthkit.FILTER_OPERATOR_LESS_THAN_OR_EQUAL_TO, name: '<=' },
	{ type: TiHealthkit.FILTER_OPERATOR_GREATER_THAN, name: '>' },
	{ type: TiHealthkit.FILTER_OPERATOR_GREATER_THAN_OR_EQUAL_TO, name: '>=' },
	{ type: TiHealthkit.FILTER_OPERATOR_EQUAL_TO, name: '==' },
	{ type: TiHealthkit.FILTER_OPERATOR_NOT_EQUAL_TO, name: '!=' },
	{ type: TiHealthkit.FILTER_OPERATOR_MATCHES, name: 'Matches' },
	{ type: TiHealthkit.FILTER_OPERATOR_LIKE, name: 'Like' },
	{ type: TiHealthkit.FILTER_OPERATOR_BEGINS_WITH, name: 'Begins with' },
	{ type: TiHealthkit.FILTER_OPERATOR_ENDS_WITH, name: 'Ends With' },
	{ type: TiHealthkit.FILTER_OPERATOR_IN, name: 'In' },
	{ type: TiHealthkit.FILTER_OPERATOR_CUSTOM_SELECTOR, name: 'Custom Selector' },
	{ type: TiHealthkit.FILTER_OPERATOR_CONTAINS, name: 'Contains' },
	{ type: TiHealthkit.FILTER_OPERATOR_BETWEEN, name: 'Between' }
];
exports.FILTER_OPERATORS = FILTER_OPERATORS;
