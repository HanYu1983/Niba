package app

import (
	"fmt"
	"time"

	"github.com/gopherjs/gopherjs/js"
	"github.com/rafaeldias/async"
	"github.com/ricardolonga/jsongo"
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

	//resp, err := http.Get("http://www.yahoo.com.tw")
	//Println(resp, err.Error())
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

func fib(p, c int) (int, int) {
	return c, p + c
}

// Test4 is
func Test4() {

	// execution in series.
	res, e := async.Waterfall(async.Tasks{
		fib,
		fib,
		fib,
		func(p, c int) (int, error) {
			return c, nil
		},
	}, 0, 1)

	if e != nil {
		fmt.Printf("Error executing a Waterfall (%s)\n", e.Error())
	}

	fmt.Println(res[0].(int)) // Prints 3
}

// Test5 is
func Test5() {
	// cannot find package "github.com/cenkalti/backoff/v4"
	/*
		ch := make(chan rxgo.Item)
		go func() {
			for i := 0; i < 3; i++ {
				ch <- rxgo.Of(i)
			}
			close(ch)
		}()
		observable := rxgo.FromChannel(ch)

		// First Observer
		for item := range observable.Observe() {
			fmt.Println(item.V)
		}

		// Second Observer
		for item := range observable.Observe() {
			fmt.Println(item.V)
		}
	*/
}

// Test6 is
func Test6() {
	json := jsongo.Object().Put("name", "Ricardo Longa").
		Put("idade", 28).
		Put("owner", true).
		Put("skills", jsongo.Array().Put("Golang").
			Put("Android"))
	Println(json)
}

// Test7 is
func Test7() {
	js.Global.Get("p5").New(func(p *js.Object) {
		p.Set("setup", func() {
			p.Call("createCanvas", 800, 640)
		})
		p.Set("draw", func() {
			p.Call("background", 0)
			p.Call("fill", 100)
			p.Call("stroke", 255)
			p.Call("ellipse", 100, 100, 50, 50)
		})
	}, "canvas")
}
