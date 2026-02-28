# 카드 OG 이미지 배너 설계

## 배경
카드가 텍스트+이모지만으로 구성되어 허전한 느낌이 있어, 각 프로젝트의 OG 이미지를 카드 상단 배너로 추가한다.

## 설계

### 데이터 (`projects.json`)
- `ogImage` 필드 추가 (선택, string)
- 값이 없으면 기본 이미지(`og-image.png`) 사용

### 카드 레이아웃
- 카드 최상단에 2:1 비율 이미지 배너 영역
- 모든 카드에 이미지 영역이 존재하여 크기 일관성 유지
- 이미지 아래에 기존 구조(아이콘 → 이름 → 설명 → 태그) 유지

### Fallback
- `ogImage` 필드 없음 → `og-image.png` 표시
- 이미지 로드 실패 → `og-image.png`로 교체

### 수정 파일
1. `projects.json` — ogImage URL 추가 (Vinnector, 닉네임 생성기)
2. `app.js` — createActiveCard()에 이미지 렌더링 로직
3. `styles.css` — .card-og-image 스타일
