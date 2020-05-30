(ns module.v1.viewModel.spec
  (:require [clojure.spec.alpha :as s])
  (:require [tool.menuCursor]))

(s/def ::position (s/tuple int? int?))
(s/def ::map (s/nilable (s/coll-of vector?)))
(s/def ::cursor (s/nilable ::position))
(s/def ::moveRange (s/nilable (s/coll-of ::position)))
(s/def ::units (s/nilable (s/coll-of map?)))
(s/def ::attackRange (s/nilable (s/coll-of ::position)))
(s/def ::menuCursor (s/nilable ::tool.menuCursor/model))
(s/def ::systemMenu (s/nilable (s/keys :req-un [::data ::menuCursor])))
(s/def ::unitMenu (s/nilable (s/keys :req-un [::data ::menuCursor])))
(s/def ::battleMenu (s/nilable (s/keys :req-un [::preview])))
(s/def ::startUnitsMenu (s/nilable (s/keys :req-un [::data])))
(s/def ::viewModel (s/keys :req-un [::map
                                    ::cursor
                                    ::moveRange
                                    ::units
                                    ::attackRange
                                    ::systemMenu
                                    ::unitMenu
                                    ::battleMenu
                                    ::startUnitsMenu]))