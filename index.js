/* global Hammer */

(function() {
    var canvas,
        context,
        radius = 15,
        color,
        app = {
            'init': init
        };

    return app;
    
    function init() {
        initCanvas();
        initTouch();
        initBrushPicker();
        initColorPicker();
    }
    
    function initCanvas() {
        canvas = document.getElementById('canvas');
        context = canvas.getContext("2d");
        
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function initTouch() {
        var mc = new Hammer(canvas, {
            dragMinDistance: 1,
            // prevent the source event from doing it's native behavior
            // this may help disable gestures such as browser back
            preventDefault: true
        });
        
        mc.on("tap panleft panright panup pandown", function(e) {
            // prevent the source event from doing it's native behavior
            // this may help disable gestures such as browser back
            e.preventDefault();
        	
        	e.pointers.forEach(function(pointer) {
        	    drawCircle(pointer.pageX, pointer.pageY);
        	});
        });
        
        mc.get('pan').set({
            // enable vertical pan
            // blocks the vertical scrolling on a touch-device while on the element
            direction: Hammer.DIRECTION_ALL,
            // make it respond to drag and start drawing immediately
            // makes it more responsive, but may lead to more random spots
            // due to a different finger accidentally touching?
            threshold: 1
        });
    
        // disable context menu, often would appear after accidental 2nd finger touch
        window.addEventListener('contextmenu', function (e) { // Not compatibile with IE < 9 but neither is canvas
          e.preventDefault();
        }, false);
    
        // Chrome: to disable right-swipe back browser, left-swipe forward browser
        // set overscroll-history-navigation=disabled
        // chrome://flags/#overscroll-history-navigation
    
        // This library is to remove the 300ms touch browser click delay
        // doesn't seem to be an issue so not currently using it
        // $(function() {
        //     FastClick.attach(document.body);
        // });
    }
    
    function initBrushPicker() {
        $('.brush').on('click', function() {
            radius = $(this).data('radius');
            $('.brush').removeClass('selected');
            $(this).addClass('selected');
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
    
    //-----------Drawing functions 
    
    function changeColor(color) {
        context.fillStyle = color.toHexString();
    }
    
    function drawCircle(x, y) {
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fill(); 
    }
})().init();

// Notes:
// use filer.js to use FileSystem API to write images to disk

