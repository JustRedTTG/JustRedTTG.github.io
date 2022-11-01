var w;
var h;
var offset_x;
var offset_y;
var board_size = 25;
var board_pixel_size;
var board_element;
var board_context;

function resize() {
  w = $(window).width();
  h = $(window).height()-20;
  if (w > h){
    offset_x = Math.max(w / 2 - h / 2);
    board_pixel_size = Math.max(h / board_size);
    offset_y = Math.max(h / 2 - (board_size * board_pixel_size) / 2);
  }
  else {
    offset_y = Math.max(h / 2 - w / 2);
    board_pixel_size = Math.max(w / board_size);
    offset_x = Math.max(w / 2 - (board_size * board_pixel_size) / 2);
  }
  board_element.width = w;
  board_element.height = h;
  board_context.fillStyle = "#202020";
  board_context.fillRect(0,0, w, h);
}

window.onload = function() {
  console.log("Snake By Red");
  board_element = document.getElementById("canvas");
  board_context = board_element.getContext("2d");
  resize();
  setInterval(game, 100)
}

window.addEventListener("resize", () => {
  resize();
	//location.reload();
});

function game() {
  board_context.fillStyle = "#202020";
  board_context.fillRect(0,0, w, h);

  board_context.fillStyle = "black";
  board_context.fillRect(offset_x,offset_y, board_size * board_pixel_size, board_size * board_pixel_size);

  board_context.strokeStyle = "white";
  board_context.beginPath();
  board_context.rect(offset_x,offset_y, board_size * board_pixel_size, board_size * board_pixel_size);
  board_context.lineWidth = h / 200;
  board_context.stroke();
}
