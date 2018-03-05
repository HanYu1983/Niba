using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace NightmarketAssistant
{
    public class AssignBoothList : MonoBehaviour
    {
        public BoothListHolder listHolder;
        public StorageComponent storage;

        private void Start()
        {
            listHolder.list = storage.storage.booths;
        }

        private void OnEnable()
        {
            Start();
        }
    }
}