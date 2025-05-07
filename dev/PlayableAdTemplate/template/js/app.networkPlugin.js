window.app.networkPlugin = async function () {
    const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.sega.Kotodaman"
    const APP_STORE_URL = "https://apps.apple.com/jp/app/%E3%82%B3%E3%83%88%E3%83%80%E3%83%9E%E3%83%B3-%E5%85%B1%E9%97%98%E3%81%93%E3%81%A8%E3%81%B0rpg/id1298368256"

    const {
        Google,
        Meta,
        Mintegral,
        Mraid,
        Tiktok,
        Vungle
    } = window.adNetworkPlugin
    // Do not touch here unless you know what you're doing
    //const networkPlugin = AdNetworkFactory.createAdNetwork(config.adNetworkType);
    //const mraidAdNetworks = new Set(["unityads", "adcolony", "applovin", "kayzen", "ironsource"]);

    function adStart() {
        //if (config.adNetworkType === "mintegral") {
        Mintegral.gameStart();
        //}
    }

    function adEnd() {
        //if (config.adNetworkType === "mintegral") {
        Mintegral.gameEnd();
        //}
    }

    function adClose() {
        //if (config.adNetworkType === "mintegral") {
        Mintegral.gameClose(() => {
            console.log("Game close worked!");
        });
        //}
    }

    function adRetry() {
        //if (config.adNetworkType === "mintegral") {
        Mintegral.gameRetry();
        //}
    }

    function adReady() {
        //if (config.adNetworkType === "mintegral") {
        Mintegral.gameReady();
        //}
    }

    /**
     * This function is used to handle the audio volume change event for MRAID networks.
     * 
     * @param {Phaser.Scene} sceneInstance - The Phaser scene instance.
     */
    function onAudioVolumeChange(setVolumeFn) {
        //if (mraidAdNetworks.has(config.adNetworkType)) {
        Mraid.audioVolumeChange((volumePercentage) => {
            setVolumeFn(volumePercentage)
        });
        //}
    }

    /**
     * This function is used to handle the CTA (Call To Action) click event.
     * 
     * @returns {void}
     */
    function onCtaPressed() {
        adClose(); // these calls are needed for Mintegral
        adEnd();

        // if (mraidAdNetworks.has(config.adNetworkType)) {
        //     networkPlugin.ctaPressed(config.googlePlayStoreLink, config.appleStoreLink);
        // } else {
        //     networkPlugin.ctaPressed();
        // }
        [Google, Meta, Mintegral, Mraid, Tiktok, Vungle].forEach((network) => {
            network.ctaPressed(GOOGLE_PLAY_URL, APP_STORE_URL);
        });
    }

    function onAssetsLoaded() {
        adReady()
        adStart()
    }

    function onRetry() {
        adRetry()
    }

    function onInitPromise() {
        return new Promise((resolve) => {
            Mraid.initMraid(resolve);
        });
    }

    await onInitPromise();

    return {
        onAudioVolumeChange,
        onCtaPressed,
        onAssetsLoaded,
        onRetry
    }
}()

