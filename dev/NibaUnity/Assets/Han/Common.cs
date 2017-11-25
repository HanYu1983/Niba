﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text;
using UnityEngine;
using System.Linq;

namespace Common
{
	[Serializable]
	public struct Position : IEquatable<Position>{
		public int x, y;
		public bool Equals(Position other){
			return x == other.x && y == other.y;
		}
		public Position Add(int x, int y){
			var ret = this;
			ret.x += x;
			ret.y += y;
			return ret;
		}
		public Position Add(Position b){
			return Add (b.x, b.y);
		}
		public Position Max(int x, int y){
			var ret = this;
			ret.x = Math.Max (x, this.x);
			ret.y = Math.Max (y, this.y);
			return ret;
		}
		public Position Max(Position b){
			return Max (b.x, b.y);
		}
		public Position Min(int x, int y){
			var ret = this;
			ret.x = Math.Min (x, this.x);
			ret.y = Math.Min (y, this.y);
			return ret;
		}
		public override string ToString(){
			return string.Format ("({0}, {1})", x, y);
		}
		public static Position Zero;
	}

	[Serializable]
	public enum MapObjectType{
		Unknown = 0, 
		Resource = 1, 
		Monster = 2
	}

	[Serializable]
	public struct MapObject{
		public int key;
		public string strKey;
		public Position position;
		// info的主鍵為(type, infoKey)
		public MapObjectType type;
		public int infoKey;
		public bool died;
		public static MapObject Empty;
	}

	[Serializable]
	public struct ResourceInfo{
		public string type;
		public static ResourceInfo Empty;
	}

	[Serializable]
	public struct MonsterInfo {
		public string type;
		public int hp, mp;
		public bool IsDied{ get { return hp <= 0; } }
		public static MonsterInfo Empty;
	}

	[Serializable]
	public enum MapType{
		Unknown = 0
	}

	[Serializable]
	public struct MapPlayer{
		public Position position;
		public BasicAbility basicAbility;
		public int hp, mp;
		public List<Item> weapons;
		public Description currentWork;
		public long workFinishedTime;
		public bool IsWorking{
			get{
				return DateTime.Now.Ticks < workFinishedTime;
			}
		}
		public void ClearWork(){
			workFinishedTime = 0;
		}
	}

	public struct Description{
		public const string WorkAttack = "[work]attack {mapObjectId}";
		public const string WorkCollectResource = "[work]collect resource {mapObjectId}";
		public const string EventLucklyFind = "[event]luckly find {itemPrototype} {count}";
		public const string EventMonsterAttackYou = "[event]{mapObjectId} attack you";
		public const string InfoAttack = "[info]you attack {mapObjectId} and deal damage {damage}";
		public const string InfoMonsterAttack = "[info]{mapObjectId} attack you and deal damage {damage}";
		public string description;
		public NameValueCollection values;
		public static Description Empty;
	}

	public struct Interaction{
		public Description description;
		public float priority;
		public static Interaction Empty;
	}

	public struct BasicAbility {
		public int str, vit, agi, dex, Int, luc;

		public static BasicAbility Zero;

		public static BasicAbility Default{
			get{
				BasicAbility ret;
				ret.str = 3;
				ret.vit = 5;
				ret.agi = 3;
				ret.dex = 1;
				ret.Int = 0;
				ret.luc = 0;
				return ret;
			}
		}

		public BasicAbility Negative{
			get{
				var a = this;
				a.str = -str;
				a.vit = -vit;
				a.agi = -agi;
				a.dex = -dex;
				a.Int = -Int;
				a.luc = -luc;
				return a;
			}
		}

		public BasicAbility Add(BasicAbility b){
			var a = this;
			a.str += b.str;
			a.vit += b.vit;
			a.agi += b.agi;
			a.dex += b.dex;
			a.Int += b.Int;
			a.luc += b.luc;
			return a;
		}

		string int2bar(int v){
			return Enumerable.Repeat ("I", v).Aggregate ("", (accu, curr) => {
				return accu + curr;
			});
		}

		public override string ToString(){
			return string.Format (@"腕力:{0}
體質:{1}
敏捷:{2}
技巧:{3}
知識:{4}
幸運:{5}", int2bar(str), int2bar(vit), int2bar(agi), int2bar(dex), int2bar(Int), int2bar(luc));
		}

		public static BasicAbility Get(MonsterInfo info){
			if (string.IsNullOrEmpty (info.type)) {
				throw new Exception ("沒有指定type:"+info.type);
			}
			return Get (ConfigMonster.Get (info.type));
		}

		public static BasicAbility Get(ConfigMonster monster){
			BasicAbility ret;
			ret.str = monster.Str;
			ret.vit = monster.Vit;
			ret.agi = monster.Agi;
			ret.dex = monster.Dex;
			ret.Int = monster.Int;
			ret.luc = monster.Luc;
			return ret;
		}

		public FightAbility FightAbility{
			get{
				ConfigAbility config = null;
				FightAbility ret;

				config = ConfigAbility.Get (ConfigAbility.ID_hp);
				ret.hp = str * config.Str + vit*config.Vit + agi*config.Agi + dex*config.Dex + Int*config.Int + luc*config.Luc;

				config = ConfigAbility.Get (ConfigAbility.ID_mp);
				ret.mp = str * config.Str + vit*config.Vit + agi*config.Agi + dex*config.Dex + Int*config.Int + luc*config.Luc;

				config = ConfigAbility.Get (ConfigAbility.ID_atk);
				ret.atk = str * config.Str + vit*config.Vit + agi*config.Agi + dex*config.Dex + Int*config.Int + luc*config.Luc;

				config = ConfigAbility.Get (ConfigAbility.ID_def);
				ret.def = str * config.Str + vit*config.Vit + agi*config.Agi + dex*config.Dex + Int*config.Int + luc*config.Luc;

				config = ConfigAbility.Get (ConfigAbility.ID_matk);
				ret.matk = str * config.Str + vit*config.Vit + agi*config.Agi + dex*config.Dex + Int*config.Int + luc*config.Luc;

				config = ConfigAbility.Get (ConfigAbility.ID_mdef);
				ret.mdef = str * config.Str + vit*config.Vit + agi*config.Agi + dex*config.Dex + Int*config.Int + luc*config.Luc;

				config = ConfigAbility.Get (ConfigAbility.ID_accuracy);
				ret.accuracy = str * config.Str + vit*config.Vit + agi*config.Agi + dex*config.Dex + Int*config.Int + luc*config.Luc;

				config = ConfigAbility.Get (ConfigAbility.ID_dodge);
				ret.dodge = str * config.Str + vit*config.Vit + agi*config.Agi + dex*config.Dex + Int*config.Int + luc*config.Luc;

				config = ConfigAbility.Get (ConfigAbility.ID_critical);
				ret.critical = str * config.Str + vit*config.Vit + agi*config.Agi + dex*config.Dex + Int*config.Int + luc*config.Luc;
				return ret;
			}
		}
	}

	public struct FightAbility {
		public float hp, mp, atk, def, matk, mdef, accuracy, dodge, critical;

		public FightAbility Add(FightAbility b){
			var a = this;
			a.hp += b.hp;
			a.mp += b.mp;
			a.atk += b.atk;
			a.def += b.def;
			a.matk += b.matk;
			a.mdef += b.mdef;
			a.accuracy += b.accuracy;
			a.dodge += b.dodge;
			a.critical += b.critical;
			return a;
		}

		public FightAbility Negative{
			get{
				var a = this;
				a.hp = -hp;
				a.mp = -mp;
				a.atk = -atk;
				a.def = -def;
				a.matk = -matk;
				a.mdef = -mdef;
				a.accuracy = -accuracy;
				a.dodge = -dodge;
				a.critical = -critical;
				return a;
			}
		}

		public int Damage(FightAbility other){
			return (int)(atk - other.def);
		}

		string int2bar(float v){
			return Enumerable.Repeat ("I", (int)v).Aggregate ("", (accu, curr) => {
				return accu + curr;
			});
		}

		public override string ToString(){
			return string.Format (
				"血量:{0}\n魔力:{1}\n攻擊:{2}\n防禦:{3}\n魔攻:{4}\n魔防:{5}\n命中:{6}\n閃避:{7}\n爆擊:{8}\n", 
				int2bar(hp), int2bar(mp), int2bar(atk), int2bar(def), int2bar(matk), int2bar(mdef), int2bar(accuracy), int2bar(dodge), int2bar(critical)
			);
		}

		/*public static FightAbility Get(BasicAbility basic){
			ConfigAbility config = null;
			FightAbility ret;

			config = ConfigAbility.Get (ConfigAbility.ID_hp);
			ret.hp = basic.str * config.Str + basic.vit*config.Vit + basic.agi*config.Agi + basic.dex*config.Dex + basic.Int*config.Int + basic.luc*config.Luc;

			config = ConfigAbility.Get (ConfigAbility.ID_mp);
			ret.mp = basic.str * config.Str + basic.vit*config.Vit + basic.agi*config.Agi + basic.dex*config.Dex + basic.Int*config.Int + basic.luc*config.Luc;

			config = ConfigAbility.Get (ConfigAbility.ID_atk);
			ret.atk = basic.str * config.Str + basic.vit*config.Vit + basic.agi*config.Agi + basic.dex*config.Dex + basic.Int*config.Int + basic.luc*config.Luc;

			config = ConfigAbility.Get (ConfigAbility.ID_def);
			ret.def = basic.str * config.Str + basic.vit*config.Vit + basic.agi*config.Agi + basic.dex*config.Dex + basic.Int*config.Int + basic.luc*config.Luc;

			config = ConfigAbility.Get (ConfigAbility.ID_matk);
			ret.matk = basic.str * config.Str + basic.vit*config.Vit + basic.agi*config.Agi + basic.dex*config.Dex + basic.Int*config.Int + basic.luc*config.Luc;

			config = ConfigAbility.Get (ConfigAbility.ID_mdef);
			ret.mdef = basic.str * config.Str + basic.vit*config.Vit + basic.agi*config.Agi + basic.dex*config.Dex + basic.Int*config.Int + basic.luc*config.Luc;

			config = ConfigAbility.Get (ConfigAbility.ID_accuracy);
			ret.accuracy = basic.str * config.Str + basic.vit*config.Vit + basic.agi*config.Agi + basic.dex*config.Dex + basic.Int*config.Int + basic.luc*config.Luc;

			config = ConfigAbility.Get (ConfigAbility.ID_dodge);
			ret.dodge = basic.str * config.Str + basic.vit*config.Vit + basic.agi*config.Agi + basic.dex*config.Dex + basic.Int*config.Int + basic.luc*config.Luc;

			config = ConfigAbility.Get (ConfigAbility.ID_critical);
			ret.critical = basic.str * config.Str + basic.vit*config.Vit + basic.agi*config.Agi + basic.dex*config.Dex + basic.Int*config.Int + basic.luc*config.Luc;
			return ret;
		}

		public static FightAbility Get(ConfigMonster basic){
			ConfigAbility config = null;
			FightAbility ret;

			config = ConfigAbility.Get (ConfigAbility.ID_hp);
			ret.hp = basic.Str * config.Str + basic.Vit*config.Vit + basic.Agi*config.Agi + basic.Dex*config.Dex + basic.Int*config.Int + basic.Luc*config.Luc;

			config = ConfigAbility.Get (ConfigAbility.ID_mp);
			ret.mp = basic.Str * config.Str + basic.Vit*config.Vit + basic.Agi*config.Agi + basic.Dex*config.Dex + basic.Int*config.Int + basic.Luc*config.Luc;

			config = ConfigAbility.Get (ConfigAbility.ID_atk);
			ret.atk = basic.Str * config.Str + basic.Vit*config.Vit + basic.Agi*config.Agi + basic.Dex*config.Dex + basic.Int*config.Int + basic.Luc*config.Luc;

			config = ConfigAbility.Get (ConfigAbility.ID_def);
			ret.def = basic.Str * config.Str + basic.Vit*config.Vit + basic.Agi*config.Agi + basic.Dex*config.Dex + basic.Int*config.Int + basic.Luc*config.Luc;

			config = ConfigAbility.Get (ConfigAbility.ID_matk);
			ret.matk = basic.Str * config.Str + basic.Vit*config.Vit + basic.Agi*config.Agi + basic.Dex*config.Dex + basic.Int*config.Int + basic.Luc*config.Luc;

			config = ConfigAbility.Get (ConfigAbility.ID_mdef);
			ret.mdef = basic.Str * config.Str + basic.Vit*config.Vit + basic.Agi*config.Agi + basic.Dex*config.Dex + basic.Int*config.Int + basic.Luc*config.Luc;

			config = ConfigAbility.Get (ConfigAbility.ID_accuracy);
			ret.accuracy = basic.Str * config.Str + basic.Vit*config.Vit + basic.Agi*config.Agi + basic.Dex*config.Dex + basic.Int*config.Int + basic.Luc*config.Luc;

			config = ConfigAbility.Get (ConfigAbility.ID_dodge);
			ret.dodge = basic.Str * config.Str + basic.Vit*config.Vit + basic.Agi*config.Agi + basic.Dex*config.Dex + basic.Int*config.Int + basic.Luc*config.Luc;

			config = ConfigAbility.Get (ConfigAbility.ID_critical);
			ret.critical = basic.Str * config.Str + basic.Vit*config.Vit + basic.Agi*config.Agi + basic.Dex*config.Dex + basic.Int*config.Int + basic.Luc*config.Luc;
			return ret;
		}*/
	}

	public struct MoveResult{
		public bool isMoveSuccess;
		public List<Description> events;
		public bool HasEvent{
			get{
				return events != null && events.Count > 0;
			}
		}
		/*public List<string> events;
		public bool HasEvent{
			get{
				return events != null && events.Count > 0;
			}
		}
		public static string BuildEvent(String eventName, NameValueCollection args){
			return string.Format ("?eventName={0}&{1}", eventName, args.ToString ());
		}
		public static string ParseEvent(string eventDescription, NameValueCollection args){
			HanUtil.Native.ParseQueryString (eventDescription, Encoding.UTF8, args);
			var hasEventName = new List<string> (args.AllKeys).Contains("eventName");
			if (hasEventName == false) {
				throw new UnityException ("unknown event");
			}
			var eventName = args.Get ("eventName");
			return eventName;
		}*/
		public static MoveResult Empty;
	}

	public struct ItemEffect{
		public string value;
		public string EffectOperator{
			get{
				var op = 
					value.IndexOf ("+") != -1 ? "+" :
					value.IndexOf ("*") != -1 ? "*" :
					"unknown";
				if (op == "unknown") {
					throw new Exception ("format error:"+value);
				}
				return op;
			}
		}
		// 請參考Helper.CalcAbility
		public BasicAbility Effect(BasicAbility ability){
			var idx = value.Split (new char[]{ '+', '*' });
			if (idx.Length != 2) {
				throw new Exception ("format error:"+value);
			}
			try{
				float.Parse (idx[1]);
			}catch{
				throw new Exception ("format error:"+value);
			}

			var target = idx [0];
			var op = EffectOperator;
			if (op == "+") {
				var effectValue = int.Parse (idx [1]);
				switch (target) {
				case "str":
					ability.str += effectValue;
					break;
				case "vit":
					ability.vit += effectValue;
					break;
				case "dex":
					ability.dex += effectValue;
					break;
				case "agi":
					ability.agi += effectValue;
					break;
				case "int":
					ability.Int += effectValue;
					break;
				case "luc":
					ability.luc += effectValue;
					break;
				}
			} if (EffectOperator == "*") {
				var effectValue = float.Parse (idx [1]);
				switch (target) {
				case "str":
					ability.str = (int)(ability.str * effectValue);
					break;
				case "vit":
					ability.vit = (int)(ability.vit * effectValue);
					break;
				case "dex":
					ability.dex = (int)(ability.dex * effectValue);
					break;
				case "agi":
					ability.agi = (int)(ability.agi * effectValue);
					break;
				case "int":
					ability.Int = (int)(ability.Int * effectValue);
					break;
				case "luc":
					ability.luc = (int)(ability.luc * effectValue);
					break;
				}
			}
			return ability;
		}

		// 請參考Helper.CalcAbility
		public FightAbility Effect(FightAbility ability){
			var idx = value.Split (new char[]{ '+', '*' });
			if (idx.Length != 2) {
				throw new Exception ("format error:" + value);
			}
			try {
				float.Parse (idx [1]);
			} catch {
				throw new Exception ("format error:" + value);
			}
			var target = idx [0];
			var op = EffectOperator;
			if (op == "+") {
				var effectValue = int.Parse (idx [1]);
				switch (target) {
				case "hp":
					ability.hp += effectValue;
					break;
				case "mp":
					ability.mp += effectValue;
					break;
				case "atk":
					ability.atk += effectValue;
					break;
				case "def":
					ability.def += effectValue;
					break;
				case "matk":
					ability.matk += effectValue;
					break;
				case "mdef":
					ability.mdef += effectValue;
					break;
				case "accuracy":
					ability.accuracy += effectValue;
					break;
				case "dodge":
					ability.dodge += effectValue;
					break;
				case "critical":
					ability.critical += effectValue;
					break;
				}
			}
			if (op == "*") {
				var effectValue = float.Parse (idx [1]);
				switch (target) {
				case "hp":
					ability.hp *= effectValue;
					break;
				case "mp":
					ability.mp *= effectValue;
					break;
				case "atk":
					ability.atk *= effectValue;
					break;
				case "def":
					ability.def *= effectValue;
					break;
				case "matk":
					ability.matk *= effectValue;
					break;
				case "mdef":
					ability.mdef *= effectValue;
					break;
				case "accuracy":
					ability.accuracy *= effectValue;
					break;
				case "dodge":
					ability.dodge *= effectValue;
					break;
				case "critical":
					ability.critical *= effectValue;
					break;
				}
			}
			return ability;
		}
	}

	public struct Item : IEquatable<Item>{
		public string prototype;
		public int count;
		public bool Equals(Item other){
			return prototype == other.prototype && count == other.count;
		}
		public Item Negative{
			get{
				var a = this;
				a.prototype = prototype;
				a.count = -count;
				return a;
			}
		}
		public IEnumerable<ItemEffect> Effects {
			get {
				var cfg = ConfigItem.Get (prototype);
				if (cfg.Type != "weapon") {
					throw new Exception ("必須是武器:"+prototype);
				}
				return cfg.Ability.Split (new char[]{ ',' }).Select (v => {
					ItemEffect ef;
					ef.value = v;
					return ef;
				});
			}
		}
		public override string ToString(){
			var config = ConfigItem.Get (prototype);
			return string.Format ("({0}, {1})", config.Name, count);
		}
		public static Item Empty;

		/*
		// 向下相容
		public override bool Equals(object obj){
			if (!(obj is Item)){
				return false;
			}
			Item other = (Item) obj;
			return this.Equals(other);
		}
		// 必須同Equals(object)一同實做
		public override int GetHashCode(){
			unchecked
			{
				int hash = 17;
				hash = hash * 23 + prototype.GetHashCode();
				hash = hash * 23 + count.GetHashCode();
				return hash;
			}
		}
		*/
	}

	public enum Page{
		Unknown, Title, Game
	}

	public enum Info{
		Unknown, Event, Work, WorkResult, Map, ItemInMap, Ability
	}

	public class MessageException : Exception{
		public MessageException(string msg) : base(msg){}
		public MessageException(string msg, Exception inner) : base(msg, inner){}
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
		void HideInfo(Info page);
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
		int MapWidth{ get; }
		int MapHeight{ get; }
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
		/// <summary>
		/// 取得玩家在地圖中的狀態
		/// 注意：回傳的是struct，千萬不要暫存它，不然會取得不正確的資料
		/// </summary>
		/// <value>The map player.</value>
		MapPlayer MapPlayer{ get; }
		/// <summary>
		/// 取得玩家所在格的工作列表
		/// </summary>
		/// <value>The player actions.</value>
		IEnumerable<Description> Works{ get; }
		IEnumerable<Description> WorkResults{ get; }
		IEnumerable<Item> StorageInMap{ get; }

		bool IsCanFusionInMap (string prototype);

		BasicAbility PlayerBasicAbility (MapPlayer who);
		FightAbility PlayerFightAbility (MapPlayer who);
	}

	public interface IModel : IModelGetter{
		/// <summary>
		/// 讀取地圖
		/// 任何一張地圖就是臨時創建的
		/// 同時間只能存在一張地圖
		/// 使用MapObjects取得地圖狀態
		/// </summary>
		/// <returns>The map.</returns>
		/// <param name="type">Type.</param>
		/// <param name="callback">Callback.</param>
		IEnumerator LoadMap(MapType type, Action<Exception> callback);
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

		void StartWork (Description work);
		void CancelWork ();
		void ApplyWork();

		void AddItemToStorageInMap(Item item);
		void FusionInMap (string prototype);
		void EquipWeaponInMap (Item item);
	}

	public class Common
	{
		public static event Action<string, object> OnEvent = delegate{};
        public static void Notify(string cmd, object args)
        {
            OnEvent(cmd, args);
        }

		/// <summary>
		/// 這個方法很像不需要了
		/// </summary>
		/// <returns>The map objects for center expend.</returns>
		/// <param name="model">Model.</param>
		/// <param name="center">Center.</param>
		/// <param name="w">The width.</param>
		/// <param name="h">The height.</param>
		static List<MapObject> FilterMapObjectsForCenterExpend(IModelGetter model, Position center, int w, int h){
			return model.MapObjects.Where (obj => {
				var disX = Math.Abs (obj.position.x - center.x);
				if (disX > w) {
					return false;
				}
				var disY = Math.Abs (obj.position.y - center.y);
				if (disY > h) {
					return false;
				}
				return true;
			}).ToList ();
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
	}
}

