migration.up = function(db) {
	db.createTable({
		columns : {
			'ID' : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			"userId" : "integer",
			"totalJewel" : "integer",
			"totalBonus" : "integer",
			"totalScore" : "text",
			"type" : "integer",

		}
	});

};

migration.down = function(db) {
	db.dropTable("JewelCollection");
};
