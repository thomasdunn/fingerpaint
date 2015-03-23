'use strict';
/*jshint esnext: true */

import PaintController from '../components/paint/paint';
import SlideshowController from '../components/slideshow/slideshow';
import BrushesController from '../components/brushes/brushes.controller';
import fingerpaintBrushes from '../components/brushes/brushes.directive';
import CanvasController from '../components/canvas/canvas.controller';
import fingerpaintCanvas from '../components/canvas/canvas.directive';
import CanvasService from '../components/canvas/canvas.service';
import fingerpaintColors from '../components/colors/colors.directive';
import ToolsService from '../components/tools/tools.service';
import StorageService from '../components/storage/storage.service';

angular.module('fingerpaint.paint', ['ngAnimate', 'ngNewRouter'])
  .controller('PaintController', PaintController)
  .controller('BrushesController', BrushesController)
  .controller('CanvasController', CanvasController)
  .directive('fingerpaintBrushes', fingerpaintBrushes)
  .directive('fingerpaintColors', fingerpaintColors)
  .directive('fingerpaintCanvas', fingerpaintCanvas)
  .service('canvasService', CanvasService)
  .service('toolsService', ToolsService);

angular.module('fingerpaint.slideshow', ['ngAnimate'])
  .controller('SlideshowController', SlideshowController);

angular.module('fingerpaint', ['ngNewRouter', 'fingerpaint.paint', 'fingerpaint.slideshow'])
  .controller('AppController', ['$router', AppController])
  .service('storageService', StorageService);

AppController.$routeConfig = [
  { path: '/', component: 'paint' },
  { path: '/show/', component: 'slideshow' }
];
function AppController ($router) {}