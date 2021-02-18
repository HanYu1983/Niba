package impl

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
)

func QueryBattleAction(model types.Model, robot protocol.Robot, pilot protocol.Pilot, weapon protocol.Weapon, targetRobot protocol.Robot, targetPilot protocol.Pilot) (int, protocol.Weapon, error) {
	weapons, err := common.QueryRobotWeapons(model, targetRobot.ID, targetRobot.Transform)
	if err != nil {
		return protocol.BattleMenuActionPending, protocol.Weapon{}, err
	}
	if len(weapons) == 0 {
		return protocol.BattleMenuActionPending, protocol.Weapon{}, nil
	}
	invalidWeapons, err := CheckInvalidWeapons(model, targetRobot, weapons)
	if err != nil {
		return protocol.BattleMenuActionPending, protocol.Weapon{}, err
	}
	for weaponID, weapon := range weapons {
		_, isInvalid := invalidWeapons[weaponID]
		if isInvalid {
			continue
		}
		return protocol.BattleMenuActionAttack, weapon, nil
	}
	return protocol.BattleMenuActionCanNotMove, protocol.Weapon{}, nil
}
