package main

import (
	appdomain "define/app_domain"
	citydomain "define/city_domain"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main2() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}

func main() {
	var app = appdomain.AppDomain{}
	citydomain.GetBuilding(app.CityDomain, "")
}
