import React, { Component } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { Col, Row } from "react-bootstrap"

import { Header } from "../../main/components"
import { SubsTable } from "../components"
import { subsAdd, subsClearPages, subsDel, subsLoad, subsPageSet } from "../actions"
import { countSelector, subsWithExamsSelector } from "../selectors"
import Pagination from "./Pagination"

class Subscriptions extends Component {
  componentDidMount() {
    this.props.subsLoad(this.props.token)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { subsClearPages, subsLoad, subsPageSet, token, count } = this.props
    if (nextProps.isSubDelRequested) {
      subsClearPages()
      subsLoad(token)
      subsPageSet(1)
    }
    if (nextProps.count !== count) {
      if (nextProps.count === 0) {
        subsClearPages()
      }
    }
  }

  render() {
    const { token, count, subscriptions, subsDel, isSubRequesting } = this.props
    const header = "Подписки"
    return (
      <Row className="bottom-buffer">
        <Header header={header} subHeader={count} />
        <Col sm={2}>{""}</Col>
        {isSubRequesting && !subscriptions.length ? (
          <Col sm={8} className="text-center">
            Loading...
          </Col>
        ) : (
          <Col sm={8}>
            {subscriptions.length ? (
              <div>
                <p className="text-center">
                  При появлении новых экзаменов мы отправим уведомление на почту
                </p>
                <SubsTable
                  subscriptions={subscriptions}
                  onDelete={subsDel}
                  token={token}
                />
                <Pagination />
              </div>
            ) : (
              <p>
                Для того, чтобы получать на почту уведомления о новых экзаменах,
                перейдите на страницу <Link to="/employees">Сотрудники</Link>, найдите
                себя (или кого-нибудь еще) и на странице подробностей нажмите кнопку
                «Подписаться на обновления»
              </p>
            )}
          </Col>
        )}
        <Col sm={2}>{""}</Col>
      </Row>
    )
  }
}

Subscriptions.propTypes = {
  token: PropTypes.string.isRequired,
  subsMsg: PropTypes.object.isRequired,
  isSubRequesting: PropTypes.bool,
  isSubDelRequested: PropTypes.bool,
  subscriptions: PropTypes.array.isRequired,
  count: PropTypes.number,
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
  subsMsg: state.subs.subsMsg,
  isSubRequesting: state.subs.isSubRequesting,
  isSubDelRequested: state.subs.isSubDelRequested,
  subscriptions: subsWithExamsSelector(state),
  count: countSelector(state),
})

export default connect(mapStateToProps, {
  subsLoad,
  subsAdd,
  subsDel,
  subsClearPages,
  subsPageSet,
})(Subscriptions)
