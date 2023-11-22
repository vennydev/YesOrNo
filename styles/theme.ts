const deviceSizes = {
  mobile: 375,
  tablet: 768,
  laptop: 1024,
};

const device = {
  mobile: `screen and (max-width: ${deviceSizes.mobile}px)`,
  tablet: `screen and (max-width: ${deviceSizes.tablet}px)`,
  laptop: `screen and (max-width: ${deviceSizes.laptop}px)`,
};

const color = {
  whiteColor: "#fff",
  dimFontColor: "#ABA7A7",
  disabledfontColor: "#BFBFBF",
  mainFontColor: "#262626",
  mainBorderColor: "#262626",
  pointColor: "#796EFF",
}

const theme = {
  device,
  color
};

export default theme;