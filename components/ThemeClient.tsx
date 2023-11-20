"use client"

import { ThemeProvider } from "styled-components";
import theme from '@/styles/theme';
import GlobalStyle from "../styles/GlobalStyles";
import styled from "styled-components";

export default function ThemeClient({ children }: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle/>
        <Screen>
          {children}
        </Screen>
    </ThemeProvider>
  )
};

const Screen = styled.div`
  width: 100%;
  height: 100vh;
`;