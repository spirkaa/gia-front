import { describe, expect, it } from "vitest"
import { makeState } from "../test/fixtures"
import {
  countSelector,
  placesActivePageSelector,
  placesFilterSelector,
  placesOnPageSelector,
} from "./selectors"

const places = {
  p1: { id: "p1", code: "123", name: "Школа 1", addr: "ул. X, 1", ate: "t1" },
  p2: { id: "p2", code: "456", name: "Школа 2", addr: "ул. Y, 2", ate: "t2" },
}
const territories = {
  t1: { id: "t1", name: "Центр" },
  t2: { id: "t2", name: "Север" },
}
const placesPage = {
  1: { count: 2, results: ["p1", "p2"] },
  2: { count: 2, results: ["p2"] },
}

const listState = makeState({
  entities: { placesPage, place: places, territory: territories },
})

describe("countSelector", () => {
  it("reads the count from page 1", () => {
    expect(countSelector(listState)).toBe(2)
  })

  it("is null when the page is not loaded yet", () => {
    expect(countSelector(makeState())).toBeNull()
  })
})

describe("placesOnPageSelector", () => {
  it("maps page ids to places with the territory denormalized", () => {
    expect(placesOnPageSelector(listState)).toEqual([
      { ...places.p1, ate: territories.t1 },
      { ...places.p2, ate: territories.t2 },
    ])
  })

  it("follows the active page number", () => {
    const state = makeState({
      entities: { placesPage, place: places, territory: territories },
      pagination: { ...makeState().pagination, placesActivePage: 2 },
    })
    expect(placesOnPageSelector(state)).toEqual([{ ...places.p2, ate: territories.t2 }])
  })

  it("returns an empty list when the active page is not loaded", () => {
    const state = makeState({
      entities: { placesPage, place: places, territory: territories },
      pagination: { ...makeState().pagination, placesActivePage: 4 },
    })
    expect(placesOnPageSelector(state)).toEqual([])
  })
})

describe("pass-through selectors", () => {
  it("reads the active page and the filter from the root state", () => {
    const state = makeState({
      filters: { ...makeState().filters, placesFilter: { search: "школа" } },
      pagination: { ...makeState().pagination, placesActivePage: 3 },
    })
    expect(placesActivePageSelector(state)).toBe(3)
    expect(placesFilterSelector(state)).toEqual({ search: "школа" })
  })
})
