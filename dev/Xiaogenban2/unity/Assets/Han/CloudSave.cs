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
        SetPersistentDataPath(Application.persistentDataPath);
        LoadMeta();
    }
    private const string cloudHost = "https://particle-979.appspot.com/nightmarketssistentdbfile2";
    private string metaFileName = "cloudSave.json";
    private string cloudFolder = "/root/xiaogenban/{0}/";

    private string cloudPath = "/root/xiaogenban/{0}/save{1}.json";
    
    private string id;
    private string persistentDataPath;

    private void SetPersistentDataPath(string path)
    {
        persistentDataPath = path;
    }

    private void GenId()
    {
        id = System.DateTime.UtcNow.Ticks + "";
    }

    public string GetId()
    {
        return id;
    }

    public string GetPath(string id, string postfix)
    {
        return cloudHost + string.Format(cloudPath, id, postfix);
    }

    private struct OnlyError
    {
        public string Error;
    }

    public void CheckError()
    {
        if (error != null)
        {
            throw error;
        }
    }

    public Exception GetError()
    {
        return error;
    }

    private Regex fileNameFormat = new Regex("earns(\\d+).json");

    public IEnumerator SaveToCloud(int triggerId)
    {
        error = null;
        yield return null;
        if (string.IsNullOrEmpty(id))
        {
            Debug.LogFormat("id not generat yet!");
            yield break;
        }
        // save other.json
        var otherFilePath = $"{persistentDataPath}/other.json";
        Debug.LogFormat("read file {0}", otherFilePath);
        var otherContent = File.ReadAllText(otherFilePath);
        var otherCloudPath = cloudHost + string.Format(cloudFolder, id) + "other.json";
        Debug.LogFormat("save to {0}", otherCloudPath);
        yield return SaveToCloud(otherCloudPath, otherContent);

        // save earns.json
        var bucketSize = Config.BucketSize;
        var triggerBucketId = triggerId / bucketSize;
        var info = new DirectoryInfo(persistentDataPath);
        foreach (var file in info.GetFiles())
        {
            var match = fileNameFormat.Match(file.Name);
            if(match.Success == false)
            {
                continue;
            }
            var bucketId = 0;
            if (int.TryParse(match.Groups[1].Captures[0].Value, out bucketId) == false)
            {
                Debug.Log(string.Format("invalid file: {0}", file.Name));
                continue;
            }
            if (triggerBucketId > 0 && triggerBucketId != bucketId)
            {
                continue;
            }
            var earnsFilePath = $"{persistentDataPath}/{file.Name}";
            Debug.LogFormat("read file {0}", earnsFilePath);
            var earnsContent = File.ReadAllText(earnsFilePath);
            var earnsCloudPath = cloudHost + string.Format(cloudFolder, id) + file.Name;
            Debug.LogFormat("save to {0}", earnsCloudPath);
            yield return SaveToCloud(earnsCloudPath, earnsContent);
        }
    }

    public IEnumerator SaveToCloud(string path, string content)
    {
        error = null;
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
            error = new Exception(request.error);
            Debug.Log(error);
            yield break;
        }

        var content2 = request.downloadHandler.text;
        var errRes = JsonUtility.FromJson<OnlyError>(content2);
        if (string.IsNullOrEmpty(errRes.Error) == false)
        {
            error = new Exception(errRes.Error);
            Debug.Log(error);
            yield break;
        }
    }

    private struct Meta
    {
        public string id;
    }

    public void LoadMeta()
    {
        var filePath = persistentDataPath + "/" + metaFileName;
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

    [Serializable]
    public class NameTime
    {
        public string Name;
        public string Time;
    }

    public class ListResponse
    {
        public string Error;
        public List<NameTime> Info;
    }

    public IEnumerator LoadFromCloud(string targetId)
    {
        error = null;
        if (targetId == "0000")
        {
            yield return LoadFromOld();
            yield break;
        }
        
        var content = "";
        // load others
        var otherCloudPath = cloudHost + string.Format(cloudFolder, targetId) + "other.json";
        Debug.Log("load:"+ otherCloudPath);
        yield return HttpGet(otherCloudPath, (err, str) =>
        {
            error = err;
            content = str;
        });
        Debug.Log(content);
        if (error != null)
        {
            Debug.Log(error);
            yield break;
        }
        var memonto = JsonUtility.FromJson<Memonto>(content);
        // load earns
        var earnFolderPath = cloudHost + string.Format(cloudFolder, targetId);
        Debug.Log("load:" + earnFolderPath);
        yield return HttpGet(earnFolderPath, (err, str) =>
        {
            error = err;
            content = str;
        });
        if(error != null)
        {
            Debug.Log(error);
            yield break;
        }
        var response = JsonUtility.FromJson<ListResponse>(content);
        if (string.IsNullOrEmpty(response.Error) == false)
        {
            error = new Exception(response.Error);
            yield break;
        }
        foreach (var nameTime in response.Info)
        {
            var fileName = Path.GetFileName(nameTime.Name);
            var match = fileNameFormat.Match(fileName);
            if (match.Success == false)
            {
                continue;
            }
            var earnCloudPath = $"{cloudHost}/{nameTime.Name}";
            Debug.Log("load:" + earnCloudPath);
            yield return HttpGet(earnCloudPath, (err, str) =>
            {
                error = err;
                content = str;
            });
            if (error != null)
            {
                Debug.Log(error);
                yield break;
            }
            var earnsMemonto = JsonUtility.FromJson<Memonto>(content);
            memonto.earns.AddRange(earnsMemonto.earns);
        }
        SetModelMemonto(memonto);
    }

    private static IEnumerator HttpGet(string path, Action<Exception, string> callback)
    {
        UnityWebRequest www = UnityWebRequest.Get(path);
        yield return www.SendWebRequest();

        if (www.isNetworkError || www.isHttpError)
        {
            callback(new Exception(www.error), null);
            yield break;
        }

        var content = www.downloadHandler.text;
        if (content == "file not found")
        {
            callback(new Exception(path + " file not found"), null);
            yield break;
        }
        callback(null, content);
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

    private Memonto modelMemonto;
    private Exception error = null;

    public Memonto GetModelMemonto()
    {
        if (error != null)
        {
            throw error;
        }
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
        error = null;
        Debug.Log("============LoadFromOld=============");
        yield return null;

        UnityWebRequest www = UnityWebRequest.Get("https://particle-979.appspot.com/nightmarketssistentdbfile2/root/NightmarketAssistant/1e13a986c7022ea2725e9cd7a7bd186c/earns/earn_");
        yield return www.SendWebRequest();

        if (www.isNetworkError || www.isHttpError)
        {
            error = new Exception(www.error);
            Debug.Log(www.error);
            yield break;
        }

        var content = www.downloadHandler.text;
        if (content == "file not found")
        {
            error = new Exception("file not found");
            yield break;
        }

        var res = JsonUtility.FromJson<DB2Response>(content);
        if (string.IsNullOrEmpty(res.Error) == false)
        {
            error = new Exception(res.Error);
            Debug.Log(error);
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
                error = new Exception(getEarn.error);
                Debug.Log(error);
                yield break;
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
