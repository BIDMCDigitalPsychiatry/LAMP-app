migration.up = function(db) {
	db.createTable({
		columns : {
			'ID' : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			"BlogTitle" : "text",
			"Content" : "text",
			"ImageURL" : "text",
			"MainContent" : "text",
		}
	});
};

migration.down = function(db) {
	db.dropTable("Articles");
};
