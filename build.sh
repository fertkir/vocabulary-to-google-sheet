# cleaning
rm -rf build

mkdir build
cd build

# building firefox android extension
cp -a ../firefox-android/. .build-firefox-android
cp -a ../common/. .build-firefox-android
jq -s '.[0] * .[1]' ../common/manifest.json ../firefox-android/manifest.json > .build-firefox-android/manifest.json
mkdir firefox-android
cd .build-firefox-android
zip -r -1 ../firefox-android/test@example.com.xpi *
cd ..
rm -r .build-firefox-android

# building firefox desktop extension
cp -a ../firefox/. .build-firefox
cp -a ../common/. .build-firefox
jq -s '.[0] * .[1]' ../common/manifest.json ../firefox/manifest.json > .build-firefox/manifest.json
mkdir firefox-desktop
cd .build-firefox
zip -r -1 ../firefox-desktop/test@example.com.xpi *
cd ..
rm -r .build-firefox

# building chrome extension
cp -a ../chrome/. .build-chrome
cp -a ../common/. .build-chrome
jq -s '.[0] * .[1]' ../common/manifest.json ../chrome/manifest.json > .build-chrome/manifest.json
mv .build-chrome vocabulary-chrome-extension
