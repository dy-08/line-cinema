- **`Project` :** Line Cinema - 로그인 없이 가상결제로 영화 예매가 가능한 웹 서비스
- **`Project duration` :** 2025.10.13 - 10월 31일
- **`Link` :** [배포 사이트](https://dy-08.github.io/line-cinema/)
- **`Stack` :** HTML5, CSS3, Vanilla JS
- **`API` :** TMDB API, Kakao Map API, OpenWeatherMap API
- **`Troubleshooting` :** [트러블 슈팅]()

## 설명

- JavaScript 기초 과정을 마친 뒤 진행한 5인 팀 프로젝트로, 로그인 없이 가상결제로 영화 예매가 가능한 웹 서비스를 구현했습니다.
- 오후 6시부터 9시까지 팀 작업을 진행하며, Git을 활용한 협업과 브랜치 전략, 충돌 해결 등을 실습하며 협업 역량을 키우는 데에 집중했습니다.
- TMDB, Kakao Map, OpenWeatherMap API를 활용해 실제 서비스처럼 동적인 데이터를 연동하며 실무 감각을 키우는 데 집중했습니다.

## 팀원 소개

| 이름   | 1주차 주요 담당                               | GitHub                                                               |
| ------ | --------------------------------------------- | -------------------------------------------------------------------- |
| 권승민 | 전체 일정 관리 및 프로젝트 진행 흐름 조율     | [github.com/kwonseungmin](https://github.com/seungmin-0511) |
| 김승아 | 영화 카드 UI 설계 및 서브 페이지 시안 디자인  | [github.com/kimseungah](https://github.com/seungaaaaa)               |
| 이지유 | 메인 슬라이더 UI 디자인 및 슬라이드 기능 구현 | [github.com/leejiyoo](https://github.com/lee-ji-u)                   |
| 지철원 | TMDB 영화 순위 카드 컴포넌트 UI 제작          | [github.com/jicheolwon](https://github.com/JICHEOLWON)               |
| 권영호 | UX 워크플로우 작성, Git 세팅, 공용 UI 작업    | [github.com/kwonyoungho](https://github.com/dy-08)                   |

## 기획

<!-- https://github.com/user-attachments/assets/fcecc215-c72a-4b5f-8ebd-86a662129197 -->
<!-- https://github.com/user-attachments/assets/0ce0cab4-bb97-4c27-a31d-e2e0a438c7ec -->

| 플로우                                             | UI/UX                                        |
| -------------------------------------------------- | -------------------------------------------- |
| <img width="500" alt="워크플로우 이미지" src="" /> | <img width="500" alt="ui/ux image" src="" /> |

## 주요 기능

- [x] JavaScript fetch를 이용한 간단한 페이지 콘텐츠 동적 로드 구현 (SPA 스타일에 가까운 페이지 전환)
- [x] 비회원(비로그인) 상태에서 영화 목록 API 조회 및 영화 선택
- [x] 영화 상영 날짜, 시간, 장소 선택 기능
- [x] 좌석 선택 기능 (가상 좌석 배치 및 선택 구현)
- [x] 가상계좌를 통한 결제 요청 및 결제 확인 처리 (서버 없이 임의 번호 발급)
- [x] 결제 완료 후 가상계좌 정보 발급 및 안내
- [x] 영화 예매 내역 조회 기능
- [ ] 예매 내역 취소 기능 (추후 검토)
- [ ] 예매 내역 변경 기능 (추후 검토)
- [x] 영화관 위치 표시 (카카오맵 API 활용)
- [x] 선택한 영화관 주변 실시간 날씨 정보 표시 (OpenWeatherMap API 활용)
- [ ] 반응형 UI 지원 (모바일 및 데스크톱)
- [ ] 다크모드 지원

## Git Commit 컨벤션

- init: 초기 세팅
- wip: 진행 중인 작업 (완성되지 않은 기능 또는 임시 커밋)
- setup: 폴더/구조 변경
- feat: 새로운 기능 추가
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 포맷팅, 스타일 변경 (코드 로직 변경 없음)
- refactor: 코드 리팩토링
- test: 테스트 코드 추가/수정 (프로덕션 코드 변경 없음)
- chore: 빌드, 패키지 매니저 설정 등 (코드 변경 없음)
- design: UI 디자인 변경 (CSS 등)
- comment: 주석 추가/변경
- rename: 파일/폴더명 변경
- remove: 파일/폴더 삭제

## 환경 설정

API 키 등 민감 정보는 `config.js` 또는 환경 변수 파일에 별도로 저장하며,  
이 파일은 버전 관리에서 제외됩니다.

## 프로젝트 폴더 구조

```
line-cinema/
├── 📄 index.html        # 메인 진입점 HTML
├── 📄 README.md         # 프로젝트 설명 및 가이드
├── 📄 .gitignore        # Git 관리 제외 파일 설정

├── 📂 src/              # 주요 소스 코드
│  ├── 📂 html/          # 개별 페이지 HTML 파일
│  ├── 📂 css/           # 페이지별 또는 모듈 CSS 파일
│  ├── 📂 js/            # 기능별 JavaScript 파일
│  │  ├── 📂 api/        # API 호출 및 연동 관련 코드
│  │  ├── 📂 config/     # 환경 설정 및 API 키 관리
│  │  │  ├── 📄 config.js        # 실제 API 키 및 설정 (gitignore 처리)
│  │  │  └── 📄 config.sample.js # 샘플 설정 파일 (키 없음)
│  │  └── 📂 pages/      # 페이지별 JS 기능 분리 모듈

├── 📂 public/           # 정적 자원 (빌드 없이 바로 사용)
│  ├── 📂 css/           # reset.css, global.css 등 공통 스타일
│  ├── 📂 fonts/         # 공통 폰트 파일 (woff, ttf 등)
│  ├── 📂 json/          # 정적 데이터 (영화관 위치, 더미 데이터 등)
│  └── 📂 img/           # 이미지 파일
│     ├── 📂 main/       # 메인 페이지 관련 이미지
│     ├── 📂 movie/      # 영화 포스터, 썸네일 등
│     ├── 📂 ui/         # UI 관련 이미지 및 아이콘 (close.svg, play.png 등)
│     └── 📂 etc/        # 기타 이미지 파일
```
