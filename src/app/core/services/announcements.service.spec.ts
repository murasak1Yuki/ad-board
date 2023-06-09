import { AnnouncementsService } from '@services/announcements.service';
import { Observable, of, Subject } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { Announcement } from '@models/announcement.model';
import { Router } from '@angular/router';

describe('AnnouncementsService', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let authService: AuthService;
  let announcementsService: AnnouncementsService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    authService = new AuthService(httpClientSpy as any, new Router());
    announcementsService = new AnnouncementsService(
      httpClientSpy as any,
      authService
    );
  });

  it('should be created', () => {
    expect(announcementsService).toBeTruthy();
  });

  it('should fetch announcements with filterByUser false', () => {
    const mockAnnouncements: Announcement[] = [
      {
        creatorId: '0',
        categoryNames: ['testCategory'],
        name: 'Test announcement',
        price: '100',
        location: 'Test location',
        date: Date.now().toString(),
        images: ['test_image.jpg'],
      },
      {
        creatorId: '1',
        categoryNames: ['testCategory1'],
        name: 'Test announcement1',
        price: '101',
        location: 'Test location1',
        date: Date.now().toString(),
        images: ['test_image1.jpg'],
      },
      {
        creatorId: '2',
        categoryNames: ['testCategory2'],
        name: 'Test announcement2',
        price: '102',
        location: 'Test location2',
        date: Date.now().toString(),
        images: ['test_image2.jpg'],
      },
    ];
    httpClientSpy.get.and.returnValue(of(mockAnnouncements));

    announcementsService
      .fetchAnnouncements(false)
      .subscribe((announcements) => {
        expect(httpClientSpy.get.calls.count()).toBe(1);
        expect(announcements).toEqual(mockAnnouncements);
      });
  });

  it('should initialize private properties', () => {
    expect(announcementsService['_announcements']).toEqual([]);
    expect(announcementsService['_announcementsChanged']).toEqual(
      jasmine.any(Subject)
    );
  });

  it('should initialize public properties', () => {
    expect(announcementsService.announcementsChanged$).toEqual(
      jasmine.any(Observable)
    );
  });
});
