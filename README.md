# What is it for?
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

# How to get it?
#### For desktops
* [Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/vocabulary-to-google-sheet/)
* [Google Chrome](https://chrome.google.com/webstore/detail/vocabulary-to-google-shee/iihhhbkpnemncnmefhffhfiecmilppnf)

#### For Android
* Google Chrome doesn't support extensions on Android
* Mozilla Firefox used to support extensions on Android before [this release](https://blog.mozilla.org/blog/2020/08/25/introducing-a-new-firefox-for-android-experience/). Now it doesn't.
* [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser) now is the only option for Android. Based on Chromium, it allows installing extensions.

#### For iPhone
Not supported yet. If you'd like to have it, please raise an issue with proposal.

# How to build
### Requirements
1. Ubuntu or other Linux distribution.
2. jq v.1.5.1 (sudo apt install jq) - for merging manifest.json for different extension distributions.
3. zip - to create archive of extension

### Building process
Run `./build.sh`

Builded extensions will be in `build/` directory.
