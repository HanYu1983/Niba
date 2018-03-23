using UnityEngine;
using System.Collections;

namespace NN{
public interface IInjectModel
{
	IModel Model{ get; set; }
}
}