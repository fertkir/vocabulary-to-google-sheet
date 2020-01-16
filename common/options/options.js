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

function save_options() {
  chrome.storage.sync.set({
    spreadsheet: document.getElementById('spreadsheet').value,
    sendUrls: document.getElementById('sendUrls').checked,
    enSheet: document.getElementById('enSheet').value,
    esSheet: document.getElementById('esSheet').value,
    ruSheet: document.getElementById('ruSheet').value
  }, function() {
    var status = document.getElementById('status');
    status.textContent = browser.i18n.getMessage("optionsSaved");
    setTimeout(function() {
      status.textContent = '';
    }, 750);
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