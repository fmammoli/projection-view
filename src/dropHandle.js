import Papa from "papaparse";
function dropHandle(DATA_TABLE, axisData) {
  const space = document.querySelector("#hipervolume");

  space.addEventListener("dragover", function (e) {
    e.preventDefault();
    // console.log(e);
    // console.log("dragover");
  });
  space.addEventListener("drop", function (e) {
    e.preventDefault();
    console.log(e);
    console.log("drop");
    if (e.dataTransfer.items) {
      // Use a interface DataTransferItemList para acessar o (s) arquivo (s)
      for (var i = 0; i < e.dataTransfer.items.length; i++) {
        // Se os itens soltos não forem arquivos, rejeite-os
        if (e.dataTransfer.items[i].kind === "file") {
          var file = e.dataTransfer.items[i].getAsFile();
          console.log("... file[" + i + "].name = " + file.name);
          Papa.parse(file, {
            header: true,
            complete: function (results) {
              DATA_TABLE = results.data;
              console.log("finished", results.data);
              var event = new CustomEvent("tableUpdated", {
                detail: {
                  data: DATA_TABLE,
                },
              });
              document.dispatchEvent(event);
            },
            error: function (err) {
              console.log("Error parsing csv: ", err);
            },
          });
        }
      }
    } else {
      // Use a interface DataTransfer para acessar o (s) arquivo (s)
      for (var i = 0; i < e.dataTransfer.files.length; i++) {
        console.log(
          "... file[" + i + "].name = " + e.dataTransfer.files[i].name
        );
        console.log("bom");
      }
    }
  });
}
export default dropHandle;
