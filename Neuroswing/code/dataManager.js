inlets = 1;		// incoming data or bang action
outlets = 3;	// last data + N data + all data

var dataCollection = [];
var timeCollection = [];
var time0 = 0;

function reset(bang) {
	var d = new Date();
	time0 = d.getTime();	// reset timer (ms)
	timeCollection = [];	// reset time collection
	dataCollection = [];	// reset data collection
}

function pushData(data_) {
	// Push data
	dataCollection.push(data_);
			
	// Get time
	var d = new Date();
	timeMs_ = d.getTime();	// current time in ms
	timeMs_ -= time0;
	timeCollection.push(timeMs_);
	
	outlet(0, dataCollection[dataCollection.length - 1]);	// output last data
	outlet(1, dataCollection.length);						// output number of data
}

function getAllData(bang) {
	outlet(2, 666);						// output data collection
}