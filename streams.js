const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Recupera il link dello stream per un episodio specifico.
 * @param {string} episodeLink - URL della pagina dell'episodio.
 * @returns {string|null} - URL dello stream o null se non trovato.
 */
async function getStream(episodeLink) {
    try {
        const { data } = await axios.get(episodeLink);
        const $ = cheerio.load(data);

        // Trova l'iframe nella pagina dell'episodio
        const iframeSrc = $('iframe').attr('src');

        // Verifica che il link dell'iframe punti al server corretto
        if (iframeSrc && iframeSrc.startsWith('https://server1.streamingrof.online/02-DRAMACOREANI')) {
            return iframeSrc;
        } else {
            console.warn(`Stream non valido per ${episodeLink}: ${iframeSrc}`);
            return null;
        }
    } catch (err) {
        console.error(`Errore durante il recupero dello stream per ${episodeLink}:`, err);
        return null;
    }
}

/**
 * Recupera la lista degli episodi e i rispettivi stream per una serie.
 * @param {string} seriesLink - URL della pagina della serie.
 * @returns {Array} - Lista di episodi con titolo, thumbnail e link allo stream.
 */
async function getEpisodes(seriesLink) {
    try {
        const episodes = [];
        const baseEpisodeUrl = seriesLink.replace('/drama/', '/watch/');

        // Estrai l'ID completo della serie
        const seriesId = seriesLink.split('/').pop();
        console.log('ID della serie estratto:', seriesId);  // Debug: visualizzare l'ID della serie

        // Trova l'ID della serie e l'anno (se presente)
        const match = seriesId.match(/([a-zA-Z0-9-]+)(-\d{4})?/);
        const finalSeriesId = match ? match[0] : seriesId; // Mantieni l'ID completo o quello senza anno

        console.log('ID finale per l\'episodio:', finalSeriesId); // Debug: visualizzare l'ID finale per l'episodio

        // Supponiamo che il numero massimo di episodi sia 20
        for (let episodeNumber = 1; episodeNumber <= 30; episodeNumber++) {
            // Costruisci l'URL dell'episodio
            const episodeLink = `${baseEpisodeUrl}${finalSeriesId}-episodio-${episodeNumber}/`;
            console.log(`URL dell'episodio generato: ${episodeLink}`);  // Debug: visualizzare l'URL dell'episodio

            // Interrompi se l'URL non è formattato correttamente
            if (!episodeLink.includes(finalSeriesId)) {
                console.error('Errore nell\'URL dell\'episodio:', episodeLink);
                return; // Interrompe il flusso per debug
            }

            // Recupera lo stream per l'episodio
            try {
                const stream = await getStream(episodeLink);
                if (!stream) break;

                episodes.push({
                    id: `episodio-${episodeNumber}`,
                    title: `Episodio ${episodeNumber}`,
                    thumbnailUrl: '', // Puoi aggiungere il recupero del thumbnail se necessario
                    stream,
                });
            } catch (err) {
                console.error(`Errore durante il recupero dello stream per ${episodeLink}:`, err);
            }
        }

        return episodes;
    } catch (err) {
        console.error('Errore durante il recupero degli episodi:', err);
    }
}

module.exports = { getEpisodes };
