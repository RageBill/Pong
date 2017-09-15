$(document).ready(function(){

	// Setting up the game
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var gameOver = true;

	// Setting up constants
	const PI = Math.PI;
	const HEIGHT = canvas.height;
	const WIDTH = canvas.width;
	const upKey = 38, downKey = 40;

	// User Inputs
	var keyPressed = null;
	
	// Setting up the game objects
	var player = {
		x: null,
		y: null,
		width: 20,
		height: 100,

		update: function(){
			// Moving the paddle according to the keyPressed
			if(keyPressed == 38) this.y -= 10;
			if(keyPressed == 40) this.y += 10;
		},

		draw: function(){
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	}

	var ai = {
		x: null,
		y: null,
		width: 20,
		height: 100,

		update: function(){
			let target = ball.y - (this.height - ball.size) / 2;
			this.y += (target - this.y) * 0.1;
		},

		draw: function(){
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	}

	var ball = {
		x: null,
		y: null,
		size: 20,
		speedx: null,
		speedy: null,
		speed: 10,

		update: function(){
			// Moving the ball
			this.x += this.speedx;
			this.y += this.speedy;

			// Bounce on top & bottom edge
			if(this.y + this.size >= HEIGHT || this.y <= 0){
				this.speedy *= -1;
			}

			// Function for collision checking
			function checkCollision(a, b){
				// Return true of ball collide with others
				return (a.x < b.x + b.width && a.y < b.y + b.height && b.x < a.x + a.size && b.y < a.y + a.size);
			}

			// Movement direction determines which object the ball will collide with
			let other;

			if(ball.speedx < 0){
				other = player;
			} else {
				other = ai;
			}

			// Check for collision with paddle
			let collided = checkCollision(ball, other);

			// An equation for ball's moving direction when it collides with the paddle
			if(collided){
				let n = (this.y + this.size - other.y) / (other.height + this.size);
				let phi = 0.25 * PI * (2 * n - 1)
				this.speedx = this.speed * Math.cos(phi);
				this.speedy = this.speed * Math.sin(phi);
				if(other == ai) this.speedx *= -1;
			}

			if(this.x + this.size < 0 || this.x > WIDTH){
				gameOver = true;
				$("button").fadeIn();
				if(this.x + this.size < 0){
					$("h1").html("You Lose!");
				} else {
					$("h1").html("You Win!");
				}
			}
		},

		draw: function(){
			ctx.fillRect(this.x, this.y, this.size, this.size);
		}
	}

	// Main function
	function main(){
		// Initialize the game
		init();

		// Loop for recursive call of window.requestAnimationFrame()
		var loop = function(){
			update();
			draw();
			window.requestAnimationFrame(loop, canvas);
		}
		window.requestAnimationFrame(loop, canvas);
	}

	// Game Initialization for object's positions
	function init(){

		gameOver = false;

		$("h1").html("Pong");

		// Moving the player & the AI to the middle of the screen
		player.x = 20;
		player.y = (HEIGHT - player.height) / 2;

		ai.x = (WIDTH - ai.width - 20);
		ai.y = (HEIGHT - player.height) / 2;

		// Putting the ball in the middle
		ball.x = (WIDTH - ball.size) / 2;
		ball.y = (HEIGHT - ball.size) / 2;

		// Serving the ball
		ball.speedx = ball.speed;
		// This gives either 0 or 1 to serve the ball in random direction
		if(Math.round(Math.random()))
			ball.speedx *= -1;
		ball.speedy = 0;
	}

	// Game Update
	function update(){
		if(!gameOver)
			ball.update();
		ai.update();
		player.update();
	}

	// Draw new frame
	function draw(){
		ctx.fillRect(0, 0, WIDTH, HEIGHT); // Fill the background black

		ctx.save(); // Save current settings of drawing

		// Drawing the game objects in white
		ctx.fillStyle = "white";
		ball.draw();
		ai.draw();
		player.draw();

		// Optional: Drawing some white stripes for styles
		let w = 4;
		let x = (WIDTH - w) / 2;
		let y = 0;
		let step = HEIGHT / 15;
		while (y < HEIGHT){
			ctx.fillRect(x, y + step * 0.25, w, step * 0.5);
			y += step;
		}

		ctx.restore(); // Restore the saved settings of drawing
	}

	// Sensing the user's key inputs
	$(document).on("keyup", function(){
		keyPressed = null;
	});

	$(document).on("keydown", function(e){
		keyPressed = e.which;
	});

	// Restarting the game on button click
	$("button").on("click", function(){
		$(this).hide();
		init();
	})

	// Calling the main function
	main();
});