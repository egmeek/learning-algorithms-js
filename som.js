'use strict';

/**
 * @author Reese Schultz
 */

/*******************
********************
***SOM CONTROLLER***
********************/

// Start the program:
init();

// Define program and its scope:
function init() {
	// Declare variables:
	var canvas = document.getElementById('som'),
			context = canvas.getContext('2d'),
			numWeights = 50,
			nodeSize = 5,
			weights = generateRandMatrix(numWeights),
			learningRate = 0.1,
			input,
			winnerIndex,
			lastDistance,
			thisDistance,
			weightCorrection;

	// Adjust width and height of canvas visualization:
	canvas.width = window.innerWidth / 3;
	canvas.height = window.innerWidth / 3;

	// Start the program loop:
	step();

	/**
		* Main program loop.
		*/
	function step() {
		// Clear the frame:
		context.clearRect(0, 0, canvas.width, canvas.height);

		// Initialize variables:
		input = [Math.random(), Math.random()];
		winnerIndex = 0; // Winning neuron; least distance away from input.
		lastDistance = 1;
		thisDistance = 1;

		// Draw input:
		drawVector(canvas, context, input, nodeSize * 2, '#4db6ac');

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
			weightCorrection = [0, 0];

			if (neighbors(weights[j], weights[winnerIndex], 0.05)) {
				weightCorrection[0] = learningRate * (input[0] - weights[j][0]); // x-component
				weightCorrection[1] = learningRate * (input[1] - weights[j][1]); // y-component
			}

			// Update synaptic weights:
			weights[j][0] += weightCorrection[0]; // x-component
			weights[j][1] += weightCorrection[1]; // y-component

			// Draw weight:
			drawVector(canvas, context, [weights[j][0], weights[j][1]], nodeSize, '#000');
		}

		// Request new frame:
		window.requestAnimationFrame(step);
	}
}

/***************
****************
***SOM EVENTS***
****************/

$('#resetButton').click(init);

/**************************
***************************
***SOM UTILITY FUNCTIONS***
***************************/

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
	* Draw a vector onto the canvas.
	* @param {canvas} canvas
	* @param {canvas} context
	* @param {array} vector
	* @param {number} nodeSize
	* @param {string} color
	*/
function drawVector(canvas, context, vector, nodeSize, color) {
	context.fillStyle = color;
	context.fillRect(vector[0] * canvas.width, vector[1] * canvas.height, nodeSize, nodeSize);
}

/**
	* Generate a randomized matrix with num vectors within bound.
	* @param {number} num
	* @param {number} bound
	* @returns {array}
	*/
function generateRandMatrix(num) {
	var matrix = [];

	for (var i = 0; i < num; ++i)
		matrix.push([0.25 + Math.random() / 2, 0.25 + Math.random() / 2]);

	return matrix;
}
