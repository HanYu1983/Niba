import { useCallback, useMemo } from "react";
import { OnEvent } from "../tool/appContext/eventCenter";
import { loadPrototype } from "../../script";

const TMP_DECK = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
const TMP_DECK2 = ["179001_01A_CH_WT007R_white","179004_01A_CH_WT009R_white","179004_01A_CH_WT010C_white","179007_02A_U_WT027U_white","179007_02A_U_WT027U_white","179008_02A_U_WT034U_white","179008_02A_U_WT034U_white","179008_02A_U_WT034U_white","179014_03B_CH_WT027R_white","179015_04B_U_WT067C_white","179015_04B_U_WT067C_white","179015_04B_U_WT067C_white","179016_04B_U_WT074C_white","179016_04B_U_WT074C_white","179016_04B_U_WT074C_white","179016_04B_U_WT075C_white","179016_04B_U_WT075C_white","179016_04B_U_WT075C_white","179019_01A_C_WT010C_white","179019_01A_C_WT010C_white","179019_02A_U_WT028R_white","179019_02A_U_WT028R_white","179022_06C_CH_WT057R_white","179022_06C_CH_WT057R_white","179022_06C_CH_WT057R_white","179022_06C_U_WT113R_white","179022_06C_U_WT113R_white","179022_06C_U_WT113R_white","179023_06C_CH_WT067C_white","179024_03B_U_WT057U_white","179024_03B_U_WT057U_white","179025_07D_C_WT060U_white","179025_07D_CH_WT075C_white","179025_07D_CH_WT075C_white","179025_07D_CH_WT075C_white","179027_09D_C_WT067R_white","179027_09D_C_WT067R_white","179029_B3C_CH_WT102R_white","179029_B3C_CH_WT103N_white","179029_B3C_U_WT196R_white","179030_11E_C_WT077S_white","179030_11E_C_WT077S_white","179030_11E_C_WT077S_white","179030_11E_CH_WT108N_white","179901_00_C_WT003P_white","179901_00_C_WT003P_white","179901_00_C_WT003P_white","179901_CG_C_WT001P_white","179901_CG_C_WT001P_white","179901_CG_CH_WT002P_white"]
const TMP_DECK3 = ["179003_01A_C_BN003C_brown","179003_01A_C_BN003C_brown","179003_01A_C_BN003C_brown","179003_01A_U_BN006R_brown_02","179003_01A_U_BN006R_brown_02","179003_01A_U_BN006R_brown_02","179004_01A_O_BN005U_brown","179004_01A_O_BN005U_brown","179014_03B_U_BN046R_brown_haku","179014_03B_U_BN046R_brown_haku","179014_03B_U_BN046R_brown_haku","179015_04B_U_BN057C_brown","179015_04B_U_BN057C_brown","179015_04B_U_BN057C_brown","179016_04B_U_BN066C_brown","179018_05C_C_BN027C_brown","179018_05C_C_BN027C_brown","179018_05C_C_BN027C_brown","179018_05C_C_BN029R_brown","179018_05C_C_BN029R_brown","179022_06C_C_BN036U_brown","179022_06C_C_BN036U_brown","179022_06C_C_BN036U_brown","179022_06C_CH_BN052R_brown","179022_06C_U_BN101R_brown","179022_06C_U_BN101R_brown","179022_06C_U_BN101R_brown","179024_B2B_C_BN041C_brown","179024_B2B_C_BN041C_brown","179024_B2B_C_BN041C_brown","179025_07D_CH_BN066R_brown","179025_07D_U_BN138R_brown","179025_07D_U_BN138R_brown","179025_07D_U_BN138R_brown","179028_10D_U_BN164N_brown","179028_10D_U_BN164N_brown","179028_10D_U_BN164N_brown","179029_05C_U_BN077R_brown","179029_05C_U_BN077R_brown","179029_05C_U_BN077R_brown","179029_06C_C_BN039R_brown","179029_06C_C_BN039R_brown","179029_06C_C_BN039R_brown","179029_B3C_CH_BN088R_brown","179030_11E_U_BN188N_brown","179030_11E_U_BN188N_brown","179030_11E_U_BN188N_brown","179901_09D_C_BN007P_brown","179901_09D_C_BN007P_brown","179901_09D_C_BN007P_brown"]
const TMP_DECK4 = ["179001_01A_U_WT007C_white", "179001_01A_U_WT007C_white", "179003_01A_U_WT001R_white_02", "179003_01A_U_WT005R_white_02", "179003_01A_U_WT005R_white_02", "179003_01A_U_WT005R_white_02", "179007_02A_CH_WT016C_white", "179009_03B_CH_WT020R_white", "179009_03B_CH_WT024C_white", "179011_03B_U_WT040C_white", "179011_03B_U_WT040C_white", "179011_03B_U_WT040C_white", "179015_04B_CH_WT030C_white", "179015_04B_U_WT065C_white", "179019_01A_CH_WT008U_white", "179019_01A_CH_WT008U_white", "179019_01A_CH_WT008U_white", "179019_01A_U_WT006R_white", "179019_01A_U_WT006R_white", "179019_01A_U_WT006R_white", "179020_05C_CH_WT054C_white", "179024_03B_U_WT042U_white", "179024_03B_U_WT042U_white", "179024_03B_U_WT042U_white", "179025_07D_C_WT061C_white", "179025_07D_C_WT061C_white", "179025_07D_C_WT061C_white", "179026_08D_U_WT158C_white", "179026_08D_U_WT158C_white", "179026_08D_U_WT159U_white", "179026_08D_U_WT162C_white", "179026_08D_U_WT162C_white", "179026_08D_U_WT162C_white", "179027_09D_C_WT067R_white", "179028_10D_C_WT073N_white", "179028_10D_C_WT073N_white", "179028_10D_C_WT073N_white", "179029_05C_C_WT047U_white", "179029_05C_CH_WT043U_white", "179029_05C_CH_WT043U_white", "179029_06C_U_WT112C_white", "179029_06C_U_WT112C_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT078R_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_CH_WT002P_white", "179901_CG_U_WT009P_white", "179901_UN_WT003P_white"];

export const ControlView = () => {
  const onClickNewGame = useCallback(async () => {
    const deckA = TMP_DECK2
    const deckB = TMP_DECK
    const prototypeIds = [...deckA, ...deckB]
    await Promise.all(prototypeIds.map(loadPrototype)).then(()=>console.log("loadOK")).catch(console.error)
    OnEvent.next({ id: "OnClickNewGame", deckA: deckA, deckB: deckB });
  }, []);

  const onClickTest = useCallback(async () => {
    const deckA = TMP_DECK
    const deckB = TMP_DECK2
    const prototypeIds = [...deckA, ...deckB]
    await Promise.all(prototypeIds.map(loadPrototype)).then(()=>console.log("loadOK")).catch(console.error)
    OnEvent.next({ id: "OnClickNewGame", deckA: deckA, deckB: deckB });
  }, []);
  // ============== control panel ============= //
  const renderControlPanel = useMemo(() => {
    return (
      <div>
        <button onClick={onClickNewGame}>onClickNewGame</button>
        <button onClick={onClickTest}>onClickTest</button>
      </div>
    );
  }, [onClickTest, onClickNewGame]);
  return renderControlPanel;
};
