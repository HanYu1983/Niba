using System;
using UnityEngine;
using HanUtil;

namespace Model
{
	public class Main : MonoBehaviour
	{
		public HandleGoogleService googleService;
		public HandleDebug debug;

		void Start(){
			googleService.OnConnectResult += GoogleService_OnConnectResult;
			googleService.OnAuthResult += GoogleService_OnAuthResult;
			googleService.Init ();
		}

		void GoogleService_OnAuthResult (Exception reason, string token)
		{
			debug.Log ("GoogleService_OnAuthResult");
			if (reason != null) {
				debug.LogError (reason.Message);
			} else {
				debug.Log ("token:"+token);
			}
		}

		void GoogleService_OnConnectResult (Exception reason)
		{
			debug.Log ("GoogleService_OnConnectResult");
			if (reason != null) {
				debug.LogError (reason.Message);
			} else {
				googleService.SignIn ();
			}
		}
	}
}

