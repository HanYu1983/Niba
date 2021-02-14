package v1

import "testing"

func TestGenerateCluster(t *testing.T) {
	pos, err := GenerateCluster(25, 25, 10, 2, 3)
	if err != nil {
		t.Fatal(err)
	}
	t.Error(pos)
}
