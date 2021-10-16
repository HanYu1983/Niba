using UnityEngine;
using System.Collections.Generic;
using System.Linq;

public class Deck : SenderAdapter, IDeck
{
	List<ICard> _cards = new List<ICard>();
	public IList<ICard> Cards{ get { return _cards; } }

	public bool IsEmpty { get{ return _cards.Count == 0; } }

	public void Shuffle(){
		/*
		_cards.Sort ((ICard left, ICard right) => {
			return 1;
		});
		*/
	}

	public IList<ICard> Peek(int amount){
		int count = Mathf.Min (_cards.Count, amount);
		return _cards.GetRange( _cards.Count-count, count );
	}
			
	public void Draw(IDeckPlayer player){
		if (!IsEmpty) {
			ICard card = _cards [_cards.Count - 1];
			player.AddCard (card);
			_cards.Remove (card);
			Sender.Receivers.ToList().ForEach(obj=>{
				((IDeckDelegate)obj).OnPlayerDraw(this, player, card);
			});
		}
	}

	public void Push(IDeckPlayer player, ICard card){
		if (player.IsContainCard (card)) {
			_cards.Add (player.RemoveCard (card));
			Sender.Receivers.ToList().ForEach(obj=>{
				((IDeckDelegate)obj).OnCardPush(this, player, card);
			});
		}
	}
							
	public void Insert(IDeckPlayer player, ICard card, int index){
		if (player.IsContainCard (card)) {
			_cards.Insert(index, player.RemoveCard (card));
		}
	}
								
	public void InsertBottom(IDeckPlayer player, ICard card){
		if(player.IsContainCard(card))
			_cards.Insert ( 0, player.RemoveCard (card));
	}

	public bool IsNoCard{ get{ return _cards.Count == 0; } }

	public void AddCard(ICard card){
		_cards.Add (card);
	}

	public bool IsContainCard(ICard card){
		return _cards.Contains (card);
	}

	public ICard RemoveCard(ICard card){
		_cards.Remove (card);
		return card;
	}

	protected override bool HandleVerifyReceiverDelegate (object receiver){
		return typeof(IDeckDelegate).IsAssignableFrom (receiver.GetType ());
	}
}

