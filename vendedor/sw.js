const C='va-v2';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./style.css','./core.js','./icon.png','./tienda/','./panel/','./promotor/'])).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp)).catch(()=>{});return r}).catch(()=>caches.match(e.request)))});
self.addEventListener('push',e=>{const d=e.data?e.data.json():{title:'Nuevo mensaje',body:''};e.waitUntil(self.registration.showNotification(d.title,{body:d.body,icon:'icon.png',vibrate:[80,40,80]}))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.openWindow('./panel/'))});
