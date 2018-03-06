using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace NightmarketAssistant
{
    public class ShowBooth : MonoBehaviour
    {
        public BoothRef boothRef;
        public Text text;
        public string format;

        private void Start()
        {
            var booth = boothRef.Ref;
            text.text = string.Format(format, booth.name, booth.rent, booth.comment);
        }

        private void OnEnable()
        {
            Start();
        }
    }
}