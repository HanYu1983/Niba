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

    [Serializable]
    public class EarnsInRange
    {
        public string booth;
        public DateTime open, close;
        public List<Earn> earns = new List<Earn>();
        public bool IsProgressing;
        public EarnsInRange(string booth, DateTime open)
        {
            this.booth = booth;
            this.open = open;
            IsProgressing = true;
        }
        public EarnsInRange(string booth, DateTime open, DateTime close)
        {
            this.booth = booth;
            this.open = open;
            this.close = close;
            IsProgressing = false;
        }
    }

    public interface IModelGetter
    {
        List<Booth> Booths { get; }
        List<BoothState> States { get;  }
        List<EarnsInRange> GroupEarns(string booth);
        List<Earn> GetEarn(string booth, DateTime after);
        BoothState GetBoothStateByBooth(string key);
    }

    public interface IModel : IModelGetter
    {

    }

    public interface INeedModel
    {
        IModelGetter IModel { get; set; }
    }

    public class Data : MonoBehaviour
    {
        
    }
}