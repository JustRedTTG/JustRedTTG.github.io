var paused = false;
var await_interval;
var pause_interval;
var alpha = .6;
var hi_inverval;
var did_snakey = false;
var snakey_i = 0;
var snakey_text = "Snake!";
var information;
var reset_information;
var game_over_tap_time;

auto_start = false;
enable_game_reset = false;
document.addEventListener('snakestart', function(event) { clearInterval(hi_inverval); console.log("Thanks for opening the sources or console, hack away! All the code is open source!") })
document.addEventListener('snakeend', function(event) {do_information_screen(); reset_information.style.display = "none"; game_over_time = +new Date;})
document.addEventListener('gameover', function(event) {reset_information.style.display = ""; calculate_information_position();})

document.addEventListener('drawboard', function(event) {shadow();})

document.addEventListener('touch_game_reset', function(event) {
  reset_game();
})

document.addEventListener('resize', function(event) {if (information == null){return}calculate_information_position();})

document.addEventListener('keydown', function(event) {
  if (event.keyCode != 32) {return;}
  if (!snake_started) {
    //start_game();
    return;
  }
  if (paused) {
    game_over = false;
    paused = false;
    game_over_text.innerHTML = "Game over";
    game_over_text.style.color = "red";
    game_over_text.style.display = "none";
  }
  else if (game_over){
    var time = +new Date;
    if (time - game_over_time < 1000) {return;}
    alpha = 0;
    reset_game();
  } else if (!paused) {
    paused = true;
    game_over = true;
    game_over_text.innerHTML = "Paused";
    game_over_text.style.color = "white";
    pause_interval = setInterval(pause_shadow, 1);
  }
})

$(document).ready(function() {
  information = document.getElementById("information");
  reset_information = document.getElementById("reset_information");
  do_information_screen()
});

function do_information_screen() {
  alpha = .6;
  information.style.display = "";
  calculate_information_position();
  await_interval = setInterval(information_screen, 1);
  if (!did_snakey) {
    hi_inverval = setInterval(snakey_hi, 500);
  }
}

function information_screen() {
  if (snake_started) {
    alpha = alpha - .005;
  }
  if (alpha <= 0) {
    clearInterval(await_interval);
    information.style.display = "none";
  }
}

function pause_shadow() {
  if (!paused) {
    alpha = alpha - .005;
  } else if (alpha < .5) {alpha = alpha + .005;}
  if (alpha <= 0) {
    clearInterval(pause_interval);
  }
}

function shadow () {
  if (alpha < 0) {alpha = 0;}
  if (game_over && alpha < .5) {alpha = alpha + .05;}
  board_context.fillStyle = "rgba(0, 0, 0, "+String(alpha)+")";
  board_context.fillRect(offset_x, offset_y, board_size * board_pixel_size, board_size * board_pixel_size);
}

function snakey_hi() {
  if (snake_started){clearInterval(snakey_hi);}
  score_text.innerHTML = score_text.innerHTML.slice(0, -1);
  if (score_text.innerHTML == "") {
    clearInterval(hi_inverval);
    snakey_i = 0;
    hi_inverval = setInterval(snakey_snake, 150);
  }
}

function snakey_snake() {
  if (snake_started){clearInterval(hi_inverval);}
  score_text.innerHTML = score_text.innerHTML + snakey_text[snakey_i];
  snakey_i += 1
  if (snakey_i >= snakey_text.length) {clearInterval(hi_inverval);}
}

function calculate_information_position() {
  information.style.top = String(offset_y + board_size * board_pixel_size * .75)+"px";
  information.style.left = String(offset_x)+"px";
  information.style.right = String(w - (offset_x + board_size * board_pixel_size) + 5)+"px";
  reset_information.style.top = String(offset_y + board_size * board_pixel_size * .75)+"px";
  reset_information.style.left = String(offset_x)+"px";
  reset_information.style.right = String(w - (offset_x + board_size * board_pixel_size) + 5)+"px";
  if (w > h) {
    var information_fontSize = String((board_size * board_pixel_size)/25)+"px";
  } else {
    var information_fontSize = String(w/25)+"px";
  }
  information.style.fontSize = information_fontSize;
  reset_information.style.fontSize = information_fontSize;
}
