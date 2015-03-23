'use strict';
/*jshint esnext: true */
/* global $, PouchDB, blueimp */

class SlideshowController {
    constructor($window, storageService) {
        this.$window = $window;
        
        this.db = new PouchDB('fingerpaint');
        PouchDB.debug.enable('*');
        
        this.initTouch();
        this.initImages();
    }
    
    initImages() {
        var links = $('#links'),
            imageBase64Data,
            self = this;

        this.db.allDocs({
          /*jshint camelcase: false */
          include_docs: true, 
          attachments: true,
          descending: true
        }).then(function (result) {
          result.rows.forEach(function(row) {
            for (var filename in row.doc._attachments) {
                imageBase64Data = row.doc._attachments[filename].data;

                links.append(
                    $('<a></a>')
                        .attr('data-gallery', '')
                        .attr('href', 'data:image/png;base64,' + imageBase64Data)
                );
            }
            
            self.initSlideshow();
          });
        }).catch(function (err) {
          console.log(err);
        });
    }
    
    initSlideshow() {
        blueimp.Gallery($('#links a'), {
            closeOnSwipeUpOrDown: true,
            closeOnSlideClick: false,
            closeOnEscape: false,
            fullScreen: false,
            useBootstrapModal: false,
            onclose: function() { /* TODO : switch to 'paint' view */ }
        });
    }
    
    initTouch() {
        // disable context menu, often would appear after accidental 2nd finger touch
        this.$window.addEventListener('contextmenu', function (e) { // Not compatibile with IE < 9 but neither is canvas
          e.preventDefault();
        }, false);
    
        // Chrome: to disable right-swipe back browser, left-swipe forward browser
        // set overscroll-history-navigation=disabled
        // chrome://flags/#overscroll-history-navigation
    
        // Already done in 'paint' component
        // // This library is to remove the 300ms touch browser click delay
        // $(function() {
        //   FastClick.attach(document.body);
        // });
    }

    // // return base64 encoded image data from attachment filename from doc with id
    // getImageData(id, filename) {
    //     this.db.get(id, {attachments: true}).then(function(doc) {
    //         return doc._attachments[filename].data;
    //     }).catch(function (err) {
    //         console.log(err);
    //     });
    // }
}

SlideshowController.$inject = ['$window', '$document', 'canvasService', 'storageService'];

export default SlideshowController;
