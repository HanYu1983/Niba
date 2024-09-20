import * as http from 'http';
import { createGameStateWithFlowMemory, GameStateWithFlowMemory } from '../gameStateWithFlowMemory/GameStateWithFlowMemory';
import { queryFlow } from '../gameStateWithFlowMemory/queryFlow';
import { Flow } from '../gameStateWithFlowMemory/Flow';
import { applyFlow } from '../gameStateWithFlowMemory/applyFlow';
import { PlayerA, PlayerB } from '../define/PlayerID';
import { setActivePlayerID } from '../gameState/ActivePlayerComponent';
import { createCardWithProtoIds } from '../gameState/CardTableComponent';
import { AbsoluteBaSyouFn } from '../define/BaSyou';
import { loadPrototype } from '../../script';
const url = require('url');

type RouterDef = {
    path: string,
    method: "GET" | "POST",
    handler: (req: any, res: any, params: any) => void;
}

export async function createServer() {
    let ctx = createGameStateWithFlowMemory()
    ctx = setActivePlayerID(ctx, PlayerA) as GameStateWithFlowMemory
    const blackT3 = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
    await Promise.all(blackT3.map(loadPrototype))
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国"), blackT3) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "本国"), blackT3) as GameStateWithFlowMemory
    function getGameState() {
        return ctx
    }
    function queryCommand(playerId: string): Flow[] {
        return queryFlow(ctx, playerId)
    }
    function applyCommand(playerId: string, cmd: Flow) {
        ctx = applyFlow(ctx, playerId, cmd)
    }
    function handlePlayer(playerId: string) {
        return (req: http.IncomingMessage, res: http.ServerResponse, params: any) => {
            if (params.flow) {
                const flow = JSON.parse(params.flow)
                try {
                    applyCommand(playerId, flow)
                } catch (e: any) {
                    res.statusCode = 404;
                    return res.end(e.message)
                }
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html; charset=utf-8'); // Added charset=utf-8 for UTF-8 support
            let html = ""
            const cmds = queryCommand(playerId)
            cmds.forEach(cmd => {
                switch (cmd.id) {
                    case "FlowSetActiveEffectID": {
                        cmd.tips.forEach(tip => {
                            cmd.effectID = tip.id
                            html += `<form method='post'>
                            <textarea name='flow'>${JSON.stringify(cmd)}</textarea>
                            <input type='submit' value='${tip.description}'>
                        </form>`
                        })
                        break;
                    }
                    default: {
                        html += `<form method='post'>
                        <textarea name='flow'>${JSON.stringify(cmd)}</textarea>
                        <input type='submit' value='${cmd.description}'>
                    </form>`
                        break;
                    }
                }

            })
            return res.end(html);
        }
    }

    const routers: RouterDef[] = [
        {
            path: "/api/v1/gameState/0/",
            method: "GET",
            handler: (req: http.IncomingMessage, res: http.ServerResponse) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json; charset=utf-8'); // Added charset=utf-8 for UTF-8 support
                res.end(JSON.stringify(getGameState(), null, 2));
            }
        },
        {
            path: "/api/v1/gameState/0/PlayerA",
            method: "GET",
            handler: handlePlayer(PlayerA)
        },
        {
            path: "/api/v1/gameState/0/PlayerA",
            method: "POST",
            handler: handlePlayer(PlayerA)
        },
        {
            path: "/api/v1/gameState/0/PlayerB",
            method: "GET",
            handler: handlePlayer(PlayerB)
        },
        {
            path: "/api/v1/gameState/0/PlayerB",
            method: "POST",
            handler: handlePlayer(PlayerB)
        },
    ]

    const server = http.createServer((req, res) => {
        const parsedUrl = url.parse(req.url);
        const router = routers.find(router => router.path === parsedUrl.pathname && router.method === req.method);
        if (router) {
            if (req.method === 'POST') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    const postData = require('querystring').parse(body);
                    router.handler(req, res, postData);
                });
            } else {
                const queryParams = require('querystring').parse(parsedUrl.query);
                router.handler(req, res, queryParams);
            }
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8'); // Added charset=utf-8 for UTF-8 support
            res.end('Not Found\n');
        }
    });

    server.listen(3000, '127.0.0.1', () => {
        console.log('Server running at http://127.0.0.1:3000/');
    });
}