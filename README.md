# 꿈바온 성경 아케이드

꿈바온 디지털 도서관(kkumbaon.com) 자료로 만드는 성경 게임 모음입니다.
**▶ 바로 하기: https://minohkim.github.io/kkumbaon-arcade/**

웹 하나로 만들어 **① 꿈바온 홈페이지에 붙이고 ② Capacitor로 감싸 iOS/Android 앱**으로 출시하는 것이 목표입니다.

## 지금 들어 있는 게임
| 구분 | 게임 | 내용 |
|---|---|---|
| 아케이드 | 🚢 노아의 방주 | 동물 8종을 암수 한 쌍씩 받아 방주에 태우기 (도레 판화 배경) |
| 아케이드 | 🧱 인물 블록깨기 | 벽돌 뒤 인물 설명을 읽고 누구인지 맞히기 |
| 아케이드 | 🪨 다윗의 물맷돌 | 물매로 정답 인물의 방패 맞히기 |
| 퀴즈 | 🕵️ 누구일까요? / ⭕ OX 스피드 / ⏳ 누가 먼저? | 인물 44명 퀴즈 |

모든 게임에 **쉬운 모드**(보기 2개·시간 제한 없음·하트 무제한)와 **큰 글씨**가 있습니다.

## 실행
빌드 과정이 없는 정적 웹입니다. 폴더에서 아무 정적 서버나 띄우면 됩니다.
```
python3 -m http.server 8000   # → http://localhost:8000
```

## 폴더 구조
```
index.html            앱 화면
css/style.css
js/data.js            인물 데이터 (꿈바온 제1관 인물대백과 기반)
js/app.js             게임 코드 (캔버스, 외부 라이브러리 없음)
assets/art/           그림 (manifest.json → GitHub Actions가 자동으로 받음)
tools/fetch_art.py    위키미디어 커먼즈 퍼블릭 도메인 그림 받기
docs/ROADMAP.md       출시 로드맵
docs/ART_PROMPTS.md   AI 이미지 생성 프롬프트 모음
```

## 그림
`assets/art/manifest.json`을 고쳐 푸시하면 **Fetch public-domain art** 워크플로가 그림을 받아 커밋합니다
(Actions 탭에서 수동 실행도 가능). 출처는 `CREDITS.md`에 자동으로 정리됩니다.

## 데이터 출처
인물 정보: 꿈바온 디지털 도서관 제1관 인물대백과. 공개 배포 전에 꿈바온 측 사용 허락을 받습니다.
