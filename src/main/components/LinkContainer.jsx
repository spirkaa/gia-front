import { Children, cloneElement } from "react"
import PropTypes from "prop-types"
import { matchPath, useLocation, useNavigate } from "react-router-dom"

const isModifiedEvent = (event) =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)

export const LinkContainer = ({
  to,
  activeClassName = "active",
  children,
  onClick,
  replace,
  state,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const match = matchPath({ path: to }, location.pathname)
  const child = Children.only(children)

  const handleClick = (event) => {
    if (child.props.onClick) child.props.onClick(event)
    if (onClick) onClick(event)
    if (!event.defaultPrevented && event.button === 0 && !isModifiedEvent(event)) {
      event.preventDefault()
      navigate(to, { replace, state })
    }
  }

  return cloneElement(child, {
    href: to,
    className: [child.props.className, match ? activeClassName : null].join(" ").trim(),
    onClick: handleClick,
  })
}

LinkContainer.propTypes = {
  to: PropTypes.string.isRequired,
  activeClassName: PropTypes.string,
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func,
  replace: PropTypes.bool,
  state: PropTypes.object,
}

export default LinkContainer
