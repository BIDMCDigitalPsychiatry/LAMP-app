migration.up = function(db) {
	db.createTable({
		columns : {
			'ID' : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			"UserId" : "integer",
			"address" : "text",
			"selectedLocation" : "text",
			"environment" : "integer",
			"updateTime" : "text"
			
		}
	});
};

migration.down = function(db) {
	db.dropTable("location");
};
