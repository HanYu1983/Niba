using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace NightmarketAssistant
{
    public class MemoView : MonoBehaviour
    {
        public EarnRef earnSelection;
        public InputField input_memo;

        private void Start()
        {
            OnEnable();
        }

        private void OnEnable()
        {
            UpdateView();
        }

        public void UpdateView()
        {
            input_memo.text = earnSelection.Ref.comment;
        }

        public string Memo
        {
            get
            {
                return input_memo.text;
            }
        }
    }
}