package impl

import "testing"

func TestGenerateCluster(t *testing.T) {
	_, err := GenerateCluster(25, 25, 10, 2, 3)
	if err != nil {
		t.Fatal(err)
	}
}
