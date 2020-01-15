function save_options() {
  chrome.storage.sync.set({
    spreadsheet: document.getElementById('spreadsheet').value,
    sendUrls: document.getElementById('sendUrls').checked,
    enSheet: document.getElementById('enSheet').value,
    esSheet: document.getElementById('esSheet').value,
    ruSheet: document.getElementById('ruSheet').value
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
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