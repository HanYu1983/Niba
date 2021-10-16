using UnityEngine;
using System.Collections.Generic;
using System.Linq;

public class Match : SenderAdapter, IMatch
{
	IDeck _deck = EntityManager.Singleton.Create<Deck>();
	IDeck _centerDeck = EntityManager.Singleton.Create<Deck>();
	IGameState _gameState = EntityManager.Singleton.Create<GameState>();
	List<IOption<IPlayer>> _players = new List<IOption<IPlayer>> ();
	IOption<IPlayer> _currentPlayer = Option<IPlayer>.None;
	MatchPhase _matchPhase = MatchPhase.Idle;
	public Match(){
		Card.AllCard.ToList().ForEach(card=>_deck.AddCard(card));
		_gameState.CenterDeck = _centerDeck;
	}
	public MatchPhase MatchPhase{ get{ return _matchPhase; } }
	public override void OnEntityDestroy(IEntityManager mgr){
		mgr.Destroy (_deck.EntityID);
		mgr.Destroy (_centerDeck.EntityID);
		mgr.Destroy (_gameState.EntityID);
	}
	public IDeck Deck{ get{ return _deck; } }
	public IDeck CenterDeck{ get { return _centerDeck; } }
	public IGameState GameState{ get{ return _gameState; } }

	public void ContinuePlay(){ 
		bool isNeedChangePhase = MatchPhase == MatchPhase.Stop;
		if( isNeedChangePhase )
			_matchPhase = MatchPhase.Playing; 
	}

	public void PlayerJoin(IOption<IPlayer> player){
		player.Map (p =>{p.Match = this;});
		_players.Add (player);
	}
	public void PlayerLeave(IOption<IPlayer> player){
		_players.Remove (player);
		player.Map (p => {p.Match = null;});
	}
	public IOption<IPlayer> CurrentPlayer{
		get{ return _currentPlayer; } 
		set{
			if(_currentPlayer.Identity != value.Identity ){
				_currentPlayer = value;
				bool isNoNeedChangeMatchPhase = MatchPhase == MatchPhase.Idle || MatchPhase == MatchPhase.Stop;
				if(isNoNeedChangeMatchPhase){
					// nothing to do
				}else
					_matchPhase = MatchPhase.Stop;
				Sender.Receivers.ToList().ForEach(obj=>{
					((IMatchDelegate)obj).OnCurrentPlayerChange(this, _currentPlayer);
				});
			}
		} 
	}
	public IOption<IPlayer> NextPlayer{ 
		get{
			switch(GameState.Direction){
			case Direction.Forward:
				return CurrentPlayer.Instance.Next;
			case Direction.Backward:
				return CurrentPlayer.Instance.Prev;
			}
			return Option<IPlayer>.None;
		}
	}
	public IList<IOption<IPlayer>> Players{ get{ return _players; } }
	void MakePlayerCircleLink(){
		List<IOption<IPlayer>> l1 = _players;
		List<IOption<IPlayer>> l2 = _players.GetRange (1, _players.Count - 1);
		l2.Add (_players [0]);
		for (int i=0; i<l1.Count; ++i) {
			IPlayer p = l1[i].Instance;
			IPlayer n = l2[i].Instance;
			p.Next = l2[i];
			n.Prev = l1[i];
		}
	}
	public void StartMatch(){
		MakePlayerCircleLink ();
		for(int i=0; i<4; ++i){
			_players.ForEach(op=>{
				op.Map(player=>{
					_deck.Draw(player);
				});
			});
		}
		_matchPhase = MatchPhase.Playing; // set playing phase before current player change
		CurrentPlayer = Players [0];
	}
	public void EndMatch(){
		_matchPhase = MatchPhase.Idle;
	}
	protected override bool HandleVerifyReceiverDelegate (object receiver){
		return receiver is IMatchDelegate;
	}
}