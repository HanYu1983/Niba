using UnityEngine;
using System.Collections;

public interface IMatchDelegate
{
	void OnCurrentPlayerChange(IMatch match, IOption<IPlayer> player);
}