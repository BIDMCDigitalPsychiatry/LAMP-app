migration.up = function(db) {
	db.createTable({
		columns : {
			'ID' : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			"userID" : "integer",
			"groupID" : "integer",
			"questionID" : "integer",
			"answer" : "text",
			"question" : "text",
			
		}
	});

};

migration.down = function(db) {
	db.dropTable("SurveyResult");
};
