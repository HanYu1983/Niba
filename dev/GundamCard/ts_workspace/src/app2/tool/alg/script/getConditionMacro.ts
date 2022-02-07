import { Block } from "typescript";
import {
  Action,
  ActionDeleteFlag,
  ActionJsonfp,
  ActionMoveCardToPosition,
  ActionTriggerGameEvent,
} from "../../tool/basic/action";
import {
  BaSyou,
  BaSyouKeyword,
  CardColor,
  CardRole,
  CardText,
  CardTextSiYouKaTa,
  CardTextZiDouKaTa,
  DEFAULT_CARD_TEXT_SIYOU_KATA,
  GameEvent,
  Phase,
  PlayerA,
  PlayerB,
  RelatedBaSyou,
  RelatedPlayerSideKeyword,
  SiYouTiming,
  TIMING_CHART,
} from "../../tool/basic/basic";
import {
  createRollCostRequire,
  RequireTarget,
  Require,
  BlockPayload,
  FeedbackAction,
  BlockPayloadCauseDestroy,
} from "../../tool/basic/blockPayload";
import { Condition } from "../../tool/basic/condition";
import { DestroyReason } from "../../tool/basic/gameContext";
import { TargetTypeCard } from "../../tool/basic/targetType";

type ConditionMacro1 = {
  id: "變量x的角色包含於y";
  x: TargetTypeCard;
  y: CardRole[];
};

type ConditionMacro2 = {
  id: "變量x的是y軍";
  x: TargetTypeCard;
  y: RelatedPlayerSideKeyword;
};

type ConditionMacro3 = {
  id: "變量x的場所包含於y";
  x: TargetTypeCard;
  y: BaSyou[];
};

type ConditionMacro4 = {
  id: "當觸發GameEvent的變量x的id時";
  x: GameEvent;
};

type ConditionMacro5 = {
  id: "這張卡在場時";
};

type ConditionMacro6 = {
  id: "變量字串x的第一個元素是破壞中";
  x: string;
};

type ConditionMacro7 = {
  id: "變量x的是交戰中";
  x: TargetTypeCard;
};

type ConditionMacro8 = {
  id: "このカードがx的idで破壊されている場合";
  x: DestroyReason;
};

type ConditionMacro9 = {
  id: "ターン終了時まで";
};

type ConditionMacro10 = {
  id: "このカードは、「専用機のセット」が成立するユニットにセットされている場合";
};

type ConditionMacro11 = {
  id: "ターン開始時";
};

type ConditionMacro12 = {
  id: "是主動玩家";
};

export type ConditionMacro =
  | ConditionMacro1
  | ConditionMacro2
  | ConditionMacro3
  | ConditionMacro4
  | ConditionMacro5
  | ConditionMacro6
  | ConditionMacro7
  | ConditionMacro8
  | ConditionMacro9
  | ConditionMacro10
  | ConditionMacro11
  | ConditionMacro12;

export function getConditionMacro(macro: ConditionMacro): Condition {
  switch (macro.id) {
    case "是主動玩家":
      return {
        id: "ConditionJsonfp",
        program: {
          $cardID: {
            "->": [
              "$in.blockPayload",
              { getter: "cause" },
              { getter: "cardID" },
              { log: "cardID" },
            ],
          },
          $cardController: {
            "->": [
              "$in.ctx",
              { getCardController: "$cardID" },
              { log: "cardController" },
            ],
          },
          $activePlayerID: {
            "->": [
              "$in.ctx",
              { getter: "gameState" },
              { getter: "activePlayerID" },
              { log: "activePlayerID" },
            ],
          },
          pass1: {
            if: [
              {
                "->": ["$cardController", { "==": "$activePlayerID" }],
              },
              {},
              { error: `必須是主動玩家` },
            ],
          },
        },
      };
    case "このカードは、「専用機のセット」が成立するユニットにセットされている場合":
      return {
        id: "ConditionJsonfp",
        program: {
          $cardID: {
            "->": [
              "$in.blockPayload",
              { getter: "cause" },
              { getter: "cardID" },
            ],
          },
          $unitCardID: {
            "->": ["$in.ctx", { getSetGroupRoot: "$cardID" }],
          },
          pass1: {
            if: [
              {
                "->": [
                  "$in.ctx",
                  {
                    isMaster: {
                      unitCardID: "$unitCardID",
                      cardID: "$cardID",
                    },
                  },
                ],
              },
              {},
              { error: "必須成立專用機" },
            ],
          },
        },
      };
    case "ターン終了時まで":
      return {
        id: "ConditionJsonfp",
        program: {
          pass1: {
            if: [
              {
                "->": [
                  "$in.blockPayload",
                  { getter: "cause" },
                  { getter: "gameEvent" },
                  { getter: "timing" },
                  { log: "timing" },
                  { getter: 1 },
                  { getter: 2 },
                  {
                    "==": {
                      "->": [
                        [
                          "戦闘フェイズ",
                          "ターン終了時",
                          "効果終了。ターン終了",
                        ] as Phase,
                        { getter: 2 },
                      ],
                    },
                  },
                ],
              },
              {},
              { error: "必須是回結束" },
            ],
          },
        },
      };
    case "ターン開始時":
      return {
        id: "ConditionJsonfp",
        program: {
          pass1: {
            if: [
              {
                "->": [
                  "$in.blockPayload",
                  { getter: "cause" },
                  { getter: "gameEvent" },
                  { getter: "timing" },
                  { log: "timing" },
                  { getter: 0 },
                  {
                    "==": 0,
                  },
                ],
              },
              {},
              { error: "必須是回合開始" },
            ],
          },
        },
      };
    case "このカードがx的idで破壊されている場合":
      return {
        id: "ConditionJsonfp",
        program: {
          $cardID: {
            "->": [
              "$in.blockPayload",
              { getter: "cause" },
              { getter: "cardID" },
              { log: "cardID" },
            ],
          },
          pass1: {
            if: [
              {
                "->": [
                  "$in.ctx",
                  // jsonfp不用比對null, 因為自定方法回傳null的情況，在jsonfp會轉成空物件{}
                  { getDestroyReason: "$cardID" },
                  { getter: "id" },
                  { "==": macro.x.id },
                ],
              },
              {},
              { error: `必須是被${macro.x.id}破壞` },
            ],
          },
        },
      };
    case "變量x的是交戰中":
      return {
        id: "ConditionCompareBoolean",
        value: [
          {
            id: "布林",
            value: {
              path: [macro.x, "在「交戦中」？"],
            },
          },
          "==",
          {
            id: "布林",
            value: [true],
          },
        ],
      };
    case "變量字串x的第一個元素是破壞中":
      return {
        id: "ConditionJsonfp",
        program: {
          $cardID: {
            "->": [
              "$in.targets",
              { getter: macro.x },
              { getter: "value" },
              { getter: 0 },
              { log: "cardID" },
            ],
          },
          pass1: {
            if: [
              {
                "->": [
                  "$in.ctx",
                  { getDestroyReason: "$cardID" },
                  { stringify: null },
                  { log: "stringify" },
                  { "!=": "{}" },
                ],
              },
              {},
              { error: `必須被破壞:${macro.x}` },
            ],
          },
        },
      };
    case "當觸發GameEvent的變量x的id時":
      return {
        id: "ConditionJsonfp",
        program: {
          pass1: {
            if: [
              {
                "->": [
                  "$in.blockPayload",
                  { log: "blockPayload" },
                  { getter: "cause" },
                  { getter: "id" },
                  { "==": "BlockPayloadCauseGameEvent" },
                ],
              },
              {},
              { error: "事件必須是BlockPayloadCauseGameEvent" },
            ],
          },
          pass2: {
            if: [
              {
                "->": [
                  "$in.blockPayload",
                  { log: "blockPayload" },
                  { getter: "cause" },
                  { getter: "gameEvent" },
                  { getter: "id" },
                  { "==": macro.x.id },
                ],
              },
              {},
              { error: `事件必須是${macro.x.id}` },
            ],
          },
        },
      };
    case "變量x的場所包含於y":
      return {
        id: "ConditionCompareBaSyou",
        value: [
          {
            id: "場所",
            value: {
              path: [macro.x, "的「場所」"],
            },
          },
          "in",
          {
            id: "場所",
            value: macro.y,
          },
        ],
      };
    case "變量x的是y軍":
      return {
        id: "ConditionComparePlayer",
        value: [
          {
            id: "プレーヤー",
            value: {
              path: [macro.x, "的「コントローラー」"],
            },
          },
          "==",
          {
            id: "プレーヤー",
            value: {
              path: [{ id: macro.y }],
            },
          },
        ],
      };
    case "變量x的角色包含於y":
      return {
        id: "ConditionCompareRole",
        value: [
          {
            id: "「カード」的角色",
            value: {
              path: [macro.x, "的角色"],
            },
          },
          "in",
          {
            id: "「カード」的角色",
            value: macro.y,
          },
        ],
      };
    case "這張卡在場時":
      return getConditionMacro({
        id: "變量x的場所包含於y",
        x: { id: "カード", value: { path: [{ id: "このカード" }] } },
        y: [
          { id: "RelatedBaSyou", value: ["自軍", "Gゾーン"] },
          { id: "RelatedBaSyou", value: ["自軍", "配備エリア"] },
          { id: "RelatedBaSyou", value: ["自軍", "戦闘エリア（左）"] },
          { id: "RelatedBaSyou", value: ["自軍", "戦闘エリア（右）"] },
        ],
      });
  }
}
