// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = $.args;
if (OS_IOS) {
	if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
		$.footerView.height = "88dp";
		$.label1.bottom = "13dp";
		$.label2.bottom = "13dp";
		$.label3.bottom = "13dp";
		$.label4.bottom = "13dp";

	}

}

function clickLearn() {
	$.imgLearn.image = "/images/common/learn_active.png";
	$.trigger("clickLearn");
}

function clickAssess() {
	$.imgAssess.image = "/images/common/assess_active.png";
	$.imgLearn.image = "/images/common/learn.png";
	$.imgManage.image = "/images/common/manage.png";
	$.imgPrevent.image = "/images/common/prevent.png";
	$.trigger("clickAssess");
}

function clickManage() {
	$.imgManage.image = "/images/common/manage_active.png";
	$.trigger("clickManage");
}

function clickPrevent() {
	$.imgPrevent.image = "/images/common/prevent_active.png";
	$.trigger("clickPrevent");
}

exports.setSelectedLabel = function(index) {
	$.imgLearn.image = "/images/common/learn.png";
	$.imgAssess.image = "/images/common/assess.png";
	$.imgManage.image = "/images/common/manage.png";
	$.imgPrevent.image = "/images/common/prevent.png";

	if (index == 1) {
		$.label1.color = "#359FFE";
		$.imgLearn.image = "/images/common/learn_active.png";

	} else if (index == 2) {
		$.label2.color = "#359FFE";
		$.imgAssess.image = "/images/common/assess_active.png";

	} else if (index == 3) {
		$.label3.color = "#359FFE";
		$.imgManage.image = "/images/common/manage_active.png";
	} else if (index == 4) {

		$.label4.color = "#359FFE";
		$.imgPrevent.image = "/images/common/prevent_active.png";
	}

};
exports.setInfoIndicatorON = function() {
	$.notificationview.visible = true;

};
exports.setInfoIndicatorOFF = function() {
	$.notificationview.visible = false;

};
