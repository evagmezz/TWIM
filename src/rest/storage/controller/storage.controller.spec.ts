
import { Test, TestingModule } from '@nestjs/testing'
import { StorageController } from './storage.controller'
import {StorageService} from "../services/ storage.service";
import {BadRequestException, NotFoundException} from "@nestjs/common";
import * as fs from "node:fs";

describe('StorageController', () => {
    let controller: StorageController
    let service: StorageService

    beforeEach(async () => {
        const mockService = {
            findFile: jest.fn(),
        }

        const module: TestingModule = await Test.createTestingModule({
            controllers: [StorageController],
            providers: [{ provide: StorageService, useValue: mockService }],
        }).compile()

        controller = module.get<StorageController>(StorageController)
        service = module.get<StorageService>(StorageService)
    })

    describe('storeFile', () => {
        it('should return file', () => {
            const file = {
                originalname: 'file.jpg',
                filename: 'file.jpg',
                size: 100,
                mimetype: 'image/jpeg',
                path: 'path/to/file.jpg',
                url: 'http://test/photos/file.jpg',
            }

            jest.spyOn(service, 'findFile').mockReturnValueOnce(file.path)

            const req = {
                protocol: 'http',
                get: (name: string) => {
                    if (name === 'host') {
                        return 'test'
                    }
                },
            }

            expect(
                controller.storeFile(
                    [file] as any,
                    req as any,
                ),
            ).toEqual({ urls: [file.url] })
        })

        it('should throw BadRequestException if no file is provided', () => {
            expect(() => controller.storeFile(undefined, {} as any)).toThrow(
                BadRequestException,
            )
        })
    })

    describe('getFile', () => {
        it('should return file path', () => {
            const filename = 'file.jpg'
            const sendFile = jest.fn()
            jest.spyOn(service, 'findFile').mockReturnValueOnce(filename)
            jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true)

            controller.getFile(filename, { sendFile } as any)

            expect(service.findFile).toHaveBeenCalledWith(filename)
            expect(sendFile).toHaveBeenCalledWith(filename)
        })

        it('should throw NotFoundException if file does not exist', () => {
            const filename = 'file.jpg'
            jest.spyOn(service, 'findFile').mockImplementationOnce(() => {
                throw new NotFoundException(`La imagen ${filename} no existe`)
            })

            expect(() => controller.getFile(filename, { sendFile: jest.fn() } as any)).toThrow(
                NotFoundException,
            )
        })
    })
})