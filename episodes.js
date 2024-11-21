const axios = require('axios');
const cheerio = require('cheerio');
const { getEpisodes } = require('./streams');

async function getMeta(id) {
    const meta = { id, type: 'series', name: '', poster: '', episodes: [] };
    const seriesLink = `https://ramaorientalfansub.tv/drama/${id.replace(/-\d+$/, '')}/`;

    try {
        const { data } = await axios.get(seriesLink);
        const $ = cheerio.load(data);

        meta.name = $('a.text-accent').text().trim();
        meta.poster = $('img.wp-post-image').attr('src');
        meta.description = $('div.font-light > div:nth-child(1)').text().trim();

        meta.episodes = await getEpisodes(seriesLink);
    } catch (error) {
        console.error('Errore nel caricamento dei dettagli della serie:', error);
    }
    console.log('Meta finale:', meta); // Log per verificare il risultato

    return { meta };
}

module.exports = { getMeta };
