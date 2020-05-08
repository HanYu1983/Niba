(ns module.v1.core
  (:require [clojure.string]))

(defmacro defwait [name [varCtx args] & body]
  `(defn ~name [~varCtx ~'args ~'inputCh ~'outputCh]
     (let [~'key (str (gensym ~(str name)))
           ~args ~'args]
       (a/go
         ;(println "[model][ask][question]" ~(str name) ~'args)
         (a/>! ~'outputCh [~(str name) [~'key ~'args]])
         (loop [~varCtx ~varCtx]
           (println "[model][ask][waitForAnswer]" ~'key)
           (when-let [[~'cmd ~'evt] (a/<! ~'inputCh)]
             (cond
               (= "ok" ~'cmd)
               (let [[~'resKey ~'resArgs] ~'evt
                     ~'isMatch (= ~'key ~'resKey)]
                 (if ~'isMatch
                   (do ;(println "[model][ask][answer]" ~'evt)
                     [~varCtx ~'resArgs])
                   (recur ~varCtx)))

               ~@body

               :else
               (recur ~varCtx))))))))


(defmacro defUnitGetter [field]
  `(defn  ~(symbol (str "getUnit" (clojure.string/capitalize (str field)))) [~'unit]
     (get-in ~'unit [:state ~(keyword field)])))

(defmacro defUnitSetter [field]
  `(defn ~(symbol (str "setUnit" (clojure.string/capitalize (str field)))) [~'unit ~'args]
     (update-in ~'unit [:state ~(keyword field)] (constantly ~'args))))