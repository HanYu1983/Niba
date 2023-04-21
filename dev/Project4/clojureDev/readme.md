# container
    create_container.bat
    enter_container.bat

# lein
## create project
    lein new game

## run project
    lein run

## run test
    lein test
    
## run repl
    lein repl
    (use 'game.core :reload)
    (macroexpand-1 '(code))

# edn
## run project
    clj -X game.core/-main