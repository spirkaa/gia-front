import { Col } from "react-bootstrap"

export const Footer = () => (
  <footer className="bottom-buffer">
    <hr />
    <Col lg={12} className="text-center text-muted">
      <p>
        2016-{new Date().getFullYear()} &copy;{" "}
        <a className="text-muted" href="https://devmem.ru">
          devmem.ru
        </a>
      </p>
    </Col>
  </footer>
)

export default Footer
