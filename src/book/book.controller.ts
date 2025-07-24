import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './Schema/book.schema';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async findAll(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @Post()
  async create(@Body() createBookDto: Partial<Book>): Promise<Book> {
    return this.bookService.create(createBookDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: Partial<Book>): Promise<Book | null> {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Book | null> {
    return this.bookService.delete(id);
  }
}
