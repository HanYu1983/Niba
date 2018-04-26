using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace Niba
{
    public class SetTextFont : MonoBehaviour
    {
        public Font font;
        public int fontSize;
        public GameObject[] forceList;

        private void Awake()
        {
            Apply();
        }
        public void Apply()
        {
            var txts = FindObjectsOfType<Text>();
            foreach (var txt in txts)
            {
                txt.font = font;
                if(fontSize > 0)
                {
                    txt.fontSize = fontSize;
                }
            }
            foreach (var root in forceList)
            {
                foreach (var txt in root.GetComponentsInChildren<Text>())
                {
                    txt.font = font;
                    if (fontSize > 0)
                    {
                        txt.fontSize = fontSize;
                    }
                }
            }
        }
    }
}