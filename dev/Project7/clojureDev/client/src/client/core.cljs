(ns client.core
  (:require [clojure.spec.alpha :as s]
            [cljs.reader :as reader]
            [reagent.core :as r]
            [reagent.dom :as d]))

(s/def ::open boolean?)
(s/def ::card (s/keys :req-un [::open]))
(s/def ::card-stack (s/keys :req-un [::open]))
(s/def ::cards (s/map-of any? ::card))
(s/def ::card-stacks (s/map-of any? ::card-stack))
(s/def ::battle (s/keys :req-un [::cards ::card-stacks]))
(s/def ::view-model (s/merge (s/keys :req-un [::page])
                        ::battle))

(def model-atom (atom {}))

(def view-model-atom (r/atom {:page :battle
                              :battle {:cards {"0" {:open true} "1" {:open false} "2" {:open true}}
                                       :card-stacks {"cs1" {:open false}
                                                     "cs2" {:open true}}}}))


(defn card-view [card-id player-id]
  (let [view-model @view-model-atom
        card (-> view-model :battle :cards (get card-id))]
    (if (not card)
      [:div {:key card-id} (str card-id " not found")]
      [:div {:key card-id} (str card-id " " card)])))

(defn card-stack-view [card-stack-id player-id]
  (let [view-model @view-model-atom
        card-stack (-> view-model :battle :card-stacks (get card-stack-id))
        is-open (-> card-stack :open)
        card-ids ["0" "1" "2"]]
    (if (not card-stack)
      [:div {:key card-stack-id} (str card-stack-id " not found")]
      [:div {:key card-stack-id}
       [:div
        [:div card-stack-id]
        [:button {:on-click (fn []
                              (swap! view-model-atom update-in [:battle :card-stacks card-stack-id :open] not))}
         (if is-open "close" "open")]
        (if is-open
          (for [card-id card-ids]
            (card-view card-id player-id))
          [:div (str "count:" (count card-ids))])]])))

(defn battle-page [view-model]
  (let [player-id ""]
    [:div "battle-page"
     [:div "debug"
      [:div (str view-model)]
      [:button {:on-click (fn [] (swap! view-model-atom assoc :page :home))} "home"]]
     (card-stack-view "cs1" player-id)
     (card-stack-view "cs2" player-id)]))

(defn app []
  (let [view-model @view-model-atom]
    (s/assert ::view-model view-model)
    (condp = (-> view-model :page)
      :home [:div "home"
             [:button {:on-click (fn []
                                   (swap! view-model-atom assoc :page :battle))}
              "battle"]]
      :battle (battle-page view-model))))

(defn main []
  (enable-console-print!)
  (d/render [app] (.getElementById js/document "app")))
  
(main)

#_(-> (js/axios (clj->js {:method "GET"
                        :url "/fn/model"}))
    (.then (fn [resp]
             (-> resp (.-data) reader/read-string :main println)))
    (.catch println))
