'use strict';
/*jshint esnext: true */
/* global PouchDB */

class StorageService {

    constructor() {
        this.db = new PouchDB('fingerpaint');
        PouchDB.debug.enable('*');
    }

    /**
     * Return Promise for saving the supplied blob
     */
    saveBlob(blob) {
        var id = (+(new Date())).toString(),
            filename = `image_${id}.png`,
            doc = {
                _id: id,
                _attachments: {}
            };
            
        doc._attachments[filename] = {
            /*jshint camelcase: false */
            content_type: 'image/png',
            /*jshint camelcase: true */
            data: blob
        };

        // // Cannot open the window from inside the promise
        // var openedWindow = this.$window.open('', 'fingerpaint-slideshow');

        return this.db.put(doc);
    }

    // openImage(id, filename) {
    //     this.db.get(id, {
    //         attachments: true
    //     }).then(function(doc) {
    //         // var dataBase64 = doc._attachments[filename].data;
    //         // //log('Data: ' + dataBase64);

    //         // $window.open('data:image/png;base64,' + dataBase64, filename);
    //     }).catch(function(err) {
    //         console.log(err);
    //     });
    // }

}

// StorageService.$inject = ['$rootScope'];

export default StorageService;
