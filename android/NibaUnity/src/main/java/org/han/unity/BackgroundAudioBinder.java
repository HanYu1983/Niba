package org.han.unity;

import android.content.Intent;
import android.net.UrlQuerySanitizer;

import com.unity3d.player.UnityPlayer;

import java.util.List;

/**
 * Created by hanyu on 2017/5/31.
 */

public class BackgroundAudioBinder {
    public static void HandleCommand(String cmd, List<UrlQuerySanitizer.ParameterValuePair> pairs) {
        switch (cmd) {
            case "BackgroundAudio.setup":{
                // can test here
            }
            break;
            case "BackgroundAudio.play":{
                String url = UnityBinder.GetValue(pairs, "url");
                Intent objIntent = new Intent(UnityPlayer.currentActivity, PlayAudio.class);
                // close old service
                UnityPlayer.currentActivity.stopService(objIntent);

                objIntent.putExtra("url", url);
                // play
                UnityPlayer.currentActivity.startService(objIntent);
            }
            break;
            case "BackgroundAudio.pause":{
                Intent objIntent = new Intent(UnityPlayer.currentActivity, PlayAudio.class);
                UnityPlayer.currentActivity.stopService(objIntent);
            }
            break;
        }
    }
}
