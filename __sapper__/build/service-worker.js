!function(){"use strict";const e=["client/CardText.b9e882ab.js","client/Row.57394b13.js","client/CardBody.f237822c.js","client/CardHeader.47a7682d.js","client/CardFooter.c0e5b637.js","client/Image.66c08c71.js","client/BarChart.b505b0c4.js","client/BreadcrumbItem.9b756aa3.js","client/activity_log.32521ac3.js","client/FormGroup.ee065167.js","client/Table.b46eb26b.js","client/static_navigation.2102a0c3.js","client/light_sidenav.45d48705.js","client/tables.df20bd55.js","client/_layout.f9673d0b.js","client/Col.7bb26899.js","client/settings.fb49c895.js","client/login.161f5c5b.js","client/_layout.3497c1b8.js","client/forget_password.cde5c8a4.js","client/error_404.c54023ee.js","client/error_401.c21b5dc5.js","client/index.83ea76d6.js","client/error_500.370c947d.js","client/_layout.0fab3147.js","client/[slug].8a204f44.js","client/_layout.aa173a28.js","client/client.2d185b70.js","client/index.ec0fb3d3.js","client/charts.e664ae79.js","client/ui.4e60e142.js","client/register.a03cd215.js","client/client.9a4ccecc.js","client/AreaChart.a84abd74.js"].concat(["service-worker-index.html","chart.png","dashboard.png","error-404-monochrome.svg","favicon.png","global.css","great-success.png","l-proton-logo-2.png","l-proton-logo.png","l-proton.css","light.png","logo-192.png","logo-512.png","manifest.json","response.png","settings.png","static.png","tables.png"]),t=new Set(e);self.addEventListener("install",t=>{t.waitUntil(caches.open("cache1585534192508").then(t=>t.addAll(e)).then(()=>{self.skipWaiting()}))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(async e=>{for(const t of e)"cache1585534192508"!==t&&await caches.delete(t);self.clients.claim()}))}),self.addEventListener("fetch",e=>{if("GET"!==e.request.method||e.request.headers.has("range"))return;const c=new URL(e.request.url);c.protocol.startsWith("http")&&(c.hostname===self.location.hostname&&c.port!==self.location.port||(c.host===self.location.host&&t.has(c.pathname)?e.respondWith(caches.match(e.request)):"only-if-cached"!==e.request.cache&&e.respondWith(caches.open("offline1585534192508").then(async t=>{try{const c=await fetch(e.request);return t.put(e.request,c.clone()),c}catch(c){const n=await t.match(e.request);if(n)return n;throw c}}))))})}();
