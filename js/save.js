
var save = {

	data: {

		spawn: { x: 0, y: 0 },

		zone1:{

			area01: { gems: 0 }, area02: { gems: 0 }, area03: { gems: 0 }, area04: { gems: 0}, area05: { gems: 0}, area06: { gems: 0}, 
			area07: { gems: 0}, area08: { gems: 0}, area09: { gems: 0}, gems: 0
		},

		zone2:{

			area01: { gems: 0 }, area02: { gems: 0 }, area03: { gems: 0 }, area04: { gems: 0}, area05: { gems: 0}, area06: { gems: 0}, 
			area07: { gems: 0}, area08: { gems: 0}, area09: { gems: 0}, gems: 0
		},

		zone3:{

			area01: { gems: 0 }, area02: { gems: 0 }, area03: { gems: 0 }, area04: { gems: 0}, area05: { gems: 0}, area06: { gems: 0}, 
			area07: { gems: 0}, area08: { gems: 0}, area09: { gems: 0}, gems: 0
		},

		zone4:{

			area01: { gems: 0 }, area02: { gems: 0 }, area03: { gems: 0 }, area04: { gems: 0}, area05: { gems: 0}, area06: { gems: 0}, 
			area07: { gems: 0}, area08: { gems: 0}, area09: { gems: 0}, gems: 0
		},

		zone9:{

			area01: { gems: 0 }, area02: { gems: 0 }, area03: { gems: 0 }, area04: { gems: 0}, area05: { gems: 0}, area06: { gems: 0}, 
			area07: { gems: 0}, area08: { gems: 0}, area09: { gems: 0}, gems: 0
		}
	},

	init: function(){

		// Get Save Data if exists
		if(localStorage.save){

			// Parse storage data as json object
			var prevSave = JSON.parse(localStorage.save);

			// Merge Save Data and init Data
			for (i=1; i<=9; i++) {

				save.data.zone1["area0"+i] = prevSave.zone1["area0"+i]; 
				save.data.zone1.gems += prevSave.zone1["area0"+i].gems;
			}
			for (i=1; i<=9; i++) {

				save.data.zone2["area0"+i] = prevSave.zone2["area0"+i];
				save.data.zone2.gems += prevSave.zone2["area0"+i].gems;
			}
			
			for (i=1; i<=9; i++) {

				save.data.zone3["area0"+i] = prevSave.zone3["area0"+i];
				save.data.zone3.gems += prevSave.zone3["area0"+i].gems;
			}

			for (i=1; i<=9; i++) {

				save.data.zone4["area0"+i] = prevSave.zone4["area0"+i];
				save.data.zone4.gems += prevSave.zone4["area0"+i].gems;
			}

			for (i=1; i<=9; i++) {

				save.data.zone9["area0"+i] = prevSave.zone9["area0"+i];
				save.data.zone9.gems += prevSave.zone9["area0"+i].gems;
			}
		}
	},

	reset: function(){

		// Reset gem counts
		for (i=1; i<=9; i++) save.data.zone1["area0"+i].gems = 0;
		for (i=1; i<=9; i++) save.data.zone2["area0"+i].gems = 0;
		for (i=1; i<=9; i++) save.data.zone3["area0"+i].gems = 0;
		for (i=1; i<=9; i++) save.data.zone4["area0"+i].gems = 0;
		
		save.data.zone1.gems = 0;
		save.data.zone2.gems = 0;
		save.data.zone3.gems = 0;
		save.data.zone4.gems = 0;
	},

	add: function(zone,area,gems) {

		save.data[zone][area].gems = gems;

		save.data[zone].gems = 0;
		
		for(i=1; i<=9; i++){

			save.data[zone].gems += save.data[zone]["area0"+i].gems;
		}

		localStorage.save = JSON.stringify(save.data);
	}

}

