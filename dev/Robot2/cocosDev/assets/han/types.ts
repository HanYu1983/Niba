export type UI = any

export type View = {
    Render: (ui: UI) => void,
    Alert: (msg: string) => void,
}

export type Model = {
    OnKeyDown: (evt: any) => void,
    OnKeyUp: (evt: any) => void,
    Flush: ()=>void,
}