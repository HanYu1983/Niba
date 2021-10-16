using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
public class PlayPage : SenderMono {

	Dictionary<int, GameObject> _hands = new Dictionary<int, GameObject> ();

	public GameObject go_hand;
	public GameObject go_hand2;
	public GameObject go_hand3;
	public GameObject go_hand4;
	public GameObject go_stack;
	public GameObject go_table;
	public GameObject go_score;
	public GameObject go_playerBorder;
	
	// Use this for initialization
	protected override void Start () {
		base.Start ();

		go_hand.GetComponent<HandView> ().playerId = (int)EnumEntityID.Player1;
		go_hand2.GetComponent<HandView> ().playerId = (int)EnumEntityID.Player2;
		go_hand3.GetComponent<HandView> ().playerId = (int)EnumEntityID.Player3;
		go_hand4.GetComponent<HandView> ().playerId = (int)EnumEntityID.Player4;

		_hands.Add( (int)EnumEntityID.Player1, go_hand );
		_hands.Add( (int)EnumEntityID.Player2, go_hand2 );
		_hands.Add( (int)EnumEntityID.Player3, go_hand3 );
		_hands.Add( (int)EnumEntityID.Player4, go_hand4 );

		Sender.Receivers.ToList().ForEach( obj => {
			((IPlayPageDelegate)obj).onPlayPageGameStart( this );
		});
		//StartCoroutine (delayAndPlay ());
	}

	//發牌給玩家
	public void DealCard( IDeck deck, IDeckPlayer player, ICard card  ){
		go_stack.GetComponent<StackView> ().dealCard (player, card);
		AddCard (deck, player, card);
	}

	//玩家抽一張卡
	public void AddCard( IDeck deck, IDeckPlayer player, ICard card ){
		_hands[ player.EntityID ].GetComponent<HandView> ().addCard (card);
	}

	//把牌丟到牌堆上
	public void PushCardToTable( IDeck deck, IDeckPlayer player, ICard card ){
		go_table.GetComponent<TableView> ().PushCardToTable (deck, player, card);
		SendCard (player.EntityID, _hands[ player.EntityID ].GetComponent<HandView> ().getCardViewByModel (card));
	}

	//改變目前數字
	public void GameNumberChanged(IGameState state, int number){
		go_score.GetComponent<ScoreView> ().GameNumberChanged (state, number);
	}

	//改變方向
	public void DirectionChanged(IGameState state, Direction direction){
		go_score.GetComponent<ScoreView> ().DirectionChanged (state, direction);
	}

	//改變玩家
	public void OnCurrentPlayerChange(IMatch match, IOption<IPlayer> player){
		go_playerBorder.GetComponent<PlayerBorder> ().OnCurrentPlayerChange (match, player);
	}

	//由border所傳進來的touch Y 事件
	public void onPlayerMoveCardByBorder( float moveY ){
		go_hand.GetComponent<HandView> ().onPlayerMoveCardByPlayPage (moveY);
	}

	//由border所傳進來的focus card事件
	public void onPlayerFocusCardByBorderPer( float per ){
		go_hand.GetComponent<HandView> ().onPlayerFocusCardByPlayerPagePer (per);
	}
	
	//由border傳來的使用卡片事件
	public void onPlayerSendCardByBorder(){
		go_hand.GetComponent<HandView> ().onPlayerSendCardByPlayPage ();
	}

	//由border傳來的不使用卡事件
	public void onPlayerReleaseCardByBorder(){
		go_hand.GetComponent<HandView> ().onPlayerReleaseCardByPlayPage ();
	}

	//由handView傳來的使用卡片事件，傳給model
	public void SendCardToModelByHandView( GameObject cardView ){
		Sender.Receivers.ToList().ForEach( obj => {
			((IPlayPageDelegate)obj).onPlayPageSendCard( this, cardView.GetComponent<CardViewConfig>().cardModel );
		});
	}

	//玩家使用一張牌
	void SendCard( int playerId, GameObject cardView ){
		if(cardView != null){
			iTween.ScaleTo (cardView, iTween.Hash (	"x", 0,
			                                       "y", 0,
			                                       "time", 1,
			                                       "oncomplete","onSendCardAniComplete",
			                                       "oncompletetarget", this.gameObject,
			                                       "oncompleteparams", cardView));
			_hands[ playerId ].GetComponent<HandView> ().subCard (cardView);
		}
	}

	void onSendCardAniComplete( GameObject cv ){
		Destroy (cv);
	}
	
	void onTouchConsumerEventMouseDown( TouchEvent te ){
		switch (te.name) {
		case "btn_pause":
			Sender.Receivers.ToList().ForEach( obj => {
				((IPlayPageDelegate)obj).onPlayPageBtnPauseClick( this );
			});
			break;
		}
	}

	protected override bool HandleVerifyReceiverDelegate (object receiver){
		return receiver is IPlayPageDelegate;
	}
}