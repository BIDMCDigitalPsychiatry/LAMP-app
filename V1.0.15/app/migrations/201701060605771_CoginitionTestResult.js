migration.up = function(db) {
	db.createTable({
		columns : {
			'ID' : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			"userID" : "integer",
			"gameID" : "integer",
			"score" : "integer",
			"points" : "integer"
		}
	});

};

migration.down = function(db) {
	db.dropTable("CoginitionTestResult");
};
