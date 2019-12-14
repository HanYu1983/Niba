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

public struct Memonto
{
    public int seqId;
    public List<Earn> earns;
    public List<string> memo;
}