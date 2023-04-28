export interface Announcement {
  id?: string;
  name: string;
  desc?: string;
  creatorId: string;
  images: string[];
  phone?: string;
  categoryNames: string[];
  price?: string;
  location: string;
  date: string;
}
