// Document Ready Function
function ready(callback){
  if (document.readyState!='loading') callback();
  else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
  else document.attachEvent('onreadystatechange', function(){
    if (document.readyState=='complete') callback();
  });
}

// Text Scrambler
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    console.log(`New text: ${newText}`);
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Calls the Text Scrambler and handles events
function scramble(e){
  e.target.removeEventListener("mouseenter", scramble);
  const scram = new TextScramble(e.target);
  scram.setText(e.target.innerHTML);
  setTimeout(() => {
    e.target.addEventListener("mouseenter", scramble);
  }, 7000);
}

// When Document loads:
ready(function(){
  // Unique Text Scrambler for site header
  const phrases = ['cascading space','cascading space','cascading space','anyone there?'];
  const siteHeader = document.querySelector('.title h1');
  const fx = new TextScramble(siteHeader);
  let counter = 0;
  const next = () => {
    fx.setText(phrases[counter]).then(() => {
      setTimeout(next, 12000);
    });
    counter = (counter + 1) % phrases.length;
  };
  next();

  // Set up Text Scrambler on content headings, and the Bear notice
  document.querySelectorAll('main h1, main h2, .bear a').forEach(function(el){
    el.addEventListener("mouseenter", scramble);
  });

  // Set up and animate the starfield background
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
