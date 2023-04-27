import {Draw, House} from "./types";
import {chooseBestGame, findIndexOfMax, printGames, shuffle} from "./utils";
import {CONFIG} from "./config";

const playerIds = shuffle(CONFIG.playerIds);
const houseCount = Object.keys(House).length / 2;

console.log(`Calculating for ${playerIds.length} players. I will try ${CONFIG.iterations} times to optimise...`);
console.log(`Player IDs: ${JSON.stringify(playerIds)}`);


let draws: Draw[] = [];
let failedDraws = 0;

for (let it = 0; it < CONFIG.iterations; it++) {
    try {
        let draw = [];
        let parallels = [];
        let gamesVs = new Array(playerIds.length);

        for (let i = 0; i < playerIds.length; i++) {
            draw.push(new Array(houseCount));
        }

        for (let i = 0; i < draw.length; i++) {
            let parallel = 0;
            let finalGamesVs = null;
            for (let j = 0; j < houseCount; j++) {
                const chosenGame = chooseBestGame(i, j as House, playerIds.length, draw);

                if (draw[chosenGame.game][j] !== undefined) {
                    throw new Error(`Error: I assigned player ${i} to game ${chosenGame.game} as ${House[j]} but it was already assigned to ${draw[chosenGame.game][j]}`);
                }

                draw[chosenGame.game][j] = i;
                parallel = Math.max(parallel, chosenGame.parallelCount);
                finalGamesVs = chosenGame.gamesVs;
            }
            parallels.push(parallel + 1);
            gamesVs[i] = finalGamesVs;
        }

        const sum = parallels.reduce((a, b) => a + b, 0);
        const avg = (sum / parallels.length) || 0;

        draws.push({draw, quality: avg * Math.max.apply(Math, parallels), parallels, gamesVs});

    } catch (error) {
        // you can do something with the errors if you want
        failedDraws++;
    }
}

let chosenDraw = draws[0];
let bestQuality = 999;

draws.forEach(draw => {
    if (draw.quality < bestQuality) {
        chosenDraw = draw;
        bestQuality = draw.quality
    }
});


printGames(chosenDraw.draw, playerIds);

console.log(`parallels is ${JSON.stringify(chosenDraw.parallels)}!`);
const sum = chosenDraw.parallels.reduce((a, b) => a + b, 0);
const avg = (sum / chosenDraw.parallels.length) || 0;
console.log(`at worst, a player will play another player in ${Math.max.apply(Math, chosenDraw.parallels)} games!`);
const worstId = findIndexOfMax(chosenDraw.parallels);
const worstEnemy = findIndexOfMax(chosenDraw.gamesVs[worstId]);
console.log(`for example, player ${playerIds[worstId]} plays ${chosenDraw.parallels[worstId]} games against ${playerIds[worstEnemy]}`);
// console.log(`you can check that in his games:`);
// printGames(chosenDraw.draw.filter(game => game.includes(worstId)), playerIds);
console.log(`avg parallels for a chosen draw is ${avg}!`);
console.log(`I failed ${failedDraws} out of ${CONFIG.iterations} draws`);
