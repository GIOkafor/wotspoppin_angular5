import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'imageSanitizer'
})
export class ImageSanitizerPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer){}

  transform(value: any, args?: any): any {

    return this.sanitizer.bypassSecurityTrustStyle(`url(${value})`);
  }

}
