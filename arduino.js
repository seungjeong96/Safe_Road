const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const port = new SerialPort({ path: "COM7", baudRate: 115200 });

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
function readGyro(data) {
  const a = "-1.00,-1.00,-1.00";
  const b = "1.00,-1.00,1.00";
  const regex = /-?\d{1,3}.\d{2},-?\d{1,3}.\d{2},-?\d{1,3}.\d{2}/;
  const dataString = data.toString();

  // console.log(dataString, regex.test(dataString));
  if (regex.test(dataString)) {
    let [axisX, axisY, axisZ] = dataString
      .split(",")
      .map((item) => parseFloat(item));
    console.log(axisX, axisY, axisZ);
  }
}

parser.on("data", readGyro);
