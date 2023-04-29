package memonto

// https://stackoverflow.com/questions/28020070/golang-serialize-and-deserialize-back
import (
	"bytes"
	"encoding/gob"
	"fmt"
)

func EncodeObject(obj interface{}) ([]byte, error) {
	var buf bytes.Buffer
	enc := gob.NewEncoder(&buf)
	err := enc.Encode(obj)
	if err != nil {
		return nil, fmt.Errorf("encode error: %v", err)
	}
	return buf.Bytes(), nil
}

func DecodeObject(data []byte, obj interface{}) error {
	dec := gob.NewDecoder(bytes.NewReader(data))
	err := dec.Decode(obj)
	if err != nil {
		return fmt.Errorf("decode error: %v", err)
	}
	return nil
}

func RegisterObject(obj interface{}) {
	gob.Register(obj)
}

// =======================
type damage interface {
	GetDamage() float32
}

type weapon struct {
	Postion string
	Damage  damage
}

type normalDamage struct {
}

func (this normalDamage) GetDamage() float32 {
	fmt.Println("NormalDamage")
	return 0.0
}

func Test() {
	RegisterObject(weapon{})
	RegisterObject(normalDamage{})

	// 编码对象
	p1 := weapon{Postion: "", Damage: normalDamage{}}
	data, err := EncodeObject(&p1)
	if err != nil {
		fmt.Println("encode error:", err)
		return
	}

	// 解码对象
	var p2 weapon
	err = DecodeObject(data, &p2)
	if err != nil {
		fmt.Println("decode error:", err)
		return
	}
	fmt.Println(p2)
	p2.Damage.GetDamage()
}
