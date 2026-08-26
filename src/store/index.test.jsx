import { describe, expect, it } from "vitest"

import configureStore from "./index"
import configureStoreDev from "./configureStore.dev"
import configureStoreProd from "./configureStore.prod"

describe("configureStore", () => {
  it("selects the dev store while import.meta.env.PROD is false (vitest)", () => {
    expect(import.meta.env.PROD).toBe(false)
    expect(configureStore).toBe(configureStoreDev)
    expect(configureStore).not.toBe(configureStoreProd)
  })
})
