migration.up = function(db) {
	db.createTable({
		columns : {
			'ID' : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			"userId" : "integer",
			"answerType" : "integer",
			"surveyId" : "integer",
			"questionId" : "integer",
			"questionText" : "text",
			
		}
	});
};

migration.down = function(db) {
	db.dropTable("Survey");
};
