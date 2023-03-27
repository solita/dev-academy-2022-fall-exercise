import React from "react"
import Journey_view from "../src/client/components/Journey_view"
import App from "../src/client/App"
import { shallow } from 'enzyme';

it("renders without crashing", () => {
  const div = document.createElement("div")
  const wrapper = shallow(<App />);
  expect(wrapper.find(Journey_view)).to.have.lengthOf(1);
})
