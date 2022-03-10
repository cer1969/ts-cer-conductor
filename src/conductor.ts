// CRISTIAN ECHEVERRÍA RABÍ

import { check } from "./checker"
import type {Category} from "./category"
import { categoryFromObj } from "./category";

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
    constructor(public name:string, public category:Category, private _diameter:number,
                private _area:number, private _weight:number, private _strength:number,
                private _r25:number, private _hcap:number, public id="") {
        this.checkDiameter();
        this.checkArea();
        this.checkWeight();
        this.checStrength();
        this.checR25();
        this.checHcap();
    }
    

    // Checkers
    checkDiameter() { check(this._diameter).gt(0); }
    checkArea()     { check(this._area).gt(0); }
    checkWeight()   { check(this._weight).gt(0); }
    checStrength()  { check(this._strength).gt(0); }
    checR25()       { check(this._r25).gt(0); }
    checHcap()      { check(this._hcap).gt(0); }

    // Getters & Setters
    get diameter()  { return this._diameter; }
    set diameter(v) { this._diameter = v; this.checkDiameter(); }
    get area()      { return this._area; }
    set area(v)     { this._area = v; this.checkArea(); }
    get weight()    { return this._weight; }
    set weight(v)   { this._weight = v; this.checkWeight(); }
    get strength()  { return this._strength; }
    set strength(v) { this._strength = v; this.checStrength(); }
    get r25()       { return this._r25; }
    set r25(v)      { this._r25 = v; this.checR25(); }
    get hcap()      { return this._hcap; }
    set hcap(v)     { this._hcap = v; this.checHcap(); }

}

//--------------------------------------------------------------------------------------------------
// Constructors

export function conductorFromObj({name="NONE", category=categoryFromObj({}), diameter=0.1, 
        area=0.1, weight=0.1, strength=0.1, r25=0.1, hcap=0.1, id=""}) {
    return new Conductor(name, category, diameter, area, weight, strength, r25, hcap, id);
}

export function conductorForCurrent(category:Category, diameter:number, r25:number) {
    return conductorFromObj({category, diameter, r25});
}