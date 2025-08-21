export interface IGoogleUser {
  id: string;
  name: string;
  provider: string;
  accessToken: string;
  avatar: string | null;
  emails: { value: string; verified: boolean }[];
}
