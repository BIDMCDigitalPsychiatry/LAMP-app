// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = arguments[0] || {};
var commonFunctions = require('commonFunctions');
var LangCode = Ti.App.Properties.getString('languageCode');
/**
 * on Back button click
 */
$.cognitionInstruction.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.MainView.top = "80dp";
				$.MainView.bottom = "20dp";
			}
		}
		$.headerView.setTitle(commonFunctions.L('instructionLbl', LangCode));
		if (args.gameID == 1) {

			if (LangCode == "en") {
				$.instructionWebView.url = "/htmlPages/en_html/n-back-test.html";
			} else if (LangCode == "es") {
				$.instructionWebView.url = "/htmlPages/es_html/n-back-test.html";
			} else if (LangCode == "pt-br") {
				$.instructionWebView.url = "/htmlPages/pt-br_html/n-back-test.html";
			} else if (LangCode == "cmn") {
				$.instructionWebView.url = "/htmlPages/cmn_html/n-back-test.html";
			} else if (LangCode == "twi") {
				$.instructionWebView.url = "/htmlPages/twi_html/n-back-test.html";
			} else if (LangCode == "dut") {
				$.instructionWebView.url = "/htmlPages/dut_html/n-back-test.html";
			}

		} else if (args.gameID == 2) {

			if (LangCode == "en") {
				$.instructionWebView.url = "/htmlPages/en_html/trails-b-test.html";
			} else if (LangCode == "es") {
				$.instructionWebView.url = "/htmlPages/es_html/trails-b-test.html";
			} else if (LangCode == "pt-br") {
				$.instructionWebView.url = "/htmlPages/pt-br_html/trails-b-test.html";
			} else if (LangCode == "cmn") {
				$.instructionWebView.url = "/htmlPages/cmn_html/trails-b-test.html";
			} else if (LangCode == "twi") {
				$.instructionWebView.url = "/htmlPages/twi_html/trails-b-test.html";
			} else if (LangCode == "dut") {
				$.instructionWebView.url = "/htmlPages/dut_html/trails-b-test.html";
			}

		} else if (args.gameID == 3) {

			if (LangCode == "en") {
				$.instructionWebView.url = "/htmlPages/en_html/spatial-span-forward.html";
			} else if (LangCode == "es") {
				$.instructionWebView.url = "/htmlPages/es_html/spatial-span-forward.html";
			} else if (LangCode == "pt-br") {
				$.instructionWebView.url = "/htmlPages/pt-br_html/spatial-span-forward.html";
			} else if (LangCode == "cmn") {
				$.instructionWebView.url = "/htmlPages/cmn_html/spatial-span-forward.html";
			} else if (LangCode == "twi") {
				$.instructionWebView.url = "/htmlPages/twi_html/spatial-span-forward.html";
			} else if (LangCode == "dut") {
				$.instructionWebView.url = "/htmlPages/dut_html/spatial-span-forward.html";
			}

		} else if (args.gameID == 4) {

			if (LangCode == "en") {
				$.instructionWebView.url = "/htmlPages/en_html/spatial-span-backward.html";
			} else if (LangCode == "es") {
				$.instructionWebView.url = "/htmlPages/es_html/spatial-span-backward.html";
			} else if (LangCode == "pt-br") {
				$.instructionWebView.url = "/htmlPages/pt-br_html/spatial-span-backward.html";
			} else if (LangCode == "cmn") {
				$.instructionWebView.url = "/htmlPages/cmn_html/spatial-span-backward.html";
			} else if (LangCode == "twi") {
				$.instructionWebView.url = "/htmlPages/twi_html/spatial-span-backward.html";
			} else if (LangCode == "dut") {
				$.instructionWebView.url = "/htmlPages/dut_html/spatial-span-backward.html";
			}

		} else if (args.gameID == 5) {

			if (LangCode == "en") {
				$.instructionWebView.url = "/htmlPages/en_html/simple-memory-test.html";
			} else if (LangCode == "es") {
				$.instructionWebView.url = "/htmlPages/es_html/simple-memory-test.html";
			} else if (LangCode == "pt-br") {
				$.instructionWebView.url = "/htmlPages/pt-br_html/simple-memory-test.html";
			} else if (LangCode == "cmn") {
				$.instructionWebView.url = "/htmlPages/cmn_html/simple-memory-test.html";
			} else if (LangCode == "twi") {
				$.instructionWebView.url = "/htmlPages/twi_html/simple-memory-test.html";
			} else if (LangCode == "dut") {
				$.instructionWebView.url = "/htmlPages/dut_html/simple-memory-test.html";
			}

		} else if (args.gameID == 6) {
			if (LangCode == "en") {
				$.instructionWebView.url = "/htmlPages/en_html/serial-7s.html";
			} else if (LangCode == "es") {
				$.instructionWebView.url = "/htmlPages/es_html/serial-7s.html";
			} else if (LangCode == "pt-br") {
				$.instructionWebView.url = "/htmlPages/pt-br_html/serial-7s.html";
			} else if (LangCode == "cmn") {
				$.instructionWebView.url = "/htmlPages/cmn_html/serial-7s.html";
			} else if (LangCode == "twi") {
				$.instructionWebView.url = "/htmlPages/twi_html/serial-7s.html";
			} else if (LangCode == "dut") {
				$.instructionWebView.url = "/htmlPages/dut_html/serial-7s.html";
			}

		} else if (args.gameID == 7) {
			if (LangCode == "en") {
				$.instructionWebView.url = "/htmlPages/en_html/3D-Figure-Copy.html";
			} else if (LangCode == "es") {
				$.instructionWebView.url = "/htmlPages/es_html/3D-Figure-Copy.html";
			} else if (LangCode == "pt-br") {
				$.instructionWebView.url = "/htmlPages/pt-br_html/3D-Figure-Copy.html";
			} else if (LangCode == "cmn") {
				$.instructionWebView.url = "/htmlPages/cmn_html/3D-Figure-Copy.html";
			} else if (LangCode == "twi") {
				$.instructionWebView.url = "/htmlPages/twi_html/3D-Figure-Copy.html";
			} else if (LangCode == "dut") {
				$.instructionWebView.url = "/htmlPages/dut_html/3D-Figure-Copy.html";
			}

		} else if (args.gameID == 8) {

			if (LangCode == "en") {
				$.instructionWebView.url = "/htmlPages/en_html/visual-association-task.html";
			} else if (LangCode == "es") {
				$.instructionWebView.url = "/htmlPages/es_html/visual-association-task.html";
			} else if (LangCode == "pt-br") {
				$.instructionWebView.url = "/htmlPages/pt-br_html/visual-association-task.html";
			} else if (LangCode == "cmn") {
				$.instructionWebView.url = "/htmlPages/cmn_html/visual-association-task.html";
			} else if (LangCode == "twi") {
				$.instructionWebView.url = "/htmlPages/twi_html/visual-association-task.html";
			} else if (LangCode == "dut") {
				$.instructionWebView.url = "/htmlPages/dut_html/visual-association-task.html";
			}

		} else if (args.gameID == 9) {

			if (LangCode == "en") {
				$.instructionWebView.url = "/htmlPages/en_html/digit-span-forward.html";
			} else if (LangCode == "es") {
				$.instructionWebView.url = "/htmlPages/es_html/digit-span-forward.html";
			} else if (LangCode == "pt-br") {
				$.instructionWebView.url = "/htmlPages/pt-br_html/digit-span-forward.html";
			} else if (LangCode == "cmn") {
				$.instructionWebView.url = "/htmlPages/cmn_html/digit-span-forward.html";
			} else if (LangCode == "twi") {
				$.instructionWebView.url = "/htmlPages/twi_html/digit-span-forward.html";
			} else if (LangCode == "dut") {
				$.instructionWebView.url = "/htmlPages/dut_html/digit-span-forward.html";
			}

		} else if (args.gameID == 10) {

			if (LangCode == "en") {
				$.instructionWebView.url = "/htmlPages/en_html/digit-span-backward.html";
			} else if (LangCode == "es") {
				$.instructionWebView.url = "/htmlPages/es_html/digit-span-backward.html";
			} else if (LangCode == "pt-br") {
				$.instructionWebView.url = "/htmlPages/pt-br_html/digit-span-backward.html";
			} else if (LangCode == "cmn") {
				$.instructionWebView.url = "/htmlPages/cmn_html/digit-span-backward.html";
			} else if (LangCode == "twi") {
				$.instructionWebView.url = "/htmlPages/twi_html/digit-span-backward.html";
			} else if (LangCode == "dut") {
				$.instructionWebView.url = "/htmlPages/dut_html/digit-span-backward.html";
			}

		} else if (args.gameID == 11) {

			if (LangCode == "en") {
				$.instructionWebView.url = "/htmlPages/en_html/cats-and-dogs.html";
			} else if (LangCode == "es") {
				$.instructionWebView.url = "/htmlPages/es_html/cats-and-dogs.html";
			} else if (LangCode == "pt-br") {
				$.instructionWebView.url = "/htmlPages/pt-br_html/cats-and-dogs.html";
			} else if (LangCode == "cmn") {
				$.instructionWebView.url = "/htmlPages/cmn_html/cats-and-dogs.html";
			} else if (LangCode == "twi") {
				$.instructionWebView.url = "/htmlPages/twi_html/cats-and-dogs.html";
			} else if (LangCode == "dut") {
				$.instructionWebView.url = "/htmlPages/dut_html/cats-and-dogs.html";
			}

		} else if (args.gameID == 12) {

			if (LangCode == "en") {
				$.instructionWebView.url = "/htmlPages/en_html/temporal-order.html";
			} else if (LangCode == "es") {
				$.instructionWebView.url = "/htmlPages/es_html/temporal-order.html";
			} else if (LangCode == "pt-br") {
				$.instructionWebView.url = "/htmlPages/pt-br_html/temporal-order.html";
			} else if (LangCode == "cmn") {
				$.instructionWebView.url = "/htmlPages/cmn_html/temporal-order.html";
			} else if (LangCode == "twi") {
				$.instructionWebView.url = "/htmlPages/twi_html/temporal-order.html";
			} else if (LangCode == "dut") {
				$.instructionWebView.url = "/htmlPages/dut_html/temporal-order.html";
			}

		} else if (args.gameID == 13) {

			if (LangCode == "en") {
				$.instructionWebView.url = "/htmlPages/en_html/trails-b-test-new.html";
			} else if (LangCode == "es") {
				$.instructionWebView.url = "/htmlPages/es_html/trails-b-test-new.html";
			} else if (LangCode == "pt-br") {
				$.instructionWebView.url = "/htmlPages/pt-br_html/trails-b-test-new.html";
			} else if (LangCode == "cmn") {
				$.instructionWebView.url = "/htmlPages/cmn_html/trails-b-test-new.html";
			} else if (LangCode == "twi") {
				$.instructionWebView.url = "/htmlPages/twi_html/trails-b-test-new.html";
			} else if (LangCode == "dut") {
				$.instructionWebView.url = "/htmlPages/dut_html/trails-b-test-new.html";
			}

		} else if (args.gameID == 14) {

			if (LangCode == "en") {
				$.instructionWebView.url = "/htmlPages/en_html/n-back-test-new.html";
			} else if (LangCode == "es") {
				$.instructionWebView.url = "/htmlPages/es_html/n-back-test-new.html";
			} else if (LangCode == "pt-br") {
				$.instructionWebView.url = "/htmlPages/pt-br_html/n-back-test-new.html";
			} else if (LangCode == "cmn") {
				$.instructionWebView.url = "/htmlPages/cmn_html/n-back-test-new.html";
			} else if (LangCode == "twi") {
				$.instructionWebView.url = "/htmlPages/twi_html/n-back-test-new.html";
			} else if (LangCode == "dut") {
				$.instructionWebView.url = "/htmlPages/dut_html/n-back-test-new.html";
			}

		} else if (args.gameID == 15) {

			if (LangCode == "en") {
				$.instructionWebView.url = "/htmlPages/en_html/trails-b-test-touch.html";
			} else if (LangCode == "es") {
				$.instructionWebView.url = "/htmlPages/es_html/trails-b-test-touch.html";
			} else if (LangCode == "pt-br") {
				$.instructionWebView.url = "/htmlPages/pt-br_html/trails-b-test-touch.html";
			} else if (LangCode == "cmn") {
				$.instructionWebView.url = "/htmlPages/cmn_html/trails-b-test-touch.html";
			} else if (LangCode == "twi") {
				$.instructionWebView.url = "/htmlPages/twi_html/trails-b-test-touch.html";
			} else if (LangCode == "dut") {
				$.instructionWebView.url = "/htmlPages/dut_html/trails-b-test-touch.html";
			}

		} else if (args.gameID == 17) {

			$.submitView.visible = true;

			if (LangCode == "en") {
				$.instructionWebView.url = "/htmlPages/en_html/jewels_A.html";
			} else if (LangCode == "es") {
				$.instructionWebView.url = "/htmlPages/es_html/jewels_A.html";
			} else if (LangCode == "pt-br") {
				$.instructionWebView.url = "/htmlPages/pt-br_html/jewels_A.html";
			} else if (LangCode == "cmn") {
				$.instructionWebView.url = "/htmlPages/cmn_html/jewels_A.html";
			} else if (LangCode == "twi") {
				$.instructionWebView.url = "/htmlPages/twi_html/jewels_A.html";
			} else if (LangCode == "dut") {
				$.instructionWebView.url = "/htmlPages/dut_html/jewels_A.html";
			}

		} else if (args.gameID == 18) {

			$.submitView.visible = true;

			if (LangCode == "en") {
				$.instructionWebView.url = "/htmlPages/en_html/jewels_B.html";
			} else if (LangCode == "es") {
				$.instructionWebView.url = "/htmlPages/es_html/jewels_B.html";
			} else if (LangCode == "pt-br") {
				$.instructionWebView.url = "/htmlPages/pt-br_html/jewels_B.html";
			} else if (LangCode == "cmn") {
				$.instructionWebView.url = "/htmlPages/cmn_html/jewels_B.html";
			} else if (LangCode == "twi") {
				$.instructionWebView.url = "/htmlPages/twi_html/jewels_B.html";
			} else if (LangCode == "dut") {
				$.instructionWebView.url = "/htmlPages/dut_html/jewels_B.html";
			}

		}

	} catch(ex) {
		commonFunctions.handleException("surveyList", "open", ex);
	}
});

$.headerView.on('backButtonClick', function(e) {
	goBack();
});
/***
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
function goBack(e) {
	try {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionInstruction');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && parentWindow.windowName === "home") {
			parentWindow.window.refreshHomeScreen();
		}

	} catch(ex) {
		commonFunctions.handleException("cognitionInstruction", "goBack", ex);
	}

}

/**
 * function for android back
 */
$.cognitionInstruction.addEventListener('android:back', function() {
	goBack();
});

function onExampleClick(e) {
	Ti.API.info('onExampleClick');
	if (args.gameID == 17) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jeweltrailsAExample', {
			'type' : 1
		});
	} else if (args.gameID == 18) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jeweltrailsAExample', {
			'type' : 2
		});
	}

}