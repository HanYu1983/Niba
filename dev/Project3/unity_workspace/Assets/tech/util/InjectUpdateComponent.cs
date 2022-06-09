using UnityEngine;
using System.Collections;
using System.Linq;

public class InjectUpdateComponent : SenderMono
{
	void Update(){
		Sender.Receivers.ToList ().ForEach (obj => {
			((IInjectUpdate)obj).OnUpdate (this);
		});
	}
	protected override bool HandleVerifyReceiverDelegate (object receiver){
		return receiver is IInjectUpdate;
	}
}

