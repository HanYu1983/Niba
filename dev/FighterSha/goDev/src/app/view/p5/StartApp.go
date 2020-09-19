package p5

import (
	"app/gameplay"
	"fmt"
)

// StartApp is
func StartApp() {
	defer func() {
		if err := recover(); err != nil {
			fmt.Println(err)
		}
	}()

	view := P5View{
		PageStart,
		gameplay.Gameplay{},
		make(chan interface{}),
		make(chan string, 10),
		GameplayView{
			map[string]CardView{},
		},
		Assets{},
	}

	view.InstallCanvas()
	viewPtr := &view

	go func() {
		for {
			evt := <-view.EventChan
			switch evt.(type) {
			case StartGameplayEvent:
				// JS呼叫的要用goroutine包裝, 不然chan和time.Sleep等blocking的都不能用
				go func() {
					viewPtr.Page = PageGameplay

					var err error
					gameplayCtx := gameplay.Gameplay{}
					gameplayCtx, err = gameplay.PrepareGameplay(gameplayCtx)
					if err != nil {
						fmt.Println(err.Error())
						return
					}
					gameplayCtx, err = gameplay.Start(gameplay.IView(&view), gameplayCtx)
					if err != nil {
						fmt.Println(err.Error())
						return
					}
					viewPtr.Page = PageStart
					viewPtr.EventChan <- StartGameplayEvent{}
				}()
			}
		}
	}()

	view.EventChan <- StartGameplayEvent{}
}
