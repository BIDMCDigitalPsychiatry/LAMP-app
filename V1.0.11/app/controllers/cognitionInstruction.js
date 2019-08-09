// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
/**
 * Declarations
 */
var args = arguments[0] || {};
var commonFunctions = require('commonFunctions');
var LangCode = Ti.App.Properties.getString('languageCode');

/**
 * Window open function
 */
$.cognitionInstruction.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.MainView.top = "80dp";
				$.MainView.bottom = "70dp";
				$.submitView.bottom = "20dp";
			}
		}
		$.headerView.setTitle(commonFunctions.L('instructionLbl', LangCode));
		$.submitLabel.text = commonFunctions.L('instructionsubmit', LangCode);
		if (args.gameID == 1) {

			if (LangCode == "en") {
				$.instructionWebView.url = "/htmlPages/en_html/n-back-test.html";
			} else if (LangCode == "es") {
				$.instructionWebView.url = "/htmlPages/es_html/n-back-test.html";
			} else if (LangCode == "pt-br") {
				$.instructionWebView.url = "/htmlPages/pt-br_html/n-back-test.html";
			} else if (LangCode == "cmn") {
				$.instructionWebView.url = "/htmlPages/cmn_html/n-back-test.html";
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
			}

		} else if (args.gameID == 13) {

			if (LangCode == "en") {
				$.instructionWebView.url = "/htmlPages/en_html/trails-b-test.html";
			} else if (LangCode == "es") {
				$.instructionWebView.url = "/htmlPages/es_html/trails-b-test.html";
			} else if (LangCode == "pt-br") {
				$.instructionWebView.url = "/htmlPages/pt-br_html/trails-b-test.html";
			} else if (LangCode == "cmn") {
				$.instructionWebView.url = "/htmlPages/cmn_html/trails-b-test.html";
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
			}

		}

	} catch(ex) {
		commonFunctions.handleException("surveyList", "open", ex);
	}
});

/**
 * Header back button click handler
 */
$.headerView.on('backButtonClick', function(e) {
	goBack();
});

/**
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});

/**
 * goBack function handler
 */

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

/**
 * Submit button click handler
 */
function onSubmitClick(e) {

	if (args.gameID == 1) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackLevel');

	} else if (args.gameID == 2) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsB');

	} else if (args.gameID == 3) {

		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
			"isForward" : true
		});

	} else if (args.gameID == 4) {

		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
			"isForward" : false
		});

	} else if (args.gameID == 5) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('simpleMemoryTask');

	} else if (args.gameID == 6) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('serial7STestScreen');

	} else if (args.gameID == 7) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('figureCopyScreen');

	} else if (args.gameID == 8) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('visualAssociation');

	} else if (args.gameID == 9) {

		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
			"isForward" : true
		});

	} else if (args.gameID == 10) {

		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
			"isForward" : false
		});

	} else if (args.gameID == 11) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('catAndDogGameNew');

	} else if (args.gameID == 12) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('temporalOrder');

	} else if (args.gameID == 13) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsbNonOverlap');

	} else if (args.gameID == 14) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackLevelNew');

	} else if (args.gameID == 15) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsBNew');

	}
	setTimeout(function() {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('cognitionInstruction');
	}, 1000);

}