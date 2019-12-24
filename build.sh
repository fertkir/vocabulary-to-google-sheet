# cleaning
rm -rf build

mkdir build
cd build

# building firefox android extension
cp -a ../firefox-android/. .build-firefox-android
cp -a ../common/. .build-firefox-android
mkdir firefox-android
cd .build-firefox-android
zip -r -1 ../firefox-android/test@example.com.xpi *
cd ..
rm -r .build-firefox-android

# building firefox desktop extension
cp -a ../firefox/. .build-firefox
cp -a ../common/. .build-firefox
mkdir firefox-desktop
cd .build-firefox
zip -r -1 ../firefox-desktop/test@example.com.xpi *
cd ..
rm -r .build-firefox

# building chrome extension
cp -a ../chrome/. .build-chrome
cp -a ../common/. .build-chrome
mv .build-chrome vocabulary-chrome-extension
