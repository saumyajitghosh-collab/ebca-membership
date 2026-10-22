/* EBCA — single service worker for the whole site.
   Serves the companion app, the Receipt Desk, offline caching,
   and the Web Share Target that receives receipts shared from WhatsApp. */

var CACHE = "ebca-v3";
var SHARE = "ebca-desk-share";
var ASSETS = [
  "./", "./index.html", "./receipts.html",
  "./manifest.webmanifest", "./receipts.html",
  "./icon-192.png", "./icon-512.png"
];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(ASSETS.map(function (u) {
        return c.add(u).catch(function () { /* optional asset missing — ignore */ });
      }));
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE && k !== SHARE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  var url = new URL(req.url);

  /* ---- 1. Web Share Target ----
     When a volunteer shares a receipt from WhatsApp into the installed
     Receipt Desk, the browser POSTs the file here. GitHub Pages cannot
     accept a POST, so the worker catches it, parks the files in the
     cache, and redirects to a normal GET that the page can read. */
  if (req.method === "POST" && url.origin === self.location.origin &&
      (url.pathname.indexOf("index.html") > -1 || url.pathname.indexOf("receipts.html") > -1)) {
    event.respondWith((async function () {
      try {
        var form = await req.formData();
        var files = [];
        form.forEach(function (v) {
          if (v && typeof v === "object" && "name" in v && "size" in v) files.push(v);
        });
        var cache = await caches.open(SHARE);
        var old = await cache.keys();
        for (var i = 0; i < old.length; i++) { await cache.delete(old[i]); }
        for (var j = 0; j < files.length; j++) {
          var f = files[j];
          await cache.put(
            new Request("./shared-" + j),
            new Response(f, {
              headers: {
                "Content-Type": f.type || "application/octet-stream",
                "X-Filename": encodeURIComponent(f.name || ("receipt-" + j))
              }
            })
          );
        }
        return Response.redirect(new URL("./index.html?shared=1", self.location).href, 303);
      } catch (err) {
        return Response.redirect(new URL("./index.html?share_error=1", self.location).href, 303);
      }
    })());
    return;
  }

  if (req.method !== "GET") return;
  if (url.origin !== self.location.origin) return;   // fonts and CDNs pass straight through

  /* ---- 2. Pages: network-first, so updates always appear ---- */
  if (req.mode === "navigate" || (req.headers.get("accept") || "").indexOf("text/html") > -1) {
    event.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (r) { return r || caches.match("./index.html"); });
      })
    );
    return;
  }

  /* ---- 3. Static assets: cache-first ---- */
  event.respondWith(
    caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      });
    })
  );
});
