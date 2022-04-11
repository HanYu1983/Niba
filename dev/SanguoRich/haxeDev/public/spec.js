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
  name: spec.string,
  money: spec.int,
  army: spec.int,
  strategy: spec.int,
  people: spec.collection("peoples", People),
  atGridId: spec.int,
});
const Player = spec.map("Player", {});
const Grid = spec.map("Grid", {
  id: spec.int,
  landType: spec.int,
  buildtype: spec.int,
  height: spec.number,
  attachs: spec.collection("ints", spec.int),
});
const EventInfo = spec.map("EventInfo", {});
const ActionInfo = spec.map("ActionInfo", {});
var GameInfo = spec.map("GameInfo", {
  players: spec.collection("players", Player),
  grids: spec.collection("grids", Grid),
  isPlayerTurn: spec.boolean,
  currentPlayer: PlayerInfo,
  isPlaying: spec.boolean,
  events: spec.collection("events", EventInfo),
  actions: spec.collection("actions", ActionInfo),
});
