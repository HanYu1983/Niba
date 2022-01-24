import {
  CardPrototype,
  GameContext,
  DEFAULT_CARD_PROTOTYPE,
  DEFAULT_CARD_STATE,
} from "../../tool/basic/gameContext";

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  category: "グラフィック",
  color: "赤",
};

module.exports = {
  ...prototype,
  texts: [],
};
