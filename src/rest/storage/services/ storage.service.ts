import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import * as process from 'process'
import * as fs from 'fs'
import * as path from 'path'
import { join } from 'path'

@Injectable()
export class StorageService {
  private readonly uploadsFolder = process.env.UPLOADS_FOLDER || './photos'
  private readonly isDev = process.env.NODE_ENV === 'dev'
  private readonly logger = new Logger(StorageService.name)

  async onModuleInit() {
    if (this.isDev) {
      if (fs.existsSync(this.uploadsFolder)) {
        this.logger.log(`Eliminando imágenes de ${this.uploadsFolder}`)
        fs.readdirSync(this.uploadsFolder).forEach((file) => {
          fs.unlinkSync(path.join(this.uploadsFolder, file))
        })
      } else {
        this.logger.log(`Creando carpeta de imágenes en ${this.uploadsFolder}`)
        fs.mkdirSync(this.uploadsFolder)
      }
    }
  }

  findFile(filename: string) {
    this.logger.log(`Buscando imagen ${filename}`)
    const file = join(
      process.cwd(),
      process.env.UPLOADS_FOLDER || './photos',
      filename,
    )
    if (fs.existsSync(file)) {
      this.logger.log(`Imagen ${filename} encontrada`)
      return file
    } else {
      throw new NotFoundException(`Imagen ${filename} no encontrada`)
    }
  }

  removeFiles(fileUrls: string[]): void {
    fileUrls.forEach((fileUrl) => {
      const filename = fileUrl.split('/').pop()
      this.logger.log(`Eliminando imagen ${filename}`)
      const file = join(
        process.cwd(),
        process.env.UPLOADS_FOLDER || './photos',
        filename,
      )
      if (fs.existsSync(file)) {
        fs.unlinkSync(file)
      } else {
        throw new NotFoundException(`Imagen ${filename} no encontrada`)
      }
    })
  }
}
