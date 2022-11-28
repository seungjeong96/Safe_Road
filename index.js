const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const fs = require("fs");
const path = require("path");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const portName = "COM8";

const arduinoSerialPort = new SerialPort({
  path: portName,
  baudRate: 115200,
});

const parser = new ReadlineParser();
arduinoSerialPort.pipe(parser);

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
app.use(express.static("public"));

// css 적용
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

// html 파일 렌더링
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// 웹소켓 설정
const server = http.createServer(app);
const { Server } = require("socket.io");

// 웹소켓 cors 방지적용
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.emit("result", "${socket.id}로 연결되었습니다.");
  parser.on("data", (data) => {
    console.log(data);
    socket.emit("data", data);
  });

  socket.on("message", (msg) => {
    //받고
    console.log("클라이언트의 요청이 있습니다.");
    console.log(msg);
    socket.emit("result", `수신된 메세지는 "${msg}" 입니다.`);
  });
});
// 웹소켓 연결 시작
// 초기 path는 /watch4로 설정함

// const socketWatch4 = io.of("/watch4");
// socketWatch4.on("connection", (socket) => {
//   console.log(`watch4 웹 소켓 연결됨`);
//   socket.on("hrate", (msg) => {
//     console.log(msg);
//     webpage.emit("hrate", msg);
//     // 로직 구현
//   });

//   const webpage = io.of("/webpage");
//   webpage.on("connect", (socket) => {
//     console.log("웹페이지 웹소켓 연결됨");
//   });

//   /* 가속도
//   socket.on("acc", (msg) => {
//     console.log(msg);
//   });
//   */

//   socket.on("disconnect", () => {
//     console.log("watch4 웹 소켓 연결 끊김");
//   });
// });

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

// 심박수 웹페이지에 표시

arduinoSerialPort.on("open", () => {
  console.log("Serial Port Open");
});

arduinoSerialPort.on("data", (data) => {
  const accData = data.toString();
  // const parsedData = JSON.parse(accData);
  fs.writeFileSync("first.json", parsedData);
  //const dataBuffer = fs.readFileSync("first.json");
  console.log(dataBuffer.toString());
});
// //가속도 데이터 get
