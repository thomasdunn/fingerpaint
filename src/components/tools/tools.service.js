'use strict';
/*jshint esnext: true */

class ToolsService {
    
    constructor() {
        this._brushRadius = 1;
    }

    set brushRadius(radius) {
        this._brushRadius = radius;
    }

    get brushRadius() {
        return this._brushRadius;
    }
}

ToolsService.$inject = [];

export default ToolsService;
