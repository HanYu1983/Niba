window.app.ads = async function () {

  function getMraid() {
    if (window.mraid == null) {
      console.warn("mraid not found: get fake marid")
      return {
        getState: function () { return "ready" },
        open: function (url) { console.warn(`fake marid open: ${url}`) },
        isViewable: function () { return true },
      }
    }
    return window.mraid
  }

  const STORE_URL = "https://apps.apple.com/app/idXXXXXXXXX"

  function openAppStore() {
    getMraid().open(STORE_URL)
  }
  function onMraidReadyPromise() {
    return new Promise((res, rej) => {
      const _mraid = getMraid()
      if (_mraid.getState() === "loading") {
        _mraid.addEventListener("ready", res)
      } else {
        res()
      }
    })
  }
  function onSdkReadyPromise() {
    return new Promise((res, rej) => {
      const _mraid = getMraid()
      if (_mraid.isViewable()) {
        res()
      } else {
        function _viewableChange(viewable) {
          if (viewable) {
            _mraid.removeEventListener('viewableChange', _viewableChange);
            res()
          }
        }
        _mraid.addEventListener('viewableChange', _viewableChange);
      }
    })
  }
  await onMraidReadyPromise()
  await onSdkReadyPromise()
  return {
    openAppStore: openAppStore,
  }
}()