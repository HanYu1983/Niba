package model;

enum PeopleType {
	WENGUAN(level:Int);
	WUJIANG(level:Int);
	PUTONG;
	QILIN;
}

typedef People = {
	id:Int,
	type:PeopleType,
	name:String,
	command:Int,
	force:Int,
	intelligence:Int,
	political:Int,
	charm:Int,
	cost:Int,
	abilities:Array<Int>,
	energy:Int,
	gridId:Int,
	exp:Float,
	sleep:Bool,
}

class PeopleGenerator {
	private static var inst:PeopleGenerator;

	public function new() {}

	public static function getInst():PeopleGenerator {
		if (inst == null) {
			inst = new PeopleGenerator();
		}
		return inst;
	}

	private var names:Array<String> = [
		'白絲', '傲萍', '涵珍', '訪蝶', '映青', '醉琴', '涵萍', '傲安', '覓亦', '向荷', '曼桃', '半南', '思凡', '新真', '平凡', '天彤', '爾安', '凌蕾', '安春', '訪雪', '綺夏', '香丹', '問柳', '懷嵐', '曉海',
		'雨荷', '代桃', '安秋', '書蝶', '向霜', '雁青', '靜曼', '幻白', '翠荷', '依亦', '雨天', '靜曼', '友藍', '雁露', '醉雲', '寄曼', '聽霜', '丹芙', '海曼', '天竹', '如夢', '元曼', '覓筠', '飛芹', '平雲',
		'癡玉', '盼青', '依芙', '紫凝', '綠蘭', '覓蓉', '語凡', '又筠', '思寒', '傲竹', '冬蓉', '尋風', '翠南', '凡珊', '念筠', '幻珍', '覓霜', '綺彤', '雅露', '平玉', '幻雁', '新絲', '笑蘭', '向琴', '笑海',
		'香卉', '友陽', '夢兒', '冬蝶', '以白', '夏白', '宛芹', '癡露', '初雙', '夜春', '元柏', '妙雲', '凌靈', '涵翠', '書旋', '覓風', '懷陽', '曉荷', '映筠', '盼萱', '沛真', '巧薇', '山翠', '雪藍', '醉露',
		'慕易', '靖風', '憶晴', '醉桃', '凡旋', '爾容', '飛荷', '香蕾', '半雪', '夜柏', '千凡', '靖煙', '冰萱', '寒安', '映真', '爾青', '水藍', '靜珊', '冰玉', '采陽', '雪綠', '綺晴', '山晴', '山丹', '思波',
		'傲煙', '雅玉', '綺藍', '沛琴', '如柔', '醉梅', '宛蝶', '冷陽', '懷柏', '青寒', '夏雲', '翠珊', '慕蕾', '白柳', '宛槐', '醉云', '元波', '亦絲', '青荷', '寒雪', '凝蘭', '曉柳', '香槐', '綠梅', '訪柏',
		'詩波', '小荷', '巧容', '幼海', '幼山', '友晴', '丹菡', '雁煙', '爾安', '爾玉', '碧卉', '凌松', '初香', '易竹', '元易', '之容', '曼冬', '懷之', '笑瑤', '綠楓', '水波', '妙松', '丹秋', '又旋', '映竹',
		'詩雙', '飛蕾', '千曼', '笑蕊', '千易', '采萍', '代陽', '又竹', '平瑤', '寒嵐', '南波', '宛雪', '雅蓮', '夢霜', '念芹', '傲柔', '雁霜', '綠夏', '訪曼', '傲凡', '映珍', '夜竹', '代柳', '水南', '翠巧'
	];

	private var valueMaps:Array<Dynamic> = [
		[[30, 70], [30, 70], [30, 70], [30, 70], [30, 70]],
		[[60, 95], [60, 95], [30, 70], [30, 70], [60, 95]],
		[[30, 70], [30, 70], [60, 95], [60, 95], [60, 95]],
		[[60, 95], [60, 95], [60, 95], [60, 95], [60, 95]]
	];

	private var abilitiesName:Array<String> = [
		'0槍將', '1弓將', '2騎將', '3妙計', '4商才', '5務農', '6教導', '7良官', '8監視', '9修補', '10人脈', '11徵兵'
	];

	private var valuesName:Dynamic = {
		'command': '統率',
		'force': '武力',
		'intelligence': '智力',
		'political': '政治',
		'charm': '魅力'
	};

	private var abiMaps:Array<Dynamic> = [
		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
		[0, 1, 2, 6, 8, 9, 10, 11],
		[3, 4, 5, 7, 10, 11],
		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	];

	private function getValue(map:Array<Int>):Int {
		var low = map[0];
		var high = map[1];
		var diff = high - low;
		return Math.floor(Math.random() * diff + low);
	}

	public function getAbilityName(id:Int) {
		return this.abilitiesName[id];
	}

	public function getValueName(key:String) {
		return Reflect.field(valuesName, key);
	}

	public function getPeopleTypeName(type:PeopleType) {
		return switch (type) {
			case PUTONG: '普通';
			case QILIN: '麒麟';
			case WENGUAN(0): '文官';
			case WENGUAN(1): '尚書令*';
			case WENGUAN(2): '少府*';
			case WENGUAN(3): '廷尉*';
			case WENGUAN(4): '衛尉*';
			case WENGUAN(5): '太常*';
			case WENGUAN(6): '丞相*';
			case WENGUAN(7): '太尉*';
			case WENGUAN(8): '大司馬*';
			case WENGUAN(9): '太傅*';
			case WUJIANG(0): '武將';
			case WUJIANG(1): '都尉';
			case WUJIANG(2): '中郎將';
			case WUJIANG(3): '中領軍';
			case WUJIANG(4): '偏將軍';
			case WUJIANG(5): '四方將軍';
			case WUJIANG(6): '衛將軍';
			case WUJIANG(7): '車騎將軍';
			case WUJIANG(8): '驃騎將軍';
			case WUJIANG(9): '大將軍';
			case _: '';
		}
	}

	var randomStart = Math.floor(Math.random() * 100);

	public function generate():People {
		var peopleId = Math.floor(Date.now().getTime() + Math.random() * 9999);
		var name = this.names[(peopleId + randomStart) % this.names.length];
		var type = [0, 0, 0, 0, 0, 1, 1, 2, 2, 3][(Math.floor(Math.random() * 10))];
		var values = this.valueMaps[type];
		var genAbilitys = this.abiMaps[type];
		var skillCount = [1, 2, 2, 3][type];
		skillCount = Math.ceil(Math.random() * skillCount);

		var abilities = new Set<Int>();
		while (abilities.length < skillCount) {
			abilities.add(genAbilitys[Math.floor(Math.random() * genAbilitys.length)]);
		}

		var abilitiesAry:Array<Int> = [];
		var iter = abilities.iterator();
		while (iter.hasNext()) {
			abilitiesAry.push(iter.next());
		}

		var command = this.getValue(values[0]);
		var force = this.getValue(values[1]);
		var intelligence = this.getValue(values[2]);
		var political = this.getValue(values[3]);
		var charm = this.getValue(values[4]);
		var cost = Math.round(Math.pow(command + force + intelligence + political + charm + abilitiesAry.length * 30, 3) / 100000);

		return {
			id: peopleId,
			type: switch (type) {
				case 0: PeopleType.PUTONG;
				case 1: PeopleType.WUJIANG(0);
				case 2: PeopleType.WENGUAN(0);
				case 3: PeopleType.QILIN;
				case _: PeopleType.PUTONG;
			},
			name: name,
			command: command,
			force: force,
			intelligence: intelligence,
			political: political,
			charm: charm,
			cost: cost,
			abilities: abilitiesAry,
			energy: Math.floor(Math.random() * 15) + 80,
			gridId: null,
			exp: 0,
			sleep: false
		};
	}
}
