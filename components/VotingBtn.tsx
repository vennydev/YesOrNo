"use client"

import styled from 'styled-components';

interface VotingBtnProps {
  percentage: number;
  voteStatus: string;
  isParticipantCountPublic: boolean | undefined;
  totalParticipantsCount: number;
  handleVotesCount: (e: any) => void;
}

export default function VotingBtn({percentage, voteStatus, isParticipantCountPublic, totalParticipantsCount, handleVotesCount}: VotingBtnProps) {
  const yesPercentage: number = percentage;
  const noPercentage: number = 100 - percentage;

  const getOnlyIntergers = (number: number) => {
    return Math.round(number)
  };

  const showPercentage = (percentage: number) => {
    return voteStatus !== "no response" && <ParticipantsRate>{getOnlyIntergers(percentage)}%</ParticipantsRate>
  }

  return (
    <VotingBtnContainer>
      {isParticipantCountPublic && <ParticiPatnsCount>{totalParticipantsCount}명 투표 참여</ParticiPatnsCount>}
      <PostVoteWrapper>
        <BtnWrapper>
          <YesBtn value="yes" $voteStatus={voteStatus} onClick={(e) => handleVotesCount(e)}>
            <BtnTitle>YES</BtnTitle>
            {showPercentage(yesPercentage)}
          </YesBtn>
          <Divider/>
          <NoBtn value="no" $voteStatus={voteStatus} onClick={(e) => handleVotesCount(e)}>
            <BtnTitle>NO</BtnTitle>
            {showPercentage(noPercentage)}
          </NoBtn>
        </BtnWrapper>
        <BarWrapper>
          <YesBar $percentage={yesPercentage}/>
          <NoBar $percentage={noPercentage}/>
        </BarWrapper>
      </PostVoteWrapper>

    </VotingBtnContainer>
  )
};

const VotingBtnContainer = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  width: 100%;
`;

const PostVoteWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 66px;
  border-radius: 14px;
  border: ${(props) => `1px solid ${props.theme.color.mainBorderColor}`};
  position: relative;
`;

const ParticiPatnsCount = styled.span`
  font-size: 11px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-bottom: 7px;
`;

const BtnWrapper = styled.div`
  display: flex;
  width: 100%;
  color:white;
`;

const VoteBtn = styled.button`
  width: 50%;
  text-align: center;
  z-index: 100;
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

const BtnTitle = styled.span`
  font-size: 20px;
  line-height: 32px;
  font-family: 'MaruBuri';
  position: relative;
  z-index: -1000;
`;

const ParticipantsRate = styled.div`
  font-size: 11px;
  font-weight: 400;
  line-height: normal;
  font-family: 'MaruBuri';
  position: relative;
  z-index: -1000;
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
  z-index:-100;
  display: flex;
  border-radius:14px;
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
