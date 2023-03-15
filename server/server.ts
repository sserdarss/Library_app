import express, { Request, Response } from "express";
import fetch from "node-fetch";
import { fetchData } from "./api";
import { getBookCol, updateBook } from "./db";
import { Book, BookCol } from "./types";
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.get("/api/willReadBooks", async (req: Request, res: Response) => {
  const bookCol: BookCol = await getBookCol();
  const willReadbooks = bookCol.books.filter((book) => book.willRead);
  res.json(willReadbooks);
});

app.get("/api/alReadBooks", async (req: Request, res: Response) => {
  const readBooks: BookCol = await getBookCol();
  const alreadyRead = readBooks.books.filter((book) => book.alRead);
  res.json(alreadyRead);
});

app.delete("/api/books/:id", async (req: Request, res: Response) => {
  const redBooks: BookCol = await getBookCol();
  const { id } = req.params;

  const bookIndex = redBooks.books.findIndex((book) => book.bookId === id);
  if (bookIndex === -1) {
    return res.status(404).send(`Place with id ${id} not found`);
  }

  redBooks.books.splice(bookIndex, 1);
  await updateBook(redBooks);

  res.json(redBooks.books);
});

app.post("/api/books", async (req: Request, res: Response) => {
  const newBook: Book = req.body;
  const booksDb = await getBookCol();
  const { books } = booksDb;
  const existingBook = books.find((b) => b.bookId === newBook.bookId);
  if (existingBook) {
    res.status(200).json(existingBook);
    return;
  }
  const updatedBooks = [...books, newBook];
  const totalRead = updatedBooks.length;
  const updatedBookCol: BookCol = {
    books: updatedBooks,
    totalRead,
  };
  const newBookCol = await updateBook(updatedBookCol);

  return res.status(201).json(newBookCol);
});

app.put("/api/books", async (req: Request, res: Response) => {
  const newBook: Book = req.body;
  const booksDb = await getBookCol();
  const { books } = booksDb;
  const booksToUpdate = [...books];
  let existingBook = booksToUpdate.find((b) => b.bookId === newBook.bookId);
  if (!existingBook) {
    res.status(404);
    return;
  }
  existingBook = { ...newBook, bookId: existingBook.bookId };
  const totalRead = booksToUpdate.length;
  booksToUpdate.splice(booksToUpdate.findIndex((b) => b.bookId === newBook.bookId),1)
  booksToUpdate.push(existingBook)
  const updatedBookCol: BookCol = {
    books: booksToUpdate,
    totalRead,
  };
  const newBookCol = await updateBook(updatedBookCol);

  return res.status(201).json(newBookCol);
});

app.get("/api/:books", async (req: Request, res: Response) => {
  try {
    const books = req.params.books;
    const responseBooks = await fetchData(books);
    res.json(responseBooks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching weather data");
  }
});

app.listen(5001, () => {
  console.log("Server running on port 5001");
});
