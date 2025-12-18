(ns node.spec.map
  (:require [clojure.spec.alpha :as s]))

(s/def ::cell_pos_num (s/and int? #(< % 10) #(not (neg? %))))

(s/def ::cells (s/map-of ::cell_pos_num
                         (s/map-of ::cell_pos_num any?)))
(s/def ::map (s/keys :req-un [::cells]))

(s/fdef generate-map
  :args (s/cat :ctx ::map 
               :w (s/and int? #(< % 10) pos?)
               :r (s/and int? #(< % 10) pos?))
  :ret ::map)
(defn generate-map [ctx w r]
  (let [cells (zipmap (range r) (repeat (zipmap (range w) (repeat 0))))]
    (assoc ctx :cells cells)))

(s/fdef get-map-size
  :args (s/cat :ctx ::map)
  :ret (s/tuple int? int?))
(defn get-map-size [ctx]
  (let [cells (:cells ctx)
        w (count (first cells))
        r (count cells)]
    [w r]))

(s/fdef get-map-item
  :args (s/cat :ctx ::map :x int? :y int?)
  :ret any?)
(defn get-map-item [ctx x y]
  (let [cells (:cells ctx)]
    (get-in cells [y x])))

(s/fdef set-map-item
  :args (s/cat :ctx ::map
               :x ::cell_pos_num
               :y ::cell_pos_num
               :item any?)
  :ret ::map
  :fn (fn [{:keys [args ret]}]
        (= (get-map-item ret (-> args :x) (-> args :y))
           (-> args :item))))
(defn set-map-item [ctx x y item]
  (let [cells (:cells ctx)
        updated-cells (assoc-in cells [y x] item)]
    (assoc ctx :cells updated-cells)))