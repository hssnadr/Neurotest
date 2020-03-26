inlets = 1;		// incoming data or bang action
outlets = 4;	// Current angle + Range + all data + force carriage return for text file

var dataCollection = [];	// store all data to be export
var timeCollection = [];
var oldGyrX = 0.0;
var time0 = 0.0;
var minAngle = 0.0;
var maxAngle = 0.0;

// User info
var surname = "";
var nameUser = "";
var birthday = "";
var gender = "";
var height = "";
var weight = "";

function reset(bang) {
	dataCollection = [];	// reset data collection
	
	// Reset time 0
	var d = new Date();
	time0 = d.getTime();	// millsecond
	time0 *=  1e-3;			// convert in second
}

function dataManager(sdata_) {
	/*
	Receive real raw values
	integrate gyroscope to get real time angle
	store data into an array
	*/
	
	var data_ = sdata_.split(" ").map(Number); // Movuino raw data [accX, accY, accY, gyrX, gyrY, gyrZ, magX, magY, magZ]
	
	if(data_.length >= 6){
		// Get current time
		var d = new Date();
		var t_ = d.getTime();	// millsecond
		t_ *=  1e-3;			// convert in second
		t_ -= time0;			// offset to time start recording
	
		// Get gyroscope Euclidian norm
		var gyrX_ = 10.0 * data_[3];
	
		// Get current angle
		var cAngle_ = 0.0;	// init at 0.0		
		if(dataCollection.length > 0){
			// Get previous data
			var oldt_ = dataCollection[dataCollection.length - 1][0];		// time is stored at first index
			var oldAngl_ = dataCollection[dataCollection.length - 1][1];	// angle is stored at second index
		
			// integrate
			var dt_ = t_ - oldt_;
			var integral_ = oldGyrX * dt_;
			//integral_ += (gyrX_ - oldGyrX) * dt_ / 2.0;
			
			// Current angle (from radian to angle)
			cAngle_ = integral_;
			cAngle_ *= 180.0 / Math.PI;
			cAngle_ += oldAngl_;
			
			// Update range
			if(cAngle_ > maxAngle) {
				maxAngle = cAngle_;
			}
			if(cAngle_ < minAngle) {
				minAngle = cAngle_;
			}
		}
		else {
			// Init range
			maxAngle = cAngle_;
			minAngle = cAngle_;
		}
	
		// Store current data into data collection
		var s_ = [t_, cAngle_];	// push computed data
		s_ = s_.concat(data_);	// push Movuino raw data
		dataCollection.push(s_);
		
		// Output data for real time display
		outlet(0, cAngle_);
		outlet(1, maxAngle - minAngle);
		
		// Update stored values
		oldGyrX = gyrX_;
	}
}

function pushAllFormatData(userInfo_) {
	var info_ = userInfo_.split(" ");
	
	// NAME
	if(info_[0] != "Nom"){
		surname = info_[0];
	}
	else{
		surname = "-";
	}
	outlet(2, "Nom, " + surname);
	outlet(3, ""); // carriage return
	
	// SURNAME
	if(info_[1] != "Prénom"){
		nameUser = info_[1];
	}
	else{
		nameUser = "-";
	}
	outlet(2, "Prénom, " + nameUser);
	outlet(3, ""); // carriage return
	
	// BIRTHDAY
	if(info_[2] != "s"){
		birthday = info_[2];
	}
	else{
		birthday = "-";
	}
	outlet(2, "Date de naissance, " + birthday);
	outlet(3, ""); // carriage return
	
	// GENDER
	if(info_[3] != "s"){
		gender = info_[3];
	}
	else{
		gender = "-";
	}
	outlet(2, "Sexe, " + gender);
	outlet(3, ""); // carriage return
	
	// HEIGHT
	if(info_[4] != "s"){
		height = info_[4];
	}
	else{
		height = "-";
	}
	outlet(2, "Taille (cm), " + height);
	outlet(3, ""); // carriage return
	
	// WEIGHT
	if(info_[5] != "s"){
		weight = info_[5];
	}
	else{
		weight = "-";
	}
	outlet(2, "Poids (kg), " + weight);
	outlet(3, ""); // carriage return
	
	// DATA UNITS
	outlet(2, "time (s), angle (°), accX, accY, accZ, gyrX, gyrY, gyrZ");
	outlet(3, ""); // carriage return
	
	// DATA
	for(i=0; i<dataCollection.length; i++) {
		for(j=0; j<dataCollection[i].length; j++) {
			outlet(2, dataCollection[i][j]);		// send each stored data
			if(j < dataCollection[i].length-1){
				outlet(2, ',');						// separated by comas
			}
		}
		outlet(3, ""); 									// and push carriage return between each data lines
	}
}






