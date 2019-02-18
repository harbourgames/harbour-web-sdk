
import UI from "./ui";
import { queryString } from './tools/util.js';

export const player = {
  setConfig,
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

const IPHONE_REGEX = /i(Phone|Pad|Pod)/;

let g_facebookAppId;
let g_isLoggedIn = false;
let g_uid;
let g_email;
let g_name;
let g_photoUrl;
let g_signedRequest;
let g_accessToken;
let g_loginSuccessCallback;

function setConfig(params) {
  g_facebookAppId = params.facebookAppId;
}

function isLoggedIn() {
  return g_isLoggedIn;
}
function checkLoginStatus(done) {
  window.FB.getLoginStatus(response => {
    if (response.status === "connected") {
      const run_post_login = !g_accessToken;
      g_uid = response.authResponse.userID;
      g_signedRequest = response.authResponse.signedRequest;
      g_accessToken = response.authResponse.accessToken;
      if (run_post_login) {
        _postLogin(null,done);
      }
    } else {
      g_isLoggedIn = false;
      done && done();
    }
  });
}

function login() {
  if (window.navigator && window.navigator.standalone && !IPHONE_REGEX.test(navigator.platform)) {
    _oathLogin();
  } else {
    const scope = "email";
    const opts = { scope: scope };
    window.FB.login(response => {
      if (response && response.status === "connected") {
        g_uid = response.authResponse.userID;
        g_signedRequest = response.authResponse.signedRequest;
        g_accessToken = response.authResponse.accessToken;
        _postLogin();
      }
    },opts);
  }
}

function _oathLogin() {
  addEventListener('message',_loginListener);
  const query = {
    client_id: g_facebookAppId,
    display: 'popup',
    scope: 'email',
    response_type: 'token,granted_scopes',
    auth_type: 'rerequest',
    redirect_uri: `${window.location.origin}/fb_login_complete.html`,
  };
  const url = 'https://www.facebook.com/v3.1/dialog/oauth?' + queryString(query);
  const popup = window.open(url,'Facebook Login','width=500,height=500');
  const intervalChecker = setInterval(() => {
    if (popup.closed) {
      clearInterval(intervalChecker);
      removeEventListener('message',_loginListener);
      if (!g_accessToken) {
        checkLoginStatus();
      }
    }
  },100);
}

function _loginListener(event) {
  if (event && event.data) {
    const url = new URL(event.data);
    const hash = url.hash.substring(1);
    const hash_split = hash.split('&');
    const hash_map = {};
    hash_split.forEach(s => {
      const s_split = s.split('=');
      hash_map[s_split[0]] = s_split[1];
    });
    if (hash_map.access_token && !g_accessToken) {
      g_accessToken = hash_map.access_token;
      _postLogin(g_accessToken);
    }
  }
}

function _postLogin(access_token,done) {
  const fields = "id,email,name,picture.type(large)";
  const opts = {
    fields,
  };
  if (access_token) {
    opts.access_token = access_token;
  }
  window.FB.api("/me",opts,response => {
    if (!response || response.error) {
      console.error("FB login failed:",response);
    } else {
      g_uid = response.id;
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
    getAppID: () => g_facebookAppId,
    getAccessToken: () => g_accessToken,
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
