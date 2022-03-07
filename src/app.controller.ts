import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { FilesDto, FileDto } from './app.dto';
import * as path from 'path';
import * as fs from 'fs';

const basePath = path.join(__dirname, '../files');

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //  文件下载
  @Get('download')
  async downloadFile(
    @Query('fileName') fileName: string,
    @Res() res: Response,
  ): Promise<any> {
    const filePath = path.join(basePath, fileName);
    res.download(filePath, (err) => {
      if (!err) {
        return;
      } else {
        res.send('下载失败');
      }
    });
  }

  // 文件列表
  @Get('files')
  getFiles(@Query('page') page: number, @Query('size') size: number): FilesDto {
    const files = fs.readdirSync(path.join(basePath));
    const total = files.length;
    files.sort(function (a, b) {
      return (
        fs.statSync(path.join(basePath, b)).mtime.getTime() -
        fs.statSync(path.join(basePath, a)).mtime.getTime()
      );
    });
    const fileList = files.splice((page - 1) * size, size);
    return {
      fileList,
      total,
    };
  }

  // 文件上传
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    try {
      fs.writeFileSync(path.join(basePath, file.originalname), file.buffer);
      return {
        msg: 'upload suceess',
      };
    } catch (e) {
      return e;
    }
  }

  // 删除文件
  @Post('delete')
  deleteFile(@Body() file: FileDto) {
    try {
      fs.unlinkSync(path.join(basePath, file.fileName));
      return {
        msg: 'delete suceess',
      };
    } catch (e) {
      return e;
    }
  }
}
