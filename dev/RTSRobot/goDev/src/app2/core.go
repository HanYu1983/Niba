package app2

import (
	"fmt"

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

type CardID struct {
	CardType CardType
	ID       string
}

type Card struct {
	ID     string
	CardID CardID
	Face   Face
	Player string
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
	Life    int
	Money   int
	GroupID string
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

// AskOneCard 等待玩家選一張卡
func AskOneCard(gameplay Gameplay, player Player, targetCS CardStack) (Card, error) {
	wait := make(chan interface{})
	go func() {
		js.Global.Get("View").Call("AskOneHandCard", player, targetCS, func(cardID *js.Object) {
			if cardID == nil {
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
			if id == nil {
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
	if card.CardID.CardType != CardTypeAttack {
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
	if dodgeCard.CardID.CardType != CardTypeDodge {
		return gameplay, fmt.Errorf("you must select dodge card")
	}
	var NotFound Card
	if dodgeCard == NotFound {
		target.Life--
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
	if card.CardID.CardType != CardTypeStealMoney {
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
	if dodgeCard.CardID.CardType != CardTypeDodge {
		return gameplay, fmt.Errorf("you must select dodge card")
	}
	var NotFound Card
	if dodgeCard == NotFound {
		if target.Money > 0 {
			target.Money--
		} else {
			target.Life--
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
	playerCom.StealMoneyTimes++
	gameplay.PlayerBasicComs[player.ID] = playerCom
	return gameplay, nil
}

// Steal 使出盜, 對方用閃反應
func Steal(gameplay Gameplay, player Player, target Player, card Card) (Gameplay, error) {
	if card.CardID.CardType != CardTypeSteal {
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
	if dodgeCard.CardID.CardType != CardTypeDodge {
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
			target.Life--
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

func PlayerTurn(gameplay Gameplay, player Player) (Gameplay, error) {
	//draw two card
	// clear times
	gameplay.PlayerBasicComs[player.ID] = PlayerBasicCom{}
	hand := gameplay.Desktop.CardStacks[player.ID]

Menu:
	for {
	_:
		for {
			card, err := AskOneCard(gameplay, player, hand)
			if err != nil {
				return gameplay, err
			}

			switch {
			case card.CardID.CardType == CardTypeAttack:
				target, err := AskOnePlayer(gameplay, player, gameplay.Players)
				if err != nil {
					return gameplay, err
				}
				gameplay, err = Attack(gameplay, player, target, card)
				if err != nil {
					return gameplay, err
				}
			case card.CardID.CardType == CardTypeSteal:
				target, err := AskOnePlayer(gameplay, player, gameplay.Players)
				if err != nil {
					return gameplay, err
				}
				gameplay, err = Steal(gameplay, player, target, card)
				if err != nil {
					return gameplay, err
				}
			case card.CardID.CardType == CardTypeStealMoney:
				target, err := AskOnePlayer(gameplay, player, gameplay.Players)
				if err != nil {
					return gameplay, err
				}
				gameplay, err = StealMoney(gameplay, player, target, card)
				if err != nil {
					return gameplay, err
				}
			}

			var NotFound Card
			if card == NotFound {
				break Menu
			}
		}
	}

	return gameplay, nil
}
