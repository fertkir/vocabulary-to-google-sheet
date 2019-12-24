const CLIENT_ID = '444973037518-hcoukn406meu93cufq0afsbh98k2tanb.apps.googleusercontent.com';

function authorize() {
  const redirectURL = "http://localhost/vocabulary-add/"
  const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
  let authURL = "https://accounts.google.com/o/oauth2/auth";
  authURL += `?client_id=${CLIENT_ID}`;
  authURL += `&response_type=token`;
  authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
  authURL += `&scope=${encodeURIComponent(scopes.join(' '))}`;

  return browser.identity.launchWebAuthFlow({
    interactive: true,
    url: authURL
  }).then(function(redirectURL) {
    return redirectURL.match(/access_token=([^&]+)&/)[1];
  });
}