import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './Schema/book.schema';
import * as bcrypt from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
  ) {}

  async findAll(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  async create(createBookDto: Partial<Book>): Promise<Book> {
    // Check for existing id or username
    const existing = await this.bookModel.findOne({ $or: [ { id: createBookDto.id }, { username: createBookDto.username } ] });
    if (existing) {
      throw new BadRequestException('Book with this id or username already exists');
    }
    if (createBookDto.password) {
      const salt = await bcrypt.genSalt(10);
      createBookDto.password = await bcrypt.hash(createBookDto.password, salt);
    }
    const createdBook = new this.bookModel(createBookDto);
    return createdBook.save();
  }

  async update(id: string, updateBookDto: Partial<Book>): Promise<Book | null> {
    return this.bookModel.findOneAndUpdate({ id }, updateBookDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Book | null> {
    return this.bookModel.findOneAndDelete({ id }).exec();
  }

  async login(username: string, password: string): Promise<Book | null> {
    const book = await this.bookModel.findOne({ username }).exec();
    if (book && await bcrypt.compare(password, book.password)) {
      return book;
    }
    return null;
  }
}
