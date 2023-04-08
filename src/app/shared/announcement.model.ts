export class Announcement {
  constructor(
    public id: string,
    public name: string,
    public desc: string,
    public images: string[],
    public price: string,
    public location: string,
    public date: string
  ) {}
}
