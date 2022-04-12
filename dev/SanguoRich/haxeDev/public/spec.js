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
  abilities: spec.coll("ints", spec.int),
  [symbol.optional]: {},
});
const PlayerInfo = spec.map("PlayerInfo", {
  id: spec.int,
  name: spec.str,
  money: spec.int,
  army: spec.int,
  strategy: spec.int,
  people: spec.coll("peoples", People),
  atGridId: spec.int,
});
const Player = spec.map("Player", {
  id: spec.int,
  type: spec.int,
  name: spec.str,
  command: spec.int,
  force: spec.int,
  intelligence: spec.int,
  political: spec.int,
  charm: spec.int,
  cost: spec.int,
  abilities: spec.coll("ints", spec.int),
});
const Grid = spec.map("Grid", {
  id: spec.int,
  landType: spec.int,
  buildtype: spec.obj, // haxe enum object
  height: spec.number,
  attachs: spec.coll("ints", spec.int),
});
const EventInfo = spec.map("EventInfo", {});
const ActionInfo = spec.map("ActionInfo", {});
var GameContext = spec.map("GameContext", {
  players: spec.coll("players", Player),
  grids: spec.coll("grids", Grid),
  currentPlayer: spec.int,
});
