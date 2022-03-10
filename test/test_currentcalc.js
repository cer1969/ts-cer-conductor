// CRISTIAN ECHEVERRÍA RABÍ

const cx = require('../out/cx.min.js');
const assert = require('assert');

//----------------------------------------------------------------------------------------

describe('cx.CurrentCalc', function() {

    var cate, cond, cc;
    const k = cx.getConstants();

    beforeEach(function() {
        cate = new cx.Category('AAAC (AASC)', 6450.0, 0.0000230, 20.0, 0.00340, 'AAAC');
        cond = cx.conductorForCurrent(cate, 25.17, 0.089360);
    });

    //------------------------------------------------------------------------------------

    describe('constructor', function () {

        it('Check default values', function () {
            cc = new cx.CurrentCalc(cond)
            assert.equal(cc.conductor, cond);
            assert.equal(cc.altitude, 300);
            assert.equal(cc.airVelocity, 2);
            assert.equal(cc.sunEffect, 1);
            assert.equal(cc.emissivity, 0.5);
            assert.equal(cc.formula, k.CF_IEEE);
            assert.equal(cc.deltaTemp, 0.0001);
        });
    });

    //------------------------------------------------------------------------------------

    describe('properties', function () {
        beforeEach(function() {
            cc = new cx.CurrentCalc(cond)
        });

        it('conductor', function () {
            assert.equal(cc.conductor, cond);
        });
        it('altitude >= 0', function () {
            cc.altitude = 150;
            assert.equal(cc.altitude, 150);
            assert.doesNotThrow(function() {cc.altitude = 0;});
            assert.throws(function() {cc.altitude = -0.001;}, RangeError);
        });
        it('airVelocity >= 0', function () {
            cc.airVelocity = 2;
            assert.equal(cc.airVelocity, 2);
            assert.doesNotThrow(function() {cc.airVelocity = 0;});
            assert.throws(function() {cc.airVelocity = -0.001;}, RangeError);
        });
        it('0 <= sunEffect <= 1', function () {
            cc.sunEffect = 0.5;
            assert.equal(cc.sunEffect, 0.5);
            assert.doesNotThrow(function() {cc.sunEffect = 0;});
            assert.doesNotThrow(function() {cc.sunEffect = 1;});
            assert.throws(function() {cc.sunEffect = -0.001;}, RangeError);
            assert.throws(function() {cc.sunEffect = 1.001;}, RangeError);
        });
        it('0 <= emissivity <= 1', function () {
            cc.emissivity = 0.7;
            assert.equal(cc.emissivity, 0.7);
            assert.doesNotThrow(function() {cc.emissivity = 0;});
            assert.doesNotThrow(function() {cc.emissivity = 1;});
            assert.throws(function() {cc.emissivity = -0.001;}, RangeError);
            assert.throws(function() {cc.emissivity = 1.001;}, RangeError);
        });
        it('formula in [CF_IEEE, CF_CLASSIC]', function () {
            cc.formula = k.CF_IEEE;
            assert.equal(cc.formula, k.CF_IEEE);
            assert.doesNotThrow(function() {cc.formula = k.CF_IEEE;});
            assert.doesNotThrow(function() {cc.formula = k.CF_CLASSIC;});
            assert.throws(function() {cc.formula = "";}, RangeError);
            assert.throws(function() {cc.formula = 1;}, RangeError);
        });
        it('deltaTemp > 0', function () {
            cc.deltaTemp = 0.001;
            assert.equal(cc.deltaTemp, 0.001);
            assert.doesNotThrow(function() {cc.deltaTemp = 0.0001;});
            assert.throws(function() {cc.deltaTemp = -0.0001;}, RangeError);
            assert.throws(function() {cc.deltaTemp = 0;}, RangeError);
        });
    });

    //------------------------------------------------------------------------------------

    describe('methods', function () {
        beforeEach(function() {
            cc = new cx.CurrentCalc(cond)
        });

        it('getResistance', function () {
            assert.doesNotThrow(function() {cc.getResistance(k.TC_MIN);});
            assert.doesNotThrow(function() {cc.getResistance(k.TC_MAX);});
            assert.throws(function() {cc.getResistance(k.TC_MIN - 0.001);}, RangeError);
            assert.throws(function() {cc.getResistance(k.TC_MAX + 0.001);}, RangeError);
        });
        it('getCurrent', function () {
            assert.equal(cc.getCurrent(25, 25), 0);
            assert.equal(cc.getCurrent(26, 25), 0);
            cc.formula = k.CF_CLASSIC;
            assert(Math.abs(cc.getCurrent(25, 50) - 517.7) < 0.1);
            assert(Math.abs(cc.getCurrent(30, 60) - 585.4) < 0.1);
            assert(Math.abs(cc.getCurrent(10, 30) - 438.4) < 0.1);
            var amp1 = cc.getCurrent(3, 30);
            cc.formula = k.CF_IEEE;
            var amp2 = cc.getCurrent(3, 30);
            assert.notEqual(amp1, amp2);
            cc.sunEffect = 1.0;
            amp1 = cc.getCurrent(25, 50);
            cc.sunEffect = 0.0;
            amp2 = cc.getCurrent(25, 50);
            assert.notEqual(amp1, amp2);

            assert.doesNotThrow(function() {cc.getCurrent(k.TA_MIN, 50);});
            assert.doesNotThrow(function() {cc.getCurrent(k.TA_MAX, 50);});
            assert.doesNotThrow(function() {cc.getCurrent(25, k.TC_MIN);});
            assert.doesNotThrow(function() {cc.getCurrent(25, k.TC_MAX);});
            assert.throws(function() {cc.getCurrent(k.TA_MIN - 0.001, 50);}, RangeError);
            assert.throws(function() {cc.getCurrent(k.TA_MAX + 0.001, 50);}, RangeError);
            assert.throws(function() {cc.getCurrent(25, k.TC_MIN - 0.001);}, RangeError);
            assert.throws(function() {cc.getCurrent(25, k.TC_MAX + 0.001);}, RangeError);
        });
        it('getTc', function () {
            // Verifica que los cálculos de getTc sean coherentes con getCurrent
            var amp1 = cc.getCurrent(25, 50);
            var amp2 = cc.getCurrent(35, 65);
            var tc1 = cc.getTc(25, amp1);
            var tc2 = cc.getTc(35, amp2);
            assert(Math.abs(tc1 - 50) < cc.deltaTemp);
            assert(Math.abs(tc2 - 65) < cc.deltaTemp);
            // Verifica rangos de entrada para ta
            var Icmax = cc.getCurrent(k.TA_MIN, k.TC_MAX);
            assert.doesNotThrow(function() {cc.getTc(k.TA_MIN, Icmax);});
            assert.throws(function() {cc.getTc(k.TA_MIN - 0.0001, Icmax);}, RangeError);
            Icmax = cc.getCurrent(k.TA_MAX, k.TC_MAX);
            assert.doesNotThrow(function() {cc.getTc(k.TA_MAX, Icmax);});
            assert.throws(function() {cc.getTc(k.TA_MAX + 0.0001, Icmax);}, RangeError);
            // Verifica rangos de entrada para ic
            assert.throws(function() {cc.getTc(30, -0.001);}, RangeError);
            Icmax = cc.getCurrent(30, k.TC_MAX);
            assert.doesNotThrow(function() {cc.getTc(30, Icmax);});
            assert.throws(function() {cc.getTc(30, Icmax + 0.001);}, RangeError);
        });
        it('getTa', function () {
            // Verifica que los cálculos de getTa sean coherentes con getCurrent
            var amp1 = cc.getCurrent(25, 50);
            var amp2 = cc.getCurrent(35, 65);
            var ta1 = cc.getTa(50, amp1);
            var ta2 = cc.getTa(65, amp2);
            assert(Math.abs(ta1 - 25) < cc.deltaTemp);
            assert(Math.abs(ta2 - 35) < cc.deltaTemp);
            // Verifica rangos de entrada para tc
            assert.doesNotThrow(function() {cc.getTa(k.TC_MIN, 0);});
            assert.throws(function() {cc.getTa(k.TC_MIN - 0.0001, 0);}, RangeError);
            var Icmax = cc.getCurrent(k.TA_MIN, k.TC_MAX);
            assert.doesNotThrow(function() {cc.getTa(k.TC_MAX, Icmax);});
            assert.throws(function() {cc.getTa(k.TC_MAX + 0.0001, Icmax);}, RangeError);
            // Verifica rangos de entrada para ic
            var Icmin = cc.getCurrent(k.TA_MAX, 100);
            Icmax = cc.getCurrent(k.TA_MIN, 100);
            assert.doesNotThrow(function() {cc.getTa(100, Icmin);});
            assert.throws(function() {cc.getTa(100, Icmin - 0.0001);}, RangeError);

            assert.doesNotThrow(function() {cc.getTa(100, Icmax);});
            assert.throws(function() {cc.getTa(100, Icmax + 0.0001);}, RangeError);
        });
    });

});
