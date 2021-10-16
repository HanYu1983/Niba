using UnityEngine;
using System.Collections;

public interface IPlayerController : ICardAbilityReceiver
{
	IPlayer Owner{ get; set; }
}