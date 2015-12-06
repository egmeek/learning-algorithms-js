/**
 * @author reesington / codepen.io/reesington
 */

var canvas = document.getElementById('som'),
		context = canvas.getContext('2d'),
		numWeights = 20,
		nodeSize = 5,
		weights = generateWeightMatrix(numWeights);

canvas.width = window.innerWidth / 3;
canvas.height = window.innerWidth / 3;

draw(canvas, context, weights, nodeSize);

/**
	* Draw a matrix onto the canvas.
	* @param {canvas} canvas
	* @param {canvas} context
	* @param {array} weights
	* @param {number} nodeSize
	*/
function draw(canvas, context, weights, nodeSize) {
	for (var i = 0; i < weights.length; ++i)
		context.fillRect(weights[i][0] * canvas.width, weights[i][1] * canvas.height, nodeSize, nodeSize);
}

/**
	* Generate a randomized weight matrix with num weights.
	* @param {number} num
	* @returns {array}
	*/
function generateWeightMatrix(num) {
	var weights = [];

	for (var i = 0; i < num; ++i)
		weights.push([Math.random(), Math.random()]); // Between 0 and 1.

	return weights;
}
