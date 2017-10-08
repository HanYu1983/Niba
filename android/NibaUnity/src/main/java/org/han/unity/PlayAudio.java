package org.han.unity;

import android.app.Service;
import android.content.Intent;
import android.media.MediaPlayer;
import android.os.IBinder;
import android.util.Log;

import java.io.IOException;

/**
 * Created by hanyu on 2017/5/31.
 */

public class PlayAudio extends Service {
    private static final String LOGCAT = null;
    MediaPlayer objPlayer = new MediaPlayer();

    public int onStartCommand(Intent intent, int flags, int startId){
        String url = intent.getStringExtra("url");
        try {
            objPlayer.setDataSource(url);
            objPlayer.prepare();
            objPlayer.start();
            if (objPlayer.isLooping() != true) {
                Log.d(LOGCAT, "Problem in Playing Audio");
            }
        }catch (IOException e) {
            Log.d(LOGCAT, "Exception:" + e.getLocalizedMessage());
        }
        return Service.START_STICKY;
    }

    public void onStop(){
        objPlayer.stop();
        objPlayer.release();
    }

    public void onPause(){
        objPlayer.stop();
        objPlayer.release();
    }
    public void onDestroy(){
        objPlayer.stop();
        objPlayer.release();
    }
    @Override
    public IBinder onBind(Intent objIndent) {
        return null;
    }
}
