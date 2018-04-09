using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using GameFramework.GameStructure;
using GameFramework.UI.Dialogs.Components;
using UnityEngine.Assertions;
using System;

namespace RobotWar
{
    public class ModelController : MonoBehaviour
    {
        public void SelectUnit(KeyRef unitKeyRef)
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            model.SelectUnit(unitKeyRef);
            GameManager.LoadSceneWithTransitions("Unit");
        }

        public void SelectUnitPilot(KeyRef unitKeyRef)
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            model.SelectUnit(unitKeyRef);
            GameManager.LoadSceneWithTransitions("Pilot");
        }

        public void SelectUnitWeapon(KeyRef unitKeyRef)
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            model.SelectUnit(unitKeyRef);
            GameManager.LoadSceneWithTransitions("Weapon");
        }

        public void SelectUnitItem(KeyRef unitKeyRef)
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            model.SelectUnit(unitKeyRef);
            GameManager.LoadSceneWithTransitions("Item");
        }

        public void UpgradeWeapon(KeyRef weaponKeyRef)
        {
            Alarm(DialogInstance.DialogButtonsType.OkCancel, "是否升級?", "afafa",dialog =>
            {
                if (dialog.DialogResult == DialogInstance.DialogResultType.Ok)
                {
                    var model = GameManager.Instance.gameObject.GetComponent<Model>();
                    try
                    {
                        DataAlg.UpgradeWeapon(model.ctx, weaponKeyRef.Ref);
                        weaponKeyRef.NotifyValueChange();
                    }
                    catch (Exception e)
                    {
                        OnException(e);
                    }
                }
            });
        }

        public void BuyWeapon(KeyRef weaponRef)
        {
            Alarm(DialogInstance.DialogButtonsType.OkCancel, "是否購買?", "afafa", dialog =>
            {
                if (dialog.DialogResult == DialogInstance.DialogResultType.Ok)
                {
                    try
                    {
                        var model = GameManager.Instance.gameObject.GetComponent<Model>();
                        DataAlg.BuyWeapon(model.ctx, weaponRef.Ref);
                        weaponRef.NotifyValueChange();
                    }
                    catch (Exception e)
                    {
                        OnException(e);
                    }
                }
            });
        }

        public void BuyItem(KeyRef itemRef)
        {
            Alarm(DialogInstance.DialogButtonsType.OkCancel, "是否購買?", "afafa", dialog =>
            {
                if (dialog.DialogResult == DialogInstance.DialogResultType.Ok)
                {
                    try
                    {
                        var model = GameManager.Instance.gameObject.GetComponent<Model>();
                        DataAlg.BuyItem(model.ctx, itemRef.Ref);
                        itemRef.NotifyValueChange();
                    }
                    catch (Exception e)
                    {
                        OnException(e);
                    }
                }
            });
        }

        public static void OnException(Exception e)
        {
            Alarm(DialogInstance.DialogButtonsType.Ok, "System", e.Message, null);
        }

        public static void Alarm(DialogInstance.DialogButtonsType type, string title, string text, Action<DialogInstance> cb)
        {
            Assert.IsTrue(DialogManager.IsActive, "Ensure that you have added a DialogManager component to your scene before showing a dialog!");
            var dialogInstance = DialogManager.Instance.Create(null, null, null, null);
            dialogInstance.Show(title: title,
                text: text,
                text2: "",
                sprite: null,
                doneCallback: cb,
                dialogButtons: type);
        }
    }
}