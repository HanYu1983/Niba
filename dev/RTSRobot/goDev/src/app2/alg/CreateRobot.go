package alg

import (
	"app2/data"
	"strconv"
)

func CreateRobot(origin data.Gameplay) (data.Gameplay, error) {
	gameplay := origin
	ID := strconv.Itoa(gameplay.SeqID)
	gameplay.SeqID++
	gameplay.Units = append(gameplay.Units, ID)
	gameplay.Robots = data.AssocStringRobot(gameplay.Robots, ID, data.Robot{ID: ID})
	gameplay.Positions = data.AssocStringPosition(gameplay.Positions, ID, data.Position{0, 0})
	return gameplay, nil
}
