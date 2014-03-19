game.PlayerEntity = me.ObjectEntity.extend({
 
	init: function(x, y, settings) {

		settings.spritewidth = 16;
		settings.spriteheight = 16;

		// call the constructor
		this.parent(x, y, settings);

		this.gravity = 0.1;

		// set the default horizontal & vertical speed (accel vector)
		this.setVelocity(1, 2.6);

		// adjust the bounding box
		var shape = this.getShape();
		shape.pos.x = 2;
		shape.resize(12, shape.height);

		this.alwaysUpdate = true;

		this.clock = 0;

		this.state = 'default';

		this.type = 'mainPlayer';

		// set the display to follow our position on both axis
		//me.game.viewport.follow(this.pos, me.game.viewport.AXIS.VERTICAL);

		this.renderable.addAnimation("stand",[0]);
		this.renderable.addAnimation("walk",[1,2,3,4],150);
		this.renderable.addAnimation("jump",[5]);
		this.renderable.addAnimation("hurt",[6]);
		this.renderable.addAnimation("falling",[7]);
		this.renderable.addAnimation("behind",[8]);
		this.renderable.setCurrentAnimation("stand");

		if(me.game.currentLevel.levelId.length < 6 && save.data.spawn.x !== 0 ){

			this.pos.x = save.data.spawn.x;
			this.pos.y = save.data.spawn.y;
		}

		me.game.viewport.fadeOut('#222222',300);
 
	},

	onCollision: function(res,obj) {


	},
 
	update: function(dt) {

		// If below screen
		if( this.pos.y > me.game.viewport.bounds.height && this.alive){

			this.die();
		}

		if( this.pos.x < me.game.world.getChildByName("cameraEntity")[0].pos.x-130 && this.pos.x < me.game.viewport.bounds.width-212 && this.alive ){

			this.die();
		}

		if ( (me.input.isKeyPressed('right') && this.alive) || this.state=='done') {
			
			// unflip the sprite
			this.flipX(false);

			// update the entity velocity
			//this.vel.x += this.speed;
			this.vel.x += this.accel.x * me.timer.tick
		}  
		else if (me.input.isKeyPressed('left') && this.alive) {
			
			// flip the sprite on horizontal axis
			this.flipX(true);
			
			// update the entity velocity
			this.vel.x -= this.accel.x * me.timer.tick
		}
		else {

			this.vel.x = 0;
		}

		// =========
		// Jumping
		// =========

		if (me.input.isKeyPressed('jump') && this.alive) {
			
			// make sure we are not already jumping or falling
			if (!this.jumping && !this.falling) {
				
				//this.setVelocity(1.2, 2.5);
				
				me.audio.play("jump");

				// set current vel to the maximum defined value
				// gravity will then do the rest
				this.vel.y = -this.maxVel.y * me.timer.tick;
				
				// set the jumping flag
				this.jumping = true;
			}
 
		}

		if(this.jumping == false){

			//this.setVelocity(60/me.sys.fps, 2.5);
			this.setVelocity(1, 2.6);
		}


		// check & update player movement
		this.updateMovement();

		// ===========
		// Collisions
		// ===========

		var res = me.game.world.collide(this, true);

		if(res.length > 0){

			res.forEach((function(res){

				if (res && this.alive) {
					
					// enemy
					if (res.obj.type == 'enemyObject') {
					
						// check if we jumped on it
						//if ((res.y > 0) && ! this.jumping) {
						if(this.falling){
							
							// bounce (force jump)
							this.falling = false;
							this.vel.y = -this.maxVel.y * me.timer.tick;
							
							// set the jumping flag
							this.jumping = true;
			 
						} else {
							
							this.die();
						}
					}

					// Harmful objects

					if( res.obj.type == 'harmful') this.die();
						
					// Balloon
					
					if ( res.obj.type == 'balloon'){

						if ((res.y > 0) && ! this.jumping) {
							// bounce (force jump)
							this.falling = false;
							this.vel.y = -this.maxVel.y * me.timer.tick;
							// set the jumping flag
							this.jumping = true;
			 
						}
					}

					// Blue Switch

					if(res.obj.type == 'blueSwitch' && this.pos.y <= res.obj.pos.y && this.falling ){

						// Allow extra jump height
						this.setVelocity(1, res.obj.velY);

						// bounce (force jump)
						this.falling = false;
						this.vel.y = -this.maxVel.y * me.timer.tick;
						// set the jumping flag
						this.jumping = true;
					}

					// Red Switch

					if((res.obj.type == "redSwitch" || res.obj.type == "greenSwitch") && res.y > 0 && this.pos.y < res.obj.pos.y-4  && this.falling){

						this.vel.y = 0;
						this.pos.y = res.obj.pos.y-5;
						this.falling = false;
					}

					// Land on Solid Object
					if(res.obj.type == 'solid'){

						if(res.y > 0 && this.falling && res.obj.pos.x < this.pos.x+14 && res.obj.pos.x+14 > this.pos.x){
							
							this.vel.y = 0;
							this.pos.y = res.obj.pos.y-16;
							this.falling = false;
						}
						else if(res.x > 0){
		
							this.vel.x = 0;
							this.pos.x = res.obj.pos.x-14;
						}
						else if(res.x < 0){

							this.vel.x = 0;
							this.pos.x = res.obj.pos.x+14;
						}
						else if(res.y < 0 && !this.falling && res.obj.pos.x < this.pos.x+14 && res.obj.pos.x+14 > this.pos.x){
							
							this.vel.y = 0;
						}
						
					}

					// Land on Crate
					
					if(res.obj.type == 'crate' && this.pos.y+12 <= res.obj.pos.y && this.falling ) {

						this.vel.y = 0;
						this.pos.y = res.obj.pos.y-16;
						this.falling = false;
					}

					// Land on Moving Platform
					
					if(res.obj.type == 'platform' && this.pos.y+12 <= res.obj.pos.y && this.falling ) {

						this.vel.y = 0;
						this.pos.y = res.obj.pos.y-16;
						this.falling = false;

						// Move with vertical platform
						if(res.obj.direction == 'y' && !res.obj.moveUp){

							this.pos.y = res.obj.pos.y-15;
						}

						// Move with horizontal platform
						if(res.obj.direction == 'x' && this.vel.x == 0 && res.obj.reverse){
							
							if(res.obj.moveUp ) this.pos.x += 0.4;
							else if(!res.obj.moveUp ) this.pos.x -= 0.4;
						}

						else if(res.obj.direction == 'x' && this.vel.x == 0){
							
							if(res.obj.moveUp ) this.pos.x -= 0.4;
							else if(!res.obj.moveUp ) this.pos.x += 0.4;
						}
						
					}

					// Flag

					if(res.obj.type == 'flag'){

						//this.alive = false;
						//this.pos.x += 0.5;
						this.state = 'done';
					}
				} 
				
			}).bind(this));
		}

		// Set Animation 
		if(!this.alive){

			this.renderable.setCurrentAnimation("hurt");
			this.clock += dt;
		}
		else if(game.data.level == 'switching'){

			this.renderable.setCurrentAnimation("behind");
		}
		else if(this.jumping){

			this.renderable.setCurrentAnimation("jump");
		}
		else if(this.falling){

			this.renderable.setCurrentAnimation("falling");
		}
		else if(!this.renderable.isCurrentAnimation("walk") && this.vel.x!=0){

			this.renderable.setCurrentAnimation("walk");
		}
		else if(!this.renderable.isCurrentAnimation("stand") && this.vel.x==0){

			this.renderable.setCurrentAnimation("stand");
		}

		// Reload Level once dead
		if(!this.alive && this.clock > 500){

			this.clock = 0;

			me.game.viewport.fadeIn('#222222',200, (function(){

				game.data.score = game.data.defaultGems;
				me.levelDirector.reloadLevel();
			}).bind(this));
		}
		
		// update animation if necessary
		
		//if (this.vel.x!=0 || this.vel.y!=0) {

			// update object animation
			this.parent(dt);
			return true;
			
		//}
	},

	die: function(){

		// let's flicker in case we touched an enemy
		this.renderable.flicker(1000);

		this.alive = false;

		me.audio.play("hurt");
	}
 
});