game.EndScreen = me.ScreenObject.extend({

	init: function(){

		//call the parent constructor giving true
		//as parameter, so that we use the update & draw functions
		this.parent(true);
	},

	onResetEvent: function() {

		this.END = new game.END.Container();
	
		me.game.world.addChild(this.END);

	}

});

game.END = game.END || {};

game.END.Container = me.ObjectContainer.extend({

	init: function() {
		// call the constructor
		this.parent();
		 
		// non collidable
		this.collidable = false;
		 
		// make sure our object is always draw first
		this.z = Infinity;
 
		// give a name
		this.name = "END";

		this.addChild(new endTitle());
		this.addChild(new titleBg());
	}
});

var endTitle = me.Renderable.extend({

	init:function(x,y){

		this.floating = true;
		this.image = me.loader.getImage("title");
	},

	draw:function(context){

		context.drawImage(this.image, 0, 0);
	}

});