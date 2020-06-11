import React from "react"
import { Col, Panel, Row } from "react-bootstrap"

export const Disclaimer = () => (
  <Row>
    <Col lg={12}>
      <Panel bsStyle="warning">
        <Panel.Heading>
          <Panel.Title componentClass="h3">Отказ от ответственности</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          Сайт gia.devmem.ru не связан с РЦОИ города Москвы и разработан частным лицом,
          заинтересованным в удобном представлении информации. Данные получены в
          автоматическом режиме из общедоступных файлов эксель, размещенных на{" "}
          <a
            href="http://rcoi.mcko.ru/organizers/schedule/ege/"
            target="_blank"
            rel="noopener noreferrer"
            title="РЦОИ">
            официальном сайте РЦОИ в разделе Организаторам > Планирование
          </a>
          . Сайт носит справочный характер и не может являться основным источником
          информации о распределении работников на ППЭ. Автор не несет ответственности
          за неявку организаторов на ППЭ. Автор не несет ответственности за
          достоверность, полноту и качество представленной информации.
        </Panel.Body>
      </Panel>
    </Col>
  </Row>
)

export default Disclaimer
