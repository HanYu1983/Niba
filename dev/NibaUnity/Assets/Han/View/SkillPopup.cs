using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Common;
using System;
using System.Linq;

namespace View{
	public class SkillPopup : MonoBehaviour {
		public ListView skillListView;
		public SkillDataProvider skillDataProvider;

		void Awake(){
			skillListView.DataProvider = skillDataProvider;
		}

		public void UpdateSkillList(IModelGetter model){
			var skills = Enumerable.Range (0, ConfigSkill.ID_COUNT).Select (ConfigSkill.Get).Select(cfg=>cfg.ID);
			skillDataProvider.Data = skills.ToList();
			skillListView.UpdateDataView (model);
			skillListView.CurrItemLabel (model, skillListView.offset);
		}

		public IEnumerator HandleCommand(IModelGetter model, string msg, object args, Action<Exception> callback){
			switch (msg) {
			default:
				{
					if (msg.Contains (skillListView.CommandPrefix)) {
						yield return skillListView.HandleCommand (model, msg, args, callback);
					}
				}
				break;
			}
			yield return null;
		}
	}
}