module CarPiList where

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

-- MODEL

type alias Model =
  { cars : List String }


initialModel : Model
initialModel =
  { cars = [] }

-- UPDATE

type Action = NoOp | AddCar String | RemoveCar String

update : Action -> Model -> Model
update action model =
  case action of
    NoOp ->
      model
    AddCar newCar ->
      let
        updatedCars =
          if List.member newCar model.cars then model.cars else newCar :: model.cars
      in
        { model | cars = updatedCars }
    RemoveCar oldCar ->
      let
        updatedCars = List.filter (\v -> v /= oldCar) model.cars
      in
        { model | cars = updatedCars }

-- VIEW

view : Signal.Address Action -> Model -> Html
view address model =
  let
    list =
      if List.isEmpty model.cars then
        div [ class "panel-body" ] [ p [] [ text "No cars online"] ]
      else
        carsList model.cars
  in
    div [ class "panel panel-primary" ]
      [ (div [ class "panel-heading" ] [ text "List of cars online" ]),
        list
      ]

carsList : List String -> Html
carsList cars =
  let
    carItem car =
      li [ class "list-group-item" ] [ text car ]
    carItems =
      List.map carItem cars
  in
    ul [ class "list-group" ] carItems

-- PORTS

port newCar : Signal String
port oldCar : Signal String

-- SIGNALS

inbox : Signal.Mailbox Action
inbox =
  Signal.mailbox NoOp


actions : Signal Action
actions =
  Signal.mergeMany [
    inbox.signal,
    (Signal.map AddCar newCar),
    (Signal.map RemoveCar oldCar) ]


model : Signal Model
model =
  Signal.foldp update initialModel actions


main : Signal Html
main =
  Signal.map (view inbox.address) model
