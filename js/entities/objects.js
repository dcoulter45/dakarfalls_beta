// =============
//  Flag entity
// =============

game.flagEntity = me.ObjectEntity.extend({ 

	init: function(x, y, settings) {

		settings.image = 'objects';
		settings.spritewidth = 16;
		settings.spriteheight = 16;

		this.parent(x, y, settings);

		this.type = 'flag';

		this.renderable.addAnimation("default",[3]);
		this.renderable.setCurrentAnimation("default");

		this.to = settings.to;

		this.zone = me.game.currentLevel.levelId.split("_")[0];
		this.area = me.game.currentLevel.levelId.split("_")[1].substr(0,6);

		this.clock = 0;

		game.data.totalGems = settings.totalGems;
	},

	onCollision: function(res,obj) {

		// Set level to complete once player reaches the flag
		if(obj.type == "mainPlayer" && game.data.level == 'active'){

			game.data.level = 'complete';
		}

	},

	update: function(dt){

		if(game.data.level == 'complete'){

			this.clock += dt;
		}

		if(this.clock > 2000){

			me.game.viewport.fadeIn('#222222',300, (function(){
				
				if(save.data[this.zone][this.area].gems < game.data.score){

					save.add(this.zone,this.area,game.data.score);
				}

				game.data.level = 'active';
				game.data.defaultGems = 0;
				game.data.score = 0;

				me.levelDirector.loadLevel(this.to);

			}).bind(this));
		}
	}
});

game.levelEntity = me.ObjectEntity.extend({ 

	init: function(x, y, settings) {

		settings.image = 'objects';
		settings.spritewidth = 16;
		settings.spriteheight = 16;

		this.parent(x, y, settings);

		this.type = 'flag';
		this.to = settings.to;
		this.clock = 500;

		this.renderable.addAnimation("default",[39]);
		this.renderable.setCurrentAnimation("default");
	},

	onCollision: function(res,obj) {

		// Set level to complete once player reaches the flag
		if(obj.type == "mainPlayer" && game.data.level == 'active'){

			game.data.level = 'next';
		}

	},

	update: function(dt){

		if(game.data.level == 'next'){

			this.clock -= dt;
		}

		if(this.clock < 0){

			me.game.viewport.fadeIn('#222222', 300, (function(){

				game.data.level = 'active';
				game.data.defaultGems = game.data.score;

				me.levelDirector.loadLevel(this.to);

			}).bind(this));
		}
	}
});

game.zoneEntity = me.ObjectEntity.extend({ 

	init: function(x, y, settings) {

		settings.image = 'objects';
		settings.spritewidth = 16;
		settings.spriteheight = 16;

		this.parent(x, y, settings);

		this.type = 'zone';
		this.to = settings.to;

		this.newX = settings.newX*16;
		this.newY = settings.newY*16+16;

		this.renderable.addAnimation("default",[38]);
		this.renderable.setCurrentAnimation("default");
	},

	onCollision: function(res,obj) {

		// Set level to complete once player reaches the flag
		if(obj.type == "mainPlayer" && game.data.level == 'active'){

			me.game.viewport.fadeIn('#222222', 300, (function(){

				save.data.spawn.x = this.newX;
				save.data.spawn.y = this.newY;

				localStorage.lastZone = this.to;
				me.levelDirector.loadLevel(this.to);

			}).bind(this));
		}

	}
});

// ===============
//  Gem entity
// ===============

game.gemEntity = me.CollectableEntity.extend({

	init: function(x, y, settings) {

		settings.image = 'objects';
		settings.spritewidth = 16;
		settings.spriteheight = 16;

		this.parent(x, y, settings);

		//this.updateColRect(6, 4, 2, 12);
		var shape = this.getShape();
		shape.pos.x = 6;
		shape.resize(4, 12);

		this.renderable.addAnimation("default",[0]);
		this.renderable.addAnimation("destory",[16,17,18,19]);
		this.renderable.setCurrentAnimation("default");
	},
 
	onCollision: function(res, obj) {
	
		if(obj.type == "mainPlayer"){
		
			this.collidable = false;

			game.data.score += 1;

			me.audio.play("pickup_gem");

			this.renderable.setCurrentAnimation("destory", (function(){
				
				//this.renderable.setAnimationFrame(3);
				//this.renderable.animationpause = true;
				me.game.world.removeChild(this);
				return false;
			}).bind(this));	
		}
	}
});

// ====================
//  Blue Switch entity
// ====================

game.blueSwitchEntity = me.ObjectEntity.extend({

	init: function(x, y, settings) {

		settings.image = 'objects';
		settings.spritewidth = 16;
		settings.spriteheight = 16;

		this.parent(x, y, settings);

		//this.updateColRect(1, 14, 9, 7);
		var shape = this.getShape();
		shape.pos.y = 9;
		shape.resize(14, 7);

		this.type = 'blueSwitch';
		
		if(settings.velY) this.velY = settings.velY;
		else this.velY = 3;

		this.renderable.addAnimation("default",[11]);
		this.renderable.addAnimation("bounce",[13,13,12],50);
		this.renderable.setCurrentAnimation("default");
	},
 
	onCollision: function(res, obj) {
	
		if(obj.type == "mainPlayer" && obj.falling){
		
			this.renderable.setCurrentAnimation("bounce", (function(){

				this.renderable.setCurrentAnimation("default");
			}).bind(this));
		}
	}
});

// ====================
//  Red Switch entity
// ====================

game.redSwitchEntity = me.ObjectEntity.extend({

	init: function(x, y, settings) {

		settings.image = 'objects';
		settings.spritewidth = 16;
		settings.spriteheight = 16;

		this.parent(x, y, settings);

		//this.updateColRect(1, 14, 9, 7);
		var shape = this.getShape();
		shape.pos.y = 11;
		shape.resize(14, 5);

		this.alwaysUpdate = true;
		this.active = false;
		this.type = 'redSwitch';

		this.renderable.addAnimation("default",[5]);
		this.renderable.addAnimation("down",[6]);
		this.renderable.setCurrentAnimation("default");
	},
 
	onCollision: function(res, obj) {

		//console.log(this.pos.y + " " + (obj.pos.y+16));
	
		if((obj.type == "mainPlayer" || obj.type == 'crate' ) && obj.falling && res.y > 0 && this.pos.y-4 > obj.pos.y && this.active == false){
			
			this.active = true;
			this.renderable.setCurrentAnimation("down");
			var metalBlocks = me.game.world.getChildByName("metalBlock");

			metalBlocks.forEach(function(obj){

				obj.switch();
			});

		}
	}
});

// ====================
//  Green Switch entity
// ====================

game.greenSwitchEntity = me.ObjectEntity.extend({

	init: function(x, y, settings) {

		settings.image = 'objects';
		settings.spritewidth = 16;
		settings.spriteheight = 16;

		this.parent(x, y, settings);

		//this.updateColRect(1, 14, 9, 7);
		var shape = this.getShape();
		shape.pos.y = 10;
		shape.resize(14, 6);

		this.alwaysUpdate = true;
		this.active = false;
		this.type = 'greenSwitch';

		this.renderable.addAnimation("default",[8]);
		this.renderable.addAnimation("down",[9]);
		this.renderable.setCurrentAnimation("default");
	},
 
	update: function(dt) {

		var res = me.game.world.collide(this);
		
		if(res){

			if((res.obj.type == "mainPlayer" || res.obj.type == 'crate' ) && this.pos.y-4 > res.obj.pos.y && this.active == false){

				this.active = true;
				this.renderable.setCurrentAnimation("down");
				var metalBlocks = me.game.world.getChildByName("metalBlock");

				metalBlocks.forEach(function(obj){

					obj.switch();
				});
			}
		}

		else if(this.active == true){

			this.active = false;
			this.renderable.setCurrentAnimation("default");
			var metalBlocks = me.game.world.getChildByName("metalBlock");

			metalBlocks.forEach(function(obj){

				obj.switch();
			});			
		}

		this.parent(dt);
		return true;

	}
});

// ====================
//  Metal Block entity
// ====================

game.metalBlockEntity = me.ObjectEntity.extend({

	init: function(x, y, settings) {

		settings.image = 'objects';
		settings.spritewidth = 16;
		settings.spriteheight = 16;
		settings.repeat = 'repeat';

		this.parent(x, y, settings);

		this.type = 'solid';
		this.name = 'metalBlock';

		this.renderable.addAnimation("active",[22]);
		this.renderable.addAnimation("inactive",[21]);

		if(settings.active == false){
			
			this.active = false;
			this.collidable = false;
			this.renderable.setCurrentAnimation("inactive");
		} 
		else{
			
			this.active = true;
			this.renderable.setCurrentAnimation("active");
		}
		
	},
 
	switch: function() {
	
		if(this.active == false){

			this.active = true;
			this.collidable = true;
			this.renderable.setCurrentAnimation("active");
		}
		else if( this.active == true ){

			this.active = false;
			this.collidable = false;
			this.renderable.setCurrentAnimation("inactive");
		}
	}
});

// ===============
//  Key entity
// ===============

game.keyEntity = me.CollectableEntity.extend({

	init: function(x, y, settings) {

		settings.image = 'objects';
		settings.spritewidth = 16;
		settings.spriteheight = 16;

		this.parent(x, y, settings);

		//this.updateColRect(2, 12, 2, 12);
		var shape = this.getShape();
		shape.pos.x = 2;
		shape.pos.y = 2;
		shape.resize(12, 12);

		this.renderable.addAnimation("default",[10]);
		this.renderable.addAnimation("destory",[16,17,18,19]);
		this.renderable.setCurrentAnimation("default");
	},
 
	onCollision: function(res, obj) {
	
		if(obj.type == "mainPlayer"){
		
			this.collidable = false;

			game.data.hasKey = true;

			me.audio.play("pickup_gem");

			this.renderable.setCurrentAnimation("destory", (function(){
				
				me.game.remove(this);
				return false;
			}).bind(this));	
		}
	}
});

// =============
//  Door entity
// =============

game.doorEntity = me.ObjectEntity.extend({ 

	init: function(x, y, settings) {

		this.bigDoor = (settings.width > 16) ? true : false;

		settings.image = 'objects';

		if(this.bigDoor){
		
			settings.spritewidth = 32;
			settings.spriteheight = 32;
		}
		else{

			settings.spritewidth = 16;
			settings.spriteheight = 16;
		}

		this.parent(x, y, settings);

		this.nextArea = settings.area;
		this.gems = settings.gems;
		this.time = settings.time;

		this.gameInfo = false;
		this.name = 'door';

		this.prevLevel = parseInt(this.nextArea.substr(10,11))-1;
		this.zone = this.nextArea.split("_")[0];
		
		// Is level locked
		if( this.prevLevel == 0 || // First Level always unlocked
			this.prevLevel > 0 && save.data[this.zone]["area0"+this.prevLevel].gems > 0 ||
			this.prevLevel > 9 && save.data[this.zone]["area"+this.prevLevel].gems > 0){

			this.locked = false;
		}
		else{

			this.time = 'locked';
			this.locked = true;
		}

		if(this.bigDoor){

			this.renderable.addAnimation("open",[9]);
			this.renderable.addAnimation("locked",[8]);
			this.locked = (save.data[me.game.currentLevel.levelId].gems >= this.gems) ? false : true;

		}
		else{

			this.renderable.addAnimation("open",[7]);
			this.renderable.addAnimation("locked",[23]);
		}
		

		if(this.locked)	this.renderable.setCurrentAnimation("locked");
		else this.renderable.setCurrentAnimation("open");
	},

	onCollision: function(res,obj) {

		// Travel To Level
		if(obj.type == "mainPlayer" && me.input.isKeyPressed('up') && game.data.level == 'active' && this.locked == false){

			// Prevents loading next map multiple times
			game.data.level = 'switching';
						
			me.game.viewport.fadeIn('#222222',300, (function(){

				game.data.level = 'active';

				// Set Spawn point for return to hub
				if(!this.bigDoor){
				
					save.data.spawn.x = this.pos.x;
					save.data.spawn.y = this.pos.y;
				}

				// Set default zone to load
				if(this.bigDoor){

					localStorage.lastZone = this.nextArea;
				}

				// Load Level
				me.levelDirector.loadLevel(this.nextArea);
			}).bind(this));	
		}

		// Display Level Info
		if(obj.type == "mainPlayer" && this.gameInfo == false){

			// Remove old gameInfo
			this.info = me.game.world.getChildByName("gameInfo")[0];
			if(this.info) me.game.world.removeChild(this.info);

			// Reset all other doors
			this.doors = me.game.world.getChildByName("door");
			
			this.doors.forEach(function(obj){

				obj.gameInfo = false;
			});
			
			// Display Info
			this.gameInfo = true;
			var gameInfo = me.pool.pull("gameInfo", this.pos.x-26, this.pos.y-45, this.nextArea, this.gems, this.time, this.GUID); 
			me.game.world.addChild(gameInfo, 99);
		}
	}
});

// ==============
//  Crate entity
// ==============

game.crateEntity = me.ObjectEntity.extend({

	init: function(x, y, settings) {

		settings.image = 'objects';
		settings.spritewidth = 16;
		settings.spriteheight = 16;

		this.parent(x, y, settings);

		// adjust the bounding box
		var shape = this.getShape();
		shape.pos.x = 1;
		shape.resize(14, shape.height);

		this.renderable.addAnimation("default",[2]);
		this.renderable.setCurrentAnimation("default");

		this.gravity = 0.1;
		this.setVelocity(1, 2.5);
		this.alwaysUpdate = true;
		this.type = 'crate';
		this.spawnX = this.pos.x;
		this.spawnY = this.pos.y-16;

	},

	onCollision: function(res, obj) {
		

	},

	update: function(dt){

		this.updateMovement();

		// Respawn Crate in outside world
		if( this.pos.y > me.game.viewport.bounds.height+32){

			this.pos.x = this.spawnX;
			this.pos.y = this.spawnY;
		}

		var res = me.game.world.collide(this, true);

		if(res.length > 0){

			res.forEach((function(res){

				if( res.obj.type == "mainPlayer" && this.pos.y < res.obj.pos.y+16 ){
				
					// pushed right
					if( res.obj.lastflipX==false && res.x <= 0 && res.x >= -1){

						this.vel.x += this.accel.x * me.timer.tick;
					}
					
					// pushed left
					else if( res.obj.lastflipX==true && res.x <= 1 && res.x >= 0){
						
						this.vel.x -= this.accel.x * me.timer.tick;
					}
				}

				// Land on top of other crate
				if ( res.obj.type == "crate" ){

					if( this.pos.y+16 >= res.obj.pos.y ){

						this.gravity = 0;
						this.vel.y = 0;
					}
				}

				// Don't fall through solid objects
				if( res.obj.type == "solid" && res.y > 0){

					this.vel.y = 0;
					this.pos.y = res.obj.pos.y-16;
					this.falling = false;
				}
				else if( res.obj.type == "solid" && res.x > 0 ){

					this.vel.x = 0;
					this.pos.x = res.obj.pos.x - 15; 
				}
				else if( res.obj.type == "solid" && res.x < 0 ){

					this.vel.x = 0;
					this.pos.x = res.obj.pos.x + 15; 
				}

				if((res.obj.type == 'redSwitch' || res.obj.type == 'greenSwitch') && this.pos.y+16 <= res.obj.pos.y+12){
					
					this.vel.y = 0;
					this.pos.y = res.obj.pos.y-5;
					this.falling = false;
				}


			}).bind(this));
		
			for(i=0; i < res.length; i++){

				if(res[i].type == 'mainPlayer')
					break;

				if(i+1 == res.length )
					this.vel.x = 0;
			}

		} 
		else {

			this.vel.x = 0;
		}

		return false;	

	}

});

// ==============
//  Spike Entity
// ==============

game.spikesEntity = me.ObjectEntity.extend({

	init: function(x, y, settings) {

		settings.image = 'objects';
		settings.spritewidth = 16;
		settings.spriteheight = 16;

		this.parent(x, y, settings);

		this.renderable.addAnimation("default",[1]);
		this.renderable.setCurrentAnimation("default");

		//this.updateColRect(1, 14, 2, 14);
		var shape = this.getShape();
		shape.pos.x = 1;
		shape.pos.y = 1;
		shape.resize(14, 14);

		this.type = 'harmful';

	},

});

// ================
//  Balloon Entity
// ================

game.balloonEntity = me.ObjectEntity.extend({

	init: function(x, y, settings) {

		this.parent(x, y, settings);

		//this.updateColRect(1, 14, 2, 12);
		var shape = this.getShape();
		shape.pos.x = 1;
		shape.pos.y = 2;
		shape.resize(14, 12);

		this.renderable.addAnimation("default",[0,1,2,1,0,3,4,3],200);
		this.renderable.addAnimation("burst",[5,6,7],100);
		this.renderable.setCurrentAnimation("default");

		this.type = 'balloon';

	},

	onCollision: function(res, obj) {
 
		// res.y >0 means touched by something on the bottom
		// which mean at top position for this one
		if (this.alive && (res.y > 0) && obj.falling) {
			
			this.alive = false;

			me.audio.play("pop");

			this.renderable.setCurrentAnimation("burst", (function(){
				
				me.game.world.removeChild(this);
				return false;
			}).bind(this));				
		}
	}
});

// ===================
// Spike Ball Entity
// ===================

game.spikeBallEntity = me.ObjectEntity.extend({

	init: function(x, y, settings) {

		settings.image = 'objects';
		settings.spritewidth = 16;
		settings.spriteheight = 16;

		this.parent(x, y, settings);

		this.renderable.addAnimation("default",[15]);
		this.renderable.setCurrentAnimation("default");

		//this.updateColRect(2, 12, 2, 12);
		var shape = this.getShape();
		shape.pos.x = 2;
		shape.pos.y = 2;
		shape.resize(12, 12);

		this.gravity = 0;

		this.direction = settings.direction;

		if( this.direction == 'x'){
			
			this.start = x;
			this.end = x + settings.distance * 16;
		}
		else if( this.direction == 'y'){

			this.start = y;
			this.end = y + settings.distance * 16;
		}

		this.moveUp = true;

		this.setVelocity(0.5, 0.5);

		this.type = 'harmful';

		this.collidable = true;

	},

	update: function(dt){

		// do nothing if not in viewport
		if (!this.inViewport)
			return false;
		
		// Move left to right
		if (this.direction == 'x') {

			if (this.moveUp && this.pos.x <= this.start) {
				this.moveUp = false;
			} 
			else if (!this.moveUp && this.pos.x >= this.end) {
				this.moveUp = true;
			}
			// make it move
			this.vel.x += (this.moveUp) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
		}

		// Move up and down
		else if (this.direction == 'y') {
			
			if (this.moveUp && this.pos.y <= this.start) {
				this.moveUp = false;
			} 
			else if (!this.moveUp && this.pos.y >= this.end) {
				this.moveUp = true;
			}
			// make it move
			this.vel.y += (this.moveUp) ? -this.accel.y * me.timer.tick : this.accel.y * me.timer.tick;
				
		} 
		else {
			this.vel.y = 0;
		}
		//this.vel.y += this.accel.x * me.timer.tick;
		 
		// check and update movement
		this.updateMovement();

		this.parent(dt);
		return true;
	}

});