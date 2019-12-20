using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace Bird
{
    public class ScorePanel : MonoBehaviour
    {
        public Text txt_score, txt_maxScore;
        public int score, maxScore;

        public void UpdateView()
        {
            if(txt_score != null)
            {
                txt_score.text = score + "";
            }
            if(txt_maxScore != null)
            {
                txt_maxScore.text = maxScore + "";
            }
        }
    }
}