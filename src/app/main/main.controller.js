'use strict';
/*jshint esnext: true */
/* global $, FastClick */

class MainCtrl {
    constructor($scope, $window, $document, canvasService, storageService) {

        this.$window = $window;
        this.canvasService = canvasService;
        this.storageService = storageService;
        
        // disable context menu, often would appear after accidental 2nd finger touch
        $window.addEventListener('contextmenu', function(e) { // Not compatibile with IE < 9 but neither is canvas
            // TODO put back in
            //          e.preventDefault();
            console.log(e);
        }, false);

        // Chrome: to disable right-swipe back browser, left-swipe forward browser
        // set overscroll-history-navigation=disabled
        // chrome://flags/#overscroll-history-navigation

        // This library is to remove the 300ms touch browser click delay
        $(function() {
            FastClick.attach($document[0].body);
        });

    }

    //-----------File Management
    saveCanvasImage() {
        this.canvasService.getImageBlob().then(blob => {
            this.storageService.saveBlob(blob).then(() => {
            // TODO : open slideshow
            // // Cannot open the window from inside the promise
            // openSlideshow
            console.log('Saved.  Open slideshow...');

            }).catch(function(err) {
                console.log(err);
            });
        }).catch(function(err) {
            console.log(err);
        });
    }

    openSlideshow() {
        this.$window.open('slideshow.html', 'fingerpaint-slideshow');
    }
}

MainCtrl.$inject = ['$scope', '$window', '$document', 'canvasService', 'storageService'];

export default MainCtrl;
