
import { resolveStyles } from "./tools/util.js";

export default {
  addLoader,
  removeLoader,
  setLoaderText,
  addLoginButton,
  removeLoginButton,
};

const styles = {
  loader: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: "black center center no-repeat",
    "background-size": "cover",

    display: "flex",
    "flex-direction": "column",
    "justify-content": "center",
    "align-items": "center",
  },
  cover: {
    "z-index": "0",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: "rgba(0,0,0,0.5)",

    display: "flex",
    "flex-direction": "column",
    "justify-content": "center",
    "align-items": "center",
  },
  middleLoader: {
    "z-index": "1",
    position: "relative",
    width: "100px",
    height: "100px",
    "border-radius": "50%",
    overflow: "hidden",
  },
  icon: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: "10px",
    "border-radius": "50%",
    background: "#333 center center no-repeat",
    "background-size": "cover",
  },
  spinner: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    border: "10px solid",
    "border-color": "blue black blue black",
    "border-radius": "50%",
    animation: "harbour-loader-spinner 2s linear infinite",
  },
  loaderText: {
    "z-index": "1",
    "margin-top": "20px",
    color: "white",
    "font-size": "16px",
    "font-weight": "bold",
    "font-family": "sans-serif",
  },
  loginButton: {
    position: "absolute",
    bottom: "60px",
    "margin-left": "auto",
    "margin-right": "auto",
    height: "40px",
    width: "236px",

    background: "#4267b2",
    "border-radius": "4px",
    cursor: "pointer",

    display: "flex",
    "flex-direction": "row",
    "justify-content": "center",
    "align-items": "center",
  },
  loginIcon: {
    position: 'absolute',
    top: "8px",
    left: "10px",
    width: "24px",
    height: "24px",
  },
  loginText: {
    "margin-left": "24px",
    "margin-top": "2px",
    color: "white",
    "font-family": "Helvetica, Arial, sans-serif",
    "font-size": "16px",
  },
}

function addLoader(opts) {
  let loader_style;
  if (opts && opts.backgroundImage) {
    const style = { "background-image": "url(" + opts.backgroundImage + ")" };
    loader_style = resolveStyles([styles.loader,style]);
  } else {
    loader_style = resolveStyles(styles.loader);
  }
  let icon_style;
  if (opts && opts.iconImage) {
    const style = { "background-image": "url(" + opts.iconImage + ")" };
    icon_style = resolveStyles([styles.icon,style]);
  } else {
    icon_style = resolveStyles(styles.icon);
  }

  const html =
`<div id="harbour-loader" style="${loader_style}">
  <div style="${resolveStyles(styles.cover)}"></div>
    <div style="${resolveStyles(styles.middleLoader)}">
      <div style="${resolveStyles(styles.spinner)}"></div>
      <div style="${icon_style}"></div>
    </div>
    <div id="harbour-loader-text" style="${resolveStyles(styles.loaderText)}">0% Loaded</div>

</div>`;

  const temp = document.createElement("div");
  temp.innerHTML = html;

  document.body.appendChild(temp.firstChild);

  const css =
`@keyframes harbour-loader-spinner {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}

function removeLoader() {
  const el = document.getElementById("harbour-loader");
  document.body.removeChild(el);
}

function setLoaderText(text) {
  const text_el = document.getElementById("harbour-loader-text");
  text_el.innerText = text
}
function addLoginButton() {
  const loader = document.getElementById("harbour-loader");

  const html =
`<div id="harbour-loader-login-button" style="${resolveStyles(styles.loginButton)}" onclick="window.HarbourSDK.player.onLoginButtonPress()">
  <svg xmlns="http://www.w3.org/2000/svg" style="${resolveStyles(styles.loginIcon)}" viewBox="0 0 216 216" color="#FFFFFF">
    <path fill="#FFFFFF" d="
            M204.1 0H11.9C5.3 0 0 5.3 0 11.9v192.2c0 6.6 5.3 11.9 11.9
            11.9h103.5v-83.6H87.2V99.8h28.1v-24c0-27.9 17-43.1 41.9-43.1
            11.9 0 22.2.9 25.2 1.3v29.2h-17.3c-13.5 0-16.2 6.4-16.2
            15.9v20.8h32.3l-4.2 32.6h-28V216h55c6.6 0 11.9-5.3
            11.9-11.9V11.9C216 5.3 210.7 0 204.1 0z">
    </path>
  </svg>
  <div style="${resolveStyles(styles.loginText)}">Continue With Facebook</div>
</div>`;

  const temp = document.createElement("div");
  temp.innerHTML = html;

  loader.appendChild(temp.firstChild);
}
function removeLoginButton() {
  const login = document.getElementById("harbour-loader-login-button");
  const loader = document.getElementById("harbour-loader");

  login && loader && loader.removeChild(login);
}
