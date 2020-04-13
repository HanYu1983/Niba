(ns app.gameplay.step.menu
  (:require [clojure.core.async :as a])
  (:require-macros [app.gameplay.macros :as m])
  (:require [tool.menuCursor])
  (:require [module.default.data])
  (:require [app.gameplay.phase.common])
  (:require [module.default.tmp]))


(m/defstate menu [gameplayCtx {:keys [menu data]}]
  nil
  (m/basicNotify
   {:menuCursor (tool.menuCursor/model menu)})

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (some #(= % action) [:up :down])
   (m/handleMenuCursorUpDown 
    (recur gameplayCtx))

   (some #(= % action) [:left :right])
   (m/handleMenuCursorLeftRight
    (recur gameplayCtx))

   (= :enter action)
   (let [cursor1 (tool.menuCursor/getCursor1 (:menuCursor state))
         cursor2 (tool.menuCursor/getCursor2 (:menuCursor state))
         select (tool.menuCursor/getSelect (:menuCursor state))]
     (m/returnPop select))

   (= :cancel action)
   (m/returnPop :cancel)))