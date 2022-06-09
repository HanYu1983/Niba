package app

import (
	"app/p5"
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
	p5Module = p5.Module{Object: js.Global.Get("p5")}
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

			fixturesHolder, err := planck.ReduceFixtures(gameplay.World, func(acc interface{}, body planck.Body, fixture planck.Fixture) (interface{}, error) {
				ret := acc.([]FixtureView)
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
					ret = append(ret, FixtureView{shapeType, ps})
				default:
				}
				return ret, nil
			}, []FixtureView{})

			if err != nil {
				panic(err)
			}
			gameplay.State.Fixtures = fixturesHolder.([]FixtureView)
			output <- gameplay
		}
	}(gameplay, eventCh, gameplayCh)

	go func(input <-chan Gameplay, output chan<- Event) {

		var _gameplay *Gameplay

		p5Module.New(func(p *js.Object) {
			_p5 := p5.P5{Object: p}

			_p5.Set("keyPressed", func(e *js.Object) {
				output <- KeyEvent{e.Get("code").String()}
			})

			_p5.Set("setup", func() {
				p.Call("createCanvas", 640, 480)
			})

			_p5.Set("draw", func() {
				if _gameplay == nil {
					return
				}
				_p5.Call("background", 0)
				_p5.Call("fill", 100)
				_p5.Call("stroke", 255)
				for _, fixtureView := range _gameplay.State.Fixtures {
					_p5.Call("beginShape")
					for _, vertex := range fixtureView.Verties {
						_p5.Call("vertex", vertex.X(), vertex.Y())
					}
					_p5.Call("endShape", _p5.Get("CLOSE"))
				}
			})
		}, "canvas")

		for gameplay := range input {
			_gameplay = &gameplay
		}
		fmt.Println("end")
	}(gameplayCh, eventCh)

	eventCh <- 0
}
