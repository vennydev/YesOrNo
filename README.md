# 질문있어욘

### refactoring 필요한 곳

- /components/Post.tsx 에 votingBtn의 유무에 따라 다른 UI를 보여주는 분기처리코드가 중복되어있음

- event나 변수들에 적절한 타입 지정(현재 event type은 대부분 any)