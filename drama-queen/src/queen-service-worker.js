/* eslint-disable no-restricted-globals */
self._QUEEN_URL = import.meta.env.VITE_QUEEN_URL;
self._QUEEN_V2_URL = import.meta.env.VITE_QUEEN_V2_URL;
self._QUEEN_CAPMI_URL = import.meta.env.VITE_CAPMI_URL;

importScripts(`${self._QUEEN_URL}/queen-service-worker.js`);
importScripts(`${self._QUEEN_V2_URL}/queen-service-worker.js`);
importScripts(`${self._QUEEN_CAPMI_URL}/queen-service-worker.js`);

const getDramaQueenUrlRegex = (url) => {
  return url
    .replace("http", "^http")
    .concat("/(.*)((.js)|(.png)|(.svg)|(.css))");
};
const dramaQueenCacheName = "drama-queen-cache";

console.log("Loading Drama Queen SW into another SW");

registerRoute(
  new RegExp(getDramaQueenUrlRegex(self._DRAMAQUEEN_URL)),
  new NetworkFirst({
    cacheName: dramaQueenCacheName,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

const dramaPrecacheController = async () => {
  const cache = await caches.open(dramaQueenCacheName);
  const urlsToPrecache = self.__WB_MANIFEST.reduce(
    (_, { url }) => [..._, `${self._DRAMAQUEEN_URL}/${url}`],
    []
  );
  await cache.addAll(urlsToPrecache);
};

self.addEventListener("install", (event) => {
  console.log("Drama Queen  sw : installing configuration..");
  event.waitUntil(dramaPrecacheController());
});

self.addEventListener("activate", (event) => {
  console.log("Drama Queen sw : activating ...");
});
