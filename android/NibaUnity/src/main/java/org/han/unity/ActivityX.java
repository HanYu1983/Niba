package org.han.unity;

import android.app.Activity;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.PixelFormat;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.Window;

import com.unity3d.player.UnityPlayer;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

/**
 * Created by hanyu on 2016/11/28.
 */

public class ActivityX extends Activity {
    protected UnityPlayer mUnityPlayer; // don't change the name of this variable; referenced from native code

    private static final ScheduledExecutorService worker =
            Executors.newSingleThreadScheduledExecutor();
    // Setup activity layout
    @Override protected void onCreate (Bundle savedInstanceState)
    {
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        super.onCreate(savedInstanceState);

        getWindow().setFormat(PixelFormat.RGBX_8888); // <--- This makes xperia play happy

        mUnityPlayer = new UnityPlayer(this);
        setContentView(mUnityPlayer);
        mUnityPlayer.requestFocus();

        /*
        UnityBinder.command("?cmd=FirebaseBinder.anonymouse.signIn");

        worker.schedule(new Runnable() {
            @Override
            public void run() {
                UnityBinder.command("?cmd=FirebaseBinder.save&data="+UnityBinder.encodeString("{\"name\":\"han\"}"));
            }
        }, 2, TimeUnit.SECONDS);

        worker.schedule(new Runnable() {
            @Override
            public void run() {
                UnityBinder.command("?cmd=FirebaseBinder.load");
            }
        }, 4, TimeUnit.SECONDS);
        */

        /*
        UnityBinder.command("?cmd=FirebaseBinder.init");
        worker.schedule(new Runnable() {
            @Override
            public void run() {
                UnityBinder.command("?cmd=FirebaseBinder.google.signIn");
            }
        }, 2, TimeUnit.SECONDS);

        worker.schedule(new Runnable() {
            @Override
            public void run() {
                UnityBinder.command("?cmd=FirebaseBinder.anonymouse.link.google");
            }
        }, 8, TimeUnit.SECONDS);
        */
/*
        UnityBinder.command("?cmd=FirebaseBinder.init");
        worker.schedule(new Runnable() {
            @Override
            public void run() {
                UnityBinder.command("?cmd=FirebaseBinder.google.signIn");
            }
        }, 2, TimeUnit.SECONDS);

        worker.schedule(new Runnable() {
            @Override
            public void run() {
                String temp = "%7B%22nam22e%22%3A%22hanxxXXX%22%7D";
                //String temp = UnityBinder.encodeString("{\"name2\":\"hahaWW\"}");
                UnityBinder.command("?cmd=FirebaseBinder.save&data="+temp);
            }
        }, 8, TimeUnit.SECONDS);

        worker.schedule(new Runnable() {
            @Override
            public void run() {
                UnityBinder.command("?cmd=FirebaseBinder.load");
            }
        }, 16, TimeUnit.SECONDS);
        */
    }

    // Quit Unity
    @Override protected void onDestroy ()
    {
        IABBinder.unbindService();
        mUnityPlayer.quit();
        super.onDestroy();
    }

    // Pause Unity
    @Override protected void onPause()
    {
        super.onPause();
        mUnityPlayer.pause();
    }

    // Resume Unity
    @Override protected void onResume()
    {
        super.onResume();
        mUnityPlayer.resume();
    }

    // This ensures the layout will be correct.
    @Override public void onConfigurationChanged(Configuration newConfig)
    {
        super.onConfigurationChanged(newConfig);
        mUnityPlayer.configurationChanged(newConfig);
    }

    // Notify Unity of the focus change.
    @Override public void onWindowFocusChanged(boolean hasFocus)
    {
        super.onWindowFocusChanged(hasFocus);
        mUnityPlayer.windowFocusChanged(hasFocus);
    }

    // For some reason the multiple keyevent type is not supported by the ndk.
    // Force event injection by overriding dispatchKeyEvent().
    @Override public boolean dispatchKeyEvent(KeyEvent event)
    {
        if (event.getAction() == KeyEvent.ACTION_MULTIPLE)
            return mUnityPlayer.injectEvent(event);
        return super.dispatchKeyEvent(event);
    }

    // Pass any events not handled by (unfocused) views straight to UnityPlayer
    @Override public boolean onKeyUp(int keyCode, KeyEvent event)     { return mUnityPlayer.injectEvent(event); }
    @Override public boolean onKeyDown(int keyCode, KeyEvent event)   { return mUnityPlayer.injectEvent(event); }
    @Override public boolean onTouchEvent(MotionEvent event)          { return mUnityPlayer.injectEvent(event); }
    /*API12*/ public boolean onGenericMotionEvent(MotionEvent event)  { return mUnityPlayer.injectEvent(event); }

    protected void onStart() {
        super.onStart();
    }

    @Override
    protected void onStop() {
        super.onStop();
    }


    public void onActivityResult(int requestCode, int resultCode, Intent data){
        super.onActivityResult(requestCode, resultCode, data);
        IABBinder.onActivityResult(requestCode, resultCode, data);
        FirebaseBinder.instance.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
}
