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

export enum PlayerID {
	PlayerIDPlayer = "PlayerIDPlayer"
}

export enum BattleAction {
	BattleActionAttack,
	BattleActionGuard,
	BattleActionEvade,
}

export enum RobotMenuFunction {
	RobotMenuFunctionPending,
	RobotMenuFunctionWeapon,
	RobotMenuFunctionTransform,
}

export enum Const {
	PageStart                 = "PageStart",
	PageLobby                 = "PageLobby",
	PageBuyRobot              = "PageBuyRobot",
	PageBuyPilot              = "PageBuyPilot",
	PageBuyWeapon             = "PageBuyWeapon",
	PageBuyComponent          = "PageBuyComponent",
	PageAssocRobotToPilot     = "PageAssocRobotToPilot",
	PageAssocWeaponToRobot    = "PageAssocWeaponToRobot",
	PageAssocComponentToRobot = "PageAssocComponentToRobot",
	PageMultiUnitSelection    = "PageMultiUnitSelection",
	PageGameplay              = "PageGameplay",
	PageUnitMenu              = "PageUnitMenu",
	PageSystemMenu            = "PageSystemMenu",
	PageBattleMenu            = "PageBattleMenu",

	Menu1DStartMenu              = "Menu1DStartMenu",
	Menu1DLobbyMenu              = "Menu1DLobbyMenu",
	Menu1DRobotListMenu          = "Menu1DRobotListMenu",
	Menu1DPilotListMenu          = "Menu1DPilotListMenu",
	Menu1DWeaponListMenu         = "Menu1DWeaponListMenu",
	Menu1DComponentListMenu      = "Menu1DComponentListMenu",
	Menu1DBuyRobotMenu           = "Menu1DBuyRobotMenu",
	Menu1DBuyPilotMenu           = "Menu1DBuyPilotMenu",
	Menu1DBuyWeaponMenu          = "Menu1DBuyWeaponMenu",
	Menu1DBuyComponentMenu       = "Menu1DBuyComponentMenu",
	Menu1DBuyOrSellOrElseMenu    = "Menu1DBuyOrSellOrElseMenu",
	Menu1DRobotPilotListMenu     = "Menu1DRobotPilotListMenu",
	Menu1DWeaponRobotListMenu    = "Menu1DWeaponRobotListMenu",
	Menu1DComponentRobotListMenu = "Menu1DComponentRobotListMenu",
	Menu1DAssocOrDisMenu         = "Menu1DAssocOrDisMenu",
	Menu1DMultiUnitSelectionMenu = "Menu1DMultiUnitSelectionMenu",
	Menu2DUnitMenu               = "Menu2DUnitMenu",
	Menu1DSystemMenu             = "Menu1DSystemMenu",
	BattleMenuUnitBattleMenu     = "BattleMenuUnitBattleMenu",
}

export enum BattleResultType {
	BattleResultTypePending,
	BattleResultTypeAim,
	BattleResultTypeWeapon,
	BattleResultTypeGuard,
	BattleResultTypeEvade,
	BattleResultTypeDamage
}