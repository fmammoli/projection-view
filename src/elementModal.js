// import gbifService from "./gbifService";

function elementModal() {
  //   const gbif = gbifService();
  let dataKey, dataValue;
  const itemTemplate = `<li>${dataKey} : <span>${dataValue}</span></li>`;

  const closeModalBtn = document.querySelector(".close");
  const modalBg = document.querySelector(".modal-bg");

  const modal = document.querySelector("#modal");

  let listBase = document.querySelector("#attr-list");

  //   const gbifContainer = document.querySelector(".gbif-container");

  let currentElement;

  function toggleModal() {
    modalBg.classList.toggle("bg-active");
    modal.classList.toggle("modal-active");
  }
  //modalBg.addEventListener("click", close);

  function close(e) {
    modalBg.classList.remove("bg-active");
    modal.classList.remove("modal-active");
    listBase.innerHTML = "";
    let closedEvent = new CustomEvent("closed", {
      detail: currentElement,
    });
    // for (let index = 0; index < gbifContainer.children.length; index++) {
    //   gbifContainer.children[index].firstElementChild.src = null;
    // }
    modal.dispatchEvent(closedEvent);

    //currentElement = null;
  }

  closeModalBtn.addEventListener("click", function (e) {
    console.log("fecha");
    close(e);
  });

  document.querySelector("#kill-btn").addEventListener("click", (a) => {
    close();

    let deleteEvent = new CustomEvent("deleteElement", {
      detail: currentElement,
    });
    modal.dispatchEvent(deleteEvent);
    //currentElement = null;
  });

  function open(element) {
    currentElement = element;
    currentElement.userData.selected = true;
    //element.material.emissive.setHex(0xff0000);
    toggleModal();
    //modalDataX.innerHTML = element.userData.position.x;

    console.log(modal);
    console.log(element);
    Object.entries(element.userData.plsData).forEach((e) => {
      const item = `<li>${e[0]} : <span>${e[1]}</span></li>`;
      listBase.insertAdjacentHTML("beforeend", item);
    });

    // modal.querySelector("#species").innerHTML =
    //   element.userData.usageData?.Species;
    // modal.querySelector("#usage").innerHTML = buildUsage(
    //   element.userData.usageData["Ecosystem Service"]
    // );
    // modal.querySelector("#n").innerHTML =
    //   element.userData.usageData["n AmazonFACE 8 plots"]["Stem_FACE"];
    // modal.querySelector("#obs").innerHTML = element.userData.usageData?.Obs;
    // modal.querySelector("#source").innerHTML =
    //   element.userData.usageData?.Source;
    // if (element.userData.usageData !== undefined) {
    //   modal.querySelector(
    //     "#gbif-link"
    //   ).href = `https://www.gbif.org/occurrence/search?scientificName=${element.userData.usageData?.Species}`;
    //   modal.querySelector("#gbif-link").innerHTML = "Click Here!";
    // }

    // function buildUsage(usages) {
    //   if (!usage) return;
    //   let usageString = [];
    //   console.log(usages);
    //   if (usages.Food === "X") {
    //     usageString.push("Food");
    //   }
    //   if (usages.Medicinal === "X") {
    //     usageString.push("Medicinal");
    //   }
    //   if (usages["Raw Material"] === "X") {
    //     usageString.push("Raw Material");
    //   }
    //   if (usageString.length === 0) return "none";
    //   return usageString.join(", ");
    // }
    // console.log(gbif);
    // if (element.userData.usageData !== undefined) {
    //   gbif.request(element.userData.usageData.Species).then((media) => {
    //     console.log(media);
    //     document.querySelector(".gbif-img").src = media[0].src;
    //     console.log(gbifContainer.children);
    //     for (let index = 0; index < gbifContainer.children.length; index++) {
    //       gbifContainer.children[index].firstElementChild.src =
    //         media[index].src;
    //     }
    //   });
    // }
  }

  return { modal, open, close };
}
export default elementModal;
