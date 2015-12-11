/**
 * @author Reese Schultz
 */

 /*******************
 ********************
 ***BAM CONTROLLER***
 ********************/

// Run program:
init();

// Define the program:
function init() {
	// Declare variables:
	var drawingCanvas = document.getElementById('drawing'),
			drawingContext = drawingCanvas.getContext('2d'),
			bamCanvas = document.getElementById('bam'),
			bamContext = bamCanvas.getContext('2d'),
			gridSize = 500,
			stepSize = gridSize / 5,
			valid = false,

			drawing = [ // User drawing; -1's are basically white space.
				[-1, -1, -1, -1, -1],
			  [-1, -1, -1, -1, -1],
			  [-1, -1, -1, -1, -1],
			  [-1, -1, -1, -1, -1],
			  [-1, -1, -1, -1, -1]
			],

			matrixA = [ // Input set of 5 x 5 matrices.
				[[-1, 1, 1, 1, -1], // A
				 [-1, 1, -1, 1, -1],
				 [-1, 1, 1, 1, -1],
				 [-1, 1, -1, 1, -1],
				 [1, 1, -1, 1, 1]],

				[[-1, 1, 1, 1, -1], // B
				 [-1, 1, -1, -1, 1],
				 [-1, 1, -1, 1, -1],
				 [-1, 1, -1, -1, 1],
				 [-1, 1, 1, 1, -1]],

				[[-1, -1, -1, -1, -1], // C
				 [-1, 1, 1, 1, -1],
				 [-1, 1, -1, -1, -1],
				 [-1, 1, 1, 1, -1],
				 [-1, -1, -1, -1, -1]],

				[[1, 1, 1, -1, -1], // D
				 [1, -1, -1, 1, -1],
				 [1, -1, -1, 1, -1],
				 [1, -1, -1, 1, -1],
				 [1, 1, 1, -1, -1]],

				[[-1, 1, 1, 1, 1], // E
				 [-1, 1, -1, -1, -1],
				 [-1, 1, 1, 1, -1],
				 [-1, 1, -1, -1, -1],
				 [-1, 1, 1, 1, 1]]
			],

			matrixB = [ // Output set of memory vectors.
				[[-1, 1, -1, 1, -1]], // A

				[[-1, 1, -1, -1, 1]], // B

				[[-1, 1, 1, 1, -1]], // C

				[[1, -1, -1, 1, -1]], // D

				[[-1, 1, -1, -1, -1]] // E
			];

	// Clear previous frame:
	drawingContext.clearRect(0, 0, 500, 500);
	bamContext.clearRect(0, 0, 500, 500);

	// Draw 5 x 5 grids on each canvas:
	drawGrid(drawingContext, gridSize);
	drawGrid(bamContext, gridSize);

	// Check that the matrices have vectors:
	if (matrixA.length > 0 && matrixB.length > 0) valid = true;

	// Check that all matrices have the same number of vectors (because they must be paired):
	valid = checkMatrixLength(matrixA, matrixB);

	// Check that all vectors belonging to the same set have the same length:
	if (valid && checkVectorLength(matrixA) && checkVectorLength(matrixB)) valid = true;

	if (valid === true) {
		var patternPairs = matrixA.length,
				weights = createMatrix(matrixA[0].length, matrixB[0].length);

		// Calculate weight matrix:
		for (var i = 0; i < patternPairs; ++i) // For each pattern pair...
			weights = add(weights, multiply(matrixA[i], transpose(matrixB[i])));
	} else {
		console.log("ERROR: Matrices were not properly inputted.");
	}

	/***************
	****************
	***BAM EVENTS***
	****************/

	$('#resetButton').click(init);

	drawingCanvas.addEventListener('contextmenu', function(event) {
		event.preventDefault();
	}, false);

	drawingCanvas.addEventListener('click', function(event) {
		event.preventDefault();

		var mouseX = Math.floor(event.pageX - $('#drawing').offset().left),
				mouseY = Math.floor(event.pageY - $('#drawing').offset().top),
				row = Math.ceil(mouseX / stepSize),
				col = Math.ceil(mouseY / stepSize);

		if (col > 5) col = 5;
		if (row > 5) row = 5;

		if (event.which === 1) drawing[col - 1][row - 1] = 1;
		else drawing[col - 1][row - 1] = -1;

		var recall = new Array(multiply(transpose(weights), drawing)[0].map(sign));

		// Get ideal matrix associated with drawing to draw on bamCanvas:
		for (i = 0; i < patternPairs; ++i) {
			if (matrixEquals(recall[0], matrixB[i][0])) {
				bamContext.clearRect(0, 0, 500, 500);
				drawGrid(bamContext, gridSize);
				drawMatrix(bamContext, matrixA[i], stepSize);

				break;
			} else {
				bamContext.clearRect(0, 0, 500, 500);
				drawGrid(bamContext, gridSize);
			}
		}

		redraw(drawingContext, drawing, gridSize, stepSize);
	}, false);
}

/**************************
***************************
***BAM UTILITY FUNCTIONS***
***************************/

/**
  * Redraws a given matrix on a given context.
  * @param {context} context
  * @param {array} matrix
  */
function redraw(context, matrix, gridSize, stepSize) {
	context.clearRect(0, 0, 500, 500);
	drawGrid(context, gridSize);
	drawMatrix(context, matrix, stepSize);
}

/**
  * Draws a given matrix on a given context.
  * @param {context} context
  * @param {array} matrix
  */
function drawMatrix(context, matrix, stepSize) {
	for (var i = 0; i < matrix.length; ++i) // Rows
		for (var j = 0; j < matrix[0].length; ++j) // Columns
			if (matrix[i][j] === 1)
				context.fillRect(j * stepSize, i * stepSize, j + stepSize, i + stepSize);
}

/**
  * Draws a grid on the given context.
  * @param {context} context
  */
function drawGrid(context, gridSize) {
	for (var i = 100; i < gridSize; i += 100) {
		context.beginPath() // Columns.
			context.moveTo(i, 0);
			context.lineTo(i, 500);
		context.closePath();

		context.stroke();

		context.beginPath() // Rows.
			context.moveTo(0, i);
			context.lineTo(500, i);
		context.closePath();

		context.stroke();
	}
}

/**
  * Tests if the given matrices are equal.
  * @param {array} A
  * @param {array} B
  * @returns {boolean}
  */
function matrixEquals(A, B) {
	if (!checkMatrixLength(A, B)) return false;

	for (var i = 0; i < A.length; ++i)
		if (A[i] !== B[i]) return false;

	return true;
}

/**
  * Tests the number of elements in the given matrices for equality.
  * @param {array} matrixA
  * @param {array} matrixB
  * @returns {boolean}
  */
function checkMatrixLength(matrixA, matrixB) {
	if (matrixA.length !== matrixB.length) return false;

	return true;
}

/**
  * Tests if a matrix's vectors all have the same dimension.
  * @param {array} matrix
  * @returns {boolean}
  */
function checkVectorLength(matrix) {
	var length = matrix[0].length;

	for (var i = 1; i < matrix.length; ++i)
		if (length !== matrix[i].length) return false;

	return true;
}
