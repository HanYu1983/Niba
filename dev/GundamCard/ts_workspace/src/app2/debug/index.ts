import {
  addBlock,
  BlockContext,
  DEFAULT_BLOCK_CONTEXT,
} from "../../tool/block";
import {
  BlockPayload,
  DEFAULT_BLOCK_PAYLOAD,
  RequireTarget,
  RequireYesNo,
} from "../tool/model/blockPayload";
import {
  GameContext,
  doBlockRequire,
  doBlockFeedback,
  DEFAULT_GAME_CONTEXT,
  setRequireAnswer,
  setRequireTarget,
} from "../tool/model/gameContext";
import {
  DEFAULT_SCRIPT_CONTEXT,
  mapBlockPayloadRequire,
} from "../tool/model/scriptContext";

export function testSetAnswer() {
  const require1: RequireYesNo = {
    id: "RequireYesNo",
    key: "問題1",
    answer: null,
  };
  const require2: RequireTarget = {
    id: "RequireTarget",
    key: "問題2",
    targets: [null, null],
  };
  const require3: RequireTarget = {
    id: "RequireTarget",
    key: "問題3",
    targets: [null, null],
  };
  const payload1: BlockPayload = {
    ...DEFAULT_BLOCK_PAYLOAD,
    require: {
      id: "RequireAnd",
      and: [
        require1,
        {
          id: "RequireOr",
          or: [require2, require3],
        },
      ],
    },
  };
  let ctx: GameContext = {
    ...DEFAULT_GAME_CONTEXT,
    scriptContext: {
      ...DEFAULT_SCRIPT_CONTEXT,
      blockContext: {
        ...DEFAULT_BLOCK_CONTEXT,
        blocks: [
          {
            id: "0",
            payload: payload1,
            createdTime: 0,
          },
        ],
      },
    },
  };
  mapBlockPayloadRequire(ctx.scriptContext, (require) => {
    if (require.key == null) {
      return require;
    }
    if (require.key != require1.key) {
      return require;
    }
    if (require.id != "RequireYesNo") {
      return require;
    }
    if (require.answer != null) {
      throw new Error("answer must null");
    }
    return require;
  });
  ctx = setRequireAnswer(ctx, require1.key || "", true);
  mapBlockPayloadRequire(ctx.scriptContext, (require) => {
    if (require.key == null) {
      return require;
    }
    if (require.key != require1.key) {
      return require;
    }
    if (require.id != "RequireYesNo") {
      return require;
    }
    if (require.answer == null) {
      throw new Error("answer must not null");
    }
    return require;
  });

  ctx = setRequireTarget(ctx, require2.key || "", 1, {
    id: "カード",
    cardID: "a card",
  });

  mapBlockPayloadRequire(ctx.scriptContext, (require) => {
    if (require.key == null) {
      return require;
    }
    if (require.key != require1.key) {
      return require;
    }
    if (require.id != "RequireTarget") {
      return require;
    }
    if (require.targets[1] == null) {
      throw new Error("targets[1] must not null");
    }
    return require;
  });
}

export function test() {
  [testSetAnswer].forEach((testF) => {
    console.log(`============${testF.name}===========`);
    testF();
  });
}
