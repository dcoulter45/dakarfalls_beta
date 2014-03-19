// =================
//  Camera
// =================

game.cameraEntity = me.ObjectEntity.extend({

	init: function(x, y, settings) {

		this.parent(x, y, settings);

		this.alwaysUpdate = true;

		this.collidable = false;

		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		//console.log(me.game.viewport);

		me.game.viewport.setBounds(0,0,me.game.viewport.bounds.width-32, me.game.viewport.bounds.height);

		if(settings.movement == 'scrolling'){

			this.movement = 'scrolling';
			this.setVelocity(settings.vel, 2.7);
		}
		else{
			this.movement = 'player';
		}

		this.player = me.game.world.getChildByName("mainPlayer")[0];
	},

	update: function(dt){

		if(!this.player) this.player = me.game.world.getChildByName("mainPlayer")[0];

		this.pos.y = this.player.pos.y || 0;

		if(this.movement == 'player'){
			
			this.pos.x = this.player.pos.x+8 || 0;
		}

		else if( this.movement == 'scrolling' && game.data.level != 'complete'){
			
			this.vel.x += this.accel.x * me.timer.tick;	
			this.updateMovement();
			this.parent(dt);
			return true;
		}
		else{

			//this.vel.x = 0;
		}

		
	}

});

// ==================
//  Falling Platform
// ==================

game.fallingPlatformEntity = me.ObjectEntity.extend({

	init: function(x, y, settings) {

		settings.image = 'objects';
		settings.spritewidth = 16;
		settings.spriteheight = 16;

		this.parent(x, y, settings);

		this.type = 'platform';
		this.gravity = 0;
		this.setVelocity(1, 2);
		this.clock = 500;
		this.startClock = false;
		this.alwaysUpdate = true;

		this.renderable.addAnimation("zone1",[24]);
		this.renderable.addAnimation("zone2",[28]);
		this.renderable.addAnimation("zone3",[26]);

		this.zone = me.game.currentLevel.levelId.split("_")[0];
		
		if(this.zone=='zone1') this.renderable.setCurrentAnimation("zone1");
		else if(this.zone=='zone2') this.renderable.setCurrentAnimation("zone2");
		else if(this.zone=='zone3') this.renderable.setCurrentAnimation("zone3");
	},

	onCollision: function(res,obj) {

		// Set level to complete once player reaches the flag
		if(obj.type == "mainPlayer" && obj.falling && res.y > 0){

			this.startClock = true;
		}

	},

	update: function(dt){

		// Start Clock
		if(this.startClock) this.clock -= dt;

		// Drop Platform
		if(this.clock <= 0){

			this.collidable = false;
			this.vel.y += this.accel.x * me.timer.tick;
		}

		// check and update movement
		this.updateMovement();

		this.parent(dt);
		return true;
	}

});

// =================
//  Moving Platform
// =================

game.platformEntity = me.ObjectEntity.extend({

	init: function(x, y, settings) {

		settings.image = 'objects';
		settings.spritewidth = 16;
		settings.spriteheight = 16;

		this.parent(x, y, settings);

		this.gravity = 0;
		this.direction = settings.direction;
		this.setVelocity(0.4, 0.4);
		this.alwaysUpdate = true;
		this.type = 'platform';

		if( this.direction == 'x'){
			
			this.start = x;
			this.end = x + settings.distance * 16;
		}
		else if( this.direction == 'y'){

			this.start = y;
			this.end = y + settings.distance * 16;
		}

		this.moveUp = true;

		this.reverse = settings.reverse;

		this.renderable.addAnimation("zone1",[24]);
		this.renderable.addAnimation("zone2",[25]);
		this.renderable.addAnimation("zone3",[26]);

		this.zone = me.game.currentLevel.levelId.split("_")[0];
		
		if(this.zone=='zone1') this.renderable.setCurrentAnimation("zone1");
		else if(this.zone=='zone2') this.renderable.setCurrentAnimation("zone2");
		else if(this.zone=='zone3') this.renderable.setCurrentAnimation("zone3");

	},

	update: function(dt){
		
		// Move left to right
		if (this.direction == 'x') {

			if(this.reverse == true){

				// Switch Direction Statements
				if (this.moveUp && this.pos.x >= this.start) {
					this.moveUp = false;
				} 
				else if (!this.moveUp && this.pos.x <= this.end) {
					this.moveUp = true;
				}
				// make it move
				this.vel.x += (this.moveUp) ? this.accel.x * me.timer.tick : -this.accel.x * me.timer.tick;
			}
			else {

				// Switch Direction Statements
				if (this.moveUp && this.pos.x <= this.start) {
					this.moveUp = false;
				} 
				else if (!this.moveUp && this.pos.x >= this.end) {
					this.moveUp = true;
				}
				// make it move
				this.vel.x += (this.moveUp) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
			}
		}

		// Move up and down
		else if (this.direction == 'y') {

			if(this.reverse == true){

				// Switch Direction Statements
				if (this.moveUp && this.pos.y >= this.start) {
					this.moveUp = false;
				} 
				else if (!this.moveUp && this.pos.y <= this.end) { 
					this.moveUp = true;
				}
				// make it move
				this.vel.y += (this.moveUp) ? this.accel.y * me.timer.tick : -this.accel.y * me.timer.tick;
			}
			else {

				// Switch Direction Statements
				if (this.moveUp && this.pos.y <= this.start) {
					this.moveUp = false;
				} 
				else if (!this.moveUp && this.pos.y >= this.end) { 
					this.moveUp = true;
				}
				// make it move
				this.vel.y += (this.moveUp) ? -this.accel.y * me.timer.tick : this.accel.y * me.timer.tick;
			}
		} 

		else {

			this.vel.y = 0;
		}
		 
		// check and update movement
		this.updateMovement();

		this.parent(dt);
		return true;
	}

});

// ==============
//  Ghoul Entity
// ==============

game.ghoulEntity = me.ObjectEntity.extend({
	
	init: function(x, y, settings) {
	
		// define this here instead of tiled
		settings.image = "ghoul";
		settings.spritewidth = 16;
 
		// call the parent constructor
		this.parent(x, y, settings);

		this.renderable.addAnimation("walking",[0,1],250);
		this.renderable.setCurrentAnimation("walking");
		
		// size of sprite
		this.startX = x;
		this.endX = x + (settings.distance * 16) - settings.spritewidth -1;

		// make him start from the left
		this.walkLeft = false;
 
		// walking & jumping speed
		this.setVelocity(0.4, 6);
 
		// make it collidable
		this.collidable = true;
		// make it a enemy object
		this.type = 'enemyObject';
 
	},
 
	// call by the engine when colliding with another object
	// obj parameter corresponds to the other object (typically the player) touching this one
	onCollision: function(res, obj) {
	
		// This being crushed

		// res.y >0 means touched by something on the bottom
		// which mean at top position for this one
		if (this.alive && obj.falling) { //(res.y > 0) && 
			
			this.alive = false;

			me.audio.play("puff");

			var smoke = me.pool.pull("smokeEffect", this.pos.x, this.pos.y); 
			me.game.world.addChild(smoke, this.z+1);
			me.game.world.sort();
				
			me.game.world.removeChild(this);
			return false;
		}
	},
 
	// manage the enemy movement
	update: function(dt) {
		
		// do nothing if not in viewport
		if (!this.inViewport)
			return false;
 
		if (this.alive) {
			
			if (this.walkLeft && this.pos.x <= this.startX) {
				
				this.walkLeft = false;
			} 
			else if (!this.walkLeft && this.pos.x >= this.endX) {
				
				this.walkLeft = true;
			}
			
			// make it walk
			this.flipX(this.walkLeft);
			this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
				
		} else {
			this.vel.x = 0;
		}
		 
		// check and update movement
		this.updateMovement();
		
		// update object animation
		this.parent(dt);
		return true;
		
		return false;
	}
});

// =======
//  Smoke 
// =======

game.smokeEffect = me.ObjectEntity.extend({

	init: function(x, y){

		var settings = {};
		settings.image = 'smoke';
		settings.spritewidth = 16;
		settings.spriteheight = 16;
		settings.width = 16;
		settings.height = 16;

		this.parent(x,y,settings);

		this.renderable.addAnimation("default",[0,1,2,3]);
		
		this.renderable.setCurrentAnimation("default", (function(){

			me.game.world.removeChild(this);
			return false;
		}).bind(this));
	}
});

// =================
//  Fireball Entity
// =================

game.fireballEntity = me.ObjectEntity.extend({

	init: function(x, y, flipDirection) {

		var settings = {};
		settings.image = 'fireball';
		settings.spritewidth = 8;
		settings.spriteheight = 8;
		settings.width = 8;
		settings.height = 8;

		this.parent(x, y, settings);

		this.flipDirection = flipDirection;

		// So we can destroy this on screen leave
		this.alwaysUpdate = true;

		this.gravity = 0;
		this.type = 'harmful';

		this.vel.x = (flipDirection) ? -1 : 1;

		this.renderable.addAnimation("right",[0,1]);
		this.renderable.addAnimation("left",[2,3]);
		
		if(flipDirection){
			this.renderable.setCurrentAnimation("left");
		}
		else{
			this.renderable.setCurrentAnimation("right");
		}
		
	},

	onCollision: function(res, obj){

		if(obj.type == 'mainPlayer'){

			me.game.world.removeChild(this);
		}

	},

	update: function(dt){

		if(this.flipDirection){ 
			
			//this.flipX(true);
		}

		// Destroy fireball when it leaves the screen		
		if(!this.inViewport){

			me.game.world.removeChild(this);
			return false;
		}

		// Remove if stopped
		if(this.vel.x == 0){

			me.game.world.removeChild(this);
		}
		
		// check and update movement	
		this.updateMovement();
		
		// update object animation
		this.parent(dt);
		return true;
	}

});

// ===============
// Specter Entity
// ===============

game.specterEntity = me.ObjectEntity.extend({
	
	init: function(x, y, settings) {

		// call the parent constructor
		this.parent(x, y, settings);

		this.type = 'enemyObject';

		if(settings.flip){

			this.flipDirection = true;
			this.flipX(true);
		}

		this.renderable.addAnimation("default",[0]);
		this.renderable.addAnimation("openMouth",[1,2,2]);
		this.renderable.addAnimation("closeMouth",[2,1]);
		this.renderable.setCurrentAnimation("default");

		this.canShoot = true;

	},

	onCollision: function(res, obj){
		
		if (this.alive && obj.falling) { //(res.y > 0) && 
			
			this.alive = false;

			this.clock = 0;

			me.audio.play("puff");

			var smoke = me.pool.pull("smokeEffect", this.pos.x, this.pos.y); 

			me.game.world.addChild(smoke, this.z+1);
			//me.game.world.sort();
				
			me.game.world.removeChild(this);
			return false;
		}
	},

	update: function(dt){

		if(this.inViewport && this.canShoot){

			// Shoot FireBall
			this.canShoot = false;

			// Change Animation to shooting
			this.renderable.setCurrentAnimation("openMouth", (function(){

				if(this.flipDirection)
					var fireball = me.pool.pull("fireballEntity", this.pos.x+2, this.pos.y+4, true); 
				else
					var fireball = me.pool.pull("fireballEntity", this.pos.x+14, this.pos.y+4, false); 

				me.game.world.addChild(fireball, this.z+1);
				//me.game.world.sort();
								
				this.renderable.setCurrentAnimation("closeMouth", (function(){

					this.renderable.setCurrentAnimation("default");
				}).bind(this));

				return false;

			}).bind(this));	

			// reset clock
			this.clock = 0;

		}

		this.clock += dt;

		if(this.clock > 2000) this.canShoot = true;

		// update object animation
	
		this.parent(dt);
		return true;

	}

});


