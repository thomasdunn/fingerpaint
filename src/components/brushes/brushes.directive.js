'use strict';
/*jshint esnext: true */

import BrushesController from '../components/brushes/brushes.controller';

function fingerpaintBrushes() {
	var directive = {
			restrict: 'EA',
			scope: true,
			replace: true,
			templateUrl: 'components/brushes/brushes.html',
			controllerAs: 'vm',
			controller: BrushesController,
			link: linkFunction
		};

	return directive;

	function linkFunction(scope, element, attrs, vm) {


	}
}

export default fingerpaintBrushes;
