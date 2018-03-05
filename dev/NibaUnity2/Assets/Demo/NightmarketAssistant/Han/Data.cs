using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace NightmarketAssistant
{
    [Serializable]
    public class Booth
    {
        public string name;
        public int rent;
        public string comment;
        public string Key
        {
            get
            {
                return name;
            }
        }
        public Booth(string name)
        {
            this.name = name;
        }
    }

    public enum Progress
    {
        Pending, Open, Close
    }

    [Serializable]
    public class BoothState
    {
        public long date;
        public string booth;
        public Progress progress;
        public string Key
        {
            get
            {
                return booth + "_" + date;
            }
        }
        public BoothState(long date, string booth)
        {
            this.date = date;
            this.booth = booth;
        }
    }

    [Serializable]
    public class Earn
    {
        public long date;
        public string booth;
        public int money;
        public string comment;

        public string Key
        {
            get
            {
                return booth + "_" + date;
            }
        }
        public Earn(long date, string booth)
        {
            this.date = date;
            this.booth = booth;
        }
    }

    public class Data : MonoBehaviour
    {
        
    }
}