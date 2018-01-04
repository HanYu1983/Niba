using System;
using UnityEngine;
using UnityEngine.UI;
using Common;
using System.Linq;

namespace View
{
	public class AbilityView : MonoBehaviour
	{
		public GameObject[] searchTexts;
		public Text[] texts;

		void Awake(){
			texts = searchTexts.SelectMany (obj => {
				return obj.GetComponentsInChildren<Text>();
			}).ToArray();
		}

		public Text Search(string id){
			foreach (var i in texts) {
				if (i.name == id) {
					return i;
				}
			}
			throw new Exception ("沒有找到:"+id);
		}

		public void UpdateAbility(IModelGetter model, MapPlayer who_){
			if (who_.Equals (MapPlayer.UnknowPlayer)) {
				throw new Exception ("計算能力時不能傳入UnknowPlayer");
			}
			var who = 
				who_.Equals (MapPlayer.PlayerInHome) ? model.HomePlayer : model.MapPlayer;
			var oriBasic = BasicAbility.Default.Add(who.basicAbility);
			var basic = model.PlayerBasicAbility(who);

			var offsetBasic = basic.Add (oriBasic.Negative);
			Search ("str").text = string.Format ("力:{0}({1})", (int)basic.str, (int)offsetBasic.str);
			Search ("vit").text = string.Format ("體:{0}({1})", (int)basic.vit, (int)offsetBasic.vit);
			Search ("agi").text = string.Format ("敏:{0}({1})", (int)basic.agi, (int)offsetBasic.agi);
			Search ("dex").text = string.Format ("技:{0}({1})", (int)basic.dex, (int)offsetBasic.dex);
			Search ("int").text = string.Format ("知:{0}({1})", (int)basic.Int, (int)offsetBasic.Int);
			Search ("luc").text = string.Format ("運:{0}({1})", (int)basic.luc, (int)offsetBasic.luc);

			var oriFight = basic.FightAbility;
			var fight = model.PlayerFightAbility (who);
			var offsetFight = fight.Add (oriFight.Negative);
			Search ("hp").text = string.Format ("耐久:{0}({1})", (int)fight.hp, (int)offsetFight.hp);
			Search ("mp").text = string.Format ("魔力:{0}({1})", (int)fight.mp, (int)offsetFight.mp);
			Search ("atk").text = string.Format ("物攻:{0}({1})", (int)fight.atk, (int)offsetFight.atk);
			Search ("def").text = string.Format ("物防:{0}({1})", (int)fight.def, (int)offsetFight.def);
			Search ("matk").text = string.Format ("魔攻:{0}({1})", (int)fight.matk, (int)offsetFight.matk);
			Search ("mdef").text = string.Format ("魔防:{0}({1})", (int)fight.mdef, (int)offsetFight.mdef);
			Search ("accuracy").text = string.Format ("命中:{0}({1})", (int)fight.accuracy, (int)offsetFight.accuracy);
			Search ("dodge").text = string.Format ("閃避:{0}({1})", (int)fight.dodge, (int)offsetFight.dodge);
			Search ("critical").text = string.Format ("爆擊:{0}({1})", (int)fight.critical, (int)offsetFight.critical);
		}
	}
}

