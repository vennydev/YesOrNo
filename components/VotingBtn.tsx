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

  const showBar = () => {
    if(voteStatus !== "no response"){
      if(yesPercentage > noPercentage){
        return <YesBar $percentage={yesPercentage}/>
      }else if(noPercentage > yesPercentage){
        return <NoBar $percentage={noPercentage}/>
      }else{
        return (
          <>
            <YesBar $percentage={yesPercentage} />
            <NoBar $percentage={noPercentage} />
          </>
        )
      }
    }
  };
  
  const showBtn = (text: string) => {
    if(yesPercentage > noPercentage){
      return (
        <BtnElements>
          <BtnTitle>{text}</BtnTitle>
          <ParticipantsRate>{getOnlyIntergers(yesPercentage)}%</ParticipantsRate>
        </BtnElements>
      )
    }else if(noPercentage > yesPercentage){
      return (
        <BtnElements>
          <BtnTitle>{text}</BtnTitle>
          <ParticipantsRate>{getOnlyIntergers(noPercentage)}%</ParticipantsRate>
      </BtnElements>
      )
    }
  };

  return (
    <VotingBtnContainer>
      {isParticipantCountPublic && <ParticiPatnsCount>{totalParticipantsCount}명 투표 참여</ParticiPatnsCount>}
      <PostVoteWrapper>
        <BtnWrapper>
          <YesBtn $voteStatus={voteStatus} value="yes" onClick={(e) => handleVotesCount(e)}>
            {voteStatus === 'no response' ? (
              <BtnTitle>YES</BtnTitle>
            ) : (
              <>
                {(yesPercentage > noPercentage || yesPercentage === noPercentage) && 
                  <BtnElements>
                    <BtnTitle>YES</BtnTitle>
                    <ParticipantsRate>{getOnlyIntergers(yesPercentage)}%</ParticipantsRate>
                  </BtnElements>
                }
              </>
            )}
          </YesBtn>
          {voteStatus === 'no response' && <Divider/>}
          <NoBtn $voteStatus={voteStatus} value="no" onClick={(e) => handleVotesCount(e)}>
          {voteStatus === 'no response' ? (
              <BtnTitle>NO</BtnTitle>
            ) : (
              <>
                {(noPercentage > yesPercentage || yesPercentage === noPercentage) && 
                  <BtnElements>
                    <BtnTitle>NO</BtnTitle>
                    <ParticipantsRate>{getOnlyIntergers(noPercentage)}%</ParticipantsRate>
                  </BtnElements>
                }
              </>
            )}
          </NoBtn>
        </BtnWrapper>
        <BarWrapper>
          {showBar()}
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
  height: 60px;
  border-radius: 12px;
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
  color: white;
`;

const VoteBtn = styled.button`
  width: 50%;
  z-index: 100;
  display: flex;
  align-items: center;
  `;

const YesBtn = styled(VoteBtn)<{$voteStatus: string}>`
  justify-content: ${props => props.$voteStatus !== 'no response' ? 'start' : 'center'};
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
`;

const NoBtn = styled(VoteBtn)<{$voteStatus: string}>`
  justify-content: ${props => props.$voteStatus !== 'no response' ? 'end' : 'center'};
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
`;

const BtnElements = styled.div`
  width: 74px;
  display: flex;
  flex-direction: column;
`

const BtnTitle = styled.span`
  font-size: 20px;
  line-height: 32px;
  font-family: 'MaruBuri';
  position: relative;
  z-index: -1000;
`;

const ParticipantsRate = styled.div`
  font-size: 9px;
  font-weight: 400;
  line-height: normal;
  font-family: 'MaruBuri';
  position: relative;
  opacity: 0.5;
  z-index: -1000;
  padding: 0 10px;
`;

const BarWrapper = styled.div`
  position:absolute;
  left:0;
  width: 100%;
  height:100%;
  border-radius: 14px;
  z-index:-1000;
`;

const Bar = styled.div<{$percentage: number}>`
  position:absolute;
  height:100%;
  z-index:-100;
  display: flex;
  border-radius: 12px;
  /* border-radius:${props => props.$percentage === 50 ? '1px' : '12px'}; */
  justify-content: space-between;
  transition: all 0.3s ease-in-out;
  width: ${props => props.$percentage ? `${props.$percentage}%` : '0px'};

  `;

const YesBar = styled(Bar)<{$percentage: number}>`
  left:0;
  background-color: ${props => props.theme.color.yesBarColor};
  border-top-right-radius:${props => props.$percentage === 50 ? '0px' : '12px'};
  border-bottom-right-radius:${props => props.$percentage === 50 ? '0px' : '12px'};
  border-right: ${props => props.$percentage ? `1px solid ${props.theme.color.mainBorderColor}` : 'none'};
`;

const NoBar = styled(Bar)<{$percentage: number}>`
  right:0;
  background-color: ${props => props.theme.color.noBarColor};
  border-top-left-radius:${props => props.$percentage === 50 ? '0px' : '12px'};
  border-bottom-left-radius:${props => props.$percentage === 50 ? '0px' : '12px'};
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
