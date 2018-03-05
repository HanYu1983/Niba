using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace NightmarketAssistant
{
    public class OnEscapeChangePage : MonoBehaviour
    {
        public Controller controller;
        public string page;

        void Update()
        {
            if (Input.GetKeyUp("escape"))
            {
                //Application.Quit();
                controller.ChangePage(page);
            }
        }
    }
}