# got-draw
Draw participants for a tournament round of the Game of Thrones board game. The draw will be random, but it will attempt to produce a draw of the best quality, prioritising as follows:
- the lowest maximum of games played among any two players
- the lowest average of games played against any opponent, calculated among all the players

## how to use:
- Install `node` and `ts`
- Run `yarn install`
- Configure your players and iterations count in `src/config.ts`
- Run `yarn simulate`
