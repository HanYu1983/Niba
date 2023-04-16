(ns game.http-server.core
  (:require [clojure.spec.alpha :as s]
            [ring.adapter.jetty :refer [run-jetty]]
            [ring.middleware.params :refer [wrap-params]]
            [compojure.core :refer [GET]]
            [compojure.route :refer [not-found]]
            [hiccup.core :refer [html]]))

(compojure.core/defroutes app
  (GET "/" [] (html [:ul
                     (for [x (range 1 4)]
                       [:li x])]))
  (wrap-params (GET "/foobar" {:as r}
                 (str r)))
  (wrap-params (GET "/user/:id" [id greeting]
                 (str "<h1>" greeting " user " id "</h1>")))
  (not-found "<h1>Page not found</h1>"))

(defn run []
  (run-jetty app {:port 8080}))