export interface Post {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  is_solution: boolean;
  user: {
    username: string;
  };
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  created_at: string;
  created_by: string;
  is_locked: boolean;
  category: {
    name: string;
  };
  posts: Post[];
}