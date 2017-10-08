package org.han.unity;

import android.app.Activity;
import android.content.Intent;
import android.net.UrlQuerySanitizer;
import android.os.Bundle;
import android.support.annotation.Nullable;

import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInResult;
import com.google.android.gms.common.Scopes;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.GoogleApiClient.ConnectionCallbacks;
import com.google.android.gms.common.api.Scope;
import com.unity3d.player.UnityPlayer;

import java.util.List;

/**
 * Created by hanyu on 2017/10/8.
 */

public class GooglePlayServiceBinder implements ConnectionCallbacks{
    static GooglePlayServiceBinder instance = new GooglePlayServiceBinder();
    static int googlePlayServiceBinderRequestCode = 120341234;

    GoogleApiClient mGoogleApiClient;

    public void connect(Activity act) {
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestScopes(new Scope(Scopes.DRIVE_APPFOLDER))
                .build();

        mGoogleApiClient = new GoogleApiClient.Builder(act)
                .addApi(Auth.GOOGLE_SIGN_IN_API, gso)
                .addConnectionCallbacks(this).build();

        mGoogleApiClient.connect();
    }

    public static void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == googlePlayServiceBinderRequestCode) {
            GoogleSignInResult result = Auth.GoogleSignInApi.getSignInResultFromIntent(data);
            if (result.isSuccess()) {
                GoogleSignInAccount acct = result.getSignInAccount();
                String token = acct.getIdToken();
                UnityBinder.sendToUnity("?cmd=GooglePlayServce.Auth.SignIn.ok&token="+UnityBinder.encodeString(token));
            } else {
                UnityBinder.sendToUnity("?cmd=GooglePlayServce.Auth.SignIn.error&reason="+UnityBinder.encodeString("must build with release mode"));
            }
        }
    }

    @Override
    public void onConnected(@Nullable Bundle bundle) {
        UnityBinder.sendToUnity("?cmd=GooglePlayServce.connect.ok");
    }

    @Override
    public void onConnectionSuspended(int i) {
        UnityBinder.sendToUnity("?cmd=GooglePlayServce.connect.error&reason=" + i);
    }

    public static void HandleCommand(String cmd, List<UrlQuerySanitizer.ParameterValuePair> pairs) {
        switch (cmd) {
            case "GooglePlayServce.connect":
                instance.connect(UnityPlayer.currentActivity);
                break;
            case "GooglePlayServce.Auth.SignIn":
                UnityPlayer.currentActivity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Intent signInIntent = Auth.GoogleSignInApi.getSignInIntent(instance.mGoogleApiClient);
                        UnityPlayer.currentActivity.startActivityForResult(signInIntent, googlePlayServiceBinderRequestCode);
                    }
                });
                break;
        }
    }
}
