'use strict';
/*jshint esnext: true */

class BrushesController {
  constructor (toolsService) {
    
    var defaultBrush = {radius: 15};
    
    this.toolsService = toolsService;
    
    this.brushes = [
      {radius: 1},
      {radius: 3},
      {radius: 9},
      defaultBrush,
      {radius: 30},
      {radius: 60},
      {radius: 120},
      {radius: 240}
    ];
    
    this.selectBrush(defaultBrush);
  }
  
  selectBrush(brush) {
    this.toolsService.brushRadius = brush.radius;
    this.brushes.forEach(b => b.selected = false);
    brush.selected = true;

    console.log(`Selected brush radius: ${brush.radius}`);
  }
}

BrushesController.$inject = ['toolsService'];

export default BrushesController;
