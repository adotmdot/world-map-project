import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldBankService } from '../../services/world-bank.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  @ViewChild('svgObject', { static: false }) svgObject!: ElementRef<HTMLObjectElement>;


  selectedCode = '';
  countryData: any = null;
  errorMessage = '';

  constructor(
  private worldBankService: WorldBankService,
  private ngZone: NgZone
) {}


  // ---------------- SVG WIRING ----------------
  ngAfterViewInit(): void {
    const objectEl = this.svgObject.nativeElement;
    let initialized = false;

    const initSvg = () => {
      if (initialized) return;
      const svgDoc = objectEl.contentDocument;
      if (!svgDoc) {
        console.warn('SVG document not ready yet');
        return;
      }
      initialized = true;

      
      const paths = Array.from(svgDoc.getElementsByTagName('path'));
      console.log('Total <path> elements in SVG:', paths.length);

      paths.forEach((el) => {
        const code = el.getAttribute('id') || '';
        if (!code) return; 

        
        const originalFill = el.getAttribute('fill') || '';
        el.setAttribute('data-original-fill', originalFill);

        el.style.cursor = 'pointer';

       
        el.addEventListener('mouseenter', () => {
          el.setAttribute('fill', '#ffcc66');
        });

        el.addEventListener('mouseleave', () => {
          if (this.selectedCode.toUpperCase() !== code.toUpperCase()) {
            const orig = el.getAttribute('data-original-fill') || '';
            if (orig) {
              el.setAttribute('fill', orig);
            } else {
              el.removeAttribute('fill');
            }
          }
        });

       
       el.addEventListener('click', () => {
  console.log('Clicked country code:', code);

  this.ngZone.run(() => {
    this.onCountryClicked(code);
  });
});

      });
    };

    
    setTimeout(initSvg, 200);
    objectEl.addEventListener('load', () => initSvg());
  }

  
  private clearAllHighlights(): void {
    const svgDoc = this.svgObject.nativeElement.contentDocument;
    if (!svgDoc) return;

    const paths = Array.from(svgDoc.getElementsByTagName('path'));
    paths.forEach((el) => {
      const orig = el.getAttribute('data-original-fill') || '';
      if (orig) {
        el.setAttribute('fill', orig);
      } else {
        el.removeAttribute('fill');
      }
    });
  }

  
  private highlightCountry(code: string): void {
    const svgDoc = this.svgObject.nativeElement.contentDocument;
    if (!svgDoc) return;

    const el = svgDoc.getElementById(code);
    if (el) {
      el.setAttribute('fill', '#ff9900');   
      el.setAttribute('stroke', '#333333'); 
    }
  }

  
  onCountryClicked(svgId: string): void {
    this.selectedCode = svgId;

    this.clearAllHighlights();
    this.highlightCountry(svgId);

    
    this.loadCountry(svgId.toLowerCase());
  }

  // ---------------- API CALL ----------------
  private loadCountry(apiCode: string): void {
    this.errorMessage = '';
    this.countryData = null;

    this.worldBankService.getCountryInfo(apiCode).subscribe({
      next: (response: any) => {
        
        const country = response?.[1]?.[0];
        if (country) {
          this.countryData = country;
        } else {
          this.errorMessage = 'No data returned for this country.';
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error loading country data.';
      },
    });
  }
}
