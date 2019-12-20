using UnityEngine;
using System.Collections;

public class TestMono : MonoBehaviour
{
	protected void Assert(bool shouldTrue, string msg){
		if(!shouldTrue)
			throw new UnityException(msg);
	}
}

