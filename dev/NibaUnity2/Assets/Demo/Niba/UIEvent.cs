using System;
using UnityEngine;

namespace Niba
{
	public class UIEvent : MonoBehaviour
	{
		public void Notify(string msg){
			Debug.LogWarning ("[UIEvent]:"+msg);
			Common.Notify (msg, null);
		}
	}
}

