import { useCallback, useMemo } from "react";
import { OnEvent } from "../tool/appContext/eventCenter";
import { loadPrototype } from "../../script";

const DECK_BLACK_T3 = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
const DECK_WHITE_SPEED = ["179001_01A_CH_WT007R_white", "179004_01A_CH_WT009R_white", "179004_01A_CH_WT010C_white", "179007_02A_U_WT027U_white", "179007_02A_U_WT027U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179014_03B_CH_WT027R_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179019_01A_C_WT010C_white", "179019_01A_C_WT010C_white", "179019_02A_U_WT028R_white", "179019_02A_U_WT028R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179023_06C_CH_WT067C_white", "179024_03B_U_WT057U_white", "179024_03B_U_WT057U_white", "179025_07D_C_WT060U_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179027_09D_C_WT067R_white", "179027_09D_C_WT067R_white", "179029_B3C_CH_WT102R_white", "179029_B3C_CH_WT103N_white", "179029_B3C_U_WT196R_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_CH_WT108N_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_CH_WT002P_white"]
const DECK_W_RANGE = ["179001_01A_CH_WT006C_white", "179003_01A_O_WT001C_white", "179003_01A_O_WT001C_white", "179003_01A_O_WT001C_white", "179003_01A_U_WT011C_white", "179003_01A_U_WT011C_white", "179003_01A_U_WT011C_white", "179009_03B_U_WT044U_white", "179009_03B_U_WT044U_white", "179009_03B_U_WT044U_white", "179009_03B_U_WT045U_white", "179009_03B_U_WT045U_white", "179009_03B_U_WT045U_white", "179015_04B_O_WT005U_white", "179015_04B_O_WT005U_white", "179015_04B_O_WT005U_white", "179019_01A_U_WT003C_white", "179019_01A_U_WT003C_white", "179019_01A_U_WT003C_white", "179019_02A_C_WT012U_white", "179019_02A_C_WT012U_white", "179019_02A_C_WT012U_white", "179019_02A_U_WT031C_white", "179019_02A_U_WT031C_white", "179019_02A_U_WT031C_white", "179023_06C_C_WT055C_white", "179023_06C_C_WT055C_white", "179023_06C_C_WT055C_white", "179024_03B_U_WT039R_white", "179024_03B_U_WT039R_white", "179024_03B_U_WT039R_white", "179024_03B_U_WT042U_white", "179024_03B_U_WT042U_white", "179024_03B_U_WT042U_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179027_09D_O_WT014N_white", "179027_09D_O_WT014N_white", "179027_09D_O_WT014N_white", "179028_10D_CH_WT095_white", "179028_10D_U_WT177R_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT078R_white", "179030_11E_C_WT078R_white", "179030_11E_C_WT078R_white", "179901_00_U_WT001P_white_02", "179901_00_U_WT001P_white_02", "179901_00_U_WT001P_white_02"]
const DECK_GREEN_APU = ["179003_01A_C_GN003R_green", "179003_01A_CH_GN001R_green", "179003_01A_U_GN001R_green", "179003_01A_U_GN001R_green", "179003_01A_U_GN001R_green", "179003_01A_U_GN008R_green_02", "179003_01A_U_GN008R_green_02", "179003_01A_U_GN008R_green_02", "179007_02A_U_GN020R_green", "179009_03B_U_GN036U_green", "179009_03B_U_GN036U_green", "179009_03B_U_GN036U_green", "179009_03B_U_GN037C_green", "179009_03B_U_GN037C_green", "179009_03B_U_GN037C_green", "179009_03B_U_GN042R_green", "179009_03B_U_GN042R_green", "179009_03B_U_GN042R_green", "179015_04B_CH_GN030R_green", "179015_04B_U_GN053U_green", "179015_04B_U_GN055R_green_haku", "179015_04B_U_GN055R_green_haku", "179016_04B_CH_GN035R_green", "179016_04B_CH_GN036C_green", "179016_04B_CH_GN036C_green", "179018_05C_U_GN082U_green", "179019_02A_U_GN024U_green", "179019_02A_U_GN024U_green", "179019_02A_U_GN024U_green", "179024_B2B_C_GN052C_green", "179025_07D_C_GN056U_green", "179025_07D_CH_GN070C_green", "179029_05C_U_GN077R_green", "179030_11E_C_GN074R_green", "179030_11E_CH_GN093N_green", "179030_11E_CH_GN094R_green", "179030_11E_U_GN184N_green", "179030_11E_U_GN184N_green", "179030_11E_U_GN184N_green", "179031_12E_CH_GN096R_green", "179901_00_C_GN007P_green", "179901_00_C_GN007P_green", "179901_00_C_GN007P_green", "179901_00_U_GN001P_green_02", "179901_00_U_GN002P_green_02", "179901_CG_CH_GN001P_green", "179901_CG_U_GN003P_green", "179901_CG_U_GN003P_green", "179901_CG_U_GN008P_green", "179901_CG_U_GN008P_green"]
const DECK_BROWN_GOD = ["179003_01A_C_BN003C_brown", "179003_01A_C_BN003C_brown", "179003_01A_C_BN003C_brown", "179003_01A_U_BN006R_brown_02", "179003_01A_U_BN006R_brown_02", "179003_01A_U_BN006R_brown_02", "179004_01A_O_BN005U_brown", "179004_01A_O_BN005U_brown", "179014_03B_U_BN046R_brown_haku", "179014_03B_U_BN046R_brown_haku", "179014_03B_U_BN046R_brown_haku", "179015_04B_U_BN057C_brown", "179015_04B_U_BN057C_brown", "179015_04B_U_BN057C_brown", "179016_04B_U_BN066C_brown", "179018_05C_C_BN027C_brown", "179018_05C_C_BN027C_brown", "179018_05C_C_BN027C_brown", "179018_05C_C_BN029R_brown", "179018_05C_C_BN029R_brown", "179022_06C_C_BN036U_brown", "179022_06C_C_BN036U_brown", "179022_06C_C_BN036U_brown", "179022_06C_CH_BN052R_brown", "179022_06C_U_BN101R_brown", "179022_06C_U_BN101R_brown", "179022_06C_U_BN101R_brown", "179024_B2B_C_BN041C_brown", "179024_B2B_C_BN041C_brown", "179024_B2B_C_BN041C_brown", "179025_07D_CH_BN066R_brown", "179025_07D_U_BN138R_brown", "179025_07D_U_BN138R_brown", "179025_07D_U_BN138R_brown", "179028_10D_U_BN164N_brown", "179028_10D_U_BN164N_brown", "179028_10D_U_BN164N_brown", "179029_05C_U_BN077R_brown", "179029_05C_U_BN077R_brown", "179029_05C_U_BN077R_brown", "179029_06C_C_BN039R_brown", "179029_06C_C_BN039R_brown", "179029_06C_C_BN039R_brown", "179029_B3C_CH_BN088R_brown", "179030_11E_U_BN188N_brown", "179030_11E_U_BN188N_brown", "179030_11E_U_BN188N_brown", "179901_09D_C_BN007P_brown", "179901_09D_C_BN007P_brown", "179901_09D_C_BN007P_brown"]
const DECK_W = ["179001_01A_U_WT007C_white", "179001_01A_U_WT007C_white", "179003_01A_U_WT001R_white_02", "179003_01A_U_WT005R_white_02", "179003_01A_U_WT005R_white_02", "179003_01A_U_WT005R_white_02", "179007_02A_CH_WT016C_white", "179009_03B_CH_WT020R_white", "179009_03B_CH_WT024C_white", "179011_03B_U_WT040C_white", "179011_03B_U_WT040C_white", "179011_03B_U_WT040C_white", "179015_04B_CH_WT030C_white", "179015_04B_U_WT065C_white", "179019_01A_CH_WT008U_white", "179019_01A_CH_WT008U_white", "179019_01A_CH_WT008U_white", "179019_01A_U_WT006R_white", "179019_01A_U_WT006R_white", "179019_01A_U_WT006R_white", "179020_05C_CH_WT054C_white", "179024_03B_U_WT042U_white", "179024_03B_U_WT042U_white", "179024_03B_U_WT042U_white", "179025_07D_C_WT061C_white", "179025_07D_C_WT061C_white", "179025_07D_C_WT061C_white", "179026_08D_U_WT158C_white", "179026_08D_U_WT158C_white", "179026_08D_U_WT159U_white", "179026_08D_U_WT162C_white", "179026_08D_U_WT162C_white", "179026_08D_U_WT162C_white", "179027_09D_C_WT067R_white", "179028_10D_C_WT073N_white", "179028_10D_C_WT073N_white", "179028_10D_C_WT073N_white", "179029_05C_C_WT047U_white", "179029_05C_CH_WT043U_white", "179029_05C_CH_WT043U_white", "179029_06C_U_WT112C_white", "179029_06C_U_WT112C_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT078R_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_CH_WT002P_white", "179901_CG_U_WT009P_white", "179901_UN_WT003P_white"];

export const ControlView = () => {
  const onClickStart1 = useCallback(async () => {
    const deckA = DECK_W_RANGE
    const deckB = DECK_WHITE_SPEED
    const prototypeIds = [...deckA, ...deckB]
    await Promise.all(prototypeIds.map(loadPrototype)).then(() => console.log("loadOK")).catch(console.error)
    OnEvent.next({ id: "OnClickNewGame", deckA: deckA, deckB: deckB });
  }, []);

  const onClickStart2 = useCallback(async () => {
    const deckA = DECK_BLACK_T3
    const deckB = DECK_WHITE_SPEED
    const prototypeIds = [...deckA, ...deckB]
    await Promise.all(prototypeIds.map(loadPrototype)).then(() => console.log("loadOK")).catch(console.error)
    OnEvent.next({ id: "OnClickNewGame", deckA: deckA, deckB: deckB });
  }, []);

  const onClickStart3 = useCallback(async () => {
    const deckA = DECK_BLACK_T3
    const deckB = DECK_W_RANGE
    const prototypeIds = [...deckA, ...deckB]
    await Promise.all(prototypeIds.map(loadPrototype)).then(() => console.log("loadOK")).catch(console.error)
    OnEvent.next({ id: "OnClickNewGame", deckA: deckA, deckB: deckB });
  }, []);

  const onClickStart4 = useCallback(async () => {
    const deckA = DECK_GREEN_APU
    const deckB = DECK_W_RANGE
    const prototypeIds = [...deckA, ...deckB]
    await Promise.all(prototypeIds.map(loadPrototype)).then(() => console.log("loadOK")).catch(console.error)
    OnEvent.next({ id: "OnClickNewGame", deckA: deckA, deckB: deckB });
  }, []);

  const onClickStart5 = useCallback(async () => {
    const deckA = DECK_W_RANGE
    const deckB = DECK_BLACK_T3
    const prototypeIds = [...deckA, ...deckB]
    await Promise.all(prototypeIds.map(loadPrototype)).then(() => console.log("loadOK")).catch(console.error)
    OnEvent.next({ id: "OnClickNewGame", deckA: deckA, deckB: deckB });
  }, []);

  const onClickStart6 = useCallback(async () => {
    const deckA = DECK_W_RANGE
    const deckB = DECK_GREEN_APU
    const prototypeIds = [...deckA, ...deckB]
    await Promise.all(prototypeIds.map(loadPrototype)).then(() => console.log("loadOK")).catch(console.error)
    OnEvent.next({ id: "OnClickNewGame", deckA: deckA, deckB: deckB });
  }, []);

  const onClickStart7 = useCallback(async () => {
    const deckA = DECK_GREEN_APU
    const deckB = DECK_WHITE_SPEED
    const prototypeIds = [...deckA, ...deckB]
    await Promise.all(prototypeIds.map(loadPrototype)).then(() => console.log("loadOK")).catch(console.error)
    OnEvent.next({ id: "OnClickNewGame", deckA: deckA, deckB: deckB });
  }, []);

  const onClickStart8 = useCallback(async () => {
    const deckA = DECK_GREEN_APU
    const deckB = DECK_BLACK_T3
    const prototypeIds = [...deckA, ...deckB]
    await Promise.all(prototypeIds.map(loadPrototype)).then(() => console.log("loadOK")).catch(console.error)
    OnEvent.next({ id: "OnClickNewGame", deckA: deckA, deckB: deckB });
  }, []);
  // ============== control panel ============= //
  const renderControlPanel = useMemo(() => {
    return (
      <div>
        <button onClick={onClickStart1}>白範兵對白速攻</button>
        <button onClick={onClickStart2}>黑T3對白速攻</button>
        <button onClick={onClickStart3}>黑T3對白範兵</button>
        <button onClick={onClickStart4}>綠阿普對白範兵</button>
        <button onClick={onClickStart5}>白範兵對黑T3</button>
        <button onClick={onClickStart7}>綠阿普對白速攻</button>
        <button onClick={onClickStart8}>綠阿普對黑T3</button>
      </div>
    );
  }, [onClickStart2, onClickStart1]);
  return renderControlPanel;
};
