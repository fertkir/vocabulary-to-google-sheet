# cleaning
rm -rf build

mkdir build
cd build

# building firefox extension
cp -a ../firefox/. .build-firefox
cp -a ../common/. .build-firefox
jq -s '.[0] * .[1]' ../common/manifest.json ../firefox/manifest.json > .build-firefox/manifest.json
mkdir firefox
cd .build-firefox
zip -r -1 ../firefox/{7cadcc4b-af6c-4227-a247-7122bfeea911}.xpi *
cd ..
rm -r .build-firefox

# building chrome extension
cp -a ../chrome/. .build-chrome
cp -a ../common/. .build-chrome
jq -s '.[0] * .[1]' ../common/manifest.json ../chrome/manifest.json > .build-chrome/manifest.json
mv .build-chrome vocabulary-chrome-extension

# building kiwi extension
cp -a ../kiwi/. .build-kiwi
cp -a ../common/. .build-kiwi
jq -s '.[0] * .[1]' ../common/manifest.json ../kiwi/manifest.json > .build-kiwi/manifest.json
mkdir kiwi
cd .build-kiwi
zip -r -1 ../kiwi/vocabulary-to-spreadsheet.crx *
cd ..
rm -r .build-kiwi
