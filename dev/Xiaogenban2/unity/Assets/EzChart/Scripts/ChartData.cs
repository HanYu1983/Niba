using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace ChartUtil
{
    [System.Serializable]
    public class Data
    {
        //public string name = "";
        public bool show = true;
        public float value = 0.0f;
    }

    [System.Serializable]
    public class Series
    {
        public string name = "";
        public bool show = true;
        public List<Data> data = new List<Data>();
    }

    public class ChartData : MonoBehaviour
    {
        public string unit = "";
        public List<Series> series = new List<Series>();
        public List<string> categories = new List<string>();
    }
}