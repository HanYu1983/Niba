// https://ithelp.ithome.com.tw/articles/10188118

const cacheName = "static-v3";
// install
this.addEventListener("install", (event) => {
  console.log("installing…");
  // https://ithelp.ithome.com.tw/articles/10188118
  const filesToCache = ["/index.html"];
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

// activate
this.addEventListener("activate", (event) => {
  console.log("now ready to handle fetches!");
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      var promiseArr = cacheNames.map(function (item) {
        if (item !== cacheName) {
          return caches.delete(item);
        }
      });
      return Promise.all(promiseArr);
    })
  );
});

// fetch
this.addEventListener("fetch", (event) => {
  console.log("fetch", event);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        console.log("use CACJE!!");
      }
      return (
        response ||
        fetch(event.request).then((res) =>
          // 存 caches 之前，要先打開 caches.open(dataCacheName)
          caches.open(cacheName).then(function (cache) {
            // cache.put(key, value)
            // 下一次 caches.match 會對應到 event.request
            cache.put(event.request, res.clone());
            return res;
          })
        )
      );
    })
  );
});
