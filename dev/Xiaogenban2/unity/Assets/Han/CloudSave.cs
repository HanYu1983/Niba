using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using System.IO;
using System;
using System.Linq;
using System.Text.RegularExpressions;

public class CloudSave : MonoBehaviour {

    void Start()
    {
        LoadMeta();
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

    public string GetId()
    {
        return id;
    }

    public IEnumerator SaveToCloud()
    {
        yield return null;
        if (string.IsNullOrEmpty(id))
        {
            Debug.LogFormat("id not generat yet!");
            yield break;
        }

        var filePath = Application.persistentDataPath + "/" + fileNameToSave;
        Debug.LogFormat("use file {0}", filePath);

        if(File.Exists(filePath) == false)
        {
            Debug.LogFormat("file {0} not found. ignore save to cloud", filePath);
            yield break;
        }

        var content = File.ReadAllText(filePath);
        string path = cloudHost + cloudPath.Replace("{id}", id);
        Debug.LogFormat("save to {0}", path);

        WWWForm form = new WWWForm();
        form.AddField("Content", content);
        form.AddField("Override", "");
        var request = new UnityWebRequest(path, "POST");
        // 需要加上這行, POST中資料才能成功上傳
        // source: https://stackoverflow.com/questions/48627680/unitywebrequest-post-to-php-not-work
        request.chunkedTransfer = false;
        request.uploadHandler = new UploadHandlerRaw(form.data);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        yield return request.SendWebRequest();

        if (request.isNetworkError || request.isHttpError)
        {
            Debug.Log(request.error);
            yield break;
        }

        var content2 = request.downloadHandler.text;
        Debug.Log(content2);
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

            Meta meta;
            meta.id = id;
            File.WriteAllText(filePath, JsonUtility.ToJson(meta));
            return;
        }
        string json = File.ReadAllText(filePath);
        var temp = JsonUtility.FromJson<Meta>(json);
        id = temp.id;
    }

    public IEnumerator LoadFromCloud(string targetId)
    {
        if(targetId == "0000")
        {
            yield return LoadFromOld();
            yield break;
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

        var memonto = JsonUtility.FromJson<Memonto>(content);
        SetModelMemonto(memonto);
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
                return booth + "_" + date;
            }
        }
    }

    private struct OldEarnJson
    {
        public List<OldEarn> earns;
    }
    
    private int seqId = 0;

    private bool FilterComment(string comment)
    {
        if (string.IsNullOrEmpty(comment))
        {
            return false;
        }
        var match = Regex.Match(comment, "[+\\-0-9]+");
        if (match.Success)
        {
            if (match.Value == comment)
            {
                return false;
            }
        }
        return true;
    }

    private Earn OldEarn2Earn(OldEarn old)
    {
        Earn earn;
        earn.id = seqId++;
        earn.money = old.money;
        earn.createUTC = new DateTime(old.date).ToUniversalTime().Ticks;
        earn.memo = old.booth;
        if (FilterComment(old.comment))
        {
            earn.memo += ";" + old.comment;
        }
        return earn;
    }

    private Memonto modelMemonto = Memonto.empty;

    public Memonto GetModelMemonto()
    {
        return modelMemonto;
    }

    private void SetModelMemonto(Memonto m)
    {
        this.modelMemonto = m;
    }

    private void GenModelMemonto(List<OldEarn> allEarns)
    {
        modelMemonto.earns = allEarns.Select(OldEarn2Earn).ToList();
        modelMemonto.memo = allEarns.Select(d => d.comment).Where(FilterComment).Distinct().Concat(allEarns.Select(d => d.booth).Distinct()).ToList();
        // 注意: seqId會在OldEarn2Earn中被改變
        modelMemonto.seqId = seqId;
    }

    public IEnumerator LoadFromOld()
    {
        Debug.Log("============LoadFromOld=============");
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

        var allEarns = new List<OldEarn>();
        var keys = new HashSet<string>();
        foreach (var item in res.Info)
        {
            var path = "https://particle-979.appspot.com/nightmarketssistentdbfile2/" + item.Name;
            Debug.Log(path);
            UnityWebRequest getEarn = UnityWebRequest.Get(path);
            yield return getEarn.SendWebRequest();

            if (getEarn.isNetworkError || getEarn.isHttpError)
            {
                Debug.Log(www.error);
                continue;
            }

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
        }

        GenModelMemonto(allEarns);
    }
}
