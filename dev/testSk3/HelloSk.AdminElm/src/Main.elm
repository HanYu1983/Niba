module Main exposing (main)

import Browser
import Html exposing (Html, button, div, h1, p, text)
import Html.Attributes exposing (disabled, style)
import Html.Events exposing (onClick)
import Http
import Json.Decode as Decode
import Json.Encode as Encode
import QdrantPage exposing (Collection)


-- 頁面型別：登入後可擴充更多管理頁
type Page
    = LoginPage
    | QdrantManagePage


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
      }
    , Cmd.none
    )



-- Msg


type Msg
    = LoginClick
    | GotLogin (Result Http.Error LoginResponse)
    | GotCollections (Result Http.Error (List Collection))
    | RequestDeleteCollection String
    | GotDeleteCollection String (Result Http.Error { success : Bool, message : String })


type LoginResponse
    = Token String
    | GraphQLError String



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

        GotCollections (Ok list) ->
            ( { model | collections = list, collectionsLoading = False, collectionsError = Nothing }, Cmd.none )

        GotCollections (Err _) ->
            ( { model | collectionsLoading = False, collectionsError = Just "無法載入 collections" }, Cmd.none )

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



-- View


view : Model -> Html Msg
view model =
    div
        [ style "padding" "24px"
        , style "font-family" "system-ui, sans-serif"
        ]
        [ h1 [] [ text "管理後台 (Elm)" ]
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



-- Main


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }
