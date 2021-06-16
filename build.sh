version=${1:-"1.0.0"}

# cleaning
rm -rf build

mkdir build
cd build
mkdir develop
mkdir -p release/$version

# building common part
cp -a ../common/. .build-common
cd .build-common
settings_json=$(cat sites-settings.json)
echo "const defaultSitesSettings = $settings_json;" > sites-settings.json
mv sites-settings.json sites-settings.js
jq ". += {\"version\": \"$version\"}" ../../common/manifest.json > manifest.json
cd ..

# building firefox extension
cp -a ../firefox/. .build-firefox
cp -a .build-common/. .build-firefox
jq -s '.[0] * .[1]' .build-common/manifest.json ../firefox/manifest.json > .build-firefox/manifest.json
cd .build-firefox
zip -r -1 ../develop/firefox.xpi *
zip -r -1 ../release/$version/firefox-$version.xpi *
cd ..
rm -r .build-firefox

# building chrome extension
cp -a ../chrome/. .build-chrome
cp -a .build-common/. .build-chrome
jq -s '.[0] * .[1]' .build-common/manifest.json ../chrome/manifest.json > .build-chrome/manifest.json
cd .build-chrome
cp -R . ../develop/chrome
zip -r -1 ../release/$version/chrome-$version.crx *
cd ..
rm -r .build-chrome

rm -r .build-common