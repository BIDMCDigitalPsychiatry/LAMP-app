var commonFunctions = require('commonFunctions');
var NavigationController = require('NavigationController');
var commonDB = require('commonDB');
var serviceManager = require('serviceManager');
commonFunctions.initActivityIndicator();

if (OS_IOS) {
	var sampleHealthkit=require('sampleHealthkit');
}else{
	var healthData = require('healthData');
}

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

function openWindow() {
	try {
		Alloy.Globals.NAVIGATION_CONTROLLER = new NavigationController();
		initDB();
		if (Ti.App.Properties.hasProperty("alreadyLaunch") == true) {
			if (Alloy.Globals.isAutoLoginSet() == true) {
				if(Ti.App.Properties.getString('isInstructionShown')=="true"){
					Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('home');
				}else{
					Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('welcomeScreen',{
						isAlreadyLogged:true
					});
				}
				
			} else {
				if (Ti.App.Properties.getString('isFirstTimeLogin') == "false") {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('signinStudy', {
					isFrom : "passwordScreen"
				});
				
			} else {
				Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('signin');
			}
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
	Ti.API.info('updateHealthData*****');
	var credentials = Alloy.Globals.getCredentials();
	if (credentials.userId == null || credentials.userId == "" || credentials.userId == 0) {
			return;
	}
	
	
	if(OS_IOS){
		sampleHealthkit.getHealthDatas(getHealthDataSuccess);
	}else{
	var diff = 0;
	var curTime = new Date().getTime();
	var setTime = Ti.App.Properties.getString('healthUpdate', "");

	if (setTime != "") {
		
		diff = curTime - parseInt(setTime);
	}
	
	
	if (diff != 0 && diff < 3600000) {
		return;
	}
		healthData.getHealthDatas(getHealthDataSuccess);
	}
	
	if(OS_IOS){
		setTimeout(updateHealthDataValues, 12000);
	}
	
	
}
function  updateHealthDataValues () {
	var credentials = Alloy.Globals.getCredentials();
	if(healthKitParam.length!=0){
		 if (Ti.Network.online) {
			
				serviceManager.saveUserHealthDetailData(credentials.userId,healthParam,healthKitParam,onSaveUserHealthDataSuccess, onSaveUserHealthDataFailure);
		
			
		
	}
		
	}
 
}

function getHealthDataSuccess (e,healthkit) {
	try{
		
		var diff = 0;
	var curTime = new Date().getTime();
	var setTime = Ti.App.Properties.getString('healthUpdate', "");

	if (setTime != "") {
		
		diff = curTime - parseInt(setTime);
	}
	
	if (diff != 0 && diff < 3600000) {
		return;
	}
	var credentials = Alloy.Globals.getCredentials();
	
healthKitParam=healthkit;
 healthParam=e;
	
	
	if (Ti.Network.online) {
		if(healthParam.length != 0){
				serviceManager.saveUserHealthData(credentials.userId,healthParam,onSaveUserHealthDataSuccess, onSaveUserHealthDataFailure);
			
			}
		
	}
	}catch(ex) {
		commonFunctions.handleException("index", "getHealthDataSuccess", ex);
	}
  
}
function onSaveUserHealthDataSuccess (e) {
	var curTime = new Date().getTime();
	
	Ti.App.Properties.setString('healthUpdate', curTime);
  
}
function onSaveUserHealthDataFailure (e) {
	
  
}
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
$.splashScreenWindow.addEventListener('android:back', function() {
	try {
		
		return false;
	} catch(ex) {
		commonFunctions.handleException("signin", "android-back", ex);
	}

});
Ti.App.addEventListener("app:exitApp", exitApp);
function exitApp() {
	try {
		
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('home');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('welcomeContentScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('welcomeScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('signin');
		$.splashScreenWindow.exitOnClose = true;
		var activity = Titanium.Android.currentActivity;
		activity.finish();
		$.splashScreenWindow.close();
		
		
	} catch(ex) {
		var activity = Titanium.Android.currentActivity;
		activity.finish();

	}
}



