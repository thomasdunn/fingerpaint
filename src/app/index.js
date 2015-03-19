'use strict';
/*jshint esnext: true */

import MainCtrl from './main/main.controller';
import NavbarCtrl from '../components/navbar/navbar.controller';
import BrushesController from '../components/brushes/brushes.controller';
import fingerpaintBrushes from '../components/brushes/brushes.directive';

angular.module('fingerpaint', ['ngAnimate'])
  .controller('MainCtrl', MainCtrl)
  .controller('NavbarCtrl', NavbarCtrl)
  .controller('BrushesController', BrushesController)
  .directive('fingerpaintBrushes', fingerpaintBrushes);
