"use client"

import styled from 'styled-components';

interface VotingBtnProps {
  percentage: number;
  voteStatus: string;
  handleVotesCount: (e: any) => void;
}

export default function VotingBtn({percentage, voteStatus, handleVotesCount}: VotingBtnProps) {
  const yesPercentage: number = percentage;
  const noPercentage: number = 100 - percentage;
  
  return (
    <PostVoteWrapper>
      <BtnWrapper>
        <YesBtn value="yes" $voteStatus={voteStatus} onClick={(e) => handleVotesCount(e)}>YES</YesBtn>
        <Divider/>
        <NoBtn value="no" $voteStatus={voteStatus} onClick={(e) => handleVotesCount(e)}>NO</NoBtn>
      </BtnWrapper>
      <BarWrapper>
          <YesBar $percentage={yesPercentage}/>
          <NoBar $percentage={noPercentage}/>
      </BarWrapper>
    </PostVoteWrapper>
  )
};

const PostVoteWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 66px;
  border-radius: 14px;
  border: ${(props) => `1px solid ${props.theme.color.mainBorderColor}`};
position: relative;
`;

const BtnWrapper = styled.div`
  display: flex;
  width: 100%;
  color:white;
`;

const VoteBtn = styled.button`
  width: 50%;
  text-align: center;
  opacity: 5;
`;

const YesBtn = styled(VoteBtn)<{$voteStatus: string}>`
  border-top-left-radius: 14px;
  border-bottom-left-radius: 14px;
  color: ${props => props.$voteStatus === "no response" ? "black" : "white"}
`;

const NoBtn = styled(VoteBtn)<{$voteStatus: string}>`
  border-top-right-radius: 14px;
  border-bottom-right-radius: 14px;
  color: ${props => props.$voteStatus === "no response" ? "black" : "white"}
`;

const BarWrapper = styled.div`
  position:absolute;
  left:0;
  width: 100%;
  height:100%;
  border-radius: 14px;
  z-index:-1000;
`;

const Bar = styled.div`
  position:absolute;
  background-color: ${props => props.theme.color.pointColor};
  height:100%;
  border-radius: 14px;
  z-index:-100;
  display: flex;
  justify-content: space-between;
  transition: all 0.3s ease-in-out;
  `;

const YesBar = styled(Bar)<{$percentage: number}>`
  width: ${props => props.$percentage ? `${props.$percentage}%` : '0px'};
  left:0;
  border-right: ${props => props.$percentage ? `1px solid ${props.theme.color.mainBorderColor}` : 'none'};
`;

const NoBar = styled(Bar)<{$percentage: number}>`
  width: ${props => props.$percentage && `${props.$percentage}%`};
  right:0;
  border-left: ${props => props.$percentage ? `1px solid ${props.theme.color.mainBorderColor}` : 'none'};
`;

const Divider = styled.div`
  height: 45px;
  width: 1px;
  background: #8C8C8C;
  position: absolute;
  left:50%;
  top:50%;
  transform: translateY(-50%);
`;
