using UnityEngine;
using System.Collections;

namespace NN{
public interface IModelGetter
{
	Direction Direction{ get; }
	int GameNumber{ get; }
}
}