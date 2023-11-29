import { useRef } from "react";
import { AddIcon } from "@/public/icons";
import styled from 'styled-components';

interface ImageUploaderProps {
  handleImage: (file: any) => void;
}

export default function ImageUploader({handleImage}: ImageUploaderProps) {
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <>
      <ImageUploadBtn htmlFor="input-file">
        <AddIcon/>
        <p>사진 추가</p>
      </ImageUploadBtn>
      <input 
        type="file" 
        id="input-file" 
        name='image_URL' 
        accept='image/*' 
        ref={fileInput} 
        onChange={(e: React.ChangeEvent<{ files: FileList | null }>) => handleImage(e.target.files)} 
        style={{display: "none"}} />
    </>
  )
};

const ImageUploadBtn = styled.label`
  display: flex;
  width: 335px;
  height: 52px;
  justify-content: center;
  align-items: center;
  gap:8px;
  border-radius: 12px;
  border: ${(props) => `1px solid ${props.theme.color.mainBorderColor}`};
  margin-top:12px;
  font-size: 14px;
  font-weight: 400;
  line-height: 30px;
  letter-spacing: -0.3px;
  cursor: pointer;
`;