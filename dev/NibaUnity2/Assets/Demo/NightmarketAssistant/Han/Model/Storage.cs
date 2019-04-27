using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.Linq;
using System.IO;
using UnityEngine.Networking;
using System.Text;

namespace NightmarketAssistant
{
    [Serializable]
    public class Storage
    {
        public List<Booth> booths = new List<Booth>();
        public Booth NewBooth(string name)
        {
            var b = new Booth(name);
            if (GetBooth(b.Key) != null)
            {
                throw new Exception("鍵值已存在:" + b.Key);
            }
            booths.Add(b);
            return b;
        }

        public Booth GetBooth(string key)
        {
            foreach(var b in booths)
            {
                if(b.Key == key)
                {
                    return b;
                }
            }
            return null;
        }

        public void RemoveBooth(string key)
        {
            var b = GetBooth(key);
            if (b == null)
            {
                return;
            }
            var delEarns = earns.Where(e =>
            {
                return e.booth == key;
            }).ToList();
            foreach(var e in delEarns)
            {
                earns.Remove(e);
            }

            var delS = states.Where(s =>
            {
                return s.booth == key;
            }).ToList();
            foreach (var e in delS)
            {
                states.Remove(e);
            }
            booths.Remove(b);
        }

        public List<Earn> earns = new List<Earn>();
        public List<Earn> costEarns = new List<Earn>();

        public Earn ForceNewEarn(List<Earn> earns)
        {
            var b = new Earn(DateTime.Now.Ticks, "__costEarn__");
            if (GetEarn(earns, b.Key) != null)
            {
                throw new Exception("鍵值已存在:" + b.Key);
            }
            earns.Add(b);
            return b;
        }

        public Earn NewEarn(List<Earn> earns, string booth)
        {
            if(GetBooth(booth) == null)
            {
                throw new Exception("沒有這個攤位:" + booth);
            }
            var bs = GetBoothStateByBooth(booth);
            if (bs == null || bs.progress != Progress.Open)
            {
                throw new Exception("攤位未開市:" + booth);
            }
            var b = new Earn(DateTime.Now.Ticks, booth);
            if(GetEarn(earns, b.Key) != null)
            {
                throw new Exception("鍵值已存在:"+b.Key);
            }
            earns.Add(b);
            return b;
        }

        public Earn GetEarn(List<Earn> earns, string key)
        {
            foreach (var b in earns)
            {
                if (b.Key == key)
                {
                    return b;
                }
            }
            return null;
        }

        public List<Earn> GetEarns(List<Earn> earns, string booth, DateTime start)
        {
            return earns.Where(e =>
            {
                return e.booth == booth;
            }).OrderBy(e=>e.date).SkipWhile(e =>
            {
                var t = new DateTime(e.date);
                var isBefore = DateTime.Compare(t, start) < 0;
                return isBefore;
            }).ToList();
        }

        public List<BoothState> states = new List<BoothState>();
        public BoothState GetBoothStateByBooth(string booth)
        {
            var ret = states.Where(s =>
            {
                return s.booth == booth;
            }).OrderByDescending(s =>
            {
                return s.date;
            }).FirstOrDefault();
            return ret;
        }

        public void OpenBooth(string booth)
        {
            var b = GetBooth(booth);
            if(b == null)
            {
                throw new Exception("沒有這個攤位:" + booth);
            }
            var bs = GetBoothStateByBooth(booth);
            if(bs != null)
            {
                if(bs.progress == Progress.Open)
                {
                    throw new Exception("攤位已開市:"+booth);
                }
            }
            var s = new BoothState(DateTime.Now.Ticks, booth, Progress.Open);
            if(GetBoothState(s.Key) != null)
            {
                throw new Exception("鍵值已存在:" + s.Key);
            }
            states.Add(s);
        }

        public void CloseBooth(string booth)
        {
            var b = GetBooth(booth);
            if (b == null)
            {
                throw new Exception("沒有這個攤位:" + booth);
            }
            var bs = GetBoothStateByBooth(booth);
            if(bs == null || bs.progress != Progress.Open)
            {
                throw new Exception("攤位未開市:" + booth);
            }
            var s = new BoothState(DateTime.Now.Ticks, booth, Progress.Close);
            if (GetBoothState(s.Key) != null)
            {
                throw new Exception("鍵值已存在:" + s.Key);
            }
            states.Add(s);
        }

        public BoothState GetBoothState(string key)
        {
            foreach (var b in states)
            {
                if (b.Key == key)
                {
                    return b;
                }
            }
            return null;
        }

        public void DeleteLastOpenState(string booth)
        {
            var s = GetBoothStateByBooth(booth);
            if(s.progress != Progress.Open)
            {
                throw new Exception("即將刪除的最後一個狀態並不是開市狀態:"+booth);
            }
            states.Remove(s);
        }

        public void DeleteStateAtTargetRange(string booth, long openTime, long closeTime)
        {
            var row1 = new BoothState(openTime, booth, Progress.Open);
            var row1InStorage = GetBoothState(row1.Key);
            if (row1InStorage == null)
            {
                throw new Exception("沒有開市資料:"+booth+" "+openTime);
            }
            if (row1InStorage.progress != Progress.Open)
            {
                throw new Exception("要刪除的開市狀態並不是開市狀態:" + booth + " " + openTime);
            }
            var row2 = new BoothState(closeTime, booth, Progress.Close);
            var row2InStorage = GetBoothState(row2.Key);
            if (row2InStorage == null)
            {
                throw new Exception("沒有結市資料:" + booth + " " + closeTime);
            }
            if (row2InStorage.progress != Progress.Close)
            {
                throw new Exception("要刪除的結市狀態並不是結市狀態:" + booth + " " + closeTime);
            }
            states.Remove(row1InStorage);
            states.Remove(row2InStorage);
        }

        class SaveMain
        {
            public List<Booth> booths;
            public List<Earn> costEarns;
        }

        class SaveSub
        {
            public List<BoothState> boothStates;
            public List<Earn> earns;
        }

        public void PrepareDir(string dir)
        {
            var path = dir + "/earns";
            if (Directory.Exists(path) == false) {
                Directory.CreateDirectory(path);
            }
        }

        public void Save(string dir)
        {
            PrepareDir(dir);

            var mainJson = JsonUtility.ToJson(new SaveMain() { booths = booths, costEarns = costEarns });
            var path = dir + "/booth.json";
            Debug.Log("Save:" + path);
            File.WriteAllText(path, mainJson);
            // 只寫這個月的
            var stateInThisMonth = states.Where(s =>
            {
                return new DateTime(s.date).Month == DateTime.Now.Month;
            }).ToList();
            var earnsInThisMonth = earns.Where(e =>
            {
                return new DateTime(e.date).Month == DateTime.Now.Month;
            }).ToList();
            var subJson = JsonUtility.ToJson(new SaveSub() { earns = earnsInThisMonth, boothStates = stateInThisMonth });
            var subPath = dir + "/" + FileKey(DateTime.Now);
            Debug.Log("Save:" + subPath);
            File.WriteAllText(subPath, subJson);
        }

        [Serializable]
        struct TmpFile
        {
            public String Name;
            public String Time;
        }

        [Serializable]
        struct TmpRespones {
            public String Error;
            public TmpFile[] Info;
        }

        public IEnumerator LoadFromCloud(string dir, string cloudSaveDir)
        {
            PrepareDir(dir);
            var cloudfilename = "root/NightmarketAssistant/" + WWW.EscapeURL(SystemInfo.deviceUniqueIdentifier);
            var filepath = cloudSaveDir + "/" + cloudfilename;
            using (UnityWebRequest www = UnityWebRequest.Get(filepath))
            {
                yield return www.SendWebRequest();

                if (www.isNetworkError || www.isHttpError)
                {
                    Debug.LogWarning(www.error);
                }
                else
                {
                    TmpRespones res = JsonUtility.FromJson<TmpRespones>(www.downloadHandler.text);
                    foreach(var f in res.Info)
                    {
                        //Debug.Log(f.Name);

                        var filepath2 = cloudSaveDir + "/" + f.Name;
                        //Debug.Log(filepath2);

                        using (UnityWebRequest www2 = UnityWebRequest.Get(filepath2))
                        {
                            yield return www2.SendWebRequest();

                            if (www2.isNetworkError || www.isHttpError)
                            {
                                Debug.LogWarning(www.error);
                            }
                            else
                            {
                                var content = www2.downloadHandler.text;
                                if(content == "file not found")
                                {
                                    Debug.LogWarning("file not found");
                                    continue;
                                }
                                var localName = dir + f.Name.Replace(cloudfilename, "");
                                File.WriteAllText(localName, content);
                                //Debug.Log("replace " + localName + " content is "+content);
                            }
                        }
                    }
                }
            }
        }

        public IEnumerator SaveToCloud(string dir, string cloudSaveDir)
        {
            var info = new DirectoryInfo(dir+"/earns/");
            var files = info.GetFiles().Select((file) => { return "/earns/" + file.Name; }).ToList();
            files.Add("/booth.json");

            foreach (var file in files) {
                // Debug.Log(file);

                StreamReader reader = new StreamReader(dir+file);
                string content = reader.ReadToEnd();
                reader.Close();

                var cloudfilename = "root/NightmarketAssistant/" + WWW.EscapeURL(SystemInfo.deviceUniqueIdentifier) + file;
                var filepath = cloudSaveDir + "/" + cloudfilename;
                Debug.Log("saveToCloud:"+filepath);

                WWWForm form = new WWWForm();
                form.AddField("Content", content);
                form.AddField("Override", "");
                var request = new UnityWebRequest(filepath, "POST");
                // 需要加上這行, POST中資料才能成功上傳
                // source: https://stackoverflow.com/questions/48627680/unitywebrequest-post-to-php-not-work
                request.chunkedTransfer = false;
                request.uploadHandler = new UploadHandlerRaw(form.data);
                request.downloadHandler = new DownloadHandlerBuffer();
                request.SetRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
                yield return request.SendWebRequest();

                if (request.isNetworkError || request.isHttpError)
                {
                    Debug.LogWarning(request.error);
                }
                else
                {
                    //Debug.Log("Form upload complete!, filepath:" + filepath);
                }
                //Debug.Log(request.downloadHandler.text);
            }
        }

        public bool Load(string dir, int month)
        {
            var path = dir + "/booth.json";
            Debug.Log("Load:"+path);
            if (File.Exists(path))
            {
                var json = File.ReadAllText(path);
                var main = JsonUtility.FromJson<SaveMain>(json);
                booths = main.booths;
                costEarns = main.costEarns;
            } else
            {
                return false;
            }
            // 讀取這個月加上前幾個月
            var date = DateTime.Now;
            for (var i = 0; i < month; ++i)
            {
                var subPath = dir + "/" + FileKey(date);
                if (File.Exists(subPath))
                {
                    var json = File.ReadAllText(subPath);
                    var sub = JsonUtility.FromJson<SaveSub>(json);
                    //states.AddRange(sub.boothStates);
                    //earns.AddRange(sub.earns);

                    var closed = new Dictionary<string, bool>();
                    foreach (var s in sub.boothStates)
                    {
                        if (closed.ContainsKey(s.Key))
                        {
                            continue;
                        }
                        closed.Add(s.Key, true);
                        states.Add(s);
                    }
                    var closed2 = new Dictionary<string, bool>();
                    var newEarns = new List<Earn>();
                    foreach (var e in sub.earns)
                    {
                        if (closed2.ContainsKey(e.Key))
                        {
                            continue;
                        }
                        closed2.Add(e.Key, true);
                        earns.Add(e);
                    }
                }
                date = date.AddMonths(-1);
            }
            return true;
        }

        string FileKey(DateTime t)
        {
            return string.Format("earns/earn_{0}_{1}.json", t.Year, t.Month);
        }
    }

    public class Alg
    {
        public static int TotalEarn(List<Earn> earns)
        {
            return earns.Sum(earn =>
            {
                return earn.money;
            });
        }

        public static int AverageEarn(List<Earn> earns)
        {
            if(earns.Count == 0)
            {
                return 0;
            }
            return TotalEarn(earns) / earns.Count;
        }

        public static int MaxEarn(List<Earn> earns)
        {
            if (earns.Count == 0)
            {
                return 0;
            }
            return earns.Max(earn =>
            {
                return earn.money;
            });
        }

        public static int MinEarn(List<Earn> earns)
        {
            if (earns.Count == 0)
            {
                return 0;
            }
            return earns.Min(earn =>
            {
                return earn.money;
            });
        }

        public static long AverageTimeBetweenEarn(List<BoothState> states, List<Earn> earns)
        {
            if(earns.Count == 0)
            {
                return 0;
            }
            var onlyOne = earns.OrderBy(e => e.date).First();
            var openTime = states.Where(s => s.booth == onlyOne.booth)
                .OrderBy(s => s.date)
                .TakeWhile(s => s.date < onlyOne.date)
                .LastOrDefault();
            if(openTime == null || openTime.progress != Progress.Open)
            {
                throw new Exception("找不到開市的資料:" + onlyOne.booth + " at " + onlyOne.date);
            }
            if (earns.Count == 1)
            {
                return onlyOne.date - openTime.date;
            }
            var onlyLast = earns.OrderBy(e => e.date).Last();
            var closeTime = states.Where(s => s.booth == onlyLast.booth)
                .OrderBy(s => s.date)
                .SkipWhile(s => s.date <= onlyLast.date)
                .FirstOrDefault();

            if(closeTime == null)
            {
                return (onlyLast.date - openTime.date) / earns.Count;
            }
            if(closeTime.progress != Progress.Close)
            {
                throw new Exception("沒有找到結市資料, 資料有誤:"+onlyLast.booth+" at "+onlyLast.date);
            }
            return (closeTime.date - openTime.date) / earns.Count;
        }

        public static List<Earn> BoothEarns(Storage storage, string booth)
        {
            return storage.earns.Where(earn =>
            {
                return earn.booth == booth;
            }).ToList();
        }

        public static List<EarnsInRange> GroupEarns(Storage storage, string booth)
        {
            var currState = Progress.Pending;
            var timeStart = 0L;
            var timeEnd = 0L;
            var ranges = new List<long>();
            foreach (var s in storage.states.OrderBy(s => s.date))
            {
                if (s.booth != booth)
                {
                    continue;
                }
                switch (currState)
                {
                    case Progress.Pending:
                        {
                            if (s.progress == Progress.Open)
                            {
                                currState = Progress.Open;
                                timeStart = s.date;
                            }
                        }
                        break;
                    case Progress.Open:
                        {
                            if (s.progress == Progress.Open)
                            {
                                throw new Exception("不能有兩次Open");
                            }
                            if (s.progress == Progress.Close)
                            {
                                currState = Progress.Close;
                                timeEnd = s.date;
                                ranges.Add(timeStart);
                                ranges.Add(timeEnd);
                            }
                        }
                        break;
                    case Progress.Close:
                        {
                            if (s.progress == Progress.Close)
                            {
                                throw new Exception("不能有兩次Close");
                            }
                            if (s.progress == Progress.Open)
                            {
                                currState = Progress.Open;
                                timeStart = s.date;
                            }
                        }
                        break;
                }
            }

            var boothEarns = storage.earns.Where(earn =>
            {
                if (earn.booth != booth)
                {
                    return false;
                }
                return true;
            }).OrderBy(earn =>
            {
                return earn.date;
            });

            var ret = new List<EarnsInRange>();
            for (var i = 0; i < ranges.Count; i += 2)
            {
                var openTime = new DateTime(ranges[i]);
                var closeTime = new DateTime(ranges[i + 1]);

                var earns = boothEarns.SkipWhile(earn =>
                {
                    var earnTime = new DateTime(earn.date);
                    var isBeforeOpen = DateTime.Compare(earnTime, openTime) < 0;
                    return isBeforeOpen;
                }).TakeWhile(earn =>
                {
                    var earnTime = new DateTime(earn.date);
                    var isBeforeClose = DateTime.Compare(earnTime, closeTime) < 0;
                    return isBeforeClose;
                });

                var er = new EarnsInRange(booth, openTime, closeTime);
                er.earns.AddRange(earns);
                ret.Add(er);
            }

            if(currState == Progress.Open)
            {
                var openTime = new DateTime(timeStart);
                var earns = boothEarns.SkipWhile(earn =>
                {
                    var earnTime = new DateTime(earn.date);
                    var isBeforeOpen = DateTime.Compare(earnTime, openTime) < 0;
                    return isBeforeOpen;
                });
                var er = new EarnsInRange(booth, openTime);
                er.earns.AddRange(earns);
                ret.Add(er);
            }

            return ret;
        }


        /*public static List<List<Earn>> GroupEarns(Storage storage, string booth)
        {
            var currState = Progress.Pending;
            var timeStart = 0L;
            var timeEnd = 0L;
            var ranges = new List<long>();

            foreach (var s in storage.states)
            {
                if (s.booth != booth)
                {
                    continue;
                }
                switch (currState)
                {
                    case Progress.Pending:
                        {
                            if (s.progress == Progress.Open)
                            {
                                currState = Progress.Open;
                                timeStart = s.date;
                            }
                        }
                        break;
                    case Progress.Open:
                        {
                            if (s.progress == Progress.Open)
                            {
                                throw new Exception("XXX");
                            }
                            if (s.progress == Progress.Close)
                            {
                                currState = Progress.Close;
                                timeEnd = s.date;
                                ranges.Add(timeStart);
                                ranges.Add(timeEnd);
                            }
                        }
                        break;
                    case Progress.Close:
                        {
                            if (s.progress == Progress.Close)
                            {
                                throw new Exception("XXX");
                            }
                            if (s.progress == Progress.Open)
                            {
                                currState = Progress.Open;
                                timeStart = s.date;
                            }
                        }
                        break;
                }
            }

            var ret = new List<List<Earn>>();
            for (var i = 0; i < ranges.Count; i += 2)
            {
                var openTime = new DateTime(ranges[i]);
                var closeTime = new DateTime(ranges[i + 1]);
                
                var earns = storage.earns.Where(earn =>
                {
                    if (earn.booth != booth)
                    {
                        return false;
                    }
                    return true;
                }).OrderBy(earn =>
                {
                    return earn.date;
                }).SkipWhile(earn =>
                {
                    var earnTime = new DateTime(earn.date);
                    var isAfterOpen = DateTime.Compare(earnTime, openTime) >= 0;
                    return isAfterOpen;
                }).TakeWhile(earn =>
                {
                    var earnTime = new DateTime(earn.date);
                    var isBeforeClose = DateTime.Compare(earnTime, closeTime) < 0;
                    return isBeforeClose;
                });

                ret.Add(earns.ToList());
            }

            return ret;
        }*/
    }
}
