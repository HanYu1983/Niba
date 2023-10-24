package aerospike_db

import (
	_ "fmt"
	aerospike "github.com/aerospike/aerospike-client-go/v6"
	"log"
	"testing"
)

func TestCreateClient(t *testing.T) {
	var err error
	env, err := CreateEnv()
	if err != nil {
		t.Error(err)
	}
	_, err = CreateClient(env)
	if err != nil {
		t.Error(err)
	}
}
