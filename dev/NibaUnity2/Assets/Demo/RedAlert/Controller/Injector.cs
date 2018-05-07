using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RedAlert
{
    public interface IInjectClientModel
    {
        RedAlertModel ClientModel { set; }
    }

    public interface IInjectRedAlertController
    {
        IRedAlertController RedAlertController { set; }
    }

    public class Injector : MonoBehaviour
    {
        public RedAlertModel clientModel;
        public SingleController redAlertController;

        static Injector instance;

        private void Awake()
        {
            instance = this;
        }

        public static void Inject(object obj)
        {
            if(obj is IInjectClientModel)
            {
                if (instance.clientModel == null)
                {
                    throw new System.Exception("no clientModel");
                }
                (obj as IInjectClientModel).ClientModel = instance.clientModel;
            }
            if (obj is IInjectRedAlertController)
            {
                if(instance.redAlertController == null)
                {
                    throw new System.Exception("no redAlertController");
                }
                (obj as IInjectRedAlertController).RedAlertController = instance.redAlertController;
            }
        }
    }
}