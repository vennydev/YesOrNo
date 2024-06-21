import SlideBox from "./slideBox/SlideBox";

export default function ShareBox(prop: any) {
  const { setShowCommentBox } = prop;

  return (
    <SlideBox setShowBox={setShowCommentBox}>
      asd
    </SlideBox>
  )
}
