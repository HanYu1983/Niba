module Main exposing (main)

import Browser
import Html exposing (Html, button, div, h1, p, text)
import Html.Attributes exposing (disabled, style)
import Html.Events exposing (onClick)
import Http
import Json.Decode as Decode
import Json.Encode as Encode


-- Model


type alias Model =
    { token : Maybe String
    , error : Maybe String
    , loading : Bool
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { token = Nothing, error = Nothing, loading = False }, Cmd.none )



-- Msg


type Msg
    = LoginClick
    | GotLogin (Result Http.Error LoginResponse)


type LoginResponse
    = Token String
    | GraphQLError String



-- GraphQL: login mutation，無帳密，回傳 token


graphqlUrl : String
graphqlUrl =
    "//localhost:5000/graphql"


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



-- Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LoginClick ->
            ( { model | loading = True, error = Nothing }, loginRequest )

        GotLogin (Ok (Token token)) ->
            ( { model | token = Just token, loading = False, error = Nothing }, Cmd.none )

        GotLogin (Ok (GraphQLError errMsg)) ->
            ( { model | loading = False, error = Just errMsg }, Cmd.none )

        GotLogin (Err (Http.BadBody errMsg)) ->
            ( { model | loading = False, error = Just errMsg }, Cmd.none )

        GotLogin (Err _) ->
            ( { model | loading = False, error = Just "請求失敗" }, Cmd.none )



-- View


view : Model -> Html Msg
view model =
    div
        [ style "padding" "24px"
        , style "font-family" "system-ui, sans-serif"
        ]
        [ h1 [] [ text "管理後台 (Elm)" ]
        , div [ style "margin-top" "16px" ]
            (case model.token of
                Just t ->
                    [ div []
                        [ p [] [ text "已登入" ]
                        , p [ style "word-break" "break-all" ] [ text t ]
                        ]
                    ]

                Nothing ->
                    [ button
                        [ onClick LoginClick
                        , disabled model.loading
                        , style "padding" "8px 16px"
                        , style "font-size" "16px"
                        , style "cursor" (if model.loading then "wait" else "pointer")
                        ]
                        [ text (if model.loading then "登入中…" else "登入") ]
                    ]
            )
        , case model.error of
            Just e ->
                p [ style "color" "red", style "margin-top" "8px" ] [ text e ]

            Nothing ->
                text ""
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
