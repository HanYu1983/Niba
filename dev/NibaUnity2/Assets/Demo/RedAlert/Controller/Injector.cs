using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using GameFramework.GameStructure;
using System;

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

    public interface IInjectServerModel
    {
        RedAlertModel ServerModel { set; }
    }

    public class Injector : MonoBehaviour
    {
        public RedAlertModel clientModel;
        public RedAlertController redAlertController;

        static Injector instance;

        private void Awake()
        {
            instance = this;
        }

        public static Action<List<GameObject>, Vector3> OnDirectMoveTo = delegate { };
        public static Action<GameObject, Collision> OnCollide = delegate { };

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
            if(obj is IInjectServerModel)
            {
                if (GameManager.Instance.gameObject.GetComponent<RedAlertModel>() == null)
                {
                    throw new System.Exception("no servermodel");
                }
                (obj as IInjectServerModel).ServerModel = GameManager.Instance.gameObject.GetComponent<RedAlertModel>();
            }
        }
    }
}