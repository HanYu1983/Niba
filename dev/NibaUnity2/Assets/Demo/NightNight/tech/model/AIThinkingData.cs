using UnityEngine;
using System.Collections.Generic;
using System.Linq;

public class AIThinkingData : IThinking
{
	IMatch _match;
	public IMatch Match{ get { return _match; } set { _match = value; } }
	public bool HasSpecialCard(IPlayer player){
		return player.Cards.ToList().Exists((ICard card)=>{ return card.IsSpecial; } );
	}
	public bool HasNormalCard(IPlayer player){
		return player.Cards.ToList().Exists((ICard card)=>{ return card.IsNormal; } );
	}
	public bool HasAssignTargetAbility(IPlayer player){
		return player.Cards.ToList ().Exists ((ICard card) => { return card.Ability == CardAbility.AssignPlayer; });
	}
	public bool WillOutOf99(IPlayer player){
		List<ICard> minNumberPlayers = player.Cards.ToList ().FindAll ((ICard card) => {
			return card.Ability == CardAbility.Unknown;
		}).OrderBy ((ICard card) => {
			return card.Number;
		}).ToList();
		if (minNumberPlayers.Count > 0) {
			bool willOutOf99 = _match.GameState.CurrentNumber + minNumberPlayers.First().Number > 99;
			return willOutOf99;
		} else {
			return false;
		}
	}
	public IPlayer LeastCardOfPlayer(IPlayer currentPlayer){
		return _match.Players.ToList().FindAll((IOption<IPlayer> op)=>{
					return op.Identity != currentPlayer.EntityID && !op.IsDeleted;
				}).Select((IOption<IPlayer> op)=>{
					return op.Instance;
				}).ToList().OrderBy ((IPlayer p) => {
					return p.Cards.Count;
				}).First ();
	}
	public float NumberRisk(){
		return _match.GameState.CurrentNumber/ 99.0f;
	}
	public float CardCountRisk(IPlayer player){
		if (player.Cards.Count > 4) {
			return 0;
		}else {
			return 1 - (player.Cards.Count/ 4.0f);
		}
	}
	public float CardStrength(IPlayer player){
		int maxpoint = 5;
		int skillCardNumber = player.Cards.ToList ().FindAll ((ICard card) => {
			return card.Ability != CardAbility.Unknown;
		}).Count;
		return skillCardNumber > maxpoint ? 1 : skillCardNumber / (float)maxpoint;
	}
	public IPlayer TheFewestCardPlayer{ 
		get{
			return _match.Players.ToList()
				.FindAll(obj=>!obj.IsDeleted)
				.Select(obj=>obj.Instance)
				.OrderByDescending((IPlayer p)=>{
					return p.Cards.Count;
				}).First();
		}
	}
	public IOption<ICard> SelectLargestCardNumberButNoOutOf99(IPlayer player){
		ICard ret = player.Cards.ToList().FindAll((ICard card)=>{
			return card.IsNormal && _match.GameState.CurrentNumber + card.Number <= 99;
		}).OrderByDescending((ICard card)=>{
			return card.Number;
		}).First();
		return new NullOption<ICard> (ret);
	}

	public ICard RandomCard(IPlayer player){
		return player.Cards [0];
	}

	public IOption<ICard> RandomCardButSpecial(IPlayer player){
		List<ICard> sps = player.Cards.ToList().FindAll((ICard card)=>{ return card.IsSpecial; }).ToList();
		return sps.Count > 0 ? new NullOption<ICard> (sps [0]) : (IOption<ICard>)Option<ICard>.None;
	}

}