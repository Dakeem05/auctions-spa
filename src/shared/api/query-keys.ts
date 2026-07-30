import type { AuctionListRequest } from '../types/api.types';

export const auctionKeys = {
  all: ['auctions'] as const,
  lists: () => [...auctionKeys.all, 'list'] as const,
  list: (filters: AuctionListRequest) => [...auctionKeys.lists(), filters] as const,
  details: () => [...auctionKeys.all, 'detail'] as const,
  detail: (uuid: string) => [...auctionKeys.details(), uuid] as const,
  bets: (uuid: string) => [...auctionKeys.all, 'bets', uuid] as const,
};
