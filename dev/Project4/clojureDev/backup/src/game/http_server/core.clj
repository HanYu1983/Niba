(ns game.http-server.core
  (:require [clojure.spec.alpha :as s]
            [ring.adapter.jetty :refer [run-jetty]]
            [ring.middleware.params :refer [wrap-params]]
            [ring.util.response :refer [redirect]]
            [compojure.core :refer [GET POST]]
            [compojure.route :refer [not-found]]
            [hiccup.core :refer [html]])
  (:require [clojure.core.async :refer [go <!! timeout <!]]
            [clojure.core.match :refer [match]]))

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

(defn page-index []
  (let [model @model]
    (html [:div
           [:div (str "model" model)]
           [:form {:method "post" :action "fn/start_game"}
            [:input {:type "text" :name "game-id" :value (:game-id model)}]
            [:input {:type "submit" :value "start new game"}]]])))

(compojure.core/defroutes app
  (GET "/" [] (page-index))
  (wrap-params (POST "/fn/start_game" [game-id :as r]
                 (<!! (swap-model [:start-game game-id]))
                 (redirect "/")))
  (wrap-params (GET "/user/:id" [id greeting]
                 (str "<h1>" greeting " user " id "</h1>")))
  (not-found "<h1>Page not found</h1>"))

(defn run []
  (run-jetty app {:port 8080}))