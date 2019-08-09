// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = $.args;
var commonFunctions = require('commonFunctions');
var commonPassword = "3579";

/**
 * Function for window open
 */
$.passwordScreen.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.outerScrollView.bottom = "15dp";
			}
		}
		$.pass4.returnKeyType = Titanium.UI.RETURNKEY_DONE;

	} catch(ex) {
		commonFunctions.handleException("passwordScreen", "open", ex);
	}
});
function windowClick(e) {
	try {

		if (e.source.id != "passbox1" && e.source.id != "passbox2" && e.source.id != "passbox3" && e.source.id != "passbox4") {
			$.pass1.blur();
			$.pass2.blur();
			$.pass3.blur();
			$.pass4.blur();
		}

	} catch(ex) {
		commonFunctions.handleException("passwordScreen", "windowClick", ex);
	}

}

function onSendClick() {
	try {
		$.pass1.blur();
		$.pass2.blur();
		$.pass3.blur();
		$.pass4.blur();
		var passwordEnter = $.pass1.value + $.pass2.value + $.pass3.value + $.pass4.value;
		if (passwordEnter == commonPassword) {
			Ti.App.Properties.setString('alreadyLaunch', 1);

			if (Ti.App.Properties.getString('isFirstTimeLogin') == "false") {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('signinStudy', {
					isFrom : "passwordScreen"
				});

			} else {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('signin');
			}
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow("passwordScreen");
		} else {
			$.pass1.value = "";
			$.pass2.value = "";
			$.pass3.value = "";
			$.pass4.value = "";
			$.pass1.touchEnabled = false;
			$.pass2.touchEnabled = false;
			$.pass3.touchEnabled = false;
			$.pass4.touchEnabled = false;
			$.hint1.visible = true;
			$.hint2.visible = true;
			$.hint3.visible = true;
			$.hint4.visible = true;
			commonFunctions.showAlert("Specify a valid password.");
		}

	} catch(ex) {
		commonFunctions.handleException("passwordScreen", "onSendClick", ex);
	}

}

function passwordClick(e) {

	if (e.source.id == "passbox1" || e.source.id == "pass1") {

		$.hint1.visible = false;
		$.pass1.editable = true;
		$.pass1.touchEnabled = true;
		$.pass2.touchEnabled = false;
		$.pass3.touchEnabled = false;
		$.pass4.touchEnabled = false;
		$.pass1.value = "";

		if (OS_ANDROID) {
			$.pass1.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
		}
		$.pass1.focus();
		if ($.pass2.value == "") {
			$.hint2.visible = true;
		}
		if ($.pass3.value == "") {
			$.hint3.visible = true;
		}
		if ($.pass4.value == "") {
			$.hint4.visible = true;
		}

	} else if (e.source.id == "passbox2" || e.source.id == "pass2") {

		$.hint2.visible = false;
		$.pass2.editable = true;
		$.pass2.touchEnabled = true;
		$.pass1.touchEnabled = false;
		$.pass3.touchEnabled = false;
		$.pass4.touchEnabled = false;
		$.pass2.value = "";
		if (OS_ANDROID) {
			$.pass2.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
		}
		$.pass2.focus();
		if ($.pass1.value == "") {
			$.hint1.visible = true;
		}
		if ($.pass3.value == "") {
			$.hint3.visible = true;
		}
		if ($.pass4.value == "") {
			$.hint4.visible = true;
		}

	} else if (e.source.id == "passbox3" || e.source.id == "pass3") {

		$.hint3.visible = false;
		$.pass3.editable = true;
		$.pass3.touchEnabled = true;
		$.pass2.touchEnabled = false;
		$.pass1.touchEnabled = false;
		$.pass4.touchEnabled = false;
		$.pass3.value = "";
		if (OS_ANDROID) {
			$.pass3.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
		}
		$.pass3.focus();
		if ($.pass1.value == "") {
			$.hint1.visible = true;
		}
		if ($.pass2.value == "") {
			$.hint2.visible = true;
		}
		if ($.pass4.value == "") {
			$.hint4.visible = true;
		}

	} else if (e.source.id == "passbox4" || e.source.id == "pass4") {

		$.hint4.visible = false;
		$.pass4.editable = true;
		$.pass4.touchEnabled = true;
		$.pass2.touchEnabled = false;
		$.pass3.touchEnabled = false;
		$.pass1.touchEnabled = false;
		$.pass4.value = "";
		if (OS_ANDROID) {
			$.pass4.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
		}
		$.pass4.focus();

		if ($.pass1.value == "") {
			$.hint1.visible = true;
		}
		if ($.pass2.value == "") {
			$.hint2.visible = true;
		}
		if ($.pass3.value == "") {
			$.hint3.visible = true;
		}

	}

}

$.pass1.addEventListener("change", function(e) {

	if ($.pass1.value != "") {
		if ($.pass2.value == "") {
			$.hint2.visible = false;
			$.pass2.editable = true;
			$.pass2.touchEnabled = true;
			$.pass1.touchEnabled = false;
			$.pass3.touchEnabled = false;
			$.pass4.touchEnabled = false;
			$.pass2.value = "";
			if (OS_ANDROID) {
				$.pass2.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
			}
			$.pass2.focus();
		}

	}

});
$.pass2.addEventListener("change", function(e) {

	if ($.pass2.value != "") {
		if ($.pass3.value == "") {
			$.hint3.visible = false;
			$.pass3.editable = true;
			$.pass3.touchEnabled = true;
			$.pass1.touchEnabled = false;
			$.pass2.touchEnabled = false;
			$.pass4.touchEnabled = false;
			$.pass3.value = "";
			if (OS_ANDROID) {
				$.pass3.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
			}
			$.pass3.focus();
		}

	}

});
$.pass3.addEventListener("change", function(e) {

	if ($.pass3.value != "") {
		if ($.pass4.value == "") {
			$.hint4.visible = false;
			$.pass4.editable = true;
			$.pass4.touchEnabled = true;
			$.pass1.touchEnabled = false;
			$.pass2.touchEnabled = false;
			$.pass3.touchEnabled = false;
			$.pass4.value = "";
			if (OS_ANDROID) {
				$.pass4.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
			}
			$.pass4.focus();
		}

	}

});
$.pass1.addEventListener('return', function() {

	if ($.pass1.value == "") {
		$.hint1.visible = true;
	}
	$.hint2.visible = false;
	$.pass2.editable = true;
	$.pass2.touchEnabled = true;
	$.pass1.touchEnabled = false;
	$.pass3.touchEnabled = false;
	$.pass4.touchEnabled = false;
	$.pass2.value = "";
	$.pass2.focus();
});
$.pass2.addEventListener('return', function() {

	if ($.pass2.value == "") {
		$.hint2.visible = true;
	}
	$.hint3.visible = false;
	$.pass3.editable = true;
	$.pass3.touchEnabled = true;
	$.pass1.touchEnabled = false;
	$.pass2.touchEnabled = false;
	$.pass4.touchEnabled = false;
	$.pass3.value = "";
	$.pass3.focus();
});
$.pass3.addEventListener('return', function() {

	if ($.pass3.value == "") {
		$.hint3.visible = true;
	}
	$.hint4.visible = false;
	$.pass4.editable = true;
	$.pass4.touchEnabled = true;
	$.pass1.touchEnabled = false;
	$.pass2.touchEnabled = false;
	$.pass3.touchEnabled = false;
	$.pass4.value = "";
	$.pass4.focus();

});
