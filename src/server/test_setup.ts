import mongoose from "mongoose"

beforeAll(async () => {
  await connect_to_database()
})

afterEach(() => {
  // Reset any runtime handlers tests may use.
  jest.restoreAllMocks()
})

afterAll(async () => {
  await disconnect_from_database()
})

export const connect_to_database = async (): Promise<void> => {
  console.log("Connecting to mongoose")
  //@ts-ignore mongo uri is provided by jest-mongodb
  await mongoose.connect(globalThis.__MONGO_URI__)
}

export const disconnect_from_database = async (): Promise<void> => {
  console.log("Closing mongoose connection")
  await mongoose.connection.close()
}
