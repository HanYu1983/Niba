package app3

import (
	"testing"
)

func TestGame(t *testing.T) {
	gameplay := Gameplay{
		ActivePlayerID: "A",
		Step:           StepBody,
	}
	cmds, err := QueryFunction(gameplay, "A")
	if err != nil {
		t.Error(err)
	}

	t.Error(cmds)
}
