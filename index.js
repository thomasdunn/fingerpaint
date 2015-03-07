var canvas = document.getElementById('canvas'),
    context = canvas.getContext("2d"),
    radius = 15;

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

var mc = new Hammer(canvas);

mc.on("panleft panright panup pandown", function(e) {
	var x = e.center.x,
		y = e.center.y;
		
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fill();
});