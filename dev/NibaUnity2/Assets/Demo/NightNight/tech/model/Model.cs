using UnityEngine;
using System.Collections;
using System.Linq;

namespace NN{
public class Model : SenderMono, IModel, IDeckDelegate, ICardAbilityReceiver, IMatchDelegate, IPlayerDelegate {
	IMatch _match = EntityManager.Singleton.Create<Match> ();
	
	public int GameNumber{ get{ return _match.GameState.CurrentNumber; } }

	public void StartGame(){
		_match.StartMatch ();
	}

	public void EndGame(){
		_match.EndMatch ();
	}

	public void Step(){
		_match.ContinuePlay ();
	}

	public void PlayerJoin(IOption<IPlayer> player){
		_match.PlayerJoin (player);
	}

	public void OnCurrentPlayerChange(IMatch match, IOption<IPlayer> player){

	}

	public void OnPlayerDraw(IDeck deck, IDeckPlayer player, ICard card){

	}

	public void OnCardPush(IDeck deck, IDeckPlayer player, ICard card){
		if (_match.CenterDeck == deck) {
			card.InvokeAbility(this);
		}
	}

	public void OnPlayerWillPushCard(IPlayer player, ICard card){
		player.Match.CenterDeck.Push (player, card);
	}

	public void OnPlayerWillDrawCard(IPlayer player){
		player.Match.Deck.Draw (player);
	}

	public void OnPlayerDie(IPlayer player){
		_match.EndMatch ();
	}

	public IDeckPlayer CardOwner{ get{ return _match.CurrentPlayer.Instance; } }
	public Direction Direction{ 
		get{ return _match.GameState.Direction; }
		set{ 
			ICardAbilityReceiver car = _match.GameState as ICardAbilityReceiver;
			if (car != null) {
				car.Direction = value;
			}
			_match.CurrentPlayer = _match.NextPlayer;
		} 
	}
	public void AddNumber(int number){ 
		ICardAbilityReceiver car = _match.GameState as ICardAbilityReceiver;
		if (car != null) {
			car.AddNumber(number);
		}
		_match.CurrentPlayer = _match.NextPlayer;
	}
	public void Pass(IDeckPlayer owner){
		IPlayer player = owner as IPlayer;
		if (player != null) {
			player.Controller.Pass(owner);
		}
		_match.CurrentPlayer = _match.NextPlayer;
	}
	public void FullNumber(){
		ICardAbilityReceiver car = _match.GameState as ICardAbilityReceiver;
		if (car != null) {
			car.FullNumber();
		}
		_match.CurrentPlayer = _match.NextPlayer;
	}
	public void AssignPlayer(IDeckPlayer owner){
		IPlayer p = owner as IPlayer;
		if (p != null) {
			p.Controller.AssignPlayer(owner);
		}
	}
	public void ControlNumber(int number, IDeckPlayer owner){
		IPlayer p = owner as IPlayer;
		if (p != null) {
			p.Controller.ControlNumber(number, owner);
		}
		_match.CurrentPlayer = _match.NextPlayer;
	}

	protected override bool HandleVerifyReceiverDelegate (object receiver){
		if (receiver is IInjectModel) {
			((IInjectModel)receiver).Model = this;
		}
		if(receiver is IInjectModelGetter){
			((IInjectModelGetter)receiver).ModelGetter = this;
		}
		return false;
	}
}
}