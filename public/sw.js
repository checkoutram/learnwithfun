const CACHE_NAME = 'subjects-of-fun-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/mascot.png',
  '/assets/menu_bg_fun.jpg',
  '/assets/hero_kids.png',
  '/assets/trophy.png',
  '/assets/star.png',
  '/assets/star_big.png',
  '/assets/player.png',
  '/assets/subject_math.png',
  '/assets/subject_english.png',
  '/assets/subject_science.png',
  '/assets/subject_social.png',
  '/assets/subject_tamil.png',
  '/assets/subject_hindi.png',
  '/assets/eng_noun.png',
  '/assets/eng_verb.png',
  '/assets/eng_adj.png',
  '/assets/eng_pronoun.png',
  '/assets/eng_sentence.png',
  '/assets/eng_prep.png',
  '/assets/eng_voice.png',
  '/assets/eng_word.png',
  '/assets/sci_plants.png',
  '/assets/sci_animals.png',
  '/assets/sci_human.png',
  '/assets/sci_earth.png',
  '/assets/sci_matter.png',
  '/assets/sci_energy.png',
  '/assets/sci_force.png',
  '/assets/sci_weather.png',
  '/assets/soc_history.png',
  '/assets/soc_civic.png',
  '/assets/soc_map.png',
  '/assets/soc_globe.png',
  '/assets/img_plant.png',
  '/assets/img_animals.png',
  '/assets/img_sense_organs.png',
  '/assets/img_safety.png',
  '/assets/img_uses_of_plants.png',
  '/assets/img_photosynthesis.png',
  '/assets/img_germination.png',
  '/assets/img_rocks.png',
  '/assets/img_earth_globe.png',
  '/assets/img_sun_earth_moon.png',
  '/assets/img_water_cycle.png',
  '/assets/img_rainbow.png',
  '/assets/img_compass.png',
  '/assets/img_pyramid.png',
  '/assets/img_3d_shapes.png',
  '/assets/img_money.png',
  '/assets/img_shapes.png',
  '/assets/img_fractions.png',
  '/assets/img_parliament.png',
  '/assets/img_indian_flag.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).catch(() => cached);
    })
  );
});
