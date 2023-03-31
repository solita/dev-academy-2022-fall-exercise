import mongoose from "mongoose"

beforeAll(async () => {
  await connect_to_database()
})

afterEach(async () => {
  //Clear all collections
  const collections = mongoose.connection.collections

  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany({})
  }
  // Reset any runtime handlers tests may use.
  jest.restoreAllMocks()
})

afterAll(async () => {
  await disconnect_from_database()
})

export const connect_to_database = async (): Promise<void> => {
  //@ts-ignore mongo uri is provided by jest-mongodb
  await mongoose.connect(globalThis.__MONGO_URI__)
}

export const disconnect_from_database = async (): Promise<void> => {

  await mongoose.connection.close()
}
