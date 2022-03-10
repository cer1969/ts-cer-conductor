
const cx = require('../out/cx.min.js');

const k = cx.getConstants()

const cate = new cx.Category('AAAC (AASC)', 6450.0, 0.0000230, 20.0, 0.00340, 'AAAC');

console.log(cate);
console.log(k.CAT_CU);

console.log(k.TA_MAX)
console.log(k.TC_MAX)

var cond = cx.conductorForCurrent(cate, 25.17, 0.089360);
var cc = new cx.CurrentCalc(cond)

console.log(cc.getCurrent(25,50))