migration.up = function(migrator) {
	migrator.db.execute('ALTER TABLE ' + migrator.table + ' ADD COLUMN batchID TEXT;');
};

migration.down = function(migrator) {
	var db = migrator.db;
	var table = migrator.table;
	db.execute('CREATE TEMPORARY TABLE AdminShedule_backup(userID,scheduleID,testID,testName,versionNumber,startDate,startTime,repeateID,isSurvey)');
	db.execute('INSERT INTO AdminShedule_backup SELECT userID,scheduleID,testID,testName,versionNumber,startDate,startTime,repeateID,isSurvey FROM ' + table + ';');
	migrator.dropTable();
	migrator.createTable({
		columns : {
			'ID' : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			"userID" : "integer",
			"scheduleID" : "integer",
			"testID" : "integer",
			"testName" : "text",
			"versionNumber" : "integer",
			"startDate" : "text",
			"startTime" : "text",
			"repeateID" : "integer",
			"isSurvey" : "integer",
		}
	});
	db.execute('INSERT INTO ' + table + ' SELECT userID,scheduleID,testID,testName,versionNumber,startDate,startTime,repeateID,isSurvey FROM AdminShedule_backup;');
	db.execute('DROP TABLE AdminShedule_backup;');
};
