// CRISTIAN ECHEVERRÍA RABÍ

//--------------------------------------------------------------------------------------------------
// Comparison functions

function _lt(a: any, b: any): boolean {return a < b;}
function _le(a: any, b: any): boolean {return a <= b;}
function _ge(a: any, b: any): boolean {return a >= b;}
function _gt(a: any, b: any): boolean {return a > b;}

function _isIn(a: any, blist: Array<any>): boolean {
    if (blist.indexOf(a) != -1) {
        return true;
    }
    return false;
}

//--------------------------------------------------------------------------------------------------

export class _Check {
    /*
    Class for value testing with error raising
    */
    constructor(public value: any) {}

    _compare(compFunc: (x: any, y:any) => boolean, txte: string, limit: any) {
        if (!compFunc(this.value, limit)) {
            let txt = `Required value ${txte} ${limit} (${this.value} entered)`;
            throw new RangeError(txt);
        }
        return this;
    }

    lt(limit: any) {return this._compare(_lt, "<", limit);}
    le(limit: any) {return this._compare(_le, "<=", limit);}
    gt(limit: any) {return this._compare(_gt, ">", limit);}
    ge(limit: any) {return this._compare(_ge, ">=", limit);}
    isIn(blist: Array<any>) {return this._compare(_isIn, "in", blist);}

    isFinite() {
        if (!isFinite(this.value)) {
            let txt = `Number expected (${this.value} entered)`;
            throw new RangeError(txt);
        }
        return this;
    }
}

//--------------------------------------------------------------------------------------------------
// Public function check

export function check(value: any) {return new _Check(value)}
