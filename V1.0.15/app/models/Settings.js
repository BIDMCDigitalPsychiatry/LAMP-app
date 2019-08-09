exports.definition = {
	config : {
		columns : {
			'ID' : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			"userID" : "integer",
			"userSettingID" : "integer",
			"appColor" : "text",
			"sympSurveySlotID" : "integer",
			"sympSurveySlotTime" : "text",
			"sympSurveyRepeatID" : "integer",
			"cognTestSlotID" : "integer",
			"cognTestSlotTime" : "text",
			"cognTestRepeatID" : "integer",
			"contactNo" : "text",
			"personalHelpline" : "text",
			"protocol" : "integer",
		},
		adapter : {
			"type" : "sql",
			"collection_name" : "Settings",
			"db_name" : "LampDB",
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here

			// For Backbone v1.1.2, uncomment the following to override the
			// fetch method to account for a breaking change in Backbone.
			/*
			 fetch: function(options) {
			 options = options ? _.clone(options) : {};
			 options.reset = true;
			 return Backbone.Collection.prototype.fetch.call(this, options);
			 }
			 */
		});

		return Collection;
	}
};
