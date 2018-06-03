import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Jumbotron } from 'react-bootstrap'

export const Home = () => (
    <Jumbotron>
      <h1>База сотрудников ППЭ</h1>
      <p>
        Данные с сайта <a href='http://rcoi.mcko.ru'>РЦОИ города Москвы</a> о
        распределении сотрудников образовательных организаций
        в пункты проведения экзаменов во время основного (май-июль)
        и дополнительного периодов (сентябрь)
        экзаменационной кампании 2017/2018 учебного года.
      </p>
      <p>
        <LinkContainer to='/exams'>
          <Button bsStyle='primary'>Перейти к поиску</Button>
        </LinkContainer>
      </p>
    </Jumbotron>
)

export default Home