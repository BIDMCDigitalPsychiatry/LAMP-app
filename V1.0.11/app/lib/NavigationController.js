/**
 * CommonJS used for Window Navigation. This Navigation Controller is used
 * for screen navigations in entire application.
 *
 */
var NavigationController = function(indexWindow) {
	this.screenStack = [];

	/**
	 * If index.js has to be added in the navigation stack
	 */
	if (indexWindow != undefined && indexWindow != null) {
		if (OS_IOS) {
			indexWindow.navBarHidden = true;
			indexWindow.fullscreen = true;
			this.navigationWindow = Titanium.UI.iOS.createNavigationWindow({
				window : indexWindow
			});
			this.navigationWindow.open();
		} else {
			indexWindow.navBarHidden = true;
			indexWindow.exitOnClose = true;
			indexWindow.open({
				animated : true,
				activityEnterAnimation : Ti.Android.R.anim.fade_in,
				activityExitAnimation : Ti.Android.R.anim.fade_out
			});
		}

		var stackData = {
			"windowName" : "index",
			"window" : indexWindow,
			"isNavigationWindow" : true
		};

		this.screenStack.push(stackData);
	}

};

/**
 * Here if the window to be opened already exists in the screen stack, all the windows above that window
 * is closed and the window to be opened is shown
 */
NavigationController.prototype.openWindow = function(windowName, windowParameters) {
	//Checking the given window exists in the screen stack
	var window = getWindowFromStack(this.screenStack, windowName);

	//If the given window not exists a new window is created with that name and is added to screen stack.
	if (window == null) {

		window = Alloy.createController(windowName, windowParameters);

		if (this.screenStack.length > 0) {

			var stackData = {
				"windowName" : windowName,
				"window" : window,
				"isNavigationWindow" : false
			};
			this.screenStack.push(stackData);

			//Opening the window w.r.t to IOS and ANDROID
			if (OS_IOS) {
				window.getView().navBarHidden = true;
				window.getView().fullscreen = false;

				this.navigationWindow.openWindow(setWindowHeight(window.getView()));

			} else {
				window.getView().navBarHidden = true;
				window.getView().open({
					animated : true,
					activityEnterAnimation : Ti.Android.R.anim.fade_in,
					activityExitAnimation : Ti.Android.R.anim.fade_out
				});
			}

		} else {

			var stackData = {
				"windowName" : windowName,
				"window" : window,
				"isNavigationWindow" : true
			};
			this.screenStack.push(stackData);

			//For IOS we are using the navigation window and for Android the base window is opened.
			if (OS_IOS) {

				window.getView().navBarHidden = true;
				window.getView().fullscreen = false;
				this.navigationWindow = Titanium.UI.iOS.createNavigationWindow({
					window : window.getView()
				});
				this.navigationWindow.open();
			} else {
				window.getView().navBarHidden = true;
				window.getView().exitOnClose = true;
				window.getView().open({
					animated : true,
					activityEnterAnimation : Ti.Android.R.anim.fade_in,
					activityExitAnimation : Ti.Android.R.anim.fade_out
				});
			}

		}

	} else {

		//Closing all the windows and the given window is now on the top of the stack
		for (var i = (window.index + 1),
		    j = this.screenStack.length; i < j; i++) {

			if (OS_IOS) {
				if (this.navigationWindow) {
					this.navigationWindow.closeWindow(this.screenStack[i].window.getView());
				}
			} else {
				this.screenStack[i].window.getView().close();
			}

		};
		//Resetting the stack
		this.screenStack.splice((window.index + 1), (this.screenStack.length - 1));

		// This section is added to solve the non firing issue of "open" when we open a previosly closed window.
		// Check whether the array has entries.
		if (this.screenStack.length > 0) {
			// Take the last window or top window. Check whether this is the correct or take the first one.
			// Make sure that the window object contains initWindow function.
			if ( typeof (this.screenStack[this.screenStack.length - 1].window.initWindow) !== 'undefined' && typeof (this.screenStack[this.screenStack.length - 1].window.initWindow) === 'function') {
				// Call initWindow() function, this can be used to solve the non firing issue of "open" event when an old window is open again.
				// In this case no window creation happens it seems, so calling an exported fuctnion from window object.
				// Fire event window.fireEvent also fails due to some unknown reason.
				this.screenStack[this.screenStack.length - 1].window.initWindow();
			}
		}

	}
};
NavigationController.prototype.openFullScreenWindow = function(windowName, windowParameters) {
	//Checking the given window exists in the screen stack
	var window = getWindowFromStack(this.screenStack, windowName);

	//If the given window not exists a new window is created with that name and is added to screen stack.
	if (window == null) {

		window = Alloy.createController(windowName, windowParameters);

		if (this.screenStack.length > 0) {

			var stackData = {
				"windowName" : windowName,
				"window" : window,
				"isNavigationWindow" : false
			};
			this.screenStack.push(stackData);

			//Opening the window w.r.t to IOS and ANDROID
			if (OS_IOS) {
				 window.getView().navBarHidden = true;
				// window.getView().fullscreen = false;

				this.navigationWindow.openWindow(setWindowHeight(window.getView()));

			} else {
				window.getView().navBarHidden = true;
				window.getView().open({
					animated : true,
					activityEnterAnimation : Ti.Android.R.anim.fade_in,
					activityExitAnimation : Ti.Android.R.anim.fade_out
				});
			}

		} else {

			var stackData = {
				"windowName" : windowName,
				"window" : window,
				"isNavigationWindow" : true
			};
			this.screenStack.push(stackData);

			//For IOS we are using the navigation window and for Android the base window is opened.
			if (OS_IOS) {

				 window.getView().navBarHidden = true;
				// window.getView().fullscreen = false;
				this.navigationWindow = Titanium.UI.iOS.createNavigationWindow({
					window : window.getView()
				});
				this.navigationWindow.open();
			} else {
				window.getView().navBarHidden = true;
				window.getView().exitOnClose = true;
				window.getView().open({
					animated : true,
					activityEnterAnimation : Ti.Android.R.anim.fade_in,
					activityExitAnimation : Ti.Android.R.anim.fade_out
				});
			}

		}

	} else {

		//Closing all the windows and the given window is now on the top of the stack
		for (var i = (window.index + 1),
		    j = this.screenStack.length; i < j; i++) {

			if (OS_IOS) {
				if (this.navigationWindow) {
					this.navigationWindow.closeWindow(this.screenStack[i].window.getView());
				}
			} else {
				this.screenStack[i].window.getView().close();
			}

		};
		//Resetting the stack
		this.screenStack.splice((window.index + 1), (this.screenStack.length - 1));

		// This section is added to solve the non firing issue of "open" when we open a previosly closed window.
		// Check whether the array has entries.
		if (this.screenStack.length > 0) {
			// Take the last window or top window. Check whether this is the correct or take the first one.
			// Make sure that the window object contains initWindow function.
			if ( typeof (this.screenStack[this.screenStack.length - 1].window.initWindow) !== 'undefined' && typeof (this.screenStack[this.screenStack.length - 1].window.initWindow) === 'function') {
				// Call initWindow() function, this can be used to solve the non firing issue of "open" event when an old window is open again.
				// In this case no window creation happens it seems, so calling an exported fuctnion from window object.
				// Fire event window.fireEvent also fails due to some unknown reason.
				this.screenStack[this.screenStack.length - 1].window.initWindow();
			}
		}

	}
};
/**
 * Retrieving the current visible window,ie. the top window in stack
 */
NavigationController.prototype.getCurrentWindow = function() {
	return this.screenStack[(this.screenStack.length - 1)];
};

NavigationController.prototype.checkWindowWExist = function(windowName) {
	return getWindowFromStack(this.screenStack, windowName);
};

//go back to the initial window of the NavigationController
NavigationController.prototype.closeAllWindows = function(windowName) {
	var window = getWindowFromStack(this.screenStack, windowName);
	if (window != null) {
		//Closing all the windows and the given window is now on the top of the stack
		for (var i = (window.index + 1),
		    j = this.screenStack.length - 1; i < j; i++) {

			if (OS_IOS) {
				if (this.navigationWindow) {
					this.navigationWindow.closeWindow(this.screenStack[i].window.getView());
				}
			} else {
				Ti.API.info('WINDOW STACK LENGTH: ', this.screenStack.length);
				this.screenStack[i].window.getView().close();
			}

		};

		var numWindowToClose = (this.screenStack.length - 1) - (window.index + 1);
		Ti.API.info('numWindowToClose: ', numWindowToClose);
		//Resetting the stack
		Ti.API.info('WINDOW STACK LENGTH1: ', this.screenStack.length);
		this.screenStack.splice((window.index + 1), numWindowToClose);
		Ti.API.info('WINDOW STACK LENGTH2: ', this.screenStack.length);
	}

};

/**
 * Closing the given window from the stack removing from the screen
 */
NavigationController.prototype.closeWindow = function(windowName) {

	var windowData = getWindowFromStack(this.screenStack, windowName);
	if (windowData != null) {
		if (OS_IOS) {
			if (this.navigationWindow && !windowData.isNavigationWindow) {
				this.navigationWindow.closeWindow(windowData.window.getView());
				this.screenStack.splice(windowData.index, 1);
			}
		} else {
			windowData.window.getView().close();
			this.screenStack.splice(windowData.index, 1);
		}

	}
};

/**
 * Function used for checking the existence of a given window in the stack.
 */
function getWindowFromStack(screenStack, windowName) {
	if (screenStack != undefined) {
		for (var i = (screenStack.length - 1),
		    j = 0; i >= j; i--) {
			if (screenStack[i].windowName === windowName) {
				var data = {
					"window" : screenStack[i].window,
					"index" : i,
					"isNavigationWindow" : screenStack[i].isNavigationWindow
				};
				return data;
			}
		};
	}
	return null;
};

/**
 * Adding a view for background for status bar in IOS 7 and above
 */
function setWindowHeight(window) {

	if ((Ti.Platform.osname == "iphone") || (Ti.Platform.osname == "ipad")) {
		if (parseInt(Ti.Platform.version) >= 7) {
			window.add(Ti.UI.createView({
				top : 0,
				left : 0,
				height : "20dp",
				backgroundColor : "transparent"
			}));
		}
	}
	return window;
};

module.exports = NavigationController;

