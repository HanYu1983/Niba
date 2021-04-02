using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

[Serializable]
public struct Earn
{
    public int id;
    public int money;
    public long createUTC;
    public string memo;
    public static Earn empty;
}

public class Memonto
{
    public int seqId;
    public List<Earn> earns;
    public List<string> memo;
}

public enum SaveWorkerState
{
    // 初使化, 只出現在一開始
    Pending,
    // 啟動
    Starting,
    // 判斷是否有還沒同步的內容
    Checking,
    // 同步中
    Saving,
    // 同步完成, 這個狀態馬上就會切換成Checking. 只是象徵性的存在程式中.
    Saved
}