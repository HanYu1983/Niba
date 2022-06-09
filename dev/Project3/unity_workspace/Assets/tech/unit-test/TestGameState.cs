using UnityEngine;
using System.Collections;

public class TestGameState : TestMono, IDeckDelegate, ICardAbilityReceiver
{
	IGameState gameState = new GameState();
	IPlayer player = new Player();
	int passCount = 0;
	int inverseCount = 0;
	int assignCount = 0;

	void Start ()
	{
		gameState.CenterDeck = new Deck ();
		gameState.CenterDeck.OnAddReceiver (this);
		Assert (gameState.CurrentNumber == 0, "1");
		player.AddCard(Card.ClubA);
		player.AddCard(Card.Club10);
		player.AddCard(Card.ClubJ);
		player.AddCard(Card.ClubQ);
		player.AddCard(Card.ClubK);
		gameState.CenterDeck.Push (player, Card.Club10);
		Assert (gameState.CurrentNumber == 10, "2");
		gameState.CenterDeck.Push (player, Card.ClubJ);
		Assert (passCount == 1, "should invoke pass");
		Assert (gameState.CurrentNumber == 10, "3");
		gameState.CenterDeck.Push (player, Card.ClubQ);
		Assert (gameState.CurrentNumber == 30, "4");
		gameState.CenterDeck.Push (player, Card.ClubK);
		Assert (gameState.CurrentNumber == 99, "5");
		gameState.CenterDeck.Push (player, Card.ClubA);
		Assert (gameState.CurrentNumber == 100, "6");
		Assert (gameState.IsOutOf99, "7");
		Assert (player.IsNoCard, "8");
		player.AddCard(Card.ClubA);
		player.AddCard(Card.Club2);
		player.AddCard(Card.Club3);
		player.AddCard(Card.Club4);
		player.AddCard(Card.Club5);
		gameState.CenterDeck.Push (player, Card.ClubA);
		Assert (gameState.CurrentNumber == 101, "9");
		gameState.CenterDeck.Push (player, Card.Club2);
		Assert (gameState.CurrentNumber == 103, "10");
		gameState.CenterDeck.Push (player, Card.Club3);
		Assert (gameState.CurrentNumber == 106, "11");
		gameState.CenterDeck.Push (player, Card.Club4);
		Assert (inverseCount == 1, "should invoke inverse");
		Assert (gameState.CurrentNumber == 106, "12");
		gameState.CenterDeck.Push (player, Card.Club5);
		Assert (assignCount == 1, "should invoke assign");
		Assert (gameState.CurrentNumber == 106, "13");
		Assert (player.IsNoCard, "14");
	}
	public void OnPlayerDraw(IDeck deck, IDeckPlayer player, ICard card){

	}
	public void OnCardPush(IDeck deck, IDeckPlayer player, ICard card){
		card.InvokeAbility (this);
	}
	public IDeckPlayer CardOwner{ get{ return null; } }
	public Direction Direction{ 
		get{ return Direction.Forward; }
		set{ ++inverseCount; }
	}
	public void AddNumber(int number){ 
		ICardAbilityReceiver car = gameState as ICardAbilityReceiver;
		if (car != null) {
			car.AddNumber(number);
		}
	}
	public void Pass(IDeckPlayer owner){
		++passCount;
	}
	public void FullNumber(){
		ICardAbilityReceiver car = gameState as ICardAbilityReceiver;
		if (car != null) {
			car.FullNumber();
		}
	}
	public void AssignPlayer(IDeckPlayer owner){
		++assignCount;
	}
	public void ControlNumber(int number, IDeckPlayer owner){
		gameState.AddNumber (number);
	}
}