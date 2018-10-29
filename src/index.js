
import { asyncSeries, } from "./tools/util.js";

import { payments } from "./payments";
import { player } from "./player"
import { context } from "./context";
import UI from "./ui";

const HarbourSDK = {
  player,
  context,
  payments,
  getLocale,
  initializeAsync,
  setLoadingProgress,
  startGameAsync,
  quit,
  updateAsync,
  getEntryPointData,
  getEntryPointAsync,
  setSessionData,
  getPlatform,
  getSDKVersion,
  getSupportedAPIs,
  shareAsync,
  switchGameAsync,
  logEvent,
  onPause,
  getInterstitialAdAsync,
  getRewardedVideoAsync,
  getLeaderboardAsync,
};
window.HarbourSDK = HarbourSDK;
window.FBInstant = window.FBInstant || HarbourSDK;

let g_facebookAppId;

function getLocale() {
  let locale = "en-US";
  if (window.navigator) {
    if (window.navigator.language) {
      locale = window.navigator.language;
    } else if (window.navigator.languages && window.navigator.languages[0]) {
      locale = window.navigator.languages[0];
    }
  }
  return locale;
}
function initializeAsync(opts) {
  g_facebookAppId = opts.facebookAppId;

  return new Promise(resolve => {
    UI.addLoader(opts);
    resolve();

    asyncSeries([
      _loadFacebookSDK,
      player.checkLoginStatus,
      ],() => {
        if (!player.isLoggedIn()) {
          UI.addLoginButton();
        }
      }
    );
  });
}
function setLoadingProgress(progress) {
  return new Promise(resolve => {
    UI.setLoaderText(progress.toFixed() + "% Loaded");
    resolve();
  });
}
function startGameAsync() {
  return new Promise(resolve => {

    function _startGame() {
      UI.removeLoader();
      resolve();
    }

    if (player.isLoggedIn()) {
      _startGame();
    } else {
      UI.setLoaderText("Login to Continue");
      player.setLoginCallback(_startGame);
    }
  });
}
function quit() {
  window.close();
}
function updateAsync() {
  return Promise.reject({ code: "CLIENT_UNSUPPORTED_OPERATION", });
}
function getEntryPointData() {
  return {};
}
function getEntryPointAsync() {
  return Promise.resolve(null);
}
function setSessionData() {
}
function getPlatform() {
  return "WEB";
}
function getSDKVersion() {
  return "6.2";
}
function getSupportedAPIs() {
  const api_list = [];
  for (const prop in HarbourSDK) {
    api_list.push(prop);
  }
  for (const prop in HarbourSDK.player) {
    api_list.push("player." + prop);
  }
  for (const prop in HarbourSDK.context) {
    api_list.push("context." + prop);
  }
  for (const prop in HarbourSDK.payment) {
    api_list.push("payment." + prop);
  }
  return api_list;
}
function shareAsync() {
  return Promise.reject({ code: "USER_CANCEL", });
}
function switchGameAsync() {
  return Promise.reject({ code: "CLIENT_UNSUPPORTED_OPERATION", });
}
function logEvent(eventName,value,parameters) {
  console.log("logEvent:",eventName,value,parameters);
  return null;
}
function onPause(callback) {
  window.onblur = callback;
}
function getInterstitialAdAsync() {
  return Promise.reject({ code: "CLIENT_UNSUPPORTED_OPERATION", });
}
function getRewardedVideoAsync() {
  return Promise.reject({ code: "CLIENT_UNSUPPORTED_OPERATION", });
}
function getLeaderboardAsync() {
  return Promise.reject({ code: "CLIENT_UNSUPPORTED_OPERATION", });
}

function _loadFacebookSDK(done) {
  /* eslint-disable */
  window.fbAsyncInit = function() {
    FB.init({
      appId: g_facebookAppId,
      autoLogAppEvents: false,
      xfbml: false,
      version: "v3.2",
    });
    done();
  };
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, "script", "facebook-jssdk"));
  /* eslint-enable */
}
