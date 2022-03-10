// CRISTIAN ECHEVERRÍA RABÍ

import { check } from "./checker"

//--------------------------------------------------------------------------------------------------
// Valores para iniciar objetos

let _ini_values =  {
    name: "NONE",
    modelas: 0.1,
    coefexp: 0.1,
    creep: 0.0,
    alpha: 0.1,
    id: ""
}

//--------------------------------------------------------------------------------------------------

export class Category {
    /*
    Represents a category of conductors with similar characteristics
    Readonly properties
    name    : Name of conductor category
    modelas : Modulus of elasticity [kg/mm2]
    coefexp : Coefficient of Thermal Expansion [1/°C]
    creep   : Creep [°C]
    alpha   : Temperature coefficient of resistance [1/°C]
    id      : Database key
    */
    
    private _values = Object.assign({}, _ini_values);

    constructor(name:string, modelas:number, coefexp:number, creep:number, alpha:number, id="") {
        check(modelas).gt(0);
        check(coefexp).gt(0);
        check(creep).ge(0);
        check(alpha).gt(0).lt(1);
        this._values = Object.assign(this._values, {name, modelas, coefexp, creep, alpha, id})
    }

    getValues() {
        return Object.assign({}, this._values);
    }

    private _error() {throw TypeError("Readonly attribute")}

    // Getters
    get name()     { return this._values.name; }
    get modelas()  { return this._values.modelas; }
    get coefexp()  { return this._values.coefexp; }
    get creep()    { return this._values.creep; }
    get alpha()    { return this._values.alpha; }
    get id()       { return this._values.id; }
    // Setter that twrow RangeError
    set name(v)    { this._error(); }
    set modelas(v) { this._error(); }
    set coefexp(v) { this._error(); }
    set creep(v)   { this._error(); }
    set alpha(v)   { this._error(); }
    set id(v)      { this._error(); }

}

//--------------------------------------------------------------------------------------------------
// Constructors

export function categoryFromObj(obj: {name?:string, modelas?:number, coefexp?:number, creep?:number,
        alpha?:number, id?:string}) {
    /*
    Create category from named arguments. Valores not includes use default values
    */
    let x = Object.assign({}, _ini_values);
    x = Object.assign(x, obj);
    return new Category(x.name, x.modelas, x.coefexp, x.creep, x.alpha, x.id);
}

export function categoryForCurrent(alpha:number) {
    /*
    Create category with values needed for current calculations: alpha
    */
    return categoryFromObj({alpha});
}

export function categoryCopy(cat: Category, obj: {name?:string, modelas?:number, coefexp?:number, 
        creep?:number, alpha?:number, id?:string}) {
    /*
    Create a copy of cat:Category replacing named values included
    */
    let copy = Object.assign(cat.getValues(), obj)
    return categoryFromObj(copy);
}

//--------------------------------------------------------------------------------------------------
// Instances to use as constants

export const CAT_CU     = new Category('COPPER',      12000.0, 0.0000169,  0.0, 0.00374, 'CU');
export const CAT_AAAC   = new Category('AAAC (AASC)',  6450.0, 0.0000230, 20.0, 0.00340, 'AAAC');
export const CAT_ACAR   = new Category('ACAR',         6450.0, 0.0000250, 20.0, 0.00385, 'ACAR');
export const CAT_ACSR   = new Category('ACSR',         8000.0, 0.0000191, 20.0, 0.00395, 'ACSR');
export const CAT_AAC    = new Category('ALUMINUM',     5600.0, 0.0000230, 20.0, 0.00395, 'AAC');
export const CAT_CUWELD = new Category('COPPERWELD',  16200.0, 0.0000130,  0.0, 0.00380, 'CUWELD');
export const CAT_AASC   = CAT_AAAC;
export const CAT_ALL    = CAT_AAC;
