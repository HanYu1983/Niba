(ns game.data.dynamic)

(defmulti cut-in :data-dynamic)
(defmulti add-text :data-dynamic)
(defmulti delete-text :data-dynamic)
(defmulti get-card-proto :data-dynamic)
(defmulti add-immediate-effect :data-dynamic)
(defmulti get-my-g :data-dynamic)
(defmulti get-my-g-can-tap :data-dynamic)
(defmulti get-card-chars :data-dynamic)
(defmulti get-card-color :data-dynamic)
(defmulti is-card-color-blue :data-dynamic)
(defmulti get-my-hand :data-dynamic)
(defmulti get-card-state :data-dynamic)
(defmulti set-card-state :data-dynamic)
(defmulti add-immediate-effect :data-dynamic)