import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyles = createGlobalStyle`
    ${reset}
    a{
        text-decoration: none;
        color: inherit;
    }
    
    *{
      box-sizing: border-box;
      font-family: 'MaruBuri';
    }

    button {
      color: black;
    }

    html, body, div, span, h1, h2, h3, h4, h5, h6, p, 
    a, dl, dt, dd, ol, ul, li, form, label, table{
        margin: 0;
        padding: 0;
        border: 0;
        vertical-align: baseline;
    }

    body{
      line-height: 1;
      font-family: 'MaruBuri';
      height:100%;
    }
    
    ol, ul{
        list-style: none;
    }

    button {
        border: 0;
        background: transparent;
        cursor: pointer;
    }

    span {
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
`;

export default GlobalStyles;
