if (browser.identity) {

authorize = function() {
  return browser.identity.launchWebAuthFlow({
    interactive: true,
    url: AUTH_URL
  }).then(function(redirectURL) {
    return redirectURL.match(/access_token=([^&]+)&/)[1];
  });
}

}