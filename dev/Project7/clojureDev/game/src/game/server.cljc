(ns game.server
  (:require [clojure.spec.alpha :as s]
            [ring.adapter.jetty :refer [run-jetty]]
            [ring.middleware.params :refer [wrap-params]]
            [ring.util.response :refer [redirect]]
            [compojure.core :refer [defroutes GET POST]]
            [compojure.route :refer [not-found]]
            [hiccup.core :refer [html]]
            [clojure.core.async :refer [go <!! timeout <!]]
            [clojure.core.match :refer [match]]
            [game.entity.model]
            [game.entity.model-flow]))

(def model-atom (atom (-> game.entity.model-flow/model-flow (assoc :phase [:reroll :rule]))))

(defroutes app
  (wrap-params
   (POST "/fn/command" [player-id command :as r]
     (let [model @model-atom
           model (game.entity.model-flow/exec-command model (keyword player-id) (-> command read-string))
           _ (->> model (s/assert :game.entity.model-flow/spec) (reset! model-atom))]
       (str model))))
  (wrap-params
   (GET "/fn/command" [player-id]
     (let [model @model-atom
           commands (game.entity.model-flow/query-command model (keyword player-id))]
       (str commands))))
  (GET "/fn/model" []
    (let [model (->> @model-atom (s/assert :game.entity.model-flow/spec))]
      (str model)))
  (not-found (str {:message "page not found"})))


(defn -main [args]
  (run-jetty app {:port 8081}))


(comment
  (def model (atom {}))

  (defn start-game [model game-id]
    (go (assoc model :game-id game-id)))

  (defn update-model [model evt]
    (go
      (match evt
        [:start-game game-id]
        (<! (start-game model game-id)))))

  (defn swap-model [evt]
    (go (reset! model (<! (update-model @model evt)))))

  (defn card-view [info]
    [:div (str info)])

  (defn card-stack-view [info]
    [:div
     [:div (-> info :title)]
     [:div (for [c (-> info :cards)]
             (card-view c))]])

  (defn table-view [info]
    [:div (for [cs (-> info :card-stacks)]
            (card-stack-view cs))])

  (defn battle-page []
    (let [model {:card-stacks [{:title "Home" :cards [{:id "abc"} {:id "abc"}]}]}]
      (html (table-view model))))

  (defn page-index []
    (let [model @model]
      (html [:div
             [:div (str "model" model)]
             [:form {:method "post" :action "fn/start_game"}
              [:input {:type "text" :name "game-id" :value (:game-id model)}]
              [:input {:type "submit" :value "start new game"}]]])))


  (defroutes test-app
    (GET "/" [] (page-index))
    (GET "/battle" [] (battle-page))
    (GET "/fn/model" [] (str {:main "中文測試" :script '(fn [] (read-string "(fn [])"))}))
    (wrap-params (POST "/fn/start_game" [game-id :as r]
                   (<!! (swap-model [:start-game game-id]))
                   (redirect "/")))
    (wrap-params (GET "/user/:id" [id greeting]
                   (str "<h1>" greeting " user " id "</h1>")))
    (not-found "<h1>Page not found</h1>"))
  )