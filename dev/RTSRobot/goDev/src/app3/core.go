package app3

import (
	"sync"
)

type Player struct {
	ID string
}

const (
	PhaseDrawCard = "PhaseDrawCard"
)

const (
	StepBefore = iota
	StepBody
	StepAfter
)

type Gameplay struct {
	ActivePlayerID string
	Players        []Player
	Phase          string
	Step           int
	WatingCancal   map[string]bool
}

type Ability struct {
	ID     string
	CardID string
}

type AbilityForNextPlayer struct {
	Ability
	PlayerID string
}

func QueryAbilityForNextPlayer(origin Gameplay) ([]AbilityForNextPlayer, error) {
	return []AbilityForNextPlayer{}, nil
}

func HandleAbility(origin Gameplay, ability interface{}) (Gameplay, error) {
	return origin, nil
}

func QueryNextPlayer(origin Gameplay) (string, error) {
	return "", nil
}

func WaitingPlayerDeclare(origin Gameplay) (interface{}, bool, error) {
	return nil, false, nil
}

func MergeChan(cs ...<-chan interface{}) <-chan interface{} {
	out := make(chan interface{})
	var wg sync.WaitGroup
	wg.Add(len(cs))
	for _, c := range cs {
		go func(c <-chan interface{}) {
			for v := range c {
				out <- v
			}
			wg.Done()
		}(c)
	}
	go func() {
		wg.Wait()
		close(out)
	}()
	return out
}

func HandleDeclare(origin Gameplay, declare interface{}) (Gameplay, error) {
	return origin, nil
}

func FreeTime(origin Gameplay) (Gameplay, error) {
	var err error
	ctx := origin
	var stack []interface{}
	for {
		declare, finished, err := WaitingPlayerDeclare(ctx)
		if err != nil {
			return origin, err
		}
		if finished {
			break
		}
		stack = append(stack, declare)
	}
	for i := len(stack) - 1; i > 0; i-- {
		declare := stack[i]
		ctx, err = HandleDeclare(ctx, declare)
		if err != nil {
			return origin, err
		}
	}
	return ctx, nil
}

func Phase(origin Gameplay, body func(Gameplay) (Gameplay, error)) (Gameplay, error) {
	var err error
	ctx := origin
	ctx, err = FreeTime(ctx)
	if err != nil {
		return origin, err
	}
	ctx, err = body(ctx)
	if err != nil {
		return origin, err
	}
	ctx, err = FreeTime(ctx)
	if err != nil {
		return origin, err
	}
	return ctx, nil
}

func DrawPhaseEffect(origin Gameplay) (Gameplay, error) {
	return origin, nil
}

func Turn(origin Gameplay) (Gameplay, error) {
	var err error
	ctx := origin
	ctx, err = Phase(ctx, DrawPhaseEffect)
	if err != nil {
		return origin, err
	}
	return ctx, nil
}

func GameLoop(origin Gameplay) (Gameplay, error) {
	var err error
	ctx := origin
	for {
		ctx, err = Turn(ctx)
		if err != nil {
			return origin, err
		}
		nextPlayerAbilityList, err := QueryAbilityForNextPlayer(ctx)
		if err != nil {
			return origin, err
		}
		nextPlayer, err := QueryNextPlayer(ctx)
		if err != nil {
			return origin, err
		}
		if len(nextPlayerAbilityList) > 0 {
			ability := nextPlayerAbilityList[0]
			ctx, err = HandleAbility(ctx, ability)
			if err != nil {
				return origin, err
			}
			nextPlayer = ability.PlayerID
		}
		ctx.ActivePlayerID = nextPlayer
	}
	return ctx, nil
}

type FunctionDrawCard struct {
}

type FunctionCancal struct {
}

type FunctionSetUnit struct {
	CardID   string
	PlayerID string
}

type Cost struct {
	Names        []string
	CardID       map[string]string
	PlayerID     map[string]string
	CardIDList   map[string][]string
	PlayerIDList map[string][]string
	ColorID      map[string]string
	ColorIDList  map[string][]string
}

type FunctionTriggerAbility struct {
	CardID string
	Cost   Cost
}

func QueryFunction(origin Gameplay, playerID string) ([]interface{}, error) {
	if origin.Step == StepBefore {
		return []interface{}{FunctionCancal{}}, nil
	}
	if origin.Step == StepAfter {
		return []interface{}{FunctionCancal{}}, nil
	}
	if origin.Phase == PhaseDrawCard {
		return []interface{}{FunctionDrawCard{}}, nil
	}
	if origin.ActivePlayerID == playerID {
		return []interface{}{
			FunctionTriggerAbility{
				CardID: "",
				Cost: Cost{
					Names: []string{"target", "throwCard"},
					CardID: map[string]string{
						"target": "",
					},
					PlayerID: map[string]string{
						"throwCard": "",
					},
				},
			},
		}, nil
	}
	var cost Cost
	var waitingValue string
	for _, name := range cost.Names {
		if val, has := cost.CardID[name]; has {
			if val == waitingValue {

			}
		}
		if val, has := cost.PlayerID[name]; has {
			if val == waitingValue {

			}
		}
	}
	return []interface{}{}, nil
}

func ApplyFunction(origin Gameplay, playerID string, function interface{}) (Gameplay, error) {
	switch function.(type) {
	case FunctionCancal:
		origin.WatingCancal[playerID] = true
		canNextStep := true
		for _, cancal := range origin.WatingCancal {
			if cancal == false {
				canNextStep = false
				break
			}
		}
		if canNextStep {
			origin.Step++
		}
	}
	return origin, nil
}
