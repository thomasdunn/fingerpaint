'use strict';
/*jshint esnext: true */

class CanvasController {
  constructor ($scope, toolsService) {
    
    // this.context - 2d drawing context set in directive link function
    this.pointerPositions = [];

    toolsService.onPaintColorsSet(
        $scope,
        color => this.context.fillStyle = 
                  this.context.strokeStyle = color 
    );
  }
}

CanvasController.$inject = ['$scope', 'toolsService'];

export default CanvasController;
