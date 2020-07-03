(ns app.core
  (:require ["matter-js" :as matter :refer [Engine Render World Bodies Body]]
            [clojure.spec.alpha :as s]
            [clojure.core.async :as a]))

(s/check-asserts true)

(s/def ::id string?)
(s/def ::body (fn [obj]
                (and (.hasOwnProperty obj "mass")
                     (.hasOwnProperty obj "position"))))
(s/def ::force (fn [obj]
                 (and (.hasOwnProperty obj "x")
                      (.hasOwnProperty obj "y"))))
(s/def ::entity (s/keys :req-un [::id ::body ::force]))
(s/def ::entities (s/coll-of ::entity))

(s/def ::matter (s/keys :req-un [::engine ::render]))
(s/def ::gameplay (s/keys :req-un [::matter ::entities]))

(def gameplay {:matter (let [world (.create World (clj->js {:gravity {:x 0 :y 0}}))
                             engine (.create Engine (clj->js {:world world}))
                             render (.create Render (clj->js {:element js/document.body
                                                              :engine engine}))
                             _ (.run Render render)]
                         {:engine engine
                          :render render})
               :entities []})

(defn add-entity [gameplay entity]
  (s/assert ::gameplay gameplay)
  (s/assert
   ::gameplay
   (do
     (when-let [body (:body entity)]
       (s/assert ::body body)
       (.add World
             (-> gameplay :matter :engine (.-world))
             (array body)))
     #_(update gameplay :entities #(conj % entity))

     gameplay)))

(defn update-engine! [gameplay t]
  (s/assert ::gameplay gameplay)
  (.update Engine (-> gameplay :matter :engine) t)
  gameplay)


(defn forceSystem [gameplay]
  (s/assert ::gameplay gameplay)
  (doseq [entity (:entities gameplay)
          :when (s/valid? (s/keys :req-un [::body ::velocity]) entity)
          :let [{:keys [body velocity]} entity]]
    (let [_ (.applyForce Body body (.-position body) velocity)]))
  gameplay)

(defn main []
  (a/go
    (let [boxA {:id "ac"
                :body (.rectangle Bodies 400 200 80 80)}
          gameplay (add-entity gameplay boxA)]
      (loop [gameplay gameplay]
        (let [_ (update-engine! gameplay 33)
              _ (a/<! (a/timeout 33))]
          (recur gameplay))))))

(main)

