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
  const filterArray = ['최신순', '투표안한순(마감임박순)', '좋아요순'];

  const updateFilter = (e) => {
    if(e.target.nodeName === "BUTTON"){
      const value = e.target.value;
      setFilterType(value);
      setShowFilterBox(false);
    }
  }
console.log('filterType: ', filterType);
  useEffect(() => {
    setAnimation(true);
  }, []);

  return (
    <SlideBox>
      <div className={`${animation ? "comment-wrapper modal-enter-active" : ""}`}>
        <div className="button-wrapper" onClick={(e) => updateFilter(e)}>
          <button className={`filter-button ${filterType === 'latest' ? 'selected' : ''}`} value="latest">
            최신순
          </button>
          <div className="divider"></div>
          <button className={`filter-button ${filterType === 'out-of-date' ? 'selected' : ''}`} value="out-of-date">
            투표안한순(마감임박순)
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