package main

import (
	"encoding/json"
	"log"
	"net/http"

	openrtb2 "github.com/prebid/openrtb/v20/openrtb2"
)

func main() {
	http.HandleFunc("/bigRequest", func(w http.ResponseWriter, r *http.Request) {
		bidResponse := openrtb2.BidResponse{
			SeatBid: []openrtb2.SeatBid{
				{
					Seat: "wow",
				},
			},
		}
		jsonBytes, err := json.Marshal((bidResponse))
		if err != nil {
			w.Write(([]byte(err.Error())))
			return
		}
		w.Write(jsonBytes)
	})

	log.Print("listen localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
