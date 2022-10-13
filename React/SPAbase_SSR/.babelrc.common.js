const presets = ["@babel/preset-react"];
// "babel-plugin-styled-components" -> 서버 사이드에서 생성된
// 고유한 클래스이름이 클라이언트 사이드에서 불일치되는 일을 막아줍니다.
const plugins = ["babel-plugin-styled-components"];

module.exports = { presets, plugins };
