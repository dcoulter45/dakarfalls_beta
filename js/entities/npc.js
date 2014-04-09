
game.npcEntity = me.ObjectEntity.extend({

	init: function(x, y, settings) {
		
		settings.image = 'npc';
		settings.spritewidth = 16;
		settings.spriteheight = 16;
		settings.width = 16;
		settings.height = 16;

		this.parent(x,y,settings);

		this.text = false;
		this.text1 = settings.text1;
		this.text2 = settings.text2;
		this.text3 = settings.text3;
		this.text4 = settings.text4;
		this.move = settings.move || true;
		this.distance = settings.distance;

		this.flipX(true);

		this.clock = 3000;

		// size of sprite
		this.startX = x;
		this.endX = x + (settings.distance * 16) - settings.spritewidth -1;

		// make him start from the left
		this.walkLeft = false;
 
		// walking & jumping speed
		this.setVelocity(0.4, 2);

		if(settings.type == 1){

			this.renderable.addAnimation("default",[0]);
			this.renderable.addAnimation("walking",[1,2,3,4],140);
		}
		else if(settings.type == 5){
			
			this.renderable.addAnimation("default",[5]);
			this.renderable.addAnimation("walking",[6,7,8,9],140);
		}
		else if(settings.type == 3){
			
			this.renderable.addAnimation("default",[10]);
			this.renderable.addAnimation("walking",[11,12,13,14],140);
		}
		else if(settings.type == 4){
			
			this.renderable.addAnimation("default",[15]);
			this.renderable.addAnimation("walking",[16,17,18,19],140);
		}
		
		this.renderable.setCurrentAnimation("walking");
	},

	update: function(dt){

		// do nothing if not in viewport
		if (!this.inViewport)
			return false;

		
		// Player Collision

		var res = me.game.world.collide(this);

		if(res && res.type == 'mainPlayer' && game.data.npcText == false && me.input.isKeyPressed('up') ){

			this.text = true;
			this.move = false;
			this.vel.x = 0;

			game.data.npcText = true;
			game.data.npcText1 = this.text1;
			game.data.npcText2 = this.text2;
		}
		else if(res && res.type == 'mainPlayer' && this.text3 && me.input.isKeyPressed('up') ){

			game.data.npcText1 = this.text3;
			game.data.npcText2 = this.text4;
		}
		else if(!res && this.text) {

			this.text = false;
			this.move = true;
			game.data.npcText = false;		
		}


		// NPC Movement 

		if(this.move && this.distance > 1){

			this.clock -= dt;

			// Walk About
			if (this.clock > 0 && this.clock < 3000) {
				
				// Direction
				if (this.walkLeft && this.pos.x <= this.startX) {
					
					this.walkLeft = false;
				} 
				else if (!this.walkLeft && this.pos.x >= this.endX) {
					
					this.walkLeft = true;
				}
				
				// make it walk
				this.flipX(this.walkLeft);
				this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
					
			}
			// Stop Walking
			else if(this.clock <= 0){

				this.vel.x = 0;
				this.clock = Math.floor((Math.random()*3000)+4000); 
				this.renderable.setCurrentAnimation("default");
			}
		}

		// Set Animation
		if(!this.renderable.isCurrentAnimation("walking") && this.vel.x!=0){

			this.renderable.setCurrentAnimation("walking");
		}
		else if(!this.renderable.isCurrentAnimation("default") && this.vel.x==0){

			this.renderable.setCurrentAnimation("default");
		}
		 
		// check and update movement
		this.updateMovement();
		
		// update object animation
		this.parent(dt);
		return true;
	}

});

game.HUD.npcText = me.Renderable.extend( {

	init: function(x, y) {

		this.floating = true;

		this.textBG = me.loader.getImage("hintbg");
		this.font = new me.BitmapFont("6x6_font", 6);
		this.font.set("left");

	},

	draw: function(context){

		if(game.data.npcText){	
		
			context.drawImage(this.textBG, 0, 105);

			this.font.draw(context, game.data.npcText1, 10, 110);
			this.font.draw(context, game.data.npcText2, 10, 120);
		}
	}
});