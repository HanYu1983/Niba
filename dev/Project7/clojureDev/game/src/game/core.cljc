(ns game.core
  (:require [clojure.core.match]
            [app.dynamic]
            [app.text]
            [app.card-proto]
            [game.tool.return-let]
            [game.tool.waterfall]
            [game.tool.callback]
            [game.tool.either]))

(defn -main [args]
  ;; (game.tool.return-let/test-all)
  ;; (game.tool.waterfall/test-all)
  ;; (game.tool.callback/test-all)
  ;; (game.tool.either/test-all)
  (app.card-proto/test-all))