/**
 * @author reesington / codepen.io/reesington
 */

var canvas = document.getElementById('som'),
		context = canvas.getContext('2d'),
		numWeights = 50,
		nodeSize = 5,
		weights = generateRandMatrix(numWeights),
		learningRate = 0.1,
		input,
		winnerIndex,
		lastDistance,
		thisDistance;

canvas.width = window.innerWidth / 3;
canvas.height = window.innerWidth / 3;

step(); // Start the program.

/**
	* Main program loop.
	*/
function step() {
	// Initialize variables:
	input = [Math.random(), Math.random()];
	winnerIndex = 0; // Winning neuron; least distance away from input.
	lastDistance = 1;
	thisDistance = 1;

	// Activation and similarity matching:
	for (var j = 0; j < weights.length; ++j) {
		thisDistance = euclidDist(input, weights[j]);

		if (thisDistance < lastDistance) {
			winnerIndex = j;
			lastDistance = thisDistance;
		}
	}

	// Learning:
	for (j = 0; j < weights.length; ++j) {
		// Find weight correction:
		var weightCorrection = [0, 0];

		if (neighbors(weights[j], weights[winnerIndex], 0.05)) {
			weightCorrection[0] = learningRate * (input[0] - weights[j][0]); // x-component
			weightCorrection[1] = learningRate * (input[1] - weights[j][1]); // y-component
		}

		// Update synaptic weights:
		weights[j][0] += weightCorrection[0]; // x-component
		weights[j][1] += weightCorrection[1]; // y-component
	}

	draw(canvas, context, weights, nodeSize);

	window.requestAnimationFrame(step);
}

/**
	* Rectangular neighborhood function to determine if vector's within bounds centered on winner.
	* @param {array} vector
	* @param {array} winner
	* @returns {boolean}
	*/
function neighbors(vector, winner, margin) {
	if (vector[0] > winner[0] - margin && vector[0] < winner[0] + margin && // x-component
			vector[1] > winner[1] - margin && vector[1] < winner[1] + margin) // y-component
		return true;

	return false;
}

/**
	* Draw a matrix onto the canvas.
	* @param {canvas} canvas
	* @param {canvas} context
	* @param {array} weights
	* @param {number} nodeSize
	*/
function draw(canvas, context, weights, nodeSize) {
	context.clearRect(0, 0, canvas.width, canvas.height);

	for (var i = 0; i < weights.length; ++i)
		context.fillRect(weights[i][0] * canvas.width, weights[i][1] * canvas.height, nodeSize, nodeSize);
}

/**
	* Generate a randomized matrix with num vectors.
	* @param {number} num
	* @returns {array}
	*/
function generateRandMatrix(num) {
	var matrix = [];

	for (var i = 0; i < num; ++i)
		matrix.push([Math.random(), Math.random()]); // Between 0 and 1.

	return matrix;
}
