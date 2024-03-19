import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Req,
  UploadedFiles,
  UseInterceptors,
  Res,
} from '@nestjs/common'

import { diskStorage } from 'multer'
import { FilesInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'
import { extname, parse } from 'path'
import { StorageService } from '../services/ storage.service'
import * as fs from 'fs'
import { Response } from 'express'

@Controller('photos')
export class StorageController {
  private readonly logger = new Logger(StorageController.name)

  constructor(private readonly storageService: StorageService) {}

  @UseInterceptors(
    FilesInterceptor('image', 7, {
      storage: diskStorage({
        destination: process.env.UPLOADS_FOLDER || './photos',
        filename: (req, file, cb) => {
          const { name } = parse(file.originalname)
          const fileName = `${Date.now()}_${name.replace(/\s/g, '')}`
          const fileExt = extname(file.originalname)
          cb(null, `${fileName}.${fileExt}`)
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|heic)$/)) {
          cb(new BadRequestException('Archivo no soportado.'), false)
        } else {
          cb(null, true)
        }
      },
    }),
  )
  storeFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: Request,
  ) {
    this.logger.log(`Almacenando imágenes`)

    if (!files) {
      throw new BadRequestException('Imagen no soprtada')
    }
    const urls = files.map((file) => {
      return `${req.protocol}://${req.get('host')}/photos/${file.filename}`
    })

    return {
      urls: urls,
    }
  }

  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    this.logger.log(`Buscando imagen ${filename}`)
    const file = this.storageService.findFile(filename)
    if (fs.existsSync(file)) {
      this.logger.log(`Imagen encontrada ${file}`)
      res.sendFile(file)
    } else {
      throw new NotFoundException(`La imagen ${filename} no existe`)
    }
  }
}
