module Main exposing (main)

import Browser
import Html exposing (Html, button, div, h1, p, text, textarea)
import Html.Attributes exposing (disabled, placeholder, rows, style, value)
import Html.Events exposing (onClick, onInput)
import Http
import Json.Decode as Decode
import Json.Encode as Encode
import QdrantPage exposing (Collection, CollectionsResponse(..))
import String


-- 頁面型別：登入後可擴充更多管理頁
type Page
    = LoginPage
    | QdrantManagePage
    | ChatPage


-- Model


type alias Model =
    { token : Maybe String
    , error : Maybe String
    , loading : Bool
    , page : Page
    , collections : List Collection
    , collectionsLoading : Bool
    , collectionsError : Maybe String
    , deletingCollection : Maybe String
    , chatMessages : List ChatMessage
    , chatInput : String
    , chatLoading : Bool
    , chatError : Maybe String
    }


type alias ChatMessage =
    { role : String
    , content : String
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { token = Nothing
      , error = Nothing
      , loading = False
      , page = LoginPage
      , collections = []
      , collectionsLoading = False
      , collectionsError = Nothing
      , deletingCollection = Nothing
      , chatMessages = []
      , chatInput = ""
      , chatLoading = False
      , chatError = Nothing
      }
    , Cmd.none
    )



-- Msg


type Msg
    = LoginClick
    | GotLogin (Result Http.Error LoginResponse)
    | GotCollections (Result Http.Error CollectionsResponse)
    | RequestDeleteCollection String
    | GotDeleteCollection String (Result Http.Error { success : Bool, message : String })
    | SwitchToQdrant
    | SwitchToChat
    | ChatInputChanged String
    | SendChat
    | GotChat (Result Http.Error ChatResponse)


type LoginResponse
    = Token String
    | GraphQLError String


type alias ChatResponse =
    { messages : List ChatMessage
    , answer : String
    }



-- GraphQL: login mutation，無帳密，回傳 token


graphqlUrl : String
graphqlUrl =
    "graphql"


loginMutationBody : String
loginMutationBody =
    Encode.encode 0 <|
        Encode.object
            [ ( "query", Encode.string "mutation { login { token } }" )
            ]


decodeLoginResponse : Decode.Decoder LoginResponse
decodeLoginResponse =
    Decode.oneOf
        [ Decode.map Token (Decode.at [ "data", "login", "token" ] Decode.string)
        , Decode.map GraphQLError (Decode.at [ "errors", "0", "message" ] Decode.string)
        ]


loginRequest : Cmd Msg
loginRequest =
    Http.post
        { url = graphqlUrl
        , body = Http.stringBody "application/json" loginMutationBody
        , expect = Http.expectJson GotLogin decodeLoginResponse
        }


collectionsRequest : String -> Cmd Msg
collectionsRequest token =
    QdrantPage.fetchCollections graphqlUrl token GotCollections


deleteCollectionRequest : String -> String -> Cmd Msg
deleteCollectionRequest token name =
    QdrantPage.deleteCollection graphqlUrl token name (GotDeleteCollection name)


chatRequest : String -> List ChatMessage -> String -> Cmd Msg
chatRequest token history userInput =
    let
        allMessages =
            history
                ++ (if String.isEmpty userInput then
                        []
                    else
                        [ { role = "user", content = userInput } ]
                   )

        encodeMessage msg =
            Encode.object
                [ ( "role", Encode.string msg.role )
                , ( "content", Encode.string msg.content )
                ]

        body =
            Encode.encode 0 <|
                Encode.object
                    [ ( "query"
                      , Encode.string "mutation($messages: [ChatMessageInput!]!) { chat(messages: $messages) { messages { role content } answer } }"
                      )
                    , ( "variables"
                      , Encode.object
                            [ ( "messages"
                              , Encode.list encodeMessage allMessages
                              )
                            ]
                      )
                    ]
    in
    Http.request
        { method = "POST"
        , url = graphqlUrl
        , headers =
            [ Http.header "Authorization" ("Bearer " ++ token)
            , Http.header "Content-Type" "application/json"
            ]
        , body = Http.stringBody "application/json" body
        , expect = Http.expectJson GotChat decodeChatResponse
        , timeout = Nothing
        , tracker = Nothing
        }


decodeChatResponse : Decode.Decoder ChatResponse
decodeChatResponse =
    let
        decodeMsg =
            Decode.map2 ChatMessage
                (Decode.field "role" Decode.string)
                (Decode.field "content" Decode.string)
    in
    Decode.map2 ChatResponse
        (Decode.at [ "data", "chat", "messages" ] (Decode.list decodeMsg))
        (Decode.at [ "data", "chat", "answer" ] Decode.string)



-- Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LoginClick ->
            ( { model | loading = True, error = Nothing }, loginRequest )

        GotLogin (Ok (Token token)) ->
            ( { model | token = Just token, loading = False, error = Nothing, page = QdrantManagePage, collectionsLoading = True }
            , collectionsRequest token
            )

        GotLogin (Ok (GraphQLError errMsg)) ->
            ( { model | loading = False, error = Just errMsg }, Cmd.none )

        GotLogin (Err (Http.BadBody errMsg)) ->
            ( { model | loading = False, error = Just errMsg }, Cmd.none )

        GotLogin (Err _) ->
            ( { model | loading = False, error = Just "請求失敗" }, Cmd.none )

        GotCollections (Ok (CollectionsOk list)) ->
            ( { model | collections = list, collectionsLoading = False, collectionsError = Nothing }, Cmd.none )

        GotCollections (Ok (CollectionsError errMsg)) ->
            ( { model | collectionsLoading = False, collectionsError = Just ("後端錯誤：" ++ errMsg), collections = [] }, Cmd.none )

        GotCollections (Err _) ->
            ( { model | collectionsLoading = False, collectionsError = Just "無法載入 collections（網路錯誤）" }, Cmd.none )

        RequestDeleteCollection name ->
            case model.token of
                Just token ->
                    ( { model | deletingCollection = Just name }, deleteCollectionRequest token name )

                Nothing ->
                    ( model, Cmd.none )

        GotDeleteCollection _ (Ok _) ->
            case model.token of
                Just token ->
                    ( { model | deletingCollection = Nothing }, collectionsRequest token )

                Nothing ->
                    ( { model | deletingCollection = Nothing }, Cmd.none )

        GotDeleteCollection _ (Err _) ->
            ( { model | deletingCollection = Nothing, collectionsError = Just "刪除失敗" }, Cmd.none )

        SwitchToQdrant ->
            ( { model | page = QdrantManagePage }, Cmd.none )

        SwitchToChat ->
            ( { model | page = ChatPage }, Cmd.none )

        ChatInputChanged txt ->
            ( { model | chatInput = txt }, Cmd.none )

        SendChat ->
            case ( model.token, String.isEmpty model.chatInput, model.chatLoading ) of
                ( Just token, False, False ) ->
                    ( { model | chatLoading = True, chatError = Nothing }
                    , chatRequest token model.chatMessages model.chatInput
                    )

                _ ->
                    ( model, Cmd.none )

        GotChat (Ok resp) ->
            ( { model
                | chatMessages = resp.messages
                , chatInput = ""
                , chatLoading = False
                , chatError = Nothing
              }
            , Cmd.none
            )

        GotChat (Err _) ->
            ( { model | chatLoading = False, chatError = Just "聊天呼叫失敗" }, Cmd.none )



-- View


view : Model -> Html Msg
view model =
    div
        [ style "padding" "24px"
        , style "font-family" "system-ui, sans-serif"
        ]
        [ h1 [] [ text "管理後台 (Elm)" ]
        , viewTabs model
        , viewPage model
        , case model.error of
            Just e ->
                p [ style "color" "red", style "margin-top" "8px" ] [ text e ]

            Nothing ->
                text ""
        ]


viewPage : Model -> Html Msg
viewPage model =
    case model.token of
        Nothing ->
            div [ style "margin-top" "16px" ]
                [ button
                    [ onClick LoginClick
                    , disabled model.loading
                    , style "padding" "8px 16px"
                    , style "font-size" "16px"
                    , style "cursor" (if model.loading then "wait" else "pointer")
                    ]
                    [ text (if model.loading then "登入中…" else "登入") ]
                ]

        Just _ ->
            case model.page of
                LoginPage ->
                    div [] []

                QdrantManagePage ->
                    QdrantPage.view
                        { collections = model.collections
                        , loading = model.collectionsLoading
                        , error = model.collectionsError
                        , deletingCollection = model.deletingCollection
                        , onDeleteClick = RequestDeleteCollection
                        }

                ChatPage ->
                    viewChat model


viewTabs : Model -> Html Msg
viewTabs model =
    case model.token of
        Nothing ->
            text ""

        Just _ ->
            div [ style "margin-top" "16px", style "margin-bottom" "8px" ]
                [ button
                    [ onClick SwitchToQdrant
                    , style "margin-right" "8px"
                    , style "padding" "4px 12px"
                    ]
                    [ text "Collections 管理" ]
                , button
                    [ onClick SwitchToChat
                    , style "padding" "4px 12px"
                    ]
                    [ text "聊天" ]
                ]


viewChat : Model -> Html Msg
viewChat model =
    let
        viewMsg msg =
            let
                align =
                    if msg.role == "user" then
                        "flex-end"
                    else
                        "flex-start"

                bg =
                    if msg.role == "user" then
                        "#DCF8C6"
                    else
                        "#FFFFFF"
            in
            div
                [ style "display" "flex"
                , style "justify-content" align
                , style "margin" "4px 0"
                ]
                [ div
                    [ style "max-width" "70%"
                    , style "padding" "8px 12px"
                    , style "border-radius" "8px"
                    , style "background-color" bg
                    , style "border" "1px solid #ddd"
                    ]
                    [ text msg.content ]
                ]
    in
    div [ style "margin-top" "16px", style "display" "flex", style "flex-direction" "column", style "height" "60vh" ]
        [ div
            [ style "flex" "1"
            , style "overflow-y" "auto"
            , style "border" "1px solid #ddd"
            , style "padding" "8px"
            ]
            (List.map viewMsg model.chatMessages)
        , div
            [ style "margin-top" "8px"
            ]
            [ textarea
                [ value model.chatInput
                , placeholder "輸入訊息..."
                , rows 3
                , style "width" "100%"
                , onInput ChatInputChanged
                ]
                []
            , button
                [ onClick SendChat
                , disabled (model.chatLoading || String.isEmpty model.chatInput)
                , style "margin-top" "4px"
                , style "padding" "6px 16px"
                ]
                [ text (if model.chatLoading then "送出中…" else "送出") ]
            , case model.chatError of
                Just e ->
                    p [ style "color" "red", style "margin-top" "4px" ] [ text e ]

                Nothing ->
                    text ""
            ]
        ]



-- Main


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }
