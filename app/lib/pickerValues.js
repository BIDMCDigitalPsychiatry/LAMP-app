var commonFunctions = require('commonFunctions');
exports.getWeeks = function(LangCode) {
	try {
		return [{
			value : 1,
			title : commonFunctions.L('weekLbl', LangCode)
		}, {
			value : 2,
			title : commonFunctions.L('sundayLbl', LangCode)
		}, {
			value : 3,
			title : commonFunctions.L('monLbl', LangCode)
		}, {
			value : 4,
			title : commonFunctions.L('tueLbl', LangCode)
		}, {
			value : 5,
			title : commonFunctions.L('wedLbl', LangCode)
		}, {
			value : 6,
			title : commonFunctions.L('thuLbl', LangCode)
		}, {
			value : 7,
			title : commonFunctions.L('friLbl', LangCode)
		}, {
			value : 8,
			title : commonFunctions.L('satLbl', LangCode)
		}];

	} catch(e) {

		throw (e);
	}
};
exports.getMonths = function(LangCode) {
	try {
		return [{
			value : 1,
			title : commonFunctions.L('mnthLbl', LangCode)
		}, {
			value : 2,
			title : commonFunctions.L('janLbl', LangCode)
		}, {
			value : 3,
			title : commonFunctions.L('febLbl', LangCode)
		}, {
			value : 4,
			title : commonFunctions.L('marLbl', LangCode)
		}, {
			value : 5,
			title : commonFunctions.L('aprLbl', LangCode)
		}, {
			value : 6,
			title : commonFunctions.L('mayLbl', LangCode)
		}, {
			value : 7,
			title : commonFunctions.L('junLbl', LangCode)
		}, {
			value : 8,
			title : commonFunctions.L('julLbl', LangCode)
		}, {
			value : 9,
			title : commonFunctions.L('augLbl', LangCode)
		}, {
			value : 10,
			title : commonFunctions.L('sepLbl', LangCode)
		}, {
			value : 11,
			title : commonFunctions.L('octLbl', LangCode)
		}, {
			value : 12,
			title : commonFunctions.L('novLbl', LangCode)
		}, {
			value : 13,
			title : commonFunctions.L('decLbl', LangCode)
		}];

	} catch(e) {

		throw (e);
	}
};

exports.getDay = function(LangCode) {
	try {
		var tempArr = [];
		tempArr.push({
			value : 1,
			title : commonFunctions.L('dayLbl', LangCode)
		});
		for (var i = 1; i < 32; i++) {
			tempArr.push({
				value : i + 1,
				title : i
			});

		};
		return tempArr;

	} catch(e) {

		throw (e);
	}
};
exports.getYear = function(LangCode) {
	try {
		var tempArr = [];
		var incValue = 1;
		tempArr.push({
			value : incValue,
			title : commonFunctions.L('yearLbl', LangCode)
		});
		for (var i = 1900; i < 2026; i++) {
			tempArr.push({
				value : incValue + 1,
				title : i
			});
			incValue += 1;

		};
		return tempArr;

	} catch(e) {

		throw (e);
	}
};
