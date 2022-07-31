import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';
import { argv } from 'node:process';
import process from 'node:process';
import {readFileSync, writeFileSync} from 'node:fs';

if (argv.length < 3) {
    console.log('Usage: node index.js [path]');
    process.exit(1);
}

(async () => {
    const kuroshiro = new Kuroshiro.default();
    await kuroshiro.init(new KuromojiAnalyzer());
    console.log('Kuroshiro is ready');

    const filePath = argv[2];
    const tournamentData = JSON.parse(readFileSync(filePath, 'utf8'));

    if (!tournamentData || !tournamentData.teams) {
        throw new Error('Invalid tournament data');
    }

    const newTeams = await Promise.all(tournamentData.teams.map(async team => {
        const newPlayers = await Promise.all(team.players.map(async player =>
            player.romanizedName == null ? ({
                ...player,
                romanizedName: await convert(player.name)
            }) : player));

        if (team.romanizedName == null) {
            const romanizedName = await convert(team.name);

            return { ...team, romanizedName, players: newPlayers }
        } else {
            return { ...team, players: newPlayers }
        }
    }));

    const newFilePath = `${filePath.slice(0, -5)}_romanized.json`;
    writeFileSync(newFilePath, JSON.stringify({
        ...tournamentData,
        teams: newTeams
    }, null, 2));
    console.log(`Done - Wrote result to ${newFilePath}`);

    async function convert(input) {
        if (Kuroshiro.default.Util.hasJapanese(input)) {
            const result = await kuroshiro.convert(input, {to: 'romaji'});
            if (result != null) {
                console.log(`${input} -> ${result}`);
            }
            return result;
        }

        return undefined;
    }
})();
