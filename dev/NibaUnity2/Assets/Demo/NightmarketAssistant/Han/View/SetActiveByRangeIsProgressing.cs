using System.Collections;
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

        void Start()
        {
            OnEnable();
        }
        private void OnEnable()
        {
            var shouldOn = selection.Ref.IsProgressing;
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
                o.enabled = shouldOn;
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
                o.enabled = o.enabled == false;
            }
        }
    }
}