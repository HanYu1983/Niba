package app

import (
	"app/tool/data"
)

type DefaultModel struct {
	ctx   data.App
	Stack []data.App
}

func (v *DefaultModel) Push() {
	v.Stack = append(v.Stack, v.ctx)
}

func (v *DefaultModel) Pop() {
	v.Stack = v.Stack[:len(v.Stack)-1]
}

func (v *DefaultModel) Reset() {
	top := v.Stack[len(v.Stack)-1]
	v.ctx = top
}

func (v *DefaultModel) QueryUnitsByRegion(p1 data.Position, p2 data.Position) ([]string, map[string]data.Robot, map[string]data.Item, error) {
	return nil, nil, nil, nil
}
