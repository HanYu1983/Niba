package app

import (
	"app/planck"
	"fmt"
	"strconv"

	"github.com/gopherjs/gopherjs/js"
)

// Console is
type Console struct{ *js.Object }

// Log is
func (c Console) Log(msg ...interface{}) {
	c.Call("log", msg...)
}

var (
	_console = Console{js.Global.Get("console")}
	_planck  = planck.Planck{Object: js.Global.Get("planck")}
)

// Main is
func Main() {
	defer func() {
		if err := recover(); err != nil {
			fmt.Println(err)
			panic(err)
		}
	}()

	gameplay := DefaultGameplay

	var err error
	gameplay, err = CreatePlayer(gameplay)
	if err != nil {
		panic(err)
	}

	planck.ReduceFixtures(gameplay.World, func(acc interface{}, body planck.Body, fixture planck.Fixture) interface{} {
		shape := fixture.Call("getShape")
		shapeType := shape.Call("getType").String()
		switch shapeType {
		case "circle":

		case "polygon":
			verties := shape.Get("m_vertices")
			vertiesLen := verties.Length()
			ps := []planck.Vec2{}
			for i := 0; i < vertiesLen; i++ {
				vertex := verties.Get(strconv.Itoa(i))
				worldPoint := body.Call("getWorldPoint", vertex)
				cameraPoint := GetCameraPoint(gameplay.State.Viewport, gameplay.State.Camera, planck.Vec2{Object: worldPoint})
				ps = append(ps, cameraPoint)
			}
			_console.Log(ps)
		default:
		}
		return acc
	}, nil)

	gameplayCh := make(chan Gameplay)
	go func(gameplay Gameplay, output chan<- Gameplay) {

		output <- gameplay
	}(gameplay, gameplayCh)

	go func(input <-chan Gameplay) {
		select {
		case gameplay := <-input:
			var _ = gameplay
		}
	}(gameplayCh)
}
