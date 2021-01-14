try {
   (function (window, base, account){
    const eunomiaBase = base;

let eunomiaAccount = account;

const eunomiaMeta = document.querySelector('meta[name="eunomia:account"]');

if (eunomiaMeta) {
  eunomiaAccount = eunomiaMeta.content;
}
const eunomiaPage = `${eunomiaBase}/${eunomiaAccount}`;
const eunomiaLogo = `${eunomiaBase}/eunomia/static/eunomia_light_64.png`;
const articleUrl = document.querySelector("link[rel='canonical']").href;
const articleTitle = document.title;


function addCss() {
  const elementId = "eunomia-styles";
  if (!document.getElementById(elementId)) {
  const eunomiaStyles = `
  .eunomia-logo {
    max-height: 28px;
  }
  .eunomia-action {
      background-color: #2196f3;
      color: #eee;
      font-size: medium;
      padding: 5px 10px;
      margin-left: 5px;
      border-width: 0;
      border-radius: 4px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      text-decoration: none;
  }
  `;
    document.head.insertAdjacentHTML("beforeend", `<style id="${elementId}">${eunomiaStyles}</style>`);
  }
}


function eunomiaLogoImg() {
  const imageAlt = "EUNOMIA Logo"
  return `<img class="eunomia-logo" alt="${imageAlt}" src="${eunomiaLogo}" />`;
}


function addAccountLinks() {
  const eunomiaAccountElements = document.querySelectorAll(".eunomia-account-box");
  if (eunomiaAccountElements && eunomiaAccount !== "") {
    const elementTitle = `Follow ${eunomiaAccount} in EUNOMIA`
    const accountLinkElement = `
    <a class="eunomia-action" href="${eunomiaPage}" title="${elementTitle}" rel="noopener noreferrer" target="_blank">
      ${eunomiaLogoImg()}EUNOMIA
    </a>
  `;
    eunomiaAccountElements.forEach(function(element) {
      element.insertAdjacentHTML("beforeend", `${accountLinkElement}`);
    });
  }
}


function addMastodonShareButtons() {
  const mastodonShareElements = document.querySelectorAll(".mastodon-share-box");
  if (mastodonShareElements) {
    const buttonTitle = "Share this article in EUNOMIA";
    const shareElement = `
    <button title="${buttonTitle}" class="eunomia-action mastodon-share">
        ${eunomiaLogoImg()}Share!
      </button>
    `;
    mastodonShareElements.forEach(function(element) {
      element.insertAdjacentHTML("beforeend", `${shareElement}`);
    });
  }
}


function setMastodonShareHandlers () {
  const mastodonShareButtons = document.querySelectorAll(".mastodon-share");
  if (mastodonShareButtons) {
    mastodonShareButtons.forEach(function(buttonElement) {
      buttonElement.addEventListener("click", function(event) {
        event.preventDefault();
        const url=encodeURI(`${eunomiaBase}/share?text=${articleTitle}\n${articleUrl}`);
        const width = 600;
        const height = 800;
        const top = window.top.outerHeight / 2 + window.top.screenY - ( height / 2);
        const left = window.top.outerWidth / 2 + window.top.screenX - ( width / 2);
        const params = `toolbar=no,location=no,directories=no,status=no,menubar=no,copyhistory=no,width=${width},height=${height},left=${left},top=${top}`;
        window.open(url, 'Share with EUNOMIA', params); 
        return false; 
      });
    });
  }
}


function addEunomiaShareButton() {
  const eunomiaShareElements = document.querySelectorAll(".eunomia-share-box");
  if (eunomiaShareElements) {
    const buttonTitle = "Share this article in EUNOMIA";
    const shareElement = `
      <button title="${buttonTitle}" class="eunomia-action eunomia-share">
        ${eunomiaLogoImg()}Share!
      </button
    `;
    eunomiaShareElements.forEach(function(element) {
      element.insertAdjacentHTML("beforeend", `${shareElement}`);
    });
  }
}


function setEunomiaShareHandlers(include_image=false) {
  const eunomiaShareButtons = document.querySelectorAll(".eunomia-share");
  if (eunomiaShareButtons) {
    eunomiaShareButtons.forEach(function(buttonElement){
      buttonElement.addEventListener("click", function(event) {
        event.preventDefault();
        const url=encodeURI(`${eunomiaBase}/eunomia/api/share?include_image=${include_image}&article_url=${articleUrl}`);
        window.open(url, "_blank");
      });
    });
  }
}


function addArticleLinkElement(parent, url) {
  const linkTitle = "View the post in EUNOMIA";
  const eunomiaLink = `
    <a class="eunomia-action" href="${url}" title="${linkTitle}" rel="noopener noreferrer" target="_blank">
      ${eunomiaLogoImg()}View
    </a>
  `;
  parent.insertAdjacentHTML("beforeend", `${eunomiaLink}`);
  if (parent.style.display == "none") {
    parent.style.display = null;
  }
}


function getEunomiaEntries(fromMastodonShare=false) {
  const eunomiaArcticleElemets = document.querySelectorAll(".eunomia-article-box");
  if (eunomiaArcticleElemets) {
    const xmlHttp = new XMLHttpRequest();
    let endpoint = `${eunomiaBase}/eunomia/api/exists?`
    if (eunomiaAccount) {
      endpoint += `creator=${eunomiaAccount}&`
    }
    if (fromMastodonShare && eunomiaAccount) {
      endpoint += `q=${articleTitle}`;
    } else {
      endpoint += `article_url=${articleUrl}`;
    }
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            const response = xmlHttp.responseText;
            try {
                const jsonResponse = JSON.parse(response);
                const entries = jsonResponse.entries;
                if (entries && entries.length > 0) {
                  eunomiaArcticleElemets.forEach(function(element) {
                    addArticleLinkElement(element, entries[0]);
                    });
                }
            } catch {}
        }
    }
    xmlHttp.open("GET",endpoint,true);
    xmlHttp.timeout = 5000;
    xmlHttp.send(null);
  }
}


function onLoad() {
  addCss();
  addAccountLinks();
  addMastodonShareButtons();
  addEunomiaShareButton();
  setMastodonShareHandlers();
  setEunomiaShareHandlers();
  getEunomiaEntries();
}
if (articleUrl && eunomiaBase !== "") {
    document.addEventListener("DOMContentLoaded", onLoad); 
}
console.log("EUNOMIA plugin loaded");

  })(window, 'https://test.mastodononline.site', '@BlastingNews' );
} catch (e) {
  console.log("EUNOMIA plugin could not be loaded");
}