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

	planck.ReduceFixtures(gameplay.World, func(acc interface{}, body planck.Body, fixture planck.Fixture) (interface{}, error) {
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
		return acc, nil
	}, nil)

	find, _ := planck.ReduceFixtures(gameplay.World, FindID("0"), nil)
	_console.Log("find", find)

	_console.Log(gameplay.State)

	eventCh := make(chan Event)
	gameplayCh := make(chan Gameplay)
	go func(gameplay Gameplay, input <-chan Event, output chan<- Gameplay) {
		defer close(output)
		defer func() {
			if err := recover(); err != nil {
				fmt.Println(err)
				return
			}
		}()
		for evt := range input {
			gameplay, err = DefaultReducer(gameplay, evt)
			if err != nil {
				panic(err)
			}
			output <- gameplay
		}
	}(gameplay, eventCh, gameplayCh)

	go func(input <-chan Gameplay, output chan<- Event) {
		for gameplay := range input {
			fmt.Println(gameplay.State)
		}
		fmt.Println("end")
	}(gameplayCh, eventCh)

	eventCh <- 0
}
