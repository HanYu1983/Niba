using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
#if CHART_TMPRO
using TMPro;
#endif

namespace ChartUtil
{
    public class GridItem : MonoBehaviour
    {
        public Image background;
#if CHART_TMPRO
        public TextMeshProUGUI label;
#else
        public Text label;
#endif
        public Image tick;

        public void UseLongLabel(bool longLabel, float offset)
        {
            if (longLabel)
            {
                label.alignment = Helper.ConvertAlignment(TextAnchor.MiddleRight);
                label.rectTransform.pivot = new Vector2(1.0f, 0.5f);
                label.rectTransform.localRotation = Quaternion.Euler(0.0f, 0.0f, 45.0f);
            }
            else
            {
                label.alignment = Helper.ConvertAlignment(TextAnchor.UpperCenter);
                label.rectTransform.localRotation = Quaternion.Euler(0.0f, 0.0f, 0.0f);
            }
            label.rectTransform.anchoredPosition = new Vector2(0.0f, offset);
        }
    }
}