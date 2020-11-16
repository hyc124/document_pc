let watermark = {};

let setWatermark = (str) => {
    let id = "1.23452384164.123412415";

    if (document.getElementById(id) !== null) {
        document
            .getElementById("maincontent")
            .removeChild(document.getElementById(id));
    }
    let can = document.createElement("canvas");
    can.width = 215;
    can.height = 165;
    let cans = can.getContext("2d");
    cans.rotate((-20 * Math.PI) / 180);
    cans.font = "16px Vedana";
    cans.fillStyle = "rgba(0, 0, 0, 0.10)";
    cans.textAlign = "left";
    cans.textBaseline = "Middle";
    cans.fillText(str, can.width / 30, can.height);

    let div = document.createElement("div");
    div.id = id;
    div.style.top = "-50px";
    div.style.left = "0";
    div.style.pointerEvents = "none";
    div.style.position = "absolute";
    div.style.zIndex = "4";
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.background =
        "url(" + can.toDataURL("image/png") + ") left top repeat";
    if (document.getElementById("maincontent")) {
        document.getElementById("maincontent").appendChild(div);
    }
    return id;
};

// 该方法只允许调用一次
watermark.set = (str) => {
    // setTimeout(() => {
    setWatermark(str);
    // let id = setWatermark(str);
    // setInterval(() => {
    //   if (document.getElementById(id) === null) {
    //     id = setWatermark(str);
    //   }
    // }, 2000);
    window.onresize = () => {
        setWatermark(str);
    };
    // }, 350);
};

export default watermark;
