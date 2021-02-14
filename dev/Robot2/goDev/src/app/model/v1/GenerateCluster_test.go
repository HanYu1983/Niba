package v1

import (
	"testing"
)

func TestGenerateCluster(t *testing.T) {
	_, err := GenerateCluster(20, 20, 10, 2, 10)
	if err != nil {
		t.Fatal(err)
	}
}
