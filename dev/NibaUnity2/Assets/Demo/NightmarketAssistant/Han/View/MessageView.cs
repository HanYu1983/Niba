using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace NightmarketAssistant
{
    public class MessageView : MonoBehaviour
    {
        public Text txt_title, txt_content;

        public void UpdateView(string title, string content)
        {
            if (title != null)
            {
                txt_title.text = title;
            }
            txt_content.text = content;
        }
    }
}