using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace NightmarketAssistant
{
    public class EarnListRef : ObjectRef<List<Earn>>
    {
        public void AddToStaticList(EarnRef earn)
        {
            if(refType != ObjectRefType.Static)
            {
                throw new System.Exception("only can add to static list");
            }
            Ref.Add(earn.Ref);
            OnValueChange();
        }
    }
}