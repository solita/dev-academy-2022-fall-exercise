const app = require("../../index")
import superTest from "supertest"

//Testing the routes from an external perspective
describe("App Routes", () => {
  it("Should return 200 and index.html", async () => {
    const response = await superTest(app).get("/")
    expect(response.status).toBe(200)
    //expect the index.html file to be returned
    expect(response.text).toContain("<!DOCTYPE html>")
  })
})
