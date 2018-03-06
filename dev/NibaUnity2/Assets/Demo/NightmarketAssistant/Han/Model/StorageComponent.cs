using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using UnityEditor;

namespace NightmarketAssistant
{
    public class StorageComponent : MonoBehaviour, IModel
    {
        public string saveDir;
        public Storage storage = new Storage();
        public int loadMonth = 3;

        private void Awake()
        {
            saveDir = Application.persistentDataPath + "/NightmarketAssistant";
            NMAEvent.OnComponentStart += OnComponentStart;
        }

        void OnComponentStart(MonoBehaviour c)
        {
            Debug.Log("OnComponentStart:"+c.name);

            if( c is INeedModel)
            {
                var ns = c as INeedModel;
                ns.IModel = this;
            }
        }

        public List<Booth> Booths
        {
            get { return storage.booths; }
        }

        public List<EarnsInRange> GroupEarns(string booth)
        {
            return Alg.GroupEarns(storage, booth);
        }

        [ContextMenu("Run Test")]
        void Test()
        {
            StartCoroutine(TestBasic());
        }

        [ContextMenu("New Earn")]
        void NewEarn()
        {
            var e = storage.NewEarn("樂華市場");
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
        void Save()
        {
            storage.Save(saveDir);
        }

        [ContextMenu("Load")]
        void Load()
        {
            storage.Load(saveDir, Math.Max(1, loadMonth));
        }

        IEnumerator TestBasic()
        {
            Exception e = null;
            try
            {
                storage.NewEarn("abc");
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

            var earn = storage.NewEarn(lehuaMarket);
            earn.money = 300;

            yield return new WaitForEndOfFrame();

            earn = storage.NewEarn(lehuaMarket);
            earn.money = 200;

            yield return new WaitForEndOfFrame();
            storage.CloseBooth(lehuaMarket);

            yield return null; 
        }

        /*private void OnGUI()
        {
            GUILayout.BeginArea(new Rect(10, 10, 500, 500));
            if (GUILayout.Button(""))
            {

            }
            GUILayout.EndArea();
        }*/
    }
}