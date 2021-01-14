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

// 改成使用下面的Const, 送. 改完後我就刪除
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

// 改成使用下面的Const, 送. 改完後我就刪除
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

export enum Const {
	PageStart,
	PageLobby,
	PageBuyRobot,
	PageBuyPilot,
	PageBuyWeapon,
	PageBuyComponent,
	PageAssocRobotToPilot,
	PageAssocWeaponToRobot,
	PageAssocComponentToRobot,
	PageMultiUnitSelection,
	PageGameplay,
	PageUnitMenu,
	PageSystemMenu,
	PageBattleMenu,

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
	Menu1DMultiUnitSelectionMenu,
	Menu2DUnitMenu,
	Menu1DSystemMenu,
	BattleMenuUnitBattleMenu,
}