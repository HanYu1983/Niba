(ns app.main)

(defmacro defclick [enable desc keys & body]
  (when enable
    `(let [keys# ~keys]
       (println (str "======" ~desc "======"))
       (loop [~'keys keys#]
         (when-let [~'key (first ~'keys)]
           (a/<! (a/timeout 200))
           (println "press" ~'key)
           (a/>! ~'outputCh ["KEY_DOWN" ~'key])
           (recur (rest ~'keys))))
       ~@body)))