import {
  GameEvent,
  TargetType,
  TextCategory,
  Timing,
  TIMING_CHART,
} from "../basic";
import { ScriptContext, DEFAULT_SCRIPT_CONTEXT } from "../scriptContext";
import { DEFAULT_TABLE, Table } from "../../../../tool/table";
import { BlockPayload } from "../blockPayload";
import { Text } from "../../script";

export type PlayerState = {
  id: string;
  turn: number;
  playGCount: number;
  confirmPhase: boolean;
};

export type CardAbility = {
  id: string;
  text?: string;
  texts?: Text[];
  textCategory: TextCategory;
};

export type CardState = {
  id: string;
  playerID: string;
  live: number;
  destroy: boolean;
  setGroupID: string;
  memory: any;
  abilityList: CardAbility[];
};

export type GameState = {
  table: Table;
  cardState: CardState[];
  timing: Timing;
  playerState: PlayerState[];
  activePlayerID: string | null;
};

export type Vars = {
  targets: { [key: string]: TargetType };
};

export type Block = {
  id: string;
  payload: BlockPayload;
};

export type GameContext = {
  varsPool: { [key: string]: Vars };
  // 立即效果。玩家必須立即一個一個進行處理
  immediateEffect: Block[];
  // 堆疊效果。每次只處理第一個代表top的block
  stackEffect: Block[];
  gameState: GameState;
};

export const DEFAULT_GAME_CONTEXT: GameContext = {
  varsPool: {},
  gameState: {
    table: DEFAULT_TABLE,
    cardState: [
      {
        id: "0",
        playerID: "",
        live: 0,
        destroy: false,
        setGroupID: "aa",
        memory: {},
        abilityList: [
          {
            id: "",
            textCategory: {
              id: "特殊型",
              text: ["PS装甲"],
              texts: [
                // play出場時重置. add block到起動列表讓玩家知道效果, 起動列表一有值就要讓玩一個一個進行處理
                {
                  id: "自動型",
                  text: "play出場時重置",
                  category: ["起動", ""],
                },
                // 出現在戰鬥區時，若部隊中沒有供給或補給時將flag設為true
                {
                  id: "自動型",
                  text: "出現在戰鬥區時，若部隊中沒有供給或補給時將flag設為true",
                  category: ["起動", ""],
                },
                // 當重整部隊時，部隊中有供給或補給時，將FLAG設為FLASE
                // 回合開始時，若FLAG為true時回手札
              ],
            },
            texts: [
              // play出場時重置. add block到起動列表讓玩家知道效果, 起動列表一有值就要讓玩一個一個進行處理
              // 出現在戰鬥區時，若部隊中沒有供給或補給時將flag設為true
              // 當重整部隊時，部隊中有供給或補給時，將FLAG設為FLASE
              // 回合開始時，若FLAG為true時回手札
              {
                text: "play出場時重置",
                category: {
                  id: "自動型",
                  category: ["起動", ""],
                },
                block: {},
              },
              {
                text: "出現在戰鬥區時，若部隊中沒有供給或補給時將flag設為true",
                category: {
                  id: "自動型",
                  category: ["起動", ""],
                },
                block: {},
              },
            ],
          },
        ],
      },
    ],
    timing: TIMING_CHART[0],
    playerState: [],
    activePlayerID: null,
  },
  immediateEffect: [],
  stackEffect: [],
};
