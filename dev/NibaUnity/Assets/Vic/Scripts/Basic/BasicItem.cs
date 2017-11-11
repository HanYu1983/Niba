using UnityEngine;
using System.Collections;
using UnityEngine.UI;

namespace GameView
{
    public class BasicItem : MonoBehaviour
    {
        public Text txt_describe;
        public Text txt_doName;
        public Button btn_doWork;

        public string Describe
        {
            set
            {
                txt_describe.text = value;
            }
            get
            {
                return txt_describe.text;
            }
        }

        public string DoName
        {
            set
            {
                txt_doName.text = value;
            }
            get
            {
                return txt_doName.text;
            }
        }

        internal virtual void OnItemClick()
        {

        }
        
        void Start()
        {
            btn_doWork.onClick.AddListener(() =>
            {
                OnItemClick();
            });
        }

        private void OnDestroy()
        {
            btn_doWork.onClick.RemoveAllListeners();
        }
    }
}
