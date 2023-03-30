import server from '../__mocks__/server'

beforeAll(() => {
  // Enable the mocking in tests.
  server.listen()
})

afterEach(() => {
  // Reset any runtime handlers tests may use.
  jest.restoreAllMocks()
  server.resetHandlers()
})

afterAll(() => {
  // Clean up once the tests are done.
  server.close()
})