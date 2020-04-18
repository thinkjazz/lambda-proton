(function () {
	'use strict';

	// This file is generated by Sapper — do not edit it!
	const timestamp = 1587169245013;

	const files = [
		"service-worker-index.html",
		"alert.png",
		"badge.png",
		"breadcrumbs.png",
		"buttons.png",
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
		"client/client.e01c2178.js",
		"client/BreadcrumbItem.6a5eddcb.js",
		"client/CardBody.82a0f9e1.js",
		"client/CardHeader.e14b7ece.js",
		"client/CardText.7d52a439.js",
		"client/CardSubtitle.93921a41.js",
		"client/Row.70d32261.js",
		"client/CardFooter.3a346442.js",
		"client/Table.ed056033.js",
		"client/Image.9a2a3115.js",
		"client/index.a4e4ffe4.js",
		"client/Table.331bda4b.js",
		"client/AreaChart.5f2ae061.js",
		"client/BarChart.0cd2e8b1.js",
		"client/Progress.46053d46.js",
		"client/activity_log.92cd4d99.js",
		"client/FormGroup.2c07a6b6.js",
		"client/settings.93e14b25.js",
		"client/static_navigation.d47a610b.js",
		"client/light_sidenav.92bfc283.js",
		"client/charts.007e5cdb.js",
		"client/tables.25695c37.js",
		"client/_layout.48480d9a.js",
		"client/login.bfa7e791.js",
		"client/Col.6fdc56ee.js",
		"client/register.098455e4.js",
		"client/forget_password.c11b73e7.js",
		"client/_layout.80ed3159.js",
		"client/error_401.6873ccf6.js",
		"client/error_404.23c29d7b.js",
		"client/error_500.d3fe6c5a.js",
		"client/_layout.24904cc2.js",
		"client/index.bfb85ffc.js",
		"client/[slug].6a7e7459.js",
		"client/_layout.496b6bb1.js",
		"client/FormText.55a8fd11.js",
		"client/customInputs.dda90d4c.js",
		"client/ButtonGroup.1e9a55f6.js",
		"client/buttonGroup.e8e45cfb.js",
		"client/breadcrumb.1671bb56.js",
		"client/inputGroup.ddb9e84b.js",
		"client/Alert.e9943606.js",
		"client/Badge.6404da75.js",
		"client/index.bd4f1258.js",
		"client/ButtonToolbar.be3c0c28.js",
		"client/CardTitle.b6449f06.js",
		"client/CarouselCaption.ccadab00.js",
		"client/ModalHeader.deff2a3f.js",
		"client/UncontrolledCollapse.bd3dad53.js",
		"client/pagination.809e9705.js",
		"client/dropdowns.fc486700.js",
		"client/carousel.486ccab9.js",
		"client/collapse.bfa03ce1.js",
		"client/progress.223205bf.js",
		"client/spinners.e6fe528a.js",
		"client/template.3fa44dab.js",
		"client/buttons.f076fdd8.js",
		"client/alerts.5246a665.js",
		"client/navbar.85732b2f.js",
		"client/badge.695fe01c.js",
		"client/input.984fd852.js",
		"client/modal.8673833e.js",
		"client/card.8245b709.js",
		"client/grid.ff01bab5.js",
		"client/sapper-dev-client.89e34bae.js",
		"client/client.29c3bb39.js"
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS13b3JrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub2RlX21vZHVsZXMvQHNhcHBlci9zZXJ2aWNlLXdvcmtlci5qcyIsIi4uLy4uL3NyYy9zZXJ2aWNlLXdvcmtlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGJ5IFNhcHBlciDigJQgZG8gbm90IGVkaXQgaXQhXG5leHBvcnQgY29uc3QgdGltZXN0YW1wID0gMTU4NzE2OTI0NTAxMztcblxuZXhwb3J0IGNvbnN0IGZpbGVzID0gW1xuXHRcInNlcnZpY2Utd29ya2VyLWluZGV4Lmh0bWxcIixcblx0XCJhbGVydC5wbmdcIixcblx0XCJiYWRnZS5wbmdcIixcblx0XCJicmVhZGNydW1icy5wbmdcIixcblx0XCJidXR0b25zLnBuZ1wiLFxuXHRcImNoYXJ0LnBuZ1wiLFxuXHRcImRhc2hib2FyZC5wbmdcIixcblx0XCJlcnJvci00MDQtbW9ub2Nocm9tZS5zdmdcIixcblx0XCJmYXZpY29uLnBuZ1wiLFxuXHRcImdsb2JhbC5jc3NcIixcblx0XCJncmVhdC1zdWNjZXNzLnBuZ1wiLFxuXHRcImwtcHJvdG9uLWxvZ28tMi5wbmdcIixcblx0XCJsLXByb3Rvbi1sb2dvLnBuZ1wiLFxuXHRcImwtcHJvdG9uLmNzc1wiLFxuXHRcImxpZ2h0LnBuZ1wiLFxuXHRcImxvZ28tMTkyLnBuZ1wiLFxuXHRcImxvZ28tNTEyLnBuZ1wiLFxuXHRcIm1hbmlmZXN0Lmpzb25cIixcblx0XCJyZXNwb25zZS5wbmdcIixcblx0XCJzZXR0aW5ncy5wbmdcIixcblx0XCJzdGF0aWMucG5nXCIsXG5cdFwidGFibGVzLnBuZ1wiXG5dO1xuZXhwb3J0IHsgZmlsZXMgYXMgYXNzZXRzIH07IC8vIGxlZ2FjeVxuXG5leHBvcnQgY29uc3Qgc2hlbGwgPSBbXG5cdFwiY2xpZW50L2NsaWVudC5lMDFjMjE3OC5qc1wiLFxuXHRcImNsaWVudC9CcmVhZGNydW1iSXRlbS42YTVlZGRjYi5qc1wiLFxuXHRcImNsaWVudC9DYXJkQm9keS44MmEwZjllMS5qc1wiLFxuXHRcImNsaWVudC9DYXJkSGVhZGVyLmUxNGI3ZWNlLmpzXCIsXG5cdFwiY2xpZW50L0NhcmRUZXh0LjdkNTJhNDM5LmpzXCIsXG5cdFwiY2xpZW50L0NhcmRTdWJ0aXRsZS45MzkyMWE0MS5qc1wiLFxuXHRcImNsaWVudC9Sb3cuNzBkMzIyNjEuanNcIixcblx0XCJjbGllbnQvQ2FyZEZvb3Rlci4zYTM0NjQ0Mi5qc1wiLFxuXHRcImNsaWVudC9UYWJsZS5lZDA1NjAzMy5qc1wiLFxuXHRcImNsaWVudC9JbWFnZS45YTJhMzExNS5qc1wiLFxuXHRcImNsaWVudC9pbmRleC5hNGU0ZmZlNC5qc1wiLFxuXHRcImNsaWVudC9UYWJsZS4zMzFiZGE0Yi5qc1wiLFxuXHRcImNsaWVudC9BcmVhQ2hhcnQuNWYyYWUwNjEuanNcIixcblx0XCJjbGllbnQvQmFyQ2hhcnQuMGNkMmU4YjEuanNcIixcblx0XCJjbGllbnQvUHJvZ3Jlc3MuNDYwNTNkNDYuanNcIixcblx0XCJjbGllbnQvYWN0aXZpdHlfbG9nLjkyY2Q0ZDk5LmpzXCIsXG5cdFwiY2xpZW50L0Zvcm1Hcm91cC4yYzA3YTZiNi5qc1wiLFxuXHRcImNsaWVudC9zZXR0aW5ncy45M2UxNGIyNS5qc1wiLFxuXHRcImNsaWVudC9zdGF0aWNfbmF2aWdhdGlvbi5kNDdhNjEwYi5qc1wiLFxuXHRcImNsaWVudC9saWdodF9zaWRlbmF2LjkyYmZjMjgzLmpzXCIsXG5cdFwiY2xpZW50L2NoYXJ0cy4wMDdlNWNkYi5qc1wiLFxuXHRcImNsaWVudC90YWJsZXMuMjU2OTVjMzcuanNcIixcblx0XCJjbGllbnQvX2xheW91dC40ODQ4MGQ5YS5qc1wiLFxuXHRcImNsaWVudC9sb2dpbi5iZmE3ZTc5MS5qc1wiLFxuXHRcImNsaWVudC9Db2wuNmZkYzU2ZWUuanNcIixcblx0XCJjbGllbnQvcmVnaXN0ZXIuMDk4NDU1ZTQuanNcIixcblx0XCJjbGllbnQvZm9yZ2V0X3Bhc3N3b3JkLmMxMWI3M2U3LmpzXCIsXG5cdFwiY2xpZW50L19sYXlvdXQuODBlZDMxNTkuanNcIixcblx0XCJjbGllbnQvZXJyb3JfNDAxLjY4NzNjY2Y2LmpzXCIsXG5cdFwiY2xpZW50L2Vycm9yXzQwNC4yM2MyOWQ3Yi5qc1wiLFxuXHRcImNsaWVudC9lcnJvcl81MDAuZDNmZTZjNWEuanNcIixcblx0XCJjbGllbnQvX2xheW91dC4yNDkwNGNjMi5qc1wiLFxuXHRcImNsaWVudC9pbmRleC5iZmI4NWZmYy5qc1wiLFxuXHRcImNsaWVudC9bc2x1Z10uNmE3ZTc0NTkuanNcIixcblx0XCJjbGllbnQvX2xheW91dC40OTZiNmJiMS5qc1wiLFxuXHRcImNsaWVudC9Gb3JtVGV4dC41NWE4ZmQxMS5qc1wiLFxuXHRcImNsaWVudC9jdXN0b21JbnB1dHMuZGRhOTBkNGMuanNcIixcblx0XCJjbGllbnQvQnV0dG9uR3JvdXAuMWU5YTU1ZjYuanNcIixcblx0XCJjbGllbnQvYnV0dG9uR3JvdXAuZThlNDVjZmIuanNcIixcblx0XCJjbGllbnQvYnJlYWRjcnVtYi4xNjcxYmI1Ni5qc1wiLFxuXHRcImNsaWVudC9pbnB1dEdyb3VwLmRkYjllODRiLmpzXCIsXG5cdFwiY2xpZW50L0FsZXJ0LmU5OTQzNjA2LmpzXCIsXG5cdFwiY2xpZW50L0JhZGdlLjY0MDRkYTc1LmpzXCIsXG5cdFwiY2xpZW50L2luZGV4LmJkNGYxMjU4LmpzXCIsXG5cdFwiY2xpZW50L0J1dHRvblRvb2xiYXIuYmUzYzBjMjguanNcIixcblx0XCJjbGllbnQvQ2FyZFRpdGxlLmI2NDQ5ZjA2LmpzXCIsXG5cdFwiY2xpZW50L0Nhcm91c2VsQ2FwdGlvbi5jY2FkYWIwMC5qc1wiLFxuXHRcImNsaWVudC9Nb2RhbEhlYWRlci5kZWZmMmEzZi5qc1wiLFxuXHRcImNsaWVudC9VbmNvbnRyb2xsZWRDb2xsYXBzZS5iZDNkYWQ1My5qc1wiLFxuXHRcImNsaWVudC9wYWdpbmF0aW9uLjgwOWU5NzA1LmpzXCIsXG5cdFwiY2xpZW50L2Ryb3Bkb3ducy5mYzQ4NjcwMC5qc1wiLFxuXHRcImNsaWVudC9jYXJvdXNlbC40ODZjY2FiOS5qc1wiLFxuXHRcImNsaWVudC9jb2xsYXBzZS5iZmEwM2NlMS5qc1wiLFxuXHRcImNsaWVudC9wcm9ncmVzcy4yMjMyMDViZi5qc1wiLFxuXHRcImNsaWVudC9zcGlubmVycy5lNmZlNTI4YS5qc1wiLFxuXHRcImNsaWVudC90ZW1wbGF0ZS4zZmE0NGRhYi5qc1wiLFxuXHRcImNsaWVudC9idXR0b25zLmYwNzZmZGQ4LmpzXCIsXG5cdFwiY2xpZW50L2FsZXJ0cy41MjQ2YTY2NS5qc1wiLFxuXHRcImNsaWVudC9uYXZiYXIuODU3MzJiMmYuanNcIixcblx0XCJjbGllbnQvYmFkZ2UuNjk1ZmUwMWMuanNcIixcblx0XCJjbGllbnQvaW5wdXQuOTg0ZmQ4NTIuanNcIixcblx0XCJjbGllbnQvbW9kYWwuODY3MzgzM2UuanNcIixcblx0XCJjbGllbnQvY2FyZC44MjQ1YjcwOS5qc1wiLFxuXHRcImNsaWVudC9ncmlkLmZmMDFiYWI1LmpzXCIsXG5cdFwiY2xpZW50L3NhcHBlci1kZXYtY2xpZW50Ljg5ZTM0YmFlLmpzXCIsXG5cdFwiY2xpZW50L2NsaWVudC4yOWMzYmIzOS5qc1wiXG5dO1xuXG5leHBvcnQgY29uc3Qgcm91dGVzID0gW1xuXHR7IHBhdHRlcm46IC9eXFwvJC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL2FjdGl2aXR5X2xvZ1xcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvc2V0dGluZ3NcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL2xheW91dHNcXC9zdGF0aWNfbmF2aWdhdGlvblxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvbGF5b3V0c1xcL2xpZ2h0X3NpZGVuYXZcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL2NoYXJ0c1xcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvdGFibGVzXFwvPyQvIH0sXG5cdHsgcGF0dGVybjogL15cXC9wYWdlc1xcL2F1dGhlbnRpY2F0aW9uXFwvZm9yZ2V0X3Bhc3N3b3JkXFwvPyQvIH0sXG5cdHsgcGF0dGVybjogL15cXC9wYWdlc1xcL2F1dGhlbnRpY2F0aW9uXFwvcmVnaXN0ZXJcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL3BhZ2VzXFwvYXV0aGVudGljYXRpb25cXC9sb2dpblxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvcGFnZXNcXC9lcnJvclxcL2Vycm9yXzQwMVxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvcGFnZXNcXC9lcnJvclxcL2Vycm9yXzQwNFxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvcGFnZXNcXC9lcnJvclxcL2Vycm9yXzUwMFxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvYmxvZ1xcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvYmxvZ1xcLyhbXlxcL10rPylcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL3VpXFwvY3VzdG9tSW5wdXRzXFwvPyQvIH0sXG5cdHsgcGF0dGVybjogL15cXC91aVxcL2J1dHRvbkdyb3VwXFwvPyQvIH0sXG5cdHsgcGF0dGVybjogL15cXC91aVxcL2JyZWFkY3J1bWJcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL3VpXFwvaW5wdXRHcm91cFxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvdWlcXC9wYWdpbmF0aW9uXFwvPyQvIH0sXG5cdHsgcGF0dGVybjogL15cXC91aVxcL2Ryb3Bkb3duc1xcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvdWlcXC9jYXJvdXNlbFxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvdWlcXC9jb2xsYXBzZVxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvdWlcXC9wcm9ncmVzc1xcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvdWlcXC9zcGlubmVyc1xcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvdWlcXC90ZW1wbGF0ZVxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvdWlcXC9idXR0b25zXFwvPyQvIH0sXG5cdHsgcGF0dGVybjogL15cXC91aVxcL2FsZXJ0c1xcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvdWlcXC9uYXZiYXJcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL3VpXFwvYmFkZ2VcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL3VpXFwvaW5wdXRcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL3VpXFwvbW9kYWxcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL3VpXFwvY2FyZFxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvdWlcXC9ncmlkXFwvPyQvIH1cbl07IiwiaW1wb3J0IHsgdGltZXN0YW1wLCBmaWxlcywgc2hlbGwsIHJvdXRlcyB9IGZyb20gJ0BzYXBwZXIvc2VydmljZS13b3JrZXInO1xuXG5jb25zdCBBU1NFVFMgPSBgY2FjaGUke3RpbWVzdGFtcH1gO1xuXG4vLyBgc2hlbGxgIGlzIGFuIGFycmF5IG9mIGFsbCB0aGUgZmlsZXMgZ2VuZXJhdGVkIGJ5IHRoZSBidW5kbGVyLFxuLy8gYGZpbGVzYCBpcyBhbiBhcnJheSBvZiBldmVyeXRoaW5nIGluIHRoZSBgc3RhdGljYCBkaXJlY3RvcnlcbmNvbnN0IHRvX2NhY2hlID0gc2hlbGwuY29uY2F0KGZpbGVzKTtcbmNvbnN0IGNhY2hlZCA9IG5ldyBTZXQodG9fY2FjaGUpO1xuXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ2luc3RhbGwnLCBldmVudCA9PiB7XG5cdGV2ZW50LndhaXRVbnRpbChcblx0XHRjYWNoZXNcblx0XHRcdC5vcGVuKEFTU0VUUylcblx0XHRcdC50aGVuKGNhY2hlID0+IGNhY2hlLmFkZEFsbCh0b19jYWNoZSkpXG5cdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdHNlbGYuc2tpcFdhaXRpbmcoKTtcblx0XHRcdH0pXG5cdCk7XG59KTtcblxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdhY3RpdmF0ZScsIGV2ZW50ID0+IHtcblx0ZXZlbnQud2FpdFVudGlsKFxuXHRcdGNhY2hlcy5rZXlzKCkudGhlbihhc3luYyBrZXlzID0+IHtcblx0XHRcdC8vIGRlbGV0ZSBvbGQgY2FjaGVzXG5cdFx0XHRmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7XG5cdFx0XHRcdGlmIChrZXkgIT09IEFTU0VUUykgYXdhaXQgY2FjaGVzLmRlbGV0ZShrZXkpO1xuXHRcdFx0fVxuXG5cdFx0XHRzZWxmLmNsaWVudHMuY2xhaW0oKTtcblx0XHR9KVxuXHQpO1xufSk7XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignZmV0Y2gnLCBldmVudCA9PiB7XG5cdGlmIChldmVudC5yZXF1ZXN0Lm1ldGhvZCAhPT0gJ0dFVCcgfHwgZXZlbnQucmVxdWVzdC5oZWFkZXJzLmhhcygncmFuZ2UnKSkgcmV0dXJuO1xuXG5cdGNvbnN0IHVybCA9IG5ldyBVUkwoZXZlbnQucmVxdWVzdC51cmwpO1xuXG5cdC8vIGRvbid0IHRyeSB0byBoYW5kbGUgZS5nLiBkYXRhOiBVUklzXG5cdGlmICghdXJsLnByb3RvY29sLnN0YXJ0c1dpdGgoJ2h0dHAnKSkgcmV0dXJuO1xuXG5cdC8vIGlnbm9yZSBkZXYgc2VydmVyIHJlcXVlc3RzXG5cdGlmICh1cmwuaG9zdG5hbWUgPT09IHNlbGYubG9jYXRpb24uaG9zdG5hbWUgJiYgdXJsLnBvcnQgIT09IHNlbGYubG9jYXRpb24ucG9ydCkgcmV0dXJuO1xuXG5cdC8vIGFsd2F5cyBzZXJ2ZSBzdGF0aWMgZmlsZXMgYW5kIGJ1bmRsZXItZ2VuZXJhdGVkIGFzc2V0cyBmcm9tIGNhY2hlXG5cdGlmICh1cmwuaG9zdCA9PT0gc2VsZi5sb2NhdGlvbi5ob3N0ICYmIGNhY2hlZC5oYXModXJsLnBhdGhuYW1lKSkge1xuXHRcdGV2ZW50LnJlc3BvbmRXaXRoKGNhY2hlcy5tYXRjaChldmVudC5yZXF1ZXN0KSk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gZm9yIHBhZ2VzLCB5b3UgbWlnaHQgd2FudCB0byBzZXJ2ZSBhIHNoZWxsIGBzZXJ2aWNlLXdvcmtlci1pbmRleC5odG1sYCBmaWxlLFxuXHQvLyB3aGljaCBTYXBwZXIgaGFzIGdlbmVyYXRlZCBmb3IgeW91LiBJdCdzIG5vdCByaWdodCBmb3IgZXZlcnlcblx0Ly8gYXBwLCBidXQgaWYgaXQncyByaWdodCBmb3IgeW91cnMgdGhlbiB1bmNvbW1lbnQgdGhpcyBzZWN0aW9uXG5cdC8qXG5cdGlmICh1cmwub3JpZ2luID09PSBzZWxmLm9yaWdpbiAmJiByb3V0ZXMuZmluZChyb3V0ZSA9PiByb3V0ZS5wYXR0ZXJuLnRlc3QodXJsLnBhdGhuYW1lKSkpIHtcblx0XHRldmVudC5yZXNwb25kV2l0aChjYWNoZXMubWF0Y2goJy9zZXJ2aWNlLXdvcmtlci1pbmRleC5odG1sJykpO1xuXHRcdHJldHVybjtcblx0fVxuXHQqL1xuXG5cdGlmIChldmVudC5yZXF1ZXN0LmNhY2hlID09PSAnb25seS1pZi1jYWNoZWQnKSByZXR1cm47XG5cblx0Ly8gZm9yIGV2ZXJ5dGhpbmcgZWxzZSwgdHJ5IHRoZSBuZXR3b3JrIGZpcnN0LCBmYWxsaW5nIGJhY2sgdG9cblx0Ly8gY2FjaGUgaWYgdGhlIHVzZXIgaXMgb2ZmbGluZS4gKElmIHRoZSBwYWdlcyBuZXZlciBjaGFuZ2UsIHlvdVxuXHQvLyBtaWdodCBwcmVmZXIgYSBjYWNoZS1maXJzdCBhcHByb2FjaCB0byBhIG5ldHdvcmstZmlyc3Qgb25lLilcblx0ZXZlbnQucmVzcG9uZFdpdGgoXG5cdFx0Y2FjaGVzXG5cdFx0XHQub3Blbihgb2ZmbGluZSR7dGltZXN0YW1wfWApXG5cdFx0XHQudGhlbihhc3luYyBjYWNoZSA9PiB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChldmVudC5yZXF1ZXN0KTtcblx0XHRcdFx0XHRjYWNoZS5wdXQoZXZlbnQucmVxdWVzdCwgcmVzcG9uc2UuY2xvbmUoKSk7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlO1xuXHRcdFx0XHR9IGNhdGNoKGVycikge1xuXHRcdFx0XHRcdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgY2FjaGUubWF0Y2goZXZlbnQucmVxdWVzdCk7XG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlKSByZXR1cm4gcmVzcG9uc2U7XG5cblx0XHRcdFx0XHR0aHJvdyBlcnI7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdCk7XG59KTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Q0FBQTtDQUNPLE1BQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQztBQUN2QztDQUNPLE1BQU0sS0FBSyxHQUFHO0NBQ3JCLENBQUMsMkJBQTJCO0NBQzVCLENBQUMsV0FBVztDQUNaLENBQUMsV0FBVztDQUNaLENBQUMsaUJBQWlCO0NBQ2xCLENBQUMsYUFBYTtDQUNkLENBQUMsV0FBVztDQUNaLENBQUMsZUFBZTtDQUNoQixDQUFDLDBCQUEwQjtDQUMzQixDQUFDLGFBQWE7Q0FDZCxDQUFDLFlBQVk7Q0FDYixDQUFDLG1CQUFtQjtDQUNwQixDQUFDLHFCQUFxQjtDQUN0QixDQUFDLG1CQUFtQjtDQUNwQixDQUFDLGNBQWM7Q0FDZixDQUFDLFdBQVc7Q0FDWixDQUFDLGNBQWM7Q0FDZixDQUFDLGNBQWM7Q0FDZixDQUFDLGVBQWU7Q0FDaEIsQ0FBQyxjQUFjO0NBQ2YsQ0FBQyxjQUFjO0NBQ2YsQ0FBQyxZQUFZO0NBQ2IsQ0FBQyxZQUFZO0NBQ2IsQ0FBQyxDQUFDO0FBRUY7Q0FDTyxNQUFNLEtBQUssR0FBRztDQUNyQixDQUFDLDJCQUEyQjtDQUM1QixDQUFDLG1DQUFtQztDQUNwQyxDQUFDLDZCQUE2QjtDQUM5QixDQUFDLCtCQUErQjtDQUNoQyxDQUFDLDZCQUE2QjtDQUM5QixDQUFDLGlDQUFpQztDQUNsQyxDQUFDLHdCQUF3QjtDQUN6QixDQUFDLCtCQUErQjtDQUNoQyxDQUFDLDBCQUEwQjtDQUMzQixDQUFDLDBCQUEwQjtDQUMzQixDQUFDLDBCQUEwQjtDQUMzQixDQUFDLDBCQUEwQjtDQUMzQixDQUFDLDhCQUE4QjtDQUMvQixDQUFDLDZCQUE2QjtDQUM5QixDQUFDLDZCQUE2QjtDQUM5QixDQUFDLGlDQUFpQztDQUNsQyxDQUFDLDhCQUE4QjtD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
