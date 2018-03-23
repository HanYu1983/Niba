using UnityEngine;
using System.Collections;

namespace NN{
public interface IModel : IModelGetter
{
	void StartGame();
	void EndGame();
	void Step();
	void PlayerJoin(IOption<IPlayer> player);
}
}