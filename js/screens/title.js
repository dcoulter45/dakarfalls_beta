game.TitleScreen = me.ScreenObject.extend({
	
	// constructor
	init: function() {

		this.parent(true);

		var screen = document.getElementById('screen');

		// Rect for play button
		//var button = { play: new me.Rect(new me.Vector2d(22, 16), 61, 91)};
		var button = { play: new me.Rect(new me.Vector2d(22, 16), 61, 91)};

		// Check mouse location for hover
		me.input.registerPointerEvent("mousemove", me.game.viewport, function(e){

			if( button.play.containsPoint(e.gameX, e.gameY) ){

				screen.style.cursor = 'pointer';
			}
			else{

				screen.style.cursor = 'default';
			}

		}, true);

	},
 
	// reset function
	onResetEvent: function() {

		this.TITLE = new game.TITLE.Container();
	
		me.game.world.addChild(this.TITLE);
 
		// enable the keyboard
		me.input.bindKey(me.input.KEY.ENTER, "enter", true); 
 
	},
 
	// destroy function
	onDestroyEvent: function() {

		document.getElementById('screen').style.cursor = 'default';
		
		me.input.releasePointerEvent("mousemove", me.game.viewport);

		me.input.unbindKey(me.input.KEY.ENTER);
	}
 
});

game.TITLE = game.TITLE || {};

game.TITLE.Container = me.ObjectContainer.extend({

	init: function() {
		// call the constructor
		this.parent();
		 
		// non collidable
		this.collidable = false;
		 
		// make sure our object is always draw first
		this.z = Infinity;
 
		// give a name
		this.name = "TITLE";
		 
		// add children
		this.addChild(new playButton(22,16), this.z+1 );
		this.addChild(new coopButton());
		this.addChild(new settingsButton());
		this.addChild(new titleBg());
	}
});

// create a basic GUI Object
var playButton = me.GUI_Object.extend({

	init:function(x, y){

		settings = {};
		settings.image = "title_play";
		settings.spritewidth = 61;
		settings.spriteheight = 91;

		// parent constructor
		this.parent(x, y, settings);
	},

	update:function(){

		// enter pressed ?
		if (me.input.isKeyPressed('enter')) {
			
		}
	},

	// output something in the console
	// when the object is clicked
	onClick:function(event){

		me.audio.play("menu_ping");
		me.state.change(me.state.PLAY);
		// don't propagate the event
		return false;
   }
});

var coopButton = me.Renderable.extend({

	init:function(x,y){

		this.floating = true;

		this.image = me.loader.getImage("title_coop");
	},

	draw:function(context){

		context.drawImage(this.image, 93, 16);
	}

});

var settingsButton = me.Renderable.extend({

	init:function(x,y){

		this.floating = true;

		this.image = me.loader.getImage("title_options");
	},

	draw:function(context){

		context.drawImage(this.image, 93, 65);
	}

});

var titleBg = me.Renderable.extend({

	init:function(x,y){

		this.floating = true;

		this.image = me.loader.getImage("title_bg");
	},

	draw:function(context){

		context.drawImage(this.image, 0, 0);
	}

});





