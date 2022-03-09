// CRISTIAN ECHEVERRÍA RABÍ

import { check } from "./checker"

//--------------------------------------------------------------------------------------------------

export class Category {
    /*
    Represents a category of conductors with similar characteristics
    name    : Name of conductor category
    modelas : Modulus of elasticity [kg/mm2]
    coefexp : Coefficient of Thermal Expansion [1/°C]
    creep   : Creep [°C]
    alpha   : Temperature coefficient of resistance [1/°C]
    id      : Database key
    */

    constructor(public name: string, private _modelas: number, private _coefexp: number,
            private _creep: number, private _alpha: number, public id: string = "") {
        this.checkModelas();
        this.checkCoefexp();
        this.checkCreep();
        this.checkAlpha();
    }

    // Checkers
    checkModelas() { check(this._modelas).gt(0); }
    checkCoefexp() { check(this._coefexp).gt(0); }
    checkCreep()   { check(this._creep).ge(0); }
    checkAlpha()   { check(this._alpha).gt(0).lt(1); }

    // Getters & Setters
    get modelas()  { return this._modelas; }
    set modelas(v) { this._modelas = v; this.checkModelas(); }
    get coefexp()  { return this._coefexp; }
    set coefexp(v) { this._coefexp = v; this.checkCoefexp(); }
    get creep()    { return this._creep; }
    set creep(v)   { this._creep = v; this.checkCreep(); }
    get alpha()    { return this._alpha; }
    set alpha(v)   { this._alpha = v; this.checkAlpha(); }

}

//--------------------------------------------------------------------------------------------------
// Constructors

export function categoryFromObj({name="NONE", modelas=0.1, coefexp=0.1, creep=0.0, alpha=0.1, 
        id=""}) {
    return new Category(name, modelas, coefexp, creep, alpha, id);
}

export function categoryForCurrent(alpha: number) {
    return categoryFromObj({alpha: alpha});
}

//--------------------------------------------------------------------------------------------------
// Category instances to use as constants

export const CAT_NONE   = categoryFromObj({});
export const CAT_CU     = new Category('COPPER',      12000.0, 0.0000169,  0.0, 0.00374, 'CU');
export const CAT_AAAC   = new Category('AAAC (AASC)',  6450.0, 0.0000230, 20.0, 0.00340, 'AAAC');
export const CAT_ACAR   = new Category('ACAR',         6450.0, 0.0000250, 20.0, 0.00385, 'ACAR');
export const CAT_ACSR   = new Category('ACSR',         8000.0, 0.0000191, 20.0, 0.00395, 'ACSR');
export const CAT_AAC    = new Category('ALUMINUM',     5600.0, 0.0000230, 20.0, 0.00395, 'AAC');
export const CAT_CUWELD = new Category('COPPERWELD',  16200.0, 0.0000130,  0.0, 0.00380, 'CUWELD');
export const CAT_AASC   = CAT_AAAC;
export const CAT_ALL    = CAT_AAC;
