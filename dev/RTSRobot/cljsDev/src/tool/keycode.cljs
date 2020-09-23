(ns tool.keycode
  (:require ["keycode" :as kc]
            [clojure.spec.alpha :as s]))

(defn keycode [args]
  (s/assert (s/or :0 string?
                  :1 number?)
            args)
  (kc args))


(defn test-1 []
  (let [_ (println (keycode "f"))
        _ (println (keycode 32))]))