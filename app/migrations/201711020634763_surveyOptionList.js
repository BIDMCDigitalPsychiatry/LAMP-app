migration.up = function(db) {
	db.createTable({
		columns : {
			'ID' : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			"userId" : "integer",
			"questionId" : "integer",
			"optionText" : "text",

		}
	});
};

migration.down = function(db) {
	db.dropTable("surveyOptionList");
};
