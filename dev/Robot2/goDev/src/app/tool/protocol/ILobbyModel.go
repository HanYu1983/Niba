package protocol

type ILobbyModel interface {
	BuyRobot(id string) (IModel, error)
	BuyPilot(id string) (IModel, error)
	BuyWeapon(id string) (IModel, error)
	BuyComponent(id string) (IModel, error)
	AssocRobotPilot(robotID string, pilotID string) (IModel, error)
	DissocRobotPilot(robotID string) (IModel, error)
	AssocWeaponRobot(weaponID string, robotID string) (IModel, error)
	DissocWeaponRobot(weaponID string) (IModel, error)
	AssocComponentRobot(componentID string, robotID string) (IModel, error)
	DissocComponentRobot(componentID string) (IModel, error)
}
