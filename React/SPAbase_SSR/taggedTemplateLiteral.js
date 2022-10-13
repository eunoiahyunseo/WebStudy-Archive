const name = "hyunseo";
const location = "daejeon";

const tag = (strs, firstExpr, secondExpr) =>
  console.log(strs, firstExpr, secondExpr);

// [ '나는 ', '에 살고있는 ', '이야' ] daejeon hyunseo
tag`나는 ${location}에 살고있는 ${name}이야`;

const styled = (strs, ...exprs) => [strs, exprs];

const result = styled`background-color: ${({ primary }) =>
  primary ? "white" : primaryColor}padding: 1rem;
`;

console.log(result);
