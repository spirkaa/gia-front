import { afterEach, describe, expect, it, vi } from "vitest"

import configureStore from "./configureStore.dev"

describe("configureStore (dev)", () => {
  afterEach(() => {
    delete window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  })

  it("creates a working store when the devtools extension is absent", () => {
    const store = configureStore()
    store.dispatch({ type: "PING" })
    expect(store.getState().auth.isAuthenticated).toBe(false)
  })

  it("uses __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ when it is present", () => {
    const devtoolsCompose = vi.fn(() => (f) => f)
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = devtoolsCompose
    const store = configureStore()
    expect(devtoolsCompose).toHaveBeenCalledTimes(1)
    store.dispatch({ type: "PING" })
    expect(store.getState().entities).toBeDefined()
  })
})
