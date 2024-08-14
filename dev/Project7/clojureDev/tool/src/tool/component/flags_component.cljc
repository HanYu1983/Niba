(ns tool.component.flags-component
  (:require [clojure.spec.alpha :as s]
            [clojure.set :refer [difference]]))

(s/def ::flags (s/coll-of any? :kind set?))
(s/def ::flags-component (s/keys :req-un [::flags]))

(def flags-component {:flags #{}})

(defn set-flags [ctx fs]
  (s/assert ::flags-component ctx)
  (s/assert set? fs)
  (update ctx :flags into fs))
(defn has-flag [ctx f]
  (s/assert ::flags-component ctx)
  (-> ctx :flags (get f) nil? not))
(defn remove-flags [ctx fs]
  (s/assert set? fs)
  (s/assert ::flags-component ctx)
  (update ctx :flags difference (into #{} fs)))