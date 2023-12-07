"use client"

import styled from 'styled-components';

interface VotingBtnProps {
  handleVotesCount: (e: any) => void;
}

export default function VotingBtn({handleVotesCount}: VotingBtnProps) {
  return (
    <PostVoteWrapper>
      <YesBtn value="yes" onClick={(e) => handleVotesCount(e)}>YES</YesBtn>
        <Divider/>
      <NoBtn value="no" onClick={(e) => handleVotesCount(e)}>NO</NoBtn>
    </PostVoteWrapper>
  )
}


const PostVoteWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 66px;
  border-radius: 14px;
  border: ${(props) => `1px solid ${props.theme.color.mainBorderColor}`};
  position: relative;
`;

const VoteBtn = styled.button`
  width: 50%;
  text-align: center;
`;

const YesBtn = styled(VoteBtn)`
  border-top-left-radius: 14px;
  border-bottom-left-radius: 14px;
`;

const NoBtn = styled(VoteBtn)`
  border-top-right-radius: 14px;
  border-bottom-right-radius: 14px;
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
