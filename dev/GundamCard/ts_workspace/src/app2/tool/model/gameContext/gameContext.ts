import { Timing, TIMING_CHART } from "../basic";
import { ScriptContext, DEFAULT_SCRIPT_CONTEXT } from "../scriptContext";
import { DEFAULT_TABLE, Table } from "../../../../tool/table";

export type PlayerState = {
  turn: number;
  playGCount: number;
  confirmPhase: boolean;
};

export type CardState = {
  playerID: string;
  live: number;
  destroy: boolean;
  setGroupID: string;
  memory: any;
};

export type GameState = {
  table: Table;
  cardState: { [key: string]: CardState | undefined };
  timing: Timing;
  playerState: { [key: string]: PlayerState | undefined };
  activePlayerID: string | null;
};

export type GameContext = {
  gameState: GameState;
  scriptContext: ScriptContext;
};

export const DEFAULT_GAME_CONTEXT: GameContext = {
  gameState: {
    table: DEFAULT_TABLE,
    cardState: {},
    timing: TIMING_CHART[0],
    playerState: {},
    activePlayerID: null,
  },
  scriptContext: DEFAULT_SCRIPT_CONTEXT,
};
