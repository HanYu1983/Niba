package v1

func (v *model) BuyRobot(protoID string) error {
	m, err := BuyRobot(*v, protoID)
	if err != nil {
		return err
	}
	*v = m
	return nil
}
func (v *model) BuyPilot(protoID string) error {
	m, err := BuyPilot(*v, protoID)
	if err != nil {
		return err
	}
	*v = m
	return nil
}
func (v *model) BuyWeapon(protoID string) error {
	m, err := BuyWeapon(*v, protoID)
	if err != nil {
		return err
	}
	*v = m
	return nil
}
func (v *model) BuyComponent(protoID string) error {
	m, err := BuyComponent(*v, protoID)
	if err != nil {
		return err
	}
	*v = m
	return nil
}

func (v *model) AssocRobotPilot(robotID string, pilotID string) error {
	m, err := AssocRobotPilot(*v, robotID, pilotID)
	if err != nil {
		return err
	}
	*v = m
	return nil
}
func (v *model) DissocRobotPilot(robotID string) error {
	m, err := DissocRobotPilot(*v, robotID)
	if err != nil {
		return err
	}
	*v = m
	return nil
}
func (v *model) AssocWeaponRobot(weaponID string, robotID string) error {
	m, err := AssocWeaponRobot(*v, weaponID, robotID)
	if err != nil {
		return err
	}
	*v = m
	return nil
}
func (v *model) DissocWeaponRobot(weaponID string) error {
	m, err := DissocWeaponRobot(*v, weaponID)
	if err != nil {
		return err
	}
	*v = m
	return nil
}
func (v *model) AssocComponentRobot(componentID string, robotID string) error {
	m, err := AssocComponentRobot(*v, componentID, robotID)
	if err != nil {
		return err
	}
	*v = m
	return nil
}
func (v *model) DissocComponentRobot(componentID string) error {
	m, err := DissocComponentRobot(*v, componentID)
	if err != nil {
		return err
	}
	*v = m
	return nil
}
