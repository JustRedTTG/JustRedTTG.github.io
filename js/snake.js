var w;
var h;
var offset_x;
var offset_y;
var board_size = 25;
var snake_begin_size = 3;
var board_pixel_size;
var board_element;
var score_text;
var game_over_text;
var footer;
var board_context;
var board;
var snake_size;
var snake_direction;
var snake_direction_change_chain = [];
var enable_teleport = true;
var game_over = false;
// var game_over = true;
var game_over_time;
var time_in_milliseconds_till_movement = 120;
var start_touch_x;
var start_touch_y;
var end_touch_x;
var end_touch_y;

var snake_color = [0, 255, 0];
var snake_color_final = [0, 55, 55];
var snake_color_change = [
  snake_color_final[0] - snake_color[0],
  snake_color_final[1] - snake_color[1],
  snake_color_final[2] - snake_color[2]
];
var auto_start = true;
var enable_game_reset = true;
var auto_start_on_input = true;
var snake_started = false;
const snakestart_event = new Event('snakestart');
const snakeend_event = new Event('snakeend');
const gameover_event = new Event('gameover');
const drawboard_event = new Event('drawboard');
const touch_game_reset_event = new Event('touch_game_reset');
const keys_game_reset_event = new Event('keys_game_reset');
const resize_event = new Event('resize');
var game_interval;

function resize(onload = false) {
  w = $(window).width();
  h = $(window).height()-30;
  if (w > h){
    offset_x = Math.floor(w / 2 - h / 2);
    board_pixel_size = Math.floor(h / board_size);
    offset_y = Math.floor(h / 2 - (board_size * board_pixel_size) / 2);
  }
  else {
    offset_y = Math.floor(h / 2 - w / 2);
    board_pixel_size = Math.floor(w / board_size);
    offset_x = Math.floor(w / 2 - (board_size * board_pixel_size) / 2);
  }
  board_element.width = w;
  board_element.height = h;
  score_text.style.left = '0px';
  game_over_text.style.left = String(offset_x)+"px";
  game_over_text.style.right = String(w - (offset_x + board_size * board_pixel_size) + 5)+"px";
  if (w > h) {
    score_text.style.right = String(w - offset_x)+"px";
  } else {
    score_text.style.right = "0px";
  }
  var score_text_font_size;
  if (w > h) {
    score_text_font_size = w * .035;
    score_text.style.top = String(h/2 - score_text_font_size)+"px";
  } else {
    score_text_font_size = h * .04;
    score_text.style.top = String(offset_y/2 - score_text_font_size)+"px";
  }
  var game_over_text_font_size = board_size * board_pixel_size * .133;
  game_over_text.style.top = String(h/2 - game_over_text_font_size)+"px";
  score_text.style.fontSize = String(score_text_font_size)+"px";
  game_over_text.style.fontSize = String(game_over_text_font_size)+"px";
  if (h > w){
    footer_font_size = h/50;
    footer.style.fontSize = String(footer_font_size)+"px";
    footer.style.position = "absolute";
    footer.style.top = String(h - footer_font_size)+"px";
    footer.style.right = "0px";
    footer.style.left = "0px";
  } else {
    footer.style.position = "";
    footer.style.fontSize = "";
  }
  board_context.fillStyle = "#202020";
  board_context.fillRect(0,0, w, h);

  if (!snake_started && !onload) {draw_board();}
  document.dispatchEvent(resize_event);
}

function initialize_board() {
  board = []
  for(var i = 0; i < board_size; i++) {
    var arr = []
    for(var i2 = 0; i2 < board_size; i2++) {
      arr.push(-2);
    }
    board.push(arr);
  }
  var head_x = Math.floor(board_size/3);
  var head_y = Math.floor(board_size/2);
  board[head_x][head_y] = 1;
  board[head_x-1][head_y] = 2;
  board[head_x-2][head_y] = 3;
  board[Math.floor(board_size - board_size/3)][Math.floor(board_size/2)] = -1;
  snake_size = snake_begin_size;
  snake_direction = 1;
  game_over_text.style.display = "none";
}

$(document).ready(function() {
  console.log("Snake By Red");
  board_element = document.getElementById("canvas");
  footer = document.getElementById("footer");
  score_text = document.getElementById("score_text");
  game_over_text = document.getElementById("game_over_text");
  board_context = board_element.getContext("2d");
  resize(true);
  initialize_board();
  if (auto_start){ start_game(); } else { draw_board(); }
})

window.addEventListener("resize", () => {
  resize();
	//location.reload();
});

function game() {
  board_context.fillStyle = "#202020";
  board_context.fillRect(0,0, w, h);

  draw_board();
  if (!game_over){move_snake();}
  else {game_over_text.style.display = "";}
  score_text.innerHTML = snake_size-snake_begin_size;
}

function draw_board() {
  board_context.fillStyle = "black";
  board_context.fillRect(offset_x,offset_y, board_size * board_pixel_size, board_size * board_pixel_size);

  var x_in_pixel = offset_x;
  var y_in_pixel = offset_y;
  for (var x = 0; x < board_size; x++) {
    for (var y = 0; y < board_size; y++) {
      var v = board[x][y];
      if (v == -1) {
        board_context.strokeStyle = "red";
        board_context.fillStyle = "red";
        board_context.beginPath();
        board_context.ellipse(x_in_pixel + board_pixel_size / 2, y_in_pixel + Math.floor(board_pixel_size / 2), Math.floor(board_pixel_size / 2), board_pixel_size / 2, 0, 0, 2 * Math.PI);
        board_context.fill();
        board_context.stroke();
      }
      else if (0 < v && v <= snake_size) {
        var [r, g, b] = calculate_snake_color(v);
        board_context.fillStyle = "rgb("+String(r)+", "+String(g)+", "+String(b)+")";
        board_context.fillRect(x_in_pixel, y_in_pixel, board_pixel_size, board_pixel_size);
      }
      y_in_pixel += board_pixel_size;
    }
    x_in_pixel += board_pixel_size;
    y_in_pixel = offset_y;
  }
  document.dispatchEvent(drawboard_event);
  board_context.strokeStyle = "white";
  board_context.beginPath();
  board_context.rect(offset_x,offset_y, board_size * board_pixel_size, board_size * board_pixel_size);
  board_context.lineWidth = h / 200;
  board_context.stroke();
}

function move_snake() {
  if (snake_direction_change_chain.length > 0) {
    snake_direction = snake_direction_change_chain.shift();
  }

  var [next_xi, next_yi, teleported] = get_next_snake_position();

  for (var xi = 0; xi < board_size; xi++) {
    for (var yi = 0; yi < board_size; yi++) {
      if (board[xi][yi] > 0) {board[xi][yi] ++;}
  }}
  if (teleported && !enable_teleport) {end_game();}
  else if (1 < board[next_xi][next_yi] && board[next_xi][next_yi] <= snake_size) {end_game();}
  else {
    if (board[next_xi][next_yi] == -1) {
      snake_size ++;
      board[next_xi][next_yi] = 1;
      generate_new_apple();
    }
    else {board[next_xi][next_yi] = 1;}
  }
}

function get_next_snake_position() {
  var [xi, yi] = find_snake_head();
  if (snake_direction == 0){yi -= 1;}
  else if (snake_direction == 1){xi += 1;}
  else if (snake_direction == 2){yi += 1;}
  else if (snake_direction == 3){xi -= 1;}

  if (xi < 0){xi = board_size-1;}
  else if (xi >= board_size){xi = 0;}
  else if (yi < 0){yi = board_size-1;}
  else if (yi >= board_size){yi = 0;}
  else {return [xi, yi, false];}
  return [xi, yi, true];
}

function find_snake_head() {
  for (var xi = 0; xi < board_size; xi++) {
    for (var yi = 0; yi < board_size; yi++) {
      if (board[xi][yi] == 1) {return [xi, yi];}
    }
  }
  console.log("Couldn't find the snake");
  return [0, 0];
}

function generate_new_apple() {
  var [xi, yi] = find_snake_head();
  var [new_xi, new_yi] = [xi, yi];
  while ((xi-2 <= new_xi && new_xi <= xi+2) || (yi-2 <= new_yi && new_yi <= yi+2) || (1 <= board[new_xi][new_yi] && board[new_xi][new_yi] <= snake_size)) {
    new_xi = Math.floor(Math.random() * board_size);
    new_yi = Math.floor(Math.random() * board_size);
  }
  board[new_xi][new_yi] = -1;
}

document.addEventListener('keydown', function(event) {
  var new_snake_direction = -1;
  if (event.keyCode == 32 && game_over) {
    if (!enable_game_reset) {document.dispatchEvent(keys_game_reset_event); return;}
    reset_game();
    return;
  }
  else if (event.keyCode == 37 || event.keyCode == 65) { // Right
      new_snake_direction = 3;
  }
  else if (event.keyCode == 39 || event.keyCode == 68) { // Left
      new_snake_direction = 1;
  }
  else if (event.keyCode == 38 || event.keyCode == 87) { // Up
      new_snake_direction = 0;
  }
  else if (event.keyCode == 40 || event.keyCode == 83) { // Down
      new_snake_direction = 2;
  }

  if (new_snake_direction < 0 || game_over) {return;}
  if (!snake_started && auto_start_on_input) {start_game();}
  else if (!snake_started) {return;}
  event.preventDefault();
  direction_change_handler(new_snake_direction)
});

document.addEventListener('touchstart', touch_handler, {passive: false});

document.addEventListener('touchmove', touch_handler, {passive: false});

document.addEventListener('touchend', touch_handler, {passive: false});

function touch_handler(event) {
  if (!board_context) {return;}
  if (event.touches.length > 0 && event.touches[0].clientY > h - $(footer).height()) {return;}
  if (game_over && event.type == 'touchstart') {
    var time = +new Date;
    if (time - game_over_time < 1000) {return;}
    if (!enable_game_reset) {document.dispatchEvent(touch_game_reset_event); return;}
    reset_game();
    return;
  }
  if (event.type == 'touchend') {
    touch_direction_handler();
    return;
  } else if (event.touches.length < 1) {return;}
  if (event.type == 'touchstart') {start_touch_x = event.touches[0].clientX; start_touch_y = event.touches[0].clientY;}
  else if (event.type == 'touchmove') {end_touch_x = event.touches[0].clientX; end_touch_y = event.touches[0].clientY;}
  if (!snake_started) {return;}
  event.preventDefault();
}

function direction_change_handler(new_snake_direction){
  var old_snake_direction = snake_direction

  if (snake_direction_change_chain.length > 0) {
    if (snake_direction_change_chain[snake_direction_change_chain.length-1] == new_snake_direction) {return;}
  else if (snake_direction == new_snake_direction) {return;}
  }
  if (snake_direction_change_chain.length > 0) {
    snake_direction = snake_direction_change_chain[snake_direction_change_chain.length-1];
  } else {snake_direction = new_snake_direction;}

  var [xi, yi, teleported] = get_next_snake_position();
  snake_direction = old_snake_direction;
  //if (teleported) {return;}
  if (board[xi][yi] != 2 && snake_direction != new_snake_direction && new_snake_direction != snake_direction_change_chain[snake_direction_change_chain.length-1]) {
    snake_direction_change_chain.push(new_snake_direction)
  }
  if (board[xi][yi] != 2 && !snake_started && auto_start_on_input) {start_game();}
}

function end_game() {
  game_over_time = +new Date;
  game_over = true;
  document.dispatchEvent(gameover_event);
}

function calculate_snake_color(snake_index) {
    if (snake_index == 1) {return snake_color;}
    var percent_of_change = snake_index / snake_size;
    return [
      snake_color[0] + snake_color_change[0] * percent_of_change,
      snake_color[1] + snake_color_change[1] * percent_of_change,
      snake_color[2] + snake_color_change[2] * percent_of_change,
    ]
 }

function touch_direction_handler() {
  var go_x = 0;
  var direction_x = -1;
  var go_y = 0;
  var direction_y = -1;
  if (start_touch_x < end_touch_x) { // Right
    go_x = end_touch_x - start_touch_x;
    direction_x = 1;
  }
  else { // Left
    go_x = start_touch_x - end_touch_x;
    direction_x = 3;
  }
  if (start_touch_y < end_touch_y) { // Down
    go_y = end_touch_y - start_touch_y;
    direction_y = 2;
  }
  else { // Up
    go_y = start_touch_y - end_touch_y;
    direction_y = 0;
  }
  if (go_y > go_x) {direction_change_handler(direction_y);} else {direction_change_handler(direction_x);}
}

function start_game() {
  snake_started = true;
  document.dispatchEvent(snakestart_event);
  game_interval = setInterval(game, time_in_milliseconds_till_movement);
}

function reset_game () {
  if (!auto_start || !enable_game_reset) {
    document.dispatchEvent(snakeend_event);
    clearInterval(game_interval);
    snake_started = false;
  }
  game_over = false;
  initialize_board();
  draw_board();
}
