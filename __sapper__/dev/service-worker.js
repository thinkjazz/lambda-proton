(function () {
	'use strict';

	// This file is generated by Sapper — do not edit it!
	const timestamp = 1586533906101;

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
		"client/client.4ee71700.js",
		"client/BreadcrumbItem.08290b2d.js",
		"client/CardBody.e32f9c1c.js",
		"client/CardHeader.7858bd55.js",
		"client/CardText.445ace6d.js",
		"client/CardSubtitle.5cce5197.js",
		"client/Row.7b1addc2.js",
		"client/CardFooter.041753b6.js",
		"client/Table.f4472d5d.js",
		"client/Image.f1ffaa98.js",
		"client/index.170a5512.js",
		"client/Table.6a494312.js",
		"client/AreaChart.39afb094.js",
		"client/BarChart.00da2b0e.js",
		"client/Progress.d76c25b1.js",
		"client/activity_log.831b8400.js",
		"client/FormGroup.1f0e117d.js",
		"client/settings.399c5e7e.js",
		"client/static_navigation.b37d33d0.js",
		"client/light_sidenav.2fbe5762.js",
		"client/charts.96db7542.js",
		"client/tables.fc8b6bd5.js",
		"client/_layout.8fae463c.js",
		"client/login.8b25941a.js",
		"client/Col.94cdb5d5.js",
		"client/register.a0c3a667.js",
		"client/forget_password.f1dca0cf.js",
		"client/_layout.daa6b646.js",
		"client/error_401.f9e0e37c.js",
		"client/error_404.6ef670ac.js",
		"client/error_500.fbea910b.js",
		"client/_layout.68ee77d9.js",
		"client/index.15f2e86c.js",
		"client/[slug].0954a89a.js",
		"client/_layout.731cabd3.js",
		"client/FormText.14571047.js",
		"client/customInputs.c62aad97.js",
		"client/ButtonGroup.bb1ddae3.js",
		"client/buttonGroup.a0ed2c8a.js",
		"client/breadcrumb.9050b05e.js",
		"client/inputGroup.72171e10.js",
		"client/Alert.d077d584.js",
		"client/Badge.7904ee23.js",
		"client/index.01fde197.js",
		"client/ButtonToolbar.fc0ad370.js",
		"client/CardTitle.ddba24d4.js",
		"client/CarouselCaption.a1e9b89b.js",
		"client/ModalHeader.da561fa9.js",
		"client/UncontrolledCollapse.825ee945.js",
		"client/pagination.2d22ee46.js",
		"client/dropdowns.1caa1193.js",
		"client/carousel.a1916407.js",
		"client/collapse.43252171.js",
		"client/progress.5585c0e9.js",
		"client/spinners.bf62925c.js",
		"client/template.2e6c6a31.js",
		"client/buttons.74995042.js",
		"client/alerts.a4829778.js",
		"client/navbar.65c905a8.js",
		"client/badge.7980339e.js",
		"client/input.7120b660.js",
		"client/modal.b9adf504.js",
		"client/card.2f88c561.js",
		"client/grid.5412e321.js",
		"client/sapper-dev-client.89e34bae.js",
		"client/client.258a3077.js"
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS13b3JrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub2RlX21vZHVsZXMvQHNhcHBlci9zZXJ2aWNlLXdvcmtlci5qcyIsIi4uLy4uL3NyYy9zZXJ2aWNlLXdvcmtlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGJ5IFNhcHBlciDigJQgZG8gbm90IGVkaXQgaXQhXG5leHBvcnQgY29uc3QgdGltZXN0YW1wID0gMTU4NjUzMzkwNjEwMTtcblxuZXhwb3J0IGNvbnN0IGZpbGVzID0gW1xuXHRcInNlcnZpY2Utd29ya2VyLWluZGV4Lmh0bWxcIixcblx0XCJhbGVydC5wbmdcIixcblx0XCJiYWRnZS5wbmdcIixcblx0XCJicmVhZGNydW1icy5wbmdcIixcblx0XCJidXR0b25zLnBuZ1wiLFxuXHRcImNoYXJ0LnBuZ1wiLFxuXHRcImRhc2hib2FyZC5wbmdcIixcblx0XCJlcnJvci00MDQtbW9ub2Nocm9tZS5zdmdcIixcblx0XCJmYXZpY29uLnBuZ1wiLFxuXHRcImdsb2JhbC5jc3NcIixcblx0XCJncmVhdC1zdWNjZXNzLnBuZ1wiLFxuXHRcImwtcHJvdG9uLWxvZ28tMi5wbmdcIixcblx0XCJsLXByb3Rvbi1sb2dvLnBuZ1wiLFxuXHRcImwtcHJvdG9uLmNzc1wiLFxuXHRcImxpZ2h0LnBuZ1wiLFxuXHRcImxvZ28tMTkyLnBuZ1wiLFxuXHRcImxvZ28tNTEyLnBuZ1wiLFxuXHRcIm1hbmlmZXN0Lmpzb25cIixcblx0XCJyZXNwb25zZS5wbmdcIixcblx0XCJzZXR0aW5ncy5wbmdcIixcblx0XCJzdGF0aWMucG5nXCIsXG5cdFwidGFibGVzLnBuZ1wiXG5dO1xuZXhwb3J0IHsgZmlsZXMgYXMgYXNzZXRzIH07IC8vIGxlZ2FjeVxuXG5leHBvcnQgY29uc3Qgc2hlbGwgPSBbXG5cdFwiY2xpZW50L2NsaWVudC40ZWU3MTcwMC5qc1wiLFxuXHRcImNsaWVudC9CcmVhZGNydW1iSXRlbS4wODI5MGIyZC5qc1wiLFxuXHRcImNsaWVudC9DYXJkQm9keS5lMzJmOWMxYy5qc1wiLFxuXHRcImNsaWVudC9DYXJkSGVhZGVyLjc4NThiZDU1LmpzXCIsXG5cdFwiY2xpZW50L0NhcmRUZXh0LjQ0NWFjZTZkLmpzXCIsXG5cdFwiY2xpZW50L0NhcmRTdWJ0aXRsZS41Y2NlNTE5Ny5qc1wiLFxuXHRcImNsaWVudC9Sb3cuN2IxYWRkYzIuanNcIixcblx0XCJjbGllbnQvQ2FyZEZvb3Rlci4wNDE3NTNiNi5qc1wiLFxuXHRcImNsaWVudC9UYWJsZS5mNDQ3MmQ1ZC5qc1wiLFxuXHRcImNsaWVudC9JbWFnZS5mMWZmYWE5OC5qc1wiLFxuXHRcImNsaWVudC9pbmRleC4xNzBhNTUxMi5qc1wiLFxuXHRcImNsaWVudC9UYWJsZS42YTQ5NDMxMi5qc1wiLFxuXHRcImNsaWVudC9BcmVhQ2hhcnQuMzlhZmIwOTQuanNcIixcblx0XCJjbGllbnQvQmFyQ2hhcnQuMDBkYTJiMGUuanNcIixcblx0XCJjbGllbnQvUHJvZ3Jlc3MuZDc2YzI1YjEuanNcIixcblx0XCJjbGllbnQvYWN0aXZpdHlfbG9nLjgzMWI4NDAwLmpzXCIsXG5cdFwiY2xpZW50L0Zvcm1Hcm91cC4xZjBlMTE3ZC5qc1wiLFxuXHRcImNsaWVudC9zZXR0aW5ncy4zOTljNWU3ZS5qc1wiLFxuXHRcImNsaWVudC9zdGF0aWNfbmF2aWdhdGlvbi5iMzdkMzNkMC5qc1wiLFxuXHRcImNsaWVudC9saWdodF9zaWRlbmF2LjJmYmU1NzYyLmpzXCIsXG5cdFwiY2xpZW50L2NoYXJ0cy45NmRiNzU0Mi5qc1wiLFxuXHRcImNsaWVudC90YWJsZXMuZmM4YjZiZDUuanNcIixcblx0XCJjbGllbnQvX2xheW91dC44ZmFlNDYzYy5qc1wiLFxuXHRcImNsaWVudC9sb2dpbi44YjI1OTQxYS5qc1wiLFxuXHRcImNsaWVudC9Db2wuOTRjZGI1ZDUuanNcIixcblx0XCJjbGllbnQvcmVnaXN0ZXIuYTBjM2E2NjcuanNcIixcblx0XCJjbGllbnQvZm9yZ2V0X3Bhc3N3b3JkLmYxZGNhMGNmLmpzXCIsXG5cdFwiY2xpZW50L19sYXlvdXQuZGFhNmI2NDYuanNcIixcblx0XCJjbGllbnQvZXJyb3JfNDAxLmY5ZTBlMzdjLmpzXCIsXG5cdFwiY2xpZW50L2Vycm9yXzQwNC42ZWY2NzBhYy5qc1wiLFxuXHRcImNsaWVudC9lcnJvcl81MDAuZmJlYTkxMGIuanNcIixcblx0XCJjbGllbnQvX2xheW91dC42OGVlNzdkOS5qc1wiLFxuXHRcImNsaWVudC9pbmRleC4xNWYyZTg2Yy5qc1wiLFxuXHRcImNsaWVudC9bc2x1Z10uMDk1NGE4OWEuanNcIixcblx0XCJjbGllbnQvX2xheW91dC43MzFjYWJkMy5qc1wiLFxuXHRcImNsaWVudC9Gb3JtVGV4dC4xNDU3MTA0Ny5qc1wiLFxuXHRcImNsaWVudC9jdXN0b21JbnB1dHMuYzYyYWFkOTcuanNcIixcblx0XCJjbGllbnQvQnV0dG9uR3JvdXAuYmIxZGRhZTMuanNcIixcblx0XCJjbGllbnQvYnV0dG9uR3JvdXAuYTBlZDJjOGEuanNcIixcblx0XCJjbGllbnQvYnJlYWRjcnVtYi45MDUwYjA1ZS5qc1wiLFxuXHRcImNsaWVudC9pbnB1dEdyb3VwLjcyMTcxZTEwLmpzXCIsXG5cdFwiY2xpZW50L0FsZXJ0LmQwNzdkNTg0LmpzXCIsXG5cdFwiY2xpZW50L0JhZGdlLjc5MDRlZTIzLmpzXCIsXG5cdFwiY2xpZW50L2luZGV4LjAxZmRlMTk3LmpzXCIsXG5cdFwiY2xpZW50L0J1dHRvblRvb2xiYXIuZmMwYWQzNzAuanNcIixcblx0XCJjbGllbnQvQ2FyZFRpdGxlLmRkYmEyNGQ0LmpzXCIsXG5cdFwiY2xpZW50L0Nhcm91c2VsQ2FwdGlvbi5hMWU5Yjg5Yi5qc1wiLFxuXHRcImNsaWVudC9Nb2RhbEhlYWRlci5kYTU2MWZhOS5qc1wiLFxuXHRcImNsaWVudC9VbmNvbnRyb2xsZWRDb2xsYXBzZS44MjVlZTk0NS5qc1wiLFxuXHRcImNsaWVudC9wYWdpbmF0aW9uLjJkMjJlZTQ2LmpzXCIsXG5cdFwiY2xpZW50L2Ryb3Bkb3ducy4xY2FhMTE5My5qc1wiLFxuXHRcImNsaWVudC9jYXJvdXNlbC5hMTkxNjQwNy5qc1wiLFxuXHRcImNsaWVudC9jb2xsYXBzZS40MzI1MjE3MS5qc1wiLFxuXHRcImNsaWVudC9wcm9ncmVzcy41NTg1YzBlOS5qc1wiLFxuXHRcImNsaWVudC9zcGlubmVycy5iZjYyOTI1Yy5qc1wiLFxuXHRcImNsaWVudC90ZW1wbGF0ZS4yZTZjNmEzMS5qc1wiLFxuXHRcImNsaWVudC9idXR0b25zLjc0OTk1MDQyLmpzXCIsXG5cdFwiY2xpZW50L2FsZXJ0cy5hNDgyOTc3OC5qc1wiLFxuXHRcImNsaWVudC9uYXZiYXIuNjVjOTA1YTguanNcIixcblx0XCJjbGllbnQvYmFkZ2UuNzk4MDMzOWUuanNcIixcblx0XCJjbGllbnQvaW5wdXQuNzEyMGI2NjAuanNcIixcblx0XCJjbGllbnQvbW9kYWwuYjlhZGY1MDQuanNcIixcblx0XCJjbGllbnQvY2FyZC4yZjg4YzU2MS5qc1wiLFxuXHRcImNsaWVudC9ncmlkLjU0MTJlMzIxLmpzXCIsXG5cdFwiY2xpZW50L3NhcHBlci1kZXYtY2xpZW50Ljg5ZTM0YmFlLmpzXCIsXG5cdFwiY2xpZW50L2NsaWVudC4yNThhMzA3Ny5qc1wiXG5dO1xuXG5leHBvcnQgY29uc3Qgcm91dGVzID0gW1xuXHR7IHBhdHRlcm46IC9eXFwvJC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL2FjdGl2aXR5X2xvZ1xcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvc2V0dGluZ3NcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL2xheW91dHNcXC9zdGF0aWNfbmF2aWdhdGlvblxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvbGF5b3V0c1xcL2xpZ2h0X3NpZGVuYXZcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL2NoYXJ0c1xcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvdGFibGVzXFwvPyQvIH0sXG5cdHsgcGF0dGVybjogL15cXC9wYWdlc1xcL2F1dGhlbnRpY2F0aW9uXFwvZm9yZ2V0X3Bhc3N3b3JkXFwvPyQvIH0sXG5cdHsgcGF0dGVybjogL15cXC9wYWdlc1xcL2F1dGhlbnRpY2F0aW9uXFwvcmVnaXN0ZXJcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL3BhZ2VzXFwvYXV0aGVudGljYXRpb25cXC9sb2dpblxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvcGFnZXNcXC9lcnJvclxcL2Vycm9yXzQwMVxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvcGFnZXNcXC9lcnJvclxcL2Vycm9yXzQwNFxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvcGFnZXNcXC9lcnJvclxcL2Vycm9yXzUwMFxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvYmxvZ1xcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvYmxvZ1xcLyhbXlxcL10rPylcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL3VpXFwvY3VzdG9tSW5wdXRzXFwvPyQvIH0sXG5cdHsgcGF0dGVybjogL15cXC91aVxcL2J1dHRvbkdyb3VwXFwvPyQvIH0sXG5cdHsgcGF0dGVybjogL15cXC91aVxcL2JyZWFkY3J1bWJcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL3VpXFwvaW5wdXRHcm91cFxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvdWlcXC9wYWdpbmF0aW9uXFwvPyQvIH0sXG5cdHsgcGF0dGVybjogL15cXC91aVxcL2Ryb3Bkb3duc1xcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvdWlcXC9jYXJvdXNlbFxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvdWlcXC9jb2xsYXBzZVxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvdWlcXC9wcm9ncmVzc1xcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvdWlcXC9zcGlubmVyc1xcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvdWlcXC90ZW1wbGF0ZVxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvdWlcXC9idXR0b25zXFwvPyQvIH0sXG5cdHsgcGF0dGVybjogL15cXC91aVxcL2FsZXJ0c1xcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvdWlcXC9uYXZiYXJcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL3VpXFwvYmFkZ2VcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL3VpXFwvaW5wdXRcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL3VpXFwvbW9kYWxcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL3VpXFwvY2FyZFxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvdWlcXC9ncmlkXFwvPyQvIH1cbl07IiwiaW1wb3J0IHsgdGltZXN0YW1wLCBmaWxlcywgc2hlbGwsIHJvdXRlcyB9IGZyb20gJ0BzYXBwZXIvc2VydmljZS13b3JrZXInO1xuXG5jb25zdCBBU1NFVFMgPSBgY2FjaGUke3RpbWVzdGFtcH1gO1xuXG4vLyBgc2hlbGxgIGlzIGFuIGFycmF5IG9mIGFsbCB0aGUgZmlsZXMgZ2VuZXJhdGVkIGJ5IHRoZSBidW5kbGVyLFxuLy8gYGZpbGVzYCBpcyBhbiBhcnJheSBvZiBldmVyeXRoaW5nIGluIHRoZSBgc3RhdGljYCBkaXJlY3RvcnlcbmNvbnN0IHRvX2NhY2hlID0gc2hlbGwuY29uY2F0KGZpbGVzKTtcbmNvbnN0IGNhY2hlZCA9IG5ldyBTZXQodG9fY2FjaGUpO1xuXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ2luc3RhbGwnLCBldmVudCA9PiB7XG5cdGV2ZW50LndhaXRVbnRpbChcblx0XHRjYWNoZXNcblx0XHRcdC5vcGVuKEFTU0VUUylcblx0XHRcdC50aGVuKGNhY2hlID0+IGNhY2hlLmFkZEFsbCh0b19jYWNoZSkpXG5cdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdHNlbGYuc2tpcFdhaXRpbmcoKTtcblx0XHRcdH0pXG5cdCk7XG59KTtcblxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdhY3RpdmF0ZScsIGV2ZW50ID0+IHtcblx0ZXZlbnQud2FpdFVudGlsKFxuXHRcdGNhY2hlcy5rZXlzKCkudGhlbihhc3luYyBrZXlzID0+IHtcblx0XHRcdC8vIGRlbGV0ZSBvbGQgY2FjaGVzXG5cdFx0XHRmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7XG5cdFx0XHRcdGlmIChrZXkgIT09IEFTU0VUUykgYXdhaXQgY2FjaGVzLmRlbGV0ZShrZXkpO1xuXHRcdFx0fVxuXG5cdFx0XHRzZWxmLmNsaWVudHMuY2xhaW0oKTtcblx0XHR9KVxuXHQpO1xufSk7XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignZmV0Y2gnLCBldmVudCA9PiB7XG5cdGlmIChldmVudC5yZXF1ZXN0Lm1ldGhvZCAhPT0gJ0dFVCcgfHwgZXZlbnQucmVxdWVzdC5oZWFkZXJzLmhhcygncmFuZ2UnKSkgcmV0dXJuO1xuXG5cdGNvbnN0IHVybCA9IG5ldyBVUkwoZXZlbnQucmVxdWVzdC51cmwpO1xuXG5cdC8vIGRvbid0IHRyeSB0byBoYW5kbGUgZS5nLiBkYXRhOiBVUklzXG5cdGlmICghdXJsLnByb3RvY29sLnN0YXJ0c1dpdGgoJ2h0dHAnKSkgcmV0dXJuO1xuXG5cdC8vIGlnbm9yZSBkZXYgc2VydmVyIHJlcXVlc3RzXG5cdGlmICh1cmwuaG9zdG5hbWUgPT09IHNlbGYubG9jYXRpb24uaG9zdG5hbWUgJiYgdXJsLnBvcnQgIT09IHNlbGYubG9jYXRpb24ucG9ydCkgcmV0dXJuO1xuXG5cdC8vIGFsd2F5cyBzZXJ2ZSBzdGF0aWMgZmlsZXMgYW5kIGJ1bmRsZXItZ2VuZXJhdGVkIGFzc2V0cyBmcm9tIGNhY2hlXG5cdGlmICh1cmwuaG9zdCA9PT0gc2VsZi5sb2NhdGlvbi5ob3N0ICYmIGNhY2hlZC5oYXModXJsLnBhdGhuYW1lKSkge1xuXHRcdGV2ZW50LnJlc3BvbmRXaXRoKGNhY2hlcy5tYXRjaChldmVudC5yZXF1ZXN0KSk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gZm9yIHBhZ2VzLCB5b3UgbWlnaHQgd2FudCB0byBzZXJ2ZSBhIHNoZWxsIGBzZXJ2aWNlLXdvcmtlci1pbmRleC5odG1sYCBmaWxlLFxuXHQvLyB3aGljaCBTYXBwZXIgaGFzIGdlbmVyYXRlZCBmb3IgeW91LiBJdCdzIG5vdCByaWdodCBmb3IgZXZlcnlcblx0Ly8gYXBwLCBidXQgaWYgaXQncyByaWdodCBmb3IgeW91cnMgdGhlbiB1bmNvbW1lbnQgdGhpcyBzZWN0aW9uXG5cdC8qXG5cdGlmICh1cmwub3JpZ2luID09PSBzZWxmLm9yaWdpbiAmJiByb3V0ZXMuZmluZChyb3V0ZSA9PiByb3V0ZS5wYXR0ZXJuLnRlc3QodXJsLnBhdGhuYW1lKSkpIHtcblx0XHRldmVudC5yZXNwb25kV2l0aChjYWNoZXMubWF0Y2goJy9zZXJ2aWNlLXdvcmtlci1pbmRleC5odG1sJykpO1xuXHRcdHJldHVybjtcblx0fVxuXHQqL1xuXG5cdGlmIChldmVudC5yZXF1ZXN0LmNhY2hlID09PSAnb25seS1pZi1jYWNoZWQnKSByZXR1cm47XG5cblx0Ly8gZm9yIGV2ZXJ5dGhpbmcgZWxzZSwgdHJ5IHRoZSBuZXR3b3JrIGZpcnN0LCBmYWxsaW5nIGJhY2sgdG9cblx0Ly8gY2FjaGUgaWYgdGhlIHVzZXIgaXMgb2ZmbGluZS4gKElmIHRoZSBwYWdlcyBuZXZlciBjaGFuZ2UsIHlvdVxuXHQvLyBtaWdodCBwcmVmZXIgYSBjYWNoZS1maXJzdCBhcHByb2FjaCB0byBhIG5ldHdvcmstZmlyc3Qgb25lLilcblx0ZXZlbnQucmVzcG9uZFdpdGgoXG5cdFx0Y2FjaGVzXG5cdFx0XHQub3Blbihgb2ZmbGluZSR7dGltZXN0YW1wfWApXG5cdFx0XHQudGhlbihhc3luYyBjYWNoZSA9PiB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChldmVudC5yZXF1ZXN0KTtcblx0XHRcdFx0XHRjYWNoZS5wdXQoZXZlbnQucmVxdWVzdCwgcmVzcG9uc2UuY2xvbmUoKSk7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlO1xuXHRcdFx0XHR9IGNhdGNoKGVycikge1xuXHRcdFx0XHRcdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgY2FjaGUubWF0Y2goZXZlbnQucmVxdWVzdCk7XG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlKSByZXR1cm4gcmVzcG9uc2U7XG5cblx0XHRcdFx0XHR0aHJvdyBlcnI7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdCk7XG59KTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Q0FBQTtDQUNPLE1BQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQztBQUN2QztDQUNPLE1BQU0sS0FBSyxHQUFHO0NBQ3JCLENBQUMsMkJBQTJCO0NBQzVCLENBQUMsV0FBVztDQUNaLENBQUMsV0FBVztDQUNaLENBQUMsaUJBQWlCO0NBQ2xCLENBQUMsYUFBYTtDQUNkLENBQUMsV0FBVztDQUNaLENBQUMsZUFBZTtDQUNoQixDQUFDLDBCQUEwQjtDQUMzQixDQUFDLGFBQWE7Q0FDZCxDQUFDLFlBQVk7Q0FDYixDQUFDLG1CQUFtQjtDQUNwQixDQUFDLHFCQUFxQjtDQUN0QixDQUFDLG1CQUFtQjtDQUNwQixDQUFDLGNBQWM7Q0FDZixDQUFDLFdBQVc7Q0FDWixDQUFDLGNBQWM7Q0FDZixDQUFDLGNBQWM7Q0FDZixDQUFDLGVBQWU7Q0FDaEIsQ0FBQyxjQUFjO0NBQ2YsQ0FBQyxjQUFjO0NBQ2YsQ0FBQyxZQUFZO0NBQ2IsQ0FBQyxZQUFZO0NBQ2IsQ0FBQyxDQUFDO0FBRUY7Q0FDTyxNQUFNLEtBQUssR0FBRztDQUNyQixDQUFDLDJCQUEyQjtDQUM1QixDQUFDLG1DQUFtQztDQUNwQyxDQUFDLDZCQUE2QjtDQUM5QixDQUFDLCtCQUErQjtDQUNoQyxDQUFDLDZCQUE2QjtDQUM5QixDQUFDLGlDQUFpQztDQUNsQyxDQUFDLHdCQUF3QjtDQUN6QixDQUFDLCtCQUErQjtDQUNoQyxDQUFDLDBCQUEwQjtDQUMzQixDQUFDLDBCQUEwQjtDQUMzQixDQUFDLDBCQUEwQjtDQUMzQixDQUFDLDBCQUEwQjtDQUMzQixDQUFDLDhCQUE4QjtDQUMvQixDQUFDLDZCQUE2QjtDQUM5QixDQUFDLDZCQUE2QjtDQUM5QixDQUFDLGlDQUFpQztDQUNsQyxDQUFDLDhCQUE4QjtD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
