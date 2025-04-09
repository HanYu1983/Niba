window.app.ads = async function () {

  function initMraid() {
    return new Promise((res, rej) => {
      if (typeof mraid == "undefined") {
        console.warn("MRAID not found, skipping init")
        res(false)
        return
      }
      // ====
      //
      // https://docs.unity.com/acquire/en-us/manual/playable-ads-best-practices
      //
      // ====
      // Wait for the SDK to become ready: 
      function Start() {
        if (mraid.getState() === 'loading') {
          // If the SDK is still loading, add a listener for the 'ready' event:
          mraid.addEventListener('ready', onSdkReady);
          // Otherwise, if the SDK is ready, execute your function:
        } else {
          onSdkReady();
        }
      }

      // Implement a function that shows the ad when it first renders:
      function onSdkReady() {
        // The viewableChange event fires if the ad container's viewability status changes.
        // Add a listener for the viewabilityChange event, to handle pausing and resuming: 
        mraid.addEventListener('viewableChange', viewableChangeHandler);
        // The isViewable method returns whether the ad container is viewable on the screen.
        if (mraid.isViewable()) {
          // If the ad container is visible, play the ad:
          showMyAd();
        }
      }

      // Implement a function for executing the ad:
      function showMyAd() {
        res(true)
      }

      // Implement a function that handles pausing and resuming the ad based on visibility:
      function viewableChangeHandler(viewable) {
        if (viewable) {
          // If the ad is viewable, show the ad:
          showMyAd();
        } else {
          // If not, pause the ad.
        }
      }

      Start()
    })
  }

  const GOOGLE_PLAY_URL = "https://apps.apple.com/app/idXXXXXXXXX"
  const APP_STORE_URL = "https://apps.apple.com/app/idXXXXXXXXX"

  function isAndroid() {
    const UserAgent = window.navigator.userAgent.toLowerCase();
    return UserAgent.indexOf('android') > -1;
  }

  const hasMraid = await initMraid()

  function openAppStore() {
    const url = isAndroid() ? GOOGLE_PLAY_URL : APP_STORE_URL;
    if (hasMraid) {
      mraid.open(url);
    } else {
      console.warn(`fake mraid open: ${url}`)
      window.open(url, "_blank")
    }
  }

  return {
    openAppStore: openAppStore,
  }
}()