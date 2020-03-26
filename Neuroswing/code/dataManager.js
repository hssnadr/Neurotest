inlets = 1;		// incoming data or bang action
outlets = 3;	// Current angle + Range + all data

var dataCollection = [];	// store all data to be export
var timeCollection = [];
var oldGyrX = 0.0;
var time0 = 0.0;
var minAngle = 0.0;
var maxAngle = 0.0;

function reset(bang) {
	dataCollection = [];	// reset data collection
	
	// Reset time 0
	var d = new Date();
	time0 = d.getTime();	// millsecond
	time0 *=  1e-3;			// convert in second
}

function dataManager(sdata_) {
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
		outlet(1, [gyrX_, t_, dataCollection.length, Math.PI]);
		//outlet(1, maxAngle - minAngle);
		
		// Update stored values
		oldGyrX = gyrX_;
	}
}

function pushAllFormatData(bang) {
	// to do
	outlet(2, dataCollection[dataCollection.length - 1]);
}