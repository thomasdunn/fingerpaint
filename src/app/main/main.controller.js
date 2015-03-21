'use strict';
/*jshint esnext: true */
/* global $, FastClick, PouchDB, blobUtil */

class MainCtrl {
  constructor ($scope, $window, $document) {

    var db = new PouchDB('fingerpaint'),
        debug = false;
        
    activate();

    function activate() {

        initActions();
        
        PouchDB.debug.enable('*');
        
        // disable context menu, often would appear after accidental 2nd finger touch
        $window.addEventListener('contextmenu', function (e) { // Not compatibile with IE < 9 but neither is canvas
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
    
    function initActions() {
        $('#save').on('click', function() {
           saveCanvasImage();
        });
        $('#slideshow').on('click', function() {
           openSlideshow();
        });
    }
    
    
    //-----------File Management
    function saveCanvasImage() {
        var id = (+(new Date())).toString(),
            filename = 'image_' + id + '.png',
            doc = {
                _id: id,
                _attachments: {}
            };
        
        // TODO - refactor canvas image retrieval into a service
        blobUtil.canvasToBlob(canvas).then(function (blob) {
            doc._attachments[filename] = {
                /*jshint camelcase: false */
                content_type: 'image/png',
                /*jshint camelcase: true */
                data: blob
            };
            
            // Cannot open the window from inside the promise
            var openedWindow = $window.open('', 'fingerpaint-slideshow');
            
            db.put(doc).then(function() {
                // openImage(id, filename);
                // openSlideshow();
                openedWindow.location = 'slideshow.html';
            }).catch(function(err) {
                console.log(err);
            });
        }).catch(function (err) {
            console.log(err);
        });
        
        log('new doc id: ' + doc._id);
    }

    // function openImage(id, filename) {
    //     db.get(id, {attachments: true}).then(function(doc) {
    //         var dataBase64 = doc._attachments[filename].data;
    //         //log('Data: ' + dataBase64);
            
    //         $window.open('data:image/png;base64,' + dataBase64, filename);
    //     }).catch(function (err) {
    //         console.log(err);
    //     });
    // }
    
    function openSlideshow() {
        $window.open('slideshow.html', 'fingerpaint-slideshow');
    }
    
    function log(msg) {
        if (debug) {
            console.log(msg);
        }
    }

    // TODO:
    //   Set content scalable meta for mobile
  }
}

MainCtrl.$inject = ['$scope', '$window', '$document'];

export default MainCtrl;
