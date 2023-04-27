enum House {
    STARK,
    GREYJOY,
    BARATHEON,
    LANNISTER,
    MARTELL,
    TYRELL
}

interface Draw {
    draw: number[][],
    quality: number, // the lower the better
    parallels: number[],
    gamesVs: number[][]
}

export {House, Draw};