package app

import (
	"testing"
)

func TestMenu1DStepBasic(t *testing.T) {
	// pageA := 0
	// menuA, menuB, menuC := 1, 2, 3
	// menuOptionA, menuOptionB := "a", "b"
	// ui := uidata.UI{
	// 	Menus: map[int]uidata.ListInt{
	// 		pageA: []int{
	// 			menuA, menuB, menuC,
	// 		},
	// 	},
	// 	Focus: map[int]int{},
	// 	Menu1Ds: map[int]uidata.Menu1D{
	// 		menuA: {
	// 			Options: []string{
	// 				menuOptionA, menuOptionB,
	// 			},
	// 			Limit: 10,
	// 		},
	// 		menuB: {
	// 			Options: []string{
	// 				menuOptionA, menuOptionB,
	// 			},
	// 			Limit: 10,
	// 		},
	// 		menuC: {
	// 			Options: []string{
	// 				menuOptionA, menuOptionB,
	// 			},
	// 			Limit: 10,
	// 		},
	// 	},
	// }

	// wait := make(chan interface{})
	// go func() {
	// 	_, err := BasicPagePhase(
	// 		ui,
	// 		pageA,
	// 		func(origin uidata.UI) (uidata.UI, error) {
	// 			return origin, nil
	// 		},
	// 		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
	// 			return origin, cancel, nil
	// 		},
	// 		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
	// 			return origin, cancel, nil
	// 		},
	// 	)
	// 	// drain event
	// 	for range mockEvt {
	// 	}
	// 	wait <- err
	// }()
	// t.Log(view)
	// t.Error("XX")
}
