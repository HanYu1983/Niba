using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace NightmarketAssistant
{
    public enum ObjectRefType
    {
        Static, Array, Ref
    }

    public class ObjectRef<T> : MonoBehaviour
    {
        public ObjectRefType refType;
        public T value;
        public List<T> array;
        public int idx;
        public MonoBehaviour objectRef;

        public bool IsValid
        {
            get
            {
                try
                {
                    var ignore = Ref;
                    return true;
                }
                catch (System.Exception)
                {
                    return false;
                }
            }
        }

        public T Ref
        {
            get
            {
                switch (refType)
                {
                    default:
                    case ObjectRefType.Static:
                        if(value == null)
                        {
                            throw new System.Exception("XXXX");
                        }
                        return value;
                    case ObjectRefType.Array:
                        if(idx <0 || idx >= array.Count)
                        {
                            throw new System.Exception("Array Count="+array.Count+", idx="+idx);
                        }
                        return array[idx];
                    case ObjectRefType.Ref:
                        {
                            var or = objectRef as ObjectRef<T>;
                            if(or == null)
                            {
                                throw new System.Exception("XXXX");
                            }
                            return or.Ref;
                        }
                }
            }
        }
    }
}