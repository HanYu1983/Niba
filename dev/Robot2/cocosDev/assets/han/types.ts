export type UI = any

export type View = {
    Render: (ui: UI) => void,
    Alert: (msg: string) => void,
}

export type Model = {
    OnKeyDown: (evt: any) => void,
    OnKeyUp: (evt: any) => void,
    Flush: () => void,
}

export enum Page {
    Start, 
    Lobby, 
    Gameplay,
}

export enum MenuID {
    Menu1DStartMenu,
    Menu1DLobbyMenu,
	Menu1DBuyRobotMenu,
	Menu1DBuyPilotMenu,
    Menu2DUnitMenu,
}