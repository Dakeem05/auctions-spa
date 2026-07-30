import { apiClient } from './client';
import type {
  AuctionListRequest,
  AuctionListResponse,
  AuctionShowResponse,
  BetListResponse,
  SetBetRequest,
} from '../types/api.types';

export const auctionsApi = {
  list: (params: AuctionListRequest = {}) =>
    apiClient.post<AuctionListResponse>('/auctions/list', params),

  detail: (uuid: string) =>
    apiClient.get<AuctionShowResponse>(`/auctions/${uuid}`),

  bets: (uuid: string, all?: boolean) =>
    apiClient.get<BetListResponse>(
      `/auctions/${uuid}/bets${all ? '?all=true' : ''}`,
    ),

  setBet: (uuid: string, body: SetBetRequest) =>
    apiClient.post<void>(`/auctions/${uuid}/bets`, body),
};
