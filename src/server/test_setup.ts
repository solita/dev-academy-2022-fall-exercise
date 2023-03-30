import server from '../__mocks__/server'

beforeAll(() => {
  // Enable the mocking in tests.
})

afterEach(() => {
  // Reset any runtime handlers tests may use.
  jest.restoreAllMocks()
})

afterAll(() => {
  // Clean up once the tests are done.
})