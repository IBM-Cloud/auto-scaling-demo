// Gauge variables
var cpuGauge,
	memoryGauge,
	CPU_THRESHOLD = 50,
	MEM_THRESHOLD = 80,
	MAX_CPU_UTILIZATION = 100,
	STROKE_COLOR = '#E0E0E0',
	SAFE_COLOR = '#5596E6',
	DANGER_COLOR = '#FF5050';

// Initializes the gauge meter
function initGauge(isMem, gauge, initialVal, maxVal, gaugeElement, gaugeTextElement) {
	// If memory gauge
	if (isMem) {
		// If value is under threshold, set gauge color to green. Otherwise, set to red
		if (initialVal < MEM_THRESHOLD)
			newColor = SAFE_COLOR;
		else
			newColor = DANGER_COLOR;
	}
		// If CPU gauge
	else {
		// If value is under threshold, set gauge color to green. Otherwise, set to red
		if (initialVal < CPU_THRESHOLD)
			newColor = SAFE_COLOR;
		else
			newColor = DANGER_COLOR;
	}

	var initialOptions = {
		lines: 20, // The number of lines to draw
		angle: 0, // The angle of the ends of the gauge
		lineWidth: 0.45, // The thickness of the lines that make up the gauge semi-circle
		pointer: {
			length: .85, // The length of the pointer
			strokeWidth: 0.025, // The width of the pointer
			color: 'black'
		},
		limitMax: 'true',   // If true, the pointer will not go past the end of the gauge
		colorStart: newColor, // Color of the outer gauge
		colorStop: newColor, // Color of the inner gauge
		strokeColor: STROKE_COLOR,   // Color of the pointer
		generateGradient: true
	}
	gauge = new Gauge(document.getElementById(gaugeElement)).setOptions(initialOptions);
	gauge.setTextField(document.getElementById(gaugeTextElement));
	gauge.maxValue = maxVal;
	gauge.animationSpeed = 32;
	gauge.set(initialVal);
	return gauge;
};

// Update gauge values
function updateGauge(checkMem, gauge, curVal) {
	gauge.set(curVal);

	var newColor;
	// If memory gauge
	if (checkMem) {
		// If value is under threshold, set gauge color to green. Otherwise, set to red
		if (curVal < MEM_THRESHOLD)
			newColor = SAFE_COLOR;
		else
			newColor = DANGER_COLOR;
	}
		// If CPU gauge
	else {
		// If value is under threshold, set gauge color to green. Otherwise, set to red
		if (curVal < CPU_THRESHOLD)
			newColor = SAFE_COLOR;
		else
			newColor = DANGER_COLOR;
	}

	// Set updated options for gauge
	var updatedOptions = {
		lines: 20,
		angle: 0,
		lineWidth: 0.45,
		pointer: {
			length: .85,
			strokeWidth: 0.025,
			color: 'black'
		},
		limitMax: 'true',
		colorStart: newColor,
		colorStop: newColor,
		strokeColor: STROKE_COLOR,
		generateGradient: true
	}

	gauge.setOptions(updatedOptions);

	return gauge;
}

// Defines the prototype for the gauge options
var optionsPrototype = {
	lines: 20, // The number of lines to draw
	angle: 0, // The length of each line
	lineWidth: 0.45, // The line thickness
	pointer: {
		length: .85, // The radius of the inner circle
		strokeWidth: 0.025, // The rotation offset
		color: 'black' // Fill color
	},
	limitMax: 'true',   // If true, the pointer will not go past the end of the gauge
	colorStart: SAFE_COLOR,   // Colors
	colorStop: SAFE_COLOR,    // just experiment with them
	strokeColor: STROKE_COLOR,   // to see which ones work best for you
	generateGradient: true
}

// Options object constructor
function Options (){}
Options.prototype = optionsPrototype;

// Executes when the web page loads
$(function() {
	// Set the initial CPU and memory gauge parameters
	cpuGauge = initGauge(false, cpuGauge, initialCpuUsage, MAX_CPU_UTILIZATION, "canvas-gauge-1", "gauge-1-textfield");
	memoryGauge = initGauge(true, memoryGauge, initialUsedMem, totalMem, "canvas-gauge-2", "gauge-2-textfield");
});
