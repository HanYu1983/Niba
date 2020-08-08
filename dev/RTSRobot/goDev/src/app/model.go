package app

import (
	"app/planck"
	"strconv"
)

// GetCameraPoint is
func GetCameraPoint(viewport planck.Vec2, camera planck.Vec3, worldPoint planck.Vec2) planck.Vec2 {
	p := planck.Sub(worldPoint, planck.Vec2(camera))
	distFactor := 1.0 / planck.Z(camera)
	p = planck.Mul(p, distFactor)
	p = planck.Add(p, planck.Mul(viewport, 1/2.0))
	return p
}

// EntitySystem is
type EntitySystem struct {
	Entities []string
	IDSeq    int
}

// State is
type State struct {
	EntitySystem EntitySystem
	Camera       planck.Vec3
	Viewport     planck.Vec2
}

// Gameplay is
type Gameplay struct {
	World planck.World
	State State
}

// CreatePlayer is
func CreatePlayer(gameplay Gameplay) (Gameplay, error) {
	id := strconv.Itoa(gameplay.State.EntitySystem.IDSeq)
	gameplay.State.EntitySystem.IDSeq++
	gameplay.State.EntitySystem.Entities = append(gameplay.State.EntitySystem.Entities, id)
	body := gameplay.World.Call("createDynamicBody", map[string]interface{}{
		"position": _planck.Vec2(100, 0),
		"userData": id,
	})
	body.Call("createFixture",
		_planck.Call(
			"Polygon",
			[]planck.Vec2{
				_planck.Vec2(-2, -1),
				_planck.Vec2(2, 0),
				_planck.Vec2(-2, 1),
			},
		),
		map[string]interface{}{
			"density": 1,
		},
	)
	return gameplay, nil
}

// FindID is
func FindID(id string) planck.FixtureReducer {
	return func(ctx interface{}, body planck.Body, fixture planck.Fixture) interface{} {
		if ctx != nil {
			return ctx
		}
		if body.Call("getUserData").String() == id {
			return body
		}
		return nil
	}
}

var (
	// DefaultGameplay is
	DefaultGameplay = Gameplay{
		planck.World{Object: _planck.Get("World").New(map[string]interface{}{
			"gravity": _planck.Vec2(0, 0),
			"mess":    0.0,
		})},
		State{EntitySystem{[]string{}, 0}, _planck.Vec3(0, 0, 1), _planck.Vec2(640, 400)},
	}
)
