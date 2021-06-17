version=${1:-"1.0.0"}

# cleaning
rm -rf build

mkdir build
cd build
mkdir develop
mkdir -p release/$version

# building common part
cp -a ../src/. .build-common
cd .build-common
rm manifest-*.json
settings_json=$(cat sites-settings.json)
echo "const defaultSitesSettings = $settings_json;" > sites-settings.json
mv sites-settings.json sites-settings.js
jq ". += {\"version\": \"$version\"}" ../../src/manifest.json > manifest.json
cd ..

# building firefox extension
cp -a .build-common/. .build-firefox
cd .build-firefox
jq -s '.[0] * .[1]' manifest.json ../../src/manifest-firefox.json > manifest.json.tmp
mv manifest.json.tmp manifest.json
zip -r -1 ../release/$version/firefox-$version.xpi *
zip -r -1 ../develop/firefox.xpi *
cd ..
rm -r .build-firefox

# building chrome extension
cp -a .build-common/. .build-chrome
cd .build-chrome
jq -s '.[0] * .[1]' manifest.json ../../src/manifest-chrome.json > manifest.json.tmp
mv manifest.json.tmp manifest.json
zip -r -1 ../release/$version/chrome-$version.crx *
jq -s '.[0] * .[1]' manifest.json ../../src/manifest-chrome-dev.json > manifest.json.tmp
mv manifest.json.tmp manifest.json
cp -R . ../develop/chrome
cd ..
rm -r .build-chrome

rm -r .build-common