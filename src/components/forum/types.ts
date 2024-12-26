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
  is_pinned: boolean;  // Added this property
  view_count: number;  // Added this property
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