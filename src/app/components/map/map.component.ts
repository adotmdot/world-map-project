import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  NgZone
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  BaseChartDirective
} from 'ng2-charts';

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import { WorldBankService }
from '../../services/world-bank.service';

// ==============================
// CHART.JS REGISTRATION
// ==============================
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BaseChartDirective
  ],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {

  @ViewChild('svgObject', { static: false })
  svgObject!: ElementRef<HTMLObjectElement>;

  // ==============================
  // STATE
  // ==============================
  selectedCode = '';

  countryData: any = null;

  errorMessage = '';

  public lineChartData = {
    labels: ['2018', '2019', '2020', '2021', '2022'],
    datasets: [
      {
        data: [21, 22, 20, 24, 26],
        label: 'GDP Growth',

        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.2)',

        borderWidth: 4,

        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#38bdf8',
        pointRadius: 5,
        pointHoverRadius: 7,

        fill: true,
        tension: 0.4
      }
    ]
  };

  public lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
          font: {
            size: 14
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#94a3b8'
        },
        grid: {
          color: 'rgba(255,255,255,0.05)'
        }
      },
      y: {
        ticks: {
          color: '#94a3b8'
        },
        grid: {
          color: 'rgba(255,255,255,0.05)'
        }
      }
    }
  };

  isLoading = false;

  // ==============================
  // SEARCH
  // ==============================
  searchTerm = '';

  searchResults: any[] = [];

  // ==============================
  // GDP CHART
  // ==============================
  gdpChartLabels: string[] = [];

  gdpChartData = [
    {
      data: [] as number[],
      label: 'GDP (USD)'
    }
  ];

  gdpChartOptions = {
    responsive: true,

    plugins: {
      legend: {
        labels: {
          color: '#ffffff'
        }
      }
    },

    scales: {

      x: {
        ticks: {
          color: '#94a3b8'
        }
      },

      y: {
        ticks: {
          color: '#94a3b8'
        }
      }

    }
  };

  constructor(
    private worldBankService: WorldBankService,
    private ngZone: NgZone
  ) {}

  // ==============================
  // SVG INITIALIZATION
  // ==============================
  ngAfterViewInit(): void {
    const objectEl = this.svgObject.nativeElement;

    const initSvg = () => {
      const svgDoc = objectEl.contentDocument;

      if (!svgDoc) {
        console.warn('SVG not loaded yet');
        return;
      }

      const paths = Array.from(
        svgDoc.getElementsByTagName('path')
      );

      console.log('Total SVG paths:', paths.length);

      paths.forEach((el) => {
        const code = el.getAttribute('id') || '';

        if (!code) return;

        const originalFill =
          el.getAttribute('fill') || '';

        el.setAttribute(
          'data-original-fill',
          originalFill
        );

        el.style.cursor = 'pointer';

        // Hover
        el.addEventListener('mouseenter', () => {
          if (
            this.selectedCode.toUpperCase() !==
            code.toUpperCase()
          ) {
            el.setAttribute('fill', '#60a5fa');
          }
        });

        // Leave
        el.addEventListener('mouseleave', () => {
          if (
            this.selectedCode.toUpperCase() !==
            code.toUpperCase()
          ) {
            const orig =
              el.getAttribute(
                'data-original-fill'
              ) || '';

            if (orig) {
              el.setAttribute('fill', orig);
            } else {
              el.removeAttribute('fill');
            }
          }
        });

        // Click
        el.addEventListener('click', () => {
          this.ngZone.run(() => {
            this.onCountryClicked(code);
          });
        });
      });
    };

    // ONLY initialize AFTER svg fully loads
    objectEl.addEventListener('load', initSvg);

    // In case SVG already cached/loaded
    if (objectEl.contentDocument) {
      initSvg();
    }
  }

  // ==============================
  // SEARCH
  // ==============================
  onSearchChange(): void {

    this.errorMessage = '';

    const term =
      this.searchTerm.trim();

    if (term.length < 2) {

      this.searchResults = [];

      return;
    }

    this.worldBankService
      .searchCountries(term)
      .subscribe({

        next: (results: any[]) => {

          this.searchResults =
            results.slice(0, 6);

        },

        error: () => {

          this.searchResults = [];

        }

      });
  }

  // ==============================
  // SELECT SEARCH RESULT
  // ==============================
  selectSearchResult(country: any): void {

    const cca2 =
      country?.cca2;

    if (!cca2) {

      this.errorMessage =
        'Country code not found.';

      return;
    }

    this.searchTerm =
      country?.name?.common || '';

    this.searchResults = [];

    this.onCountryClicked(cca2);

    this.loadGDPChart(country.id.toLowerCase());
  }

  // ==============================
  // MAP HELPERS
  // ==============================
  private clearAllHighlights(): void {

    const svgDoc =
      this.svgObject.nativeElement
        .contentDocument;

    if (!svgDoc) return;

    const paths = Array.from(
      svgDoc.getElementsByTagName('path')
    );

    paths.forEach((el) => {

      const orig =
        el.getAttribute(
          'data-original-fill'
        ) || '';

      if (orig) {

        el.setAttribute(
          'fill',
          orig
        );

      } else {

        el.removeAttribute(
          'fill'
        );

      }

      el.removeAttribute('stroke');
    });
  }

  private highlightCountry(code: string): void {

    const svgDoc =
      this.svgObject.nativeElement
        .contentDocument;

    if (!svgDoc) return;

    const upperCode =
      code.toUpperCase();

    const lowerCode =
      code.toLowerCase();

    const el =
      svgDoc.getElementById(
        upperCode
      ) ||
      svgDoc.getElementById(
        lowerCode
      );

    if (el) {

      el.setAttribute(
        'fill',
        '#38bdf8'
      );

      el.setAttribute(
        'stroke',
        '#ffffff'
      );

      el.setAttribute(
        'stroke-width',
        '1.5'
      );
    }
  }

  // ==============================
  // COUNTRY CLICK
  // ==============================
  onCountryClicked(svgId: string): void {

    this.selectedCode = svgId;

    this.clearAllHighlights();

    this.highlightCountry(svgId);

    this.loadCountry(svgId.toLowerCase());

    this.loadGDPChart(svgId.toLowerCase());
  }

  // ==============================
  // LOAD COUNTRY DATA
  // ==============================
  private loadCountry(apiCode: string): void {

    this.errorMessage = '';

    this.countryData = null;

    this.isLoading = true;

    this.worldBankService
      .getCountryInfo(apiCode)
      .subscribe({

        next: (response: any) => {

          const country =
            response?.[1]?.[0];

          if (country) {

            this.countryData = country;

            // LOAD GDP CHART
            this.loadGDPData(apiCode);

          } else {

            this.errorMessage =
              'No data returned for this country.';

          }

          this.isLoading = false;
        },

        error: (err) => {

          console.error(err);

          this.errorMessage =
            'Error loading country data.';

          this.isLoading = false;
        },

      });
  }


  private loadGDPChart(apiCode: string): void {

    this.worldBankService
      .getCountryGDPHistory(apiCode)
      .subscribe({

        next: (response: any) => {

          const data = response?.[1];

          if (!data) return;

          // Remove empty values
          const filtered = data
            .filter((item: any) => item.value !== null)
            .reverse();

          const labels = filtered.map(
            (item: any) => item.date
          );

          const values = filtered.map(
            (item: any) =>
              Math.round(item.value / 1000000000000)
          );

          this.lineChartData = {
            labels,
            datasets: [
              {
                data: values,
                label: 'GDP (Trillions USD)',

                borderColor: '#38bdf8',
                backgroundColor:
                  'rgba(56, 189, 248, 0.2)',

                borderWidth: 4,

                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#38bdf8',

                pointRadius: 5,
                pointHoverRadius: 7,

                fill: true,
                tension: 0.4
              }
            ]
          };
        },

        error: (err) => {
          console.error(err);
        }
      });
  }

  // ==============================
  // GDP ANALYTICS
  // ==============================
  private loadGDPData(code: string): void {

    this.worldBankService
      .getCountryGDPHistory(code)
      .subscribe({

        next: (response: any) => {

          const records =
            response?.[1];

          if (!records) return;

          const filtered =
            records
              .filter(
                (item: any) =>
                  item.value !== null
              )
              .slice(0, 10)
              .reverse();

          this.gdpChartLabels =
            filtered.map(
              (item: any) =>
                item.date
            );

          this.gdpChartData = [
            {
              data: filtered.map(
                (item: any) =>
                  item.value
              ),

              label: 'GDP (USD)'
            }
          ];
        },

        error: (err: any) => {

          console.error(err);

        }

      });
  }
}