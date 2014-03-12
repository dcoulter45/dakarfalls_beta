// ===========
// Game HUD
// ===========

game.HUD = game.HUD || {};


game.HUD.Container = me.ObjectContainer.extend({

	init: function() {
		// call the constructor
		this.parent();
		 
		// persistent across level change
		this.isPersistent = true;
		 
		// non collidable
		this.collidable = false;
		 
		// make sure our object is always draw first
		this.z = Infinity;
 
		// give a name
		this.name = "HUD";
		 
		// add our child score object at the right-bottom position
		this.addChild(new game.HUD.ScoreItem(630, 440));
		this.addChild(new game.HUD.LevelComplete(630, 440));
		this.addChild(new game.HUD.Hint(630, 440));
		this.addChild(new game.HUD.npcText(630, 440));
		this.addChild(new game.HUD.KeyItem(630, 440));
		//this.addChild(new game.HUD.gameInfo(630, 440));
		
		var is_touch_device = 'ontouchstart' in document.documentElement;
		
		if(is_touch_device){
		
			this.addChild(new game.touchUI(630, 440));
		}
	}
});

// ===========
// Key HUD
// ===========

game.HUD.KeyItem = me.Renderable.extend( {

	init: function(x, y) {

		this.floating = true;

		this.key = me.loader.getImage("key");

	},

	draw: function(context){

		if(game.data.hasKey){

			context.drawImage(this.key, 50, 0);

		}
	}
});


// ===========
// Score
// ===========

game.HUD.ScoreItem = me.Renderable.extend( {   
	
	// constructor
	init: function(x, y) {
		 
		// call the parent constructor
		// (size does not matter here)
		this.parent(10,10,10);
 
		// local copy of the global score
		this.score = -1;
 
		// make sure we use screen coordinates
		this.floating = true;

		// create a font
		this.font = new me.BitmapFont("7x7_font", 7);
		this.font.set("left");
	},
	 
	
	// update function
	update : function () {
		// we don't do anything fancy here, so just
		// return true if the score has been updated
		if (this.score !== game.data.score) {  
			this.score = game.data.score;
			return true;
		}
		return false;
	},
 
	//draw the score
	draw : function (context) {

		this.font.draw(context, 'GEMS:' + game.data.score , 3, 3);
	}
 
});

// ============
//  Level Info 
// ============

game.HUD.gameInfo = me.Renderable.extend({

	init: function(x,y,area,gems,time,door){

		//this.floating = true;
		this.parent(new me.Vector2d(x, y), 67, 31); 

		this.x = x;
		this.y = y;

		this.clock = 1000;
		this.name = 'gameInfo';

		// Level Info
		this.area = area.split("_")[1];
		this.zone = area.split("_")[0]
		this.area2 = "AREA " + this.area.slice(4,6);
		this.gems = save.data[this.zone][this.area].gems;
		if(this.gems<10) this.gems = '0'+this.gems;
		this.totalGems = gems;
		this.time = time;
		this.door = door;

		// Images
		this.img = {};
		this.img.gem = me.loader.getImage("iconGem");
		this.img.bg = me.loader.getImage("infoBg");

		if(time=='sun')	this.img.time = me.loader.getImage("iconSun");
		else if(time=='sunset') this.img.time = me.loader.getImage("iconSunset");
		else if(time=='night')this.img.time = me.loader.getImage("iconNight");
		else if(time=='locked')this.img.time = me.loader.getImage("iconLock");

		this.font = new me.BitmapFont("6x6_font", 6);
		this.font.set("left");
	},

	update: function(dt){

		this.clock -= dt;

		if(this.clock < 0){
			
			//me.game.world.getChildByGUID(this.door).gameInfo = false;
			//me.game.world.removeChild(this);
		}
	},

	draw: function(context){

		context.drawImage(this.img.bg, this.x, this.y);
		context.drawImage(this.img.gem, this.x+7, this.y+17);
		context.drawImage(this.img.time, this.x+5, this.y+5);
		
		this.font.draw(context, this.area2, this.x+19, this.y+7);
		this.font.draw(context, this.gems+'/0'+this.totalGems, this.x+19, this.y+19);
	}
});


// ===============
//  Hint Text
// ===============

game.HUD.Hint = me.Renderable.extend( {

	init: function(x, y) {

		this.floating = true;

		this.completeBar = me.loader.getImage("hintbg");
		this.font = new me.BitmapFont("6x6_font", 6);
		this.font.set("left");

	},

	draw: function(context){

		if(game.data.hint){
		
			context.drawImage(this.completeBar, 0, 95);

			this.font.draw(context, game.data.hintText, 10, 100);
			this.font.draw(context, game.data.hintText2, 10, 110);

		}
	}
});

game.hintEntity = me.ObjectEntity.extend({

	init: function(x, y, settings) {

		settings.image = 'objects';
		settings.spritewidth = 16;
		settings.spriteheight = 16;

		this.parent(x, y, settings);

		this.renderable.addAnimation("default",[14]);
		this.renderable.setCurrentAnimation("default");

		this.text = settings.text;
		this.text2 = settings.text2;
		this.clock = 0;
	},

	onCollision: function(res, obj) {

	},


	update: function(dt){

		var res = me.game.world.collide(this);

		// Player collision, display hint after 1 second
		if(res && res.type == 'mainPlayer'){

			if(this.clock < 1000 ) this.clock += dt;
			
			if(this.clock >= 1000){
				game.data.hint = true;
				game.data.hintText = this.text; 
				game.data.hintText2 = this.text2; 
			}
		}

		// Hide hint and reset clock when player leaves
		else {

			this.clock = 0;
			game.data.hint = false;
			game.data.hintText = '';
			game.data.hintText2 = '';			
		}

	}
});

// ===============
// Level Complete
// ===============

game.HUD.LevelComplete = me.Renderable.extend( {

	init: function(x, y) {

		this.floating = true;

		this.completeBar = me.loader.getImage("complete");

		this.font = new me.BitmapFont("7x7_font", 7);
		this.font.set("left");

		this.fontRight = new me.BitmapFont("7x7_font", 7);
		this.fontRight.set("right");
	},

	draw: function(context){

		if(game.data.level == 'complete'){
		
			context.drawImage(this.completeBar, 0, 30);

			this.font.draw(context, 'LEVEL COMPLETE', 41, 34);

			this.font.draw(context, 'GEMS:', 41, 50);

			this.fontRight.draw(context, game.data.score+'/'+game.data.totalGems, 138, 50);
		}
	}

});