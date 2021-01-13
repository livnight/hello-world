try {
  (window.EUNOMIA && window.EUNOMIA.config) || (function (window){
    if( !window.EUNOMIA.config.account && !window.EUNOMIA.config.instance){
      return;
    }
    const eunomiaBase = window.EUNOMIA.config.account;
    // if we want a link to the account's page
    let eunomiaAccount = window.EUNOMIA.config.instance;
    // probably better not to hardcode it, and read it from a new metadata entry if possible?
    const eunomiaMeta = document.querySelector('meta[name="eunomia:account"]');
    // <meta name="eunomia:account" content="@username">
    // or maybe even better, include both the `eunomiaBase` and the username:
    // <meta name="eunomia:account" content="https://eunomia.instance/@username">
    if (eunomiaMeta) {
      eunomiaAccount = eunomiaMeta.content;
    }
    const eunomiaPage = `${eunomiaBase}/${eunomiaAccount}`;
    const eunomiaLogo = `${eunomiaBase}/eunomia/static/eunomia_light_64.png`;
    const articleUrl = document.querySelector("link[rel='canonical']").href;
    const articleTitle = document.title;
  
    /**Adds a <style> element for the buttons/links to the document head */
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
  
    /**The EUNOMIA logo image element, to be added to the buttons/links */
    function eunomiaLogoImg() {
      const imageAlt = "EUNOMIA Logo"
      return `<img class="eunomia-logo" alt="${imageAlt}" src="${eunomiaLogo}" />`;
    }
  
    /**
     * Adds a "Follow" link to the elements of class `.eunomia-account-box`,
     * pointing to the EUNOMIA's account page
     */
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
  
    /** Adds a "share" button to the elements of class .mastodon-share-box */
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
  
    /**
     * The previously added "mastodon-share" buttons `click` handlers
     * It opens a new window pointing to the default's Mastodon "compose" form,
     * with the page title and the article's url as the default text. 
     * The user can modify the contene before posting.
     */
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
  
    /** Adds a "share" button to the elements of class .eunomia-share-box */
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
  
    /**
     * The previously added "eunomia-share" buttons `click` handlers
     * If not already, the users are asked to authorize our Mastodon app to create the post on their behalf
     * If we have the authorization grant, we create the new post and redirect the users to its page.
     * @param {bool} include_image: to also upload the aricle's image if it exists or not
     */
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
  
    /**
     * Adds a "view post" link
     * @param {HTMLElement} parent - the element to wich we append the link
     * @param {string} url - The url of the post
     */
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
  
    /**
     * Queries the EUNOMIA api for entries related the current article
     * by default, we search for articles autogenerated using OAuth
     * we can change this below
     * @param {bool} fromMastodonShare - to search articles created using "Mastodon's share" or not
     */
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
  
    /**
     * On ready (DOMContentLoaded) actions:
     * Adds css to the document's head, @see {@link addCss}
     * Adds a "follow" link to the elements of class: .eunomia-account-box @see {@link addAccountLinks}
     * Adds a "share" button to the elements of class: .mastodon-share-box @see {@link addMastodonShareButtons}
     * Adds a "share" button to the elements of class: .eunomia-share-box @see {@link addEunomiaShareButton}
     * Adds the relevant eventListeners the the added buttons @see {@link setMastodonShareHandlers}, {@link setEunomiaShareHandlers}
     * Performs a HTTP GET request to the EUNOMIA API searching for entries of this article @see {@link getEunomiaEntries}
     * If an entry exists, we add a "view" link to the elements of class: .eunomia-article-box
     * if the elements of class .eunomia-article-box have the attribute "display: none" 
     * (i.e. we do not know yet if the article exists or not), we remove this attribute @see {@link addArticleLinkElement}
     */
    function onLoad() {
      addCss();
      addAccountLinks();
      addMastodonShareButtons();
      addEunomiaShareButton();
      setMastodonShareHandlers();
      setEunomiaShareHandlers();
      getEunomiaEntries();
    }
    onLoad();
  })(window);
} catch (e) {
  console.log(e)
}