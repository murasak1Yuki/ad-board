import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnouncementItemComponent } from '@shared/components/announcement-item/announcement-item.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { SkeletonModule } from 'primeng/skeleton';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

describe('Component: AnnouncementItem', () => {
  let component: AnnouncementItemComponent;
  let fixture: ComponentFixture<AnnouncementItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnouncementItemComponent],
      imports: [RouterTestingModule, SkeletonModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementItemComponent);
    component = fixture.debugElement.componentInstance;
    component.announcement = {
      id: '0',
      creatorId: '0',
      categoryNames: ['testCategory'],
      name: 'Test announcement',
      price: '100',
      location: 'Test location',
      date: Date.now().toString(),
      images: ['test_image.jpg'],
    };
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    fixture.detectChanges();
    const title = fixture.debugElement.query(
      By.css('.announcement-item__title')
    ).nativeElement.textContent;
    expect(title).toContain(component.announcement!.name);
  });

  it('should display the correct price', () => {
    fixture.detectChanges();
    const price = fixture.debugElement.query(
      By.css('.announcement-item__price')
    ).nativeElement.textContent;
    expect(price).toContain(component.announcement!.price);
  });

  it('should display the correct location', () => {
    fixture.detectChanges();
    const location = fixture.debugElement.query(
      By.css('.announcement-item__location')
    ).nativeElement.textContent;
    expect(location).toContain(component.announcement!.location);
  });

  it('should display the correct date', () => {
    fixture.detectChanges();
    const timestamp = component.announcement!.date;
    let datePipe = new DatePipe('en-US');
    const dateElement = fixture.debugElement.query(
      By.css('.announcement-item__time')
    ).nativeElement.textContent;
    expect(dateElement).toContain(datePipe.transform(timestamp, 'MM/dd/yyyy'));
  });

  it('should display the correct image and link', () => {
    fixture.detectChanges();
    const img = fixture.debugElement.query(
      By.css('.announcement-item__img img')
    ).nativeElement;
    expect(img.src).toContain(component.announcement!.images[0]);
    expect(img.alt).toContain(component.announcement!.name);

    const link = fixture.debugElement
      .query(By.css('.announcement-item'))
      .nativeElement.getAttribute('href');
    expect(link).toContain('/view/0');
  });

  it('should call navigateByUrl on click', () => {
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const spy = spyOn(router, 'navigateByUrl');
    const element = fixture.debugElement.nativeElement;
    element.querySelector('.announcement-item').click();
    expect(spy).toHaveBeenCalled();
  });

  it('should display skeleton if announcement is null', () => {
    component.announcement = null;
    fixture.detectChanges();
    const skeletonElement = fixture.nativeElement.querySelector('p-skeleton');
    expect(skeletonElement).toBeTruthy();
  });
});
