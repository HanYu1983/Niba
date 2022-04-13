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
  [symbol.optional]: {},
});
const PlayerInfo = spec.map("PlayerInfo", {
  id: spec.int,
  name: spec.str,
  money: spec.int,
  army: spec.int,
  strategy: spec.int,
  people: spec.collection("peoples", People),
  atGridId: spec.int,
});
const Grid = spec.map("Grid", {
  id: spec.int,
  landType: spec.int,
  buildtype: spec.obj, // haxe enum object
  height: spec.number,
  attachs: spec.collection("ints", spec.int),
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
  walkStop: spec.map("walkStop", {
    id: spec.oneOf("id", "WALK_STOP"),
    value: spec.map("value", {
      grid: Grid,
      commands: spec.collection("commands", spec.obj),
    }),
  }),
});

var GameContext = spec.map("GameContext", {
  players: spec.collection("players", PlayerInfo),
  grids: spec.collection("grids", Grid),
  currentPlayer: spec.int,
  actions: spec.collection("actions", Action),
  events: spec.collection("events", EventSpec),
});
