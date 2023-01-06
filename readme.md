# 난폭운전 예방 시스템

## Description

난폭운전을 예방하기 위한 시스템으로, 웨어러블 기기를 이용해 사용자의 생체 데이터를 추출하여 운전자의 분노 및 스트레스 여부를 확인한다.

만약 운전자가 스트레스를 받고 있거나 분노하고 있다고 확인될 경우, 난폭운전이 발생하지 않도록 운전자의 스트레스 수치를 낮추도록 유도하고, 난폭운전 발생시 경고하는 시스템을 설계하였다.

## Prerequisite

- Arduino IDE
- express module
- http module
- cors module
- fs module
- path module
- serialport module
- @serialport/parser-readline module
- ejs module
- socket.io module
- v8 module

## Files

1. index.js: node.js를 활용한 웹 서버 구현
2. views\audio: 스트레스 완화를 위한 클래식 음악 파일 폴더
3. views\images: 상황 알림을 위한 이모티콘 이미지
4. views\index.html: 웹 서비스 구현을 위한 HTML 코드

## 동작원리

### 스트레스 인식

![운전자 스트레스 감지](/docs/images/stress_detector.png)

1. 데이터 수집 : 갤럭시 워치를 이용한 심박데이터, 운전자가 사용하는 욕설
2. 데이터 분석 : RMSSD, SDNN, Teachable Machine
3. 완화 시스템 : 단말기의 스피커를 통한 클래식 음악 재생

### 난폭운전 감지

![난폭운전 감지기](/docs/images/RD_Detector.png)

1. 데이터 수집: 아두이노와 자이로 센서를 이용해 수집
2. 데이터 분석: 순간 속력 확인
3. 경고 시스템: 알림 및 기록

## 한계점 및 추후과제

- 각 차량의 브레이크나 가속 페달의 장력이 조금씩 다름
  - 이로 인해 차량마다 난폭 운전 여부가 다르게 나타날 수 있음
- 본 프로젝트의 경우 자이로센서 데이터를 컴퓨터와 유선으로 주고받기 때문에 자유로운 사용이 어려움
  - 블루투스를 이용한 무선 데이터 송수신이 가능하도록 개발 시 편의성 증가 예상
- 데이터 기록 관련 기능 구현 실패
  - 난폭운전 위치 마킹과 함께 추후 구현 목표
  - 지도 API와 스마트워치의 GPS를 이용해 난폭운전 발생 장소를 기록하는 기능 구현시 효과적인 난폭운전 예방 가능
