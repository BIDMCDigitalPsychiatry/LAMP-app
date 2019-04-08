migration.up = function(migrator) {
migrator.db.execute('ALTER TABLE ' + migrator.table + ' ADD COLUMN createdDate TEXT;');
};

migration.down = function(migrator) {
var db = migrator.db;
	var table = migrator.table;
	db.execute('CREATE TEMPORARY TABLE alert_backup(UserId,alertBody,type,read,testID,testName,version,isLocal)');
	db.execute('INSERT INTO alert_backup SELECT UserId,alertBody,type,read,testID,testName,version,isLocal FROM ' + table + ';');
	migrator.dropTable();
	migrator.createTable({
		columns : {
			'ID' : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			"UserId" : "integer",
			"alertBody" : "text",
			"type" : "text",
			"read" : "integer",
			"testID" : "integer",
			"testName" : "text",
			"version" : "integer",
			"isLocal":"integer"
		}
	});
	db.execute('INSERT INTO ' + table + ' SELECT UserId,alertBody,type,read,testID,testName,version,isLocal FROM alert_backup;');
	db.execute('DROP TABLE alert_backup;');
};
