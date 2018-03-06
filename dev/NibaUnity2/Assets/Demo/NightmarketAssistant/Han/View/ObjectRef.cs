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

        public T Ref
        {
            get
            {
                switch (refType)
                {
                    default:
                    case ObjectRefType.Static:
                        return value;
                    case ObjectRefType.Array:
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