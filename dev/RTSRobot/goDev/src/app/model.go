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
	Entities        []string
	IDSeq           int
	PlayerComponent map[string]interface{}
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
	gameplay.State.EntitySystem.PlayerComponent[id] = true
	return gameplay, nil
}

// FindID is
func FindID(id string) planck.FixtureReducer {
	return func(ctx interface{}, body planck.Body, fixture planck.Fixture) (interface{}, error) {
		if ctx != nil {
			return ctx, nil
		}
		if body.Call("getUserData").String() == id {
			return body, nil
		}
		return nil, nil
	}
}

// Event is
type Event interface{}

// Reducer is
type Reducer func(Gameplay, Event) (Gameplay, error)

// CompReducer is
func CompReducer(fns ...Reducer) Reducer {
	return func(gameplay Gameplay, evt Event) (Gameplay, error) {
		for _, fn := range fns {
			gameplay, err := fn(gameplay, evt)
			if err != nil {
				return gameplay, err
			}
		}
		return gameplay, nil
	}
}

// FixtureReducer is
type FixtureReducer func(gameplay Gameplay, body planck.Body, fixture planck.Fixture, evt Event) (Gameplay, error)

// CompFixtureReducer is
func CompFixtureReducer(fns ...FixtureReducer) Reducer {
	return func(gameplay Gameplay, evt Event) (Gameplay, error) {
		ret, err := planck.ReduceFixtures(gameplay.World, func(ctx interface{}, body planck.Body, fixture planck.Fixture) (interface{}, error) {
			for _, fn := range fns {
				ctx, err := fn(ctx.(Gameplay), body, fixture, evt)
				if err != nil {
					return ctx, err
				}
			}
			return ctx, nil
		}, gameplay)
		if err != nil {
			return gameplay, err
		}
		return ret.(Gameplay), nil
	}
}

// KeyEvent is
type KeyEvent struct {
	Code int
}

// PlayerReducer is
func PlayerReducer(gameplay Gameplay, body planck.Body, fixture planck.Fixture, evt Event) (Gameplay, error) {
	switch evt.(type) {
	case KeyEvent:
	default:
		return gameplay, nil
	}

	id := body.Call("getUserData").String()
	_, hasPlayer := gameplay.State.EntitySystem.PlayerComponent[id]
	if hasPlayer == false {
		return gameplay, nil
	}

	e := evt.(KeyEvent)
	switch e.Code {
	case 32:

	}
	return gameplay, nil
}

var (
	// DefaultGameplay is
	DefaultGameplay = Gameplay{
		planck.World{Object: _planck.Get("World").New(map[string]interface{}{
			"gravity": _planck.Vec2(0, 0),
		})},
		State{
			EntitySystem{
				[]string{},
				0,
				map[string]interface{}{},
			},
			_planck.Vec3(0, 0, 1), _planck.Vec2(640, 400),
		},
	}
	// DefaultReducer is
	DefaultReducer = CompReducer(CompFixtureReducer(PlayerReducer))
)
