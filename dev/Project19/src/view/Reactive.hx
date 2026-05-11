package view;

typedef Unsubscribe = Void -> Void;

/**
 * 專案內極小 reactive primitive。
 *
 * 只支援目前 view 需要的 map / filter / switchMap / combineLatest / subscribe / Subject.on_next。
 * BehaviorSubject 會保存最後一筆值, 讓晚訂閱者可立刻取得目前狀態。
 * 不處理 complete/error/thread/scheduler, 避免把 view 事件流綁到外部 Rx 實作細節。
 */
class Observable<T> {
	final subscribers:Array<T -> Void>;

	public function new() {
		subscribers = [];
	}

	public function subscribe(callback:T -> Void):Unsubscribe {
		subscribers.push(callback);
		return () -> subscribers.remove(callback);
	}

	public function emit(value:T):Void {
		for (callback in subscribers.copy())
			callback(value);
	}

	public function map<R>(transform:T -> R):Observable<R> {
		var output = new Observable<R>();
		subscribe(value -> output.emit(transform(value)));
		return output;
	}

	public function filter(predicate:T -> Bool):Observable<T> {
		var output = new Observable<T>();
		subscribe(value -> {
			if (predicate(value))
				output.emit(value);
		});
		return output;
	}

	public function switchMap<R>(project:T -> Observable<R>):Observable<R> {
		var output = new Observable<R>();
		var unsubscribeInner:Null<Unsubscribe> = null;

		subscribe(value -> {
			if (unsubscribeInner != null)
				unsubscribeInner();

			unsubscribeInner = project(value).subscribe(innerValue -> output.emit(innerValue));
		});

		return output;
	}

	public static function combineLatest<R>(
		first:Observable<Dynamic>,
		rest:Array<Observable<Dynamic>>,
		combinator:Array<Dynamic> -> R
	):Observable<R> {
		var sources = [first].concat(rest);
		var latest:Array<Dynamic> = [];
		var hasValue:Array<Bool> = [];
		var output = new Observable<R>();

		for (i in 0...sources.length) {
			latest[i] = null;
			hasValue[i] = false;
			var index = i;
			sources[i].subscribe(value -> {
				latest[index] = value;
				hasValue[index] = true;

				if (allReady(hasValue))
					output.emit(combinator(latest.copy()));
			});
		}

		return output;
	}

	static function allReady(values:Array<Bool>):Bool {
		for (value in values)
			if (!value)
				return false;

		return true;
	}
}

class Subject<T> extends Observable<T> {
	public function new() {
		super();
	}

	public function on_next(value:T):Void {
		emit(value);
	}
}

class BehaviorSubject<T> extends Subject<T> {
	var current:T;

	public function new(initialValue:T) {
		super();
		current = initialValue;
	}

	override public function subscribe(callback:T -> Void):Unsubscribe {
		var unsubscribe = super.subscribe(callback);
		callback(current);
		return unsubscribe;
	}

	override public function on_next(value:T):Void {
		current = value;
		super.on_next(value);
	}

	override public function map<R>(transform:T -> R):Observable<R> {
		var output = new BehaviorSubject<R>(transform(current));
		subscribe(value -> output.on_next(transform(value)));
		return output;
	}

	public function getValue():T {
		return current;
	}
}
