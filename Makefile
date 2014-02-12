test:
	@./node_modules/mocha/bin/mocha --reporter list

dist: $(wildcard lib/*.js) $(wildcard lib/browser/*.js)
	@./node_modules/closurecompiler/bin/ccjs $^ \
		--language_in=ECMASCRIPT5_STRICT \
		--compilation_level=ADVANCED_OPTIMIZATIONS \
		--use_types_for_optimization \
		--process_common_js_modules \
		--common_js_entry_module=strofa \
		--jscomp_off=globalThis \
		--output_wrapper="\"/*! strofa (c) 2013-`date +"%Y"` Rolf W. Timmermans */!function(){%output%}.call(this)\"" \
		> dist/strofa.min.js

remodel:
	@node data/build.js

.PHONY: test dist remodel
