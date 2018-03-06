using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace NightmarketAssistant
{
    public class TestStorageReport : MonoBehaviour
    {
        public StorageComponent storage;
        public List<EarnsInRange> earnsInRange;

        [ContextMenu("UpdateEditor")]
        void UpdateEditor()
        {
            earnsInRange = Alg.GroupEarns(storage.storage, "樂華市場");
            UpdateDetail();
        }

        public int curr;
        public int totalEarn;
        public int avgEarn;
        public string avgTime;

        void UpdateDetail()
        {
            if (earnsInRange.Count == 0)
            {
                return;
            }
            var earns = earnsInRange[curr];
            totalEarn = Alg.TotalEarn(earns.earns);
            avgEarn = Alg.AverageEarn(earns.earns);
            avgTime = TimeSpan.FromTicks(Alg.AverageTimeBetweenEarn(storage.storage, earns.earns)).Seconds.ToString();
        }

        [ContextMenu("Prev")]
        void Prev()
        {
            if(earnsInRange.Count == 0)
            {
                return;
            }
            --curr;
            if (curr <= 0)
            {
                curr = 0;
            }
            UpdateDetail();
        }

        [ContextMenu("Next")]
        void Next()
        {
            if (earnsInRange.Count == 0)
            {
                return;
            }
            ++curr;
            if (curr >= earnsInRange.Count)
            {
                curr = earnsInRange.Count - 1;
            }
            UpdateDetail();
        }
    }
}