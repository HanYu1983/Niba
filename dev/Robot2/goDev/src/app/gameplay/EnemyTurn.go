package gameplay

import "app/tool/data"

func EnemyTurn(origin data.Gameplay, playerID string) (data.Gameplay, error) {
	gameplay := origin
	robots := []data.Robot{}
	for _, ID := range gameplay.Units {
		if robot, is := gameplay.Robots[ID]; is {
			robots = append(robots, robot)
		}
	}
	return gameplay, nil
}
