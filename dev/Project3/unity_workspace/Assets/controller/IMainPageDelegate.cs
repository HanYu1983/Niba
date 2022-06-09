using UnityEngine;
using System.Collections;

public interface IMainPageDelegate{
	void onMainPageBtnStartClick(object sender);
	void onMainPageBtnRankClick(object sender);
	void onMainPageBtnQuitClick(object sender);
}