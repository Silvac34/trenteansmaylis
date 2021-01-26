import { TestBed } from '@angular/core/testing';

import { ImgCompressService } from './img-compress.service';

describe('ImgCompressService', () => {
  let service: ImgCompressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImgCompressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
