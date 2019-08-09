var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');

function addOutputLine(str) {
	$.textArea.value = $.textArea.value + '\n' + str;
}

var text;

text = 'Biological sex: ';
switch (TiHealthkit.userBiologicalSex) {
	case TiHealthkit.SEX_NOT_SET:
		text += 'not set';
		break;	
	case TiHealthkit.SEX_FEMALE:
		text += 'female';
		break;	
	case TiHealthkit.SEX_MALE:
		text += 'male';
		break;	
	case TiHealthkit.SEX_OTHER:
		text += 'other';
		break;	
}
addOutputLine(text);

text = 'Blood type: ';
switch (TiHealthkit.userBloodType) {
	case TiHealthkit.BLOOD_TYPE_NOT_SET:
		text += 'not set';
		break;	
	case TiHealthkit.BLOOD_TYPE_APOSITIVE:
		text += 'A+';
		break;	
	case TiHealthkit.BLOOD_TYPE_ANEGATIVE:
		text += 'A-';
		break;	
	case TiHealthkit.BLOOD_TYPE_BPOSITIVE:
		text += 'B+';
		break;	
	case TiHealthkit.BLOOD_TYPE_BNEGATIVE:
		text += 'B-';
		break;	
	case TiHealthkit.BLOOD_TYPE_ABPOSITIVE:
		text += 'AB+';
		break;	
	case TiHealthkit.BLOOD_TYPE_ABNEGATIVE:
		text += 'AB-';
		break;	
	case TiHealthkit.BLOOD_TYPE_OPOSITIVE:
		text += 'O+';
		break;	
	case TiHealthkit.BLOOD_TYPE_ONEGATIVE:
		text += 'O-';
		break;	
}
addOutputLine(text);

addOutputLine('Date of Birth: ' + TiHealthkit.userDateOfBirth);
