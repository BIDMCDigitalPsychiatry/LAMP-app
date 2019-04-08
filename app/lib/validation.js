exports.isRequired = function(value) {
	return (value !== null && value !== '');
};
exports.minLength = function(value, length) {
	return (value.length >= parseInt(length, 10));
};
exports.maxLength = function(value, length) {
	return (value.length <= parseInt(length, 10));
};
exports.exactLength = function(value, length) {	
	return (value.length === parseInt(length, 10));
};
exports.isValidEmail = function(value) {	
	var emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	return (emailRegex.test(value));
};
exports.isAlphaNumeric = function(value) {
	var alphaNumericRegex  = /^[a-z0-9]+$/i;
	return (alphaNumericRegex.test(value));
};
exports.isAlphaNumericWithSpace = function(value) {
	var alphaNumericRegex  = /^[a-zA-Z].*$/; 
	return (alphaNumericRegex.test(value));
	
};
exports.isNumeric = function(value) {	
	var numericRegex = /^[0-9]+$/;
	return (numericRegex.test(value));
};
exports.isValidPassword = function(value) {
	
	var regularExpression = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[_\W])[a-zA-Z0-9_\W]{6,20}$/;
	return (regularExpression.test(value));
};
exports.isValidPhone = function(value) {
	
	var regularExpression = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
	return (regularExpression.test(value));
};