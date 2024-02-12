type Position = [Number, Number];

type Robot = {
    position?: Position;
    weapons: Weapon[];
}

type Weapon = {
    position?: Position;
    weaponId: String;
    robotId?: String;
}

type Pilot = {
    pilotId: String;
}

type ItemBox = {
    position: Position;
}

type Entity = Robot | ItemBox;