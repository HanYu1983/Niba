using UnityEngine;
using System.Collections.Generic;
using System.Linq;

namespace NN
{
    public class Player : SenderAdapter, IPlayer
    {
        IPlayerController _controller;
        public IPlayerController Controller
        {
            get { return _controller; }
            set
            {
                _controller = value;
                _controller.Owner = this;
            }
        }

        IOption<IPlayer> _next, _prev;
        public IOption<IPlayer> Next { get { return _next; } set { _next = value; } }
        public IOption<IPlayer> Prev { get { return _prev; } set { _prev = value; } }

        IDeck _deck = new Deck();

        public bool IsNoCard { get { return _deck.IsNoCard; } }
        public void AddCard(ICard card)
        {
            _deck.AddCard(card);
        }
        public bool IsContainCard(ICard card)
        {
            return _deck.IsContainCard(card);
        }
        public ICard RemoveCard(ICard card)
        {
            return _deck.RemoveCard(card);
        }
        public IList<ICard> Cards { get { return _deck.Cards; } }

        IMatch _match;
        public IMatch Match
        {
            get { return _match; }
            set { _match = value; }
        }

        public void PushCard(ICard card)
        {
            Sender.Receivers.ToList().ForEach(obj =>
            {
                ((IPlayerDelegate)obj).OnPlayerWillPushCard(this, card);
            });
        }

        public void DrawCard()
        {
            Sender.Receivers.ToList().ForEach(obj =>
            {
                ((IPlayerDelegate)obj).OnPlayerWillDrawCard(this);
            });
        }

        public void ImDie()
        {
            Sender.Receivers.ToList().ForEach(obj =>
            {
                ((IPlayerDelegate)obj).OnPlayerDie(this);
            });
        }

        protected override bool HandleVerifyReceiverDelegate(object receiver)
        {
            return receiver is IPlayerDelegate;
        }
    }
}
