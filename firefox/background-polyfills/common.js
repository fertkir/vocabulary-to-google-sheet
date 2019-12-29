const AUTH_URL = buildAuthUrl();

function buildAuthUrl() {
  const clientId = '444973037518-hcoukn406meu93cufq0afsbh98k2tanb.apps.googleusercontent.com';
  const redirectURL = "http://localhost/vocabulary-add/";
  const scopes = ["https://www.googleapis.com/auth/spreadsheets"];

  let authURL = "https://accounts.google.com/o/oauth2/auth";
  authURL += `?client_id=${clientId}`;
  authURL += `&response_type=token`;
  authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
  authURL += `&scope=${encodeURIComponent(scopes.join(' '))}`;

  return authURL;
}