package app

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gopherjs/gopherjs/js"
)

// Println is
func Println(args ...interface{}) {
	js.Global.Get("console").Call("log", args...)
}

// Pet is
type Pet struct {
	name string
}

// New is
func New(name string) *js.Object {
	return js.MakeWrapper(&Pet{name})
}

// Name is
func (p *Pet) Name() string {
	return p.name
}

// SetName is
func (p *Pet) SetName(name string) {
	p.name = name
}

// Test1 is
func Test1() {
	js.Global.Set("pet", map[string]interface{}{
		"New": New,
	})
	Println("XX")
	Println(js.Global.Get("pet"))

	resp, err := http.Get("http://www.yahoo.com.tw")
	Println(resp, err.Error())
}

func sum(s []int, c chan int) {
	sum := 0
	for _, v := range s {
		sum += v
	}
	c <- sum // send sum to c
}

// Test2 is
func Test2() {
	s := []int{7, 2, 8, -9, 4, 0}

	c := make(chan int)
	go sum(s[:len(s)/2], c)
	go sum(s[len(s)/2:], c)
	x, y := <-c, <-c // receive from c

	fmt.Println(x, y, x+y)
}

// Test3 is
func Test3() {
	go func() {
		for true {
			Println("sleep")
			time.Sleep(time.Second)
		}
	}()
}
