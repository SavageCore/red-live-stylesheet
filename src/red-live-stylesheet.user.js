// ==UserScript==
// @name           RED Live Stylesheet
// @author         SavageCore
// @namespace      https://savagecore.eu
// @description    Live preview of stylesheet choice on RED
// @include        http*://*redacted.ch/user.php?action=edit*
// @version        0.1.0
// @date           2019-01-03
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL	   https://github.com/SavageCore/red-live-stylesheet/raw/master/src/red-live-stylesheet.user.js
// @run-at         document-end
// ==/UserScript==

/*	global document */

(function () {
	const stylesheetElem = document.querySelector('#stylesheet');
	const externalStylesheetElem = document.querySelector('#styleurl');
	const now = Number(new Date());
	const stylesheets = {
		1: `static/styles/shiro/style.css?v=${now}`,
		2: `static/styles/layer_cake/style.css?v=${now}`,
		3: `static/styles/kuro/style.css?v=${now}`,
		4: `static/styles/minimal/style.css?v=${now}`,
		9: `static/styles/proton/style.css?v=${now}`,
		21: `static/styles/postmod/style.css?v=${now}`,
		22: `static/styles/red_dark/style.css?v=${now}`,
		23: `static/styles/red_light/style.css?v=${now}`
	};
	let previousCssVal = stylesheetElem.value.trim();
	let previousExternalCssVal = externalStylesheetElem.value.trim();

	// Watch for updates to stylesheet drop down (for detecting change by JS and not user)
	setInterval(() => {
		const cssVal = stylesheetElem.value.trim();
		if (!cssVal) {
			return;
		}

		if (previousCssVal !== cssVal) {
			changeStyle(stylesheets[cssVal]);
			previousCssVal = cssVal;
			previousExternalCssVal = externalStylesheetElem.value.trim();
		}
	}, 100);

	// Watch for updates to external stylesheet input (for detecting change by JS and not user)
	setInterval(() => {
		const externalCssVal = externalStylesheetElem.value.trim();
		if (!externalCssVal) {
			return;
		}

		if (previousExternalCssVal !== externalCssVal) {
			changeStyle(externalCssVal);
			previousExternalCssVal = externalCssVal;
			previousCssVal = stylesheetElem.value.trim();
		}
	}, 100);

	async function changeStyle(url) {
		await validCss(url)
			.then(() => {
				// Find all <link>'s to css files
				const elems = document.querySelectorAll('head > link[href*=".css"]');
				elems.forEach(link => {
					// Main page css is the only <link> with title attribute
					if (link.hasAttribute('title')) {
						link.href = url;
					}
				});
			})
			.catch(() => {});
	}

	// Check if style url ends with .css to prevent mid typing changes
	function validCss(url) {
		return new Promise((resolve, reject) => {
			if (url.endsWith('.css')) {
				resolve(true);
			} else if (url.endsWith(`.css?v=${now}`)) {
				resolve(true);
			}

			reject(new Error('Incomplete style url'));
		});
	}
})();
