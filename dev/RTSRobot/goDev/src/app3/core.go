package app3

import (
	"fmt"
	"strconv"
)

/*
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
*/

const (
	StepBefore = iota
	StepBody
	StepAfter
)

const (
	PhaseDrawCard = "PhaseDrawCard"
	PhaseSet      = "PhaseSet"
)

type Require struct {
	Amount  int
	Options []string
}

type Cost struct {
	Requires  []Require
	UseFor    string
	Selection []string
}

type Description struct {
	Text string
	Args []string
}

type Declare struct {
	Description Description
	Costs       []Cost
}

const (
	UseForPutGravyard = "UseForPutGravyard"
	UseForSet         = "UseForSet"
	UseForTap         = "UseForTap"
)

const (
	DescriptionTextCancelStepBefore       = "DescriptionTextCancelStepBefore"
	DescriptionTextCancelStepAfter        = "DescriptionTextCancelStepAfter"
	DescriptionTextCancelStepBody         = "DescriptionTextCancelStepBody"
	DescriptionTextCancelStepModifyEffect = "DescriptionTextCancelStepModifyEffect"
	DescriptionNextPhase                  = "DescriptionNextPhase"
	DescriptionDrawCard                   = "從{0}抽{1}張卡到{2}"
	DescriptionSetCard                    = "出場"
)

type FunctionTriggerAbility struct {
	CardID  string
	Declare Declare
}

type Player struct {
	ID string
}

type Card struct {
	ID   string
	Face string
	Tap  bool
}

type Token struct {
}

type EntityStack []string

type Desktop struct {
	Entities    []string
	EntityStack map[string]EntityStack
	Cards       map[string]Card
	Tokens      map[string]Token
}

type Gameplay struct {
	ActivePlayerID string
	Players        []Player
	Phase          string
	Step           int
	WatingCancal   map[string]bool
	EffectStack    []Description
	Desktop        Desktop
}

const (
	Home     = "Home"
	Gravyard = "Gravyard"
)

func EntityStackIDPlayerHand(playerID string, where string) string {
	return "EntityStackID_Hand_" + playerID + "_" + where
}

func QueryFunction(origin Gameplay, playerID string) ([]Declare, error) {
	// 有作用中的效果
	// 判斷有沒有能力可以改變效果
	if len(origin.EffectStack) > 0 {
		topEffect := origin.EffectStack[len(origin.EffectStack)-1]
		switch topEffect.Text {
		case DescriptionDrawCard:
		case DescriptionNextPhase:
			// check ability for change effect
			return []Declare{Declare{Description: Description{}}}, nil
		}
	}
	// 規定效果前的自由時間
	if origin.Step == StepBefore {
		return []Declare{Declare{Description: Description{Text: DescriptionTextCancelStepBefore}}}, nil
	}
	// 規定效果後的自由時間
	if origin.Step == StepAfter {
		return []Declare{Declare{Description: Description{}}}, nil
	}
	// 規定效果
	if origin.Phase == PhaseDrawCard {
		if origin.ActivePlayerID != playerID {
			return []Declare{}, nil
		}
		return []Declare{Declare{Description: Description{Text: DescriptionDrawCard, Args: []string{"", "3", ""}}}}, nil
	}
	if origin.ActivePlayerID == playerID {
		return []Declare{
			Declare{
				Description: Description{
					Text: DescriptionSetCard,
					Args: []string{"cardID"},
				},
				Costs: []Cost{
					Cost{
						Requires: []Require{
							Require{
								Amount:  3,
								Options: []string{""},
							},
						},
						Selection: nil,
						UseFor:    UseForTap,
					},
				},
			},
		}, nil
	}
	return []Declare{}, nil
}

func QueryNextPhase(origin Gameplay) (string, error) {
	return "", nil
}

func ApplyFunction(origin Gameplay, playerID string, declare Declare) (Gameplay, error) {
	ctx := origin
HandleBody:
	switch {
	// 如果有修改效果, 要將WatingCancal清空, 再重問一次修改

	case declare.Description.Text == DescriptionTextCancelStepModifyEffect:
		if len(ctx.EffectStack) == 0 {
			return origin, fmt.Errorf("no effect")
		}
		// 判斷是不是所有玩家都放棄
		ctx.WatingCancal[playerID] = true
		canNextStep := true
		for _, cancal := range ctx.WatingCancal {
			if cancal == false {
				canNextStep = false
				break
			}
		}
		// 如果所有玩家都放棄, 執行效果
		if canNextStep {
			// clear state
			ctx.WatingCancal = map[string]bool{}
			// 執行效果
			topEffect := origin.EffectStack[len(origin.EffectStack)-1]
			switch topEffect.Text {
			case DescriptionNextPhase:
				nextPhase := topEffect.Args[0]
				ctx.Phase = nextPhase
				ctx.EffectStack = ctx.EffectStack[0 : len(origin.EffectStack)-1]
				break HandleBody
			case DescriptionDrawCard:
				from := declare.Description.Args[0]
				num, err := strconv.Atoi(declare.Description.Args[1])
				if err != nil {
					return origin, err
				}
				to := declare.Description.Args[2]
				var _, _, _ = from, num, to
				ctx.EffectStack = ctx.EffectStack[0 : len(origin.EffectStack)-1]
				break HandleBody
			case DescriptionSetCard:

			}
		}
	case declare.Description.Text == DescriptionTextCancelStepBefore:
		if ctx.Step != StepBefore {
			return origin, fmt.Errorf("must in StepBefore")
		}
		// 判斷是不是所有玩家都放棄
		ctx.WatingCancal[playerID] = true
		canNextStep := true
		for _, cancal := range ctx.WatingCancal {
			if cancal == false {
				canNextStep = false
				break
			}
		}
		// 如果所有玩家都放棄, 跳到下一步
		if canNextStep {
			// clear state
			ctx.WatingCancal = map[string]bool{}
			ctx.Step = StepBody
		}
	case declare.Description.Text == DescriptionTextCancelStepBody:
		// 跳過規定效果
		if ctx.Step != StepBody {
			return origin, fmt.Errorf("must in StepBody")
		}
		if ctx.ActivePlayerID != playerID {
			return origin, fmt.Errorf("you are not active player")
		}
		ctx.WatingCancal = map[string]bool{}
		ctx.Step = StepAfter
	case declare.Description.Text == DescriptionTextCancelStepAfter:
		if ctx.Step != StepAfter {
			return origin, fmt.Errorf("must in StepAfter")
		}
		// 規定效果前後的自由時間
		// 判斷是不是所有玩家都放棄宣告
		ctx.WatingCancal[playerID] = true
		canNextStep := true
		for _, cancal := range ctx.WatingCancal {
			if cancal == false {
				canNextStep = false
				break
			}
		}
		// 如果所有玩家都放棄, 下一個階段
		if canNextStep {
			ctx.WatingCancal = map[string]bool{}
			ctx.Step = StepBefore

			nextPhase, err := QueryNextPhase(ctx)
			if err != nil {
				return origin, err
			}
			ctx.EffectStack = append(ctx.EffectStack, Description{
				Text: DescriptionNextPhase,
				Args: []string{nextPhase},
			})
		}
	default:
		hasCost := len(declare.Costs) > 0
		if hasCost {
			ctxForPrepareCost := ctx
			for _, cost := range declare.Costs {
				var cnt int
				for _, require := range cost.Requires {
					cnt += require.Amount
				}
				isAllPicked := len(cost.Selection) == cnt
				if isAllPicked == false {
					return origin, fmt.Errorf("not enouth")
				}
				switch cost.UseFor {
				case UseForPutGravyard:
					// 丟到墳場
					for _, entityID := range cost.Selection {
						var _ = entityID
					}
				case UseForTap:
					// 横置
					for _, entityID := range cost.Selection {
						var _ = entityID
						card, is := ctxForPrepareCost.Desktop.Cards[entityID]
						if is == false {
							return origin, fmt.Errorf("you must select a card")
						}
						if card.Tap {
							return origin, fmt.Errorf("already tap")
						}
						card.Tap = true
						// apply to ctx
					}
				}
			}
			// 套用cost
			ctx = ctxForPrepareCost
		}
		ctx.EffectStack = append(ctx.EffectStack, declare.Description)
	}
	return ctx, nil
}
