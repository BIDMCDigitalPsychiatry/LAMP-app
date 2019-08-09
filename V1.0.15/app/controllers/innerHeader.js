/***
 * Declarations
 */
{
	var args = arguments[0] || {};
	var commonFunctions = require('commonFunctions');
	var LangCode = Ti.App.Properties.getString('languageCode');
}

init();

/**
 * Inititalize controls
 */
function init() {
	try {
		$.titleLabel.text = args.title;
		var quitLabel = commonFunctions.L('exitLbl', LangCode);

		if (LangCode == "dut") {
			$.quitLabel.text = commonFunctions.trimText(quitLabel, 4);
		} else {
			$.quitLabel.text = quitLabel;
		}

		if (args.rightButtonImage != null && args.rightButtonImage != undefined) {
			$.rightImage.image = args.rightButtonImage;
			$.rightView.visible = true;
		}
		if (args.addButtonImage != null && args.addButtonImage != undefined) {
			$.addImage.image = args.addButtonImage;
			$.addView.visible = true;
		}
		if (args.homeButtonImage != null && args.homeButtonImage != undefined) {
			$.backImage.image = args.homeButtonImage;
			$.backImage.visible = true;
		}
		if (args.reportButtonImage != null && args.reportButtonImage != undefined) {
			$.reportImage.image = args.reportButtonImage;
			$.reportView.visible = true;
		}
		if (args.statusText != null && args.statusText != undefined && args.statusText.length > 0) {
			$.statusLabel.text = args.statusText;
			$.statusLabel.visible = true;
			$.statusLabel.height = "50%";
			$.titleLabel.top = "0dp";
			$.titleLabel.height = "50%";
			$.statusLabel.bottom = "0dp";
		} else {
			$.statusLabel.height = "0dp";
			$.statusLabel.visible = false;
			$.titleLabel.height = Ti.UI.SIZE;
		}
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerView.height = "80dp";

			}

		}

	} catch(e) {

		commonFunctions.handleException("innerHeader", "init", e);
	}
}

/**
 * Trigger onBackClick click event
 */
function onBackClick() {
	$.trigger("backButtonClick");
}

/**
 * Trigger onRightClick click event
 */
function onRightClick() {
	$.trigger("rightButtonClick");
}

/**
 * Trigger onReportClick click event
 */
function onReportClick() {

	$.trigger("reportButtonClick");
}

function onQuitClick() {
	$.trigger("quitButtonClick");
}

/**
 * Trigger onRightClick click event
 */
function onAddClick() {
	$.trigger("addButtonClick");
}

/**
 * Set Header Title
 * @param {Object} title
 */
exports.setHeaderColor = function(color) {
	$.headerView.backgroundColor = color;
	$.headerOuterView.backgroundColor = color;
};
/**
 * Set Header Title
 * @param {Object} title
 */
exports.setTitle = function(title) {
	$.titleLabel.text = title;
};
exports.setRightImage = function(rightImage) {
	$.rightImage.image = rightImage;
	$.rightView.visible = true;
};
/**
 * Set Right View Visibility
 */
exports.setRightViewVisibility = function(isVisible) {
	$.rightView.visible = isVisible;
	$.rightView.touchEnabled = isVisible;
};

/**
 * Set Report View Visibility
 */
exports.setReportViewVisibility = function(isVisible) {

};
exports.setReportImage = function(reportImage) {

};
/**
 * Set Right View Visibility
 */
exports.setLeftViewVisibility = function(isVisible) {
	$.backView.visible = isVisible;
	$.backView.touchEnabled = isVisible;
};
exports.setQuitViewVisibility = function(isVisible) {
	$.quitView.visible = isVisible;
	$.quitView.touchEnabled = isVisible;
};
exports.setQuitViewPosition = function() {
	$.rightView.right = '50dp';
	$.rightView.width = "50dp";
	$.rightView.visible = false;
	$.rightView.touchEnabled = false;
	$.quitView.visible = true;
	$.quitView.touchEnabled = true;
};

exports.quitViewPositionAndroidPhone = function() {
	$.rightView.right = '50dp';
	$.rightView.width = "50dp";
	$.rightView.visible = false;
	$.rightView.touchEnabled = false;
	$.quitView.visible = true;
	$.quitView.touchEnabled = true;
	$.quitView.bottom = "10dp";
};

exports.setNewQuitViewPosition = function() {
	$.rightView.right = '50dp';
	$.rightView.width = "30dp";
	$.quitView.visible = true;
	$.quitView.touchEnabled = true;
	$.rightView.visible = true;
	$.rightView.touchEnabled = true;
};

exports.setRightViewPosition = function() {
	$.rightView.right = '0dp';
	$.rightView.width = "50dp";
	$.quitView.visible = false;
	$.quitView.touchEnabled = false;
	$.rightView.visible = true;
	$.rightView.touchEnabled = true;
};
/**
 * Set User Status
 * @param {Object} status
 */
exports.setStatus = function(status) {
	try {
		if (status != null && status != undefined && status.length > 0) {
			$.statusLabel.text = status;
			$.statusLabel.visible = true;
			$.statusLabel.height = "50%";
			$.titleLabel.top = "5dp";
			$.titleLabel.height = "50%";
			$.statusLabel.bottom = "0dp";
		} else {
			$.statusLabel.height = "0dp";
			$.statusLabel.visible = false;
			$.titleLabel.height = Ti.UI.SIZE;
		}
	} catch(e) {
		commonFunctions.handleException("innerHeader", "setStatus", e);
	}
};

/**
 * Show user status
 * @param {Object} status
 */
exports.showStatus = function(status) {
	try {
		if (status == true) {
			var dndOffDutyStatus = commonFunctions.getDndOffduty();

			if (dndOffDutyStatus.length > 0) {
				$.dndView.visible = true;
				$.dndView.height = '37dp';
				$.dndLabel.text = dndOffDutyStatus;
			} else {
				$.dndView.visible = false;
				$.dndView.height = "0dp";
			}
		} else {
			$.dndView.visible = false;
			$.dndView.height = "0dp";
		}
	} catch(e) {
		commonFunctions.handleException("innerHeader", "showStatus", e);
	}
};

