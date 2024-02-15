const formatNumber = (digit: number) => {
  return new Intl.NumberFormat("en-Us").format(digit);
};

export default formatNumber;
