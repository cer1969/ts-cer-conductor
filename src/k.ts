// CRISTIAN ECHEVERRÍA RABÍ

import {CF_CLASSIC, CF_IEEE, TA_MIN, TA_MAX, TC_MIN, TC_MAX, ITER_MAX, 
    TENSION_MAX } from "./constants";
import {CAT_CU, CAT_AAAC, CAT_ACAR, CAT_ACSR, CAT_AAC, CAT_CUWELD, CAT_AASC, 
    CAT_ALL} from "./category"

//--------------------------------------------------------------------------------------------------

/*
Exporta función que agrupa constantes de la librería:
const k = cx.getConstants()
*/

//--------------------------------------------------------------------------------------------------

class _K {

    private _error() {throw TypeError("Readonly attribute")}

    get CF_CLASSIC  () { return CF_CLASSIC }
    get CF_IEEE     () { return CF_IEEE }
    get TA_MIN      () { return TA_MIN }
    get TA_MAX      () { return TA_MAX }
    get TC_MIN      () { return TC_MIN }
    get TC_MAX      () { return TC_MAX }
    get ITER_MAX    () { return ITER_MAX }
    get TENSION_MAX () { return TENSION_MAX }
    get CAT_CU      () { return CAT_CU }
    get CAT_AAAC    () { return CAT_AAAC }
    get CAT_ACAR    () { return CAT_ACAR }
    get CAT_ACSR    () { return CAT_ACSR }
    get CAT_AAC     () { return CAT_AAC }
    get CAT_CUWELD  () { return CAT_CUWELD }
    get CAT_AASC    () { return CAT_AASC }
    get CAT_ALL     () { return CAT_ALL }
    // Setter that twrow RangeError
    set CF_CLASSIC  (v) { this._error() }
    set CF_IEEE     (v) { this._error() }
    set TA_MIN      (v) { this._error() }
    set TA_MAX      (v) { this._error() }
    set TC_MIN      (v) { this._error() }
    set TC_MAX      (v) { this._error() }
    set ITER_MAX    (v) { this._error() }
    set TENSION_MAX (v) { this._error() }
    set CAT_CU      (v) { this._error() }
    set CAT_AAAC    (v) { this._error() }
    set CAT_ACAR    (v) { this._error() }
    set CAT_ACSR    (v) { this._error() }
    set CAT_AAC     (v) { this._error() }
    set CAT_CUWELD  (v) { this._error() }
    set CAT_AASC    (v) { this._error() }
    set CAT_ALL     (v) { this._error() }
}

const _k_instance = new _K();

export function getConstants() {
    return Object.freeze(_k_instance);
}