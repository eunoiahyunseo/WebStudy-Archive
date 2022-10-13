import { createStore } from "redux";

// 별도의 라이브러리를 사용하지 않기 때문에 DOM객체를 직접 수정해 줘야 한다.
const divToggle = document.querySelector(".toggle");
const counter = document.querySelector("h1");
const btnIncrease = document.querySelector("#increase");
const btnDecrease = document.querySelector("#decrease");

// 액션의 이름을 정해주어야 한다.
// 보통 액션 이름은 문자열 형태로, 주로 대문자로 작성하며 액션 이름은 고유해야 한다.

// < action >
const TOGGLE_SWITCH = "TOGGLE_SWITCH";
const INCREASE = "INCREASE";
const DECREASE = "DECREASE";

// 액션 이름을 활용하여 액션 객체를 만드는 액션 생성 함수를 만들어야 한다.
// 액션 객체는 type값을 반드시 가지고 있어야 하며, 그 외에 추후 상태를 업데이트할 때 참고하고
// 싶은 값은 내 맘대로 지정할 수 있다.

const toggleSwitch = () => ({
  type: TOGGLE_SWITCH,
});

const increase = (difference) => ({
  type: INCREASE,
  difference,
});

const decrease = () => ({
  type: DECREASE,
});

// 초깃값 설정
const initialState = {
  toggle: false,
  counter: 0,
};

// 리듀서 함수 정의 -> default parameter
function reducer(state = initialState, action) {
  // action.type에 따라 다른 작업을 처리함
  switch (action.type) {
    case TOGGLE_SWITCH:
      return {
        ...state, // immer -> 불변성을 유지해 준다.
        toggle: !state.toggle,
      };
    case INCREASE:
      return {
        ...state,
        counter: state.counter + action.difference,
      };
    case DECREASE:
      return {
        ...state,
        counter: state.counter - 1,
      };
    default:
      return state;
  }
}

// 스토어를 생성
const store = createStore(reducer);

// render함수 만들기
const render = () => {
  const state = store.getState();
  //토글 처리
  if (state.toggle) {
    divToggle.classList.add("active");
  } else {
    divToggle.classList.remove("active");
  }
  // 카운터 처리
  counter.innerText = state.counter;
};

render();

store.subscribe(render);

divToggle.onclick = () => {
  store.dispatch(toggleSwitch());
};

btnIncrease.onclick = () => {
  store.dispatch(increase(1));
};

btnDecrease.onclick = () => {
  store.dispatch(decrease());
};


// 리덕스 규칙

// 단일 스토어
// 하나의 애플리케이션 안에는 하나의 스토어만 들어가게 해야 한다.

// 읽기 전용 상태
// 상태를 업데이트 하기 위해서는 기존의 객체를 건드리지 않고 새로운 객체를 생성해 주어야 한다.
// 리덕스에서 불변성을 유지해야 하는 이유는 내부적으로 데이터가 변경되는 것을 감지하기 위해
// 얕은 비교 검사를 하기 때문이다.
