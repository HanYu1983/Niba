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
		IModelGetter ModelGetter{ set; }
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

	public interface IModelGetter{
		/// <summary>
		/// 地圖狀態
		/// </summary>
		/// <value>The map objects.</value>
		/// <code>
		/// var obj1 = MapObjects[0];
		/// switch(obj1.type){
		/// case MapObjectType.Resource:{
		/// 	var info = ResourceInfos[obj1.infoKey]
		/// 	// your process
		/// 	} break;
		/// case MapObjectType.Monster:{
		/// 	var info = MonsterInfos[obj1.infoKey]
		/// 	// your process
		/// 	} break;
		/// }
		/// </code>
		List<MapObject> MapObjects{ get; }
		List<ResourceInfo> ResourceInfos{ get; }
		List<MonsterInfo> MonsterInfos{ get; }
		/// <summary>
		/// 取得移動結果
		/// 呼叫任何移動後就必須處理MoveResult，並呼叫ClearMoveResult來清除暫存
		/// </summary>
		/// <value>The move result.</value>
		MoveResult MoveResult{ get; }
		/// <summary>
		/// 取得可視的tile
		/// </summary>
		/// <value>The visible map objects.</value>
		IEnumerable<MapObject> VisibleMapObjects{ get; }
		/// <summary>
		/// 指定位置的物件列表
		/// </summary>
		/// <returns>The <see cref="System.Collections.Generic.IEnumerable`1[[Common.MapObject]]"/>.</returns>
		/// <param name="pos">Position.</param>
		IEnumerable<MapObject> MapObjectsAt (Position pos);
		MapPlayer GetMapPlayer (Place place);
		/// <summary>
		/// 取得玩家所在格的工作列表
		/// </summary>
		/// <value>The player actions.</value>
		IEnumerable<Description> Works{ get; }
		IEnumerable<Description> WorkResults{ get; }

		int IsCanFusion (string prototype, Place who);

		BasicAbility PlayerBasicAbility (Place who);
		FightAbility PlayerFightAbility (Place who);

		IEnumerable<Item> CanFusionItems{ get; }

		IEnumerable<string> AvailableNpcMissions{ get; }
		IEnumerable<string> CheckMissionNotification ();

		IEnumerable<string> AvailableSkills(Place who);

		PlayState PlayState{ get; }
        int Money { get; }
	}

	public interface IModel : IModelGetter{
		void NewGame();
		bool LoadGame();
		/// <summary>
		/// 讀取地圖
		/// 任何一張地圖就是臨時創建的
		/// 同時間只能存在一張地圖
		/// 使用MapObjects取得地圖狀態
		/// </summary>
		/// <returns>The map.</returns>
		/// <param name="type">Type.</param>
		/// <param name="callback">Callback.</param>
		void NewMap(MapType type);
		void EnterMap ();
		void ExitMap ();
		/// <summary>
		/// 向上移動一格
		/// </summary>
		void MoveUp();
		/// <summary>
		/// 向下移動一格
		/// </summary>
		void MoveDown();
		/// <summary>
		/// 向左移動一格
		/// </summary>
		void MoveLeft();
		/// <summary>
		/// 向右移動一格
		/// </summary>
		void MoveRight();
		/// <summary>
		/// 清除移動結果的暫存
		/// </summary>
		void ClearMoveResult();
		void ApplyMoveResult();

		void StartWork (Description work);
		void CancelWork ();
		void ApplyWork();

		void AddItemToStorage(Item item, Place who);
		void MoveItem (Place a, Place b, Item item);

		void Fusion (Item item, Place who);
		void EquipWeapon (Item item, Place whosWeapon, Place whosStorage);
		void UnequipWeapon (Item item, Place whosWeapon, Place whosStorage);

		void AcceptMission(string id);
		List<string> CheckMissionStatus();
		IEnumerable<AbstractItem> CompleteMission (string id);
		void ClearMissionStatus();
		void MarkMissionNotification (string mid);

		void EquipSkill (PlayState who, string skillId);
		void UnequipSkill (PlayState who, string skillId);

        void AddPlayerHp(int v);

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
		/// <summary>
		/// Determines if is can fusion the specified prototype items.
		/// </summary>
		/// <returns>
		/// 	<c>more then 1</c></c> if is can fusion the specified prototype items; otherwise, 
		/// 	<c>0</c>可以合成，但道具不夠.
		/// 	</c>-1</c>不能合成
		/// </returns>
		/// <param name="prototype">Prototype.</param>
		/// <param name="items">Items.</param>
		public static int IsCanFusion(MapPlayer who, string prototype, IEnumerable<Item> items){
			return Alg.IsCanFusion (SkillExpFn (who), prototype, items);
		}
		/// <summary>
		/// 平面化地圖物件
		/// </summary>
		/// <param name="model">Model.</param>
		/// <param name="data">Data.</param>
		/*
		MapObject[,] mapObjs;
		var leftTop = model.MapPlayer.position.Add (-5, -5).Max (0, 0);
		var rightBottom = leftTop.Add(10, 10).Min(model.MapWidth, model.MapHeight);
		FlattenMapObjects(model, MapObjectType.Resource, leftTop, rightBottom, out mapObjs);
		for (var x = 0; x < mapObjs.GetLength (1); ++x) {
			for (var y = 0; y < mapObjs.GetLength (2); ++y) {
				var obj = mapObjs[x,y];
				if(obj == MapObject.Empty){
					// 不可視的tile
				}
			}
		}
		*/ 
		public static void FlattenMapObjects(IModelGetter model, MapObjectType type, Position leftTop, Position rightBottom, out MapObject[,] data){
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

		public static void Terrian(IModelGetter model, Position leftTop, Position rightBottom, out string[,] data){
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

