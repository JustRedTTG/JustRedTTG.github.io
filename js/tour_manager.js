function onlyNumber(str) {
    str = str.toString();
    return str.replace(/\D/g, '');
}

function offset(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

var welcome2;
var objects = [];
var array = ['a', 'b', 'c'];
var width;
var height;

function load_tour() {
  welcome = document.getElementById('welcome');
  welcome2 = document.getElementById('welcome2');
  welcome2.style.backgroundColor = "#151515"
  welcome.style.display = "none";
  welcome2.style.display = "inline-block";
  summon_objects(-1, 50);
  summon_objects(1, 50);
  shazam = document.createElement('h1')
  shazam.style.marginTop = '15mm';
  shazam.appendChild(document.createTextNode("Shazamm!"));
  welcome2.appendChild(shazam);
  update_positions();

}

document.addEventListener("DOMContentLoaded", function () {
  welcome = document.getElementById('welcome_a');
  welcome.href = "#";
})

function summon_objects(direction, amount) {
  width = welcome2.offsetWidth - 5;
  height = welcome2.offsetHeight - 5;
  for (i = 0; i < amount; i++) {
    new_obj = document.createElement("div");
    new_obj.classList.add("welcome_shape");
    new_obj.classList.add("welcome_shape_" + array[Math.floor(Math.random() * array.length)]);
    new_obj.classList.add("welcome_color_" + array[Math.floor(Math.random() * array.length)]);
    objects.push({
      'direction': direction,
      'position': [Math.floor(Math.random() * width), Math.floor(Math.random() * height)],
      'scale': 1
    });
    welcome2.appendChild(new_obj);
  }
}

function update_positions() {
  children = welcome2.childNodes;
  off = offset(welcome2);
  for (i = 0; i < children.length-1; i++) {
    children[i].style.top = objects[i]['position'][1] + 'px';
    children[i].style.left = objects[i]['position'][0] + 'px';
  }
}
