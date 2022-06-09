using UnityEngine;
using System.Collections;
using System.Linq;
public class ResultPage : SenderMono {
	void onTouchConsumerEventMouseDown( TouchEvent te ){
		switch (te.name) {
		case "btn_replay":
			Sender.Receivers.ToList().ForEach( obj => {
				((IResultPageDelegate)obj).onResultPageBtnReplayClick( this );
			});break;
		case "btn_rank":
			Sender.Receivers.ToList().ForEach( obj => {
				((IResultPageDelegate)obj).onResultPageBtnRankClick( this );
			});break;
		case "btn_quit":
			Sender.Receivers.ToList().ForEach( obj => {
				((IResultPageDelegate)obj).onResultPageBtnQuitClick( this );
			});break;
		}
	}

	protected override bool HandleVerifyReceiverDelegate (object receiver){
		return receiver is IResultPageDelegate;
	}
}
