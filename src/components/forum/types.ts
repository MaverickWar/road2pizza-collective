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
  forum: {
    id: string;
    title: string;
    category: {
      id: string;
      name: string;
    };
  };
  posts: Post[];
}