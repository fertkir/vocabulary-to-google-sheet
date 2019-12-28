function save_options() {
  chrome.storage.sync.set({
    spreadsheet: document.getElementById('spreadsheet').value,
    enSheet: document.getElementById('enSheet').value,
    esSheet: document.getElementById('esSheet').value
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
    enSheet: 'English',
    esSheet: 'Español'
  }, function(items) {
    document.getElementById('spreadsheet').value = items.spreadsheet;
    document.getElementById('enSheet').value = items.enSheet;
    document.getElementById('esSheet').value = items.esSheet;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);