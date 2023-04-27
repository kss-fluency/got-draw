import {Draw, House} from "./types";
import {calculateNumberOfGamesVs, chooseBestGame, findIndexOfMax, printGames, shuffle} from "./utils";
import {CONFIG} from "./config";

let currId = 0;
const playerIds = shuffle(CONFIG.playerIds).map(name => {
    return{
        name,
        id: currId++
    };
});
const houseCount = Object.keys(House).length / 2;

console.log(`Calculating for ${playerIds.length} players. I will try ${CONFIG.iterations} times to optimise...`);
console.log(`Player IDs: ${JSON.stringify(playerIds)}`);


let draws: Draw[] = [];
let failedDraws = 0;

for (let it = 0; it < CONFIG.iterations; it++) {
    try {
        let draw = [];

        for (let i = 0; i < playerIds.length; i++) {
            draw.push(new Array(houseCount));
        }

        for (let i = 0; i < draw.length; i++) {
            for (let j = 0; j < houseCount; j++) {
                const chosenGame = chooseBestGame(i, j as House, playerIds.length, draw);

                if (draw[chosenGame][j] !== undefined) {
                    throw new Error(`Error: I assigned player ${i} to game ${chosenGame} as ${House[j]} but it was already assigned to ${draw[chosenGame][j]}`);
                }

                draw[chosenGame][j] = i;
            }
        }
        draws.push({draw, quality: 999, parallels: [1], gamesVs: [[1], [2]]});
    } catch (error) {
        // you can do something with the errors if you want
        failedDraws++;
    }
}

draws = draws.map(rawDraw => {
    const gamesVs = playerIds.map(id => calculateNumberOfGamesVs(id.id, playerIds.length, rawDraw.draw));
    const parallels = gamesVs.map(gameVs => Math.max.apply(Math, gameVs));
    const sum = parallels.reduce((a, b) => a + b, 0);
    const avg = (sum / parallels.length) || 0;

    return {
        draw: rawDraw.draw,
        quality: avg * Math.max.apply(Math, parallels),
        parallels,
        gamesVs
    };
});

let chosenDraw = draws[0];
let bestQuality = 999;

draws.forEach(draw => {
    if (draw.quality < bestQuality) {
        chosenDraw = draw;
        bestQuality = draw.quality
    }
});

printGames(chosenDraw.draw, playerIds.map(id => id.name));

const parallelsWithNames = [];
for (let i = 0; i < chosenDraw.parallels.length; i++) {
    parallelsWithNames.push({p: chosenDraw.parallels[i] , name: playerIds[i].name})
}

console.log(`parallels is ${JSON.stringify(parallelsWithNames)}!`);
const sum = chosenDraw.parallels.reduce((a, b) => a + b, 0);
const avg = (sum / chosenDraw.parallels.length) || 0;
console.log(`at worst, a player will play another player in ${Math.max.apply(Math, chosenDraw.parallels)} games!`);
const worstId = findIndexOfMax(chosenDraw.parallels);
const worstEnemy = findIndexOfMax(chosenDraw.gamesVs[worstId]);
console.log(`for example, player ${playerIds[worstId].name} plays ${chosenDraw.parallels[worstId]} games against ${playerIds[worstEnemy].name}`);
console.log(`you can check that in his games:`);
printGames(chosenDraw.draw.filter(game => game.includes(worstId)), playerIds.map(id => id.name));
console.log(`avg parallels for a chosen draw is ${avg}!`);
console.log(`I failed ${failedDraws} out of ${CONFIG.iterations} draws`);
