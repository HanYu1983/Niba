(ns app.macros)

(defmacro defstate2 [name notifyEnter & body]
  `(defn ~name [~'ctx ~'inputCh ~'outputCh]
     (a/go
       (a/>! ~'outputCh ~notifyEnter))
     (let [~'worker (a/chan)]
       (a/go-loop [~'ctx ~'ctx]
         (let [[~'cmd ~'args :as ~'evt] (a/<! ~'inputCh)]
           ~@body))
       ~'worker)))


(defmacro defstate [name [varCtx args] & body]
  `(defn ~name [~varCtx ~'args ~'inputCh ~'outputCh]
     (let [~'key (str (gensym ~(str name)))
           ~args ~'args]
       (a/go
         (println "[model][ask][question]" ~(str name) ~'args)
         (a/>! ~'outputCh [~(str name) [~'key ~'args]])
         (loop [~varCtx ~varCtx]
           (println "[model][ask][waitForAnswer]" ~'key)
           (when-let [[~'cmd [~'resKey ~'resArgs :as ~'args] :as ~'evt] (a/<! ~'inputCh)]
             (cond
               (= ["ok" ~'key] [~'cmd ~'resKey])
               (do
                 (println "[model][ask][answer]" ~'evt)
                 [~varCtx ~'resArgs])
               
               ~@body
               
               :else
               (recur ~varCtx))))))))


(defmacro handleCursor [ctx]
  `(let [~'cursor ~'args
         ~'units (:units ~ctx)
         ~'unitAtCursor (first (filter #(= ~'cursor (:position %))
                                       ~'units))
         ~'camera (get-in ~ctx [:temp :camera])
         ~'worldCursor (gameplay/local2world ~'camera ~'cursor)
         ~ctx (update-in ~ctx [:temp :cursor] (constantly ~'worldCursor))]
    (if ~'unitAtCursor
      (let []
        (a/>! ~'outputCh ["unitState"])
        (a/>! ~'outputCh ["setCursor" ~'cursor])
        (recur ~ctx))
      (let []
        (a/>! ~'outputCh ["setCursor" ~'cursor])
        (recur ~ctx)))))


(defmacro notifySetMap [ctx]
  `(a/>! ~'outputCh ["setMap" (gameplay/getLocalMap ~ctx nil)]))

(defmacro notifySetCamera [ctx]
  `(a/>! ~'outputCh ["setCamera" (gameplay/getCamera ~ctx)]))

(defmacro notifySetCursor [ctx]
  `(a/>! ~'outputCh ["setCursor" (gameplay/getLocalCursor ~ctx nil)]))