// CRISTIAN ECHEVERRÍA RABÍ

const cx = require('../out/cx.min.js');
const assert = require('assert');

//----------------------------------------------------------------------------------------

describe('Category', function() {

    var cate;
    const k = cx.getConstants();

    beforeEach(function() {
        cate = new cx.Category("AAAC (AASC)", 6450.0, 0.0000230, 20.0, 0.00340, "AAAC");
    });

    //------------------------------------------------------------------------------------

    describe('constructor', function () {

        it("value asignment", function () {
            assert.equal(cate.name,    "AAAC (AASC)");
            assert.equal(cate.modelas, 6450.0);
            assert.equal(cate.coefexp, 0.0000230);
            assert.equal(cate.creep,   20.0);
            assert.equal(cate.alpha,   0.00340);
            assert.equal(cate.id,      "AAAC");
        });
        it('categoryFromObj({})', function () {
            cate = cx.categoryFromObj({});
            assert.equal(cate.name,    "NONE");
            assert.equal(cate.modelas, 0.1);
            assert.equal(cate.coefexp, 0.1);
            assert.equal(cate.creep,   0.0);
            assert.equal(cate.alpha,   0.1);
            assert.equal(cate.id,      "");
        });
        it('categoryForObj(obj)', function () {
            cate = cx.categoryFromObj({alpha: 0.00340, name: "X"});
            assert.equal(cate.name,    "X");
            assert.equal(cate.modelas, 0.1);
            assert.equal(cate.coefexp, 0.1);
            assert.equal(cate.creep,   0.0);
            assert.equal(cate.alpha,   0.00340);
            assert.equal(cate.id,      "");
            assert.throws(() => cx.categoryFromObj({alpha:-1}), RangeError);
            assert.throws(() => cx.categoryFromObj({alpha: 0}), RangeError);
        });
        it('categoryForCurrent', function () {
            cate = cx.categoryForCurrent(0.00340);
            assert.equal(cate.name,    "NONE");
            assert.equal(cate.modelas, 0.1);
            assert.equal(cate.coefexp, 0.1);
            assert.equal(cate.creep,   0.0);
            assert.equal(cate.alpha,   0.00340);
            assert.equal(cate.id,      "");
            assert.throws(() => cx.categoryForCurrent(-1), RangeError);
            assert.throws(() => cx.categoryForCurrent( 0), RangeError);
        });
        it('categoryCopy', function () {
            cate = cx.categoryCopy(cate, {alpha: 0.5, name: "X"});
            assert.equal(cate.name,    "X");
            assert.equal(cate.modelas, 6450.0);
            assert.equal(cate.coefexp, 0.0000230);
            assert.equal(cate.creep,   20.0);
            assert.equal(cate.alpha,   0.5);
            assert.equal(cate.id,      "AAAC");
            assert.throws(() => cx.categoryCopy(cate, {alpha: -1}), RangeError);
            assert.throws(() => cx.categoryCopy(cate, {alpha:  0}), RangeError);
        });
        it('bad argument', function () {
            assert.throws(() => new cx.Category("X",  0, 0.1, 0, 0.1), RangeError);
            assert.throws(() => new cx.Category("X", -1, 0.1, 0, 0.1), RangeError);
            assert.throws(() => new cx.Category("X", 0.1,  0, 0, 0.1), RangeError);
            assert.throws(() => new cx.Category("X", 0.1, -1, 0, 0.1), RangeError);
            assert.throws(() => new cx.Category("X", 0.1, 0.1, -0.1, 0.1), RangeError);
            assert.throws(() => new cx.Category("X", 0.1, 0.1, 0, 0), RangeError);
            assert.throws(() => new cx.Category("X", 0.1, 0.1, 0, 1), RangeError);
        });
        it('Inmutable', function () {
            assert.throws(() => k.CAT_CU.alpha = 10, TypeError);
            assert.throws(() => cate.name = "Hola", TypeError);
        });
    });

	//------------------------------------------------------------------------------------

    describe('properties', function () {
        it('modelas > 0', function () {
            assert.doesNotThrow(() => cx.categoryCopy(cate, {modelas: 1000}));
            assert.throws(() => cx.categoryCopy(cate, {modelas:  0}), RangeError);
            assert.throws(() => cx.categoryCopy(cate, {modelas: -1}), RangeError);
        });
        it('coefexp > 0', function () {
            assert.doesNotThrow(() => cx.categoryCopy(cate, {coefexp: 0.1}));
            assert.throws(() => cx.categoryCopy(cate, {coefexp:  0}), RangeError);
            assert.throws(() => cx.categoryCopy(cate, {coefexp: -1}), RangeError);
        });
        it('creep >= 0', function () {
            assert.doesNotThrow(() => cx.categoryCopy(cate, {creep: 0}));
            assert.throws(() => cx.categoryCopy(cate, {creep: -1}), RangeError);
        });
        it('0 < alpha < 1', function () {
            assert.doesNotThrow(() => cx.categoryCopy(cate, {alpha: 0.05}));
            assert.throws(() => cx.categoryCopy(cate, {alpha: 0}), RangeError);
            assert.throws(() => cx.categoryCopy(cate, {alpha: 1}), RangeError);
        });
    });

});
