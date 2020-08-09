package planck

import (
	"github.com/gopherjs/gopherjs/js"
)

type Vec2 struct{ *js.Object }
type Vec3 struct{ *js.Object }

func (v Vec2) X() float64 {
	return v.Get("x").Float()
}

func (v Vec2) Y() float64 {
	return v.Get("y").Float()
}

func (v Vec3) X() float64 {
	return Vec2{v.Object}.X()
}

func (v Vec3) Y() float64 {
	return Vec2{v.Object}.Y()
}

func (v Vec3) Z() float64 {
	return v.Get("z").Float()
}

func Sub(v1 Vec2, v2 Vec2) Vec2 {
	return Vec2{js.Global.Get("planck").Get("Vec2").Call("sub", v1.Object, v2.Object)}
}

func Mul(v1 Vec2, v2 float64) Vec2 {
	return Vec2{js.Global.Get("planck").Get("Vec2").Call("mul", v1.Object, v2)}
}

func Add(v1 Vec2, v2 Vec2) Vec2 {
	return Vec2{js.Global.Get("planck").Get("Vec2").Call("add", v1.Object, v2.Object)}
}

type Planck struct{ *js.Object }
type World struct{ *js.Object }
type Body struct{ *js.Object }
type Fixture struct{ *js.Object }

func (p Planck) Vec3(x, y, z float64) Vec3 {
	return Vec3{p.Get("Vec3").Invoke(x, y, z)}
}
func (p Planck) Vec2(x, y float64) Vec2 {
	return Vec2{p.Get("Vec2").Invoke(x, y)}
}

// FixtureReducer is
type FixtureReducer func(ctx interface{}, body Body, fixture Fixture) (interface{}, error)

// ReduceFixtures is
func ReduceFixtures(world World, reducer FixtureReducer, ctx interface{}) (interface{}, error) {
	var err error
	for body := world.Call("getBodyList"); body != nil; body = body.Call("getNext") {
		for fixture := body.Call("getFixtureList"); fixture != nil; fixture = fixture.Call("getNext") {
			ctx, err = reducer(ctx, Body{body}, Fixture{fixture})
			if err != nil {
				return ctx, err
			}
		}
	}
	return ctx, nil
}
