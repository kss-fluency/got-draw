import {House} from "./types";

export const calculateNumberOfGamesVs = (id:number , playersCount: number, draw: number[][]): number[] => {
    const numberOfGamesVs: number[] = new Array(playersCount).fill(0);

    for (let i = 0; i < draw.length; i++) {
        for (let j = 0; j < draw[i].length; j++) {
            // console.log(`draw for game ${i} house ${House[j]} is: ${draw[i][j]}`);
            if (draw[i].includes(id) && draw[i][j] !== id && draw[i][j] !== undefined) {
                numberOfGamesVs[draw[i][j]]++;
            }
        }
    }

    return numberOfGamesVs;
};

export const chooseBestGame = (id: number, house: House, playersCount: number, draw: number[][]): number => {
    const numberOfGamesVs = calculateNumberOfGamesVs(id, playersCount, draw);

    let order = Array.from(Array(draw.length).keys())
    order = shuffle(order);
    // console.log(`order: ${JSON.stringify(order)}`);

    // console.log(`games vs for ${id}: ${JSON.stringify(numberOfGamesVs)}\n`);

    for (let acceptableParallelGames = 0; acceptableParallelGames < draw.length; acceptableParallelGames++) {

        for (let i = 0; i < draw.length; i++) {
            const candidateGame = draw[order[i]];

            if (candidateGame.includes(id) || candidateGame[house] !== undefined) {
                continue;
            }

            let acceptableParallelCount = true;
            candidateGame.filter(opponent => opponent !== undefined).forEach(opponent => {
                if (numberOfGamesVs[opponent] > acceptableParallelGames) {
                    acceptableParallelCount = false;
                    return;
                }
            });

            if (acceptableParallelCount) {
                // console.log(`found a game ${order[i]} for ${id} with max ${acceptableParallelGames} parallels`);
                return order[i];
            }
        }
    }

    throw new Error(`could not find a solution for player [${id}] house [${house}] ! draw so far: ${JSON.stringify(draw)}`);
};

export const findIndexOfMax = (array: number[]): number => {
    return array.reduce((iMax: number, x: number, i: number, arr: number[]) => x > arr[iMax] ? i : iMax, 0);
}

export const shuffle = (array: any[]): any[] => {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

export const printGames = (games: number[][], players: string[]) => {
    for (let i = 0; i < games.length; i++) {
        console.log(`Game ${i}:\n`);
        for (let j = 0; j < games[i].length; j++) {
            console.log(`${players[games[i][j]]} plays ${House[j]}`);
        }
        console.log('__________');
    }
}