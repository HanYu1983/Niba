import { Expr, jsonfp } from "../tool/tool/basic/jsonfpHelper";
import { createCard } from "../../tool/table";
import { getCardState } from "../tool/alg/helper";
import { getBaShouID, PlayerA } from "../tool/tool/basic/basic";
import { DEFAULT_GAME_CONTEXT } from "../tool/tool/basic/gameContext";

export function testJsonfp() {
  {
    const ctx = {};
    const ret = jsonfp.apply(
      ctx,
      [{ name: "w" }, { name: "g" }],
      [
        {
          $name: { map: "$in.name" },
          ret1: { "->": [5, { multiply: { clone: null } }] },
          response: { "->": ["$name", { add: "gan!" }] },
        },
        // eval會把結果移到ctx中
        {
          $eval: {
            $name: { map: "$in.name" },
            response: { "->": ["$name", { add: "gan!" }] },
          },
        },
      ]
    );
    console.log(ctx, ret);
  }

  {
    var jsquare = {
      "->": [{ random: null }, { multiply: { clone: null } }],
    };
    var jexpr = {
      ret1: {
        "->": [
          // iterator的下一個值代表初值
          [{ "stream/iterator": { start: 1, end: "$in" } }, 3],
          { reduce: "add" },
        ],
      },
      ret2: {
        "->": [
          [
            {
              "->": [
                { "stream/iterator": { start: 1, end: "$in" } },
                {
                  "->": [
                    {
                      map: {
                        "->": [
                          [jsquare, jsquare],
                          { reduce: "add" },
                          { subtract: 1 },
                          { "<=": 0 },
                        ],
                      },
                    },
                    { reduce: "add" },
                  ],
                },
              ],
            },
            100,
          ],
          { reduce: "add" },
        ],
      },
    };
    const ctx = {};
    // iterate 2000 times
    const ret2 = jsonfp.apply(ctx, 10, jexpr);
    console.log(ctx, ret2);
  }

  {
    // 把輸入的值當成變量e, 再把e放到物件中的wow變數
    const p = {
      formula: {
        var: "e",
        expr: { wow: "e" },
      },
    };
    const ctx = {};
    const result = jsonfp.apply(ctx, { def: { pick: "name" } }, p);
    console.log(ctx, result);
  }
  {
    // merge == zip + merge
    var list = [{ name: "John" }, { name: "Kate" }, { xx: 0 }];
    var p = {
      merge: [{ project: "coServ" }, { project: "JSON-fp" }, { xx2: 1 }],
    };
    var result = jsonfp.apply(list, p);
    console.log(result);
  }

  {
    var avgTemplate = {
      formula: {
        var: "@prop",
        expr: {
          "->": [
            [
              { "->": [{ map: { getter: "@prop" } }, { reduce: "add" }] },
              { size: null },
            ],
            { reduce: "divide" },
          ],
        },
      },
    };

    // now we'll use eval to perform the variable substitution
    var program = {
      $stat: {
        // 這層eval很像不需要
        //eval: {
        era: {
          eval: {
            "->": ["era", avgTemplate],
          },
        },
        salary: {
          eval: {
            "->": ["salary", avgTemplate],
          },
        },
        // },
      },
      pitchers: {
        filter: {
          "->": [
            [
              { "->": [{ getter: "era" }, { "<": "$stat.era" }] },
              { "->": [{ getter: "salary" }, { "<": "$stat.salary" }] },
            ],
            { reduce: "and" },
          ],
        },
      },

      $test_era: {
        // convert在這種情況下等於eval
        convert: {
          var: { "@prop": "era" },
          formula: avgTemplate,
        },
      },
      $test_salary: {
        // convert在這種情況下等於eval
        convert: {
          var: { "@prop": "salary" },
          formula: avgTemplate,
        },
      },
      test_pitchers: {
        filter: {
          "->": [
            [
              { "->": [{ getter: "era" }, { "<": "$test_era" }] },
              { "->": [{ getter: "salary" }, { "<": "$test_salary" }] },
            ],
            { reduce: "and" },
          ],
        },
      },
    };

    var pitchers = [
      { name: "Ventura", era: 3.2, salary: 500500 },
      { name: "Price", era: 3.26, salary: 19750000 },
      { name: "Kershaw", era: 1.77, salary: 32517428 },
      { name: "Gray", era: 3.08, salary: 505000 },
      { name: "Liriano", era: 3.38, salary: 11666666 },
      { name: "Hammel", era: 3.47, salary: 23500000 },
      { name: "Lester", era: 2.46, salary: 20000000 },
      { name: "Bumgarner", era: 2.98, salary: 6950000 },
      { name: "Chen", era: 3.54, salary: 4750000 },
      { name: "Norris", era: 3.65, salary: 8800000 },
    ];

    var ctx = {},
      result = jsonfp.apply(ctx, pitchers, program);

    console.log(ctx, result);
  }
}

export function testJsonfp2() {
  jsonfp.addMethod("customFn", (input: any, p: any) => {
    console.log(input, p);
    return {
      xx: 0,
      xx2: p.gameContext,
    };
  });

  const gameContext = DEFAULT_GAME_CONTEXT;
  const ctx = {
    gameContext: gameContext,
  };

  const result = jsonfp.apply(ctx, "wow", {
    ret1: "$in",
    ret2: {
      customFn: {
        gameContext: "$gameContext",
        gan: "x",
        ret3: {
          "->": [[0, 1, 2], { reduce: "add" }],
        },
      },
    },
    ret3: {
      "->": [[0, 1, 2], { reduce: "add" }],
    },
    ctx: "$gameContext.gameState.table",
  });
  console.log(ctx, result);

  jsonfp.removeMethod("customFn");
}

export function testJsonfp3() {
  jsonfp.addMethod("cardState", (cardID: any, p: any) => {
    const [_, cardState] = getCardState(p.ctx, cardID);
    return cardState;
  });
  jsonfp.addMethod("cardPower", (cardID: any, p: any) => {
    return 9;
  });
  jsonfp.addMethod("cardRole", (cardID: any, p: any) => {
    return "";
  });

  let ctx = DEFAULT_GAME_CONTEXT;
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      table: {
        ...ctx.gameState.table,
        cardStack: {
          ...ctx.gameState.table.cardStack,
          [getBaShouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "手札"],
          })]: [
            {
              id: "a",
              protoID: "179025_07D_U_RD156R_red",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
          ],
          [getBaShouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "Gゾーン"],
          })]: [
            {
              id: "g1",
              protoID: "179030_11E_G_RD021N_red",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
            {
              id: "g2",
              protoID: "179030_11E_G_RD021N_red",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
          ],
        },
      },
    },
  };

  const conditionExpr: Expr = {
    "->": [
      {
        "->": [
          {
            "->": [
              "$targets.cardA.value",
              { map: { cardPower: { ctx: "$ctx" } } },
              { map: { ">": 100 } },
              { reduce: "and" },
            ],
          },
        ],
      },
      { reduce: "add" },
    ],
  };

  const expr = {
    $ctx: "$in.ctx",
    $cause: {},
    $targets: {
      cardA: {
        id: "カード",
        value: ["a"],
      },
    },
    $condition: {
      "->": [
        [
          {
            "->": [
              "$targets.cardA.value",
              { map: { cardPower: { ctx: "$ctx" } } },
              { map: { ">": 100 } },
              { reduce: "and" },
            ],
          },
          {
            "->": [
              "$targets.cardA.value",
              { map: { gSign: { ctx: "$ctx" } } },
              { map: { gSignColor: { ctx: "$ctx" } } },
              { map: { "==": "白" } },
              { reduce: "and" },
            ],
          },
        ],
        { reduce: "and" },
      ],
    },
    $action: {
      "->": ["$ctx", { getter: "gameState" }, { getter: "table" }],
    },
    targets: "$targets",
    condition: "$condition",
    result: "$action",

    ret1: "$self",
  };

  const ret = jsonfp.apply(
    {
      ctx,
    },
    {
      $ctx: "$in.ctx",
      $cause: {},
      $targets: {
        cardA: {
          id: "カード",
          value: ["a"],
        },
      },
      $condition: {
        "->": [
          [
            {
              "->": [
                "$targets.cardA.value",
                { map: { cardPower: { ctx: "$ctx" } } },
                { map: { ">": 100 } },
                { reduce: "and" },
              ],
            },
            {
              "->": [
                "$targets.cardA.value",
                { map: { gSign: { ctx: "$ctx" } } },
                { map: { gSignColor: { ctx: "$ctx" } } },
                { map: { "==": "白" } },
                { reduce: "and" },
              ],
            },
          ],
          { reduce: "and" },
        ],
      },
      $action: {
        "->": ["$ctx", { getter: "gameState" }, { getter: "table" }],
      },
      targets: "$targets",
      condition: "$condition",
      result: "$action",

      ret1: "$self",
    }
  );
  console.log(ret);
}
