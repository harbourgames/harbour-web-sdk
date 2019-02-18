
import { loadScript } from './tools/util.js';

export const payments = {
  setConfig,
  onReady,
  getCatalogAsync,
  purchaseAsync,
  getPurchasesAsync,
  consumePurchaseAsync,
};

const STRIPE_SRC = 'https://checkout.stripe.com/checkout.js';

let g_ready = false;
let g_readyHandlers = null;
let g_handler = null;
let g_stripeConfig;
let g_is_sandbox = false;

window.addEventListener('popstate',() => {
  g_handler && g_handler.close();
});

function setConfig(params) {
  g_stripeConfig = params.stripeConfig;
  g_is_sandbox = g_stripeConfig && g_stripeConfig.is_sandbox;
}

function onReady(callback) {
  if (g_ready) {
    callback && callback();
  } else if (g_readyHandlers) {
    g_readyHandlers.push(callback);
  } else {
    g_readyHandlers = [callback];
    _init();
  }
}

function _init() {
  loadScript(STRIPE_SRC,err => {
    if (!err) {
      g_handler = window.StripeCheckout.configure(g_stripeConfig);
      g_ready = true;
    }
    g_readyHandlers.forEach(callback => callback && callback());
    g_readyHandlers.splice(0);
  });
}

function getCatalogAsync() {
  return Promise.resolve([]);
}

function purchaseAsync(params) {
  const { productID, description, amountUsd } = params;

  return new Promise((resolve,reject) => {
    let is_done = false;
    g_handler.open({
      description,
      amount: Math.round(amountUsd * 100),
      token: token => {
        if (token && token.id) {
          const token_id = token.id;
          resolve({
            paymentID: '...',
            productID: productID,
            purchaseTime: String(Math.round(Date.now() / 1000)),
            purchaseToken: token_id,
            signedRequest: '...',
            stripeTokenId: token_id,
            stripeCardFingerprint: token.card && token.card.fingerprint,
            stripeEmail: token.email,
            isSandbox: g_is_sandbox,
          });
        } else if (!is_done) {
          reject({ code: 'USER_INPUT' });
          is_done = true;
        }
      },
      closed: () => {
        if (!is_done) {
          reject({ code:'USER_INPUT' });
          is_done = true;
        }
      },
    });
  });
}

function getPurchasesAsync() {
  return Promise.resolve([]);
}
function consumePurchaseAsync() {
  return Promise.resolve();
}
