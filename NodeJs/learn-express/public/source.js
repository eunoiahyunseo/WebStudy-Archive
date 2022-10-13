const func = async () => {
  try {
    const { data } = await axios.get("/user");
    const userList = document.getElementById("userData");
    data.map((data, index) => {
      const myDiv = document.createElement("div");
      const myDiv2 = document.createElement("div");
      // myDiv2.style.textAlign("center");
      // myDiv2.style.fontWeight = 100;
      const mySpan1 = document.createElement("span");
      mySpan1.textContent = `User name -> ${data.name}`;
      const mySpan2 = document.createElement("span");
      mySpan2.textContent = `User age -> ${data.age}`;

      const mySpan3 = document.createElement("span");
      mySpan3.textContent = `User ${index + 1}`;
      myDiv2.style.textAlign = "center";
      myDiv2.style.fontWeight = 1000;

      myDiv2.appendChild(mySpan3);
      myDiv.appendChild(myDiv2);
      myDiv.appendChild(mySpan1);
      myDiv.appendChild(document.createElement("br"));
      myDiv.appendChild(mySpan2);
      userList.appendChild(myDiv);
      userList.appendChild(document.createElement("hr"));
    });
  } catch (err) {
    console.error(err);
  }
};

window.onload = func;

document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = e.target.username.value;
  const age = e.target.userage.value;

  if (!name) {
    return alert("이름을 입력하세요");
  }

  if (!age) {
    return alert("나이를 입력하세요");
  }

  try {
    if (await axios.post("/user", { name, age })) {
      e.target.username.value = "";
      e.target.userage.value = "";
      location.reload();
    }
  } catch (err) {
    console.error(err);
  }
});
