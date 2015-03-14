/* global PouchDB, FastClick, blueimp */

(function() {
    var db = new PouchDB('fingerpaint'),
        debug = false,
        app = {
            'init': init
        };

    return app;
    
    function init() {
        PouchDB.debug.enable('*');
        
        initTouch();

        blueimp.Gallery($('#links a'), {
            closeOnSwipeUpOrDown: false,
            closeOnSlideClick: false,
            closeOnEscape: false,
            fullScreen: true,
            useBootstrapModal: false
        });
    }
    
    function initTouch() {
        // disable context menu, often would appear after accidental 2nd finger touch
        window.addEventListener('contextmenu', function (e) { // Not compatibile with IE < 9 but neither is canvas
          e.preventDefault();
        }, false);
    
        // Chrome: to disable right-swipe back browser, left-swipe forward browser
        // set overscroll-history-navigation=disabled
        // chrome://flags/#overscroll-history-navigation
    
        // This library is to remove the 300ms touch browser click delay
        $(function() {
          FastClick.attach(document.body);
        });
    }

    // return base64 encoded image data from attachment filename from doc with id
    function getImageData(id, filename) {
        db.get(id, {attachments: true}).then(function(doc) {
            return doc._attachments[filename].data;
        }).catch(function (err) {
            console.log(err);
        });
    }
    
    function log(msg) {
        if (debug) {
            console.log(msg);
        }
    }

})().init();

// TODO:
//   Set content scalable meta for mobile