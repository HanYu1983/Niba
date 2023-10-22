package main

import (
	"log"

	aerospike "github.com/aerospike/aerospike-client-go/v6"
)

func main() {
	address := "http://localhost"
	port := 3000
	client, err := aerospike.NewClient(address, port)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()
	println("end")
}
