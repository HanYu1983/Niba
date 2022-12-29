package tool;

private final _id = "CardProto_179001_01A_CH_WT007R_white";
private var _idSeq = 0;

function getNextId():String {
    return '${_id}_${_idSeq++}';
}

class Helper {
	public static function getNextId():String {
		return '${_id}_${_idSeq++}';
	}
}
