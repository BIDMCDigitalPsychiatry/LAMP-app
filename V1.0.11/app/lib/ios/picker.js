var commonFunctions = require('commonFunctions');

var Picker = function Picker(picker_data, defaultVal, title, pickerType, selected) {
	var LangCode = Ti.App.Properties.getString('languageCode');
	Ti.API.info('selected', selected);
	var selectMinDate = new Date();
	var selectMaxDate = new Date();
	Ti.API.info('Eveng  : ',commonFunctions.L('eveningLbl', LangCode));
	if (selected === commonFunctions.L('morningLbl', LangCode)) {
		Ti.API.info('SetHours Morning');
		selectMinDate.setHours(0, 0, 0, 0);
		selectMaxDate.setHours(11, 59, 0, 0);
	} else if (selected === commonFunctions.L('noonLbl', LangCode)) {
		Ti.API.info('SetHours Afternnon');
		selectMinDate.setHours(12, 0, 0, 0);
		selectMaxDate.setHours(16, 59, 0, 0);
	} else if (selected === commonFunctions.L('eveningLbl', LangCode)) {
		Ti.API.info('SetHours Eveng');
		selectMinDate.setHours(17, 0, 0, 0);
		selectMaxDate.setHours(23, 59, 0, 0);
	}
	var self = this;
	var code = "";
	this.pickerType = pickerType;
	this.defaultVal = defaultVal;
	this.eventListeners = [];
	this.firstOpen = true;
	this.picker_outerview = Ti.UI.createView({
		layout : 'vertical',
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		backgroundColor : Alloy.Globals.HEADER_COLOR,
		opacity : "0.4",
		zIndex : 300
	});

	this.picker_view = Ti.UI.createView({
		layout : 'vertical',
		height : 300,
		zIndex : 400,
		backgroundColor : Alloy.Globals.HEADER_COLOR
	});

	var cancel = Titanium.UI.createView({
		height : 25,
		width : 70,
		left : "5dp"
	});
	var canceImg = Titanium.UI.createImageView({
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		left : "5dp",
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
		right : "5dp",
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
		height : 50,
		width : Ti.UI.FILL,
		backgroundColor : Alloy.Globals.HEADER_COLOR
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
			useSpinner : true,
			selectionIndicator : true,
			type : Ti.UI.PICKER_TYPE_DATE,
			minDate : new Date(),
			maxDate : new Date(parseInt(currentDate.getFullYear()) + 10, 1, 1),
			value : defaultVal
		});
		break;
	case "time":
		this.picker = Titanium.UI.createPicker({
			useSpinner : true,
			selectionIndicator : true,
			type : Ti.UI.PICKER_TYPE_TIME,
			value : defaultVal,
			minDate : selectMinDate,
			maxDate : selectMaxDate
		});
		break;
	case "datetime":
		this.picker = Titanium.UI.createPicker({
			useSpinner : true,
			selectionIndicator : true,
			type : Ti.UI.PICKER_TYPE_DATE_AND_TIME,
			minDate : new Date(),
			maxDate : new Date(parseInt(currentDate.getFullYear()) + 10, 1, 1),
			value : defaultVal
		});
		break;
	default:
		this.picker = Titanium.UI.createPicker({
			useSpinner : true,
			selectionIndicator : true,
			type : Ti.UI.PICKER_TYPE_PLAIN,
			//value : defaultVal
		});
		break;
	}

	self.selectedValue = this.picker.value;

	this.picker.addEventListener('change', function(e) {
		switch(pickerType) {
		case "date":
			self.selectedText = e.value;
			self.selectedValue = e.value;
			break;
		case "time":
			self.selectedText = e.value;
			self.selectedValue = e.value;
			break;
		case "datetime":
			self.selectedText = e.value;
			self.selectedValue = e.value;
			break;
		default:
			Ti.API.info('row is', e.row.code);
			self.selectedText = e.row.value;
			self.selectedValue = e.rowIndex;
			if (e.row.code != null || e.row.code != "") {
				self.selectedLanguageCode = e.row.code;
			}

			break;
		}
		self.fireEvent("change");

	});

	if (picker_data !== null) {

		var column1 = Ti.UI.createPickerColumn();

		for (var i = 0,
		    ilen = picker_data.length; i < ilen; i++) {
			var title = picker_data[i].title;
			if (picker_data[i].code != null) {
				code = picker_data[i].code;
			}

			var row = Ti.UI.createPickerRow({
				value : title,
				code : code
				//back
			});
			var label = Ti.UI.createLabel({
				text : title,
				font : Alloy.Globals.MediumLightSFont,
				color : '#06253a',
				width : Ti.UI.SIZE,
				textAlign : 'center',
				height : '40dp',
				backgroundColor : "transparent",
			});
			row.add(label);
			//row.addEventListener("click", function(e)
			//{
			//	self.fireEvent("rowClick");
			//});
			column1.addRow(row);
		}

		this.picker.add(column1);

	}
};

/**
 * Muestra el picker
 */
Picker.prototype.selectedText = "";
Picker.prototype.selectedValue = "";
Picker.prototype.selectedLanguageCode = "";
Picker.prototype.show = function() {
	var self = this;
	self.selectedText = "";
	self.selectedValue = this.picker.value;

	var slide_in = Titanium.UI.createAnimation({
		bottom : -40
	});
	this.picker_view.animate(slide_in);

	this.picker_outerview.width = Ti.UI.FILL;
	this.picker_outerview.height = Ti.UI.FILL;

	this.picker_view.remove(this.picker);
	//this.picker.add(picker_data);
	this.picker_view.add(this.picker);

	if (self.pickerType != "date" && self.pickerType != "time" && self.pickerType != "datetime") {
		this.picker.setSelectedRow(0, this.defaultVal, false);

	}

};

Picker.prototype.hide = function() {

	var slide_out = Titanium.UI.createAnimation({
		bottom : -351
	});
	this.picker_view.animate(slide_out);
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

	this.picker_view.bottom = -351;

};

Picker.prototype.fireEvent = function(eventName) {

	if (!this.firstOpen) {
		for (var i = 0; i < this.eventListeners.length; i++) {
			var eventListener = this.eventListeners[i];
			if (eventListener['eventName'] == eventName) {
				eventListener['handler'].call();
			}

		}
	}
	this.firstOpen = false;

};
Picker.prototype.setSelectedRow = function(indexRow) {
	this.picker.setSelectedRow(0, indexRow);
};

module.exports = Picker;
