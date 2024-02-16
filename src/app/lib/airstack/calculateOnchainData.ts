const defaultScoreMap = {
  followedByOnFarcaster: 5,
  followingOnFarcaster: 5,
  commonPoaps: 7,
  commonEthTokens: 5,
  commonPolygonTokens: 0,
  commonBaseTokens: 3,
  commonZoraTokens: 3,
};

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

  // @ts-ignore
  const poapsCount = poaps?.filter(({ poapEvent }) =>
    Boolean(poapEvent?.poaps)
  )?.length;
  const socialFollowersCount = socialFollowers?.Follower ? 1 : 0;
  const socialFollowingsCount = socialFollowings?.Following ? 1 : 0;
  const ethereumCount = ethereum?.filter(
    // @ts-ignore
    ({ token }) => token?.tokenBalances?.length > 0
  )?.length;
  const polygonCount = polygon?.filter(
    // @ts-ignore
    ({ token }) => token?.tokenBalances?.length > 0
  )?.length;
  const baseCount = base?.filter(
    // @ts-ignore
    ({ token }) => token?.tokenBalances?.length > 0
  )?.length;
  const zoraCount = zora?.filter(
    // @ts-ignore
    ({ token }) => token?.tokenBalances?.length > 0
  )?.length;
  return (
    poapsCount * defaultScoreMap.commonPoaps +
    socialFollowersCount * defaultScoreMap.followedByOnFarcaster +
    socialFollowingsCount * defaultScoreMap.followingOnFarcaster +
    ethereumCount * defaultScoreMap.commonEthTokens +
    polygonCount * defaultScoreMap.commonPolygonTokens +
    baseCount * defaultScoreMap.commonBaseTokens +
    zoraCount * defaultScoreMap.commonZoraTokens
  );
};

export default calculateOnchainData;
