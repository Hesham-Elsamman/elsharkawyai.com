var TxtType = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = "";
  this.isDeleting = false;
  this.timeout = null;
  this.tick();
};

TxtType.prototype.tick = function () {
  if (!this.toRotate || this.toRotate.length === 0) return;
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

  var that = this;
  var delta = 150 - Math.random() * 50; // slightly faster typing

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 400;
  }

  // Clear previous timeout to avoid overlapping loops
  if (this.timeout) clearTimeout(this.timeout);

  this.timeout = setTimeout(function () {
    that.tick();
  }, delta);
};

TxtType.prototype.updateData = function(newRotate) {
    this.toRotate = newRotate;
    // reset to type the new arrays immediately
    this.txt = "";
    this.loopNum = 0;
    this.isDeleting = false;
    if (this.timeout) clearTimeout(this.timeout);
    this.tick();
}

window.typewriters = [];

function initTypewriters() {
  var elements = document.getElementsByClassName("typewrite");
  window.typewriters = [];
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute("data-type");
    var period = elements[i].getAttribute("data-period");
    if (toRotate) {
      window.typewriters.push(new TxtType(elements[i], JSON.parse(toRotate), period));
      // store in element for direct access
      elements[i].txtTypeInstance = window.typewriters[window.typewriters.length - 1];
    }
  }
}

window.addEventListener('DOMContentLoaded', initTypewriters);

window.addEventListener('languageChanged', function() {
  var elements = document.getElementsByClassName("typewrite");
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute("data-type");
    if (toRotate && elements[i].txtTypeInstance) {
      elements[i].txtTypeInstance.updateData(JSON.parse(toRotate));
    }
  }
});

// Original scroll behavior for fade-in elements
window.addEventListener("scroll", function () {
  let elements = document.querySelectorAll(".element");
  elements.forEach((el) => {
    let position = el.getBoundingClientRect().top;
    if (position < window.innerHeight - 100) {
      el.classList.add("visible");
    } else {
      el.classList.remove("visible");
    }
  });
});
