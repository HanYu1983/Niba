using System;
using UnityEngine;
using System.Collections.Specialized;

namespace HanUtil
{
	public class HandleGoogleService : MonoBehaviour
	{
		public event Action<Exception> OnConnectResult = delegate{};
		public event Action<Exception, string> OnAuthResult = delegate{};
		public Native native;

		public void Init(){
			native.OnNativeCommand += Native_OnNativeCommand;
			var cmd = "?cmd=GooglePlayServce.connect";
			native.Command (cmd);
		}

		public void SignIn(){
			var cmd = "?cmd=GooglePlayServce.Auth.SignIn";
			native.Command (cmd);
		}

		void Native_OnNativeCommand (string cmd, NameValueCollection querys){
			switch (cmd) {
			case "GooglePlayServce.connect.ok":
				{
					OnConnectResult (null);
				}
				break;
			case "GooglePlayServce.connect.error":
				{
					var reason = querys.Get ("reason");
					OnConnectResult (new UnityException (reason));
				}
				break;
			case "GooglePlayServce.Auth.SignIn.ok":
				{
					var token = querys.Get ("token");
					OnAuthResult (null, token);
				}
				break;
			case "GooglePlayServce.Auth.SignIn.error":
				{
					var reason = querys.Get ("reason");
					OnAuthResult (new UnityException (reason), null);
				}
				break;
			}
		}
	}
}

