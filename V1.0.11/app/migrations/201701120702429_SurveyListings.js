migration.up = function(db) {
	db.createTable({
		columns : {
			'ID' : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			"userId" : "integer",
			"surveyId" : "integer",
			"surveyName" : "text"
		}
	});
};

migration.down = function(db) {
	db.dropTable("SurveyListings");
};
