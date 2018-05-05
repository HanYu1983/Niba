using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RedAlert
{
    public interface IInjectClientModel
    {
        RedAlertModel ClientModel { set; }
    }

    public class Injector : MonoBehaviour
    {
        public RedAlertModel clientModel;

        static Injector instance;

        private void Awake()
        {
            instance = this;
        }

        public static void Inject(IInjectClientModel obj)
        {
            obj.ClientModel = instance.clientModel;
        }
    }
}