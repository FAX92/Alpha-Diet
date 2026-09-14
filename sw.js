/* Alfa Daddy Tracker · offline cache · bump VERSION when index.html changes */
const VERSION="alfa-tracker-v11.1";
const CORE=["./","./index.html","./manifest.webmanifest"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(
    fetch(e.request).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(VERSION).then(c=>c.put(e.request,cp)).catch(()=>{})}return r})
    .catch(()=>caches.match(e.request).then(m=>m||(e.request.mode==="navigate"?caches.match("./index.html"):Response.error())))
  );
});
