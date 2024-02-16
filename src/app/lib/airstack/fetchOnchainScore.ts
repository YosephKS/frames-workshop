import { init, fetchQuery } from "@airstack/node";
import calculateOnchainData from "./calculateOnchainData";

const query = /* GraphQL */ `
  query MyQuery($creator: Identity!, $farcasterUser: Identity!) {
    Wallet(input: { identity: $creator, blockchain: ethereum }) {
      poaps(input: { limit: 200 }) {
        eventId
        poapEvent {
          poaps(input: { filter: { owner: { _eq: $farcasterUser } } }) {
            poapEvent {
              eventId
              eventName
            }
          }
        }
      }
      socialFollowers(
        input: {
          filter: {
            dappName: { _eq: farcaster }
            identity: { _eq: $farcasterUser }
          }
        }
      ) {
        Follower {
          followerSince
        }
      }
      socialFollowings(
        input: {
          filter: {
            dappName: { _eq: farcaster }
            identity: { _eq: $farcasterUser }
          }
        }
      ) {
        Following {
          followingSince
        }
      }
      ethereum: tokenBalances(input: { blockchain: ethereum, limit: 200 }) {
        token {
          tokenBalances(input: { filter: { owner: { _eq: $farcasterUser } } }) {
            tokenAddress
          }
        }
      }
      polygon: tokenBalances(input: { blockchain: polygon, limit: 200 }) {
        token {
          tokenBalances(input: { filter: { owner: { _eq: $farcasterUser } } }) {
            tokenAddress
          }
        }
      }
      base: tokenBalances(input: { blockchain: base, limit: 200 }) {
        token {
          tokenBalances(input: { filter: { owner: { _eq: $farcasterUser } } }) {
            tokenAddress
          }
        }
      }
      zora: tokenBalances(input: { blockchain: zora, limit: 200 }) {
        token {
          tokenBalances(input: { filter: { owner: { _eq: $farcasterUser } } }) {
            tokenAddress
          }
        }
      }
    }
  }
`;

const fetchOnchainScore = async (creator: string, farcasterUser: string) => {
  init(process.env.AIRSTACK_API_KEY ?? "");
  const { data, error } = await fetchQuery(query, { creator, farcasterUser });
  if (error) {
    console.error(error);
    return null;
  } else {
    console.log(data);
    return calculateOnchainData(data);
  }
};

export default fetchOnchainScore;
