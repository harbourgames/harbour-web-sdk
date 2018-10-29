
export const context = {
  getID,
  chooseAsync,
  switchAsync,
  createAsync,
  getType,
  isSizeBetween,
  getPlayersAsync,
};

function getID() {
  return null;
}
function getType() {
  return "SOLO";
}
function chooseAsync() {
  return Promise.reject({ code: "USER_CANCEL", });
}
function createAsync() {
  return Promise.reject({ code: "USER_CANCEL", });
}
function switchAsync() {
  return Promise.reject({ code: "USER_CANCEL", });
}
function isSizeBetween() {
  return null;
}
function getPlayersAsync() {
  return Promise.reject({ code: "CLIENT_UNSUPPORTED_OPERATION" });
}
