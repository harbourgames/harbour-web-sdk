
import UI from "./ui";

export const player = {
  isLoggedIn,
  checkLoginStatus,
  login,
  onLoginButtonPress,
  setLoginCallback,

  getID,
  getName,
  getPhoto,
  getEmail,
  getDataAsync,
  setDataAsync,
  getStatsAsync,
  setStatsAsync,
  incrementStatsAsync,
  flushDataAsync,
  getConnectedPlayersAsync,
  getSignedPlayerInfoAsync,
  canSubscribeBotAsync,
  subscribeBotAsync,
};

let g_isLoggedIn = false;
let g_uid;
let g_email;
let g_name;
let g_photoUrl;
let g_signedRequest;
let g_loginSuccessCallback;

function isLoggedIn() {
  return g_isLoggedIn;
}
function checkLoginStatus(done) {
  window.FB.getLoginStatus(response => {
    if (response.status === "connected") {
      g_uid = response.authResponse.userID;
      g_signedRequest = response.authResponse.signedRequest;
      _postLogin(done);
    } else {
      g_isLoggedIn = false;
      done();
    }
  });
}

function login() {
  const opts = { scope: "email" };

  window.FB.login(response => {
    if (response && response.status === "connected") {
      g_uid = response.authResponse.userID;
      _postLogin();
    }
  },opts);
}
function _postLogin(done) {
  const fields = "email,name,picture.type(large)";

  window.FB.api("/me",{ fields },response => {
    if (!response || response.error) {
      console.error("FB login failed:",response);
    } else {
      g_email = response.email;
      g_name = response.name;
      g_photoUrl = _getUrl(response.picture);
      g_isLoggedIn = true;
      g_loginSuccessCallback && g_loginSuccessCallback();
      g_loginSuccessCallback = null;
      UI.removeLoginButton();
    }
    done && done();
  });
}

function onLoginButtonPress() {
  login();
}
function setLoginCallback(cb) {
  g_loginSuccessCallback = cb;
}

function getID() {
  return g_uid;
}
function getName() {
  return g_name;
}
function getPhoto() {
  return g_photoUrl;
}
function getEmail() {
  return g_email;
}
function getDataAsync() {

}
function setDataAsync() {

}
function getStatsAsync() {

}
function setStatsAsync() {

}
function incrementStatsAsync() {

}
function flushDataAsync() {

}
function getConnectedPlayersAsync() {
  return Promise.reject({ code: "CLIENT_UNSUPPORTED_OPERATION" });
}
function getSignedPlayerInfoAsync() {
  return Promise.resolve({
    getSignature: () => g_signedRequest,
    getPlayerID: getID,
  });
}
function canSubscribeBotAsync() {
  return Promise.reject({ code: "CLIENT_UNSUPPORTED_OPERATION" });
}
function subscribeBotAsync() {
  return Promise.reject({ code: "CLIENT_UNSUPPORTED_OPERATION" });
}

function _getUrl(obj) {
  return obj && obj.data && obj.data.url;
}
