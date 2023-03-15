import { BookCol } from "./types";

const { MongoClient, ServerApiVersion } = require("mongodb");

const uri =
  "mongodb+srv://serdarsorgun:uD323500.@cluster0.noojpzj.mongodb.net/test";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const dbName = "serdar";

const getBookCollection = async ()  => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("books");
  return collection;
};
const initiazeBookCol = async () => {
  const bookCol: BookCol= {
    books: [],
    totalRead: 0,
  };
  const collection = await getBookCollection();
  const result = await collection.insertOne(bookCol);

  return bookCol;
};

export const getBookCol = async (): Promise<BookCol> => {
    const collection = await getBookCollection();
    const bookCol: BookCol = await collection.findOne({});
    return bookCol;
  };

  export const updateBook = async (bookCol: BookCol):Promise<BookCol>=> {
    const existingCol = await getBookCol()
    const collection = await getBookCollection();
    
    await collection.updateOne({ _id:existingCol._id}, { $set: bookCol });
    const updatedBookCol: BookCol = await collection.findOne({});
    return updatedBookCol;
  };