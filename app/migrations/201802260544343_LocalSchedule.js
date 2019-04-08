migration.up = function(db) {
	db.createTable({
		columns : {
			'ID' : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			"userID" : "integer",
			"repeateID" : "integer",
			"isSurvey" : "integer",
			"setDate" : "text",	

		}
	});
};

migration.down = function(db) {
	db.dropTable("LocalSchedule");
};
