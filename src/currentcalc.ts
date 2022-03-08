// CRISTIAN ECHEVERRÍA RABÍ

import {check} from "./checker"
import type {Conductor} from "./conductor"
import * as k from "./constants"

//--------------------------------------------------------------------------------------------------

export class CurrentCalc {
	/*
	Object to calculate conductor current and temperatures.

	Read-only properties
	conductor   : Conductor instance

	Read-write properties
	altitude    : Altitude [m] = 300.0
	airVelocity : Velocity of air stream [ft/seg] =   2.0
	sunEffect   : Sun effect factor (0 to 1) = 1.0
	emissivity  : Emissivity (0 to 1) = 0.5
	formula     : Define formula for current calculation = CF_IEEE
	deltaTemp   : Temperature difference to determine equality [°C] = 0.0001
	*/
	private _conductor: Conductor;
	private _altitude = 300.0;
	private _airVelocity = 2.0;
	private _sunEffect = 1.0;
	private _emissivity = 0.5;
	private _formula = k.CF_IEEE;
	private _deltaTemp = 0.0001;

	constructor(conductor: Conductor) {
		/*
		conductor : Conductor instance.
		Valid values are required for r25, diameter and category.alpha
		*/
		check(conductor.r25).gt(0);
		check(conductor.diameter).gt(0);
		check(conductor.category.alpha).gt(0).lt(1);

		this._conductor = conductor;
	}

	// Public methods

	getResistance(tc:number): number {
		/*
		Returns resistance [Ohm/km]
		tc : Conductor temperature [°C]
		*/
		check(tc).ge(k.TC_MIN).le(k.TC_MAX);
		return this._conductor.r25*(1 + this._conductor.category.alpha*(tc - 25));
	}

	getCurrent(ta: number, tc:number): number {
		/*
		Returns current [ampere]
		ta : Ambient temperature [°C]
		tc : Conductor temperature [°C]
		*/
		check(ta).ge(k.TA_MIN).le(k.TA_MAX);
		check(tc).ge(k.TC_MIN).le(k.TC_MAX);

		if (ta >= tc) {
			return 0.0;
		}

		let D = this._conductor.diameter/25.4;                     // Diámetro en pulgadas
		let Pb = Math.pow(10, 1.880813592 - this._altitude/18336); // Presión barométrica en cmHg
		let V = this._airVelocity*3600;                            // Vel. viento en pies/hora
		let Rc = this.getResistance(tc)*0.0003048;                 // Resistencia en ohm/pies
		let Tm = 0.5*(tc + ta);                                    // Temperatura media
		let Rf = 0.2901577*Pb/(273 + Tm);                          // Densidad rel.aire ¿lb/ft^3?
		let Uf = 0.04165 + 0.000111*Tm;                            // Viscosidad abs. aire ¿lb/(ft x hora)
		let Kf = 0.00739 + 0.0000227*Tm;                           // Coef. conductividad term. aire [Watt/(ft x °C)]
		let Qc = 0.283*Math.sqrt(Rf)*Math.pow(D, 0.75)*Math.pow(tc - ta, 1.25); // watt/ft

		if (V != 0) {
			let factor = D*Rf*V/Uf;
			let Qc1 = 0.1695*Kf*(tc - ta)*Math.pow(factor, 0.6);
			let Qc2 = Kf*(tc - ta)*(1.01 + 0.371*Math.pow(factor, 0.52));
			if (this._formula == k.CF_IEEE) {    // IEEE criteria
				Qc = Math.max(Qc, Qc1, Qc2);
			} else {                             // CLASSIC criteria
				if (factor < 12000) {
					Qc = Qc2;
				} else {
					Qc = Qc1;
				}
			}
		}
		let LK = Math.pow((tc + 273)/100, 4);
		let MK = Math.pow((ta + 273)/100, 4);
		let Qr = 0.138*D*this._emissivity*(LK - MK);
		let Qs = 3.87*D*this._sunEffect;

		if ((Qc + Qr) < Qs) {
			return 0.0;
		} else {
			return Math.sqrt((Qc + Qr - Qs)/Rc);
		}
	}

	getTc(ta: number, ic: number): number {
		/*
		Returns conductor temperature [ampere]
		ta : Ambient temperature [°C]
		ic : Current [ampere]
		*/
		check(ta).ge(k.TA_MIN).le(k.TA_MAX);
		let _Imin = 0;
		let _Imax = this.getCurrent(ta, k.TC_MAX);
		check(ic).ge(_Imin).le(_Imax);   // Ensure ta <= Tc <= TC_MAX

		let Tmin = ta;
		let Tmax = k.TC_MAX;
		let cuenta = 0;
		let Tmed: number;
		let Imed: number;
		while ((Tmax - Tmin) > this._deltaTemp) {
			Tmed = 0.5*(Tmin + Tmax);
			Imed = this.getCurrent(ta, Tmed);
			if (Imed > ic) {
				Tmax = Tmed
			} else {
				Tmin = Tmed
			}
			cuenta = cuenta + 1;
			if (cuenta > k.ITER_MAX) {
				let err_msg = `getTc(): N° iterations > ${k.ITER_MAX}`;
				throw new RangeError(err_msg);
			}
		}
		return Tmed;
	}

	getTa(tc: number, ic: number): number {
		/*
		Returns ambient temperature [ampere]
		tc : Conductor temperature [°C]
		ic : Current [ampere]
		*/
		check(tc).ge(k.TC_MIN).le(k.TC_MAX);

		let _Imin = this.getCurrent(k.TA_MAX, tc);
		let _Imax = this.getCurrent(k.TA_MIN, tc);
		check(ic).ge(_Imin).le(_Imax);  // Ensure TA_MIN =< Ta =< TA_MAX

		let Tmin = k.TA_MIN;
		let Tmax = Math.min(k.TA_MAX, tc);
		if (Tmin >= Tmax) {
			return tc;
		}

		let cuenta = 0;
		let Tmed: number;
		let Imed: number;
		while ((Tmax - Tmin) > this._deltaTemp) {
			Tmed = 0.5*(Tmin + Tmax);
			Imed = this.getCurrent(Tmed, tc);
			if (Imed > ic) {
				Tmin = Tmed;
			} else {
				Tmax = Tmed;
			}
			cuenta = cuenta + 1;
			if (cuenta > k.ITER_MAX) {
				let err_msg = `getTa(): N° iterations > ${k.ITER_MAX}`;
				throw new RangeError(err_msg);
			}
		}
		return Tmed;
	}

	// Propiedades

	get conductor() {
		return this._conductor;
	}

	set conductor(value) {
		throw new RangeError('CurrentCalc.conductor is readonly');
	}

	get altitude(): number {
		return this._altitude;/// <reference path="./constants.ts"/>
	}

	set altitude(value: number) {
		check(value).ge(0);
		this._altitude = value;
	}

	get airVelocity(): number {
		return this._airVelocity;
	}

	set airVelocity(value: number) {
		check(value).ge(0);
		this._airVelocity = value;
	}

	get sunEffect(): number {
		return this._sunEffect;
	}

	set sunEffect(value: number) {
		check(value).ge(0).le(1);
		this._sunEffect = value;
	}

	get emissivity(): number {
		return this._emissivity;
	}

	set emissivity(value: number) {
		check(value).ge(0).le(1);
		this._emissivity = value;
	}

	get formula(): string {
		return this._formula;
	}

	set formula(value: string) {
		check(value).isIn([k.CF_CLASSIC, k.CF_IEEE]);
		this._formula = value;
	}

	get deltaTemp(): number {
		return this._deltaTemp;
	}

	set deltaTemp(value: number) {
		check(value).gt(0);
		this._deltaTemp = value;
	}

}
