# cleaning
rm -rf *.xpi *.crx .build*

# building firefox android extension
cp -a firefox-android/. .build-firefox-android
cp -a common/. .build-firefox-android
cd .build-firefox-android
zip -r -1 ../test@example.com.xpi *
cd ..
rm -r .build-firefox-android

# building chrome extension
cp -a chrome/. .build-chrome
cp -a common/. .build-chrome
cd .build-chrome
zip -r -1 ../test@example.com.crx *
cd ..
rm -r .build-chrome
