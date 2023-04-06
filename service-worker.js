/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

importScripts(
  "/vue-gbm-alive/precache-manifest.045be143be5babbc53c495ad351285b6.js"
);

workbox.core.setCacheNameDetails({prefix: "vue-gbm-alive"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/json/, new workbox.strategies.NetworkFirst({ "cacheName":"json-cache","networkTimeoutSeconds":20, plugins: [new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
workbox.routing.registerRoute(/jpg|png/, new workbox.strategies.CacheFirst({ "cacheName":"wiki-cache", plugins: [new workbox.expiration.Plugin({ maxEntries: 5000, maxAgeSeconds: 2592000, purgeOnQuotaError: true })] }), 'GET');
