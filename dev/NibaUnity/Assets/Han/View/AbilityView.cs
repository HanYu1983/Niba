using System;
using UnityEngine;
using UnityEngine.UI;
using Common;

namespace View
{
	public class AbilityView : MonoBehaviour
	{
		public Text[] texts;

		public Text Search(string id){
			foreach (var i in texts) {
				if (i.name == id) {
					return i;
				}
			}
			throw new Exception ("沒有找到:"+id);
		}

		public void UpdateAbility(IModelGetter model, MapPlayer who){
			var oriBasic = who.basicAbility;

			var basic = model.PlayerBasicAbility(who);
			var offsetBasic = basic.Add (oriBasic.Negative);
			Search ("str").text = string.Format ("力:{0}({1})", basic.str, offsetBasic.str);
			Search ("vit").text = string.Format ("體:{0}({1})", basic.vit, offsetBasic.vit);
			Search ("agi").text = string.Format ("敏:{0}({1})", basic.agi, offsetBasic.agi);
			Search ("dex").text = string.Format ("技:{0}({1})", basic.dex, offsetBasic.dex);
			Search ("int").text = string.Format ("知:{0}({1})", basic.Int, offsetBasic.Int);
			Search ("luc").text = string.Format ("運:{0}({1})", basic.luc, offsetBasic.luc);

			var oriFight = basic.FightAbility;
			var fight = model.PlayerFightAbility (who);
			var offsetFight = fight.Add (oriFight.Negative);
			Search ("hp").text = string.Format ("耐久:{0}({1})", fight.hp, offsetFight.hp);
			Search ("mp").text = string.Format ("魔力:{0}({1})", fight.mp, offsetFight.mp);
			Search ("atk").text = string.Format ("物攻:{0}({1})", fight.atk, offsetFight.atk);
			Search ("def").text = string.Format ("物防:{0}({1})", fight.def, offsetFight.def);
			Search ("matk").text = string.Format ("魔攻:{0}({1})", fight.matk, offsetFight.matk);
			Search ("mdef").text = string.Format ("魔防:{0}({1})", fight.mdef, offsetFight.mdef);
			Search ("accuracy").text = string.Format ("命中:{0}({1})", fight.accuracy, offsetFight.accuracy);
			Search ("dodge").text = string.Format ("閃避:{0}({1})", fight.dodge, offsetFight.dodge);
			Search ("critical").text = string.Format ("爆擊:{0}({1})", fight.critical, offsetFight.critical);
		}
	}
}

