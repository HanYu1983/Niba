using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using System.IO;
using System;
using System.Linq;

public class CloudSave : MonoBehaviour {

    void Start()
    {
        LoadMeta();
        StartCoroutine(LoadFromOld());
    }

    public string fileNameToSave = "save.json";
    private string metaFileName = "cloudSave.json";

    private const string cloudHost = "https://particle-979.appspot.com/nightmarketssistentdbfile2";
    public string cloudPath = "/root/xiaogenban/{id}/save.json";
    public string id;

    private void GenId()
    {
        id = System.DateTime.UtcNow.Ticks + "";
    }

    public void SaveToCloud()
    {
        if (string.IsNullOrEmpty(id))
        {
            Debug.LogFormat("id not generat yet!");
            return;
        }

        var filePath = Application.persistentDataPath + "/" + fileNameToSave;
        Debug.LogFormat("use file {0}", filePath);

        string path = cloudHost + cloudPath.Replace("{id}", id);
        Debug.LogFormat("save to {0}", path);
        
    }

    private struct Meta
    {
        public string id;
    }

    public void LoadMeta()
    {
        var filePath = Application.persistentDataPath + "/" + metaFileName;
        Debug.LogFormat("load cloud meta {0}...", filePath);
        if (File.Exists(filePath) == false)
        {
            Debug.LogFormat("{0} not found. gen cloud id", filePath);
            GenId();
            return;
        }

        string json = File.ReadAllText(filePath);
        var temp = JsonUtility.FromJson<Meta>(json);
        id = temp.id;
    }

    public IEnumerator LoadFromCloud(string targetId)
    {
        if(targetId == "test")
        {
            yield return LoadFromOld();
        }

        string path = cloudHost + cloudPath.Replace("{id}", targetId);
        Debug.LogFormat("load from {0}", path);

        UnityWebRequest www = UnityWebRequest.Get(path);
        yield return www.SendWebRequest();

        if (www.isNetworkError || www.isHttpError)
        {
            Debug.Log(www.error);
            yield break;
        }

        var content = www.downloadHandler.text;
        if (content == "file not found")
        {
            yield break;
        }
    }

    [Serializable]
    private struct DB2FilePath
    {
        public string Name;
        public string Time;
    }
    
    private struct DB2Response
    {
        public string Error;
        public List<DB2FilePath> Info;
    }

    [Serializable]
    private struct OldEarn
    {
        public long date;
        public string booth;
        public int money;
        public string comment;
        public string Key
        {
            get
            {
                return booth + "" + date;
            }
        }
    }

    private struct OldEarnJson
    {
        public List<OldEarn> earns;
    }

    

    private List<OldEarn> allEarns = new List<OldEarn>();
    private int seqId = 0;
    private Earn OldEarn2Earn(OldEarn old)
    {
        Earn earn;
        earn.id = seqId++;
        earn.money = old.money;
        earn.createUTC = new DateTime(old.date).ToUniversalTime().Ticks;
        earn.memo = old.comment;
        return earn;
    }

    public Memonto GetModelMemonto()
    {
        Memonto temp;        
        temp.earns = allEarns.Select(OldEarn2Earn).ToList();
        temp.memo = allEarns.Select(d => d.comment).Distinct().Concat(allEarns.Select(d => d.booth).Distinct()).ToList();
        temp.seqId = seqId;
        return temp;
    }

    public IEnumerator LoadFromOld()
    {
        yield return null;

        UnityWebRequest www = UnityWebRequest.Get("https://particle-979.appspot.com/nightmarketssistentdbfile2/root/NightmarketAssistant/1e13a986c7022ea2725e9cd7a7bd186c/earns/earn_");
        yield return www.SendWebRequest();

        if (www.isNetworkError || www.isHttpError)
        {
            Debug.Log(www.error);
            yield break;
        }

        var content = www.downloadHandler.text;
        if (content == "file not found")
        {
            yield break;
        }

        var res = JsonUtility.FromJson<DB2Response>(content);
        if (string.IsNullOrEmpty(res.Error) == false)
        {
            Debug.Log(res.Error);
            yield break;
        }

        allEarns.Clear();
        var keys = new HashSet<string>();
        foreach (var item in res.Info)
        {
            var path = "https://particle-979.appspot.com/nightmarketssistentdbfile2/" + item.Name;
            UnityWebRequest getEarn = UnityWebRequest.Get(path);
            yield return getEarn.SendWebRequest();

            var earnStr = getEarn.downloadHandler.text;
            var earns = JsonUtility.FromJson<OldEarnJson>(earnStr);
            
            foreach(var earn in earns.earns)
            {
                if(keys.Contains(earn.Key))
                {
                    continue;
                }
                keys.Add(earn.Key);
                allEarns.Add(earn);
            }
            break;
        }
        
    }
}
