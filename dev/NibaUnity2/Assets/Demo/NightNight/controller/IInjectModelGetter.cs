using UnityEngine;
using System.Collections;

namespace NN{
public interface IInjectModelGetter
{
	IModelGetter ModelGetter{ get; set; }
}
}

