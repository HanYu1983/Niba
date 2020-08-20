(ns app.spec
  (:require [clojure.spec.alpha :as s])
  (:require [app.gameplay.spec]))

(s/def ::error (s/nilable #(instance? js/Error %)))
(s/def ::app (s/keys :req-un [::app.gameplay.spec/gameplay]))