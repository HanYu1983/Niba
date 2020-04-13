(ns app.gameplay.phase.unitMenuImpl)

(defmacro impl []
  '(defn unitMenu [gameplayCtx args inputCh outputCh]
     (module.default.tmp/gameplayOnUnitMenu app.module/*module
                                gameplayCtx
                                args
                                inputCh
                                outputCh)))