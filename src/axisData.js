function axisData() {
  const current = { x: null, y: null, z: null, xf: 1, yf: 1, zf: 1 };

  function update({ x = x, y = y, z = z, xf = xf, yf = yf, zf = zf }) {
    console.log(xf);
    current.x = x;
    current.y = y;
    current.z = z;
    current.xf = xf;
    current.yf = yf;
    current.zf = zf;
    var event = new CustomEvent("axisUpdated", {
      detail: {
        x: current.x,
        y: current.y,
        z: current.z,
        xf: current.xf,
        yf: current.yf,
        zf: current.zf,
      },
    });
    document.dispatchEvent(event);
  }

  return { current, update };
}
export default axisData;
