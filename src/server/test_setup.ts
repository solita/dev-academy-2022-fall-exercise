import mongoose from "mongoose"

beforeAll((done) => {
  // Enable the mocking in tests.
  //@ts-ignore - This is a global variable set by jest testing environment.
  mongoose.connect(globalThis.__MONGO_URI__)
  done()
})

afterEach(() => {
  // Reset any runtime handlers tests may use.
  jest.restoreAllMocks()
})

afterAll((done) => {
  mongoose.connection.close()
  done()
})
