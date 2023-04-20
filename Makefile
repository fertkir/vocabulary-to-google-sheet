VERSION=1.0.0
JQUERY=jquery-3.6.4.min.js
SRC_DIR := ./src
BUILD_DIR := ./build
LIB_DIR := $(BUILD_DIR)/lib
BUILD_COMMON := $(BUILD_DIR)/.build-common
BUILD_FIREFOX := $(BUILD_DIR)/.build-firefox
BUILD_CHROME := $(BUILD_DIR)/.build-chrome
DEVELOP_DIR := $(BUILD_DIR)/develop
RELEASE_DIR := $(BUILD_DIR)/release
RELEASE_VERSION_DIR := $(RELEASE_DIR)/$(VERSION)

all: clean build_firefox build_chrome
	rm -r $(BUILD_COMMON)

clean:
	rm -rf $(DEVELOP_DIR)
	rm -rf $(RELEASE_DIR)

build_firefox: build_common
	cp -a $(BUILD_COMMON)/. $(BUILD_FIREFOX); \
    jq -s '.[0] * .[1]' $(BUILD_FIREFOX)/manifest.json $(SRC_DIR)/manifest-firefox.json > $(BUILD_FIREFOX)/manifest.json.tmp; \
    mv $(BUILD_FIREFOX)/manifest.json.tmp $(BUILD_FIREFOX)/manifest.json; \
    zip -r -1 $(RELEASE_VERSION_DIR)/firefox-$(VERSION).xpi $(BUILD_FIREFOX)/*; \
    zip -r -1 $(DEVELOP_DIR)/firefox.xpi $(BUILD_FIREFOX)/*; \
    cp $(BUILD_FIREFOX)/manifest.json $(RELEASE_VERSION_DIR)/firefox-manifest.json; \
    rm -r $(BUILD_FIREFOX)

build_chrome: build_common
	cp -a $(BUILD_COMMON)/. $(BUILD_CHROME); \
    jq -s '.[0] * .[1]' $(BUILD_CHROME)/manifest.json $(SRC_DIR)/manifest-chrome.json > $(BUILD_CHROME)/manifest.json.tmp; \
    mv $(BUILD_CHROME)/manifest.json.tmp $(BUILD_CHROME)/manifest.json; \
    zip -r -1 $(RELEASE_VERSION_DIR)/chrome-$(VERSION).crx $(BUILD_CHROME)/*; \
    cp $(RELEASE_VERSION_DIR)/chrome-$(VERSION).crx $(RELEASE_VERSION_DIR)/chrome-$(VERSION).zip; \
    jq -s '.[0] * .[1]' $(BUILD_CHROME)/manifest.json $(SRC_DIR)/manifest-chrome-dev.json > $(BUILD_CHROME)/manifest.json.tmp; \
    mv $(BUILD_CHROME)/manifest.json.tmp $(BUILD_CHROME)/manifest.json; \
    cp -R $(BUILD_CHROME)/. $(DEVELOP_DIR)/chrome; \
    rm -r $(BUILD_CHROME)

build_common: create_dirs download_libs
	cp -a $(SRC_DIR)/. $(BUILD_COMMON); \
	cp $(LIB_DIR)/$(JQUERY) $(BUILD_COMMON); \
    rm $(BUILD_COMMON)/manifest-*.json; \
    rm $(BUILD_COMMON)/sites-settings.json; \
    echo "const defaultSitesSettings = $$(cat $(SRC_DIR)/sites-settings.json);" > $(BUILD_COMMON)/sites-settings.js; \
    jq ". += {\"version\": \"$(VERSION)\"}" $(SRC_DIR)/manifest.json > $(BUILD_COMMON)/manifest.json; \
    jq ".content_scripts[0].js |= [\"$(JQUERY)\"] + ." $(SRC_DIR)/manifest.json > $(BUILD_COMMON)/manifest.json

create_dirs:
	mkdir -p $(DEVELOP_DIR)
	mkdir -p $(RELEASE_VERSION_DIR)

download_libs:
	mkdir -p $(LIB_DIR); \
    ! test -s $(LIB_DIR)/$(JQUERY) && cd $(LIB_DIR) && wget https://code.jquery.com/$(JQUERY) || \
    echo "$(JQUERY) already downloaded"
