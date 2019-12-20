using UnityEngine;
using System.Collections;

namespace NN{
public interface IViewInject 
{
	IView view{ set; get; }
}
}