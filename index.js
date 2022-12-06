const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const fs = require("fs");
const path = require("path");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const portName = "COM7";
const ejs = require("ejs");

const arduinoSerialPort = new SerialPort({
  path: portName,
  baudRate: 115200,
});

// 시리얼 포트 에러처리
arduinoSerialPort.on("error", function (err) {
  console.log(err);
});

const parser = arduinoSerialPort.pipe(
  new ReadlineParser({ delimiter: "\r\n" })
);

// cors 방지를 위한 미들웨어 적용
app.use(cors());
// HTTP 데이터를 받을때 패킷의 용량제한 500mb까지 허용
app.use(
  express.json({
    limit: "500mb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "500mb" }));

// static 파일 public으로
app.use(express.static("views"));

// css 적용
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

function readGyro(data) {
  //const a = "-1.00,-1.00,-1.00";
  //const b = "1.00,-1.00,1.00";
  const regex = /-?\d{1,3}.\d{2},-?\d{1,3}.\d{2},-?\d{1,3}.\d{2}/;
  const dataString = data.toString();

  //console.log(dataString, regex.test(dataString));
  if (regex.test(dataString)) {
    let [axisX, axisY, axisZ] = dataString
      .split(",")
      .map((item) => parseFloat(item));
    const GyroData = {
      X: axisX,
      Y: axisY,
      Z: axisZ,
    };
    //console.log(axisX, axisY, axisZ);
    const stringJson = JSON.stringify(GyroData);
    fs.writeFileSync("./views/GyroData.json", stringJson);
  }
}

parser.on("data", readGyro);

// html 파일 렌더링
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// 웹소켓 설정
const server = http.createServer(app);
const { Server } = require("socket.io");
const { serialize } = require("v8");

// 웹소켓 cors 방지적용
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// 웹소켓 연결 시작
// 초기 path는 /watch4로 설정함

// 데이터 저장 리스트
hrlist = [];

//스트레스 분석 함수
function analysis_stress(hrlist) {
  stress = 0;

  webpage.emit("stress_level", stress);
}

const socketWatch4 = io.of("/watch4");

socketWatch4.on("connect", (socket) => {
  console.log("스마트워치 웹소켓 연결됨");
  socket.on("hrate", (msg) => {
    //console.log(msg);
    //webpage.emit("hrate", msg);
    if (msg != 0) {
      if (hrlist.length < 36) {
        hrlist.push(msg);
      } else {
        analysis_stress(hrlist);
        hlist.length = 0; //배열 비우기
      }
    }
  });
});

socketWatch4.on("disconnect", () => {
  console.log("watch4 웹 소켓 연결 끊김");
});

const webpage = io.of("/webpage");
webpage.on("connect", (socket) => {
  console.log("웹페이지 웹소켓 연결됨");
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

// 심박수 웹페이지에 표시
