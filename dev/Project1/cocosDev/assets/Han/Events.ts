const rxjs = (window as any).rxjs

let center: any = null

export type EventSender = {
    onClick: any
    onModel: any
    onEntityCreate: any,
    onEntityDestroy: any,
    onDirective: any,
}
// cocos2d在引用js時只支援動態建立的方式，不能靜態建立，不然會找不到套件(此例中就是rxjs會是undefined)
export const getEventCenter = (): EventSender => {
    if (center == null) {
        center = {
            onClick: new rxjs.Subject(),
            onModel: new rxjs.ReplaySubject(),
            onEntityCreate: new rxjs.ReplaySubject(),
            onEntityDestroy: new rxjs.ReplaySubject(),
            onDirective: new rxjs.Subject()
        }
    }
    return center
}