namespace HelloSk.Core

open Microsoft.SemanticKernel

/// 將 Core 提供的 Plugin（通用工具、Ricoh 監控）註冊到 Kernel，供 AI 透過 function calling 呼叫。
module PluginRegistration =
    /// 註冊 Tools（GetEnv、RunCmd）與 RicohMonitoring（RicohFetchAndUpdate、RicohPostToSlack）到指定 kernel。
    let registerCorePlugins (kernel: Kernel) =
        kernel.Plugins.Add(kernel.CreatePluginFromObject(ToolsPlugin(), "Tools"))
        kernel.Plugins.Add(kernel.CreatePluginFromObject(RicohMonitoringPlugin(), "RicohMonitoring"))
