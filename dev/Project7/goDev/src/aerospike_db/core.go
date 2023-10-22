package aerospike_db

import (
	"crypto/tls"
	"fmt"
	"log"
	"os"
	"time"

	aerospike "github.com/aerospike/aerospike-client-go/v6"
)

func Test1() {
	address := os.Getenv("AEROSPIKE_CLOUD_HOSTNAME")            // Aerospike Cloud cluster address
	port := 4000                                                // Aerospike Cloud cluster port
	host := aerospike.NewHost(address, port)                    // Create host
	apiKeyId := os.Getenv("AEROSPIKE_CLOUD_API_KEY_ID")         // API Key ID from Aerospike Cloud account
	apiKeySecret := os.Getenv("AEROSPIKE_CLOUD_API_KEY_SECRET") // API Key secret from Aerospike Cloud account
	println(address)
	println(apiKeyId)
	println(apiKeySecret)
	// Create a ClientPolicy passing in your API credentials
	// and setting up TLS (required for Aerospike Cloud)
	clientPolicy := aerospike.NewClientPolicy()
	clientPolicy.User = apiKeyId
	clientPolicy.Password = apiKeySecret
	clientPolicy.TlsConfig = &tls.Config{}

	namespace := "aerospike_cloud"

	// Create the client and connect to the database
	client, err := aerospike.NewProxyClientWithPolicyAndHost(clientPolicy, host)

	// address := "http://localhost" // Aerospike Cloud cluster address
	// port := 3000                  // Aerospike Cloud cluster port
	// namespace := "test"           // Cluster namespace
	// client, err := aerospike.NewClient(address, port)

	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()

	println("NewWritePolicy!")

	// Create new write policy
	policy := aerospike.NewWritePolicy(0, 0)
	policy.SendKey = true
	policy.TotalTimeout = 10000 * time.Millisecond

	// Create the record key
	key, err := aerospike.NewKey(namespace, "ufodata", 5001)
	if err != nil {
		log.Fatal(err)
	}

	// Create a list of shapes to add to the report map
	shape := []string{"circle", "flash", "disc"}

	// Create the report map
	reportMap := map[string]interface{}{
		"city":     "Ann Arbor",
		"state":    "Michigan",
		"shape":    shape,
		"duration": "5 minutes",
		"summary":  "Large flying disc flashed in the sky above the student union. Craziest thing I've ever seen!"}

	// Format coordinates as a GeoJSON string
	geoLoc := "{\"type\":\"Point\", \"coordinates\":[42.2808,83.7430]}"

	// Create the bins as Bin("binName", value)
	occurred := aerospike.NewBin("occurred", 20220531)
	reported := aerospike.NewBin("reported", 20220601)
	posted := aerospike.NewBin("posted", 20220601)
	// reportMap defined in the section above
	report := aerospike.NewBin("report", reportMap)
	// geoLoc defined in the section above
	location := aerospike.NewBin("location", aerospike.NewGeoJSONValue(geoLoc))

	println("PutBins =================")
	// Write the record to Aerospike
	err = client.PutBins(policy, key, occurred, reported, posted, report, location)
	if err != nil {
		log.Fatal(err)
	}

	readPolicy := aerospike.NewPolicy()
	readPolicy.TotalTimeout = 5000 * time.Millisecond

	// Read the record
	record, err := client.Get(readPolicy, key)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Record: %s", record.Bins)
	{
		// Creates a key with the namespace "sandbox", set "ufodata", and user key 5001
		key, err := aerospike.NewKey(namespace, "ufodata", 5001)
		if err != nil {
			log.Fatal(err)
		}

		// Create posted bin to insert
		posted := aerospike.NewBin("posted", 20220602)

		// Update the record
		record, err := client.Operate(nil, key,
			aerospike.PutOp(posted),
			aerospike.MapPutOp(aerospike.DefaultMapPolicy(), "report", aerospike.NewValue("city"), aerospike.NewValue("Ypsilanti")),
			aerospike.GetBinOp("report"))
		if err != nil {
			log.Fatal(err)
		}

		// Do something
		fmt.Printf("Record: %v", record.Bins)
	}
}
