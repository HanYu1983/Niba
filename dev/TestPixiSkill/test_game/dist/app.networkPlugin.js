window.app.networkPlugin = async function () {

    const {
        Google,
        Meta,
        Mintegral,
        Mraid,
        Tiktok,
        Vungle,
        MaioNetwork,
        BgyMraid
    } = window.adNetworkPlugin

    function adStart() {
        Mintegral.gameStart();
    }

    function adEnd() {
        Mintegral.gameEnd();
        BgyMraid.gameEnd();
    }

    function adClose() {
        Mintegral.gameClose(() => {
            console.warn("Game close worked!");
        });
        MaioNetwork.closeAd();
    }

    function adRetry() {
        Mintegral.gameRetry();
    }

    function adReady() {
        Mintegral.gameReady();
        BgyMraid.gameReady();
    }

    function ctaPressed(googlePlayStore, appleStore) {
        adClose(); // these calls are needed for Mintegral
        adEnd();
        [Google, Meta, Mintegral, Mraid, Tiktok, Vungle, MaioNetwork, BgyMraid].forEach((network) => {
            network.ctaPressed(googlePlayStore, appleStore);
        });
    }

    function initPromise() {
        return Promise.all([
            new Promise((resolve) => {
                Mraid.initMraid(resolve);
            }),
            new Promise((resolve) => {
                MaioNetwork.init(resolve);
            }),
            new Promise((resolve) => {
                window.addEventListener('DOMContentLoaded', resolve);
            }),
        ]);
    }

    /**
     * This function is used to handle the audio volume change event for MRAID networks.
     * 
     * @param {Phaser.Scene} sceneInstance - The Phaser scene instance.
     */
    function onAudioVolumeChange(setVolumeFn) {
        Mraid.audioVolumeChange((volumePercentage) => {
            setVolumeFn(volumePercentage)
        });
    }

    /**
     * This function is used to handle the CTA (Call To Action) click event.
     * 
     * @returns {void}
     */
    function onCtaPressed(googlePlayStore, appleStore) {
        ctaPressed(googlePlayStore, appleStore);
    }

    function onAssetsLoaded() {
        adReady()
        adStart()
    }

    function onRetry() {
        adRetry()
    }

    function onInit() {
        return initPromise();
    }

    await onInit();

    return {
        onAudioVolumeChange,
        onCtaPressed,
        onAssetsLoaded,
        onRetry
    }
}()

