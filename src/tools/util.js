
export function asyncSeries(list,callback) {
  function _run(index,list,callback) {
    const item = list[index];
    if (item) {
      item(err => {
        if (err) {
          callback(err);
        } else {
          _run(index + 1,list,callback);
        }
      });
    } else {
      callback();
    }
  }
  _run(0,list,callback);
}

export function resolveStyles(...args) {
  const obj = {};

  function _addStyle(arg) {
    if (Array.isArray(arg)) {
      arg.forEach(_addStyle);
    } else {
      for (const key in arg) {
        obj[key] = arg[key];
      }
    }
  }

  _addStyle(args);

  let s = "";
  for (const key in obj) {
    const val = obj[key];
    s += key + ":" + val + ";";
  }
  return s;
}
