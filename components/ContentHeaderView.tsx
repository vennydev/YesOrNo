import { useEffect, useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import '../css/ContentHeaderView.css';
import FilterBox from "./slideBox/component/FilterBox";
import { useRecoilValue } from "recoil";
import { filterTypeState } from "@/recoil/home";

interface ContentHeaderViewType {
  totalPostCount: number
}

export default function ContentHeaderView({totalPostCount}: ContentHeaderViewType) {
  console.log('totalPostCount: ', totalPostCount);
  const filterType = useRecoilValue(filterTypeState);
  const [showFilterBox, setShowFilterBox] = useState(false);

  const filterTypeToKr = () => {
    switch(filterType) {
      case 'latest':
        return '최신순'
      case 'out-of-date':
        return '투표안한순'
      case 'likes':
        return '좋아요순'
    }
  }

  useEffect(() => {
    setShowFilterBox(false);
  }, [])

  return (
    <div className="contentHeaderView">
      <div className="contentHeaderSubView-total_post_count">
        총 {totalPostCount}개
      </div>
      <div className="contentHeaderSubView-module_btn">
        <div>
            {filterTypeToKr()}
        </div>
        <div className={`chevron-icon ${showFilterBox ? 'opened' : ''}`} onClick={() => setShowFilterBox(true)}>
          <ExpandLessIcon/>
        </div>
        {showFilterBox && <FilterBox setShowFilterBox={setShowFilterBox}/>}
      </div>
    </div>
  )
}