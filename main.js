const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const manifest = require('./manifest.json');
const seriesCatalog = require('./rama_series');
const filmsCatalog = require('./rama_films');
const { getMeta } = require('./episodes');

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(async (args) => {
    if (args.type === 'series' && args.id === 'rama_series') {
        return seriesCatalog(args);
    } else if (args.type === 'movie' && args.id === 'rama_films') {
        return filmsCatalog(args);
    }
});

builder.defineMetaHandler(async (args) => getMeta(args.id));

serveHTTP(builder.getInterface(), { port: 7000 });
console.log(`Addon server is running at http://localhost:7000/manifest.json`);
