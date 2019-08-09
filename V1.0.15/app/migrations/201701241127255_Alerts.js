migration.up = function(db) {
	db.createTable({
		columns : {
			'ID' : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			"UserId" : "integer",
			"alertBody" : "text",
			"type" : "text",
			"read" : "integer",
			"testID" : "integer",
			"testName" : "text",
			"version" : "integer"
		}
	});
};

migration.down = function(db) {
	db.dropTable("Alerts");
};
