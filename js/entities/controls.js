// ======================
// Touch Screen Controls
// ======================

game.touchUI = me.Renderable.extend({

	init : function () {

		this.parent(new me.Vector2d(0,0), 180, 120);
		this.isPersistent = true;
		this.floating = true;

		this.ui_left = me.loader.getImage("ui_left");
		this.ui_right = me.loader.getImage("ui_right");
		this.ui_jump = me.loader.getImage("ui_jump");

		// Button areas
		var buttons = this.buttons = {

			"left" : new me.Rect(new me.Vector2d(10, 95), 20, 20),
			"right" : new me.Rect(new me.Vector2d(30, 95), 20, 20),
			"jump" : new me.Rect(new me.Vector2d(145, 95), 20, 20)
		};

		// Set keys

		buttons.left.key = me.input.KEY.LEFT;
		buttons.right.key = me.input.KEY.RIGHT;
		buttons.jump.key = me.input.KEY.X;

		// Set default button properties
		for (var name in buttons) {
			buttons[name].pressed = false;
			buttons[name].id = 0;
		}

		// Event handlers
		function mousemove(e) {
			// Iterate each button
			for (var name in buttons) {
				var button = buttons[name];

				// Check if button is pressed by this touch
				var pressed = button.containsPoint(e.gameX, e.gameY);

				if (pressed && !button.pressed) {
					// Button down
					button.pressed = true;
					button.id = e.pointerId;
					me.input.triggerKeyEvent(button.key, true);
				}
				else if ((button.id === e.pointerId) && !pressed && button.pressed) {
					// Button up
					button.pressed = false;
					button.id = 0;
					me.input.triggerKeyEvent(button.key, false);
				}
			}
		}

		function mouseup(e) {
			// Iterate each button
			for (var name in buttons) {
				var button = buttons[name];

				// Check if button is released by this touch
				var released = (button.id === e.pointerId);

				if (button.pressed && released) {
					// Button up
					button.pressed = false;
					button.id = 0;
					me.input.triggerKeyEvent(button.key, false);
				}
			}
		}

		me.input.registerPointerEvent("mousedown", this, mousemove, true);
		me.input.registerPointerEvent("mousemove", this, mousemove, true);
		me.input.registerPointerEvent("mouseup", this, mouseup, true);
	},

	destroy : function () {

		me.input.releasePointerEvent("mousedown", this);
		me.input.releasePointerEvent("mousemove", this);
		me.input.releasePointerEvent("mouseup", this);
	},

	draw : function (context) {
		
		context.drawImage(this.ui_left, 10, 95);
		context.drawImage(this.ui_right, 40, 95);
		context.drawImage(this.ui_jump, 145, 95);

		if (me.debug.renderHitBox) {
			this.buttons.left.draw(context, "#0ff");
			this.buttons.right.draw(context, "#f00");
		}
	}
});


// ====================
// Full Screen Button
// ====================

var screen = document.getElementById('screen');
var fullScreenButton = document.getElementById('fullscreen');

function launchFullscreen(element) {
	if(element.requestFullscreen) {
		element.requestFullscreen();
	} else if(element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if(element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	} else if(element.msRequestFullscreen) {
		element.msRequestFullscreen();
	} else {

		screen.className = "fullscreen";

		// Trigger window resize to force melonjs to re-scale
		window.dispatchEvent(new Event('resize'));	
	}
}

if(fullScreenButton){

	fullScreenButton.addEventListener('click', function(){

		launchFullscreen(screen);
	});
}

// ==============
// Mute Button
// ==============

var soundButton = document.getElementById('sound');

// Toggle game sounds

if(soundButton){

	soundButton.addEventListener('click', function(){

		// Unmute
		if(this.className == 'mute'){

			this.className = "";
			localStorage.sound = "unmute";
			me.audio.unmuteAll();
		}
		// Mute
		else{

			this.className = "mute";
			localStorage.sound = "mute";
			me.audio.muteAll()			
		}		
	});
}

// ==================
// Gamepad Controls
// ==================

var gamepadPressed = { 

	left: false, 
	right: false, 
	jump: false
};

var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

if(isChrome){

	function updateStatus(){

		window.webkitRequestAnimationFrame(updateStatus);

		var gamepad = navigator.webkitGetGamepads && navigator.webkitGetGamepads()[0];

		if(gamepad){
		
			// Right Analouge Stick
			if( gamepad.axes[0] > 0.3 ){

				gamepadPressed.right = true;
				me.input.triggerKeyEvent(me.input.KEY.RIGHT, true);
			}
			else if( gamepad.axes[0] < 0.3  && gamepadPressed.right ){

				gamepadPressed.right = false;
				me.input.triggerKeyEvent(me.input.KEY.RIGHT, false);
			}

			// Left Analouge Stick
			if( gamepad.axes[0] < -0.3 ){

				gamepadPressed.left = true;
				me.input.triggerKeyEvent(me.input.KEY.LEFT, true);
			}
			else if( gamepad.axes[0] > -0.3  && gamepadPressed.left ){

				gamepadPressed.left = false;
				me.input.triggerKeyEvent(me.input.KEY.LEFT, false);
			}

			// Jump Button
			if(gamepad.buttons[0] >= 1){

				gamepadPressed.jump = true;
				me.input.triggerKeyEvent(me.input.KEY.X, true);
			}
			else if(gamepad.buttons[0] == 0  && gamepadPressed.jump ){
				
				gamepadPressed.jump = false;
				me.input.triggerKeyEvent(me.input.KEY.X, false);
			}
		}
	}
	window.webkitRequestAnimationFrame(updateStatus);
}



