package gamectr

import (
	"fmt"
	"src/game/define"
)

type IGameControllerRobot interface {
	GetRobotMenu(env interface{}) []RobotMenuItem
}

type GameControlState interface{}

type GameControlStateNormal struct{}
type GameControlStateRobotMenu struct {
	Robot IGameControllerRobot
}
type GameControlStateSystemMenu struct {
}
type GameControlStateSelectMovePosition struct {
}

type IGameController interface {
	GetGameControlState() GameControlState
	SetGameControlState(v GameControlState)
	GetRobotByPosition(pos define.Position) (IGameControllerRobot, bool, error)
}

type GameCommand interface{}

type GameCommandClickMap struct {
	Position define.Position
}

type RobotMenuItem struct{}

var (
	RobotMenuItemEmpty = RobotMenuItem{}
)

type GameCommandRobotMenu struct {
	Tips       []RobotMenuItem
	SelectItem RobotMenuItem
}

func GetGameCommand(ctr IGameController) []GameCommand {
	switch state := ctr.GetGameControlState().(type) {
	case GameControlStateNormal:
		return nil
	case GameControlStateRobotMenu:
		return []GameCommand{GameCommandRobotMenu{Tips: state.Robot.GetRobotMenu(ctr)}}
	default:
	}
	return nil
}

func ApplyGameCommand(ctr IGameController, _cmd GameCommand) error {
	switch cmd := _cmd.(type) {
	case GameCommandClickMap:
		robot, exists, err := ctr.GetRobotByPosition(cmd.Position)
		if err != nil {
			return err
		}
		if exists == false {
			ctr.SetGameControlState(GameControlStateSystemMenu{})
			return nil
		}
		ctr.SetGameControlState(GameControlStateRobotMenu{robot})
		return nil
	case GameCommandRobotMenu:
		if cmd.SelectItem == RobotMenuItemEmpty {
			return fmt.Errorf("xxx")
		}
		return nil
	default:
		return nil
	}
}
