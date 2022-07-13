package;

import hex.log.LogManager;
import hex.log.LoggerContext;
import hex.log.LogLevel;
import hex.log.LoggerConfig;
import hex.log.target.TraceLogTarget;
import hex.log.configuration.BasicConfiguration;
import hex.log.layout.DefaultTraceLogLayout;
import haxe.ui.HaxeUIApp;

class Main {
	public static function main() {
        // -- You can see this working in hex.log.ConfigurationTest.hx
        // Create a new configuration
		var configuration = new BasicConfiguration();

		// Create log targets
		var traceTarget = new TraceLogTarget("Trace", null, new DefaultTraceLogLayout());
        
		// Create a logger config and add targets
		// (at this point we can also add filters to the configuration etc.)
		var lc1:LoggerConfig = LoggerConfig.createLogger("hex", LogLevel.INFO, null, null); // Logger will only forward warnings and higher
		lc1.addLogTarget(traceTarget, LogLevel.DEBUG, null); // Target will accept every event that arrives (in this case only warnings+ will be forwarded from the logger anyway)
		configuration.addLogger(lc1.name, lc1); // Add logger config to the configuration

		// Apply the configuration
		LoggerContext.getContext().setConfiguration(configuration);

		// Now you can request loggers and log as much you want and they will follow the rules set above
		// var logger = LogManager.getLogger("hex");
		// logger.debug("test"); // Fitered by config -> nothing will happen
		// logger.warn("test"); // will be logged

		var app = new HaxeUIApp();
		app.ready(function() {
		    app.addComponent(new MainView());

		    app.start();
		});

	}
}
