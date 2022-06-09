package ai

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
	"testing"
	"tool/nodejs/mlkmeans"
)

func TestQueryTeamTarget(t *testing.T) {
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
	myTeams := mlkmeans.KMeansResult{
		Clusters: []int{0, 1},
	}
	targetTeams := mlkmeans.KMeansResult{
		Clusters: []int{0, 1},
	}
	teamTarget, find, err := QueryTeamTarget(model, []string{robot1.ID, robot2.ID}, myTeams, []string{robot1.ID, robot2.ID}, targetTeams)
	if err != nil {
		t.Fatal(err)
	}
	if find == false {
		t.Fatal("find must true")
	}
	for i, tid := range teamTarget {
		if i != tid {
			t.Fatal("i must == tid")
		}
	}
}
