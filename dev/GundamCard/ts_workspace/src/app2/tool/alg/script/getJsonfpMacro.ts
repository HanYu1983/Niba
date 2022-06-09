type JsonfpMacro1 = {
  id: "這張卡" | "事件的卡" | "事件的卡是這張卡";
};

export type JsonfpMacro = JsonfpMacro1;

export function getJsonfpMacro(macro: JsonfpMacro): any {
  switch (macro.id) {
    case "事件的卡":
      return {
        "->": [
          "$in.blockPayload",
          { getter: "cause" },
          { getter: "gameEvent" },
          { getter: "cardID" },
        ],
      };
    case "這張卡":
      return {
        "->": ["$in.blockPayload", { getter: "cause" }, { getter: "cardID" }],
      };
    case "事件的卡是這張卡":
      return {
        [macro.id]: {
          if: [
            {
              "->": ["$cardID", { "==": "$gameEventCardID" }],
            },
            {},
            { error: macro.id },
          ],
        },
      };
  }
}

export const INJECT_JSONFP_MACRO = {
  $cardID: getJsonfpMacro({ id: "這張卡" }),
  $gameEventCardID: getJsonfpMacro({ id: "事件的卡" }),
};
