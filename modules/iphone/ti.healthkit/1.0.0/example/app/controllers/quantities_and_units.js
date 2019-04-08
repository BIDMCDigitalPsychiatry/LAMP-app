var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

function addOutputLine(str) {
	$.textArea.value = $.textArea.value + '\n' + str;
}

function onInputChange(e) {
	var A, B, quantityA, quantityB, newUnit;
	
	A = Utils.parseValueWithUnit($.quantityAInput.value);
	B = Utils.parseValueWithUnit($.quantityBInput.value);
	
	$.textArea.value = '';
	
	if (A.unit && B.unit) {
		quantityA = TiHealthkit.createQuantity(A.value, A.unit);
		quantityB = TiHealthkit.createQuantity(B.value, B.unit);
		if (quantityA.isCompatibleWithUnit(B.unit)) {
			addOutputLine('Units are compatible!');
			addOutputLine($.quantityAInput.value + ' = ' + quantityA.valueForUnit(B.unit) + B.unit);
			addOutputLine($.quantityBInput.value + ' = ' + quantityB.valueForUnit(A.unit) + A.unit);
			switch (quantityA.compare(quantityB)) {
				case 0:
					addOutputLine('The two quantities are equal.');
					break;
				case -1:
					addOutputLine('Quantity A is smaller.');
					break;
				case 1:
					addOutputLine('Quantity A is larger.');
					break;
			}
		} else {
			addOutputLine('Units are not compatible!');
		}
		
		newUnit = A.unit.multiplyBy(B.unit);
		addOutputLine('Multiplication: ' + (A.value * B.value) + newUnit);
		
		newUnit = A.unit.divideBy(B.unit);
		if (newUnit.isNull()) {
			addOutputLine('Division results in null unit.');
		} else {
			addOutputLine('Division: ' + (A.value * B.value) + newUnit);
		}
	} else {
		if (A.unit === undefined) {
			addOutputLine('Unit A is missing.');
		} 
		if (B.unit === undefined) {
			addOutputLine('Unit B is missing.');
		} 
	} 
	
	if (A.unit !== undefined) {
		newUnit = A.unit.raisedToPower(2);
		addOutputLine('Unit A raised to power of 2: ' + (A.value * A.value) + newUnit);

		newUnit = A.unit.reciprocal();
		addOutputLine('Unit A reciprocal: ' + (1 / A.value) + ' ' + newUnit);
	}
}
