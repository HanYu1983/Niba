package org.han.unity;

import android.net.UrlQuerySanitizer;

import com.unity3d.player.UnityPlayer;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by hanyu on 2017/3/12.
 */

public class UnityBinder {
    public static void command(String queryString){
        UrlQuerySanitizer sanitizer = new UrlQuerySanitizer(queryString);
        List<UrlQuerySanitizer.ParameterValuePair> pairs = sanitizer.getParameterList();
        String cmd = GetValue(pairs, "cmd");

        IABBinder.HandleCommand(cmd, pairs);
        //GABinder.HandleCommand(cmd, pairs);
        //GoogleAdsBinder.HandleCommand(cmd, pairs);
        //YoMobBinder.HandleCommand(cmd, pairs);
        //GooglePlayServiceBinder.HandleCommand(cmd, pairs);
        //BackgroundAudioBinder.HandleCommand(cmd, pairs);
        FirebaseBinder.HandleCommand(cmd, pairs);
    }

    public static String encodeString(String msg){
        try {
            URLEncoder.encode(msg, "utf-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return msg;
    }

    public static void sendToUnityDirectly(String queryString){
        UnityPlayer.UnitySendMessage("Main", "onNativeCommand", queryString);
    }

    public static void sendToUnity(final String queryString){
        UnityPlayer.currentActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                sendToUnityDirectly(queryString);
                //UnityPlayer.UnitySendMessage("Main", "onNativeCommand", queryString);
            }
        });
    }

    static List<String> GetValues(List<UrlQuerySanitizer.ParameterValuePair> pairs, String key){
        List<String> ret = new ArrayList<String>();
        for (UrlQuerySanitizer.ParameterValuePair pair : pairs) {
            if(pair.mParameter.equalsIgnoreCase(key)){
                ret.add(pair.mValue);
            }
        }
        return ret;
    }

    static String GetValue(List<UrlQuerySanitizer.ParameterValuePair> pairs, String key){
        List<String> values = GetValues(pairs, key);
        if(values.isEmpty()){
            return null;
        }
        return values.get(0);
    }
}
