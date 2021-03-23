import React from "react"
import { LinkContainer } from "react-router-bootstrap"
import { Button, Jumbotron } from "react-bootstrap"

export const Home = () => (
  <Jumbotron>
    <h1>Список организаторов ППЭ</h1>
    <p>
      Данные с сайта <a href="http://rcoi.mcko.ru">РЦОИ города Москвы</a> о
      распределении сотрудников образовательных организаций в пункты проведения
      экзаменов во время во время экзаменационной кампании 2020/2021 учебного года, а
      также апробаций и тренеровочных мероприятий. Список организаторов, задействованных
      на ГИА. Назначение работников на ППЭ.
    </p>
    <p>
      <LinkContainer to="/exams">
        <Button bsStyle="primary">Перейти к поиску</Button>
      </LinkContainer>
    </p>
  </Jumbotron>
)

export default Home
