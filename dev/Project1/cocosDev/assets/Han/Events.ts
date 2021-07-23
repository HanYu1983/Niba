
const rxjs = (window as any).rxjs

let center: any = null

export type EventSender = {
    onClick: any
    onModel: any
}

export const getEventCenter = (): EventSender => {
    if (center == null) {
        center = {
            onClick: new rxjs.ReplaySubject(),
            onModel: new rxjs.ReplaySubject()
        }
    }
    return center
}