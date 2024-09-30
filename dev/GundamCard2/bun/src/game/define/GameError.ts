

export type GameErrorInfo = {
    isPlayGLimit?: boolean,
    hasSameText?: boolean
}

export class GameError extends Error {
    info: GameErrorInfo
    constructor(message: any, info?: GameErrorInfo) {
        super(message);
        this.name = "GameError";
        this.info = info || {}
    }
}

// 在選完對象後效果進入堆疊後只能丟出這個
// 因為不包含TipError，
// 所以支付完費用後進入堆疊的效果不能出現TipError，比如執行時要取得對象時(ItemStateFn.getTip)
// 若出現代表程式流程有誤，
// 堆疊裡的效果只能經過以下:
// 若效果引發新的效果時一定會先經過可支付 性的判斷才能加入堆疊(addImmediateEffectIfCanPayCost)，
// 出卡或內文等臨時建立的效果也會在flow的流程中經過可支付性的判斷(getPlayerCommandsFilterNoErrorDistinct)，
// ActionTitleFn中就丟TargetMissingError，非預期錯誤則丟Error
export class TargetMissingError extends GameError {
    constructor(message: any, info?: GameErrorInfo) {
        super(message, info);
        this.name = "TargetMissingError";
    }
}

// 只能在提示對象時補捉，其中包含TargetMissingError
// TipFn.checkTipSatisfies
// ItemStateFn.getTip
// ConditionTitleFn中就丟TipError，非預期錯誤則丟Error
export class TipError extends TargetMissingError {
    constructor(message: any, info?: GameErrorInfo) {
        super(message, info);
        this.name = "TipError";
    }
}