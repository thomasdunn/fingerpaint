'use strict';
/*jshint esnext: true */
/* global CanvasController, Hammer */

import CanvasController from './canvas.controller';

function fingerpaintCanvas($window, toolsService) {
	var directive = {
			restrict: 'EA',
			scope: true,
			replace: true,
			template: '<canvas id="canvas"></canvas>',
			controllerAs: 'vm',
			controller: CanvasController,
			link: linkFunction
		};

	return directive;

	function linkFunction(scope, element, attrs, vm) {

		initCanvas();
		initTouch();

		function initCanvas() {
	        var canvas = element[0];
	        vm.context = canvas.getContext('2d');
	        
	        canvas.width = vm.width = $window.innerWidth;
	        canvas.height = vm.height = $window.innerHeight;
	
	        vm.context.lineCap = vm.context.lineJoin = 'round';
	    }
	    
	    function initTouch() {
	        var mc = new Hammer(element[0], { });
	
	        mc.on('tap', function(e) {
	            console.log('event type: ' + e.type);
	            
	            // prevent the source event from doing it's native behavior
	            e.preventDefault();
	
	        	e.pointers.forEach(function(pointer) {
	        	    drawCircle(pointer.pageX, pointer.pageY);
	        	});
	        });
	        
	        mc.on('panstart panend', function(e) {
	            console.log('event type: ' + e.type);
	            
	            e.preventDefault();
	
	        	e.pointers.forEach(function(pointer) {
	                if (e.type === 'panend') {
	                    drawCircle(pointer.pageX, pointer.pageY);
	                    vm.pointerPositions[pointer.identifier] = undefined;
	                }
	        	});
	        });
	
	        mc.on('panleft panright panup pandown', function(e) {
	            console.log('event type: ' + e.type);
	            
	            e.preventDefault();
	
	        	e.pointers.forEach(function(pointer) {
	                var pos = vm.pointerPositions[pointer.identifier];
	        	    if (pos === undefined) {
	        	        pos = {
	        	            lastX: pointer.pageX,
	            	        lastY: pointer.pageY
	        	        };
	        	        vm.pointerPositions[pointer.identifier] = pos;
	        	    }
	        	    
	        	    drawLine(pos.lastX, pos.lastY, pointer.pageX, pointer.pageY);
	        	    
	                pos.lastX = pointer.pageX;
	                pos.lastY = pointer.pageY;
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
	        
	    }
	    
		function drawCircle(x, y) {
	        vm.context.beginPath();
	        vm.context.arc(x, y, toolsService.brushRadius, 0, 2 * Math.PI, false);
	        vm.context.fill(); 
	    }
	    
	    function drawLine(x1, y1, x2, y2) {
	        vm.context.beginPath();
	        vm.context.moveTo(x1, y1);
	        vm.context.lineTo(x2, y2);
	        vm.context.lineWidth = toolsService.brushRadius * 2;
	        vm.context.stroke();
	    }
	    
	    // function clearDrawing() {
	    //     vm.context.fillStyle = '#fff';
	    //     vm.context.rect(0, 0, vm.width, vm.height);
	    //     vm.context.fill();
	    // }
    
	}
}

fingerpaintCanvas.$inject = ['$window', 'toolsService'];

export default fingerpaintCanvas;
