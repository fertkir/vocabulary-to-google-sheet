VERSION=1.0.0
JQUERY=jquery-3.6.4.min.js
REPO_ROOT := $$(git rev-parse --show-toplevel)
SRC_DIR := $(REPO_ROOT)/src
BUILD_DIR := $(REPO_ROOT)/build
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
	pushd $(BUILD_FIREFOX); \
	jq -s '.[0] * .[1]' manifest.json $(SRC_DIR)/manifest-firefox.json > manifest.json.tmp; \
	mv manifest.json.tmp manifest.json; \
	zip -r -1 $(RELEASE_VERSION_DIR)/firefox-$(VERSION).xpi *; \
	zip -r -1 $(DEVELOP_DIR)/firefox.xpi *; \
	cp manifest.json $(RELEASE_VERSION_DIR)/firefox-manifest.json; \
	popd; \
	rm -r $(BUILD_FIREFOX)

build_chrome: build_common
	cp -a $(BUILD_COMMON)/. $(BUILD_CHROME); \
	pushd $(BUILD_CHROME); \
	jq -s '.[0] * .[1]' manifest.json $(SRC_DIR)/manifest-chrome.json > manifest.json.tmp; \
	mv manifest.json.tmp manifest.json; \
	zip -r -1 $(RELEASE_VERSION_DIR)/chrome-$(VERSION).crx *; \
	cp $(RELEASE_VERSION_DIR)/chrome-$(VERSION).crx $(RELEASE_VERSION_DIR)/chrome-$(VERSION).zip; \
	jq -s '.[0] * .[1]' manifest.json $(SRC_DIR)/manifest-chrome-dev.json > manifest.json.tmp; \
	mv manifest.json.tmp manifest.json; \
	cp -R . $(DEVELOP_DIR)/chrome; \
	popd; \
	rm -r $(BUILD_CHROME)

build_common: create_dirs download_libs
	cp -a $(SRC_DIR)/. $(BUILD_COMMON); \
	pushd $(BUILD_COMMON); \
	cp $(LIB_DIR)/$(JQUERY) .; \
	rm manifest-*.json; \
	rm sites-settings.json; \
	echo "const defaultSitesSettings = $$(cat $(SRC_DIR)/sites-settings.json);" > sites-settings.js; \
	jq ". += {\"version\": \"$(VERSION)\"} | .content_scripts[0].js |= [\"$(JQUERY)\"] + ." $(SRC_DIR)/manifest.json > manifest.json; \
	popd

create_dirs:
	mkdir -p $(DEVELOP_DIR)
	mkdir -p $(RELEASE_VERSION_DIR)

download_libs:
	mkdir -p $(LIB_DIR); \
	! test -s $(LIB_DIR)/$(JQUERY) && cd $(LIB_DIR) && wget https://code.jquery.com/$(JQUERY) || \
	echo "$(JQUERY) already downloaded"