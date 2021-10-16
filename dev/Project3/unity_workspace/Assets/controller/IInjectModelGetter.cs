using UnityEngine;
using System.Collections;

public interface IInjectModelGetter
{
	IModelGetter ModelGetter{ get; set; }
}

