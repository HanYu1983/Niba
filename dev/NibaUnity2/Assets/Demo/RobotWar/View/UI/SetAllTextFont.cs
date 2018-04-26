using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace RobotWar
{
    public class SetAllTextFont : MonoBehaviour
    {
        public Font font;
        public Text[] forceList;

        private void Awake()
        {
            Apply();
        }
        public void Apply()
        {
            var txts = FindObjectsOfType<Text>();
            foreach(var txt in txts)
            {
                txt.font = font;
            }
            if (forceList != null)
            {
                foreach (var txt in forceList)
                {
                    if(txt == null)
                    {
                        Debug.LogWarning("why is null?");
                        continue;
                    }
                    txt.font = font;
                }
            }
        }
    }
}