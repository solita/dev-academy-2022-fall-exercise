import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder

configure({ adapter: new Adapter() });