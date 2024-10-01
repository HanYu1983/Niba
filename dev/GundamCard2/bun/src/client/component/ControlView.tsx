import { useCallback, useMemo } from "react";
import { OnEvent } from "../tool/appContext/eventCenter";
import { loadPrototype } from "../../script";

const TMP_DECK = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
const TMP_DECK2 = ["179001_01A_CH_WT007R_white","179004_01A_CH_WT009R_white","179004_01A_CH_WT010C_white","179007_02A_U_WT027U_white","179007_02A_U_WT027U_white","179008_02A_U_WT034U_white","179008_02A_U_WT034U_white","179008_02A_U_WT034U_white","179014_03B_CH_WT027R_white","179015_04B_U_WT067C_white","179015_04B_U_WT067C_white","179015_04B_U_WT067C_white","179016_04B_U_WT074C_white","179016_04B_U_WT074C_white","179016_04B_U_WT074C_white","179016_04B_U_WT075C_white","179016_04B_U_WT075C_white","179016_04B_U_WT075C_white","179019_01A_C_WT010C_white","179019_01A_C_WT010C_white","179019_02A_U_WT028R_white","179019_02A_U_WT028R_white","179022_06C_CH_WT057R_white","179022_06C_CH_WT057R_white","179022_06C_CH_WT057R_white","179022_06C_U_WT113R_white","179022_06C_U_WT113R_white","179022_06C_U_WT113R_white","179023_06C_CH_WT067C_white","179024_03B_U_WT057U_white","179024_03B_U_WT057U_white","179025_07D_C_WT060U_white","179025_07D_CH_WT075C_white","179025_07D_CH_WT075C_white","179025_07D_CH_WT075C_white","179027_09D_C_WT067R_white","179027_09D_C_WT067R_white","179029_B3C_CH_WT102R_white","179029_B3C_CH_WT103N_white","179029_B3C_U_WT196R_white","179030_11E_C_WT077S_white","179030_11E_C_WT077S_white","179030_11E_C_WT077S_white","179030_11E_CH_WT108N_white","179901_00_C_WT003P_white","179901_00_C_WT003P_white","179901_00_C_WT003P_white","179901_CG_C_WT001P_white","179901_CG_C_WT001P_white","179901_CG_CH_WT002P_white"]

export const ControlView = () => {
  const onClickTest = useCallback(() => {}, []);

  const onClickNewGame = useCallback(async () => {
    const deckA = TMP_DECK2
    const deckB = TMP_DECK
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
