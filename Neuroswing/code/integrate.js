inlets = 1;
outlets = 1;
integral = 0.0;
oldData = 0.0;
oldt = -1;

function reset(bang) {
	integral = 0.0;
	oldData = 0.0;
	oldt = -1;
}

function integrate(data_) {
	var d = new Date();
	var t_ = d.getTime(); // get current time (ms)
	
	if(oldt != -1) {
		var dt_ = (t_ - oldt) * 1e-3;
		var intg_ = oldData * dt_;
		intg_ += (data_ - oldData) * dt_ / 2.0;
		
		integral += intg_;	// update integral
	}
	
	outlet(0, integral);	// output current integral
	
	oldDat = data_;			// Update values
	oldt = t_;
}