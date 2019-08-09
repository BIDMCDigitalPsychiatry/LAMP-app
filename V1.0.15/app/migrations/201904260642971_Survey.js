migration.up = function(migrator) {
	try {
		var db = migrator.db;
		var table = migrator.table;
		db.execute('CREATE TEMPORARY TABLE survey_backup(ID,answerType,surveyId,questionId,questionText,language,)');
		db.execute('INSERT INTO survey_backup SELECT ID,answerType,surveyId,questionId,questionText,language FROM ' + table + ';');
		migrator.dropTable();
		migrator.createTable({
			columns : {
				'ID' : 'INTEGER PRIMARY KEY AUTOINCREMENT',
				"answerType" : "integer",
				"surveyId" : "integer",
				"questionId" : "integer",
				"questionText" : "text",
				"language" : "text",

			}
		});
		db.execute('INSERT INTO ' + table + ' SELECT ID,answerType,surveyId,questionId,questionText,language FROM survey_backup;');
		db.execute('DROP TABLE survey_backup;');
	} catch(ex) {

	}
	migrator.db.execute('ALTER TABLE ' + migrator.table + ' ADD COLUMN EnableCustomPopup text;');
	migrator.db.execute('ALTER TABLE ' + migrator.table + ' ADD COLUMN ThresholdId integer;');
	migrator.db.execute('ALTER TABLE ' + migrator.table + ' ADD COLUMN OperatorId text;');
	migrator.db.execute('ALTER TABLE ' + migrator.table + ' ADD COLUMN CustomPopupMessage text;');
};

migration.down = function(migrator) {

};
