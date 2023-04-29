package mixing

import "fmt"

type componentA interface {
	GetAge() int
	SetAge(age int)
}

func doA(a componentA) {
	fmt.Println(a.GetAge())
}

type componentB interface {
	GetAge() int
	SetAge(age int)
	SetPower(age int)
}

func doB(a componentB) {
	fmt.Println(a.GetAge())
}

type Entity struct {
}

func (self Entity) GetAge() int {
	return 0
}

func (self Entity) SetAge(age int) {
}

func (self Entity) SetPower(age int) {
}

func Test() {
	entity := Entity{}
	doA(entity)
	doB(entity)
}
