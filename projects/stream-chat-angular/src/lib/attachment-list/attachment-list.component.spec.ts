import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageLoadService } from '../message-list/image-load.service';
import { AttachmentListComponent } from './attachment-list.component';

describe('AttachmentListComponent', () => {
  let component: AttachmentListComponent;
  let fixture: ComponentFixture<AttachmentListComponent>;
  let nativeElement: HTMLElement;
  let queryAttachments: () => HTMLElement[];
  let queryImages: () => HTMLImageElement[];
  let queryFileLinks: () => HTMLAnchorElement[];
  let queryUrlLinks: () => HTMLAnchorElement[];
  let queryCardImages: () => HTMLImageElement[];

  const waitForImgComplete = () => {
    const img = queryImages()[0];
    return new Promise((resolve, reject) => {
      if (!img) {
        return reject();
      }
      img.addEventListener('load', () => resolve(undefined));
      img.addEventListener('error', () => resolve(undefined));
    });
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttachmentListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentListComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    queryAttachments = () =>
      Array.from(
        nativeElement.querySelectorAll(
          '[data-testclass="attachment-container"]'
        )
      );
    queryImages = () =>
      Array.from(nativeElement.querySelectorAll('[data-testclass="image"]'));
    queryFileLinks = () =>
      Array.from(
        nativeElement.querySelectorAll('[data-testclass="file-link"]')
      );
    queryUrlLinks = () =>
      Array.from(nativeElement.querySelectorAll('[data-testclass="url-link"]'));
    queryCardImages = () =>
      Array.from(nativeElement.querySelectorAll('[data-testclass="card-img"]'));
    fixture.detectChanges();
  });

  it('should display received #attachments ordered', () => {
    component.attachments = [];
    component.ngOnChanges();
    fixture.detectChanges();

    expect(queryAttachments().length).toBe(0);

    component.attachments = [
      { type: 'image', img_url: 'url1' },
      {
        title: 'BBC - Homepage',
        title_link: 'https://www.bbc.com/',
        og_scrape_url: 'https://www.bbc.com/',
        image_url: 'https://assets/images/favicons/favicon-194x194.png',
      },
      { type: 'file', asset_url: 'url3' },
      {
        image_url: 'https://getstream.io/images/og/OG_Home.png',
        og_scrape_url: 'https://getstream.io/',
        text: 'Build scalable in-app chat or activity feeds in days. Product teams trust Stream to launch faster, iterate more often, and ship a better user experience.',
        thumb_url: 'https://getstream.io/images/og/OG_Home.png',
        title: 'The #1 Chat Messaging + Activity Feed Infrastructure',
        title_link: '/',
        type: 'image',
      },
      { type: 'image', img_url: 'url2' },
    ];
    component.ngOnChanges();
    fixture.detectChanges();
    const attachments = queryAttachments();

    expect(attachments.length).toBe(5);
    expect(
      attachments[0].classList.contains('str-chat__message-attachment--image')
    ).toBeTrue();

    expect(
      attachments[1].classList.contains('str-chat__message-attachment--image')
    ).toBeTrue();

    expect(
      attachments[2].classList.contains('str-chat__message-attachment--file')
    ).toBeTrue();

    expect(
      attachments[2].classList.contains('str-chat__message-attachment--image')
    ).toBeFalse();

    expect(
      attachments[3].classList.contains('str-chat__message-attachment--card')
    ).toBeTrue();

    expect(
      attachments[3].classList.contains('str-chat__message-attachment--image')
    ).toBeFalse();

    expect(
      attachments[4].classList.contains('str-chat__message-attachment--image')
    ).toBeTrue();

    expect(
      attachments[4].classList.contains('str-chat__message-attachment--card')
    ).toBeTrue();

    expect(queryImages().length).toBe(2);
    expect(queryFileLinks().length).toBe(1);
    expect(queryUrlLinks().length).toBe(2);
  });

  describe('should display image attachment', () => {
    it('should display image by img_url', () => {
      const imageUrl = 'image/url';
      component.attachments = [
        { type: 'image', img_url: imageUrl, thumb_url: 'thumb/url' },
      ];
      component.ngOnChanges();
      fixture.detectChanges();

      expect(queryImages()[0].src).toContain(imageUrl);
    });

    it('should display image by thumb_url', () => {
      const thumbUrl = 'thumb/url';
      component.attachments = [
        { type: 'image', img_url: undefined, thumb_url: thumbUrl },
      ];
      component.ngOnChanges();
      fixture.detectChanges();

      expect(queryImages()[0].src).toContain(thumbUrl);
    });

    it('should display image by image_url', () => {
      const imageUrl = 'image/url';
      component.attachments = [
        {
          type: 'image',
          img_url: undefined,
          thumb_url: undefined,
          image_url: imageUrl,
        },
      ];
      component.ngOnChanges();
      fixture.detectChanges();

      expect(queryImages()[0].src).toContain(imageUrl);
    });

    it('should set alt text for image', () => {
      const fallback = 'Fallback is image can not be displayed';
      component.attachments = [{ type: 'image', img_url: 'url1', fallback }];
      component.ngOnChanges();
      fixture.detectChanges();

      expect(queryImages()[0].alt).toContain(fallback);
    });

    it('should emit image load event', async () => {
      const imageLoadService = TestBed.inject(ImageLoadService);
      const spy = jasmine.createSpy();
      imageLoadService.imageLoad$.subscribe(spy);
      component.attachments = [
        {
          type: 'image',
          image_url: 'https://picsum.photos/200/300',
        },
      ];
      component.ngOnChanges();
      fixture.detectChanges();
      await waitForImgComplete();

      expect(spy).toHaveBeenCalledWith(undefined);
    });
  });

  describe('should display file attachment', () => {
    it('should display file link', () => {
      const title = 'contract.pdf';
      const asset_url = 'url/to/contract';
      component.attachments = [{ type: 'file', title, asset_url }];
      component.ngOnChanges();
      fixture.detectChanges();
      const link = queryFileLinks()[0];

      expect(link.hasAttribute('download')).toBeTrue();
      expect(link.href).toContain(asset_url);
      expect(link.textContent).toContain(title);
    });

    it('should add CSS class for files', () => {
      component.attachments = [
        { type: 'file', title: 'contract.pdf', asset_url: 'url/to/contract' },
        { type: 'file', title: 'contract2.pdf', asset_url: 'url/to/contract2' },
      ];
      component.ngOnChanges();
      fixture.detectChanges();

      expect(
        queryAttachments()[0].classList.contains(
          'str-chat-angular__message-attachment-file-single'
        )
      ).toBeTrue();

      expect(
        queryAttachments()[1].classList.contains(
          'str-chat-angular__message-attachment-file-single'
        )
      ).toBeTrue();
    });

    it('should sanitize file link', () => {
      const asset_url = 'javascript:alert(document.domain)';
      component.attachments = [
        { type: 'file', title: 'contract.pdf', asset_url },
      ];
      component.ngOnChanges();
      fixture.detectChanges();
      const link = queryFileLinks()[0];

      expect(link.hasAttribute('download')).toBeTrue();
      expect(link.href).toContain('unsafe:' + asset_url);
    });

    it('should display file size, if provided', () => {
      const title = 'contract.pdf';
      const asset_url = 'url/to/contract';
      component.attachments = [
        { type: 'file', title, asset_url, file_size: 3272969 },
      ];
      component.ngOnChanges();
      fixture.detectChanges();
      const preview = queryAttachments()[0];
      const fileSize = preview.querySelector('[data-testclass="size"]');

      expect(fileSize?.textContent).toContain('3.27 MB');
    });
  });

  describe('should display URL attachment as card', () => {
    it('should trim URL', () => {
      expect(component.trimUrl('https://angular.io/')).toBe('angular.io');
      expect(component.trimUrl('https://www.youtube.com/')).toBe('youtube.com');
    });

    it('should display image by #image_url', () => {
      const imageUrl = 'https://getstream.io/images/og/OG_Home.png';
      component.attachments = [
        {
          author_name: 'GetStream',
          image_url: imageUrl,
          og_scrape_url: 'https://getstream.io',
          thumb_url: 'not' + imageUrl,
          title: 'Stream',
          title_link: '/',
          type: 'image',
        },
      ];
      component.ngOnChanges();
      fixture.detectChanges();

      expect(queryCardImages()[0].src).toBe(imageUrl);
    });

    it('should display image by #thumb_url', () => {
      const thumbUrl = 'https://getstream.io/images/og/OG_Home.png';
      component.attachments = [
        {
          author_name: 'GetStream',
          image_url: undefined,
          og_scrape_url: 'https://getstream.io',
          thumb_url: thumbUrl,
          title: 'Stream',
          title_link: '/',
        },
      ];
      component.ngOnChanges();
      fixture.detectChanges();

      expect(queryCardImages()[0].src).toBe(thumbUrl);
    });

    it('should display attachment #title, if exists', () => {
      const title = 'Stream';
      component.attachments = [
        {
          author_name: 'GetStream',
          image_url: undefined,
          og_scrape_url: 'https://getstream.io',
          thumb_url: 'https://getstream.io/images/og/OG_Home.png',
          title,
          title_link: '/',
        },
      ];
      component.ngOnChanges();
      fixture.detectChanges();

      expect(
        queryAttachments()[0].querySelector('[data-testclass="card-title"]')
          ?.textContent
      ).toContain(title);
    });

    it('should display attachment #text, if exists', () => {
      const text =
        'Build scalable in-app chat or activity feeds in days. Product teams trust Stream to launch faster, iterate more often, and ship a better user experience.';
      component.attachments = [
        {
          author_name: 'GetStream',
          image_url: undefined,
          og_scrape_url: 'https://getstream.io',
          thumb_url: 'https://getstream.io/images/og/OG_Home.png',
          title: 'Stream',
          text,
          title_link: '/',
        },
      ];
      component.ngOnChanges();
      fixture.detectChanges();

      expect(
        queryAttachments()[0].querySelector('[data-testclass="card-text"]')
          ?.textContent
      ).toContain(text);
    });

    it('should display attachment #title_link', () => {
      const titleLink = 'https://getstream.io';
      component.attachments = [
        {
          author_name: 'GetStream',
          image_url: undefined,
          og_scrape_url: 'https://getstream.io/home',
          thumb_url: 'https://getstream.io/images/og/OG_Home.png',
          title: 'Stream',
          text: 'Build scalable in-app chat or activity feeds in days. Product teams trust Stream to launch faster, iterate more often, and ship a better user experience.',
          title_link: titleLink,
        },
      ];
      component.ngOnChanges();
      fixture.detectChanges();

      expect(queryUrlLinks()[0].href).toContain(titleLink);
      expect(queryUrlLinks()[0].textContent).toContain('getstream.io');
    });

    it('should display attachment #og_scrape_url', () => {
      const scrapeUrl = 'https://getstream.io';
      component.attachments = [
        {
          author_name: 'GetStream',
          image_url: undefined,
          og_scrape_url: scrapeUrl,
          thumb_url: 'https://getstream.io/images/og/OG_Home.png',
          title: 'Stream',
          text: 'Build scalable in-app chat or activity feeds in days. Product teams trust Stream to launch faster, iterate more often, and ship a better user experience.',
          title_link: undefined,
        },
      ];
      component.ngOnChanges();
      fixture.detectChanges();

      expect(queryUrlLinks()[0].href).toContain(scrapeUrl);
      expect(queryUrlLinks()[0].textContent).toContain(
        component.trimUrl('getstream.io')
      );
    });
  });
});
