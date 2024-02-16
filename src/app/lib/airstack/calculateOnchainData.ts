const calculateOnchainData = (data: any) => {
  const {
    poaps,
    socialFollowers,
    socialFollowings,
    ethereum,
    polygon,
    base,
    zora,
  } = data?.Wallet ?? {};
  return 0;
};

export default calculateOnchainData;
