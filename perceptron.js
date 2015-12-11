'use strict';

/**
 * @author Reese Schultz
 */

(function() {
	/**************************
	***************************
	***PERCEPTRON CONTROLLER***
	**************************/

	// Declare variables:
	var weights = [0.3, 0.1],
			threshold = 0.2,	// AKA theta
			numEpochs = 5,
			inputs = [],
			error = 0,
			desiredOutput = 0,
			dimensions = 2,
			actualOutput = 0,
			learningRate = 0.1, // AKA alpha
			activationName = 'step',
			operationName = 'or',

	// Declare (view) variables:
			tableBody = document.getElementById('tableBody'),
			tableRow,
			tableElement,
			tableElementContent;

	// Run program with default parameters when first opening application:
	init();

	/**
	 * Define program.
	 */
	function init() {
		// Validate, clean up control variables and view.
		if (tableBody.firstChild) { // On initiating from 'learn' button.
			// Reset and validate numEpochs:
			if ($('#epochs').val() && $('#epochs').val() >= 0 && $('#epochs').val() <= 1000 && $('#epochs').val() % 1 === 0)
				numEpochs = parseInt($('#epochs').val());
			else {
				$('#epochs').val('5');
				numEpochs = 5;
			}

			// Reset and validate learningRate:
			if ($('#learningRate').val() && $('#learningRate').val() >= 0 && $('#learningRate').val() <= 1)
				learningRate = $('#learningRate').val();
			else {
				$('#learningRate').val('0.1');
				learningRate = 0.1;
			}

			// Reset and validate threshold:
			if ($('#threshold').val() && $('#threshold').val() >= -1 && $('#threshold').val() <= 1)
				threshold = $('#threshold').val();
			else {
				$('#threshold').val('0.2');
				threshold = 0.2;
			}

			// Reset and validate activationName:
			if ($('#activationName').val() === 'step') activationName = 'step';
			else if ($('#activationName').val() === 'sign') activationName = 'sign';
			else if ($('#activationName').val() === 'sigmoid') activationName = 'sigmoid';
			else if ($('#activationName').val() === 'linear') activationName = 'linear';
			else activationName = 'step';

			// Reset and validate operationName:
			if ($('#operationName').val() === 'or') operationName = 'or';
			else if ($('#operationName').val() === 'and') operationName = 'and';
			else if ($('#operationName').val() === 'xor') operationName = 'xor';
			else operationName = 'or';

			// Reset and validate weights:
			weights = [].splice(0);

			if ($('#randomizeWeights').is(':checked')) {
				weights = [parseFloat((Math.random() - 0.5).toFixed(3)), parseFloat((Math.random() - 0.5).toFixed(3))].splice(0);
				if (dimensions === 3) weights.push(parseFloat((Math.random() - 0.5).toFixed(3)));
			} else {
				if (parseFloat($('#weight1').val()) && parseFloat($('#weight1').val()) >= -0.5 && parseFloat($('#weight1').val()) <= 0.5)
					weights.push(parseFloat($('#weight1').val()));
				else {
					weights.push(0.3);
					$('#weight1').val('0.3');
				}

				if (parseFloat($('#weight2').val()) && parseFloat($('#weight2').val()) >= -0.5 && parseFloat($('#weight2').val()) <= 0.5)
					weights.push(parseFloat($('#weight2').val()));
				else {
					weights.push(0.1);
					$('#weight2').val('0.1');
				}

				if (dimensions === 3 && parseFloat($('#weight3').val()) && parseFloat($('#weight3').val()) >= -0.5 && parseFloat($('#weight3').val()) <= 0.5)
					weights.push(parseFloat($('#weight3').val()));
				else if (dimensions === 3 && !parseFloat($('#weight3').val())) {
					weights.push(0.3);
					$('#weight3').val('0.3');
				}
			}

			// Reset inputs:
			inputs = [].splice(0);

			// Reset table:
			while (tableBody.firstChild)
				tableBody.removeChild(tableBody.firstChild);
		}

		// Get every combination of inputs (zero and one):
		if (dimensions === 2)
			for (var i = 0; i <= dimensions - (dimensions - 1); ++i)
				for (var j = 0; j <= dimensions - (dimensions - 1); ++j)
					inputs.push([i, j]);
		else // dimensions === 3
			for (var i = 0; i <= dimensions - (dimensions - 1); ++i)
				for (var j = 0; j <= dimensions - (dimensions - 1); ++j)
					for (var k = 0; k <= dimensions - (dimensions - 1); ++k)
						inputs.push([i, j, k]);

		// Iterate with the actual steps of the algorithm:
		for (var i = 1; i <= numEpochs; ++i) { // For each epoch...
			for (var j = 0; j < inputs.length; ++j) { // For each combination of inputs in a given epoch...
				// Get current weights for printing later:
				var currentWeights = weights.toString().replace(/,/g, ', ');

				// Update control variables:
				desiredOutput = calcDesiredOutput(inputs[j], operationName);
				actualOutput = activate(inputs[j], weights, threshold, activationName);
				error = calcError(desiredOutput, actualOutput);
				weights = trainWeight(inputs[j], weights, threshold, learningRate, error).splice(0);

				// Additionally, update view:
				tableRow = document.createElement('tr');
				appendToTable([i + "." + (j + 1), inputs[j].toString().replace(/,/g, ', '), desiredOutput, currentWeights, actualOutput, error]);
			}
		}
	}

	/**********************
	***********************
	***PERCEPTRON EVENTS***
	***********************/

	// Handle sticky table header:
	$('.responsive-table').floatThead();

	// Handle form hide/unhide events for view:
	$('#weight3Box').hide();
	$('#higherDimensionWarning').hide();

	$('#dimensions').change(function() {
		dimensions = parseInt($('#dimensions').val(), 10);

		if ($('#randomizeWeights').is(':checked')) {
			$('#weight3Box').hide();
			if (dimensions === 2) $('#higherDimensionWarning').hide();
			if (dimensions === 3) $('#higherDimensionWarning').show();
		} else if (dimensions === 2) {
			$('#weight3Box').hide();
			$('#higherDimensionWarning').hide();
		} else if (dimensions === 3) {
			$('#weight3Box').show();
			$('#higherDimensionWarning').show();
		}

		// Must reset floatThead so it adjusts to new positioning:
		$('.responsive-table').floatThead('destroy');
		$('.responsive-table').floatThead();
	});

	$('#randomizeWeights').change(function(){
		if ($(this).is(':checked')) {
			$('#weight1Box').hide();
			$('#weight2Box').hide();
			if (dimensions === 3) $('#weight3Box').hide();
		} else {
			$('#weight1Box').show();
			$('#weight2Box').show();
			if (dimensions === 3) $('#weight3Box').show();
		}

		// Must reset floatThead so it adjusts to new positioning:
		$('.responsive-table').floatThead('destroy');
		$('.responsive-table').floatThead();
	});

	// Run program on 'learn' button click:
	$('#learnButton').click(init);

	/*********************************
	**********************************
	***PERCEPTRON UTILITY FUNCTIONS***
	**********************************/

	/**
	 * Add control variable states at a given iteration from an array to the body of an HTML table.
	 * @param {array} elements
	 */
	function appendToTable(elements) {
		for (var i = 0; i < elements.length; ++i) {
			tableElement = document.createElement('td');
			tableElementContent = document.createTextNode(elements[i]);
			tableElement.appendChild(tableElementContent);
			tableRow.appendChild(tableElement);
			tableBody.appendChild(tableRow);
		}
	}
})();
