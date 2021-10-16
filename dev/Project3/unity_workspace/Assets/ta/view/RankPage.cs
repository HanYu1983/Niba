using UnityEngine;
using System.Collections;
using System.Linq;
public class RankPage : SenderMono {

	void onTouchConsumerEventMouseDown( TouchEvent te ){
		switch( te.name ){
		case "btn_quit":
			Sender.Receivers.ToList().ForEach( obj => {
				((IRankPageDelegate)obj).onRankPageBtnQuitClick( this );
			});
			break;
		}
	}

	protected override bool HandleVerifyReceiverDelegate (object receiver){
		return receiver is IRankPageDelegate;
	}
}
