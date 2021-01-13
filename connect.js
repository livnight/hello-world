(function(connector, instance){
    // <meta name="eunomia:account" content="@username">
  // or maybe even better, include both the `eunomiaBase` and the username:
  // <meta name="eunomia:account" content="https://eunomia.instance/@username">
  //const eunomiaMeta = document.querySelector('meta[name="eunomia:account"]');
  //eunomiaAccount = eunomiaMeta.content;

  
  // add styles
  /**The EUNOMIA logo image element, to be added to the buttons/links */
  
    // if (articleUrl && eunomiaBase !== "") {
    //     document.addEventListener("DOMContentLoaded", onLoad); 
    // }

    let j = document.createElement("script");
    j.src = connector;
    j.async = !0;
    j.crossOrigin = "anonymous";
    let i = document.getElementsByTagName("script")[0];
    i.parentNode && i.parentNode.insertBefore(j, i);
})
("https://test.mastodononline.site/eunomia/static/eunomia.js", "EUNOMIA");