// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
/**
 * Declarations
 */
var args = $.args;
if (OS_IOS) {
	if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
		$.footerView.height = "82dp";
	}

}

/**
 * Learn tab click handler
 */
function clickLearn() {
	$.trigger("clickLearn");
}

/**
 * Assess tab click handler
 */
function clickAssess() {
	$.trigger("clickAssess");
}

/**
 * Manage tab click handler
 */
function clickManage() {
	$.trigger("clickManage");
}

/**
 * Prevent tab click handler
 */
function clickPrevent() {
	$.trigger("clickPrevent");
}

/**
 * Setting label on tab switching
 */
exports.setSelectedLabel = function(index) {
	$.view1.backgroundColor = "transparent";
	$.label1.color = "#90a4ae";
	$.view2.backgroundColor = "transparent";
	$.label2.color = "#90a4ae";
	$.view3.backgroundColor = "transparent";
	$.label3.color = "#90a4ae";
	$.view4.backgroundColor = "transparent";
	$.label4.color = "#90a4ae";
	if (index == 1) {
		$.view1.backgroundColor = Alloy.Globals.HEADER_COLOR;
		$.label1.color = "#ffffff";
	} else if (index == 2) {
		$.view2.backgroundColor = Alloy.Globals.HEADER_COLOR;
		$.label2.color = "#ffffff";

	} else if (index == 3) {
		$.view3.backgroundColor = Alloy.Globals.HEADER_COLOR;
		$.label3.color = "#ffffff";

	} else if (index == 4) {
		$.view4.backgroundColor = Alloy.Globals.HEADER_COLOR;
		$.label4.color = "#ffffff";

	}

};

/**
 * Function to handle notification view
 */
exports.setInfoIndicatorON = function() {
	$.notificationview.visible = true;

};

/**
 * Function to handle notification view
 */
exports.setInfoIndicatorOFF = function() {
	$.notificationview.visible = false;

};
