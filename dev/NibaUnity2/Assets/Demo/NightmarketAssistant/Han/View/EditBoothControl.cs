using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System;

namespace NightmarketAssistant
{
    public class EditBoothControl : MonoBehaviour
    {
        public Action<EditBoothControl> OnEnter = delegate { };
        public BoothRef boothRef;
        public InputField txt_name, txt_rent, txt_comment;
        public bool autoUpdateOnStart;

        private void Start()
        {
            if (autoUpdateOnStart)
            {
                UpdateView();
            }
        }

        public void UpdateView()
        {
            var b = boothRef.Ref;
            txt_name.text = b.name;
            txt_rent.text = b.rent+"";
            txt_comment.text = b.comment;
        }

        public void ClickEnter()
        {
            var b = boothRef.Ref;
            b.name = txt_name.text;
            b.rent = int.Parse(txt_rent.text);
            b.comment = txt_comment.text;
            OnEnter(this);
        }
    }
}