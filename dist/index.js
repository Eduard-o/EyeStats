"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const PORT = 5000;
const app = (0, express_1.default)();
function playerDataScraper(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const player = {};
        const url = `https://www.realmeye.com/player/${user}`;
        yield (0, axios_1.default)(url, { headers: {
                'Cache-Control': 'max-age=0',
                'Connection': 'keep-alive',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
            } }).then(response => {
            const html = response.data;
            const $ = cheerio_1.default.load(html);
            const name = $('.entity-name').text();
            const summary = $('table.summary > tbody');
            const fame = +summary.find('tr:eq(3) > td:eq(1) > span').text();
            const exaltations = +summary.find('tr:eq(2) > td:eq(1) > span.numeric').text();
            const rank = +summary.find('tr:eq(4) > td:eq(1) > .star-container').text();
            if (summary.find('tr:eq(6) > td:eq(0)').text() === 'Guild') {
                const guild = summary.find('tr:eq(6) > td:eq(1) > a').text();
                const guild_rank = summary.find('tr:eq(7) > td:eq(1)').text();
                player.guild = guild;
                player.guild_rank = guild_rank;
            }
            const character_count = +summary.find('tr:eq(0) > td:eq(1)').text();
            const description = [$('#d > .line1').text(), $('#d > .line2').text(), $('#d > .line3').text()];
            player.name = name;
            player.fame = fame;
            player.exaltations = exaltations;
            player.rank = rank;
            player.character_count = character_count;
            player.description = description;
        });
        return player;
    });
}
app.get('/p/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield playerDataScraper(req.params.name);
        res.header('Content-Type', 'application/json');
        res.status(200);
        res.send(JSON.stringify(data, null, 4));
    }
    catch (err) {
        res.header('Content-Type', 'application/json');
        res.status(500);
        res.send(JSON.stringify(err.toString(), null, 4));
    }
}));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map