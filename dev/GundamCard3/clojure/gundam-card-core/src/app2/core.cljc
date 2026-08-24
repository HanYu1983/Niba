(ns app2.core
  (:require [clojure.edn :as edn]
            [clara.rules :refer :all]
            [clara.rules.accumulators :as acc]))

(defrecord CardBattlePoint [card-id melee range defence])
(defrecord CardText [card-id])
(defrecord CardState []) ; from CardBattlePoint, CardText

(derive ::CardTextPSArmor ::CardTextSpecial)
(derive ::CardTextSpecial ::CardText)

(defrecord CardTextPSArmor [type step])

(defquery get-card-text-special []
  [?item <- ::CardText])

(defn test-query-interface []
  (let [session (-> (mk-session 'app2.core
                                :fact-type-fn :type)
                    (insert (map->CardTextPSArmor {:type ::CardTextPSArmor}))
                    (fire-rules))
        _ (println (query session get-card-text-special))]
    session))

(defn -main [args]
  (let [row-data {:id 0
                  :texts [(map->CardTextPSArmor {:type ::CardTextPSArmor})]}
        save (pr-str row-data)
        _ (println save)
        load (edn/read-string {:readers {'app2.core.CardTextPSArmor map->CardTextPSArmor}}
                              save)
        _ (println load)
        _ (when (not= row-data load)
            (throw (ex-info "not eq" {})))])

  (test-query-interface))
