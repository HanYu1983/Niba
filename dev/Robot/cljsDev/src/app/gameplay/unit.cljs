(ns app.gameplay.unit
  (:require [app.gameplay.module]))

(defn model [unit]
  (app.gameplay.module/unitStateCreate app.gameplay.module/*module unit))

(defn getWeapons [ctx]
  (app.gameplay.module/unitStateGetWeapons app.gameplay.module/*module ctx))