'use strict';
/*jshint esnext: true */

import MainCtrl from './main/main.controller';
import NavbarCtrl from '../components/navbar/navbar.controller';
import BrushesController from '../components/brushes/brushes.controller';
import fingerpaintBrushes from '../components/brushes/brushes.directive';
import CanvasController from '../components/canvas/canvas.controller';
import fingerpaintCanvas from '../components/canvas/canvas.directive';
import fingerpaintColors from '../components/colors/colors.directive';
import ToolsService from '../components/tools/tools.service';

angular.module('fingerpaint', ['ngAnimate'])
  .controller('MainCtrl', MainCtrl)
  .controller('NavbarCtrl', NavbarCtrl)
  .controller('BrushesController', BrushesController)
  .controller('CanvasController', CanvasController)
  .directive('fingerpaintBrushes', fingerpaintBrushes)
  .directive('fingerpaintColors', fingerpaintColors)
  .directive('fingerpaintCanvas', fingerpaintCanvas)
  .service('toolsService', ToolsService);
