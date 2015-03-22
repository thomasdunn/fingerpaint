'use strict';
/*jshint esnext: true */
/* global blobUtil */

class CanvasService {

    set canvas(c) {
        this._canvas = c;
    }    

    get canvas() {
        return this._canvas;
    }    
    
    /**
     * Returns Promise with the image blob
     */
    getImageBlob() {
        return blobUtil.canvasToBlob(this._canvas);
    }
}

// CanvasService.$inject = ['$rootScope'];

export default CanvasService;
