(ns app.core
  (:require ["matter-js" :as matter :refer [Engine Render World Bodies]]))

(let [engine (.create Engine)
      render (.create Render (clj->js {:element js/document.body
                                       :engine engine}))
      boxA (.rectangle Bodies 400 200 80 80)
      boxB (.rectangle Bodies 450 50 80 80)
      ground (.rectangle Bodies 400 610 810 60, (clj->js {:isStatic true}))
      _ (.add World (.-world engine) (clj->js [boxA boxB ground]))
      _ (.run Engine engine)
      _ (.run Render render)])