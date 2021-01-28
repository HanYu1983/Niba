package gameplay

import (
	"app/tool/data"
	"strconv"
)

func CreateRobot(origin data.Gameplay) (data.Gameplay, error) {
	gameplay := origin
	ID := strconv.Itoa(gameplay.SeqID)
	gameplay.SeqID++
	gameplay.Units = append(gameplay.Units, ID)
	gameplay.Robots = protocol.AssocStringRobot(gameplay.Robots, ID, protocol.Robot{ID: ID})
	gameplay.Positions = data.AssocStringPosition(gameplay.Positions, ID, protocol.Position{0, 0})
	return gameplay, nil
}
