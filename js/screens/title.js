game.TitleScreen = me.ScreenObject.extend({
	
	// constructor
	init: function() {

		this.parent(true);

		var screen = document.getElementById('screen');

		// Dection zones for buttons
		var mainButtons = { play: new me.Rect(new me.Vector2d(32, 21), 61, 91), 
							coop: new me.Rect(new me.Vector2d(103, 21), 61, 42), 
							settings: new me.Rect(new me.Vector2d(103, 70), 61, 42)};

		var optionButtons = { back: new me.Rect(new me.Vector2d(35, 35), 132, 18), 
							  fullscreen: new me.Rect(new me.Vector2d(35, 57), 132, 18), 
							  save: new me.Rect(new me.Vector2d(35, 80), 132, 18)};

		// Check mouse location against dection zones
		me.input.registerPointerEvent("mousemove", me.game.viewport, function(e){

			this.titleContainer = me.game.world.getChildByName("TITLE")[0];

			if(this.titleContainer && this.titleContainer.state=="mainMenu"){
				
				screen.style.cursor = ( mainButtons.play.containsPoint(e.gameX, e.gameY) || 
										mainButtons.coop.containsPoint(e.gameX, e.gameY) || 
										mainButtons.settings.containsPoint(e.gameX, e.gameY) ) ? "pointer" : "default";
			}
			else if(this.titleContainer && this.titleContainer.state=="options"){

				screen.style.cursor = ( optionButtons.back.containsPoint(e.gameX, e.gameY) || 
										optionButtons.fullscreen.containsPoint(e.gameX, e.gameY) || 
										optionButtons.save.containsPoint(e.gameX, e.gameY) ) ? "pointer" : "default";
			}

		}, true);

	},
 
	// reset function
	onResetEvent: function() {

		this.TITLE = new game.TITLE.Container();
	
		me.game.world.addChild(this.TITLE);

 		// enable the keyboard
		//me.input.bindKey(me.input.KEY.ENTER, "enter", true); 
 
	},
 
	// destroy function
	onDestroyEvent: function() {

		document.getElementById('screen').style.cursor = 'default';
		
		me.input.releasePointerEvent("mousemove", me.game.viewport);

		//me.input.unbindKey(me.input.KEY.ENTER);
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
		this.type = "menuScreen";
		this.state = "mainMenu";
		 
		// add children
		this.addChild(new playButton(32,21));
		this.addChild(new coopButton(103, 21));
		this.addChild(new settingsButton(103, 70));

		this.addChild(new titleBg());
	},

	displayOptions: function(){

		this.state = "options";

		this.removeChild(me.game.world.getChildByName("playButton")[0]);
		this.removeChild(me.game.world.getChildByName("coopButton")[0]);
		this.removeChild(me.game.world.getChildByName("settingsButton")[0]);

		this.addChild(new backButton(35, 35), this.z+1);
		this.addChild(new fullscreenButton(35, 57), this.z+1);
		this.addChild(new saveButton(35, 80), this.z+1);
	},

	displayMainMenu: function(){

		this.state = "mainMenu";

		this.removeChild(me.game.world.getChildByName("backButton")[0]);
		this.removeChild(me.game.world.getChildByName("fullscreenButton")[0]);
		this.removeChild(me.game.world.getChildByName("saveButton")[0]);

		this.addChild(new playButton(32,21), this.z+1);
		this.addChild(new coopButton(103, 21), this.z+1);
		this.addChild(new settingsButton(103, 70), this.z+1);
	}
});

// ============
//  Main Menu
// ============

var playButton = me.GUI_Object.extend({

	init:function(x, y){

		settings = {};
		settings.image = (localStorage.save) ? "title_play" : "title_newgame";
		settings.spritewidth = 61;
		settings.spriteheight = 91;

		this.name = "playButton";
		this.parent(x, y, settings);
	},

	// when the object is clicked
	onClick:function(event){

		me.audio.play("menu_ping");

		if(localStorage.save){

			me.state.change(me.state.PLAY);
		}
		else{

			me.game.viewport.fadeIn('#222222', 500, (function () {

				me.state.change(me.state.INTRO);
			}).bind(this));	
		}
		
		// don't propagate the event
		return false;
   }
});

var coopButton = me.GUI_Object.extend({

	init:function(x,y){

		settings = {};
		settings.image = "title_coop";
		settings.spritewidth = 61;
		settings.spriteheight = 42;

		this.name = "coopButton";
		this.parent(x, y, settings);
	},

	onClick:function(event){

		me.audio.play("menu_ping");

		game.data.multiplayer = true;
		me.state.change(me.state.PLAY);
	}

});

var settingsButton = me.GUI_Object.extend({

	init:function(x,y){

		settings = {};
		settings.image = "title_options";
		settings.spritewidth = 61;
		settings.spriteheight = 42;

		this.name = "settingsButton";
		this.parent(x, y, settings);
	},

	onClick:function(event) {
		
		me.audio.play("menu_ping");
		me.game.world.getChildByName("TITLE")[0].displayOptions();
	}
});

// ============
//  Options
// ============

var backButton = me.GUI_Object.extend({

	init:function(x,y){

		settings = {};
		settings.image = "options_back";
		settings.spritewidth = 132;
		settings.spriteheight = 18;

		this.name = "backButton";
		this.parent(x, y, settings);
	},

	onClick:function(event){

		me.audio.play("menu_ping");
		me.game.world.getChildByName("TITLE")[0].displayMainMenu();
	}
});

var fullscreenButton = me.GUI_Object.extend({

	init:function(x,y){

		settings = {};
		settings.image = "options_fullscreen";
		settings.spritewidth = 132;
		settings.spriteheight = 18;

		this.name = "fullscreenButton";
		this.parent(x, y, settings);
	},

	onClick:function(event){

		launchFullscreen(screen);
	}
});

var saveButton = me.GUI_Object.extend({

	init:function(x,y){

		settings = {};
		settings.image = "options_save";
		settings.spritewidth = 132;
		settings.spriteheight = 18;

		this.name = "saveButton";
		this.parent(x, y, settings);
	},

	onClick:function(event){

		var deleteSave = confirm("Are you sure you want to delete your save data");

		if(deleteSave == true){

			alert("Save Data Deleted");
		}
		else{


		}
	}
});


// ============
// Background
// ============

var titleBg = me.Renderable.extend({

	init:function(x,y){

		this.floating = true;

		this.image = me.loader.getImage("title_bg");
	},

	draw:function(context){

		context.drawImage(this.image, 0, 0);
	}

});





