const CACHE="only-us-v5";
const FILES=["./","./index.html","./styles.css?v=5","./app.js?v=4","./manifest.webmanifest","./assets/ayu-reference.jpg","./assets/icon.svg"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)))});
self.addEventListener("activate",e=>e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})()));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith((async()=>{const hit=await caches.match(e.request);if(hit)return hit;try{const res=await fetch(e.request);if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return res}catch(err){return (await caches.match("./index.html"))||Response.error()}})())});
