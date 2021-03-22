import spaceSection from "./spaceSection";
import finalDataTable from "./finalDataTable";
import axisSelection from "./axisSelection";
import axisDataComp from "./axisData";
import dropHandle from "./dropHandle";
import attr2 from "../data/pls_attr2.json";

function init(data) {
  let DATA_TABLE = finalDataTable(data);
  let axisData = axisDataComp();
  let keys = Object.keys(DATA_TABLE[0]);

  axisData.update({ x: keys[0], y: keys[1], z: keys[2], xf: 1, yf: 1, zf: 1 });

  let drop = dropHandle(DATA_TABLE, axisData);
  let axis = axisSelection(DATA_TABLE, axisData);
  let space = spaceSection(DATA_TABLE, axisData);
  space.start(DATA_TABLE, axisData);
  console.log(space);
  document.addEventListener("tableUpdated", function (e) {
    init(e.detail.data);
    DATA_TABLE = finalDataTable(e.detail.data);
    axisData = axisDataComp();
    keys = Object.keys(DATA_TABLE[0]);

    axisData.update({
      x: keys[0],
      y: keys[1],
      z: keys[2],
      xf: 1,
      yf: 1,
      zf: 1,
    });

    drop = dropHandle(DATA_TABLE, axisData);
    axis = axisSelection(DATA_TABLE, axisData);

    space.clear();
    space.start(DATA_TABLE, axisData);
  });
}
init(attr2);
