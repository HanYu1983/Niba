package impl_ver1.flows;

/** 非友方有駐軍城池落地後之多階段對峙流程（僅 {@link GameMatchCore} 使用）。 */
enum HostileCityPhase {
  /** 攻方（當前行動君主）選過路費／談判／消耗戰／攻城戰／單挑。 */
  AttackerChoosing;
  /** 守方應對：單挑時選將，否則僅確認結束。 */
  DefenderResponse;
  /** 攻方閱讀預算結算並確認。 */
  AttackerSettlement;
}
