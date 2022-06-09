(ns app3.gameplay.tool
  (:require [tool.planck]))

(defn get-bodies [world]
  (let [bodies (tool.planck/reduce-bodies world
                                          (fn [ctx body]
                                            (let [id (-> body .getUserData)]
                                              (assoc ctx id body)))
                                          {})]
    bodies))