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
	BuyRobot,
	BuyPilot,
	BuyWeapon,
	BuyComponent,
	AssocRobotToPilot,
	AssocWeaponToRobot,
	AssocComponentToRobot,
	Gameplay,
}

export enum MenuID {
    Menu1DStartMenu,
	Menu1DLobbyMenu,
	Menu1DRobotListMenu,
	Menu1DPilotListMenu,
	Menu1DWeaponListMenu,
	Menu1DComponentListMenu,
	Menu1DBuyRobotMenu,
	Menu1DBuyPilotMenu,
	Menu1DBuyWeaponMenu,
	Menu1DBuyComponentMenu,
	Menu1DBuyOrSellOrElseMenu,
	Menu1DRobotPilotListMenu,
	Menu1DWeaponRobotListMenu,
	Menu1DComponentRobotListMenu,
	Menu1DAssocOrDisMenu,
	Menu2DUnitMenu,
}