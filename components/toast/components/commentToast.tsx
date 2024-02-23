import Toast2 from "../Toast2";
import '../../../css/toast.css';

export default function CommentToast({text}: any) {
  return (
    <Toast2>
      <span className="text">
        {text}
      </span>
    </Toast2>
  )
}