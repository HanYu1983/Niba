using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class TestAndroidInterop : MonoBehaviour {

	// Use this for initialization
	void Start () {
        try
        {
            AndroidJNIHelper.debug = true;
            GetLocalDisplayLanguage();
            AddButton();
        }
        catch(Exception e)
        {
            msg = "Exception:"+e.Message;
        }
    }



    static string GetLocalDisplayLanguage()
    {
        using (AndroidJavaClass cls = new AndroidJavaClass("java.util.Locale"))
        {
            using (AndroidJavaObject locale = cls.CallStatic<AndroidJavaObject>("getDefault"))
            {
                return locale.Call<string>("getDisplayLanguage");
            }
        }
    }

    static void AddButton()
    {
        using (AndroidJavaClass unityPlayerClz = new AndroidJavaClass("com.unity3d.player.UnityPlayer"))
        {
            using (AndroidJavaObject currentActivity = unityPlayerClz.GetStatic<AndroidJavaObject>("currentActivity"))
            {
                currentActivity.Call("runOnUiThread", new AndroidJavaRunnable(runOnUiThread));
            }
        }
    }

    static void runOnUiThread()
    {
        //Button btn = new Button(this);
        //btn.setText("app btn");
        //addContentView(btn, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        AndroidJavaClass unityPlayerClz = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
        AndroidJavaObject currentActivity = unityPlayerClz.GetStatic<AndroidJavaObject>("currentActivity");
        AndroidJavaObject button = new AndroidJavaObject("android.widget.Button", currentActivity);
        button.Call("setText", "app btn");

        AndroidJavaClass viewGroupClz = new AndroidJavaClass("android.view.ViewGroup$LayoutParams");
        int w = viewGroupClz.GetStatic<int>("WRAP_CONTENT");
        AndroidJavaObject layout = new AndroidJavaObject("android.view.ViewGroup$LayoutParams", w, w);
        currentActivity.Call("addContentView", button, layout);
    }

    string msg = "debug";
    private void OnGUI()
    {
        GUILayout.BeginArea(new Rect(0, 0, 500, 500));
        msg = GUILayout.TextArea(msg);
        GUILayout.EndArea();
    }
}
