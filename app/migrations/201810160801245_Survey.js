migration.up = function(migrator) {
	migrator.db.execute('ALTER TABLE ' + migrator.table + ' ADD COLUMN language TEXT;');

};

migration.down = function(db) {

};
