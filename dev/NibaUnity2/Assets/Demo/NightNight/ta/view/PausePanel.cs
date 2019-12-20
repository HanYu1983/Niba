using UnityEngine;
using System.Collections;
using System.Linq;
public class PausePanel : SenderMono {

	void onTouchConsumerEventMouseDown( TouchEvent te ){
		switch (te.name) {
		case "btn_resume":
			Sender.Receivers.ToList ().ForEach (obj => {
				((IPausePanelDelegate)obj).onPausePanelBtnResumeClick( this );
			});
			break;
		case "btn_quit":
			Sender.Receivers.ToList ().ForEach (obj => {
				((IPausePanelDelegate)obj).onPausePanelBtnQuitClick( this );
			});
			break;
		}
	}

	protected override bool HandleVerifyReceiverDelegate (object receiver){
		return receiver is IPausePanelDelegate;
	}
}
