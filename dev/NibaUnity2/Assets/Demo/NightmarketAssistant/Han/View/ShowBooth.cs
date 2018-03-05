using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace NightmarketAssistant
{
    public class ShowBooth : MonoBehaviour
    {
        public BoothHolder booth;
        public Text text;
        public string format;

        private void Start()
        {
            text.text = string.Format(format, booth.booth.name, booth.booth.rent, booth.booth.comment);
        }

        private void OnEnable()
        {
            Start();
        }
    }
}