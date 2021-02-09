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

// 不使用了, 改用BattleMenuAction. 這個enum之後會刪掉
export enum BattleAction {
	BattleActionAttack,
	BattleActionGuard,
	BattleActionEvade,
}

export enum BattleMenuAction {
	BattleMenuActionPending,
	BattleMenuActionAttack,
	BattleMenuActionGuard,
	BattleMenuActionEvade,
}

export enum RobotMenuFunction {
	RobotMenuFunctionPending,
	RobotMenuFunctionWeapon,
	RobotMenuFunctionTransform,
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

export enum BattleResultType {
	BattleResultTypePending,
	BattleResultTypeAim,
	BattleResultTypeWeapon,
	BattleResultTypeGuard,
	BattleResultTypeEvade,
	BattleResultTypeDamage
}