function tryImportScript(script) {
    try {
        importScripts(script);
    } catch (e) {
        console.log(e);
    }
}
tryImportScript("polyfills.js");
tryImportScript("auth.js");
tryImportScript("background.js");
