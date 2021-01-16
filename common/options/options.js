function localizeHtmlPage()
{
    //Localize by replacing __MSG_***__ meta tags
    var objects = document.getElementsByTagName('html');
    for (var j = 0; j < objects.length; j++)
    {
        var obj = objects[j];

        var valStrH = obj.innerHTML.toString();
        var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function(match, v1)
        {
            return v1 ? browser.i18n.getMessage(v1) : "";
        });

        if(valNewH != valStrH)
        {
            obj.innerHTML = valNewH;
        }
    }
}

localizeHtmlPage();

function showStatusMessage(message) {
  var status = document.getElementById('status');
  status.textContent = message;
  setTimeout(function() {
    status.textContent = '';
  }, 750);
}

async function fetchSiteSettings() {
  const response = await fetch('https://raw.githubusercontent.com/fertkir/vocabulary-to-google-sheet/main/common/sites-settings.js');
  if (response.status !== 200) {
    throw new Error(response.statusText);
  }
  return response.json();
}

function reload_site_settings() {
  fetchSiteSettings().then(function(settings) {
    chrome.storage.sync.set({
      sitesSettings: settings
    }, function() {
      showStatusMessage(browser.i18n.getMessage("optionsSiteSettingsLoaded"));
    });
  }, function(error) {
      showStatusMessage(browser.i18n.getMessage("optionsSiteSettingsLoadError"));
  });
}

function save_options() {
  chrome.storage.sync.set({
    spreadsheet: document.getElementById('spreadsheet').value,
    sendUrls: document.getElementById('sendUrls').checked,
    enSheet: document.getElementById('enSheet').value,
    esSheet: document.getElementById('esSheet').value,
    ruSheet: document.getElementById('ruSheet').value
  }, function() {
    showStatusMessage(browser.i18n.getMessage("optionsSaved"));
  });
}

function restore_options() {
  chrome.storage.sync.get({
    spreadsheet: '',
    sendUrls: false,
    enSheet: 'English',
    esSheet: 'Español',
    ruSheet: 'Русский'
  }, function(items) {
    document.getElementById('spreadsheet').value = items.spreadsheet;
    document.getElementById('sendUrls').checked = items.sendUrls;
    document.getElementById('enSheet').value = items.enSheet;
    document.getElementById('esSheet').value = items.esSheet;
    document.getElementById('ruSheet').value = items.ruSheet;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('reloadSettings').addEventListener('click', reload_site_settings);
