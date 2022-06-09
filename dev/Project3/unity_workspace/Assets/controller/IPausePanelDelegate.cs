using UnityEngine;
using System.Collections;

public interface IPausePanelDelegate
{
	void onPausePanelBtnResumeClick (object sender);
	void onPausePanelBtnQuitClick (object sender);
}

