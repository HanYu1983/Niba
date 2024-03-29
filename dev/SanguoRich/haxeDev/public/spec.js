const { spec, valid, explainData, assert, symbol } = window["js.spec"];
const People = spec.map("People", {
  id: spec.int,
  type: spec.int,
  name: spec.string,
  command: spec.int,
  force: spec.int,
  intelligence: spec.int,
  political: spec.int,
  charm: spec.int,
  cost: spec.int,
  abilities: spec.collection("ints", spec.int),
  energy: spec.int,
  [symbol.optional]: {},
});
const PlayerInfo = spec.map("PlayerInfo", {
  id: spec.int,
  name: spec.str,
  money: spec.number,
  food: spec.number,
  army: spec.number,
  strategy: spec.number,
  people: spec.collection("people", People),
  atGridId: spec.int,
});

const Grid = spec.map("Grid", {
  id: spec.int,
  landType: spec.int,
  buildtype: spec.obj, // haxe enum object
  height: spec.number,
  attachs: spec.collection("ints", spec.int),
  money: spec.number,
  moneyGrow: spec.number,
  food: spec.number,
  foodGrow: spec.number,
  army: spec.number,
  armyGrow: spec.number,
  people: spec.collection("people", People),
});

const Action = spec.or("Action", {
  move: spec.map("move", {
    id: spec.oneOf("id", "MOVE"),
    value: spec.map("value", {
      playerId: spec.int,
      fromGridId: spec.int,
      toGridId: spec.int,
    }),
    gameInfo: spec.obj,
  }),
});

const EventSpec = spec.or("Event", {
  WORLD_EVENT: spec.map("WORLD_EVENT", {
    id: spec.oneOf("id", "WORLD_EVENT"),
    value: spec.nilable("value", spec.obj),
  }),
  WALK_STOP: spec.map("WALK_STOP", {
    id: spec.oneOf("id", "WALK_STOP"),
    value: spec.map("value", {
      grid: Grid,
      commands: spec.collection("commands", spec.obj),
    }),
  }),
  NEGOTIATE_RESULT: spec.map("NEGOTIATE_RESULT", {
    id: spec.oneOf("id", "NEGOTIATE_RESULT"),
    value: spec.map("value", {
      success: spec.boolean,
      people: People,
      energyBefore: spec.number,
      energyAfter: spec.number,
      armyBefore: spec.number,
      armyAfter: spec.number,
      moneyBefore: spec.number,
      moneyAfter: spec.number,
      foodBefore: spec.number,
      foodAfter: spec.number,
    }),
  }),
  WAR_RESULT: spec.map("WAR_RESULT", {
    id: spec.oneOf("id", "WAR_RESULT"),
    value: spec.nilable("value", spec.obj),
  }),
});

var GameContext = spec.map("GameContext", {
  players: spec.collection("players", PlayerInfo),
  grids: spec.collection("grids", Grid),
  currentPlayer: spec.int,
  actions: spec.collection("actions", Action),
  events: spec.collection("events", EventSpec),
});

var WarPreview = spec.map("WarPreview", {
  player: PlayerInfo,
  fightPeople: spec.collection("fightPeople", People),
  armyBefore: spec.number,
  armyAfter: spec.collection("armyAfter", spec.number),
  moneyBefore: spec.number,
  moneyAfter: spec.collection("moneyAfter", spec.number),
  foodBefore: spec.number,
  foodAfter: spec.collection("foodAfter", spec.number),
});

var NegoPreview = spec.map("NegoPreview", {
  p1ValidPeople: spec.collection("p1ValidPeople", People),
  p2ValidPeople: spec.collection("p2ValidPeople", People),
});

var HirePreview = spec.map("HirePreview", {
  p1ValidPeople: spec.collection("p1ValidPeople", People),
  p2ValidPeople: spec.collection("p2ValidPeople", People),
});

var PreResultOnNego = spec.map("PreResultOnNego", {
  energyAfter: spec.number,
  armyBefore: spec.number,
  armyAfter: spec.number,
  moneyBefore: spec.number,
  moneyAfter: spec.number,
  foodBefore: spec.number,
  foodAfter: spec.number,
  successRate: spec.number,
});
