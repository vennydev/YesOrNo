import { useEffect, useState } from "react";
import SlideBox from "../SlideBox";
import './filterBox.css'
import { filterTypeState } from '../../../recoil/home/index';
import { useRecoilState, useRecoilValue } from "recoil";

interface FilterBoxPropType {
  setShowFilterBox: (state: boolean) => void;
}

export default function FilterBox(prop: FilterBoxPropType) {
  const {setShowFilterBox} = prop;
  const [animation, setAnimation] = useState(false);
  const [ filterType, setFilterType] = useRecoilState(filterTypeState);

  const updateFilter = (e :any) => {
    if(e.target.nodeName === "BUTTON"){
      const value = e.target.value;
      setFilterType(value);
      setShowFilterBox(false);
    }
  }
  useEffect(() => {
    setAnimation(true);
  }, []);

  return (
    <SlideBox setShowBox={setShowFilterBox}>
      <div className={`${animation ? "comment-wrapper modal-enter-active" : ""}`}>
        <div className="button-wrapper" onClick={(e) => updateFilter(e)}>
          <button className={`filter-button ${filterType === 'latest' ? 'selected' : ''}`} value="latest">
            최신순
          </button>
          <div className="divider"></div>
          <button className={`filter-button ${filterType === 'out-of-date' ? 'selected' : ''}`} value="out-of-date">
            오래된순
          </button>
          <div className="divider"></div>
          <button className={`filter-button ${filterType === 'likes' ? 'selected' : ''}`} value="likes">
            좋아요순
          </button>
        </div>
      </div>
    </SlideBox>
  )
}