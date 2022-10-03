import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import { PlayerData } from './interfaces/iPlayerData';

const PORT = 5000;
const app = express();

async function playerDataScraper(user: string) {
	const player = {} as PlayerData;
	const url = `https://www.realmeye.com/player/${user}`;

	await axios(url, { headers: {
		'Cache-Control': 'max-age=0',
		'Connection': 'keep-alive',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
	} }).then(response => {
		const html = response.data;
		const $ = cheerio.load(html);

		const name: string = $('.entity-name').text();
		const summary: cheerio.Cheerio = $('table.summary > tbody');
		const fame: number = +summary.find('tr:eq(3) > td:eq(1) > span').text();
		const exaltations: number = +summary.find('tr:eq(2) > td:eq(1) > span.numeric').text();
		const rank: number = +summary.find('tr:eq(4) > td:eq(1) > .star-container').text();
		if (summary.find('tr:eq(6) > td:eq(0)').text() === 'Guild') {
			const guild: string = summary.find('tr:eq(6) > td:eq(1) > a').text();
			const guild_rank: string = summary.find('tr:eq(7) > td:eq(1)').text();
			player.guild = guild;
			player.guild_rank = guild_rank;
		}
		const character_count: number = +summary.find('tr:eq(0) > td:eq(1)').text();
		const description: string[] = [$('#d > .line1').text(), $('#d > .line2').text(), $('#d > .line3').text()];

		player.name = name;
		player.fame = fame;
		player.exaltations = exaltations;
		player.rank = rank;
		player.character_count = character_count;
		player.description = description;
	});

	return player;
}

app.get('/p/:name', async (req, res) => {
	try {
		const data = await playerDataScraper(req.params.name);

		res.header('Content-Type', 'application/json');
		res.status(200);
		res.send(JSON.stringify(data, null, 4));
	}
	catch (err) {
		res.header('Content-Type', 'application/json');
		res.status(500);
		res.send(JSON.stringify(err.toString(), null, 4));
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});