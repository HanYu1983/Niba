using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace GameView
{
    public class MessagePopup : MonoBehaviour
    {

        public Text Msg;

        public void SetText(string text)
        {
            Msg.text = text;
        }

    }
}
