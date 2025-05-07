ready(function(){
  var starsNumber = 2000,
      canvas = document.getElementById('stars'),
      context = canvas.getContext('2d'),
      width = window.innerWidth,
      height = window.innerHeight,
      x = 100,
      y = 100,
      i = 0,
      t = 0,
      stars = [],
      colors = [ '#e7fcff', '#217cee', '#eef310', '#fe8028', '#87f903' ];
  function Star() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.speed = 0;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.size = Math.random();
  }
  function draw() {
    var star;
    canvas.width = width;
    canvas.height = height;
    for (t = 0; t < stars.length; t += 1) {
      star = stars[t];
      context.beginPath();
      context.fillStyle = star.color;
      context.arc(star.x, star.y, star.size, Math.PI * 2, false);
      context.fill();
      star.x -= star.speed;
      if (star.x < -star.size) {
        star.x = width + star.size;
      }
      if (star.size < 5) {
        star.speed = 1;
      }
      if (star.size < 4) {
        star.speed = 0.5;
      }
      if (star.size < 3) {
        star.speed = 0.25;
      }
    }
  }
  for (i = 0; i < starsNumber; i += 1) {
    stars.push(new Star());
  }
  setInterval(draw, 20);
});
