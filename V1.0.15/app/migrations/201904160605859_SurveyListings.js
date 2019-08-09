migration.up = function(migrator) {
	try {
		var db = migrator.db;
		var table = migrator.table;
		db.execute('CREATE TEMPORARY TABLE surveyListing_backup(ID,userId,surveyId,surveyName)');
		db.execute('INSERT INTO surveyListing_backup SELECT ID,userId,surveyId,surveyName FROM ' + table + ';');
		migrator.dropTable();
		migrator.createTable({
			columns : {
				'ID' : 'INTEGER PRIMARY KEY AUTOINCREMENT',
				"userId" : "integer",
				"surveyId" : "integer",
				"surveyName" : "text",

			}
		});
		db.execute('INSERT INTO ' + table + ' SELECT ID,userId,surveyId,surveyName FROM surveyListing_backup;');
		db.execute('DROP TABLE surveyListing_backup;');
	} catch(ex) {

	}
	migrator.db.execute('ALTER TABLE ' + migrator.table + ' ADD COLUMN surveyInstruction text;');

};

migration.down = function(migrator) {

};
