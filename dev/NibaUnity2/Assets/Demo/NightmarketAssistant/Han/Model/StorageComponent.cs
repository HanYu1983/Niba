using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
#if UNITY_EDITOR
using UnityEditor;
#endif

namespace NightmarketAssistant
{
    public class StorageComponent : MonoBehaviour
    {
        public string saveDir;
        public Storage storage = new Storage();

        [Range(0, 120)]
        public int loadMonth = 3;

        private void Awake()
        {
            saveDir = Application.persistentDataPath + "/NightmarketAssistant";
        }

        public List<Booth> Booths
        {
            get { return storage.booths; }
        }

        public List<BoothState> States
        {
            get
            {
                return storage.states;
            }
        }

        public List<EarnsInRange> GroupEarns(string booth)
        {
            return Alg.GroupEarns(storage, booth);
        }

        public List<Earn> GetEarn(string booth, DateTime after)
        {
            return storage.GetEarns(storage.earns, booth, after);
        }

        public BoothState GetBoothStateByBooth(string key)
        {
            return storage.GetBoothStateByBooth(key);
        }

        public void Save()
        {
            storage.Save(saveDir);
            // StartCoroutine(storage.SaveToCloud(saveDir));
        }

        public void Load()
        {
            storage = new Storage();
            storage.Load(saveDir, Math.Max(1, loadMonth));
        }

#if UNITY_EDITOR

        [ContextMenu("LoadFromCloud")]
        void LoadFromCloud()
        {
            StartCoroutine(storage.LoadFormCloud(saveDir));
        }

        [ContextMenu("Run Test")]
        void Test()
        {
            StartCoroutine(TestBasic());
        }

        [ContextMenu("New Earn")]
        void NewEarn()
        {
            var e = storage.NewEarn(storage.earns, "樂華市場");
            e.money = (int)UnityEngine.Random.Range(100, 5000);
        }

        [ContextMenu("OpenBooth")]
        void OpenBooth()
        {
            storage.OpenBooth("樂華市場");
        }

        [ContextMenu("CloseBooth")]
        void CloseBooth()
        {
            storage.CloseBooth("樂華市場");
        }

        [ContextMenu("Save")]
        public void EditorSave()
        {
            storage.Save(saveDir);
        }

        [ContextMenu("Load")]
        public void EditorLoad()
        {
            storage = new Storage();
            storage.Load(saveDir, Math.Max(1, loadMonth));
        }


        IEnumerator TestBasic()
        {
            Exception e = null;
            try
            {
                storage.NewEarn(storage.earns, "abc");
            }catch(Exception e2)
            {
                e = e2;
            }
            if (e == null || e.Message.Contains("沒有這個攤位") == false)
            {
                throw new Exception("必須吐出沒有攤位例外");
            }
            e = null;

            var lehuaMarket = "樂華市場";
            
            storage.NewBooth(lehuaMarket);
            try
            {
                storage.NewBooth(lehuaMarket);
            }catch(Exception e2)
            {
                e = e2;
            }
            if (e == null || e.Message.Contains("鍵值已存在") == false)
            {
                throw new Exception("必須吐出鍵值已存在例外");
            }
            e = null;

            try
            {
                storage.CloseBooth(lehuaMarket);
            }
            catch (Exception e2)
            {
                e = e2;
            }
            if (e == null || e.Message.Contains("攤位未開市") == false)
            {
                throw new Exception("必須吐出攤位未開市例外");
            }
            e = null;

            storage.OpenBooth(lehuaMarket);
            try
            {
                storage.OpenBooth(lehuaMarket);
            }
            catch(Exception e2)
            {
                e = e2;
            }
            if (e == null || e.Message.Contains("攤位已開市") == false)
            {
                throw new Exception("必須吐出攤位已開市例外");
            }
            e = null;

            var earn = storage.NewEarn(storage.earns, lehuaMarket);
            earn.money = 300;

            yield return new WaitForEndOfFrame();

            earn = storage.NewEarn(storage.earns, lehuaMarket);
            earn.money = 200;

            yield return new WaitForEndOfFrame();
            storage.CloseBooth(lehuaMarket);

            yield return null; 
        }
#endif
    }
}