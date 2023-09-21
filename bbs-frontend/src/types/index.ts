
export interface Post {
    id?: number,
    title: string,
    name: string,
    callsign: string,
    content: string,
    created_at?: Date,
  }

export interface User {
  id: number;
  username: string;
  role_id: number;
  email: string;
}