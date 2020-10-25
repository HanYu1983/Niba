(ns app2.cursor.core
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :as a]
            [clojure.core.match :refer [match]])
  (:require-macros [app2.macros :refer [defasync]]))

(s/def ::position (s/tuple int? int?))
(s/def ::size (s/tuple int? int?))
(s/def ::cursor-view (s/keys :req-un [::position]
                             :opt-un [::size]))

(defasync handle-cursor [{:keys [cursor-view] :as ctx} any?, evt any?] [ctx err] any?
  (if (not cursor-view)
    [ctx nil]
    (match evt
      [:on-click "e"]
      [ctx nil]

      :else
      [ctx nil])))