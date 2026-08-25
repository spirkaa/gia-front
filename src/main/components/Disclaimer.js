import React from "react"
import { Alert, Col, Row } from "react-bootstrap"

export const Disclaimer = () => (
  <Row>
    <Col lg={12}>
      <Alert variant="warning" className="mt-3">
        <Alert.Heading>
          <h3>Отказ от ответственности</h3>
        </Alert.Heading>
        Сайт gia.devmem.ru не связан с РЦОИ города Москвы и разработан частным лицом,
        заинтересованным в удобном представлении информации. Данные получены в
        автоматическом режиме из общедоступных файлов эксель, размещенных на{" "}
        <a
          href="http://rcoi.mcko.ru/organizers/schedule/ege/"
          target="_blank"
          rel="noopener noreferrer"
          title="РЦОИ">
          официальном сайте РЦОИ в разделе Организаторам &gt; Планирование
        </a>
        . Сайт носит справочный характер и не может являться основным источником
        информации о распределении работников на ППЭ. Автор не несет ответственности за
        неявку организаторов на ППЭ. Автор не несет ответственности за достоверность,
        полноту и качество представленной информации.
      </Alert>
    </Col>
  </Row>
)

export default Disclaimer
