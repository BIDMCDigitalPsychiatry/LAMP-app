var Picker = function Picker(picker_data, defaultVal, title, pickerType, selected) {
	var LangCode = Ti.App.Properties.getString('languageCode');
	var commonFunctions = require('commonFunctions');
	var selectMinDate = new Date();
	var selectMaxDate = new Date();
	if (selected === commonFunctions.L('morningLbl', LangCode)) {
		selectMinDate.setHours(0, 0, 0, 0);
		selectMaxDate.setHours(11, 59, 0, 0);
	} else if (selected === commonFunctions.L('noonLbl', LangCode)) {
		selectMinDate.setHours(12, 0, 0, 0);
		selectMaxDate.setHours(16, 59, 0, 0);
	} else if (selected === commonFunctions.L('eveningLbl', LangCode)) {
		selectMinDate.setHours(17, 0, 0, 0);
		selectMaxDate.setHours(23, 59, 0, 0);
	}
	var self = this;
	var code = "";
	this.pickerType = pickerType;
	this.defaultVal = defaultVal;
	this.eventListeners = [];
	this.firstOpen = true;
	this.section = null;
	this.picker_outerview = Ti.UI.createView({
		layout : 'vertical',
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		backgroundColor : '#5899CE',
		opacity : "0.7",
		zIndex : 300
	});

	this.picker_view = Ti.UI.createView({
		layout : 'vertical',
		height : Ti.UI.SIZE, //'300dp',
		zIndex : 400,
		backgroundColor : '#E5E5E5',
		bottom : "0dp"
	});

	var cancel = Titanium.UI.createView({
		height : 25,
		width : 70,
		left : "5dp",

	});
	var canceImg = Titanium.UI.createImageView({
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		image : '/images/common/cancel.png'

	});

	cancel.add(canceImg);
	var done = Titanium.UI.createView({
		height : 25,
		width : 70,
		right : "5dp"
	});
	var doneImg = Titanium.UI.createImageView({
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		image : '/images/common/done.png'

	});
	done.add(doneImg);
	done.addEventListener("click", function(e) {
		self.fireEvent("done");
	});

	cancel.addEventListener("click", function(e) {
		self.fireEvent("cancel");
	});

	this.picker_outerview.addEventListener("click", function(e) {
		self.fireEvent("cancel");
	});

	var toolBarView = Ti.UI.createView({
		height : "50dp",
		width : Ti.UI.FILL,
		backgroundColor : Alloy.Globals.HEADER_COLOR,
		//bottom : "1dp"

	});

	var pickerTitle = Ti.UI.createLabel({
		textAlign : "center",
		color : "#fff",
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
		height : '50dp',
		width : Ti.UI.SIZE,
		text : title,
		font : Alloy.Globals.MediumLightSFont
	});

	toolBarView.add(pickerTitle);
	toolBarView.add(cancel);
	toolBarView.add(done);
	var currentDate = new Date();
	this.picker_view.add(toolBarView);
	switch(pickerType) {
	case "date":
		this.picker = Titanium.UI.createPicker({
			//useSpinner : true,
			selectionIndicator : false,
			type : Ti.UI.PICKER_TYPE_DATE,
			minDate : new Date(),
			maxDate : new Date(parseInt(currentDate.getFullYear()) + 10, 1, 1),
			value : defaultVal
		});

		if (OS_ANDROID && parseFloat(Ti.Platform.version) >= 5.0 && parseFloat(Ti.Platform.version) < 5.5) {

			this.picker.width = "100%";
			this.picker.height = 'auto';
			//"200dp";

			this.picker.useSpinner = true;
			var model = Ti.Platform.model;
			if (model.indexOf("Nexus 6") > -1) {
				this.picker.font = {
					fontSize : "75sp"
				};
			} else {
				this.picker.font = {
					fontSize : "70sp"
				};
			}
		}

		break;
	case "time":
		this.picker = Titanium.UI.createPicker({
			//useSpinner : true,
			selectionIndicator : true,
			type : Ti.UI.PICKER_TYPE_TIME,
			value : defaultVal,
			minDate : selectMinDate,
			maxDate : selectMaxDate,
			format24 : true
		});
		break;
	case "datetime":
		this.picker = Titanium.UI.createPicker({
			//useSpinner : true,
			selectionIndicator : true,
			type : Ti.UI.PICKER_TYPE_DATE_AND_TIME,
			value : defaultVal
		});
		break;
	default:

		var plainTemplate = {
			childTemplates : [{
				type : 'Ti.UI.Label', // Use a label
				bindId : 'rowtitle', // Bind ID for this label
				properties : {
					textAlign : "center",
					font : Alloy.Globals.MediumSemiBoldTablet,
					height : '40dp',
					color : '#000',
					width : '100%',
					touchEnabled : false
				}
			}]
		};
		this.picker = Ti.UI.createListView({
			templates : {
				'plain' : plainTemplate
			},
			defaultItemTemplate : 'plain',
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			separatorInsets : {
				left : 0,
				right : 0
			},

		});

		break;
	}

	self.selectedValue = this.picker.value;

	var previousItemIndex = 0;
	if (pickerType == 'plain') {
		this.picker.addEventListener('itemclick', function(e) {
			for (var i = 0; i < picker_data.length; i++) {
				var item = e.section.getItemAt(i);
				item.properties.backgroundColor = "#fff";
				e.section.updateItemAt(i, item);
			}

			var item = e.section.getItemAt(e.itemIndex);
			item.properties.backgroundColor = "#f1f5f7";
			e.section.updateItemAt(e.itemIndex, item);

			self.selectedValue = e.itemIndex;
			self.selectedText = picker_data[e.itemIndex].title;
			self.selectedLanguageCode = picker_data[e.itemIndex].code;
			//if (previousItemIndex != e.itemIndex) {
			self.fireEvent("change");
			//}
		});
	} else {
		this.picker.addEventListener('change', function(e) {
			Ti.API.info('Date changes : ', e.value);
			self.selectedText = e.value;
			self.selectedValue = e.value;
			self.fireEvent(e.value);

		});

	}

	if (picker_data !== null) {

		if (pickerType == 'plain') {
			var data = [];
			for (var i = 0; i < picker_data.length; i++) {
				data.push({
					rowtitle : {
						text : picker_data[i].title
					},

					properties : {
						itemId : 'row' + (i + 1),
						accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_NONE,
						selectedBackgroundColor : "#f1f5f7",
						backgroundColor : "#fff"
					}
				});
			}
			this.section = Ti.UI.createListSection({
				items : data
			});

			if (defaultVal != null) {

				if (defaultVal >= 0) {
					var item = this.section.getItemAt(defaultVal);
					item.properties.backgroundColor = "#f1f5f7";
					this.section.updateItemAt(defaultVal, item);
					previousItemIndex = defaultVal;
					self.selectedValue = defaultVal;
					self.selectedText = picker_data[defaultVal].title;
				}
			}

			this.picker.sections = [this.section];

			if (picker_data.length < 8) {
				this.picker_view.height = Ti.UI.SIZE;
			}

		} else {
			var column1 = Ti.UI.createPickerColumn({
				width : Ti.UI.FILL
			});

			for (var i = 0,
			    ilen = picker_data.length; i < ilen; i++) {
				var title = picker_data[i].title;
				if (picker_data[i].code != null) {
					code = picker_data[i].code;
				}
				var row = Ti.UI.createPickerRow({
					title : title,
					code : code,
					font : Alloy.Globals.MediumLightSFont,
					color : '#06253a',
					width : Ti.UI.SIZE,
					textAlign : 'center',
					height : '40dp',
					backgroundColor : "transparent",
					//back
				});
				/*var label = Ti.UI.createLabel({
				text : title,
				font : Alloy.Globals.MediumLightSFont,
				color : '#06253a',
				width : Ti.UI.SIZE,
				textAlign : 'center',
				height : '40dp',
				backgroundColor : "transparent",

				});
				row.add(label);*/
				//row.addEventListener("click", function(e)
				//{
				//	self.fireEvent("rowClick");
				//});
				column1.addRow(row);
			}

			this.picker.add(column1);
		}

	}

};

/**
 * Muestra el picker
 */
Picker.prototype.selectedText = "";
Picker.prototype.selectedValue = "";
Picker.prototype.show = function() {

	var self = this;
	self.selectedText = "";
	self.selectedValue = this.picker.value;

	//this.picker_view.animate(slide_in);

	this.picker_view.remove(this.picker);
	this.picker_outerview.width = Ti.UI.FILL;
	this.picker_outerview.height = Ti.UI.FILL;
	this.picker_view.add(this.picker);

};

Picker.prototype.hide = function() {
	this.picker_view.height = 0;
	this.picker_outerview.width = 0;
	this.picker_outerview.height = 0;
};

Picker.prototype.addEventListener = function(eventName, handler) {
	this.eventListeners.push({
		'eventName' : eventName,
		'handler' : handler
	});
};

Picker.prototype.addToWindow = function(win) {

	win.add(this.picker_outerview);
	win.add(this.picker_view);

};

Picker.prototype.fireEvent = function(eventName) {
	for (var i = 0; i < this.eventListeners.length; i++) {
		var eventListener = this.eventListeners[i];
		if (eventListener['eventName'] == eventName) {
			eventListener['handler'].call();
		}

	}

};
Picker.prototype.setSelectedRow = function(indexRow) {
	this.picker.setSelectedRow(0, indexRow);
};

module.exports = Picker;
