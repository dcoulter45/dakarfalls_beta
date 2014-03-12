game.IntroScreen = me.ScreenObject.extend({

	init: function(){

		//call the parent constructor giving true
		//as parameter, so that we use the update & draw functions
		this.parent(true);
	},
			
	onResetEvent: function() {	
	
		this.INTRO = new game.INTRO.Container();

		me.game.world.addChild(this.INTRO);

		me.game.viewport.fadeOut('#222222',500);

		var storyboard = me.pool.pull("storyEntity", 0, 0); 
		me.game.world.addChild(storyboard, this.z+1);
	}

});

game.INTRO = game.INTRO || {};

game.INTRO.Container = me.ObjectContainer.extend({

	init: function() {
		// call the constructor
		this.parent();
		 
		// non collidable
		this.collidable = false;
		 
		// make sure our object is always draw first
		this.z = Infinity;
 
		// give a name
		this.name = "INTRO";
		 
		// add children
		//this.addChild(new storyEntity(0,0), this.z+1 );
	}
});

// create a basic GUI Object
game.storyEntity = me.ObjectEntity.extend({

	init:function(x, y){

		settings = {};
		settings.image = "storyboard";
		settings.spritewidth = 180;
		settings.spriteheight = 120;
		settings.width = 180;
		settings.height = 120;

		// parent constructor
		this.parent(x, y, settings);

		this.complete = false;

		this.renderable.animationpause = true;

	},

	update:function(dt){

		// key pressed
		if (me.input.isKeyPressed('jump') ) {
			
			var currentFrame = this.renderable.getCurrentAnimationFrame();

			if(currentFrame < 8){

				this.renderable.setAnimationFrame(currentFrame+1);
			}
			else if(!this.complete){

				this.complete = true;

				me.game.viewport.fadeIn('#222222',1000, (function () {

					this.renderable.setAnimationFrame(currentFrame+1);
					me.state.change(me.state.PLAY);
				}).bind(this));
			}
			
		}

		this.parent(dt);
		return true;
	},

	// output something in the console
	// when the object is clicked
	onClick:function(event){

		me.audio.play("menu_ping");
		// don't propagate the event
		return false;
   }
});
