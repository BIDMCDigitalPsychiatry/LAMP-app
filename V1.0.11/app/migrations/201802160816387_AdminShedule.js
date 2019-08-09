migration.up = function(db) {
	db.createTable({
		columns : {
			'ID' : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			"userID" : "integer",
			"scheduleID" : "integer",
			"testID" : "integer",
			"testName" : "text",
			"versionNumber" : "integer",
			"startDate" : "text",
			"startTime" : "text",
			"repeateID" : "integer",
			"isSurvey" : "integer"

		}
	});
};

migration.down = function(db) {
	db.dropTable("AdminShedule");
};
