/* global Hammer, FastClick, PouchDB, blobUtil */

(function() {
    var canvas,
        context,
        radius = 15,
        maxAllowedMovement = 50,
        pointerPositions = [],
        history = [NaN, 0, 0, 0, 0, NaN, 1, 15], // set color black, radius = 15
        undoing = false,
        undone = false,
        db = new PouchDB('fingerpaint'),
        debug = false,
        app = {
            'init': init
        };

    return app;
    
    function init() {
        initCanvas();
        initTouch();
        initBrushPicker();
        initColorPicker();
        initActions();
        
        PouchDB.debug.enable('*');
    }
    
    // ops: color, brush size, circle, line
    // brush size: s
    // color: r, g, b
    // circle: x, y
    // line: x1, y1, x2, y2
    
    function initCanvas() {
        canvas = document.getElementById('canvas');
        context = canvas.getContext("2d");
        
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;

        context.lineCap = context.lineJoin = 'round';

        // clearDrawing();
    }
    
    function initTouch() {
        var mc = new Hammer(canvas, { });

        mc.on("tap", function(e) {
            log('event type: ' + e.type);
            
            // prevent the source event from doing it's native behavior
            e.preventDefault();

        	e.pointers.forEach(function(pointer) {
        	    drawCircle(pointer.pageX, pointer.pageY);
        	});
        });
        
        mc.on("panstart panend", function(e) {
            log('event type: ' + e.type);
            
            e.preventDefault();

        	e.pointers.forEach(function(pointer, index) {
                if (e.type === "panend") {
                    drawCircle(pointer.pageX, pointer.pageY);
                    pointerPositions[pointer.identifier] = undefined;
                }
        	});
        });

        mc.on("panleft panright panup pandown", function(e) {
            log('event type: ' + e.type);
            
            e.preventDefault();

        	e.pointers.forEach(function(pointer, index) {
                var dx, dy,
                    pos = pointerPositions[pointer.identifier];
                    
        	    if (pos === undefined) {
        	        pos = {
        	            lastX: pointer.pageX,
            	        lastY: pointer.pageY
        	        };
        	        pointerPositions[pointer.identifier] = pos;
        	    }
        	    
                dx = Math.abs(pos.lastX - pointer.pageX);
                dy = Math.abs(pos.lastY - pointer.pageY);
                
                // filter out any erratic jumps to top-left that often occur
                // when using a pen and tablet
                if ( !(dx > maxAllowedMovement && (pos.lastX <= 0 || pointer.pageX <= 0)) &&
                     !(dy > maxAllowedMovement && (pos.lastY <= 0 || pointer.pageY <= 0))
                ) {
                    drawLine(pos.lastX, pos.lastY, pointer.pageX, pointer.pageY);
                    
                    pos.lastX = pointer.pageX;
                    pos.lastY = pointer.pageY;
                }
            });
        });
        
        mc.get('pan').set({
            // enable vertical pan
            // blocks the vertical scrolling on a touch-device while on the element
            direction: Hammer.DIRECTION_ALL,
            // make it respond to drag and start drawing immediately
            threshold: 0,
            // all your fingers!
            pointers: 0
        });
    
        mc.get('tap').set({
            // allow this many pixel movement during gesture
            threshold: 10,
            // allow consecutive taps to be very far apart
            posThreshold: 19200
        });
        
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
    
    function initBrushPicker() {
        $('.brush').on('click', function() {
            radius = $(this).data('radius');
            log('Brush size: ' + radius);
            $('.brush').removeClass('selected');
            $(this).addClass('selected');
            
            if (! undoing) {
                history.push(NaN, 1, radius);
            }
        });
    }
    
    function initColorPicker() {
        $("#picker").spectrum({
            change: changeColor,
            clickoutFiresChange: true, // keep selected color when change brush
            showPaletteOnly: true,
            showPalette:true,
            flat: true,
            color: "#000",
            palette: [
                ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
                ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
                ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
                ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
                ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
                ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
                ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
                ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
            ]
        });
        
        $('#picker').show();
    }
    
    function initActions() {
        $('#save').on('click', function() {
           saveCanvasImage();
        });
        $('#slideshow').on('click', function() {
           openSlideshow();
        });
        $('#back').on('click', function() {
           undo();
        });
    }
    
    function undo() {
        var position,
            operation,
            end = history.length - 1,
            foundLastOp = false;

        undoing = true;
        
        while (end > 0) {
            if (isNaN(history[end])) {
                if (foundLastOp) {
                    break;
                }
                else {
                    foundLastOp = true;
                }
            }
            end--;
        }
            
        clearDrawing();
        
        for (position = 0; position <= end; ) {
            operation = history[position + 1];
            switch (operation) {
                case 0:
                    context.fillStyle = 
                        context.strokeStyle =
                            'rgb(' + history[position + 2] + ','
                                   + history[position + 3] + ','
                                   + history[position + 4] + ')';
                    position = position + 5;
                    break;
                    
                case 1:
                    radius = history[position + 2];
                    position = position + 3;
                    break;

                case 2:
                    drawCircle(history[position + 2], history[position + 3]);
                    position = position + 4;
                    break;
                    
                case 3:
                    drawLine(history[position + 2], history[position + 3],
                        history[position + 4], history[position + 5]);
                    position = position + 6;
                    break;
            }
        }
        
        history = history.slice(0, position);
        
        undoing = false;
        undone = true;
        
        $("#picker").spectrum("set", context.fillStyle);
        $(".brush").removeClass("selected");
        $(".brush[data-radius='" + radius + "']").addClass("selected");
    }
    
    //-----------Drawing functions 
    
    function changeColor(color) {
        var colorComponents = color.toRgb();
        
        // TODO - fix temporary hack... after each undo, color picker fires for some reason
        if (undone) {
            undone = false;
            return;
        }
        
        context.fillStyle = 
            context.strokeStyle = 
                color.toHexString();
                
        if (! undoing) {
            history.push(NaN, 0, colorComponents.r, colorComponents.g, colorComponents.b);
        }
    }
    
    function drawCircle(x, y) {
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fill(); 
        
        if (! undoing) {
            history.push(NaN, 2, x, y);
        }
    }
    
    function drawLine(x1, y1, x2, y2) {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineWidth = radius * 2;
        context.stroke();

        if (! undoing) {
            history.push(NaN, 3, x1, y1, x2, y2);
        }
    }
    
    function clearDrawing() {
        context.fillStyle = "#fff";
        context.rect(0, 0, canvas.width, canvas.height);
        context.fill();
    }
    
    //-----------File Management
    function saveCanvasImage() {
        var id = (+(new Date)).toString(),
            filename = 'image_' + id + '.png',
            doc = {
                _id: id,
                _attachments: {}
            };
        
        blobUtil.canvasToBlob(canvas).then(function (blob) {
            doc._attachments[filename] = {
                content_type: 'image/png',
                data: blob
            };
            
            // Cannot open the window from inside the promise
            var openedWindow = window.open('', 'fingerpaint-slideshow');
            
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

    function openImage(id, filename) {
        db.get(id, {attachments: true}).then(function(doc) {
            var dataBase64 = doc._attachments[filename].data;
            //log('Data: ' + dataBase64);
            
            window.open('data:image/png;base64,' + dataBase64, filename);
        }).catch(function (err) {
            console.log(err);
        });
    }
    
    function openSlideshow() {
        window.open('slideshow.html', 'fingerpaint-slideshow');
    }
    
    function log(msg) {
        if (debug) {
            console.log(msg);
        }
    }

})().init();

// TODO:
//   Set content scalable meta for mobile