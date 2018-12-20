import { TestBed, inject } from '@angular/core/testing';

import { PickerService } from './picker.service';

describe('PickerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PickerService]
    });
  });

  it('should be created', inject([PickerService], (service: PickerService) => {
    expect(service).toBeTruthy();
  }));
});
