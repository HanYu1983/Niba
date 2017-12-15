using System;
using UnityEngine;
using Common;
using System.Collections.Generic;
using System.Collections;

namespace View
{
	public class HanView : MonoBehaviour, IView
	{
		public ZUIManager mgr;
		public Menu menuHome, menuMap;
		public SideMenu menuInfo;

		IModelGetter model;
		public IModelGetter ModelGetter{ set{ model = value; } }
		public IEnumerator ChangePage(Page page, Action<Exception> callback){
			switch (page) {
			case Page.Title:
				mgr.OpenMenu (menuHome);
				callback (null);
				break;
			case Page.Game:
				mgr.OpenMenu (menuMap);
				callback (null);
				break;
			}
			yield return null;
		}
		public IEnumerator ShowInfo(Info info, Action<Exception> callback){
			switch (info) {
			case Info.Map:
				{
					var map = mgr.CurActiveMenu.GetComponent<MenuMap> ();
					if (map == null) {
						throw new Exception ("xxxx");
					}
					yield return map.UpdateUI (model);
					callback (null);
				}
				break;
			case Info.Work:
				{
					mgr.OpenSideMenu (menuInfo);
					callback (null);
				}
				break;
			}
			yield return null;
		}
		public void HideInfo(Info page){

		}
	}
}

