
/* Game namespace */
var game = {

	data: {

		progress : null,
		score : 0,
		level : 'active',
		defaultGems: 0,
		totalGems : 0,
		hint: false,
		hintText: '',
		hintText2: '',
		hasKey: false,
		npcText: false,
		multiplayer: false
	},

	// Run on page load.
	onload : function () {
		
		// Initialize the video.
		if (!me.video.init("screen", 200, 130, true, 2)) {
			alert("Your browser does not support HTML5 canvas.");
			return;
		}
		
		// add "#debug" to the URL to enable the debug Panel
		if (document.location.hash === "#debug") {
			window.onReady(function () {
				me.plugin.register.defer(debugPanel, "debug");
			});
		}

		// Initialize the audio.
		me.audio.init("mp3, ogg");

		// Set a callback to run when loading is complete.
		me.loader.onload = this.loaded.bind(this);
	 
		// Load the resources.
		me.loader.preload(game.resources);

		// Initialize melonJS and display a loading screen.
		me.state.change(me.state.LOADING);
	},



	// Run on game resources loaded.
	loaded : function () {

		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.MENU, new game.TitleScreen());
		me.state.set(me.state.PLAY, new game.PlayScreen());
		me.state.set(me.state.INTRO, new game.IntroScreen());
		 
		// entity pool
		me.pool.register("mainPlayer", game.PlayerEntity);
		me.pool.register("gemEntity", game.gemEntity);
		me.pool.register("crateEntity", game.crateEntity);
		me.pool.register("spikesEntity", game.spikesEntity);
		me.pool.register("balloonEntity", game.balloonEntity);
		me.pool.register("spikeBallEntity", game.spikeBallEntity);
		me.pool.register("ghoulEntity", game.ghoulEntity);
		me.pool.register("npcEntity", game.npcEntity);
		me.pool.register("specterEntity", game.specterEntity);
		me.pool.register("fireballEntity", game.fireballEntity, true);
		me.pool.register("smokeEffect", game.smokeEffect, true);
		me.pool.register("gameInfo", game.HUD.gameInfo, true); 
		me.pool.register("storyEntity", game.storyEntity, true); 
		me.pool.register("blueSwitchEntity", game.blueSwitchEntity);
		me.pool.register("redSwitchEntity", game.redSwitchEntity);
		me.pool.register("greenSwitchEntity", game.greenSwitchEntity);
		me.pool.register("metalBlockEntity", game.metalBlockEntity);
		me.pool.register("flagEntity", game.flagEntity);
		me.pool.register("levelEntity", game.levelEntity);
		me.pool.register("zoneEntity", game.zoneEntity);
		me.pool.register("hintEntity", game.hintEntity);
		me.pool.register("keyEntity", game.keyEntity);
		me.pool.register("doorEntity", game.doorEntity);
		me.pool.register("platformEntity", game.platformEntity);
		me.pool.register("fallingPlatformEntity", game.fallingPlatformEntity);
		me.pool.register("cameraEntity", game.cameraEntity);
		me.pool.register("dakarGemEntity", game.dakarGemEntity);
				 
		// key bindings
		me.input.bindKey(me.input.KEY.P, "pause", true);

		// Player 1
		me.input.bindKey(me.input.KEY.LEFT, "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.SPACE, "up", true);
		me.input.bindKey(me.input.KEY.UP, "jump", true, false);
		me.input.bindKey(me.input.KEY.X, "jump", true, false);

		// Player 2
		me.input.bindKey(me.input.KEY.A, "left2");
		me.input.bindKey(me.input.KEY.D, "right2");
		me.input.bindKey(me.input.KEY.W, "jump2", true, false);


		me.audio.setVolume(3);

		save.init();

		// Retrieve sound setting on load 
		var soundSetting = localStorage.sound || null;

		if(soundButton && soundSetting == "unmute"){

			soundButton.className = "";
			me.audio.unmuteAll();
		}
		else if(soundButton){

			soundButton.className = "mute";
			me.audio.muteAll()	
		}

		//me.debug.renderHitBox = true;
		  
		// start the game
		me.state.change(me.state.MENU);
	}
};
