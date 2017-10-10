package org.han.unity;

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
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.GoogleAuthProvider;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageMetadata;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;
import com.unity3d.player.UnityPlayer;

import java.util.List;

import static org.han.unity.GooglePlayServiceBinder.PLAY_SERVICES_RESOLUTION_REQUEST;
import static org.han.unity.GooglePlayServiceBinder.googlePlayServiceBinderRequestCode;

/**
 * Created by hanyu on 2017/10/10.
 */

public class FirebaseBinder{
    private static final String WEB_CLIENT_ID = "241640252242-e9962fc449bb9sh847eoqlt5oshef34g.apps.googleusercontent.com";
    private static final String STORAGE_NAME = "gs://fast-drake-630.appspot.com";

    private static final int RESOLVE_CONNECTION_REQUEST_CODE = 90002;
    public static FirebaseBinder instance = new FirebaseBinder();

    private GoogleSignIn googleSignIn = new GoogleSignIn();
    private AnonymousSignIn anonymousSignIn = new AnonymousSignIn();

    private Exception didntLoginException = new Exception("firebase did't login");

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        googleSignIn.onActivityResult(requestCode, resultCode, data);
    }

    private void init(){
        googleSignIn.init();
        googleSignIn.connect();
        FirebaseAuth.getInstance().addAuthStateListener(new FirebaseAuth.AuthStateListener() {
            @Override
            public void onAuthStateChanged(@NonNull FirebaseAuth firebaseAuth) {
                // Right after the listener has been registered
                // When a user signs in
                // When the current user signs out
                // When the current user changes
                if(firebaseAuth.getCurrentUser() == null){
                    UnityBinder.sendToUnity("?cmd=FirebaseBinder.authStateChange.logout");
                } else {
                    UnityBinder.sendToUnity("?cmd=FirebaseBinder.authStateChange.login");
                }
            }
        });
    }

    private void signOut(){
        FirebaseAuth.getInstance().signOut();
    }

    private void linkCredentail(AuthCredential credential) throws Exception{
        if(FirebaseAuth.getInstance().getCurrentUser() == null){
            throw didntLoginException;
        }
        FirebaseAuth.getInstance().getCurrentUser().linkWithCredential(credential)
                .addOnCompleteListener(UnityPlayer.currentActivity, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()) {
                            UnityBinder.sendToUnity("?cmd=FirebaseBinder.anonymouse.link.google.ok");
                        } else {
                            UnityBinder.sendToUnity("?cmd=FirebaseBinder.anonymouse.link.google.error&reason="+UnityBinder.encodeString(task.getException().getMessage()));
                        }
                    }
                });
    }

    void save(String content) throws Exception{
        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        if(user == null){
            throw didntLoginException;
        }
        String uid = user.getUid();
        String fileName = uid+".json";
        StorageReference storageRef = FirebaseStorage.getInstance(STORAGE_NAME).getReference();
        StorageReference saveTarget = storageRef.child("save").child(fileName);

        StorageMetadata metadata = new StorageMetadata.Builder()
                .setContentType("application/json")
                .build();
        UploadTask uploadTask = saveTarget.putBytes(content.getBytes(), metadata);
        uploadTask.addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                UnityBinder.sendToUnity("?cmd=FirebaseBinder.save.error&reason=" + e.getLocalizedMessage());
            }
        }).addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
            @Override
            public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                UnityBinder.sendToUnity("?cmd=FirebaseBinder.save.ok");
            }
        });
    }

    /*void loadWithUser(FirebaseUser user, OnSuccessListener<byte[]> onSuccess, OnFailureListener onFailure){
        String uid = user.getUid();
        String fileName = uid+".json";

        StorageReference storageRef = FirebaseStorage.getInstance(STORAGE_NAME).getReference();
        StorageReference loadTarget = storageRef.child("save").child(fileName);

        final long ONE_MEGABYTE = 1024 * 1024;
        loadTarget.getBytes(ONE_MEGABYTE).addOnSuccessListener(onSuccess).addOnFailureListener(onFailure);
    }*/

    void load() throws Exception{
        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        if(user == null){
            throw didntLoginException;
        }
        String uid = user.getUid();
        String fileName = uid+".json";

        StorageReference storageRef = FirebaseStorage.getInstance(STORAGE_NAME).getReference();
        StorageReference loadTarget = storageRef.child("save").child(fileName);

        final long ONE_MEGABYTE = 1024 * 1024;
        loadTarget.getBytes(ONE_MEGABYTE).addOnSuccessListener(new OnSuccessListener<byte[]>() {
            @Override
            public void onSuccess(byte[] bytes) {
                String content = new String(bytes);
                UnityBinder.sendToUnity("?cmd=FirebaseBinder.load.ok&data="+UnityBinder.encodeString(content));
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                UnityBinder.sendToUnity("?cmd=FirebaseBinder.load.error&reason=" + e.getLocalizedMessage());
            }
        });
    }

    private class GoogleSignIn implements ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener {
        private GoogleApiClient mGoogleApiClient;
        private AuthCredential credential;

        AuthCredential getCredential() throws Exception{
            if(credential == null){
                throw new Exception("google not login");
            }
            return credential;
        }

        void init(){
            if(mGoogleApiClient != null){
                return;
            }
            GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                    .requestEmail()
                    .requestIdToken(WEB_CLIENT_ID)
                    .build();
            mGoogleApiClient = new GoogleApiClient.Builder(UnityPlayer.currentActivity)
                    .addApi(Auth.GOOGLE_SIGN_IN_API, gso)
                    .addOnConnectionFailedListener(this)
                    .addConnectionCallbacks(this).build();
        }

        void connect() {
            if(mGoogleApiClient == null){
                return;
            }
            mGoogleApiClient.connect();
        }

        void disconnect(){
            if(mGoogleApiClient == null){
                return;
            }
            mGoogleApiClient.disconnect();
        }

        void signIn(){
            if(mGoogleApiClient == null){
                return;
            }
            UnityPlayer.currentActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Intent signInIntent = Auth.GoogleSignInApi.getSignInIntent(mGoogleApiClient);
                    UnityPlayer.currentActivity.startActivityForResult(signInIntent, googlePlayServiceBinderRequestCode);
                }
            });
        }

        @Override
        public void onConnected(@Nullable Bundle bundle) {
            UnityBinder.sendToUnity("?cmd=FirebaseBinder.google.connect.ok");
        }

        @Override
        public void onConnectionSuspended(int i) {
            UnityBinder.sendToUnity("?cmd=FirebaseBinder.google.connect.error&reason=" + i);
        }

        @Override
        public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
            if (connectionResult.hasResolution()) {
                try {
                    connectionResult.startResolutionForResult(UnityPlayer.currentActivity, RESOLVE_CONNECTION_REQUEST_CODE);
                } catch (IntentSender.SendIntentException e) {
                    UnityBinder.sendToUnity("?cmd=FirebaseBinder.google.connect.error&reason=" + e.getLocalizedMessage());
                }
            } else {
                GoogleApiAvailability apiAvailability = GoogleApiAvailability.getInstance();
                apiAvailability.getErrorDialog(UnityPlayer.currentActivity, connectionResult.getErrorCode(), PLAY_SERVICES_RESOLUTION_REQUEST).show();
            }
        }

        public void onActivityResult(int requestCode, int resultCode, Intent data) {
            if(requestCode == RESOLVE_CONNECTION_REQUEST_CODE){
                this.connect();
            }

            if (requestCode == googlePlayServiceBinderRequestCode) {
                GoogleSignInResult result = Auth.GoogleSignInApi.getSignInResultFromIntent(data);
                if (result.isSuccess()) {
                    GoogleSignInAccount acct = result.getSignInAccount();
                    AuthCredential credential = GoogleAuthProvider.getCredential(acct.getIdToken(), null);
                    FirebaseAuth.getInstance().signInWithCredential(credential)
                            .addOnCompleteListener(UnityPlayer.currentActivity, new OnCompleteListener<AuthResult>() {
                                @Override
                                public void onComplete(@NonNull Task<AuthResult> task) {
                                    if (task.isSuccessful()) {
                                        UnityBinder.sendToUnity("?cmd=FirebaseBinder.google.signIn.ok");
                                    } else {
                                        UnityBinder.sendToUnity("?cmd=FirebaseBinder.google.signIn.error&reason"+UnityBinder.encodeString(task.getException().getLocalizedMessage()));
                                    }
                                }
                            });
                    this.credential = credential;
                } else {
                    UnityBinder.sendToUnity("?cmd=FirebaseBinder.google.signIn.error&reason="+UnityBinder.encodeString("must build with release mode"));
                }
            }
        }
    }

    private class AnonymousSignIn{
        void signIn(){
            FirebaseAuth.getInstance().signInAnonymously()
                    .addOnCompleteListener(UnityPlayer.currentActivity, new OnCompleteListener<AuthResult>() {
                        @Override
                        public void onComplete(@NonNull Task<AuthResult> task) {
                            if (task.isSuccessful()) {
                                UnityBinder.sendToUnity("?cmd=FirebaseBinder.anonymouse.signIn.ok");
                            } else {
                                UnityBinder.sendToUnity("?cmd=FirebaseBinder.anonymouse.signIn.error&reason"+UnityBinder.encodeString(task.getException().getLocalizedMessage()));
                            }
                        }
                    });
        }
    }

    public static void HandleCommand(String cmd, List<UrlQuerySanitizer.ParameterValuePair> pairs) {
        switch (cmd) {
            case "FirebaseBinder.init":{
                instance.init();
            } break;
            case "FirebaseBinder.signOut":{
                instance.signOut();
            } break;
            case "FirebaseBinder.google.signIn": {
                instance.googleSignIn.signIn();
            } break;
            case "FirebaseBinder.anonymouse.signIn": {
                instance.anonymousSignIn.signIn();
            } break;
            case "FirebaseBinder.anonymouse.link.google": {
                try {
                    instance.linkCredentail(instance.googleSignIn.getCredential());
                }catch (Exception e){
                    UnityBinder.sendToUnity("?cmd=FirebaseBinder.anonymouse.link.google.error&reason="+UnityBinder.encodeString(e.getMessage()));
                }
            } break;
            case "FirebaseBinder.save":{
                String data = UnityBinder.GetValue(pairs, "data");
                try {
                    // 這樣存正常
                    //instance.save("{\"wow\":\"gangangan\"}");
                    instance.save(data);
                }catch (Exception e){
                    UnityBinder.sendToUnity("?cmd=FirebaseBinder.save.error&reason="+UnityBinder.encodeString(e.getMessage()));
                }
            } break;
            case "FirebaseBinder.load":{
                try {
                    instance.load();
                }catch (Exception e){
                    UnityBinder.sendToUnity("?cmd=FirebaseBinder.load.error&reason="+UnityBinder.encodeString(e.getMessage()));
                }
            } break;
        }
    }
}
