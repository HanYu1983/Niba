package v1

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
)

func NewRobot(origin Model, position protocol.Position, robot protocol.Robot) (Model, protocol.Robot, error) {
	model, robot, err := common.NewRobot(types.Model(origin), position, robot)
	return Model(model), robot, err
}
