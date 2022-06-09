using UnityEngine;
using System.Collections;

public interface IModelGetter
{
	Direction Direction{ get; }
	int GameNumber{ get; }
}