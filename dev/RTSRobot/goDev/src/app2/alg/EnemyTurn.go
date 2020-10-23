package alg

import "app2/data"

func EnemyTurn(origin data.Gameplay) (data.Gameplay, error) {
	gameplay := origin
	robots := []data.Robot{}
	for _, ID := range gameplay.Units {
		if robot, is := gameplay.Robots[ID]; is {
			robots = append(robots, robot)
		}
	}
	return gameplay, nil
}
