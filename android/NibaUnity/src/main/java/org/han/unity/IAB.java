package org.han.unity;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentSender;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.os.RemoteException;
import android.text.TextUtils;
import android.util.Log;

import com.android.vending.billing.IInAppBillingService;
import com.unity3d.player.UnityPlayer;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by hanyu on 2017/3/12.
 */

public class IAB {
    private static int apiVersion = 3;
    private IInAppBillingService mService;
    private IDelegate delegate;

    public void SetDelegate(IDelegate delegate){
        this.delegate = delegate;
    }

    public void bindService(Activity activity){
        Log.d("IAB", "activity:"+activity);

        Intent serviceIntent = new Intent("com.android.vending.billing.InAppBillingService.BIND");
        serviceIntent.setPackage("com.android.vending");
        activity.bindService(serviceIntent, mServiceConn, Context.BIND_AUTO_CREATE);
    }

    public void unbindService(Activity activity){
        activity.unbindService(mServiceConn);
    }

    public boolean isBillingSupported(Activity activity, String billingType) throws RemoteException {
        int response = mService.isBillingSupported(apiVersion, activity.getPackageName(), billingType);
        return response == 0;
    }

    public void getBuyIntent(Activity activity, String sku, String type, String developerPayload, int requestCode) throws IntentSender.SendIntentException, RemoteException {
        Bundle buyIntentBundle = mService.getBuyIntent(apiVersion, UnityPlayer.currentActivity.getPackageName(), sku, type, developerPayload);
        PendingIntent pendingIntent = buyIntentBundle.getParcelable("BUY_INTENT");
        if(pendingIntent == null){
            throw new IntentSender.SendIntentException("pendingIntent is null");
        }
        // 回傳結果到onActivityResult
        activity.startIntentSenderForResult(
                pendingIntent.getIntentSender(),
                requestCode,
                new Intent(),
                Integer.valueOf(0),
                Integer.valueOf(0),
                Integer.valueOf(0)
        );
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        int responseCode = data.getIntExtra("RESPONSE_CODE", -99999);
        String purchaseData = data.getStringExtra("INAPP_PURCHASE_DATA");
        String dataSignature = data.getStringExtra("INAPP_DATA_SIGNATURE");
        String result = String.format(
                "{\"RESPONSE_CODE\":%d, \"INAPP_PURCHASE_DATA\":%s, \"INAPP_DATA_SIGNATURE\":\"%s\"}",
                responseCode,
                purchaseData,
                dataSignature
        );
        if( delegate != null ){
            delegate.onActivityResult(requestCode, resultCode, result);
        }
    }

    // type = "inapp" | ""
    public List<String> getSkuDetails(Activity activity, String type, ArrayList<String> skus) throws RemoteException, ResponseCodeNotZeroException {
        Bundle querySkus = new Bundle();
        querySkus.putStringArrayList("ITEM_ID_LIST", skus);

        Bundle skuDetails = mService.getSkuDetails(apiVersion, activity.getPackageName(), type, querySkus);
        int response = skuDetails.getInt("RESPONSE_CODE");
        if(response != 0){
            throw new ResponseCodeNotZeroException(response);
        }
        return skuDetails.getStringArrayList("DETAILS_LIST");
    }

    public String getPurchases(Activity activity, String type, String continuationToken) throws RemoteException, ResponseCodeNotZeroException {
        Bundle ownedItems = mService.getPurchases(apiVersion, activity.getPackageName(), type, continuationToken);
        int response = ownedItems.getInt("RESPONSE_CODE");
        if(response != 0){
            throw new ResponseCodeNotZeroException(response);
        }
        ArrayList<String> ownedSkus = ownedItems.getStringArrayList("INAPP_PURCHASE_ITEM_LIST");
        ArrayList<String> purchaseDataList = ownedItems.getStringArrayList("INAPP_PURCHASE_DATA_LIST");
        ArrayList<String> signatureList = ownedItems.getStringArrayList("INAPP_DATA_SIGNATURE_LIST");
        String nextContinuationToken = ownedItems.getString("INAPP_CONTINUATION_TOKEN");

        return String.format(
                "{\"INAPP_PURCHASE_ITEM_LIST\":%s, \"INAPP_PURCHASE_DATA_LIST\":[%s], \"INAPP_DATA_SIGNATURE_LIST\":%s, \"INAPP_CONTINUATION_TOKEN\":%s}",
                ownedSkus.size() > 0 ? "[\"" + TextUtils.join("\",\"", ownedSkus) + "\"]" : "[]",
                TextUtils.join(",", purchaseDataList),
                signatureList.size() > 0 ? "[\"" + TextUtils.join("\",\"", signatureList) + "\"]" : "[]",
                nextContinuationToken == null ? "null" : "\""+nextContinuationToken+"\""
        );
    }

    public void consumePurchase(Activity activity, String purchaseToken) throws RemoteException, ResponseCodeNotZeroException {
        int response = mService.consumePurchase(apiVersion, activity.getPackageName(), purchaseToken);
        if(response != 0){
            throw new ResponseCodeNotZeroException(response);
        }
    }

    private ServiceConnection mServiceConn = new ServiceConnection() {
        @Override
        public void onServiceDisconnected(ComponentName name) {
            mService = null;
            if(delegate != null){
                delegate.onServiceDisconnected(name);
            }
        }

        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            mService = IInAppBillingService.Stub.asInterface(service);
            if(delegate != null){
                delegate.onServiceConnected(name, service);
            }
        }
    };

    public interface IDelegate extends ServiceConnection{
        void onActivityResult(int requestCode, int resultCode, String data);
    }

    public static class ResponseCodeNotZeroException extends Exception{
        private int code;
        public ResponseCodeNotZeroException(int code){
            this.code = code;
        }
        public int getCode(){
            return code;
        }
    }
}
