const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // 환경 변수 로드
const indexRouter = require("./routes/index");

const port = process.env.PORT;
const mongoURI = process.env.MONGODB_URI_PROD;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to ", mongoURI, " MongoDB ㅇㅅㅇ");
  })
  .catch((err) => {
    console.log("DB connection fail ㅠㅅㅠ", err);
  });

// 테스트용 라우트
app.get("/api/test", (req, res) => {
  res.json({
    status: "success",
    message: "서버가 정상적으로 동작중입니다!",
    timestamp: new Date().toISOString(),
  });
});

app.use(
  cors({
    origin: "*", // 모든 출처 허용 옵션. true 를 써도 된다.
  })
);
app.use(bodyParser.urlencoded({ extended: false })); // URL 인코딩된 데이터를 파싱
app.use(bodyParser.json()); // req.body를 객체로 인식, 여기서 req.body란 클라이언트에서 보낸 데이터를 의미

app.use("/api", indexRouter); // /api 경로로 들어오는 요청은 indexRouter에서 처리

app.listen(port, () => {
  // 서버가 실행될 포트번호 및 서버 접속 성공 시 실행할 콜백함수
  console.log(`Server is running on port ${port} ㅋ_ㅋ`);
});
