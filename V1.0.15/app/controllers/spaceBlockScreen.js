// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = arguments[0] || {};
/**
 * Variable Declaration
 */
var commonFunctions = require('commonFunctions');
var serviceManager = require('serviceManager');
var commonDB = require('commonDB');
var credentials = Alloy.Globals.getCredentials();
var currentImage = 1;
var isClicked = true;
var onSelect=true;
var selectedImage;
var selectedImageContent="";
var selectedImageEnglishContent="";
var selectedEnglishContent="";
var selectedContent="";
var locationParam;
var locationTxt="";
var selectedTextFinal="";
var LangCode = Ti.App.Properties.getString('languageCode');
var isPeopleEnable=false;
if (args.backDisable != null && args.backDisable == true) {
	$.headerView.setLeftViewVisibility(false);
}

var currentLatitude;
var currentLongitude;

/**
 * Screen open function
 */
$.spaceBlockScreen.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
		if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
			$.headerContainer.height = "80dp";
			$.MainView.top = "80dp";
			$.footerView.bottom="10dp";
		}
	}
		if (args.backDisable != null && args.backDisable == true) {
			var curTime	= new Date().getTime();
			Ti.App.Properties.setString('EnvTime', curTime);
		}
		$.headerView.setTitle(commonFunctions.L('environmentTitle', LangCode));
		$.spaceLabel.text=commonFunctions.L('whereLbl', LangCode);
		$.homeLbl.text=commonFunctions.L('homeLbl', LangCode);
		$.schoolLbl.text=commonFunctions.L('SchoolLbl', LangCode);
		$.wrkLbl.text=commonFunctions.L('wrkLbl', LangCode);
		$.clicnicLbl.text=commonFunctions.L('clicnicLbl', LangCode);
		$.outsideLbl.text=commonFunctions.L('outsideLbl', LangCode);
		$.diningLbl.text=commonFunctions.L('shopingLbl', LangCode);
		$.trainLbl.text=commonFunctions.L('trainLbl', LangCode);
		$.aloneLbl.text=commonFunctions.L('aloneLbl', LangCode);
		$.frndLbl.text=commonFunctions.L('friendsLbl', LangCode);
		$.crowdLbl.text=commonFunctions.L('incrowdLbl', LangCode);
		$.familyLbl.text=commonFunctions.L('familyLbl', LangCode);
		$.peerLbl.text=commonFunctions.L('withPeersLbl', LangCode);
		$.submitLabel.text=commonFunctions.L('submitLbl', LangCode);
		$.peopleLabel.text=commonFunctions.L('whowithLbl', LangCode);
		$.pictureLabel.text=commonFunctions.L('pictureLabel', LangCode);
		 getCurrentLocation()
		setTimeout(function() {
			$.MainView.visible = true;
		}, 100);
	} catch(ex) {
		commonFunctions.handleException("spaceBlockScreen", "open", ex);
	}
});
/**
 * function for getting current location
 */

function getCurrentLocation() {
	try {
		locationTxt = "Not Available.";
		
		Ti.API.info('Ti.Geolocation.locationServicesEnabled : ',Ti.Geolocation.locationServicesEnabled);
		if (Ti.Geolocation.locationServicesEnabled) {
			Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
			Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
			Titanium.Geolocation.distanceFilter = 0;
			if (OS_IOS) {
				Ti.Geolocation.activityType = Titanium.Geolocation.ACTIVITYTYPE_OTHER;
			}
			
			Titanium.Geolocation.getCurrentPosition(function(e) {
				if (e.error) {
					Ti.API.info('error : ',JSON.stringify(e));
					
					onCurrentPositionError();

				} else {
					//You will get the current latitude and longitude from e.coords
					onCurrentPositionSuccess(e.coords);
				}
			});
		} else {

			commonFunctions.showAlert(commonFunctions.L('enableLocation', LangCode));
			

		}
	} catch(ex) {
		commonFunctions.handleException("space block", "getCurrentLocation", ex);
	}
}

/**
 * Get GPS current position details
 */
function onCurrentPositionSuccess(e) {
	try {
		currentLatitude = e.latitude;
		currentLongitude = e.longitude;
		
		geocode(e.latitude, e.longitude);

	} catch(e) {
		commonFunctions.handleException("onCurrentPositionSuccess", "spaceblockscreen", e);
	}
}

/**
 * GPS error
 */
function onCurrentPositionError(e) {
	commonFunctions.showAlert(commonFunctions.L('enableLocation', LangCode));
}

/*** Fetching location from google api to show address *****/

function geocode(latitude, longitude) {
	try {
	var street,city,state,country,postalCode;
	var loc;
  	var addrUrl = "https://maps.googleapis.com/maps/api/geocode/json?sensor=true&latlng="+latitude+","+longitude+"&key="+Alloy.Globals.GOOGLEKEY+"";

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

 	};
 } catch (ex) {
		commonFunctions.handleException("spaceblockScreen", "geocode", ex);
	}
}


/**
 * on Back button click
 */
$.headerView.on('backButtonClick', function(e) {
	goBack();
});

/**
 * on right button click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});

function goBack(e) {
	try {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('spaceBlockScreen');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && parentWindow.windowName === "home") {
			parentWindow.window.refreshHomeScreen();
		}

	} catch(ex) {
		commonFunctions.handleException("spaceBlockScreen", "goBack", ex);
	}

}

/**
 * function for android back
 */
$.spaceBlockScreen.addEventListener('android:back', function() {
	goBack();
});

/**
 * On picture click function
 */
function onPictureClick(e) {
	try {
		isClicked = false;
		$.pictureLabel.text = commonFunctions.L('whowithLbl', LangCode);
		$.peopleView.touchEnabled=true;
		isPeopleEnable=true;
		if (e.source.id == "blockImageView1") {
			$.checkImage1.visible=true;
			$.checkImage2.visible=false;
			$.checkImage3.visible=false;
			$.checkImage4.visible=false;
			$.checkImage5.visible=false;
			$.checkImage6.visible=false;
			$.checkImage7.visible=false;
			selectedImage="/images/environment/home_sm.png";
			selectedImageContent= commonFunctions.L('atLbl', LangCode)+ " " +commonFunctions.L('homeLbl', LangCode);
			selectedImageEnglishContent=commonFunctions.L('atLbl',"en")+" "+commonFunctions.L('homeLbl', "en");
			
		} else if (e.source.id == "blockImageView2") {
			$.checkImage1.visible=false;
			$.checkImage2.visible=true;
			$.checkImage3.visible=false;
			$.checkImage4.visible=false;
			$.checkImage5.visible=false;
			$.checkImage6.visible=false;
			$.checkImage7.visible=false;
			selectedImage="/images/environment/school_sm.png";
			selectedImageContent=commonFunctions.L('inLbl', LangCode)+" "+commonFunctions.L('SchoolLbl', LangCode);
			selectedImageEnglishContent=commonFunctions.L('inLbl',"en")+" "+commonFunctions.L('SchoolLbl', "en");
			
		} else if (e.source.id == "blockImageView3") {
			$.checkImage1.visible=false;
			$.checkImage2.visible=false;
			$.checkImage3.visible=true;
			$.checkImage4.visible=false;
			$.checkImage5.visible=false;
			$.checkImage6.visible=false;
			$.checkImage7.visible=false;
			selectedImage="/images/environment/work_sm.png";
			selectedImageContent=commonFunctions.L('atLbl', LangCode)+" "+commonFunctions.L('wrkLbl', LangCode);
			selectedImageEnglishContent=commonFunctions.L('atLbl', "en")+" "+commonFunctions.L('wrkLbl', "en");
		} else if (e.source.id == "blockImageView4") {
			$.checkImage1.visible=false;
			$.checkImage2.visible=false;
			$.checkImage3.visible=false;
			$.checkImage4.visible=true;
			$.checkImage5.visible=false;
			$.checkImage6.visible=false;
			$.checkImage7.visible=false;
			selectedImage="/images/environment/health_sm.png";
			selectedImageContent=commonFunctions.L('inLbl', LangCode)+" "+commonFunctions.L('clicnicLbl', LangCode);
			selectedImageEnglishContent=commonFunctions.L('inLbl', "en")+" "+commonFunctions.L('clicnicLbl', "en");
				
		} else if (e.source.id == "blockImageView5") {
			$.checkImage1.visible=false;
			$.checkImage2.visible=false;
			$.checkImage3.visible=false;
			$.checkImage4.visible=false;
			$.checkImage5.visible=true;
			$.checkImage6.visible=false;
			$.checkImage7.visible=false;
			selectedImage="/images/environment/outside_sm.png";
			selectedImageContent=commonFunctions.L('outsideLbl', LangCode);
			selectedImageEnglishContent=commonFunctions.L('outsideLbl', "en");
		} else if (e.source.id == "blockImageView6") {
			$.checkImage1.visible=false;
			$.checkImage2.visible=false;
			$.checkImage3.visible=false;
			$.checkImage4.visible=false;
			$.checkImage5.visible=false;
			$.checkImage6.visible=true;
			$.checkImage7.visible=false;
			selectedImage="/images/environment/shopping_sm.png";
			selectedImageContent=commonFunctions.L('shopingLbl', LangCode);
			selectedImageEnglishContent=commonFunctions.L('shopingLbl', "en");
		}else if (e.source.id == "blockImageView7") {
			$.checkImage1.visible=false;
			$.checkImage2.visible=false;
			$.checkImage3.visible=false;
			$.checkImage4.visible=false;
			$.checkImage5.visible=false;
			$.checkImage6.visible=false;
			$.checkImage7.visible=true;
			selectedImage="/images/environment/car_sm.png";
			selectedImageContent=commonFunctions.L('inLbl', LangCode)+" "+commonFunctions.L('trainLbl', LangCode);
			selectedImageEnglishContent=commonFunctions.L('inLbl',"en")+" "+commonFunctions.L('trainLbl', "en");
			
		} 
		else {
			isClicked = true;
		}
		$.environmentScrollView.scrollToBottom();
		$.selectedImage.image=selectedImage;
		if(selectedContent!="" && selectedImageContent!=""){
			$.selectedLabel.text=commonFunctions.L('iamLbl', LangCode)+" "+selectedImageContent+" " + selectedContent;
			selectedTextFinal=commonFunctions.L('iamLbl', "en")+" "+selectedImageEnglishContent+" " + selectedEnglishContent;
			
		}
		else if(selectedImageContent!=""){
			$.selectedLabel.text=commonFunctions.L('iamLbl', LangCode)+" "+selectedImageContent+"";
			selectedTextFinal=commonFunctions.L('iamLbl', "en")+" "+selectedImageEnglishContent+"";
		}
		Ti.API.info('image content is',selectedTextFinal);
		

	} catch(ex) {
		commonFunctions.handleException("spaceBlockScreen", "onPictureClick", ex);
	}
}
/**
 * on content selection
 */
function onSelectPeopleClick(e){
	if(isPeopleEnable == false){
		return;
	}
	onSelect = false;
	$.pictureLabel.visible = false;
	$.submitButton.visible=true;
	Ti.API.info('alert is' +JSON.stringify(e.source.id));
	if(e.source.id == "innerView1"){
			$.checkBox1.image ="/images/environment/checkbox_check.png";
			$.checkBox2.image ="/images/environment/checkbox_uncheck.png";
			$.checkBox3.image ="/images/environment/checkbox_uncheck.png";
			$.checkBox4.image ="/images/environment/checkbox_uncheck.png";
			$.checkBox5.image ="/images/environment/checkbox_uncheck.png";
			selectedContent=commonFunctions.L('aloneLbl', LangCode);
			selectedEnglishContent=commonFunctions.L('aloneLbl', "en");
			
		}else if(e.source.id == "innerView2"){
			$.checkBox1.image ="/images/environment/checkbox_uncheck.png";
			$.checkBox2.image ="/images/environment/checkbox_check.png";
			$.checkBox3.image ="/images/environment/checkbox_uncheck.png";
			$.checkBox4.image ="/images/environment/checkbox_uncheck.png";
			$.checkBox5.image ="/images/environment/checkbox_uncheck.png";
			selectedContent=commonFunctions.L('incrowdLbl', LangCode);
			selectedEnglishContent=commonFunctions.L('incrowdLbl', "en");
				
		}else if(e.source.id == "innerView3"){
			$.checkBox1.image ="/images/environment/checkbox_uncheck.png";
			$.checkBox2.image ="/images/environment/checkbox_uncheck.png";
			$.checkBox3.image ="/images/environment/checkbox_check.png";
			$.checkBox4.image ="/images/environment/checkbox_uncheck.png";
			$.checkBox5.image ="/images/environment/checkbox_uncheck.png";
			selectedContent=commonFunctions.L('withPeersLbl', LangCode);
			selectedEnglishContent=commonFunctions.L('withPeersLbl', "en");
				
		}else if(e.source.id == "innerView4"){
			$.checkBox1.image ="/images/environment/checkbox_uncheck.png";
			$.checkBox2.image ="/images/environment/checkbox_uncheck.png";
			$.checkBox3.image ="/images/environment/checkbox_uncheck.png";
			$.checkBox4.image ="/images/environment/checkbox_check.png";
			$.checkBox5.image ="/images/environment/checkbox_uncheck.png";
			selectedContent=commonFunctions.L('friendsLbl', LangCode);
			selectedEnglishContent=commonFunctions.L('friendsLbl', "en");
				
		}else if(e.source.id == "innerView5"){
			$.checkBox1.image ="/images/environment/checkbox_uncheck.png";
			$.checkBox2.image ="/images/environment/checkbox_uncheck.png";
			$.checkBox3.image ="/images/environment/checkbox_uncheck.png";
			$.checkBox4.image ="/images/environment/checkbox_uncheck.png";
			$.checkBox5.image ="/images/environment/checkbox_check.png";
			selectedContent=commonFunctions.L('familyLbl', LangCode);
			selectedEnglishContent=commonFunctions.L('familyLbl', "en");
		}
		
		else{
			onSelect = true;
		}
		if(selectedContent!="" && selectedImageContent!=""){
			$.selectedLabel.text=commonFunctions.L('iamLbl', LangCode)+ " "+selectedImageContent+" " +selectedContent;
			selectedTextFinal=commonFunctions.L('iamLbl', "en")+ " "+selectedImageEnglishContent+" " +selectedEnglishContent;
		}else if(selectedContent!=""){
			$.selectedLabel.text=" "+selectedContent;
			selectedTextFinal=" "+selectedEnglishContent;
		}
}

/**
 * On picture submit function
 */
function onPictureSubmit() {
	try {
		if(locationTxt!=null && locationTxt!=""){
			 locationParam={
				"UserID" : credentials.userId,
				"LocationName" :selectedTextFinal ,
				"Address" : locationTxt,
				"Type":2,
				"Latitude": currentLatitude,
  				"Longitude": currentLongitude
			}
			if (Ti.Network.online) {
				commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
				serviceManager.saveUserLocation(locationParam,onSaveUserLocationSuccess,onSaveUserLocationFailure);
			} else {
				commonFunctions.closeActivityIndicator();
				commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode), function() {
					onSaveUserLocationFailure();

				});
				//commonFunctions.showAlert(L('noNetwork'));
			}
		}else{
			commonFunctions.closeActivityIndicator();	
			//if (args.surveyID===1) {
				//commonFunctions.showConfirmation(commonFunctions.L('helpconfirmation', LangCode), ['Later', commonFunctions.L('yes', LangCode)],onYesClick,onLaterClick);
			//}else{
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('spaceBlockScreen');
				var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
				if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
					parentWindow.window.refreshHomeScreen();
				}

			//}
				
		}
	}catch(ex) {
		commonFunctions.handleException("spaceBlockScreen", "onPictureSubmit", ex);
	}
}

/**
 * function for yes click
 */
var onYesClick = function(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('helpScreen');
	if(OS_IOS){
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('spaceBlockScreen');
		}, 2000);
	}else{
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('spaceBlockScreen');
	}
	
	
	
};
/**
 * function for later click
 */
var onLaterClick = function(e) {
	try{
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('spaceBlockScreen');
	}catch(ex){
		commonFunctions.handleException("spaceblock", "onLaterClick", ex);
	}
};

/**
 * success api call
 */
function onSaveUserLocationSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		Ti.API.info('***SAVE USER LOCATION SUCCESS  RESPONSE****  ', JSON.stringify(response));
		if (response.ErrorCode == 0) {	
			commonDB.saveLocationAdress(credentials.userId,$.selectedLabel.text,locationTxt,1);	
			if (args.surveyID===1) {
				commonFunctions.closeActivityIndicator();
				commonFunctions.showConfirmation(commonFunctions.L('helpconfirmation', LangCode), ['Later', commonFunctions.L('yes', LangCode)],onYesClick,onLaterClick);
			}else{
				commonFunctions.closeActivityIndicator();
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('spaceBlockScreen');
				var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
				if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
					parentWindow.window.refreshHomeScreen();
				}
			}
			
			
		} else {
			commonFunctions.closeActivityIndicator();
			commonFunctions.showAlert(response.ErrorMessage);
		}
	} catch(ex) {
		commonFunctions.handleException("spaceblock", "deleteAccount", ex);
	}
};
/**
 * Failure api call
 */
function onSaveUserLocationFailure(e) {
	commonFunctions.closeActivityIndicator();
	if (args.surveyID===1) {
		commonFunctions.showConfirmation(commonFunctions.L('helpconfirmation', LangCode), ['Later', commonFunctions.L('yes', LangCode)],onYesClick,onLaterClick);
	}else{	
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('spaceBlockScreen');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
			parentWindow.window.refreshHomeScreen();
		}
	}
};