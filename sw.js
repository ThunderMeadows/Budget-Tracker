const CACHE="bills-v7";
const FILES=["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
  e.respondWith(fetch(r,{cache:"no-store"}).then(res=>{
    if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}
    return res;
  }).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));
});
