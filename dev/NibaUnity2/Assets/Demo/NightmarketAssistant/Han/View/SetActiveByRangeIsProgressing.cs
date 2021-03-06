﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace NightmarketAssistant
{
    public class SetActiveByRangeIsProgressing : MonoBehaviour
    {
        public EarnsInRangeRef selection;
        public GameObject[] onList, offList;
        public Button[] enableList;

        private void OnEnable()
        {
            var shouldOn = true;
            if(selection != null)
            {
                shouldOn = selection.Ref.IsProgressing;
            }
            foreach (var o in onList)
            {
                o.SetActive(shouldOn);
            }
            foreach (var o in offList)
            {
                o.SetActive(shouldOn == false);
            }
            foreach (var o in enableList)
            {
                o.interactable = shouldOn;
            }
        }

        public void Toggle()
        {
            foreach (var o in onList)
            {
                o.SetActive(o.activeSelf == false);
            }
            foreach (var o in offList)
            {
                o.SetActive(o.activeSelf == false);
            }
        }

        public void ToggleEnable()
        {
            foreach (var o in enableList)
            {
                o.interactable = o.IsInteractable() == false;
            }
        }
    }
}