using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text;
using UnityEngine;
using System.Linq;

namespace Common
{
	// 有Serializable才能json字串化
	[Serializable]
	public struct Position : IEquatable<Position>{
		public int x, y;
		public Position Add(int x, int y){
			var ret = this;
			ret.x += x;
			ret.y += y;
			return ret;
		}
		public Position Add(Position b){
			return Add (b.x, b.y);
		}
		public Position Negative{
			get{
				return Zero.Add (-x, -y);
			}
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
		public bool Equals(Position other){
			return x == other.x && y == other.y;
		}
		// 向下相容
		public override bool Equals(object obj){
			if (!(obj is Position)){
				return false;
			}
			Position other = (Position) obj;
			return this.Equals(other);
		}
		// 必須同Equals(object)一同實做
		public override int GetHashCode(){
			unchecked
			{
				int hash = 17;
				hash = hash * 23 + x.GetHashCode();
				hash = hash * 23 + y.GetHashCode();
				return hash;
			}
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

	public enum MonsterThinking{
		None, AttackYou, Escape
	}

	[Serializable]
	public struct MonsterInfo {
		public string type;
		public int hp, mp;
		public BasicAbility basicAbility;
		public List<Buf> bufs;
		public void AddBuf(Buf buf){
			bufs.Add (buf);
		}

		public bool IsDied{ get { return hp <= 0; } }
		/// <summary>
		/// 勇氣值-0.5~0.5
		/// </summary>
		float brave;
		public float NormalBrave {
			get {
				return Mathf.Max (0.5f, Mathf.Min (-0.5f, brave + 0.5f));
			}
		}
		// 打你越痛勇氣值越高
		public void AttackYou(FightAbility you, int damage){
			var maxHp = you.hp;
			var rate = Mathf.Max(0, Mathf.Min(1, damage / maxHp)) - 0.5f;
			brave += rate;
		}
		// 每回合勇氣值會自動增減
		public void StepBrave(){
			var offset = (brave - 0) / 10f;
			brave += offset;
		}
		/// <summary>
		/// 仇恨值0~1
		/// </summary>
		float hate;
		public float NormalHate {
			get {
				return Mathf.Max (0, Mathf.Min (1, hate));
			}
		}
		// 越痛仇恨值越大
		public void BeAttacked(int damage){
			var rate = Mathf.Max(0, Mathf.Min(1, (float)damage / MaxHP));
			hate += rate;
		}
		public void StepHate(){
			hate -= 0.05f;
			if (hate < 0) {
				hate = 0;
			}
		}

		public int MaxHP{
			get{
				return (int)BasicAbility.Get (ConfigMonster.Get (type)).FightAbility.hp;
			}
		}

		public static MonsterInfo Empty;
	}

	[Serializable]
	public enum MapType{
		Unknown = 0
	}



	public enum Place{
		Storage, 	// 倉庫
		Pocket,		// 準備中的背包或口袋
		Map			// 地圖中
	}

	/// <summary>
	/// 使用Serializable在struct時，對JsonUtility.FromJson的支援度很像不太完整
	/// 會有其怪的問題，比如
	/// class A{
	/// 	MapPlayer a, b; // MapPlayer is struct
	/// }
	/// 在解析回來後，裡面如果有陣列的話，陣列的值很像會指到同一個
	/// 所以要將MapPlayer改為class
	/// </summary>
	[Serializable]
	public class MapPlayer{
		public Position position;
		public BasicAbility basicAbility;
		public int hp, mp;
		public bool IsDied {
			get {
				return hp <= 0;
			}
		}
		public List<Item> storage;
		// === work === //
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
		// === weapon === //
		public List<Item> weapons;
		/// <summary>
		/// 判斷武器有沒有壞，每次擊中對手時呼叫
		/// </summary>
		/// <returns>壞掉的武器</returns>
		public IEnumerable<Item> CheckHandWeaponBroken(){
			return Common.CheckHandWeaponBroken (weapons);
			/*
			return weapons
				.Select (i => new Tuple2<Item, ConfigItem> (i, ConfigItem.Get (i.prototype)))
				.Where (info => info.t2.Position == ConfigWeaponPosition.ID_hand)
				.Select (info => new Tuple2<Item, int> (info.t1, (int)((1.0f / info.t2.UseCount) * 100)))
				.Where (info => {
				var dice = UnityEngine.Random.Range (1, 101);
				return dice < info.t2;
			})
				.Select (info => info.t1);
			*/
		}
		/// <summary>
		/// 判斷防具有沒有壞，每次被擊中時呼叫
		/// </summary>
		/// <returns>壞掉的防具</returns>
		public IEnumerable<Item> CheckElseWeaponBroken(){
			return Common.CheckElseWeaponBroken (weapons);
			/*
			return weapons
				.Select (i => new Tuple2<Item, ConfigItem> (i, ConfigItem.Get (i.prototype)))
				.Where (info => info.t2.Position != ConfigWeaponPosition.ID_hand)
				.Select (info => new Tuple2<Item, int> (info.t1, (int)((1.0f / info.t2.UseCount) * 100)))
				.Where (info => {
					var dice = UnityEngine.Random.Range (1, 101);
					return dice < info.t2;
				})
				.Select (info => info.t1);
				*/
		}
		// === skill exp === //
		public List<AbstractItem> exps;
		public void AddExp(string id, int exp){
			var ai = new Item () {
				prototype = id,
				count = exp
			};
			exps = Common.AddItemWithFn (
				exps.Select (i => i.Item).ToList(), 
				ai, 
				() => int.MaxValue
			).Select(i=>i.AbstractItem).ToList();
		}
		public int Exp(string skillType){
			var ai = exps.Where (i => i.prototype == skillType).FirstOrDefault ();
			if (ai.Equals (AbstractItem.Empty)) {
				return 0;
			}
			return ai.count;
		}
		public int MaxSkillSlotCount {
			get {
				if (exps == null) {
					Debug.LogWarning ("exps還沒初始化, 回傳0");
					return 0;
				}
				var total = exps.Sum (i => i.count)/5;
				return total;
			}
		}

		// === skill === //
		public List<string> skills;
		public void AddSkill(string id){
			if (skills.Contains (id)) {
				throw new Exception (string.Format("招式已裝備:{0}", id));
			}
			var cfg = ConfigSkill.Get (id);
			var totalCnt = cfg.SlotCount + SkillSlotUsed;
			if (totalCnt > MaxSkillSlotCount) {
				throw new Exception (string.Format("招式欄位不足:{0}/{1}, 所新加招式為{2}", totalCnt, MaxSkillSlotCount, id));
			}
			skills.Add (id);
		}
		public void RemoveSkill(string id){
			if (skills.Contains (id) == false) {
				throw new Exception (string.Format("招式已取消", id));
			}
			skills.Remove (id);
		}

		public int SkillSlotUsed {
			get {
				return skills.Select (ConfigSkill.Get).Select(cfg=>cfg.SlotCount).Sum();
			}
		}

		/// <summary>
		/// 這個方法很重要
		/// 必須要注意那些資料要deep copy
		/// </summary>
		/// <param name="other">Other.</param>
		public void GetData(MapPlayer other){
			basicAbility = other.basicAbility;
			exps = new List<AbstractItem> (other.exps);
			storage = new List<Item> (other.storage);
			weapons = new List<Item> (other.weapons);
			skills = new List<string> (other.skills);
		}
		/*
		public static MapPlayer Empty = new MapPlayer{
			weapons = new List<Item>(), 
			storage = new List<Item>(),
			exps = new List<AbstractItem>(),
			skills = new List<string>()
		};
		*/
		public MapPlayer(){
			weapons = new List<Item> (); 
			storage = new List<Item> ();
			exps = new List<AbstractItem> ();
			skills = new List<string> ();
		}
	}

	[Serializable]
	public struct Description{
		public const string WorkAttack = "[work]attack {mapObjectId}";
		public const string WorkUseTurnSkill = "[work]use turn skill {skillId}";
		public const string WorkSelectSkillForEnemy = "[work]select {skillId} in {skillIds} for {mapObjectId}";
		public const string WorkUseSkillForEnemyAll = "[work]use {skillId} for {mapObjectIds}";
		public const string WorkCollectResource = "[work]collect resource {mapObjectId}";
		public const string EventLucklyFind = "[event]luckly find {itemPrototype} {count}";
		public const string EventMonsterAttackYou = "[event]{mapObjectId} attack you";
		public const string EventMonsterEscape = "[event]{mapObjectId} escape you";
		public const string EventMonsterIdle = "[event]{mapObjectId} idle";
		public const string InfoAttack = "[info]you attack {mapObjectId} and deal damage {damage}. {isCriHit}";
		public const string InfoDodge = "[info]you dodge the attack from {mapObjectId}";
		public const string InfoMonsterDied = "[info]{mapObjectId} is died. you get {rewards}"; // rewards is array of json string
		public const string InfoMonsterDodge = "[info]{mapObjectId} is dodge.";
		public const string InfoMonsterEscape = "[info]{mapObjectId} is escape.";
		public const string InfoMonsterIdle = "[info]{mapObjectId} is idle.";
		public const string InfoMonsterAttack = "[info]{mapObjectId} attack you and deal damage {damage}";
		public const string InfoWeaponBroken = "[info]{items} is broken.";	// items is array of json string
		public const string InfoUseSkill = "[info]you use {skills}.";
		public const string InfoCollectResource = "[info]you collect {items}."; // items is array of json string
		public string description;
		public NameValueCollection values;
		public static Description Empty;
	}

	public struct Interaction{
		public Description description;
		public float priority;
		public static Interaction Empty;
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
		Npc
	}

	public enum PlayState{
		Home, Play
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
		/*
		int MapWidth{ get; }
		int MapHeight{ get; }
		*/
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
		IEnumerable<string> AvailableSkills(Place who);

		PlayState PlayState{ get; }
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
		IEnumerator NewMap(MapType type, Action<Exception> callback);
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
		void ClearStorage (Place who);

		void AcceptMission(string id);
		List<string> CheckMissionStatus();
		IEnumerable<AbstractItem> CompleteMission (string id);
		void ClearMissionStatus();

		void EquipSkill (Place who, string skillId);
		void UnequipSkill (Place who, string skillId);
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
			return IsCanFusion (SkillExpFn (who), prototype, items);
			/*
			var cfg = ConfigItem.Get (prototype);
			// 判斷技能經驗是否符合
			var ais = ParseAbstractItem (cfg.SkillRequire);
			foreach (var ai in ais) {
				var st = ai.prototype;
				var needExp = ai.count;
				var haveExp = who.Exp (st);
				if (haveExp < needExp) {
					return -1;
				}
			}
			// 判斷所需道具數量
			var requires = ParseItem (ConfigItem.Get (prototype).FusionRequire);
			int minCnt = int.MaxValue;
			foreach (var requireItem in requires) {
				var search = items.Where (it => {
					return it.prototype == requireItem.prototype && it.count >= requireItem.count;
				});
				var isNotFound = search.Count () == 0;
				if (isNotFound) {
					return -1;
				}
				var total = search.Sum (it => it.count);
				var maxFusionCnt = total / requireItem.count;
				if (minCnt > maxFusionCnt) {
					minCnt = maxFusionCnt;
				}
			}
			return minCnt;
			*/
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

		public static Place PlaceAt(PlayState state){
			switch (state) {
			case PlayState.Home:
				return Place.Pocket;
			case PlayState.Play:
				return Place.Map;
			default:
				throw new Exception ("PlaceAt:"+state);
			}
		}


		#region framework
		public static IEnumerable<string> AvailableNpcMissions(Func<string, bool> missionCompletedFn, int advLevel) {
			return 
				Enumerable.Range (0, ConfigNpcMission.ID_COUNT)
					.Select (ConfigNpcMission.Get)
					.Where (cfg => cfg.Level <= advLevel)
					.Where(cfg=>missionCompletedFn(cfg.ID) == false)
					.Where (cfg => {
						if (cfg.Dependency != null) {
							var items = ParseAbstractItem (cfg.Dependency);
							foreach (var item in items) {
								var missionId = item.prototype;
								var isCompleted = missionCompletedFn (missionId);
								if (isCompleted == false) {
									return false;
								}
							}
							return true;
						}
						return true;
					})
					.Select (cfg => cfg.ID);
		}

		public static IEnumerable<ItemEffect> Effect(ConfigSkill skill){
			return skill.Effect.Split (new char[]{ ',' }).Select (v => {
				ItemEffect ef;
				ef.value = v;
				return ef;
			});
		}

		public static IEnumerable<AbstractItem> ParseAbstractItem(string itemString){
			Func<string, AbstractItem> parseOne = str => {
				var prototype = str;
				var count = 1;
				var hasCount = str.IndexOf ("_") != -1;
				if (hasCount) {
					var info = str.Split (new char[]{ '_' }, StringSplitOptions.None);
					prototype = info[0];
					try{
						count = int.Parse (info [1]);
					}catch(Exception){
						throw new Exception ("Resource中的Item欄位格式定義錯誤:"+str);
					}
				}
				AbstractItem item;
				item.prototype = prototype;
				item.count = count;
				return item;
			};
			if (string.IsNullOrEmpty(itemString)) {
				return new List<AbstractItem> ();
			}
			var hasMulti = itemString.IndexOf (",") != -1;
			if (hasMulti) {
				var strs = itemString.Split (new char[]{ ',' }, StringSplitOptions.None);
				return strs.Select (parseOne);
			}
			return Enumerable.Repeat (parseOne (itemString), 1);
		}

		public static IEnumerable<Item> ParseItem(string itemString){
			return ParseAbstractItem (itemString).Select (i => i.Item);
		}

		public static IEnumerable<Item> ParseItemFromResource(ConfigResource res){
			var hasItem = string.IsNullOrEmpty (res.Item) == false;
			if (hasItem == false) {
				return new List<Item> ();
			}
			return ParseItem (res.Item);
		}

		public static List<Item> Fusion(Item fusionTarget, List<Item> storage){
			var requires = ParseItem (ConfigItem.Get (fusionTarget.prototype).FusionRequire);
			var formatForSubstrct = requires.Select (item => {
				item.count = -(item.count*fusionTarget.count);
				return item;
			});
			var tempStorage = Enumerable.Aggregate (formatForSubstrct, storage, AddItem);
			var fusionItem = fusionTarget;
			tempStorage = AddItem (tempStorage, fusionItem);
			return tempStorage;
		}

		public static int IsCanFusion(Func<string, int> expFn, string prototype, IEnumerable<Item> items){
			var cfg = ConfigItem.Get (prototype);
			// 判斷技能經驗是否符合
			var ais = ParseAbstractItem (cfg.SkillRequire);
			foreach (var ai in ais) {
				var st = ai.prototype;
				var needExp = ai.count;
				var haveExp = expFn (st);
				if (haveExp < needExp) {
					return -1;
				}
			}
			// 判斷所需道具數量
			var requires = ParseItem (ConfigItem.Get (prototype).FusionRequire);
			int minCnt = int.MaxValue;
			foreach (var requireItem in requires) {
				var search = items.Where (it => {
					return it.prototype == requireItem.prototype && it.count >= requireItem.count;
				});
				var isNotFound = search.Count () == 0;
				if (isNotFound) {
					return -1;
				}
				var total = search.Sum (it => it.count);
				var maxFusionCnt = total / requireItem.count;
				if (minCnt > maxFusionCnt) {
					minCnt = maxFusionCnt;
				}
			}
			return minCnt;
		}

		public static IEnumerable<string> AvailableSkills(IEnumerable<string> slotSkills, List<Item> weapons){
			// 再取得武器本身的招式
			var handWeapons = weapons.Select(i=>ConfigItem.Get(i.prototype)).Where(i=>i.Position == ConfigWeaponPosition.ID_hand);
			var hasHandWeapons = handWeapons.Count () > 0;
			if (hasHandWeapons == false) {
				return slotSkills;
			}
			var skills = Enumerable
				.Range(0, ConfigSkill.ID_COUNT)
				.Select(ConfigSkill.Get);
			var weaponSkills = handWeapons.SelectMany (w => {
				return skills.Where(s=>{
					return s.SlotCount == 0 && s.SkillTypeRequire.Contains(w.SkillType);
				}).Select(s=>s.ID);
			}).Distinct();
			return slotSkills.Concat (weaponSkills);

			/*
			var skills = Enumerable
				.Range(0, ConfigSkill.ID_COUNT)
				.Select(ConfigSkill.Get);
			var who = player.GetMapPlayer (who_);
			var weapons = who.weapons;
			var useWeaponTypes = weapons.Select (i => ConfigItem.Get (i.prototype).SkillType);
			return skills.Where (cfg => {
				// 判斷技能類型需求
				// 比如：需要拳術5級和劍術3級
				var ais = Common.Common.ParseAbstractItem(cfg.SkillTypeRequire);
				foreach(var ai in ais){
					var skillType = ai.prototype;
					var skillLevel = ai.count;
					// 其中一項不符就回傳
					if(who.Exp(skillType) < skillLevel){
						return false;
					}
				}
				// 判斷這個技能是不是需要武器
				var isNeedWeapon = cfg.SlotCount == 0;
				if(isNeedWeapon == true){
					// 以第一個需求技能的代表武器為主
					var firstSkill = ais.FirstOrDefault();
					// 有需要武器一定要有所需技能類型
					var isInvalidConfig = firstSkill.Item.Equals(Item.Empty);
					if(isInvalidConfig){
						throw new Exception("錯誤的設定:"+cfg.SkillTypeRequire);
					}
					var skillType = firstSkill.prototype;
					// 判斷有沒有裝備該類技能類型的武器
					var isMatch = useWeaponTypes.Where(st=>st==skillType).Count()>0;
					if(isMatch == false){
						return false;
					}
				} else {
					// slot的招式
					// TODO 判斷有沒有裝備這個招式
				}
				return true;
			});
			*/
		}

		public static BasicAbility CalcMonsterAbility(MonsterInfo monsterInfo){
			var tmpBasic = monsterInfo.basicAbility;
			var effects = monsterInfo.bufs.SelectMany (it => it.Effects);
			var addEffect = effects.Where (ef => ef.EffectOperator == "+" || ef.EffectOperator == "-");
			var multiEffect = effects.Where (ef => ef.EffectOperator == "*");
			// 先處理基本能力
			// 先加減
			tmpBasic = addEffect.Aggregate (tmpBasic, (accu, curr) => {
				return curr.Effect(accu);
			});
			// 後乘除
			tmpBasic = multiEffect.Aggregate (tmpBasic, (accu, curr) => {
				return curr.Effect(accu);
			});
			return tmpBasic;
		}

		public static BasicAbility CalcAbility(Func<string, int> expFn, List<Item> weapons, BasicAbility basic, ref FightAbility fight){
			var tmpBasic = BasicAbility.Default;
			var skillbonus = Enumerable.Range (0, ConfigSkillType.ID_COUNT).Select (ConfigSkillType.Get)
				.Select (cfg => cfg.ID).Select (ConfigAbility.Get)
				.Select (cfg => {
					var exp = expFn(cfg.ID);
					var bonus = new BasicAbility(){
						str = cfg.Str,
						vit = cfg.Vit,
						agi = cfg.Agi,
						dex = cfg.Dex,
						Int = cfg.Int,
						luc = cfg.Luc
					};
					return bonus.Multiply(exp);
				})
				.Aggregate (BasicAbility.Zero, (total, cur) => {
					return total.Add(cur);
				});
			tmpBasic = tmpBasic.Add(skillbonus);
			tmpBasic = tmpBasic.Add(basic);
			var effects = weapons.SelectMany (it => it.Effects);
			var addEffect = effects.Where (ef => ef.EffectOperator == "+" || ef.EffectOperator == "-");
			var multiEffect = effects.Where (ef => ef.EffectOperator == "*");
			// 先處理基本能力
			// 先加減
			tmpBasic = addEffect.Aggregate (tmpBasic, (accu, curr) => {
				return curr.Effect(accu);
			});
			// 後乘除
			tmpBasic = multiEffect.Aggregate (tmpBasic, (accu, curr) => {
				return curr.Effect(accu);
			});
			// 處理後的基本能力轉成戰鬥力
			// 再處理戰鬥力
			var tmpFight = tmpBasic.FightAbility;
			// 先加減
			tmpFight = addEffect.Aggregate (tmpFight, (accu, curr) => {
				return curr.Effect(accu);
			});
			// 後乘除
			tmpFight = multiEffect.Aggregate (tmpFight, (accu, curr) => {
				return curr.Effect (accu);
			});
			fight = tmpFight;
			return tmpBasic;
		}

		public static Func<int> GetMaxCountFromItem(Item item){
			return () => {
				var config = ConfigItem.Get (item.prototype);
				var maxCount = config.MaxCount;
				return maxCount;
			};
		}

		public static List<Item> AddItem(List<Item> input, Item item){
			return AddItemWithFn (input, item, GetMaxCountFromItem (item));
		}

		/// <summary>
		/// 加入道具到指定列表
		/// </summary>
		/// <returns>The item.</returns>
		/// <param name="input">Input.</param>
		/// <param name="item">Item.</param>
		public static List<Item> AddItemWithFn(List<Item> input, Item item, Func<int> maxCountFn){
			var container = new List<Item> (input);
			var shouldArrange = true;
			var maxCount = maxCountFn ();
			if (item.count < 0) {
				// 處理減
				var allCount = input.Sum (it => {
					return it.prototype == item.prototype ? it.count : 0;
				});
				var isEnougth = allCount + item.count >= 0;
				if (isEnougth == false) {
					throw new MessageException ("道具數量不足");
				}
				shouldArrange = true;
			} else {
				// 處理加
				for (var i = 0; i < container.Count; ++i) {
					var adjItem = container [i];
					if (adjItem.prototype != item.prototype) {
						continue;
					}
					if (adjItem.count + item.count > maxCount) {
						continue;
					}
					adjItem.count += item.count;
					container [i] = adjItem;
					shouldArrange = false;
					break;
				}
			}
			if (shouldArrange == false) {
				return container;
			}
			container.Add (item);
			// 計算同一種類的道具總數
			var sumOfCount = container.Where (obj => {
				return obj.prototype == item.prototype;
			}).Aggregate (0, (sum, obj) => {
				return sum + obj.count;
			});
			// 一個道具在一格中的最大數量限制
			var maxOfItem = maxCount;
			// 依最大限制重新計算分組
			var num = sumOfCount / maxOfItem;
			// 最後一個剩餘
			var remain = sumOfCount % maxOfItem;
			// 將拿來計算的道具抽出來
			var itemExcludeAddedItemPrototype = container.Where (obj => {
				return obj.prototype != item.prototype;
			});
			// 重建要新加入的道具
			var originItem = item;
			originItem.count = maxOfItem;
			var itemsShouldReAdd = Enumerable.Repeat (originItem, num);
			if (remain > 0) {
				originItem.count = remain;
				itemsShouldReAdd = itemsShouldReAdd.Concat (Enumerable.Repeat (originItem, 1));
			}
			// 加回去
			var newItems = itemExcludeAddedItemPrototype.Concat (itemsShouldReAdd);
			return newItems.ToList();
		}

		/// <summary>
		/// 判斷武器有沒有壞，每次擊中對手時呼叫
		/// </summary>
		/// <returns>壞掉的武器</returns>
		public static IEnumerable<Item> CheckHandWeaponBroken(IEnumerable<Item> weapons){
			return weapons
				.Select (i => new Tuple2<Item, ConfigItem> (i, ConfigItem.Get (i.prototype)))
				.Where (info => info.t2.Position == ConfigWeaponPosition.ID_hand)
				.Select (info => new Tuple2<Item, int> (info.t1, (int)((1.0f / info.t2.UseCount) * 100)))
				.Where (info => {
					var dice = UnityEngine.Random.Range (1, 101);
					return dice < info.t2;
				})
				.Select (info => info.t1);
		}
		/// <summary>
		/// 判斷防具有沒有壞，每次被擊中時呼叫
		/// </summary>
		/// <returns>壞掉的防具</returns>
		public static IEnumerable<Item> CheckElseWeaponBroken(IEnumerable<Item> weapons){
			return weapons
				.Select (i => new Tuple2<Item, ConfigItem> (i, ConfigItem.Get (i.prototype)))
				.Where (info => info.t2.Position != ConfigWeaponPosition.ID_hand)
				.Select (info => new Tuple2<Item, int> (info.t1, (int)((1.0f / info.t2.UseCount) * 100)))
				.Where (info => {
					var dice = UnityEngine.Random.Range (1, 101);
					return dice < info.t2;
				})
				.Select (info => info.t1);
		}

		#endregion
	}


	#region framework
	public class Tuple2<T,T2>{
		public T t1;
		public T2 t2;
		public Tuple2(T t1, T2 t2){
			this.t1 = t1;
			this.t2 = t2;
		}
	}

	[Serializable]
	public struct BasicAbility {
		public float str, vit, agi, dex, Int, luc;

		public static BasicAbility Zero;

		public static BasicAbility Default{
			get{
				BasicAbility ret;
				ret.str = 8;
				ret.vit = 10;
				ret.agi = 5;
				ret.dex = 5;
				ret.Int = 8;
				ret.luc = 5;
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

		public BasicAbility Multiply(float b){
			var a = this;
			a.str *= b;
			a.vit *= b;
			a.agi *= b;
			a.dex *= b;
			a.Int *= b;
			a.luc *= b;
			return a;
		}

		public override string ToString(){
			return string.Format (@"腕力:{0} 體質:{1} 敏捷:{2} 技巧:{3} 知識:{4} 幸運:{5}", str, vit, agi, dex, Int, luc);
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

		public static FightAbility Zero;

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

		public float CriticalHitRate(FightAbility other){
			return critical / other.mdef;
		}

		public float AccuracyRate(FightAbility other){
			return accuracy / other.dodge;
		}

		public int Damage(FightAbility other){
			return (int)(atk - other.def);
		}
	}

	public struct ItemEffect{
		public string value;
		public string EffectOperator{
			get{
				var op = 
					value.IndexOf ("+") != -1 ? "+" :
					value.IndexOf ("*") != -1 ? "*" :
					value.IndexOf ("-") != -1 ? "-" :
					value.IndexOf("@") != -1 ? "enforce" :
					"unknown";
				/*if (op == "unknown") {
					throw new Exception ("format error:"+value);
				}*/
				return op;
			}
		}
		// 請參考Helper.CalcAbility
		public BasicAbility Effect(BasicAbility ability){
			var idx = value.Split (new char[]{ '+', '*', '-' });
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
			} 

			if (op == "-") {
				var effectValue = int.Parse (idx [1]);
				switch (target) {
				case "str":
					ability.str -= effectValue;
					break;
				case "vit":
					ability.vit -= effectValue;
					break;
				case "dex":
					ability.dex -= effectValue;
					break;
				case "agi":
					ability.agi -= effectValue;
					break;
				case "int":
					ability.Int -= effectValue;
					break;
				case "luc":
					ability.luc -= effectValue;
					break;
				}
			} 

			if (EffectOperator == "*") {
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
			var idx = value.Split (new char[]{ '+', '*', '-' });
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

			if (op == "-") {
				var effectValue = int.Parse (idx [1]);
				switch (target) {
				case "hp":
					ability.hp -= effectValue;
					break;
				case "mp":
					ability.mp -= effectValue;
					break;
				case "atk":
					ability.atk -= effectValue;
					break;
				case "def":
					ability.def -= effectValue;
					break;
				case "matk":
					ability.matk -= effectValue;
					break;
				case "mdef":
					ability.mdef -= effectValue;
					break;
				case "accuracy":
					ability.accuracy -= effectValue;
					break;
				case "dodge":
					ability.dodge -= effectValue;
					break;
				case "critical":
					ability.critical -= effectValue;
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

	[Serializable]
	public struct Item : IEquatable<Item>{
		public string prototype;
		public int count;
		public bool Equals(Item other){
			return prototype == other.prototype && count == other.count;
		}
		public AbstractItem AbstractItem{
			get{
				AbstractItem ret;
				ret.prototype = prototype;
				ret.count = count;
				return ret;
			}
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
				if (cfg.Type != ConfigItemType.ID_weapon) {
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



	[Serializable]
	public struct AbstractItem : IEquatable<AbstractItem>{
		public string prototype;
		public int count;
		public bool Equals(AbstractItem other){
			return prototype == other.prototype && count == other.count;
		}
		public Item Item{
			get{
				Item ret;
				ret.prototype = prototype;
				ret.count = count;
				return ret;
			}
		}
		public static AbstractItem Empty;
	}

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

	[Serializable]
	public struct NPC{
		public string prototype;
	}

	[Serializable]
	public struct NpcMission{
		public string prototype;
		public List<string> monsterSkilled;
		public List<Item> itemGot;
		public static NpcMission Default = new NpcMission {
			monsterSkilled = new List<string> (),
			itemGot = new List<Item> ()
		};
	}

	public class MessageException : Exception{
		public MessageException(string msg) : base(msg){}
		public MessageException(string msg, Exception inner) : base(msg, inner){}
	}
	#endregion
}

