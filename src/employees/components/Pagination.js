import React from 'react'
import { Pager, PageItem } from 'react-bootstrap'

const Pagination = (props) => (
  <Pager>
    {props.prev
      ? <PageItem
        previous
        onClick={props.onPrevPageClick}
        disabled={props.loading}>&larr; Назад</PageItem>
      : null
    }
    <PageItem
      next
      onClick={props.onNextPageClick}
      disabled={props.loading}>Вперед &rarr;</PageItem>
  </Pager>
)

export default Pagination