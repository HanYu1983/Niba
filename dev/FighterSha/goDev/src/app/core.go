package app

import (
	"fmt"
	"time"

	"github.com/gopherjs/gopherjs/js"
)

type Face struct {
	ID string
}

var (
	FaceDown = Face{"FaceDown"}
	FaceUp   = Face{"FaceUp"}
)

type CardType struct {
	ID string
}

type CardPrototypeID struct {
	CardType CardType
	ID       string
}

type Card struct {
	ID              string
	CardPrototypeID CardPrototypeID
	Face            Face
	Player          string
}

type CardStack struct {
	ID     string
	Cards  []Card
	Player string
}

type Desktop struct {
	CardStacks map[string]CardStack
}

func MoveCard(s1 CardStack, s2 CardStack, card Card, index int) (CardStack, CardStack, error) {
	findID := -1
	for _findID, c := range s1.Cards {
		if c == card {
			findID = _findID
			break
		}
	}
	if findID == -1 {
		return s1, s2, fmt.Errorf("card not found")
	}
	s1.Cards = append(s1.Cards[0:findID], s1.Cards[findID+1:]...)
	s2.Cards = append(append(s2.Cards[0:index], card), s2.Cards[index+1:]...)
	return s1, s2, nil
}

var (
	CardTypeAttack     = CardType{"Attack"}
	CardTypeDodge      = CardType{"Dodge"}
	CardTypeStealMoney = CardType{"StealMoney"}
	CardTypeSteal      = CardType{"Steal"}
)

type Player struct {
	ID      string
	CardID  string
	GroupID string
	Order   int
}

type PlayerBasicCom struct {
	AttackTimes     int
	StealTimes      int
	StealMoneyTimes int
}

type Gameplay struct {
	Desktop         Desktop
	Players         map[string]Player
	PlayerBasicComs map[string]PlayerBasicCom
}

const (
	CardStackHome     = "_CardStackHome"
	CardStackGravyard = "_CardStackGravyard"
	CardStackEquip    = "_CardStackEquip"
)

var (
	DefaultGamePlay = Gameplay{
		Desktop{
			map[string]CardStack{
				CardStackHome:     CardStack{},
				CardStackGravyard: CardStack{},
				CardStackEquip:    CardStack{},
			},
		},
		map[string]Player{
			"A": Player{},
		},
		map[string]PlayerBasicCom{
			"A": PlayerBasicCom{},
		},
	}
)

// AskOneCard 等待玩家選一張卡
func AskOneCard(gameplay Gameplay, player Player, targetCS CardStack) (Card, error) {
	wait := make(chan interface{})
	go func() {
		js.Global.Get("View").Call("AskOneHandCard", player, targetCS, func(cardID *js.Object) {
			if cardID == nil || cardID == js.Undefined {
				wait <- nil
			} else {
				wait <- cardID.String()
			}
		})
	}()
	cardID := <-wait
	if cardID == nil {
		return Card{}, nil
	}
	for _, _card := range targetCS.Cards {
		if _card.ID == cardID.(string) {
			return _card, nil
		}
	}
	return Card{}, nil
}

func AskOnePlayer(gameplay Gameplay, player Player, players map[string]Player) (Player, error) {
	wait := make(chan interface{})
	go func() {
		js.Global.Get("View").Call("AskOnePlayer", player, players, func(id *js.Object) {
			if id == nil || id == js.Undefined {
				wait <- nil
			} else {
				wait <- id.String()
			}
		})
	}()
	id := <-wait
	if id == nil {
		return Player{}, nil
	}
	ret, isFind := players[id.(string)]
	if isFind == false {
		return Player{}, nil
	}
	return ret, nil
}

// Attack 使出殺, 對方用閃反應
func Attack(gameplay Gameplay, player Player, target Player, card Card) (Gameplay, error) {
	if card.CardPrototypeID.CardType != CardTypeAttack {
		return gameplay, fmt.Errorf("you must use Attack")
	}
	playerCom := gameplay.PlayerBasicComs[player.ID]
	if playerCom.AttackTimes >= 1 {
		return gameplay, fmt.Errorf("you reach attack limit")
	}
	// move attack card to gravyard
	gravyard := gameplay.Desktop.CardStacks[CardStackGravyard]
	hand := gameplay.Desktop.CardStacks[player.ID]
	hand, gravyard, err := MoveCard(hand, gravyard, card, 0)
	if err != nil {
		return gameplay, err
	}
	gameplay.Desktop.CardStacks[CardStackGravyard] = gravyard
	gameplay.Desktop.CardStacks[player.ID] = hand

	// ask target player for dodge
	targetHand := gameplay.Desktop.CardStacks[target.ID]
	dodgeCard, err := AskOneCard(gameplay, target, targetHand)
	if err != nil {
		return gameplay, err
	}
	if dodgeCard.CardPrototypeID.CardType != CardTypeDodge {
		return gameplay, fmt.Errorf("you must select dodge card")
	}
	var NotFound Card
	if dodgeCard == NotFound {
		//target.Life--
		gameplay.Players[target.ID] = target
	} else {
		// move dodge card to gravyard
		targetHand, gravyard, err = MoveCard(targetHand, gravyard, dodgeCard, 0)
		if err != nil {
			return gameplay, err
		}
		gameplay.Desktop.CardStacks[CardStackGravyard] = gravyard
		gameplay.Desktop.CardStacks[target.ID] = targetHand
	}

	playerCom.AttackTimes++
	gameplay.PlayerBasicComs[player.ID] = playerCom
	return gameplay, nil
}

// StealMoney 使出劫, 對方用閃反應
func StealMoney(gameplay Gameplay, player Player, target Player, card Card) (Gameplay, error) {
	if card.CardPrototypeID.CardType != CardTypeStealMoney {
		return gameplay, fmt.Errorf("you must use StealMoney")
	}
	playerCom := gameplay.PlayerBasicComs[player.ID]
	if playerCom.StealMoneyTimes >= 1 {
		return gameplay, fmt.Errorf("you reach StealMoney limit")
	}
	// move attack card to gravyard
	gravyard := gameplay.Desktop.CardStacks[CardStackGravyard]
	hand := gameplay.Desktop.CardStacks[player.ID]
	hand, gravyard, err := MoveCard(hand, gravyard, card, 0)
	if err != nil {
		return gameplay, err
	}
	gameplay.Desktop.CardStacks[CardStackGravyard] = gravyard
	gameplay.Desktop.CardStacks[player.ID] = hand

	// ask target player for dodge
	targetHand := gameplay.Desktop.CardStacks[target.ID]
	dodgeCard, err := AskOneCard(gameplay, target, targetHand)
	if err != nil {
		return gameplay, err
	}
	if dodgeCard.CardPrototypeID.CardType != CardTypeDodge {
		return gameplay, fmt.Errorf("you must select dodge card")
	}
	var NotFound Card
	if dodgeCard == NotFound {
		/*if target.Money > 0 {
			target.Money--
		} else {
			target.Life--
		}*/
		gameplay.Players[target.ID] = target
	} else {
		// move dodge card to gravyard
		targetHand, gravyard, err = MoveCard(targetHand, gravyard, dodgeCard, 0)
		if err != nil {
			return gameplay, err
		}
		gameplay.Desktop.CardStacks[CardStackGravyard] = gravyard
		gameplay.Desktop.CardStacks[target.ID] = targetHand
	}
	playerCom.StealMoneyTimes++
	gameplay.PlayerBasicComs[player.ID] = playerCom
	return gameplay, nil
}

// Steal 使出盜, 對方用閃反應
func Steal(gameplay Gameplay, player Player, target Player, card Card) (Gameplay, error) {
	if card.CardPrototypeID.CardType != CardTypeSteal {
		return gameplay, fmt.Errorf("you must use Steal")
	}
	playerCom := gameplay.PlayerBasicComs[player.ID]
	if playerCom.StealTimes >= 1 {
		return gameplay, fmt.Errorf("you reach Steal limit")
	}
	// move attack card to gravyard
	gravyard := gameplay.Desktop.CardStacks[CardStackGravyard]
	hand := gameplay.Desktop.CardStacks[player.ID]
	hand, gravyard, err := MoveCard(hand, gravyard, card, 0)
	if err != nil {
		return gameplay, err
	}
	gameplay.Desktop.CardStacks[CardStackGravyard] = gravyard
	gameplay.Desktop.CardStacks[player.ID] = hand

	// ask target player for dodge
	targetHand := gameplay.Desktop.CardStacks[target.ID]
	dodgeCard, err := AskOneCard(gameplay, target, targetHand)
	if err != nil {
		return gameplay, err
	}
	if dodgeCard.CardPrototypeID.CardType != CardTypeDodge {
		return gameplay, fmt.Errorf("you must select dodge card")
	}
	var NotFound Card
	if dodgeCard == NotFound {
		// steal one equip card
		// or attack one life
		targetEquip := gameplay.Desktop.CardStacks[target.ID+CardStackEquip]
		if len(targetEquip.Cards) > 0 {
			equipCard, err := AskOneCard(gameplay, player, targetEquip)
			if err != nil {
				return gameplay, err
			}
			targetEquip, hand, err := MoveCard(targetEquip, hand, equipCard, 0)
			if err != nil {
				return gameplay, err
			}
			gameplay.Desktop.CardStacks[target.ID+CardStackEquip] = targetEquip
			gameplay.Desktop.CardStacks[player.ID] = hand
		} else {
			//target.Life--
		}
		gameplay.Players[target.ID] = target
	} else {
		// move dodge card to gravyard
		targetHand, gravyard, err = MoveCard(targetHand, gravyard, dodgeCard, 0)
		if err != nil {
			return gameplay, err
		}
		gameplay.Desktop.CardStacks[CardStackGravyard] = gravyard
		gameplay.Desktop.CardStacks[target.ID] = targetHand
	}
	playerCom.StealTimes++
	gameplay.PlayerBasicComs[player.ID] = playerCom
	return gameplay, nil
}

func NextPlayer(gameplay Gameplay, player Player) Player {
	return player
}

func DrawCard(gameplay Gameplay, player Player, cnt int) (Gameplay, error) {
	return gameplay, nil
}

func AskCommand(gameplay Gameplay, player Player) (interface{}, error) {
	return nil, nil
}

type CmdUseCard struct {
	Card Card
}

func Start(gameplay Gameplay) (Gameplay, error) {
	for {
		time.Sleep(1 * time.Second)
		activePlayer := NextPlayer(gameplay, gameplay.Players["A"])
		// 清空狀態
		gameplay.PlayerBasicComs[activePlayer.ID] = PlayerBasicCom{}

		// 抽2
		gameplay, err := DrawCard(gameplay, activePlayer, 2)
		if err != nil {
			return gameplay, err
		}

		// 等玩家指令
		cmd, err := AskCommand(gameplay, activePlayer)
		if err != nil {
			return gameplay, err
		}

		switch cmd.(type) {
		case CmdUseCard:
			// 使用一張卡
			card := cmd.(CmdUseCard).Card
			switch {
			case card.CardPrototypeID.CardType == CardTypeAttack:
				// 殺
				target, err := AskOnePlayer(gameplay, activePlayer, gameplay.Players)
				if err != nil {
					return gameplay, err
				}
				gameplay, err = Attack(gameplay, activePlayer, target, card)
				if err != nil {
					return gameplay, err
				}

			case card.CardPrototypeID.CardType == CardTypeSteal:
				// 盜
				target, err := AskOnePlayer(gameplay, activePlayer, gameplay.Players)
				if err != nil {
					return gameplay, err
				}
				gameplay, err = Steal(gameplay, activePlayer, target, card)
				if err != nil {
					return gameplay, err
				}

			case card.CardPrototypeID.CardType == CardTypeStealMoney:
				// 劫
				target, err := AskOnePlayer(gameplay, activePlayer, gameplay.Players)
				if err != nil {
					return gameplay, err
				}
				gameplay, err = StealMoney(gameplay, activePlayer, target, card)
				if err != nil {
					return gameplay, err
				}
			default:
				return gameplay, fmt.Errorf("%v not found", card)
			}

		default:
			return gameplay, fmt.Errorf("%v not found", cmd)
		}
	}
}
