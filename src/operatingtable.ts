// CRISTIAN ECHEVERRÍA RABÍ

import {check} from "./checker"
import type {CurrentCalc} from "./currentcalc"
import * as k from "./constants"

//--------------------------------------------------------------------------------------------------

export class OperatingItem {
	/*
	Container for conductor and operating conditions

	Read-only properties
	currentcalc : CurrentCalc instance
	tempMaxOp   : Maximux operating temperature for currentcalc.conductor [°C]
	nsc         : Number of subconductor per fase
	*/
	private _currentcalc: CurrentCalc;
	private _tempMaxOp: number;
	private _nsc: number;

	constructor(currentcalc: CurrentCalc, tempMaxOp=50.0, nsc=1, altitude=300.0, emissivity=0.5) {
		/*
		currentcalc : CurrentCalc instance
		tempMaxOp   : Maximum operating temperature for currentcalc.conductor [°C]
		nsc         : Number of subconductor per face
		altitude    : Altitude [m] = 300.0
		emissivity  : Emissivity (0 to 1) = 0.5
		*/
		currentcalc.altitude = altitude;
		currentcalc.emissivity = emissivity;
		check(tempMaxOp).ge(k.TC_MIN).le(k.TC_MAX);
		check(nsc).ge(1);

		this._currentcalc = currentcalc;
		this._tempMaxOp = tempMaxOp;
		this._nsc = nsc;
	}

	// Public methods

	getCurrent(ta: number): number {
		/*
		Returns current for the OperatingItems [ampere]
		ta : Ambient temperature [°C]
		*/
		return this._currentcalc.getCurrent(ta, this._tempMaxOp) * this._nsc
	}

	getCurrentList(taList: Array<number>): Array<number> {
		/*
		Returns list with current [ampere]
		taList: Secuence with ambient temperatures [°C]
		*/
		return taList.map(x => this.getCurrent(x));
	}

	// Propiedades

	get currentcalc(): CurrentCalc {
		return this._currentcalc;
	}

	set currentcalc(value: CurrentCalc) {
		throw new RangeError('OperatingItem.CurrentCalc is readonly');
	}

	get tempMaxOp(): number {
		return this._tempMaxOp;
	}

	set tempMaxOp(value: number) {
		throw new RangeError('OperatingItem.tempMaxOp is readonly');
	}

	get nsc(): number {
		return this._nsc;
	}

	set nsc(value: number) {
		throw new RangeError('OperatingItem.nsc is readonly');
	}
}

export class OperatingTable {
	/*
	Mutable secuence to store OperatingItem instances and calculates current.

	Constructor (Read-write properties)
	items : Secuence with OperatingItem instance
	idx   : Database key
	*/
	constructor(public items: Array<OperatingItem> = [], public idx?: string) {}

	getCurrent(ta: number): number {
		/*
		Returns lowest current for the OperatingItems contained [ampere]
		ta : Ambient temperature [°C]
		*/
		let ampList = this.items.map(item => item.getCurrent(ta));
		return Math.min(...ampList);
	}

}
