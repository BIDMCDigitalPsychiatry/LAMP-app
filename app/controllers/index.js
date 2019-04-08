/**
 * Declarations
 */
var commonFunctions = require('commonFunctions');
var NavigationController = require('NavigationController');
var commonDB = require('commonDB');
var serviceManager = require('serviceManager');
commonFunctions.initActivityIndicator();
var sampleHealthkit=require('sampleHealthkit');
var osname = Ti.Platform.osname;
var  locationTxt="";
var surveyArray=[];
var surveyListingArray =[];
var curLatitude;
var curLongitude;
var healthKitParam=[];
var healthParam=[];

if (OS_IOS) {
	var locationupdatemodule = require('com.zco.location');
	locationupdatemodule.addEventListener('locationLatitude', updateLocationInbackgroundiOS);
}
if (osname == "ipad") {
	var pWidth = Ti.Platform.displayCaps.platformWidth;
	
	if (pWidth < 1500) {
		$.splashScreenWindow.backgroundImage = "/images/common/splash-Portrait.png";
	} else {
		$.splashScreenWindow.backgroundImage = "/images/common/splash-Portrait@2x.png";
	}
}
if (OS_IOS) {
	if (Alloy.Globals.DEVICE_HEIGHT === 812) {
		$.splashScreenWindow.backgroundImage = "/images/common/splash-Portrait-2436h.png";
	}
}

init();
/**
 * Running the activity indicator for 3 seconds and HomeScreen is opened
 */
function init() {
	try {
		$.splashScreenWindow.open();
		if(OS_ANDROID){
			openWindow();
		}else{
			setTimeout(openWindow, 1000);
		}
		
	} catch(ex) {
		commonFunctions.handleException("index", "init", ex);
	}
}

/**
 * Window open function
 */

function openWindow() {
	try {
		
		
		Alloy.Globals.NAVIGATION_CONTROLLER = new NavigationController();
		
		initDB();
		if (Ti.App.Properties.hasProperty("alreadyLaunch") == true) {
			if (Alloy.Globals.isAutoLoginSet() == true) {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('home');
			} else {
				Ti.API.info('Openwindow signin');
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('signin');
			}
		}else{
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('passwordScreen');
		}
		
		if (OS_IOS) {
			setTimeout(function() {
				$.splashScreenWindow.close();
			}, 1000);
		}else{
			
		}

	} catch(ex) {
		commonFunctions.handleException("index", "openWindow", ex);
	}
}

/**
 * function for local DB initialisation
 */
function initDB() {
	try {
		Alloy.createCollection("Settings");
		Alloy.createCollection("CoginitionTestResult");
		Alloy.createCollection("Survey");
		Alloy.createCollection("SurveyListings");
		Alloy.createCollection("SurveyResult");
		Alloy.createCollection("SurveyResultListing");
		Alloy.createCollection("Alerts");
		Alloy.createCollection("location");
		Alloy.createCollection("Articles");
		Alloy.createCollection("surveyOptionList");
		Alloy.createCollection("JewelCollection");
		Alloy.createCollection("AdminShedule");
		Alloy.createCollection("LocalSchedule");
		if (OS_IOS) {
			var db = Ti.Database.open(Alloy.Globals.DATABASE);
			db.remoteBackup = false;
			db.close();
		}
		 
	} catch(ex) {
		commonFunctions.handleException("Index", "initDb", ex);
	}
}

if (OS_IOS) {
	Ti.App.addEventListener('paused', onPause);
	Ti.App.addEventListener('resumed', callResume);
	Ti.App.addEventListener('getCurrentLocation', getCurrentLocation);
	
} else {
	Ti.App.addEventListener('app:android_pause', onPause);
	Ti.App.addEventListener('getCurrentLocation', getCurrentLocation);
}
Ti.App.addEventListener('updateHealthData', updateHealthData);

/**
 * Resume event handler
 */
function callResume (e) {
	try{
		if(Alloy.Globals.CALL_START_TIME !=0 && Alloy.Globals.CALL_START_DATE != null){
		var credentials = Alloy.Globals.getCredentials();
		var endTime=new Date().getTime();	
		var duration=(endTime-Alloy.Globals.CALL_START_TIME)/1000;
		var callParam={
			"UserID" : credentials.userId,
			"CalledNumber" :Alloy.Globals.PHONE_NUMBER ,
			"CallDateTime" :Alloy.Globals.CALL_START_DATE,
			"CallDuraion" : duration,
			"Type" : Alloy.Globals.CALL_TYPE
		}
		if (Ti.Network.online) {
			serviceManager.saveHelpCall(callParam, saveHelpCallSuccess, saveHelpCallFailure);
		}
		Alloy.Globals.CALL_START_TIME=0;
		Alloy.Globals.CALL_START_DATE =null;
		Alloy.Globals.PHONE_NUMBER=null;
		Alloy.Globals.CALL_TYPE=null;
		
	}
	}catch(ex){
		commonFunctions.handleException("index", "onresume", ex);
	}
}

/**
 * Updating health data
 */
function updateHealthData () {
	var credentials = Alloy.Globals.getCredentials();
	if (credentials.userId == null || credentials.userId == "" || credentials.userId == 0) {
			return;
	}
	var diff = 0;
	var curTime = new Date().getTime();
	var setTime = Ti.App.Properties.getString('healthUpdate', "");
	Ti.API.info('updateHealthData : ',setTime);
	Ti.API.info('curTime : ', curTime);
	if (setTime != "") {
		
		diff = curTime - parseInt(setTime);
	}
	
	Ti.API.info('diff : ', diff);
	if (diff != 0 && diff < 3600000) {
		return;
	}
	
	if(OS_IOS){
		sampleHealthkit.getHealthDatas(getHealthDataSuccess);
	}else{
		healthData.getHealthDatas(getHealthDataSuccess);
	}
	
	setTimeout(updateHealthDataValues, 12000);
}

/**
 * Function to update health data values
 */
function  updateHealthDataValues () {
	var credentials = Alloy.Globals.getCredentials();
	if(healthKitParam.length!=0){
		 if (Ti.Network.online) {
			if (OS_IOS){
				serviceManager.saveUserHealthDetailData(credentials.userId,healthParam,healthKitParam,onSaveUserHealthDataSuccess, onSaveUserHealthDataFailure);
			}else{
				serviceManager.saveUserHealthData(credentials.userId,healthParam, onSaveUserHealthDataSuccess, onSaveUserHealthDataFailure);
			}
		
	}
		
	}
 
}

/**
 * getHealthDataSuccess event
 */
function getHealthDataSuccess (e,healthkit) {
	var credentials = Alloy.Globals.getCredentials();	
	healthKitParam=healthkit;
 	healthParam=e;
	
	Ti.API.info('healthParam', JSON.stringify(healthParam));
  
}

/**
 * onSaveUserHealthDataSuccess event
 */
function onSaveUserHealthDataSuccess (e) {
	var curTime = new Date().getTime();
	Ti.API.info('onSaveUserHealthDataSuccess : ',curTime);
	Ti.App.Properties.setString('healthUpdate', curTime);
  
}

/**
 * onSaveUserHealthDataFailure event
 */
function onSaveUserHealthDataFailure (e) {
	Ti.API.info('onSaveUserHealthDataFailure :');
  
}

/**
 * Function to get current location
 */
function getCurrentLocation() {
	try {
		
		var credentials = Alloy.Globals.getCredentials();
		if (credentials.userId == null || credentials.userId == "" || credentials.userId == 0) {
			return;
		}
		var diff = 0;
		var curTime = new Date().getTime();
		var setTime = Ti.App.Properties.getString('locationUpdate', "");
		if (setTime != "") {
			diff = curTime - setTime;
		}
		
		if (diff != 0 && diff < 3000000) {
			return;
		}
		
		if (Ti.Geolocation.locationServicesEnabled) {
			Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
			Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
			if (OS_IOS) {
				Ti.Geolocation.activityType = Titanium.Geolocation.ACTIVITYTYPE_OTHER;
			}

			Titanium.Geolocation.getCurrentPosition(function(e) {
				if (e.error) {
					Ti.API.info('location update error');

				} else {		
						
					curLatitude = e.coords.latitude;
					curLongitude = e.coords.longitude;
					
					if (curLatitude != null && curLatitude != undefined && curLatitude != 0) {
						geocode(curLatitude, curLongitude);
					}
				
					
				}
			});
		}
	} catch(ex) {
		commonFunctions.handleException("index", "getCurrentLocation", ex);
	}
}

/**
 * success api call
 */
function saveHelpCallSuccess(e) {
	try {

		var response = JSON.parse(e.data);

		
		if (response.ErrorCode == 0) {
			
		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}

	} catch(ex) {
		commonFunctions.handleException("index", "callduration", ex);
	}
};

/**
 * error api call
 */
function saveHelpCallFailure(e) {
	
};

/**
 * Fire when app going to background.
 */
function onPause() {
	try {
	
		Alloy.Globals.ISPAUSED = true;
		var credentials = Alloy.Globals.getCredentials();
		if (credentials.userId == null || credentials.userId == "" || credentials.userId == 0) {
			return;
		}
		if (OS_IOS)
			locationupdatemodule.startupdatingLocation();
		var pausedDateTime = new Date();
		
		Ti.App.Properties.setObject('pausedTime', pausedDateTime);
	} catch(ex) {
		commonFunctions.handleException("Index", "onPause", ex);
	}
}

/**
 * Update location in IOS backgroung
 */
function updateLocationInbackgroundiOS(e) {
	
	var credentials = Alloy.Globals.getCredentials();
	if (credentials.userId == null || credentials.userId == "" || credentials.userId == 0) {
		return;
	}
	var diff = 0;
	var curTime = new Date().getTime();
	var setTime = Ti.App.Properties.getString('locationUpdate', "");
	if (setTime != "") {
		diff = curTime - setTime;
	}
	
	if (diff == 0 || diff > 3000000) {
		var curLatitude = e.latitude;
		var curLongitude = e.longitude;
		
		if (curLatitude != null && curLatitude != undefined && curLatitude != 0) {
			geocode(curLatitude, curLongitude);
		}

	}

}

/**
 * Getting address
 */
function geocode(latitude, longitude) {
	try {
	var street,city,state,country,postalCode;
	var loc;
  	var addrUrl = "https://maps.googleapis.com/maps/api/geocode/json?sensor=true&latlng="+latitude+","+longitude+"&key=AIzaSyCUdRdY1eTvUkTrdWMd15Ei-NP-GV-o1X8";

	var addrReq = Titanium.Network.createHTTPClient();
	addrReq.open("GET",addrUrl);
	addrReq.send(null);
	addrReq.onload = function(){
	    var response = JSON.parse(this.responseText);
	    if(response.status == "OK"){
		    var resLen = response.results[0].address_components.length;
	        for(var i=0; i < resLen; i++) {
	
	            switch (response.results[0].address_components[i].types[0])
	            {
	                case "street_number":
	                 
	                    break;
	                case "route":
	               		street=response.results[0].address_components[i].long_name;
	                    break;
	                case "locality":
		                city=response.results[0].address_components[i].long_name;
	                    break;
	                case "administrative_area_level_1":
	                     state= response.results[0].address_components[i].long_name;
	                  
	                    break;
	                case "postal_code":
	                   postalcode= response.results[0].address_components[i].long_name;
	                    break;
	                case "country":
	            	   country= response.results[0].address_components[i].long_name;
	                    break;
	                }
	        }
	
				locationTxt = street+ ', ' + city +', ' +state +', ' +country; 
	
		}else{
	 		
	   	 }
		
				if (locationTxt !== null && locationTxt != "") {

					var credentials = Alloy.Globals.getCredentials();

					var locationParam = {
						"UserID" : credentials.userId,
						"LocationName" : "",
						"Address" : locationTxt,
						"Type" : 1,
						"Latitude": curLatitude,
  						"Longitude": curLongitude
					}

					if (Ti.Network.online) {

						serviceManager.saveUserLocation(locationParam, onSaveUserLocationSuccess, onSaveUserLocationFailure);
					}

				}

 	};
 } catch (ex) {
		commonFunctions.handleException("spaceblockScreen", "geocode", ex);
	}
}
/**
 * success api call
 */
function onSaveUserLocationSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		
		if (response.ErrorCode == 0) {	
			var credentials = Alloy.Globals.getCredentials();
			commonDB.saveLocationAdress(credentials.userId,"",locationTxt,0);	
		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}
	} catch(ex) {
		commonFunctions.handleException("index", "onSaveUserLocationSuccess", ex);
	}
};
/**
 * Failure api call
 */
function onSaveUserLocationFailure(e) {
	
};

/**
 * Android back button handler
 */
$.splashScreenWindow.addEventListener('android:back', function() {
	try {
		Ti.API.info('splashScreenWindow Android Back');
		return false;
	} catch(ex) {
		commonFunctions.handleException("signin", "android-back", ex);
	}

});

/**
 * Exit app
 */
Ti.App.addEventListener("app:exitApp", exitApp);
function exitApp() {
	try {
		Ti.API.info('Exit APP');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('newHomeScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('signin');
		$.splashScreenWindow.exitOnClose = true;
		$.splashScreenWindow.close();
		var activity = Titanium.Android.currentActivity;
		activity.finish();
	} catch(ex) {
		var activity = Titanium.Android.currentActivity;
		activity.finish();

	}
}



