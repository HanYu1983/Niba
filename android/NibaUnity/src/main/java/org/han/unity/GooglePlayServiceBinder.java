package org.han.unity;

import android.app.Activity;
import android.content.Intent;
import android.content.IntentSender;
import android.net.UrlQuerySanitizer;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInResult;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.GoogleApiClient.ConnectionCallbacks;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.GoogleAuthProvider;
import com.unity3d.player.UnityPlayer;

import java.util.List;

/**
 * Created by hanyu on 2017/10/8.
 */

public class GooglePlayServiceBinder implements ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener{
    static GooglePlayServiceBinder instance = new GooglePlayServiceBinder();
    static int googlePlayServiceBinderRequestCode = 120341234;
    static int PLAY_SERVICES_RESOLUTION_REQUEST = 90001;
    static int RESOLVE_CONNECTION_REQUEST_CODE = 90002;

    GoogleApiClient mGoogleApiClient;
    FirebaseAuth mFirebaseAuth = FirebaseAuth.getInstance();

    public void init(Activity act){
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestIdToken("241640252242-e9962fc449bb9sh847eoqlt5oshef34g.apps.googleusercontent.com")
                .build();

        mGoogleApiClient = new GoogleApiClient.Builder(act)
                .addApi(Auth.GOOGLE_SIGN_IN_API, gso)
                .addOnConnectionFailedListener(this)
                .addConnectionCallbacks(this).build();
    }

    public void connect() {
        mGoogleApiClient.connect();
    }

    public static void onActivityResult(int requestCode, int resultCode, Intent data) {
        if(requestCode == RESOLVE_CONNECTION_REQUEST_CODE){
            instance.connect();
        }

        if (requestCode == googlePlayServiceBinderRequestCode) {
            GoogleSignInResult result = Auth.GoogleSignInApi.getSignInResultFromIntent(data);
            if (result.isSuccess()) {
                GoogleSignInAccount acct = result.getSignInAccount();

                String token = acct.getIdToken();
                UnityBinder.sendToUnity("?cmd=GooglePlayServce.Auth.SignIn.ok&token="+UnityBinder.encodeString(token));

                AuthCredential credential = GoogleAuthProvider.getCredential(token, null);

                instance.mFirebaseAuth.signInWithCredential(credential)
                        .addOnCompleteListener(UnityPlayer.currentActivity, new OnCompleteListener<AuthResult>() {
                            @Override
                            public void onComplete(@NonNull Task<AuthResult> task) {
                                if (!task.isSuccessful()) {
                                    UnityBinder.sendToUnity("?cmd=xxx_signInWithCredential_ok");
                                } else {
                                    UnityBinder.sendToUnity("?cmd=xxx_signInWithCredential_error:"+UnityBinder.encodeString(task.getException().getLocalizedMessage()));
                                }
                            }
                        });

                //DriveFolder folder = Drive.DriveApi.getAppFolder(instance.mGoogleApiClient);


                /*
                AsyncHttpClient client = new AsyncHttpClient();

                Header authHeader = new BasicHeader("Authorization", "Bearer "+token);
                Header typeHeader = new BasicHeader("Content-Type", "application/json");

                RequestParams params = new RequestParams();
                params.add("key", "AIzaSyCvL-DSzufd_gdF2qlOINpz6lkuBOkHgu8");

                client.get(
                        UnityPlayer.currentActivity,
                        "https://www.googleapis.com/drive/v3/files",
                        new Header[]{authHeader, typeHeader},
                        params,
                        new AsyncHttpResponseHandler() {

                    @Override
                    public void onStart() {
                        // called before request is started
                        UnityBinder.sendToUnity("?cmd=xxx_onStart");
                    }

                    @Override
                    public void onSuccess(int statusCode, Header[] headers, byte[] response) {
                        // called when response HTTP status is "200 OK"
                        String res = new String(response);
                        UnityBinder.sendToUnity("?cmd=xxx_onSuccess&res="+UnityBinder.encodeString(res));
                    }

                    @Override
                    public void onFailure(int statusCode, Header[] headers, byte[] errorResponse, Throwable e) {
                        String res = new String(errorResponse);
                        UnityBinder.sendToUnity("?cmd=xxx_onFailure&res="+UnityBinder.encodeString(res));
                    }

                    @Override
                    public void onRetry(int retryNo) {
                        // called when request is retried
                        UnityBinder.sendToUnity("?cmd=xxx_onRetry");
                    }
                });
                */
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


    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
        if (connectionResult.hasResolution()) {
            try {
                connectionResult.startResolutionForResult(UnityPlayer.currentActivity, RESOLVE_CONNECTION_REQUEST_CODE);
            } catch (IntentSender.SendIntentException e) {
                UnityBinder.sendToUnity("?cmd=GooglePlayServce.connect.error&reason=" + e.getLocalizedMessage());
            }
        } else {
            GoogleApiAvailability apiAvailability = GoogleApiAvailability.getInstance();
            apiAvailability.getErrorDialog(UnityPlayer.currentActivity, connectionResult.getErrorCode(), PLAY_SERVICES_RESOLUTION_REQUEST).show();
        }
    }

    public static void HandleCommand(String cmd, List<UrlQuerySanitizer.ParameterValuePair> pairs) {
        switch (cmd) {
            case "GooglePlayServce.connect":
                instance.init(UnityPlayer.currentActivity);
                UnityPlayer.currentActivity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        instance.connect();
                    }
                });
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
