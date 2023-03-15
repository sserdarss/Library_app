export type BookCol = {
    [x: string]: any;
    books: Book[];
    totalRead: number;
  };
  
  
export  type Book ={
      bookId:string,
      title: string,
      author_name :string,
      alRead:boolean,
      willRead:boolean,
      fav:boolean,
      pic:string
  }