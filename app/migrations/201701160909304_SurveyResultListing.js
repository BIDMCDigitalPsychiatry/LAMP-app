migration.up = function(db) {
	db.createTable({
		columns : {
			'ID' : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			"userID" : "integer",
			"groupID" : "integer",
			"surveyID" : "integer",
			"suveryTime" : "text",
			"surveyName" : "text",
		}
	});
};

migration.down = function(db) {
	db.dropTable("SurveyResultListing");
};
