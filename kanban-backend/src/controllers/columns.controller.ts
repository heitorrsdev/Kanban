import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ColumnsService } from '../services/columns.service';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Get()
  findAll() {
    return this.columnsService.findAll();
  }

  @Post()
  create(@Body() body: { title: string }) {
    return this.columnsService.create(body.title);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() body: { title: string }) {
    return this.columnsService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.columnsService.delete(id);
  }
}
