package ai

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
	"fmt"
	"testing"
)

func TestCore(t *testing.T) {
	model := types.Model{}
	model, pilot1, err := common.NewPilot(model, protocol.Pilot{ProtoID: "amuro"})
	model, pilot2, err := common.NewPilot(model, protocol.Pilot{ProtoID: "amuro"})
	model, robot1, err := common.NewRobot(model, protocol.Position{0, 0}, protocol.Robot{ProtoID: "gundam", PlayerID: "ai1", PilotID: pilot1.ID})
	if err != nil {
		t.Fatal(err)
	}
	model, robot2, err := common.NewRobot(model, protocol.Position{0, 0}, protocol.Robot{ProtoID: "gundam", PlayerID: "ai1", PilotID: pilot2.ID})
	if err != nil {
		t.Fatal(err)
	}
	model, err = Strategy(model, "ai1", []string{robot1.ID, robot2.ID})
	if err != nil {
		t.Fatal(err)
	}
	fmt.Print(model)
	t.Error("x")
}
