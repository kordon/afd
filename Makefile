REPORTER = dot
UI = bdd
TESTS = test

test:
	@NODE_ENV=test ./node_modules/.bin/mocha -u $(UI) -R $(REPORTER) -c -G -b

lib-cov:
	./node_modules/jscoverage/bin/jscoverage lib lib-cov

test-cov:	lib-cov
	@AFD_COVERAGE=1 $(MAKE) test REPORTER=html-cov > coverage.html
	rm -rf lib-cov

test-coveralls:	lib-cov
	echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@AFD_COVERAGE=1 $(MAKE) test REPORTER=mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js
	rm -rf lib-cov

.PHONY: test