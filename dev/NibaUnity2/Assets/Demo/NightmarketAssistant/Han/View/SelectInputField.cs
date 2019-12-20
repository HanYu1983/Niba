using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace NightmarketAssistant
{
    public class SelectInputField : MonoBehaviour
    {
        public InputField input;

        private void Start()
        {
            input.Select();
            input.ActivateInputField();
        }

        private void OnEnable()
        {
            input.Select();
            input.ActivateInputField();
        }
    }
}