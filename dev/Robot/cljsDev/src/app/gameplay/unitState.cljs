(ns app.gameplay.unitState)

(def default {:robot "jimu"
              :pilot "amuro"
              :hp 2000
              :mp 120
              :component []
              :weapon [{:weaponKey "beangun"
                        :bulletCount 12}
                       {:weaponKey "bigsword"}]})


(defmulti create (fn [type] type))
(defmulti getWeapons (fn [type] type))

(defmethod create :default [_ key data]
  default)

(defmethod getWeapons :default [_ ctx data]
  (->> (get ctx :weapon)
       (map (fn [{:keys [weaponKey] :as weapon}]
              (merge (get-in data ["weapon" weaponKey])
                     {:state weapon})))))