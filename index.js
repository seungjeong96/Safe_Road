const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();

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
  res.render("index.html");
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

// 웹소켓 연결 시작
// 초기 path는 /watch4로 설정함
const socketWatch4 = io.of("/watch4");
socketWatch4.on("connection", (socket) => {
  console.log(`watch4 웹 소켓 연결됨`);
  socket.on("hrate", (msg) => {
    console.log(msg);
    // 로직 구현
  });

  socket.on("acc", (msg) => {
    console.log(msg);
  });
  socket.on("disconnect", () => {
    console.log("watch4 웹 소켓 연결 끊김");
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

// 심박수 웹페이지에 표시
