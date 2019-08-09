migration.up = function(db) {
	db.createTable({
		columns : {
			'ID' : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			"userID" : "integer",
			"userSettingID":"integer",
			"appColor" : "text",
			"sympSurveySlotID" : "integer",
			"sympSurveySlotTime" : "text",
			"sympSurveyRepeatID" : "integer",
			"cognTestSlotID" : "integer",
			"cognTestSlotTime" : "text",
			"cognTestRepeatID" : "integer",
			"contactNo" : "text",
			"personalHelpline" : "text",
			"protocol" : "integer",
		}
	});
};

migration.down = function(db) {
	db.dropTable("Settings");
};
