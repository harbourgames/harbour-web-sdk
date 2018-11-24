
import { asyncSeries, } from "./tools/util.js";
import UI from "./ui";
import { player } from "./player"

let g_facebookAppId;

export function getAppID() {
  return g_facebookAppId;
}

export function initializeAsync(opts) {
  g_facebookAppId = opts.facebookAppId;

  return new Promise(resolve => {
    UI.addLoader(opts);
    resolve();

    asyncSeries([
      _loadFacebookSDK,
      player.checkLoginStatus,
      ],
      err => {
        if (err) {
          UI.addBlockError();
        } else if (!player.isLoggedIn()) {
          UI.addLoginButton();
        }
      }
    );
  });
}
export function setLoadingProgress(progress) {
  return new Promise(resolve => {
    UI.setLoaderText(progress.toFixed() + "% Loaded");
    resolve();
  });
}
export function startGameAsync() {
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
     js.onerror = done;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, "script", "facebook-jssdk"));
  /* eslint-enable */
}
