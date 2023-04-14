/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

const getQueenV2UrlRegex = url => {
  return url.replace('http', '^http').concat('/(.*)((.js)|(.png)|(.svg))');
};

const getQueenV2UrlRegexJson = url => {
  return url.replace('http', '^http').concat('/(.*)(.json)');
};

const queenV2CacheName = 'queen-V2-cache';
console.log('"Loading Queen V2 SW into another SW"');

registerRoute(
  new RegExp(getQueenV2UrlRegex(self._QUEEN_V2_URL)),
  new CacheFirst({
    cacheName: queenV2CacheName,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
registerRoute(
  new RegExp(getQueenV2UrlRegexJson(self._QUEEN_V2_URL)),
  new NetworkFirst({
    cacheName: queenV2CacheName,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

const queenV2PrecacheController = async () => {
  const cache = await caches.open(queenV2CacheName);
  const urlsToPrecache = self.__WB_MANIFEST.reduce(
    (_, { url }) => [..._, `${self._QUEEN_V2_URL}/${url}`],
    []
  );
  await cache.addAll(urlsToPrecache);
  cache
    .add(`${self._QUEEN_V2_URL}/oidc.json`)
    .catch(() => cache.add(`${self._QUEEN_V2_URL}/keycloak.json`))
    .catch(() => console.error('Failed to cache auth file'));
};

self.addEventListener('install', event => {
  console.log('QUEEN V2 sw : installing ...');
  event.waitUntil(queenV2PrecacheController());
});

self.addEventListener('activate', event => {
  console.log('QUEEN V2 sw : activating ...');
});
