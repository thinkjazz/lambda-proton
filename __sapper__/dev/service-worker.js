(function () {
	'use strict';

	// This file is generated by Sapper — do not edit it!
	const timestamp = 1585535648062;

	const files = [
		"service-worker-index.html",
		"chart.png",
		"dashboard.png",
		"error-404-monochrome.svg",
		"favicon.png",
		"global.css",
		"great-success.png",
		"l-proton-logo-2.png",
		"l-proton-logo.png",
		"l-proton.css",
		"light.png",
		"logo-192.png",
		"logo-512.png",
		"manifest.json",
		"response.png",
		"settings.png",
		"static.png",
		"tables.png"
	];

	const shell = [
		"client/client.2aef430b.js",
		"client/BreadcrumbItem.fc9463e9.js",
		"client/CardBody.ea3b0c22.js",
		"client/CardHeader.c1a3c032.js",
		"client/CardText.002ea404.js",
		"client/index.29c070a9.js",
		"client/Row.a1d0e1a1.js",
		"client/CardFooter.bdb1e9ad.js",
		"client/Table.d86d1879.js",
		"client/Image.3801f814.js",
		"client/AreaChart.e36aa4c4.js",
		"client/BarChart.6cec7ada.js",
		"client/activity_log.f048bcc0.js",
		"client/FormGroup.aaffd2d0.js",
		"client/settings.cf885cc5.js",
		"client/static_navigation.a5e02225.js",
		"client/light_sidenav.fd60afe3.js",
		"client/charts.311d3383.js",
		"client/tables.43a840f1.js",
		"client/_layout.293cfd2a.js",
		"client/login.7e692579.js",
		"client/Col.3a2f7327.js",
		"client/register.e485bc83.js",
		"client/forget_password.957fb076.js",
		"client/_layout.39245b1b.js",
		"client/error_401.1a203bdd.js",
		"client/error_404.41e38955.js",
		"client/error_500.062de541.js",
		"client/_layout.2c0576d1.js",
		"client/index.6443f093.js",
		"client/[slug].241dd925.js",
		"client/ui.c284366d.js",
		"client/_layout.b9cc6db1.js",
		"client/sapper-dev-client.89e34bae.js",
		"client/client.3d6b51f2.js"
	];

	const ASSETS = `cache${timestamp}`;

	// `shell` is an array of all the files generated by the bundler,
	// `files` is an array of everything in the `static` directory
	const to_cache = shell.concat(files);
	const cached = new Set(to_cache);

	self.addEventListener('install', event => {
		event.waitUntil(
			caches
				.open(ASSETS)
				.then(cache => cache.addAll(to_cache))
				.then(() => {
					self.skipWaiting();
				})
		);
	});

	self.addEventListener('activate', event => {
		event.waitUntil(
			caches.keys().then(async keys => {
				// delete old caches
				for (const key of keys) {
					if (key !== ASSETS) await caches.delete(key);
				}

				self.clients.claim();
			})
		);
	});

	self.addEventListener('fetch', event => {
		if (event.request.method !== 'GET' || event.request.headers.has('range')) return;

		const url = new URL(event.request.url);

		// don't try to handle e.g. data: URIs
		if (!url.protocol.startsWith('http')) return;

		// ignore dev server requests
		if (url.hostname === self.location.hostname && url.port !== self.location.port) return;

		// always serve static files and bundler-generated assets from cache
		if (url.host === self.location.host && cached.has(url.pathname)) {
			event.respondWith(caches.match(event.request));
			return;
		}

		// for pages, you might want to serve a shell `service-worker-index.html` file,
		// which Sapper has generated for you. It's not right for every
		// app, but if it's right for yours then uncomment this section
		/*
		if (url.origin === self.origin && routes.find(route => route.pattern.test(url.pathname))) {
			event.respondWith(caches.match('/service-worker-index.html'));
			return;
		}
		*/

		if (event.request.cache === 'only-if-cached') return;

		// for everything else, try the network first, falling back to
		// cache if the user is offline. (If the pages never change, you
		// might prefer a cache-first approach to a network-first one.)
		event.respondWith(
			caches
				.open(`offline${timestamp}`)
				.then(async cache => {
					try {
						const response = await fetch(event.request);
						cache.put(event.request, response.clone());
						return response;
					} catch(err) {
						const response = await cache.match(event.request);
						if (response) return response;

						throw err;
					}
				})
		);
	});

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS13b3JrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub2RlX21vZHVsZXMvQHNhcHBlci9zZXJ2aWNlLXdvcmtlci5qcyIsIi4uLy4uL3NyYy9zZXJ2aWNlLXdvcmtlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGJ5IFNhcHBlciDigJQgZG8gbm90IGVkaXQgaXQhXG5leHBvcnQgY29uc3QgdGltZXN0YW1wID0gMTU4NTUzNTY0ODA2MjtcblxuZXhwb3J0IGNvbnN0IGZpbGVzID0gW1xuXHRcInNlcnZpY2Utd29ya2VyLWluZGV4Lmh0bWxcIixcblx0XCJjaGFydC5wbmdcIixcblx0XCJkYXNoYm9hcmQucG5nXCIsXG5cdFwiZXJyb3ItNDA0LW1vbm9jaHJvbWUuc3ZnXCIsXG5cdFwiZmF2aWNvbi5wbmdcIixcblx0XCJnbG9iYWwuY3NzXCIsXG5cdFwiZ3JlYXQtc3VjY2Vzcy5wbmdcIixcblx0XCJsLXByb3Rvbi1sb2dvLTIucG5nXCIsXG5cdFwibC1wcm90b24tbG9nby5wbmdcIixcblx0XCJsLXByb3Rvbi5jc3NcIixcblx0XCJsaWdodC5wbmdcIixcblx0XCJsb2dvLTE5Mi5wbmdcIixcblx0XCJsb2dvLTUxMi5wbmdcIixcblx0XCJtYW5pZmVzdC5qc29uXCIsXG5cdFwicmVzcG9uc2UucG5nXCIsXG5cdFwic2V0dGluZ3MucG5nXCIsXG5cdFwic3RhdGljLnBuZ1wiLFxuXHRcInRhYmxlcy5wbmdcIlxuXTtcbmV4cG9ydCB7IGZpbGVzIGFzIGFzc2V0cyB9OyAvLyBsZWdhY3lcblxuZXhwb3J0IGNvbnN0IHNoZWxsID0gW1xuXHRcImNsaWVudC9jbGllbnQuMmFlZjQzMGIuanNcIixcblx0XCJjbGllbnQvQnJlYWRjcnVtYkl0ZW0uZmM5NDYzZTkuanNcIixcblx0XCJjbGllbnQvQ2FyZEJvZHkuZWEzYjBjMjIuanNcIixcblx0XCJjbGllbnQvQ2FyZEhlYWRlci5jMWEzYzAzMi5qc1wiLFxuXHRcImNsaWVudC9DYXJkVGV4dC4wMDJlYTQwNC5qc1wiLFxuXHRcImNsaWVudC9pbmRleC4yOWMwNzBhOS5qc1wiLFxuXHRcImNsaWVudC9Sb3cuYTFkMGUxYTEuanNcIixcblx0XCJjbGllbnQvQ2FyZEZvb3Rlci5iZGIxZTlhZC5qc1wiLFxuXHRcImNsaWVudC9UYWJsZS5kODZkMTg3OS5qc1wiLFxuXHRcImNsaWVudC9JbWFnZS4zODAxZjgxNC5qc1wiLFxuXHRcImNsaWVudC9BcmVhQ2hhcnQuZTM2YWE0YzQuanNcIixcblx0XCJjbGllbnQvQmFyQ2hhcnQuNmNlYzdhZGEuanNcIixcblx0XCJjbGllbnQvYWN0aXZpdHlfbG9nLmYwNDhiY2MwLmpzXCIsXG5cdFwiY2xpZW50L0Zvcm1Hcm91cC5hYWZmZDJkMC5qc1wiLFxuXHRcImNsaWVudC9zZXR0aW5ncy5jZjg4NWNjNS5qc1wiLFxuXHRcImNsaWVudC9zdGF0aWNfbmF2aWdhdGlvbi5hNWUwMjIyNS5qc1wiLFxuXHRcImNsaWVudC9saWdodF9zaWRlbmF2LmZkNjBhZmUzLmpzXCIsXG5cdFwiY2xpZW50L2NoYXJ0cy4zMTFkMzM4My5qc1wiLFxuXHRcImNsaWVudC90YWJsZXMuNDNhODQwZjEuanNcIixcblx0XCJjbGllbnQvX2xheW91dC4yOTNjZmQyYS5qc1wiLFxuXHRcImNsaWVudC9sb2dpbi43ZTY5MjU3OS5qc1wiLFxuXHRcImNsaWVudC9Db2wuM2EyZjczMjcuanNcIixcblx0XCJjbGllbnQvcmVnaXN0ZXIuZTQ4NWJjODMuanNcIixcblx0XCJjbGllbnQvZm9yZ2V0X3Bhc3N3b3JkLjk1N2ZiMDc2LmpzXCIsXG5cdFwiY2xpZW50L19sYXlvdXQuMzkyNDViMWIuanNcIixcblx0XCJjbGllbnQvZXJyb3JfNDAxLjFhMjAzYmRkLmpzXCIsXG5cdFwiY2xpZW50L2Vycm9yXzQwNC40MWUzODk1NS5qc1wiLFxuXHRcImNsaWVudC9lcnJvcl81MDAuMDYyZGU1NDEuanNcIixcblx0XCJjbGllbnQvX2xheW91dC4yYzA1NzZkMS5qc1wiLFxuXHRcImNsaWVudC9pbmRleC42NDQzZjA5My5qc1wiLFxuXHRcImNsaWVudC9bc2x1Z10uMjQxZGQ5MjUuanNcIixcblx0XCJjbGllbnQvdWkuYzI4NDM2NmQuanNcIixcblx0XCJjbGllbnQvX2xheW91dC5iOWNjNmRiMS5qc1wiLFxuXHRcImNsaWVudC9zYXBwZXItZGV2LWNsaWVudC44OWUzNGJhZS5qc1wiLFxuXHRcImNsaWVudC9jbGllbnQuM2Q2YjUxZjIuanNcIlxuXTtcblxuZXhwb3J0IGNvbnN0IHJvdXRlcyA9IFtcblx0eyBwYXR0ZXJuOiAvXlxcLyQvIH0sXG5cdHsgcGF0dGVybjogL15cXC9hY3Rpdml0eV9sb2dcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL3NldHRpbmdzXFwvPyQvIH0sXG5cdHsgcGF0dGVybjogL15cXC9sYXlvdXRzXFwvc3RhdGljX25hdmlnYXRpb25cXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL2xheW91dHNcXC9saWdodF9zaWRlbmF2XFwvPyQvIH0sXG5cdHsgcGF0dGVybjogL15cXC9jaGFydHNcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL3RhYmxlc1xcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvcGFnZXNcXC9hdXRoZW50aWNhdGlvblxcL2ZvcmdldF9wYXNzd29yZFxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvcGFnZXNcXC9hdXRoZW50aWNhdGlvblxcL3JlZ2lzdGVyXFwvPyQvIH0sXG5cdHsgcGF0dGVybjogL15cXC9wYWdlc1xcL2F1dGhlbnRpY2F0aW9uXFwvbG9naW5cXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL3BhZ2VzXFwvZXJyb3JcXC9lcnJvcl80MDFcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL3BhZ2VzXFwvZXJyb3JcXC9lcnJvcl80MDRcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL3BhZ2VzXFwvZXJyb3JcXC9lcnJvcl81MDBcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL2Jsb2dcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL2Jsb2dcXC8oW15cXC9dKz8pXFwvPyQvIH0sXG5cdHsgcGF0dGVybjogL15cXC91aVxcL3VpXFwvPyQvIH1cbl07IiwiaW1wb3J0IHsgdGltZXN0YW1wLCBmaWxlcywgc2hlbGwsIHJvdXRlcyB9IGZyb20gJ0BzYXBwZXIvc2VydmljZS13b3JrZXInO1xyXG5cclxuY29uc3QgQVNTRVRTID0gYGNhY2hlJHt0aW1lc3RhbXB9YDtcclxuXHJcbi8vIGBzaGVsbGAgaXMgYW4gYXJyYXkgb2YgYWxsIHRoZSBmaWxlcyBnZW5lcmF0ZWQgYnkgdGhlIGJ1bmRsZXIsXHJcbi8vIGBmaWxlc2AgaXMgYW4gYXJyYXkgb2YgZXZlcnl0aGluZyBpbiB0aGUgYHN0YXRpY2AgZGlyZWN0b3J5XHJcbmNvbnN0IHRvX2NhY2hlID0gc2hlbGwuY29uY2F0KGZpbGVzKTtcclxuY29uc3QgY2FjaGVkID0gbmV3IFNldCh0b19jYWNoZSk7XHJcblxyXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ2luc3RhbGwnLCBldmVudCA9PiB7XHJcblx0ZXZlbnQud2FpdFVudGlsKFxyXG5cdFx0Y2FjaGVzXHJcblx0XHRcdC5vcGVuKEFTU0VUUylcclxuXHRcdFx0LnRoZW4oY2FjaGUgPT4gY2FjaGUuYWRkQWxsKHRvX2NhY2hlKSlcclxuXHRcdFx0LnRoZW4oKCkgPT4ge1xyXG5cdFx0XHRcdHNlbGYuc2tpcFdhaXRpbmcoKTtcclxuXHRcdFx0fSlcclxuXHQpO1xyXG59KTtcclxuXHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignYWN0aXZhdGUnLCBldmVudCA9PiB7XHJcblx0ZXZlbnQud2FpdFVudGlsKFxyXG5cdFx0Y2FjaGVzLmtleXMoKS50aGVuKGFzeW5jIGtleXMgPT4ge1xyXG5cdFx0XHQvLyBkZWxldGUgb2xkIGNhY2hlc1xyXG5cdFx0XHRmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7XHJcblx0XHRcdFx0aWYgKGtleSAhPT0gQVNTRVRTKSBhd2FpdCBjYWNoZXMuZGVsZXRlKGtleSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNlbGYuY2xpZW50cy5jbGFpbSgpO1xyXG5cdFx0fSlcclxuXHQpO1xyXG59KTtcclxuXHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignZmV0Y2gnLCBldmVudCA9PiB7XHJcblx0aWYgKGV2ZW50LnJlcXVlc3QubWV0aG9kICE9PSAnR0VUJyB8fCBldmVudC5yZXF1ZXN0LmhlYWRlcnMuaGFzKCdyYW5nZScpKSByZXR1cm47XHJcblxyXG5cdGNvbnN0IHVybCA9IG5ldyBVUkwoZXZlbnQucmVxdWVzdC51cmwpO1xyXG5cclxuXHQvLyBkb24ndCB0cnkgdG8gaGFuZGxlIGUuZy4gZGF0YTogVVJJc1xyXG5cdGlmICghdXJsLnByb3RvY29sLnN0YXJ0c1dpdGgoJ2h0dHAnKSkgcmV0dXJuO1xyXG5cclxuXHQvLyBpZ25vcmUgZGV2IHNlcnZlciByZXF1ZXN0c1xyXG5cdGlmICh1cmwuaG9zdG5hbWUgPT09IHNlbGYubG9jYXRpb24uaG9zdG5hbWUgJiYgdXJsLnBvcnQgIT09IHNlbGYubG9jYXRpb24ucG9ydCkgcmV0dXJuO1xyXG5cclxuXHQvLyBhbHdheXMgc2VydmUgc3RhdGljIGZpbGVzIGFuZCBidW5kbGVyLWdlbmVyYXRlZCBhc3NldHMgZnJvbSBjYWNoZVxyXG5cdGlmICh1cmwuaG9zdCA9PT0gc2VsZi5sb2NhdGlvbi5ob3N0ICYmIGNhY2hlZC5oYXModXJsLnBhdGhuYW1lKSkge1xyXG5cdFx0ZXZlbnQucmVzcG9uZFdpdGgoY2FjaGVzLm1hdGNoKGV2ZW50LnJlcXVlc3QpKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdC8vIGZvciBwYWdlcywgeW91IG1pZ2h0IHdhbnQgdG8gc2VydmUgYSBzaGVsbCBgc2VydmljZS13b3JrZXItaW5kZXguaHRtbGAgZmlsZSxcclxuXHQvLyB3aGljaCBTYXBwZXIgaGFzIGdlbmVyYXRlZCBmb3IgeW91LiBJdCdzIG5vdCByaWdodCBmb3IgZXZlcnlcclxuXHQvLyBhcHAsIGJ1dCBpZiBpdCdzIHJpZ2h0IGZvciB5b3VycyB0aGVuIHVuY29tbWVudCB0aGlzIHNlY3Rpb25cclxuXHQvKlxyXG5cdGlmICh1cmwub3JpZ2luID09PSBzZWxmLm9yaWdpbiAmJiByb3V0ZXMuZmluZChyb3V0ZSA9PiByb3V0ZS5wYXR0ZXJuLnRlc3QodXJsLnBhdGhuYW1lKSkpIHtcclxuXHRcdGV2ZW50LnJlc3BvbmRXaXRoKGNhY2hlcy5tYXRjaCgnL3NlcnZpY2Utd29ya2VyLWluZGV4Lmh0bWwnKSk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cdCovXHJcblxyXG5cdGlmIChldmVudC5yZXF1ZXN0LmNhY2hlID09PSAnb25seS1pZi1jYWNoZWQnKSByZXR1cm47XHJcblxyXG5cdC8vIGZvciBldmVyeXRoaW5nIGVsc2UsIHRyeSB0aGUgbmV0d29yayBmaXJzdCwgZmFsbGluZyBiYWNrIHRvXHJcblx0Ly8gY2FjaGUgaWYgdGhlIHVzZXIgaXMgb2ZmbGluZS4gKElmIHRoZSBwYWdlcyBuZXZlciBjaGFuZ2UsIHlvdVxyXG5cdC8vIG1pZ2h0IHByZWZlciBhIGNhY2hlLWZpcnN0IGFwcHJvYWNoIHRvIGEgbmV0d29yay1maXJzdCBvbmUuKVxyXG5cdGV2ZW50LnJlc3BvbmRXaXRoKFxyXG5cdFx0Y2FjaGVzXHJcblx0XHRcdC5vcGVuKGBvZmZsaW5lJHt0aW1lc3RhbXB9YClcclxuXHRcdFx0LnRoZW4oYXN5bmMgY2FjaGUgPT4ge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGV2ZW50LnJlcXVlc3QpO1xyXG5cdFx0XHRcdFx0Y2FjaGUucHV0KGV2ZW50LnJlcXVlc3QsIHJlc3BvbnNlLmNsb25lKCkpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlO1xyXG5cdFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zdCByZXNwb25zZSA9IGF3YWl0IGNhY2hlLm1hdGNoKGV2ZW50LnJlcXVlc3QpO1xyXG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlKSByZXR1cm4gcmVzcG9uc2U7XHJcblxyXG5cdFx0XHRcdFx0dGhyb3cgZXJyO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHQpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztDQUFBO0NBQ08sTUFBTSxTQUFTLEdBQUcsYUFBYSxDQUFDO0FBQ3ZDO0NBQ08sTUFBTSxLQUFLLEdBQUc7Q0FDckIsQ0FBQywyQkFBMkI7Q0FDNUIsQ0FBQyxXQUFXO0NBQ1osQ0FBQyxlQUFlO0NBQ2hCLENBQUMsMEJBQTBCO0NBQzNCLENBQUMsYUFBYTtDQUNkLENBQUMsWUFBWTtDQUNiLENBQUMsbUJBQW1CO0NBQ3BCLENBQUMscUJBQXFCO0NBQ3RCLENBQUMsbUJBQW1CO0NBQ3BCLENBQUMsY0FBYztDQUNmLENBQUMsV0FBVztDQUNaLENBQUMsY0FBYztDQUNmLENBQUMsY0FBYztDQUNmLENBQUMsZUFBZTtDQUNoQixDQUFDLGNBQWM7Q0FDZixDQUFDLGNBQWM7Q0FDZixDQUFDLFlBQVk7Q0FDYixDQUFDLFlBQVk7Q0FDYixDQUFDLENBQUM7QUFFRjtDQUNPLE1BQU0sS0FBSyxHQUFHO0NBQ3JCLENBQUMsMkJBQTJCO0NBQzVCLENBQUMsbUNBQW1DO0NBQ3BDLENBQUMsNkJBQTZCO0NBQzlCLENBQUMsK0JBQStCO0NBQ2hDLENBQUMsNkJBQTZCO0NBQzlCLENBQUMsMEJBQTBCO0NBQzNCLENBQUMsd0JBQXdCO0NBQ3pCLENBQUMsK0JBQStCO0NBQ2hDLENBQUMsMEJBQTBCO0NBQzNCLENBQUMsMEJBQTBCO0NBQzNCLENBQUMsOEJBQThCO0NBQy9CLENBQUMsNkJBQTZCO0NBQzlCLENBQUMsaUNBQWlDO0NBQ2xDLENBQUMsOEJBQThCO0NBQy9CLENBQUMsNkJBQTZCO0NBQzlCLENBQUMsc0NBQXNDO0NBQ3ZDLENBQUMsa0NBQWtDO0NBQ25DLENBQUMsMkJBQTJCO0NBQzVCLENBQUMsMkJBQTJCO0NBQzVCLENBQUMsNEJBQTRCO0NBQzdCLENBQUMsMEJBQTBC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
