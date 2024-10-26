const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // 환경 변수 로드
const indexRouter = require("./routes/index");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
); // 모든 출처에서 오는 요청을 허용
app.use(bodyParser.urlencoded({ extended: false })); // URL 인코딩된 데이터를 파싱
app.use(bodyParser.json()); // req.body를 객체로 인식, 여기서 req.body란 클라이언트에서 보낸 데이터를 의미

app.use("/api", indexRouter); // /api 경로로 들어오는 요청은 indexRouter에서 처리
const mongoURI = process.env.MONGODB_URI_PROD; // 로컬 데이터베이스 주소

mongoose
  .connect(mongoURI, { useNewUrlParser: true }) // 몽고DB 연결, Promise를 반환
  .then(() => console.log("MongoDB Connected ㅇㅅㅇ")) // 연결 성공 시 로그 출력
  .catch((err) => console.log("DB connection fail ㅠㅅㅠ", err)); // 연결 실패 시 로그 출력

app.listen(process.env.PORT || 5000, () => {
  // 서버가 실행될 포트번호 및 서버 접속 성공 시 실행할 콜백함수
  console.log(`Server is running on port ${process.env.PORT} ㅋ_ㅋ`);
});
