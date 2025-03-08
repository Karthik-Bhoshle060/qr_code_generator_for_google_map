import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-generate-qr-code',
  templateUrl: './generate-qr-code.component.html',
  styleUrls: ['./generate-qr-code.component.scss'],
})
export class GenerateQrCodeComponent {
  qrForm: FormGroup;
  qrData: string | null = null;
  qrCodeDownloadLink: SafeUrl = '';

  constructor(private fb: FormBuilder) {
    this.qrForm = this.fb.group({
      latitude: ['', [Validators.required, this.dmsValidator]],
      longitude: ['', [Validators.required, this.dmsValidator]],
      mapUrl: [''],
    });
  }

  // DMS Validator using Regular Expression
  dmsValidator(control: any) {
    const dmsPattern = /^(\d{1,2})°(\d{1,2})'(\d{1,2}(?:\.\d+)?)?"([NSWE])$/;
    return dmsPattern.test(control.value) ? null : { invalidDMS: true };
  }

  // Convert DMS to Decimal Degrees
  dmsToDecimal(dms: string): number | null {
    const dmsPattern = /^(\d{1,2})°(\d{1,2})'(\d{1,2}(?:\.\d+)?)?"([NSWE])$/;
    const match = dms.match(dmsPattern);

    if (!match) return null;

    let degrees = parseFloat(match[1]);
    let minutes = parseFloat(match[2]);
    let seconds = parseFloat(match[3]);
    let direction = match[4];

    let decimal = degrees + minutes / 60 + seconds / 3600;

    if (direction === 'S' || direction === 'W') {
      decimal = -decimal;
    }

    return decimal;
  }
  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }
  generateQR() {
    const { latitude, longitude, mapUrl } = this.qrForm.value;

    if (latitude && longitude) {
      const latDecimal = this.dmsToDecimal(latitude);
      const lonDecimal = this.dmsToDecimal(longitude);

      if (latDecimal !== null && lonDecimal !== null) {
        this.qrData = `https://www.google.com/maps?q=${latDecimal},${lonDecimal}`;
      } else {
        alert(
          'Invalid DMS format. Please enter a valid Latitude and Longitude.'
        );
        this.qrData = null;
      }
    } else if (mapUrl) {
      this.qrData = mapUrl;
    } else {
      this.qrData = null;
      alert('Please enter either Latitude/Longitude or a Google Maps URL.');
    }
  }
}
