(ns app.gameplay.phase.unitMenuImpl)

(defmacro impl []
  '(defn unitMenu [gameplayCtx args inputCh outputCh]
     (app.module/onUnitMenu app.module/*module
                                gameplayCtx
                                args
                                inputCh
                                outputCh)))