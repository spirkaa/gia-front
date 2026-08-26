import { afterEach, describe, expect, it, vi } from "vitest"
import {
  DATASOURCES_FAILURE,
  DATASOURCES_REQUEST,
  DATASOURCES_SUCCESS,
} from "../main/actions"
import { CALL_API } from "../middleware/api"
import Schemas from "../middleware/schemas"

import configureStore from "./configureStore.prod"

const drfPage = {
  count: 2,
  next: null,
  previous: null,
  results: [
    { id: 1, name: "Минпросвещения", url: "https://example.ru" },
    { id: 2, name: "Демоцентр", url: "https://demo.example.ru" },
  ],
}

describe("configureStore (prod)", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("creates a working store", () => {
    const store = configureStore()
    store.dispatch({ type: "PING" })
    expect(store.getState().auth.isAuthenticated).toBe(false)
  })

  it("runs thunks and performs the CALL_API fetch, normalizing the response", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(drfPage) }),
    )
    vi.stubGlobal("fetch", fetchMock)

    const store = configureStore()
    await store.dispatch((dispatch) =>
      dispatch({
        [CALL_API]: {
          types: [DATASOURCES_REQUEST, DATASOURCES_SUCCESS, DATASOURCES_FAILURE],
          endpoint: "datasource/",
          schema: Schemas.DATASOURCE_PAGE,
          data: {},
          method: "GET",
        },
      }),
    )

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, request] = fetchMock.mock.calls[0]
    expect(url).toBe(`http://${window.location.hostname}:8000/api/v1/datasource/`)
    expect(request.method).toBe("GET")

    const state = store.getState()
    expect(state.entities.dataSourcePage["1"].results).toEqual([1, 2])
    expect(state.entities.datasource[1].name).toBe("Минпросвещения")
    expect(state.entities.datasource[2].name).toBe("Демоцентр")
  })
})
