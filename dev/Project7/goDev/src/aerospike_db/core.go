package aerospike_db

import (
	"crypto/tls"
	"fmt"
	"log"
	"os"
	"time"

	aerospike "github.com/aerospike/aerospike-client-go/v6"
)

type Env struct {
	Address      string
	ApiKeyId     string
	ApiKeySecert string
}

func CreateEnv() (Env, error) {
	keys := []string{"AEROSPIKE_CLOUD_HOSTNAME", "AEROSPIKE_CLOUD_API_KEY_ID", "AEROSPIKE_CLOUD_API_KEY_SECRET"}
	values := []string{}
	for _, k := range keys {
		v := os.Getenv(k)
		if v == "" {
			return Env{}, fmt.Errorf("env %s not found", k)
		}
		values = append(values, v)
	}
	return Env{
		Address:      values[0],
		ApiKeyId:     values[1],
		ApiKeySecert: values[2],
	}, nil
}

func CreateClient(env Env) (*aerospike.ProxyClient, error) {
	address := env.Address
	apiKeyId := env.ApiKeyId
	apiKeySecret := env.ApiKeySecert
	port := 4000
	host := aerospike.NewHost(address, port)
	clientPolicy := aerospike.NewClientPolicy()
	clientPolicy.User = apiKeyId
	clientPolicy.Password = apiKeySecret
	clientPolicy.TlsConfig = &tls.Config{}
	client, err := aerospike.NewProxyClientWithPolicyAndHost(clientPolicy, host)
	if err != nil {
		return nil, err
	}
	return client, nil
}

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

func Test2() {
	var err error
	env, err := CreateEnv()
	if err != nil {
		log.Fatal(err)
	}
	client, err := CreateClient(env)
	if err != nil {
		log.Fatal(err)
	}
	println(client)
	namespace := "aerospike_cloud"
	set := "test"
	key, err := aerospike.NewKey(namespace, set, "addkey")
	if err != nil {
		log.Fatal(err)
	}
	writePolicy := aerospike.NewWritePolicy(0, 0)
	client.Delete(writePolicy, key)
	readPolicy := aerospike.NewPolicy()

	binName := "binName"
	bin := aerospike.NewBin(binName, 10)
	log.Printf("Initial add will create record.  Initial value is %s\n", bin.Value)
	client.AddBins(writePolicy, key, bin)

	bin = aerospike.NewBin(binName, 5)
	log.Printf("Add %s to existing record.\n", bin.Value)
	client.AddBins(writePolicy, key, bin)

	record, err := client.Get(readPolicy, key, bin.Name)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("%#v\n", record)
}

func Test3() {
	var err error
	env, err := CreateEnv()
	if err != nil {
		log.Fatal(err)
	}
	client, err := CreateClient(env)
	if err != nil {
		log.Fatal(err)
	}
	namespace := "aerospike_cloud"
	set := "test"
	binName := "bin1"
	if false {
		// NOT SUPPORTED
		indexName := "bin1_mapkey"
		writePolicy := aerospike.NewWritePolicy(0, 0)
		// Do not timeout on index create.
		writePolicy.SocketTimeout = 0
		writePolicy.TotalTimeout = 0 * time.Millisecond
		// task, err := client.CreateIndex(writePolicy, namespace, set, indexName, binName, aerospike.STRING)
		task, err := client.CreateComplexIndex(writePolicy, namespace, set, indexName, binName, aerospike.STRING, aerospike.ICT_MAPKEYS)
		if err != nil {
			log.Fatal(err)
		}
		<-task.OnComplete()
	}

	mapKeyPrefix := "mapKeyPrefix"
	if false {
		keyPrefix := "keyPrefix"
		valuePrefix := "valuePrefix"
		// Specify that record expires 120 seconds after it's written.
		policy := aerospike.NewWritePolicy(0, 120)
		// policy.SendKey = true
		// policy.TotalTimeout = 10000 * time.Millisecond
		for i := 1; i <= 100; i++ {
			key, err := aerospike.NewKey(namespace, set, fmt.Sprintf("%v%v", keyPrefix, i))
			if err != nil {
				log.Fatal(err)
			}
			reportMap := map[string]interface{}{}
			reportMap[fmt.Sprintf("%v%v", mapKeyPrefix, 1)] = fmt.Sprintf("%v%v", valuePrefix, 1)
			if i%2 == 0 {
				reportMap[fmt.Sprintf("%v%v", mapKeyPrefix, 2)] = fmt.Sprintf("%v%v", valuePrefix, 2)
			}
			if i%3 == 0 {
				reportMap[fmt.Sprintf("%v%v", mapKeyPrefix, 3)] = fmt.Sprintf("%v%v", valuePrefix, 3)
			}
			bin := aerospike.NewBin(binName, reportMap)
			client.PutBins(policy, key, bin)
		}
	}

	if true {
		var _ = mapKeyPrefix
		var _ = binName
		stm := aerospike.NewStatement(namespace, set, binName)
		stm.SetFilter(aerospike.NewContainsFilter(binName, aerospike.ICT_MAPKEYS, fmt.Sprintf("%v%v", mapKeyPrefix, 3)))
		recordSet, err := client.Query(aerospike.NewQueryPolicy(), stm)
		if err != nil {
			log.Fatal(err)
		}
		// 必須要在後台設定secondary index，不然不會回傳
		for rec := range recordSet.Results() {
			log.Printf("%#v\n%#v\n===============\n", rec.Record.Key, rec.Record.Bins)
		}
	}
}

func Test4() {
	var err error
	env, err := CreateEnv()
	if err != nil {
		log.Fatal(err)
	}
	client, err := CreateClient(env)
	if err != nil {
		log.Fatal(err)
	}
	namespace := "aerospike_cloud"
	set := "Test4"
	if false {
		// 這裡若指定過期時間為120秒, 會出現錯誤:FAIL_FORBIDDEN, 原因不明
		// policy := aerospike.NewWritePolicy(0, 120)
		policy := aerospike.NewWritePolicy(0, 0)
		// policy.SendKey = true
		// policy.TotalTimeout = 10000 * time.Millisecond
		var _ = policy
		for i := 1; i <= 10; i++ {
			key, err := aerospike.NewKey(namespace, set, fmt.Sprintf("key%v", i))
			var _ = key
			if err != nil {
				log.Fatal(err)
			}
			nameBin := aerospike.NewBin("name", fmt.Sprintf("name_%v", i))
			scoreBin := aerospike.NewBin("score", i)
			var _ = scoreBin
			err = client.PutBins(policy, key, nameBin, scoreBin)
			if err != nil {
				log.Fatal(err)
			}
		}
	}
	if true {
		stm := aerospike.NewStatement(namespace, set)
		stm.SetFilter(aerospike.NewRangeFilter("score", 3, 8))
		queryPolicy := aerospike.NewQueryPolicy()
		// exp := aerospike.ExpRegexCompare("^.*apple.*", aerospike.ExpRegexFlagICASE, aerospike.ExpKey(aerospike.ExpTypeSTRING))
		// queryPolicy.FilterExpression = exp
		recordSet, err := client.Query(queryPolicy, stm)
		if err != nil {
			log.Fatal(err)
		}
		// 必須要在後台設定secondary index，不然不會回傳
		// type => Numeric, collectionType => None
		for rec := range recordSet.Results() {
			log.Printf("%#v\n", rec.Record.Bins)

			readPolicy := aerospike.NewPolicy()
			readPolicy.TotalTimeout = 5000 * time.Millisecond
			record, err := client.Get(readPolicy, rec.Record.Key)
			if err != nil {
				log.Fatal(err)
			}
			log.Printf("%#v\n", record.Bins)
		}
	}
}

func Test() {
	Test4()
}
