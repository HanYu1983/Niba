(ns app2.spec.gameplay
  (:require [clojure.spec.alpha :as s]
            [app2.spec.desktop :as desktop]))

(s/def ::phase #{:draw :setting :attack :deffence})
(s/def ::step #{:before :body :after})
(s/def ::phase-step (s/tuple ::phase ::step))
(s/def ::gameplay (s/keys :req-un [::desktop/desktop ::phase-step]))