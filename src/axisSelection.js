function axisSelection(DATA_TABLE, axisData) {
  const xSelect = document.querySelector("#x-axis-settings");
  const ySelect = document.querySelector("#y-axis-settings");
  const zSelect = document.querySelector("#z-axis-settings");

  const xFactor = document.querySelector("#x-axis-factor");
  const yFactor = document.querySelector("#y-axis-factor");
  const zFactor = document.querySelector("#z-axis-factor");

  const count = document.querySelector("#count");

  const fragmentX = document.createDocumentFragment();
  const fragmentY = document.createDocumentFragment();
  const fragmentZ = document.createDocumentFragment();

  const axisForm = document.querySelector("#axis-form");

  axisForm.addEventListener("submit", onSubmit);

  document.addEventListener("dataUpdated", function (e) {
    console.log("reinit axis");
    init();
  });

  init();

  function init() {
    console.log("init selecition");
    count.innerHTML = DATA_TABLE.length;
    Object.keys(DATA_TABLE[0]).forEach((e) => {
      const optionX = document.createElement("option");
      const optionY = document.createElement("option");
      const optionZ = document.createElement("option");
      optionX.value = e;
      optionX.textContent = e;

      optionY.value = e;
      optionY.textContent = e;

      optionZ.value = e;
      optionZ.textContent = e;

      fragmentX.appendChild(optionX);
      fragmentY.appendChild(optionY);
      fragmentZ.appendChild(optionZ);

      xSelect.appendChild(fragmentX);
      ySelect.appendChild(fragmentY);
      zSelect.appendChild(fragmentZ);

      xSelect.children[0].selected = true;
      ySelect.children[0].selected = true;
      zSelect.children[0].selected = true;

      xFactor.value = 1;
      yFactor.value = 1;
      zFactor.value = 1;
    });
  }

  function onSubmit(e) {
    e.preventDefault();

    axisData.update({
      x: xSelect.value,
      y: ySelect.value,
      z: zSelect.value,
      xf: xFactor.value,
      yf: yFactor.value,
      zf: zFactor.value,
    });
  }
}
export default axisSelection;
