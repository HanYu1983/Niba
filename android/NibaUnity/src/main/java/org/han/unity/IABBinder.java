package org.han.unity;

import android.content.ComponentName;
import android.content.Intent;
import android.content.IntentSender;
import android.net.UrlQuerySanitizer;
import android.os.IBinder;
import android.os.RemoteException;

import com.unity3d.player.UnityPlayer;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by hanyu on 2016/11/28.
 */

public class IABBinder implements IAB.IDelegate {
    private IAB iab = new IAB();

    public static IABBinder instance = new IABBinder();

    public IABBinder(){
        iab.SetDelegate(this);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, String data) {
        try {
            String cmd = String.format(
                    "?cmd=IAB.onActivityResult&requestCode=%d&resultCode=%d&data=%s",
                    requestCode,
                    resultCode,
                    URLEncoder.encode(data, "utf-8")
            );
            UnityBinder.sendToUnity(cmd);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
        UnityBinder.sendToUnity("?cmd=IAB.onServiceConnected");
    }

    @Override
    public void onServiceDisconnected(ComponentName componentName) {
        UnityBinder.sendToUnity("?cmd=IAB.onServiceDisconnected");
    }

    public static void onActivityResult(int requestCode, int resultCode, Intent data) {
        instance.iab.onActivityResult(requestCode, resultCode, data);
    }

    public static void unbindService() {
        instance.iab.unbindService(UnityPlayer.currentActivity);
    }

    public static void OnException(Exception e){
        try {
            String encoded = URLEncoder.encode(e.getLocalizedMessage(), "utf-8");
            UnityBinder.sendToUnity("?cmd=IAB.onException&reason=" + encoded);
        }catch (UnsupportedEncodingException ee){
            ee.printStackTrace();
        }
    }

    public static void HandleCommand(String cmd, List<UrlQuerySanitizer.ParameterValuePair> pairs){
        switch (cmd){
            case "IAB.bindService":
                instance.iab.bindService(UnityPlayer.currentActivity);
                break;
            case "IAB.unbindService":
                instance.iab.unbindService(UnityPlayer.currentActivity);
                break;
            case "IAB.isBillingSupported": {
                String type = UnityBinder.GetValue(pairs, "type");
                try {
                    boolean isSupported = instance.iab.isBillingSupported(UnityPlayer.currentActivity, type);
                    UnityBinder.sendToUnity("?cmd=IAB.isBillingSupported&result="+isSupported);
                } catch (RemoteException e) {
                    OnException(e);
                }
            }
            break;
            case "IAB.getBuyIntent": {
                String sku = UnityBinder.GetValue(pairs, "sku");
                String type = UnityBinder.GetValue(pairs, "type");
                String developerPayload = UnityBinder.GetValue(pairs, "developerPayload");
                int requestCode = Integer.parseInt(UnityBinder.GetValue(pairs, "requestCode"));
                try {
                    instance.iab.getBuyIntent(UnityPlayer.currentActivity, sku, type, developerPayload, requestCode);
                } catch (IntentSender.SendIntentException e) {
                    OnException(e);
                } catch (RemoteException e) {
                    OnException(e);
                }
            }
            break;
            case "IAB.getSkuDetails":{
                String type = UnityBinder.GetValue(pairs, "type");
                List<String> skus = UnityBinder.GetValues(pairs, "sku");
                try {
                    List<String> details = instance.iab.getSkuDetails(UnityPlayer.currentActivity, type, new ArrayList<>(skus));
                    String detailPart = "";
                    for(String detail:details){
                        UnityBinder.sendToUnity("detail:"+detail);
                        try{
                            String encode = URLEncoder.encode(detail, "utf-8");
                            detailPart += "&result="+encode;
                        }catch (UnsupportedEncodingException e){
                            e.printStackTrace();
                        }
                    }
                    UnityBinder.sendToUnity("?cmd=IAB.getSkuDetailsResult"+detailPart);
                } catch (RemoteException e) {
                    OnException(e);
                } catch (IAB.ResponseCodeNotZeroException e) {
                    OnException(e);
                }
            }
            break;
            case "IAB.getPurchases":{
                String type = UnityBinder.GetValue(pairs, "type");
                String continuationToken = UnityBinder.GetValue(pairs, "continuationToken");
                try {
                    String result = instance.iab.getPurchases(UnityPlayer.currentActivity, type, continuationToken);
                    String encode = result;
                    UnityBinder.sendToUnity("?xxx="+result);
                    try{
                        encode = URLEncoder.encode(result, "utf-8");
                    }catch (UnsupportedEncodingException e){
                        e.printStackTrace();
                    }
                    UnityBinder.sendToUnity("?cmd=IAB.getPurchasesResult&result="+encode);
                } catch (RemoteException e) {
                    OnException(e);
                } catch (IAB.ResponseCodeNotZeroException e) {
                    OnException(e);
                }
            }
            break;
            case "IAB.consumePurchase":{
                String sku = UnityBinder.GetValue(pairs, "sku");
                String purchaseToken = UnityBinder.GetValue(pairs, "purchaseToken");
                try {
                    instance.iab.consumePurchase(UnityPlayer.currentActivity, purchaseToken);
                    UnityBinder.sendToUnity("?cmd=IAB.consumePurchaseResult&sku="+sku);
                } catch (RemoteException e) {
                    OnException(e);
                } catch (IAB.ResponseCodeNotZeroException e) {
                    OnException(e);
                }
            }
            break;
        }
    }
}
