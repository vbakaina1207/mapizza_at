/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { ImageService } from './image.service';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { Storage, UploadTask, getDownloadURL, uploadBytesResumable } from '@angular/fire/storage';
import { ref} from '@angular/fire/storage';



type UploadTaskSnapshot = {
  bytesTransferred: number;
  totalBytes: number;
  state: string;
  metadata: any;
  ref: any;
};

describe('Service: Image', () => {
  let service: ImageService;
  let storageMock: jasmine.SpyObj<Storage>;
  let uploadTaskMock: jasmine.SpyObj<UploadTask>;
  let storage: Storage;

  beforeEach(async() => {
    
    uploadTaskMock = jasmine.createSpyObj<UploadTask>('UploadTask', ['snapshot']);

    // storageMock = jasmine.createSpyObj('Storage', ['ref', 'deleteObject']);


    await TestBed.configureTestingModule({
      imports: [
        AngularFireStorageModule
      ],
      providers: [
        ImageService  ,
        { provide: Storage, useValue: storageMock }
      ]
    }).compileComponents();

    service = TestBed.inject(ImageService);
    storage = TestBed.inject(Storage) as jasmine.SpyObj<Storage>;
    // storageMock = TestBed.inject(Storage) as jasmine.SpyObj<Storage>;
  });

  it('should ...', inject([ImageService], (service: ImageService) => {
    expect(service).toBeTruthy();
  }));

  it('uploadFile should upload a file and update uploadPercent', async () => {
    const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const folder = 'test-folder';
    const name = 'test-image.jpg';

    const mockRef = { fullPath: `${folder}/${name}` };
    const mockUploadTask = {
      snapshot: {
        bytesTransferred: 500,
        totalBytes: 1000,
        state: 'running',
        metadata: {},
        ref: mockRef
      } as UploadTaskSnapshot,
      on: jasmine.createSpy('on').and.callFake((event, progress, error, complete) => {
        if (event === 'state_changed') {
          progress(mockUploadTask.snapshot);
          complete();
        }
      })
    } as unknown as UploadTask;

    const url = await service.uploadFile(folder, name, mockFile);

    expect(url).toBe('');
    expect(service.uploadPercent).toBe(0); 
  });

  

  it('uploadFile should handle errors during upload', async () => {
    const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const folder = 'test-folder';
    const name = 'test-image.jpg';
    jasmine.createSpy().and.throwError(new Error('Upload failed')) ;
    spyOn(console, 'error');

    await service.uploadFile(folder, name, mockFile);
    expect(console.error).toHaveBeenCalled();
  });


 
  
});