using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System;
using UnityEngine.Events;
using UnityEngine.EventSystems;
using UnityEngine.Serialization;

namespace NightmarketAssistant
{
    public class EditBoothControl : MonoBehaviour
    {
        public BoothRef boothRef;
        public InputField txt_name, txt_rent, txt_comment;
        public bool autoUpdateOnStart;

        [FormerlySerializedAs("onClickEnter")]
        [SerializeField]
        private UnityEvent onClickEnter = new UnityEvent();

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
            try
            {
                b.rent = int.Parse(txt_rent.text);
            }catch(Exception e)
            {
                // ignore
            }
            b.comment = txt_comment.text;
            onClickEnter.Invoke();
        }
    }
}