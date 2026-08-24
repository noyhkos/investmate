# 배포 메모

## 함수 리전은 Supabase와 같은 도시여야 한다

`vercel.json`이 서버 함수를 `icn1`(서울)에 고정한다. 기본값은 `iad1`(미국 동부)인데,
Supabase 프로젝트가 서울에 있으므로 쿼리마다 태평양을 왕복하게 된다.

로그인 사용자는 한 페이지에 세션 확인·관심종목·설정 조회가 들어가므로 그 왕복이
여러 번 쌓인다. 게스트는 Supabase를 타지 않아 이 비용이 보이지 않는다 — 증상이
로그인한 사람에게만 나타나는 이유다.

진단은 응답 헤더로 한다:

```
x-vercel-id: icn1::iad1::...
             엣지   함수    ← 이 둘이 다르면 함수가 먼 곳에서 돈다
```

Supabase 리전을 옮기면 이 값도 같이 바꿔야 한다.

## 환경변수

`NEXT_PUBLIC_SITE_URL`은 커스텀 도메인을 붙일 때만 설정한다. 비워 두면
`VERCEL_PROJECT_PRODUCTION_URL`, 그다음 `VERCEL_URL` 순으로 해석되므로
프리뷰 배포도 자기 주소를 정확히 쓴다. 빈 문자열로 두는 것과 아예 없는 것은
같게 취급된다.

## 도메인을 바꾸면

Supabase → Authentication → URL Configuration 의 **Site URL과 Redirect URLs 둘 다**
갱신한다. 허용목록에 없는 주소로 돌아오려 하면 Supabase는 에러 없이 Site URL로
보내버려서, 배포본에서 로그인했는데 localhost로 튀는 증상이 된다.

Google Cloud 쪽은 손댈 필요 없다. `redirect_uri`가 Supabase 고정 주소이고
앱 주소는 Supabase가 서버에 보관한다.
