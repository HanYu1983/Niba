namespace HelloSk.Core

open Microsoft.SemanticKernel

/// 將 Core 提供的 Plugin（通用工具、程式編輯、AWS、Facebook、Google Ads、Ricoh 監控）註冊到 Kernel，供 AI 透過 function calling 呼叫。
module PluginRegistration =
    /// 註冊 Tools、CodeHelper、Aws、Facebook、GoogleAds、RicohMonitoring 到指定 kernel。
    let registerCorePlugins (kernel: Kernel) =
        kernel.Plugins.Add(kernel.CreatePluginFromObject(ToolsPlugin(), "Tools"))
        kernel.Plugins.Add(kernel.CreatePluginFromObject(CodeHelperPlugin(), "CodeHelper"))
        kernel.Plugins.Add(kernel.CreatePluginFromObject(AwsPlugin(), "Aws"))
        kernel.Plugins.Add(kernel.CreatePluginFromObject(FacebookPlugin(), "Facebook"))
        kernel.Plugins.Add(kernel.CreatePluginFromObject(GoogleAdsPlugin(), "GoogleAds"))
        kernel.Plugins.Add(kernel.CreatePluginFromObject(RicohMonitoringPlugin(), "RicohMonitoring"))
