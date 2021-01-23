package v1

func (v *model) Push() {
	v.Stack = append(v.Stack, v.App)
}
func (v *model) Pop() {
	v.Stack = v.Stack[:len(v.Stack)-1]
}
func (v *model) Reset() {
	top := v.Stack[len(v.Stack)-1]
	v.App = top
}
