TESTS = test/*.js
REPORTER = spec
TIMEOUT = 20000
MOCHA_OPTS =

install:
	@npm --registry=http://registry.npm.taobao.org --disturl=http://dist.u.qiniudn.com install

test: install
	@NODE_ENV=test ./node_modules/mocha/bin/mocha --harmony \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(MOCHA_OPTS) \
		$(TESTS)

.PHONY: test