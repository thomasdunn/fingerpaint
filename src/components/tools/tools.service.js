'use strict';
/*jshint esnext: true */

class ToolsService {
    
    constructor($rootScope) {
        this.$rootScope = $rootScope;

        this._brushRadius = 1;
        this._paintColor = '#000000';
        this._paintColorSetMessage = 'paintColorSetMessage';
    }

    // brush radius is read as from service as needed
    get brushRadius() {
        return this._brushRadius;
    }

    set brushRadius(radius) {
        this._brushRadius = radius;
    }

    // brush radius is read as from service as needed
    get paintColor() {
        return this._brushRadius;
    }

    set paintColor(color) {
        this.$rootScope.$broadcast(this._paintColorSetMessage, color);
    }

    onPaintColorsSet($scope, handler) {
        $scope.$on(this._paintColorSetMessage, function(event, color) {
            handler(color);
        });
    }
}

ToolsService.$inject = ['$rootScope'];

export default ToolsService;
