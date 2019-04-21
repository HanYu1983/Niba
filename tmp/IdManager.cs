using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public interface IdManagerGetter
{
    IdManager IdManager { get; set; }
}

public class IdManager : MonoBehaviour {
    private DefaultEventSender _sender;

    void Start()
    {
        _sender = new DefaultEventSender(
        (DefaultEventSender e, object o) => {
            if (o is IdManagerGetter)
            {
                (o as IdManagerGetter).IdManager = this;
            }
            if (o is Id)
            {
                Add(o as Id);
            }
        },
        (DefaultEventSender e, object o) => {
            if (o is Id)
            {
                Remove(o as Id);
            }
        });
        EventManager.Singleton.Add(_sender);
    }
    void OnDestroy()
    {
        EventManager.Singleton.Remove(_sender);
    }
    
    public Dictionary<int, Id> ids = new Dictionary<int, Id>();
    public int idseq = 0;
    public void Add(Id id)
    {
        id.id = idseq++;
        this.ids.Add(id.id, id);
    }

    public void Remove(Id id)
    {
        this.ids.Remove(id.id);
    }

    public List<Id> FindName(string name)
    {
        var ret = new List<Id>();
        foreach(var key in ids.Keys)
        {
            var obj = ids[key];
            if(obj.tagName == name)
            {
                ret.Add(obj);
            }
        }
        return ret;
    }
}
