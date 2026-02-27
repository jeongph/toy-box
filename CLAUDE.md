# toy-box

## 개요
사이드 프로젝트 쇼케이스 웹사이트. 순수 HTML/CSS/JavaScript로 만든 정적 사이트로, GitHub Pages에 배포된다.

- **URL**: https://toy-box.jeongph.dev
- **저장소**: https://github.com/jeongph/toy-box

## 기술 스택
- Vanilla JavaScript (ES2020+, async IIFE 패턴)
- CSS3 (커스텀 프로퍼티, Grid, FLIP 애니메이션)
- HTML5 (시맨틱 마크업)
- 빌드 도구/패키지 매니저 없음 (zero-dependency)
- 폰트: Fredoka (디스플레이), Nunito (본문) — Google Fonts CDN

## 프로젝트 구조
```
├── index.html          # HTML 구조 + OG/Twitter 메타태그
├── styles.css          # 스타일, 테마(라이트/다크), 애니메이션
├── app.js              # 앱 로직 (데이터 로드, 카드 렌더링, 정렬, 테마)
├── projects.json       # 프로젝트 데이터 (active / graveyard)
├── favicon.png         # 파비콘
├── og-image.png        # OG 미리보기 이미지
├── CNAME               # 커스텀 도메인 설정
└── .github/workflows/
    └── deploy.yml      # GitHub Pages 자동 배포
```

## 핵심 구조

### app.js 섹션
- **Data**: `projects.json` fetch
- **Safe DOM helpers**: `el()` 유틸 함수
- **Card Rendering**: active 카드 / graveyard 카드 생성
- **Sort**: 기본/이름순(ko locale)/랜덤 + FLIP 애니메이션
- **Graveyard Toggle**: 활성/묘지 모드 전환
- **Dark Mode**: localStorage 저장, 시스템 설정 감지

### styles.css 테마
- `:root` — 라이트 테마 변수
- `[data-theme="dark"]` — 다크 테마 변수
- `body.graveyard-mode` — 묘지 모드 스타일
- 카드 색상: 8가지 시맨틱 컬러 (red, teal, yellow, green, purple, pink, blue, orange)

### projects.json 스키마
```json
{
  "active": [{
    "name": "string",
    "description": "string",
    "url": "string",
    "tags": ["string"],
    "platform": "Web | PWA | App",
    "icon": "emoji",
    "color": "#XXXXXX"
  }],
  "graveyard": [{
    "name": "string",
    "description": "string",
    "url": "string (optional)",
    "tags": ["string"],
    "icon": "emoji",
    "color": "#XXXXXX",
    "period": "string",
    "epitaph": "string"
  }]
}
```

## 개발 워크플로우

### 로컬 확인
빌드 과정 없이 정적 파일 서빙으로 확인한다.
```bash
# 아무 정적 서버 사용 가능
npx serve .
# 또는
python3 -m http.server 8000
```

### 배포
main 브랜치에 push하면 GitHub Actions가 자동으로 GitHub Pages에 배포한다. 별도 빌드 스텝 없이 파일이 그대로 배포된다.

## 코드 컨벤션
- JavaScript: async IIFE 래핑, `el()` 헬퍼로 DOM 생성, `// --- Section ---` 주석 구분
- CSS: 커스텀 프로퍼티 기반 테마, `color-mix()` 활용
- 반응형 브레이크포인트: 640px
