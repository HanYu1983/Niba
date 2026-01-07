interface IInstanceGame<T> {
    sync(game: IGame, relative: T): void;
}

interface IGame {
    players: IPlayer[];
}

interface IPlayer {
    id: string
    name: string
    cards: ICard[]
}

interface ICard {
    id: string
    name: string
}