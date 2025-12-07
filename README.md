# 🌍 World Map Interactive Application

**Student ID:** 011256722  
**Course:** WGU D280  
**Project:** Interactive World Map with Angular & World Bank API  

---

## 📌 Project Description

This project is an Angular web application that displays an **interactive world map using SVG**. Users can **hover over and click on any country** to retrieve real-time country information from the **World Bank API**. The selected country's data is displayed dynamically in a two-column layout.

This project demonstrates the use of:

- Angular Components
- Angular Routing
- HTTPClient API integration
- SVG event binding
- Dynamic DOM updates

---

## ⚙️ System & Environment Configuration

Angular CLI: 20.3.11
Node.js: 22.15.0
Package Manager: npm 10.9.2
Operating System: Windows 10 (win32 x64)

Angular: 20.3.13
Packages:
@angular-devkit/architect  0.2003.11
@angular-devkit/core       20.3.11
@angular-devkit/schematics 20.3.11
@angular/build             20.3.11
@angular/cli               20.3.11
@schematics/angular        20.3.11
rxjs                        7.8.2
typescript                  5.9.3
zone.js                     0.15.1


---

## 🗂 Required Project Files Included

This repository includes the following required files:

- tsconfig.app.json  
- tsconfig.json  
- tsconfig.spec.json  
- angular.json  
- package.json  
- package-lock.json  
- README.md  
- src/assets/map-image.svg  

---

## 🗺 Features Implemented

### ✅ SVG World Map
- SVG world map loads from the assets folder.
- Hover effects highlight countries.
- Click events trigger API calls.

### ✅ World Bank API Integration
Each country displays the following **six required properties**:
- Country Name
- Capital City
- Region
- Income Level
- Latitude
- Longitude

### ✅ Angular Routing
- Default route automatically redirects to `/map`.

### ✅ Two-Column Layout
- Left column: Interactive SVG map.
- Right column: Dynamic country information panel.

### ✅ Event Binding
- Mouse hover and click events are bound directly to SVG `<path>` elements.

### ✅ HTTP Service
- WorldBankService retrieves country data using two-letter country codes.

---

## ▶️ Running the Application Locally

To run this project locally:

```bash
npm install
ng serve

Then open:

http://localhost:4200/map

## Part C - World Bank API Country Properties

For each country, the application retrieves the following six properties from the World Bank API:

1. Country name
2. Country capital
3. Country region
4. Income level
5. ISO two-letter country code
6. Population (or another property of my choice)

These values are displayed in the information column when a country is selected from the map.



## Part D - Angular Routing and Default Redirect

- The Angular router is configured in `app.routes.ts`.
- The default route ('') redirects to `/map` using `pathMatch: 'full'`.
- The main map view is handled by `MapComponent`.
- The application configuration in `app.config.ts` uses `provideRouter(routes)` so the redirect is active.
