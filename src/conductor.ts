// CRISTIAN ECHEVERRÍA RABÍ

import type {Category} from "./category"

//--------------------------------------------------------------------------------------------------

export class Conductor {
	/*
	Container for conductor characteristics
	name.... : Name of conductor
	category : Category instance
	diameter : Diameter [mm]
	area..   : Cross section area [mm2]
	weight   : Weight per unit [kg/m]
	strength : Rated strength [kg]
	r25.     : Resistance at 25°C [Ohm/km]
	hcap..   : Heat capacity [kcal/(ft*°C)]
	idx.     : Database key
	*/
	constructor(public name: string, public category: Category, public diameter: number,
	            public area: number, public weight: number, public strength: number,
	            public r25: number, public hcap: number, public idx?: string) {}
}
