using UnityEngine;
using System.Collections;

public interface IThinking
{
	bool HasSpecialCard(IPlayer player);
	bool HasNormalCard(IPlayer player);
	bool HasAssignTargetAbility (IPlayer player);
	bool WillOutOf99 (IPlayer player);
	IPlayer LeastCardOfPlayer (IPlayer currentPlayer);
	float NumberRisk ();
	float CardCountRisk (IPlayer player);
	float CardStrength (IPlayer player);
	IPlayer TheFewestCardPlayer{ get; }
	IOption<ICard> SelectLargestCardNumberButNoOutOf99(IPlayer player);
	ICard RandomCard(IPlayer player);
	IOption<ICard> RandomCardButSpecial(IPlayer player);
}