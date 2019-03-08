
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

let g_facebookAppId;
let g_oauthRedirectUrl;
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
  g_oauthRedirectUrl = params.oauthRedirectUrl;
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

function login(opts,done) {
  const is_chrome_app = window.matchMedia &&
    window.matchMedia('(display-mode: fullscreen),(display-mode: standalone)').matches;

  if (is_chrome_app) {
    _oathLogin(opts,done);
  } else {
    const scope = "email";
    const opts = { scope: scope };
    window.FB.login(response => {
      if (response && response.status === "connected") {
        g_uid = response.authResponse.userID;
        g_signedRequest = response.authResponse.signedRequest;
        g_accessToken = response.authResponse.accessToken;
        _postLogin(null,() => {
          done();
        });
      } else {
        done && done('sdk_login_fail');
      }
    },opts);
  }
}
function _oathLogin(opts,done) {
  addEventListener('message',_loginListener);

  const query = {
    client_id: g_facebookAppId,
    scope: 'email',
    response_type: 'signed_request,token',
    redirect_uri: g_oauthRedirectUrl,
  };
  if (opts && opts.state) {
    query.state = opts.state;
  }
  const url = 'https://www.facebook.com/v3.1/dialog/oauth?' + queryString(query);
  const popup = window.open(url,'Facebook Login');
  const interval_checker = setInterval(() => {
    if (popup.closed || g_isLoggedIn || g_accessToken) {
      clearInterval(interval_checker);
      removeEventListener('message',_loginListener);
      if (g_accessToken) {
        done && done();
      } else {
        checkLoginStatus(() => {
          let err;
          if (!g_isLoggedIn) {
            err = 'oath_not_logged_in';
          }
          done && done(err);
        });
      }
    }
  },200);
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
    }
    if (hash_map.signed_reqest && !g_signedRequest) {
      g_signedRequest = hash_map.signed_reqest;
    }
    _postLogin(g_accessToken);
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
    let err;
    if (!response || response.error) {
      console.error("FB login failed:",response);
      err = 'sdk_not_logged_in';
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
    done && done(err);
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
