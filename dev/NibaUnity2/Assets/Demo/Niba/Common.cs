using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text;
using UnityEngine;
using System.Linq;

namespace Niba
{
	[Serializable]
	public struct Buf{
		public int turn;
		public string skillId;
		public IEnumerable<ItemEffect> Effects {
			get {
				var ret = new List<ItemEffect> ();
				var skill = ConfigSkill.Get (skillId);
				switch (skill.ID) {
				case ConfigSkill.ID_bokyoryokuhakai:
					ret.Add (new ItemEffect () {
						value = "def*0.7"
					});
					break;
				}
				return ret;
			}
		}
	}

    public struct MoveResult{
		public bool isMoveSuccess;
		public List<Description> events;
		public bool HasEvent{
			get{
				return events != null && events.Count > 0;
			}
		}
		public static MoveResult Empty;
	}

	public enum Page{
		Unknown, Title, Home, Game
	}

	public enum Info{
		Unknown, 
		Event, 
		Work, 
		WorkResult, 
		Map, 
		Ability, 
		Item, 
		Fusion, 
		Mission, 
		Skill, 
		SelectSkill, 
		Storage, 
		Npc,
		SelectMap
	}

	public interface IView {
		Model ModelGetter{ set; }
		/// <summary>
		/// 切換頁面
		/// callback(null if exception == null else exception)
		/// </summary>
		/// <returns>The page.</returns>
		/// <param name="page">Page.</param>
		/// <param name="callback">Callback.</param>
		IEnumerator ChangePage(Page page, Action<Exception> callback);
		IEnumerator ShowInfo(Info page, Action<Exception> callback);
		IEnumerator ShowInfo(Info page, object args, Action<Exception> callback);
		IEnumerator HideInfo(Info page);
		void Alert (string msg);
		IEnumerator MissionDialog (string mid);
		IEnumerator HandleCommand(string msg, object args, Action<Exception> callback);
	}

	public class Common
	{
		public static event Action<string, object> OnEvent = delegate{};
        public static void Notify(string cmd, object args)
        {
            OnEvent(cmd, args);
        }

		public static Func<string, int> SkillExpFn(MapPlayer who){
			return skillId => {
				return who.Exp (skillId);
			};
		}
		
		public static void FlattenMapObjects(Model model, MapObjectType type, Position leftTop, Position rightBottom, out MapObject[,] data){
			var w = rightBottom.x - leftTop.x;
			var h = rightBottom.y - leftTop.y;
			data = new MapObject[w, h];
			for (var x = 0; x < w; ++x) {
				for (var y = 0; y < h; ++y) {
					var curr = Position.Zero.Add(x, y).Add(leftTop);
					var sg = model.VisibleMapObjects.Where (obj => {
						return obj.type == type && obj.position.Equals (curr);
					})
						.GroupBy (obj => {
						if (type == MapObjectType.Resource) {
							return model.ResourceInfos [obj.infoKey].type;
						}
						if (type == MapObjectType.Resource) {
							return model.MonsterInfos [obj.infoKey].type;
						}
						return "";
					})
						.OrderByDescending (g => g.Count ())
						.FirstOrDefault ();
					// 沒半個物件所以沒有半個分類
					if (sg == null) {
						continue;
					}
					var first = sg.FirstOrDefault ();
					data [x, y] = first;
				}
			}
		}

		public static void Terrian(Model model, Position leftTop, Position rightBottom, out string[,] data){
			var w = rightBottom.x - leftTop.x;
			var h = rightBottom.y - leftTop.y;
			data = new string[w, h];
			for (var x = 0; x < w; ++x) {
				for (var y = 0; y < h; ++y) {
					var curr = Position.Zero.Add(x, y).Add(leftTop);
					var infoList = model.VisibleMapObjects.Where (obj => {
						return obj.type == MapObjectType.Resource && obj.position.Equals (curr);
					}).Select (o => {
						var info = model.ResourceInfos [o.infoKey];
						return info;
					}).Select (info => new AbstractItem {
						prototype = info.type,
						count = 1
					});;

					var isNotVisible = infoList.Count () == 0;
					if (isNotVisible) {
						data [x, y] = null;
						continue;
					}
                    // 將地上物轉為虛擬物件，方便計算是否符合地形需求
                    data[x, y] = Alg.Terrian (infoList);
				}
			}
		}
	}



}

