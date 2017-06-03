/**
 * Created by qeesung on 2017/6/3.
 */
/**
 * get the caller info to locate the promise
 * @returns {Array|{index: number, input: string}} the caller info
 */
function getCallerInfo() {
  let stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
  let stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;

  let stackList = (new Error()).stack.split('\n').slice(3);
  let s = stackList[0] || stackList[0],
    sp = stackReg.exec(s) || stackReg2.exec(s);

  return {
    file: sp[2],
    line: sp[3]
  };
}

module.exports = {
  getCallerInfo
};