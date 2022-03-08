
const cx = require('../out/cx.min.js');

cate = new cx.Category('AAAC (AASC)',	6450.0, 0.0000230, 20.0, 0.00340, 'AAAC');
cond = new cx.Conductor("AAAC 740,8 MCM FLINT", cate, 25.17, 0, 0, 0, 0.089360, 0);
cc = new cx.CurrentCalc(cond)

console.log(cc.getCurrent(25,50))