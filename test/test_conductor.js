// CRISTIAN ECHEVERRÍA RABÍ

const cx = require('../out/cx.min.js');
const assert = require('assert');

//----------------------------------------------------------------------------------------

describe('Conductor', function() {

    var cate, cond;

    beforeEach(function() {
        cate = new cx.Category("AAAC (AASC)", 6450.0, 0.0000230, 20.0, 0.00340, "AAAC");
        cond = new cx.Conductor("AAAC 740,8 MCM FLINT", cate, 25.17, 375.4, 1.035, 11625,
            0.089360, 0.052, "XA");
    });

    //------------------------------------------------------------------------------------

    describe('constructor', function () {

        it("value asignment", function () {
            assert.equal(cond.name,     "AAAC 740,8 MCM FLINT");
            assert.equal(cond.category, cate);
            assert.equal(cond.diameter, 25.17);
            assert.equal(cond.area, 	375.4);
            assert.equal(cond.weight,   1.035);
            assert.equal(cond.strength, 11625);
            assert.equal(cond.r25,      0.089360);
            assert.equal(cond.hcap,     0.052);
            assert.equal(cond.id,      "XA");
        });
        it('conductorFromObj({})', function () {
            cond = cx.conductorFromObj({});
            assert.equal(cond.name, "NONE");
            assert.equal(cond.category.name, "NONE");
            assert.equal(cond.diameter, 0.1);
            assert.equal(cond.area, 	0.1);
            assert.equal(cond.weight,   0.1);
            assert.equal(cond.strength, 0.1);
            assert.equal(cond.r25,      0.1);
            assert.equal(cond.hcap,     0.1);
            assert.equal(cond.id,      "");
        });
        it('conductorForObj(obj)', function () {
            cond = cx.conductorFromObj({category: cate, diameter: 25, weight:1.0, name:"TEST"});
            assert.equal(cond.name,     "TEST");
            assert.equal(cond.category, cate);
            assert.equal(cond.diameter, 25);
            assert.equal(cond.area, 	0.1);
            assert.equal(cond.weight,   1.0);
            assert.equal(cond.strength, 0.1);
            assert.equal(cond.r25,      0.1);
            assert.equal(cond.hcap,     0.1);
            assert.equal(cond.id,      "");
        });
        it('conductorForCurrent', function () {
            cond = cx.conductorForCurrent(cate, 25, 0.09);
            assert.equal(cond.name,     "NONE");
            assert.equal(cond.category, cate);
            assert.equal(cond.diameter, 25);
            assert.equal(cond.area, 	0.1);
            assert.equal(cond.weight,   0.1);
            assert.equal(cond.strength, 0.1);
            assert.equal(cond.r25,      0.09);
            assert.equal(cond.hcap,     0.1);
            assert.equal(cond.id,      "");
        });
        it('bad argument', function () {
            assert.throws(() => new cx.Conductor("X", cate, -1, 1, 1, 1, 1, 1), RangeError);
            assert.throws(() => new cx.Conductor("X", cate, 1, -1, 1, 1, 1, 1), RangeError);
            assert.throws(() => new cx.Conductor("X", cate, 1, 1, -1, 1, 1, 1), RangeError);
            assert.throws(() => new cx.Conductor("X", cate, 1, 1, 1, -1, 1, 1), RangeError);
            assert.throws(() => new cx.Conductor("X", cate, 1, 1, 1, 1, -1, 1), RangeError);
            assert.throws(() => new cx.Conductor("X", cate, 1, 1, 1, 1, 1, -1), RangeError);
        });
    });

    //------------------------------------------------------------------------------------

    describe('properties', function () {
        it('diameter > 0', function () {
            assert.doesNotThrow(() => cond.diameter = 1);
            cond.diameter = 1;
            assert.equal(cond.diameter, 1);
            assert.throws(() => cond.diameter =  0, RangeError);
            assert.throws(() => cond.diameter = -1, RangeError);
        });
        it('area > 0', function () {
            assert.doesNotThrow(() => cond.area = 1);
            cond.area = 1;
            assert.equal(cond.area, 1);
            assert.throws(() => cond.area =  0, RangeError);
            assert.throws(() => cond.area = -1, RangeError);
        });
        it('weight > 0', function () {
            assert.doesNotThrow(() => cond.weight = 1);
            cond.weight = 1;
            assert.equal(cond.weight, 1);
            assert.throws(() => cond.weight =  0, RangeError);
            assert.throws(() => cond.weight = -1, RangeError);
        });
        it('strength > 0', function () {
            assert.doesNotThrow(() => cond.strength = 1);
            cond.strength = 1;
            assert.equal(cond.strength, 1);
            assert.throws(() => cond.strength =  0, RangeError);
            assert.throws(() => cond.strength = -1, RangeError);
        });
        it('r25 > 0', function () {
            assert.doesNotThrow(() => cond.r25 = 1);
            cond.r25 = 1;
            assert.equal(cond.r25, 1);
            assert.throws(() => cond.r25 =  0, RangeError);
            assert.throws(() => cond.r25 = -1, RangeError);
        });
        it('hcap > 0', function () {
            assert.doesNotThrow(() => cond.hcap = 1);
            cond.hcap = 1;
            assert.equal(cond.hcap, 1);
            assert.throws(() => cond.hcap =  0, RangeError);
            assert.throws(() => cond.hcap = -1, RangeError);
        });
    });

});
