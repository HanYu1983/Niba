package p5

import (
	"app/gameplay"
	"fmt"
)

// StartApp is
func StartApp() {
	defer func() {
		fmt.Println("FighterSha End")
	}()

	defer func() {
		if err := recover(); err != nil {
			fmt.Println(err)
		}
	}()

	view := P5View{
		EventChan:  make(chan interface{}),
		AlertPopup: make(chan string, 10),
	}
	view.InstallCanvas()

	gameplayCtx := gameplay.Gameplay{}

	for {
		evt := <-view.EventChan
		switch evt.(type) {
		case StartGameplayEvent:
			// JS呼叫的要用goroutine包裝, 不然chan和time.Sleep等blocking的都不能用
			go func() {
				nextGameplayCtx, err := gameplay.PrepareGameplay(gameplayCtx)
				if err != nil {
					fmt.Println(err.Error())
					return
				}
				nextGameplayCtx, err = gameplay.Start(gameplay.IView(&view), nextGameplayCtx)
				if err != nil {
					fmt.Println(err.Error())
					return
				}
				gameplayCtx = nextGameplayCtx
			}()
		}
	}
}
