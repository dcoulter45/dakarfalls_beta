game.PlayScreen = me.ScreenObject.extend({

	init: function(){

		//call the parent constructor giving true
		//as parameter, so that we use the update & draw functions
		this.parent(true);
	},
		
	// action to perform on state change
		
	onResetEvent: function() {	
	
		// load a level
		me.levelDirector.loadLevel("zone2_area07");

		//game.data.score = 0;

		me.audio.play("thisMachineThinks", true); // loop audio
		 
		// add our HUD to the game world   
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
		me.game.world.sort();
	},
	
		
	// action to perform when leaving this screen (state change)

	onDestroyEvent: function() {
		
		// remove the HUD from the game world
		if(game.data.progress == 'complete'){
			
			me.game.world.removeChild(this.HUD);
		}
	}
});
