using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace WordCard
{
    public interface IInjectWordCard2ClientModel
    {
        WordCard2Model ClientModel { get; set; }
    }

    public interface IInjectWordCard2ServerModel
    {
        WordCard2Model ServerModel { get; set; }
    }

    public interface IInjectWordCard2Controller
    {
        IWordCard2Controller Controller { get; set; }
    }

    public interface IInjectWordCard2View
    {
        WordCard2View View { get; set; }
    }

    public class WordCard2Injector : MonoBehaviour
    {
        public static Action<float> OnUpdate = delegate { };
        public static Action<HanCardAPI.Core.Mission> OnSelectMission = delegate { };
        public static Action<HanCardAPI.Core.Card> OnSelectCard = delegate { };
        public static Action<HanCardAPI.Core.Card> OnSelectCard2 = delegate { };
        public static Action<string> OnSelectWord = delegate { };
        public WordCard2Model clientModel;
        public WordCard2Model serverModel;
        public WordCard2Controller controller;
        public WordCard2View view;

        public static WordCard2Injector instance;

        private void Awake()
        {
            instance = this;
        }

        private void Update()
        {
            OnUpdate(Time.deltaTime);
        }

        public static void Inject(object obj)
        {
            if(obj is IInjectWordCard2ClientModel)
            {
                (obj as IInjectWordCard2ClientModel).ClientModel = instance.clientModel;
            }
            if (obj is IInjectWordCard2ServerModel)
            {
                (obj as IInjectWordCard2ServerModel).ServerModel = instance.serverModel;
            }
            if (obj is IInjectWordCard2Controller)
            {
                (obj as IInjectWordCard2Controller).Controller = instance.controller;
            }
            if (obj is IInjectWordCard2View)
            {
                (obj as IInjectWordCard2View).View = instance.view;
            }
        }
    }
}