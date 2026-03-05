module QdrantPage exposing (Collection, view, fetchCollections, deleteCollection, decodeCollectionsResponse, decodeDeleteResponse)

import Html exposing (Html, button, div, h2, li, p, text, ul)
import Html.Attributes exposing (disabled, style)
import Html.Events exposing (onClick)
import Http
import Json.Decode as Decode
import Json.Encode as Encode


-- 型別：與 GraphQL QdrantCollection 對應


type alias Collection =
    { name : String
    , pointsCount : Int
    }


-- GraphQL 查詢／變更與解碼（需 JWT 時由 Main 帶 Authorization header）


graphqlCollectionsQuery : String
graphqlCollectionsQuery =
    "query { collections { name pointsCount } }"


graphqlDeleteMutation : String -> String
graphqlDeleteMutation name =
    Encode.encode 0 <|
        Encode.object
            [ ( "query", Encode.string "mutation($name: String!) { deleteCollection(name: $name) { success message } }" )
            , ( "variables", Encode.object [ ( "name", Encode.string name ) ] )
            ]


decodeCollectionsResponse : Decode.Decoder (List Collection)
decodeCollectionsResponse =
    Decode.at [ "data", "collections" ] (Decode.list decodeCollection)


decodeCollection : Decode.Decoder Collection
decodeCollection =
    Decode.map2 Collection
        (Decode.field "name" Decode.string)
        (Decode.field "pointsCount" Decode.int)


decodeDeleteResponse : Decode.Decoder { success : Bool, message : String }
decodeDeleteResponse =
    Decode.map2 (\s m -> { success = s, message = m })
        (Decode.at [ "data", "deleteCollection", "success" ] Decode.bool)
        (Decode.at [ "data", "deleteCollection", "message" ] Decode.string)


-- 帶 Bearer token 的 GET 風格查詢（GraphQL 用 POST，body 為 query）
-- 回傳 Cmd，結果由 Main 用 GotCollections 處理


fetchCollections : String -> String -> (Result Http.Error (List Collection) -> msg) -> Cmd msg
fetchCollections baseUrl token toMsg =
    Http.request
        { method = "POST"
        , url = baseUrl
        , headers = [ Http.header "Authorization" ("Bearer " ++ token), Http.header "Content-Type" "application/json" ]
        , body = Http.stringBody "application/json" (Encode.encode 0 (Encode.object [ ( "query", Encode.string graphqlCollectionsQuery ) ]))
        , expect = Http.expectJson toMsg decodeCollectionsResponse
        , timeout = Nothing
        , tracker = Nothing
        }


deleteCollection : String -> String -> String -> (Result Http.Error { success : Bool, message : String } -> msg) -> Cmd msg
deleteCollection baseUrl token collectionName toMsg =
    Http.request
        { method = "POST"
        , url = baseUrl
        , headers = [ Http.header "Authorization" ("Bearer " ++ token), Http.header "Content-Type" "application/json" ]
        , body = Http.stringBody "application/json" (graphqlDeleteMutation collectionName)
        , expect = Http.expectJson toMsg decodeDeleteResponse
        , timeout = Nothing
        , tracker = Nothing
        }


-- View：列表 + 刪除按鈕，可擴充為更多操作


view :
    { collections : List Collection
    , loading : Bool
    , error : Maybe String
    , deletingCollection : Maybe String
    , onDeleteClick : String -> msg
    }
    -> Html msg
view opts =
    div [ style "margin-top" "16px" ]
        [ h2 [] [ text "Qdrant Collections" ]
        , if opts.loading then
            p [] [ text "載入中…" ]

          else
            case opts.error of
                Just e ->
                    p [ style "color" "red" ] [ text e ]

                Nothing ->
                    if List.isEmpty opts.collections then
                        p [] [ text "尚無 collection。" ]

                    else
                        ul [ style "list-style" "none", style "padding" "0" ]
                            (List.map
                                (\c ->
                                    li
                                        [ style "display" "flex"
                                        , style "align-items" "center"
                                        , style "gap" "12px"
                                        , style "margin-bottom" "8px"
                                        ]
                                        [ text (c.name ++ " (" ++ String.fromInt c.pointsCount ++ " points)")
                                        , button
                                            [ onClick (opts.onDeleteClick c.name)
                                            , disabled (opts.deletingCollection == Just c.name)
                                            , style "padding" "4px 12px"
                                            , style "cursor" (if opts.deletingCollection == Just c.name then "wait" else "pointer")
                                            ]
                                            [ text (if opts.deletingCollection == Just c.name then "刪除中…" else "刪除") ]
                                        ]
                                )
                                opts.collections
                            )
        ]
