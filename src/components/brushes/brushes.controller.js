'use strict';
/*jshint esnext: true */

class BrushesController {
  constructor ($scope) {
    $scope.date = new Date();
  }
}

BrushesController.$inject = ['$scope'];

export default BrushesController;
