
var save = {

	data: {

		spawn: { x: 0, y: 0 },

		zone1:{

			area01: { gems: 0 }, area02: { gems: 0 }, area03: { gems: 0 }, area04: { gems: 0}, area05: { gems: 0}, area06: { gems: 0}, 
			area07: { gems: 0}, area08: { gems: 0}, area09: { gems: 0}
		},

		zone2:{

			area01: { gems: 0 }, area02: { gems: 0 }, area03: { gems: 0 }, area04: { gems: 0}, area05: { gems: 0}, area06: { gems: 0}, 
			area07: { gems: 0}, area08: { gems: 0}, area09: { gems: 0}
		},

		zone3:{

			area01: { gems: 0 }, area02: { gems: 0 }, area03: { gems: 0 }, area04: { gems: 0}, area05: { gems: 0}, area06: { gems: 0}, 
			area07: { gems: 0}, area08: { gems: 0}, area09: { gems: 0}
		}
	},

	init: function(){

		// Get Save Data
		if(localStorage.save){
			var prevSave = JSON.parse(localStorage.save);

			// Merge Save Data and init Data
			for (var area in prevSave.zone1) { save.data.zone1[area] = prevSave.zone1[area]; }
			for (var area in prevSave.zone2) { save.data.zone2[area] = prevSave.zone2[area]; }
			for (var area in prevSave.zone3) { save.data.zone3[area] = prevSave.zone3[area]; }
		}
	},

	add: function(zone,area,gems) {

		save.data[zone][area].gems = gems;

		localStorage.save = JSON.stringify(save.data);
	}

}

