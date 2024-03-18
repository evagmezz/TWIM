import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'

import { diskStorage } from 'multer'
import { FilesInterceptor } from '@nestjs/platform-express'
import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { extname, join, parse } from 'path'
import { StorageService } from '../services/ storage.service'
import * as fs from 'fs'

function getFileExtension(filename: string) {
  return extname(filename).slice(1)
}

function isValidFile(file: {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  size: number
  destination: string
  filename: string
  path: string
  buffer: Buffer
}) {
  return false
}

@Controller('photos')
export class StorageController {
  private readonly logger = new Logger(StorageController.name)

  constructor(private readonly storageService: StorageService) {}

  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: process.env.UPLOADS_FOLDER || './photos',
        filename: (req, file, cb) => {
          const { name } = parse(file.originalname)
          const fileName = `${uuidv4()}_${name.replace(/\s/g, '')}`
          const fileExt = getFileExtension(file.originalname)
          cb(null, `${fileName}.${fileExt}`)
        },
      }),
      fileFilter: (req, file, cb) => {
        if (isValidFile(file)) {
          cb(null, true)
        } else {
          cb(new BadRequestException('Tipo de archivo no permitido'), false)
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
      throw new BadRequestException('Imagen no encontrada')
    }

    const url = `${req.protocol}://${req.get('host')}/photos/${files[0].filename}`
    console.log(files[0].filename)
    return { url }
  }

  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    this.logger.log(`Buscando imagen ${filename}`)
    const file = join(
      process.cwd(),
      process.env.UPLOADS_FOLDER || './photos',
      filename,
    )

    if (fs.existsSync(file)) {
      this.logger.log(`Imagen encontrada ${file}`)
      res.sendFile(file)
    } else {
      throw new NotFoundException(`La imagen ${filename} no existe`)
    }
  }
}
