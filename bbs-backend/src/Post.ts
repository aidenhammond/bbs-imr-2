/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
interface Post {
  id?: number;
  title: string;
  name: string;
  callsign: string;
  content: string;
  created_at?: Date;
}
export default Post;