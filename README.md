# What is it for?
Watch in [this video](https://www.youtube.com/watch?v=KGMwl8s3xDk).
Suppose you're learning a language, how do you remember new vocabulary? There're beliefs that the best approach is to read a sentence which has a new word in it. 

For example, you want to remember a word <ins>car</ins>. You open an online dictionary and see these examples:
* I have a <ins>car</ins> of BMW brand.
* You drive your <ins>car</ins> too fast.
* What color is your <ins>car</ins>?

What would you do with these? I would save them to my vocabulary Google Sheet and read them on the next day. But copy-pasting each sentence isn't cool, especially on your smartphone =(

This browser extension allows you to have those sentences to look like this in your browser:
* I have a <ins>car</ins> of BMW brand. **[Save]**
* You drive your <ins>car</ins> too fast. **[Save]**
* What color is your <ins>car</ins>? **[Save]**

Where **[Save]** is a link. When you click it, the sentence is saved to your Google Sheet. Isn't that cool? =)

### I like it! But what do I do with those sentences in a Google Sheet?
There's [a nice Google Sheet add-on](https://gsuite.google.com/marketplace/app/vocabulary_90/637385062408) that will automate the learning process. Once you've saved the sentences, you'll periodically receive emails with them to recollect. More details how [the Google Sheet add-on](https://gsuite.google.com/marketplace/app/vocabulary_90/637385062408) works, what it does and how often does it send emails can be found in the [add-on description](https://gsuite.google.com/marketplace/app/vocabulary_90/637385062408).

### What online dictionaries are supported?
The full list can be found [here](https://github.com/fertkir/vocabulary-to-google-sheet/blob/main/common/sites-settings.js), among them are:
* https://www.google.com/
* https://dictionary.cambridge.org/
* https://www.spanishdict.com/

Since sentences detection is based on regular expressions, it would be quite fast to add support of other dictionaries.

# How to get it?
#### For desktops
* [Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/vocabulary-to-google-sheet/)
* [Google Chrome](https://chrome.google.com/webstore/detail/vocabulary-to-google-shee/iihhhbkpnemncnmefhffhfiecmilppnf)

#### For Android
* Google Chrome doesn't support extensions on Android
* Mozilla Firefox used to support extensions on Android before [this release](https://blog.mozilla.org/blog/2020/08/25/introducing-a-new-firefox-for-android-experience/). Now it doesn't.
* [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser) now is the only option for Android. Based on Chromium, it allows installing extensions.

#### For iPhone
Unfortunately, iPhone doesn't support browser extenstions. [Vocabulary 90 add-on](https://gsuite.google.com/marketplace/app/vocabulary_90/637385062408) supports adding sentences through a Google Form ([see screenshots here](https://gsuite.google.com/marketplace/app/vocabulary_90/637385062408)). Currently it's the most convenient way for iPhones.

# [How to install](https://github.com/fertkir/vocabulary-to-google-sheet/wiki/How-to-install)
How to install the extension and how to setup a target Google Sheet for it, please read [here](https://github.com/fertkir/vocabulary-to-google-sheet/wiki/How-to-install).

# How to build
### Requirements
1. Ubuntu or other Linux distribution.
2. jq v.1.5.1 (sudo apt install jq) - for merging manifest.json for different extension distributions.
3. zip - to create archive of extension

### Building process
Run `./build.sh`

Builded extensions will be in `build/` directory.
